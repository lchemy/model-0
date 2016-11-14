import { expect } from "chai";

import { ValidatorSchema, normalizeSchema } from "../../../../src/validation/definitions/schema";
import { Validator } from "../../../../src/validation/validator";

describe("validation schema", () => {
	describe("normalizeSchema", () => {
		it("should handle rule objects", () => {
			let schema: ValidatorSchema<any> = normalizeSchema({
				a: {
					name: "a",
					check: () => null
				}
			});
			expect((schema as any).a).to.be.instanceof(Array);
		});
		it("should handle rule arrays", () => {
			let schema: ValidatorSchema<any> = normalizeSchema({
				a: [{
					name: "a",
					check: () => null
				}]
			});
			expect((schema as any).a).to.be.instanceof(Array);
		});
		it("should handle nested schemas", () => {
			let schema: ValidatorSchema<any> = normalizeSchema({
				a: {
					b: {
						name: "b",
						check: () => null
					}
				}
			});
			expect((schema as any).a).to.be.instanceof(Array);
			expect((schema as any).a[0].name).to.equal("object");
		});
		it("should handle nested validators", () => {
			let validator: Validator<any> = new Validator({
				b: {
					name: "b",
					check: () => null
				}
			});
			let schema: ValidatorSchema<any> = normalizeSchema({
				a: validator
			});
			expect((schema as any).a).to.be.instanceof(Array);
			expect((schema as any).a[0].name).to.equal("model");
		});
		it("should throw error for invalid schema value", () => {
			expect(() => {
				normalizeSchema({
					a: Number.NaN as any
				});
			}).to.throw("Invalid validator schema value");
		});
	});
});
