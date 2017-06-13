import { expect } from "chai";

import { RuleCheckFn } from "../../../../src/validation/definitions/rule";
import { isAlphanumeric, isEmail, matches } from "../../../../src/validation/rules/string";

describe("validation rule string", () => {
	describe("matches", () => {
		it("should check string for pattern", () => {
			const regexp: RegExp = /^abc/i,
				check: RuleCheckFn<any> = matches(regexp).check;
			expect(check("abc", null)).to.be.null;
			expect(check(0, null)).to.deep.equal({
				matches: {
					requiredPattern: regexp,
					actualValue: 0
				}
			});
		});
	});

	describe("isEmail", () => {
		it("should check string", () => {
			const check: RuleCheckFn<any> = isEmail().check;
			expect(check("a@a.com", null)).to.be.null;
			expect(check("not-an.email", null)).to.deep.equal({
				isEmail: true
			});
			expect(check(0, null)).to.deep.equal({
				isEmail: true
			});
		});
	});

	describe("isAlphanumeric", () => {
		it("should check string is alphanumeric", () => {
			const check: RuleCheckFn<any> = isAlphanumeric().check;
			expect(check("ok", null)).to.be.null;
			expect(check("okAY", null)).to.be.null;
			expect(check("o0123456789k", null)).to.be.null;
			expect(check("not-okay", null)).to.deep.equal({
				isAlphanumeric: true
			});
			expect(check("not/okay", null)).to.deep.equal({
				isAlphanumeric: true
			});
			expect(check("not@okay", null)).to.deep.equal({
				isAlphanumeric: true
			});
		});
	});
});
