import { Model } from "../model";
import { Rule } from "./definitions/rule";
import { ValidatorRawSchema, ValidatorSchema, normalizeSchema } from "./definitions/schema";
import { ValidationResult } from "./result";
import { model } from "./rules/nested";

export class Validator<M extends Model> {
	schema: ValidatorSchema<M>;
	private rule: Rule<M>;

	constructor(schema: ValidatorRawSchema<M>) {
		this.schema = normalizeSchema(schema);
		this.rule = model(this);
	}

	validate(model: M): Promise<ValidationResult> {
		return Promise.resolve(this.rule.check(model, model)).then((result) => {
			return new ValidationResult(result != null ? (result as any).nested : null, model);
		});
	}
}
