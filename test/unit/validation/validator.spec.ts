import { expect } from "chai";

import * as rules from "../../../src/validation/rules";
import { Validator } from "../../../src/validation/validator";

describe("validation validator", () => {
	it("should validate", () => {
		let personValidator: Validator<any> = new Validator({
			id: [
				rules.isNumber()
			],
			name: [
				rules.required(),
				rules.isString()
			],
			parent: rules.model(() => personValidator)
		});

		return Promise.all([
			personValidator.validate({
				id: 1,
				name: "name"
			}),
			personValidator.validate({
				id: "nan",
				name: 0,
				parent: {}
			}),
			personValidator.validate({
				id: 2,
				name: "child",
				parent: {
					id: 1,
					name: "parent",
					parent: {}
				}
			})
		]).then(([res1, res2, res3]) => {
			expect(res1.isValid).to.be.true;
			expect(res1.errors).to.be.null;

			expect(res2.isValid).to.be.false;
			expect(res2.errors).to.deep.equal({
				id: {
					isNumber: true
				},
				name: {
					isString: true
				},
				parent: {
					model: true,
					nested: {
						name: {
							required: true
						}
					}
				}
			});

			expect(res3.isValid).to.be.false;
			expect(res3.errors).to.deep.equal({
				parent: {
					model: true,
					nested: {
						parent: {
							model: true,
							nested: {
								name: {
									required: true
								}
							}
						}
					}
				}
			});
		});
	});
});
