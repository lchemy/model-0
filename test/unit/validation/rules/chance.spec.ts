import { expect } from "chai";

import { RuleCheckFn } from "../../../../src/validation/definitions/rule";
import { snakeEyes } from "../../../../src/validation/rules/chance";

describe("validation rule chance", () => {
	describe("snakeEyes", () => {
		it("should definitely pass when properly constrained", () => {
			let check: RuleCheckFn<any> = snakeEyes(100, 1, 1).check;
			expect(check(null, null)).to.be.null;
		});
		it("probably fails otherwise", () => {
			let check: RuleCheckFn<any> = snakeEyes(100, 100).check;
			expect(check(null, null)).to.not.be.null;
		});
	});
});
