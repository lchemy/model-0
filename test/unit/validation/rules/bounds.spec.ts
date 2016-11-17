import { expect } from "chai";

import { RuleCheckFn } from "../../../../src/validation/definitions/rule";
import { isIn, max, maxDate, maxLength, maxSize, min, minDate, minLength, minSize } from "../../../../src/validation/rules/bounds";

describe("validation rule bounds", () => {
	describe("min", () => {
		it("should check numbers", () => {
			let check: RuleCheckFn<any> = min(10).check;
			expect(check(10, null)).to.be.null;
			expect(check(9, null)).to.deep.equal({
				min: {
					requiredValue: 10,
					actualValue: 9
				}
			});
		});
	});

	describe("max", () => {
		it("should check numbers", () => {
			let check: RuleCheckFn<any> = max(10).check;
			expect(check(10, null)).to.be.null;
			expect(check(11, null)).to.deep.equal({
				max: {
					requiredValue: 10,
					actualValue: 11
				}
			});
		});
	});

	describe("minDate", () => {
		it("should check dates", () => {
			let testDate: Date = new Date(),
				beforeDate: Date = new Date(testDate.getTime() - 60 * 1000),
				afterDate: Date = new Date(testDate.getTime() + 60 * 1000);

			let check: RuleCheckFn<any> = minDate(testDate).check;
			expect(check(testDate, null)).to.be.null;
			expect(check(afterDate, null)).to.be.null;
			expect(check(beforeDate, null)).to.deep.equal({
				minDate: {
					requiredValue: testDate,
					actualValue: beforeDate
				}
			});
		});
	});

	describe("maxDate", () => {
		it("should check dates", () => {
			let testDate: Date = new Date(),
				beforeDate: Date = new Date(testDate.getTime() - 60 * 1000),
				afterDate: Date = new Date(testDate.getTime() + 60 * 1000);

			let check: RuleCheckFn<any> = maxDate(testDate).check;
			expect(check(testDate, null)).to.be.null;
			expect(check(beforeDate, null)).to.be.null;
			expect(check(afterDate, null)).to.deep.equal({
				maxDate: {
					requiredValue: testDate,
					actualValue: afterDate
				}
			});
		});
	});

	describe("minLength", () => {
		it("should check strings", () => {
			let check: RuleCheckFn<any> = minLength(2).check;
			expect(check("123", null)).to.be.null;
			expect(check("1", null)).to.deep.equal({
				minlength: {
					requiredLength: 2,
					actualLength: 1
				}
			});
		});
	});

	describe("maxLength", () => {
		it("should check strings", () => {
			let check: RuleCheckFn<any> = maxLength(2).check;
			expect(check("12", null)).to.be.null;
			expect(check("123", null)).to.deep.equal({
				maxlength: {
					requiredLength: 2,
					actualLength: 3
				}
			});
		});
	});

	describe("minSize", () => {
		it("should check arrays", () => {
			let check: RuleCheckFn<any> = minSize(2).check;
			expect(check([1, 2, 3], null)).to.be.null;
			expect(check([1], null)).to.deep.equal({
				minSize: {
					requiredSize: 2,
					actualSize: 1
				}
			});
		});

		it("should check objects", () => {
			let check: RuleCheckFn<any> = minSize(2).check;
			expect(check({ a: 1, b: 2, c: 3 }, null)).to.be.null;
			expect(check({ a: 1 }, null)).to.deep.equal({
				minSize: {
					requiredSize: 2,
					actualSize: 1
				}
			});
		});
	});

	describe("maxSize", () => {
		it("should check arrays", () => {
			let check: RuleCheckFn<any> = maxSize(2).check;
			expect(check([1, 2], null)).to.be.null;
			expect(check([1, 2, 3], null)).to.deep.equal({
				maxSize: {
					requiredSize: 2,
					actualSize: 3
				}
			});
		});

		it("should check objects", () => {
			let check: RuleCheckFn<any> = maxSize(2).check;
			expect(check({ a: 1, b: 2 }, null)).to.be.null;
			expect(check({ a: 1, b: 2, c: 3 }, null)).to.deep.equal({
				maxSize: {
					requiredSize: 2,
					actualSize: 3
				}
			});
		});
	});

	describe("isIn", () => {
		it("should check against arrays", () => {
			let check: RuleCheckFn<any> = isIn([1, 2, 3]).check;
			expect(check(1, null)).to.be.null;
			expect(check(0, null)).to.deep.equal({
				isIn: true
			});
		});
		it("should check against sets", () => {
			let check: RuleCheckFn<any> = isIn(new Set([1, 2, 3])).check;
			expect(check(1, null)).to.be.null;
			expect(check(0, null)).to.deep.equal({
				isIn: true
			});
		});
		it("should check against enums", () => {
			enum TestEnum {
				a = 3,
				b,
				c = 9
			}

			let check: RuleCheckFn<any> = isIn(TestEnum).check;
			expect(check(3, null)).to.be.null;
			expect(check(TestEnum.b, null)).to.be.null;
			expect(check(-1, null)).to.deep.equal({
				isIn: true
			});
		});
	});
});
