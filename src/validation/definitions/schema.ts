import { Model } from "../../model";
import { model, object } from "../rules";
import { Validator } from "../validator";
import { Rule, isRule } from "./rule";

export interface ValidatorSchema<M extends Model> {
	[key: string]: Rule<M>[];
}

export type ValidatorRawSchemaValue<M extends Model> = Rule<M> | Rule<M>[] | ValidatorRawSchema<M> | Validator<any>;
export interface ValidatorRawSchema<M extends Model> {
	[key: string]: ValidatorRawSchemaValue<M>;
}

export function normalizeSchema(schema: ValidatorRawSchema<Model>): ValidatorSchema<Model> {
	return Object.keys(schema).reduce((memo, key) => {
		memo[key] = normalizeSchemaValue(schema[key]);
		return memo;
	}, {});
}

function normalizeSchemaValue(value: ValidatorRawSchemaValue<Model>): Rule<Model>[] {
	if (Array.isArray(value)) {
		return value.map(normalizeSchemaValueMapper);
	}

	return [
		normalizeSchemaValueMapper(value)
	];
}

function normalizeSchemaValueMapper(value: ValidatorRawSchemaValue<Model>): Rule<Model> {
	if (typeof value === "function" || isRule(value)) {
		return value;
	}
	if (value instanceof Validator) {
		return model(value);
	}
	if (typeof value === "object" && !Array.isArray(value)) {
		return object(value as ValidatorRawSchema<Model>);
	}

	throw new Error("Invalid validator schema value");
}
