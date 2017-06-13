import { expect } from "chai";

import { RuleCheckFn } from "../../../../src/validation/definitions/rule";
import { isArray, isBoolean, isDate, isInt, isNumber, isObject, isString } from "../../../../src/validation/rules/types";

describe("validation rule types", () => {
	describe("isArray", () => {
		it("should check array", () => {
			const check: RuleCheckFn<any> = isArray().check;
			expect(check([1, 2, 3], null)).to.be.null;
			expect(check(0, null)).to.deep.equal({
				isArray: true
			});
		});
	});

	describe("isBoolean", () => {
		it("should check boolean", () => {
			const check: RuleCheckFn<any> = isBoolean().check;
			expect(check(true, null)).to.be.null;
			expect(check(0, null)).to.deep.equal({
				isBoolean: true
			});
		});
	});

	describe("isDate", () => {
		it("should check date", () => {
			const check: RuleCheckFn<any> = isDate().check;
			expect(check(new Date(), null)).to.be.null;
			expect(check(0, null)).to.deep.equal({
				isDate: true
			});
		});
	});

	describe("isInt", () => {
		it("should check int", () => {
			const check: RuleCheckFn<any> = isInt().check;
			expect(check(1, null)).to.be.null;
			expect(check(Number.NaN, null)).to.deep.equal({
				isInt: true
			});
			expect(check(1.234, null)).to.deep.equal({
				isInt: true
			});
			expect(check(false, null)).to.deep.equal({
				isInt: true
			});
		});
	});

	describe("isNumber", () => {
		it("should check number", () => {
			const check: RuleCheckFn<any> = isNumber().check;
			expect(check(1, null)).to.be.null;
			expect(check(1.234, null)).to.be.null;
			expect(check(Number.NaN, null)).to.deep.equal({
				isNumber: true
			});
			expect(check(false, null)).to.deep.equal({
				isNumber: true
			});
		});
	});

	describe("isObject", () => {
		it("should check object", () => {
			const check: RuleCheckFn<any> = isObject().check;
			expect(check({}, null)).to.be.null;
			expect(check([], null)).to.deep.equal({
				isObject: true
			});
			expect(check(0, null)).to.deep.equal({
				isObject: true
			});
		});
	});

	describe("isString", () => {
		it("should check string", () => {
			const check: RuleCheckFn<any> = isString().check;
			expect(check("", null)).to.be.null;
			expect(check(0, null)).to.deep.equal({
				isString: true
			});
		});
	});
});
