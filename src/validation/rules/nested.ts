import { Model } from "../../model";
import { Rule, RuleCheckResult, checkRules } from "../definitions/rule";
import { ValidatorRawSchema, ValidatorSchema, normalizeSchema } from "../definitions/schema";
import { Validator } from "../validator";

export function each(rulesInit: Rule<Model> | Rule<Model>[]): Rule<Model> {
	let rules: Rule<Model>[] = Array.isArray(rulesInit) ? rulesInit : [rulesInit];

	return {
		name: "each",
		check: (values: any[] | { [key: string]: any }, model: Model) => {
			let result: RuleCheckResult[] = [],
				isValid: boolean = true,
				prev: Promise<any> = Promise.resolve();

			let isObject: boolean = !Array.isArray(values),
				keys: string[] | undefined;

			if (isObject) {
				keys = Object.keys(values);
				values = keys.map((key) => values[key]);
			}

			(values as any[]).forEach((value, i) => {
				prev = prev.then(() => {
					return checkRules(rules, value, model);
				}).then((ruleResult) => {
					if (ruleResult == null) {
						return;
					}
					isValid = false;
					result[i] = ruleResult;
				});
			});

			return prev.then(() => {
				if (isValid) {
					return null;
				}

				let nested: RuleCheckResult[] | { [key: string]: RuleCheckResult };
				if (isObject) {
					nested = keys!.reduce((memo, key, i) => {
						if (result[i] != null) {
							memo[key] = result[i];
						}
						return memo;
					}, {});
				} else {
					nested = result;
				}

				return {
					each: true,
					nested
				};
			});
		}
	};
}

export function object(rawSchema: ValidatorRawSchema<Model>): Rule<Model> {
	let schema: ValidatorSchema<Model> = normalizeSchema(rawSchema);

	return {
		name: "object",
		check: (value: { [key: string]: any }, model: Model) => {
			return checkSchema(schema, value, model).then((nested) => {
				return nested == null ? null : {
					object: true,
					nested
				};
			});
		}
	};
}

export type ValidatorRef<M extends Model> = Validator<M> | (() => Validator<M>) | ValidatorRawSchema<M>;
export function model<M extends Model>(validatorRef: ValidatorRef<M>, keys?: string[]): Rule<Model> {
	let schema: ValidatorSchema<M>;

	return {
		name: "model",
		check: (value: M) => {
			if (schema == null) {
				schema = derefValidatorRef(validatorRef);
				if (keys != null) {
					schema = keys.reduce((memo, key) => {
						memo[key] = schema[key];
						return memo;
					}, {});
				}
			}

			return checkSchema(schema, value, value).then((nested) => {
				return nested == null ? null : {
					model: true,
					nested
				};
			});
		}
	};
}

function checkSchema(schema: ValidatorSchema<Model>, value: { [key: string]: any }, model: Model): Promise<RuleCheckResult> {
	let nested: { [key: string]: RuleCheckResult } = {},
		isValid: boolean = true,
		prev: Promise<any> = Promise.resolve();

	Object.keys(schema).forEach((key) => {
		prev = prev.then(() => {
			return checkRules(schema[key], value[key], model);
		}).then((ruleResult) => {
			if (ruleResult == null) {
				return;
			}
			isValid = false;
			nested[key] = ruleResult;
		});
	});

	return prev.then(() => isValid ? null : nested);
}

function derefValidatorRef<M extends Model>(validatorRef: ValidatorRef<M>): ValidatorSchema<M> {
	if (typeof validatorRef === "function") {
		return validatorRef().schema;
	}
	if (validatorRef instanceof Validator) {
		return validatorRef.schema;
	}
	if (typeof validatorRef === "object") {
		return normalizeSchema(validatorRef as ValidatorRawSchema<M>);
	}

	throw new Error("Invalid validator reference");
}
