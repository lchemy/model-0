import { expect } from "chai";

import { Rule, RuleCheckFn } from "../../../../src/validation/definitions/rule";
import { each, model, object } from "../../../../src/validation/rules/nested";
import { Validator } from "../../../../src/validation/validator";

describe("validation rule nested", () => {
	describe("each", () => {
		it("should check arrays", () => {
			const check: RuleCheckFn<any> = each({
				name: "atLeast10",
				check: (value: any) => value >= 10 ? null : { atLeast10: true }
			}).check;

			return Promise.all([
				check([10, 11, 12, 13], null),
				check([10, 9, 11, 8], null)
			]).then(([res1, res2]) => {
				expect(res1).to.be.null;

				// the array values aren't undefined, they're empty
				// need to define it like this for deep equal
				const nested: any[] = [];
				nested[1] = {
					atLeast10: true
				};
				nested[3] = {
					atLeast10: true
				};
				expect(res2).to.deep.equal({
					each: true,
					nested: nested
				});
			});
		});
		it("should check objects", () => {
			const check: RuleCheckFn<any> = each([{
				name: "atLeast10",
				check: (value: any) => value >= 10 ? null : { atLeast10: true }
			}]).check;

			return Promise.all([
				check({
					a: 10,
					b: 11,
					c: 12,
					d: 13
				}, null),
				check({
					a: 10,
					b: 9,
					c: 11,
					d: 8
				}, null)
			]).then(([res1, res2]) => {
				expect(res1).to.be.null;
				expect(res2).to.deep.equal({
					each: true,
					nested: {
						b: {
							atLeast10: true
						},
						d: {
							atLeast10: true
						}
					}
				});
			});
		});
	});

	describe("object", () => {
		it("should check objects", () => {
			const atLeast10: Rule<any> = {
				name: "atLeast10",
				check: (value: any) => value >= 10 ? null : { atLeast10: true }
			};
			const atMost10: Rule<any> = {
				name: "atMost10",
				check: (value: any) => value <= 10 ? null : { atMost10: true }
			};
			const check: RuleCheckFn<any> = object({
				a: atLeast10,
				b: atMost10,
				c: [atLeast10],
				d: [atMost10]
			}).check;

			return Promise.all([
				check({
					a: 10,
					b: 9,
					c: 11,
					d: 8
				}, null),
				check({
					a: 9,
					b: 10,
					c: 8,
					d: 11
				}, null)
			]).then(([res1, res2]) => {
				expect(res1).to.be.null;
				expect(res2).to.deep.equal({
					object: true,
					nested: {
						a: {
							atLeast10: true
						},
						c: {
							atLeast10: true
						},
						d: {
							atMost10: true
						}
					}
				});
			});
		});
	});

	describe("model", () => {
		it("should check models with validator", () => {
			const atLeast10: Rule<any> = {
				name: "atLeast10",
				check: (value: any) => value >= 10 ? null : { atLeast10: true }
			};
			const validator: Validator<any> = new Validator<any>({
				a: atLeast10,
				b: [atLeast10]
			});
			const check: RuleCheckFn<any> = model(validator).check;

			return Promise.all([
				check({
					a: 10,
					b: 11
				}, null),
				check({
					a: 10,
					b: 9
				}, null)
			]).then(([res1, res2]) => {
				expect(res1).to.be.null;
				expect(res2).to.deep.equal({
					model: true,
					nested: {
						b: {
							atLeast10: true
						}
					}
				});
			});
		});
		it("should check models with validator ref", () => {
			const atLeast10: Rule<any> = {
				name: "atLeast10",
				check: (value: any) => value >= 10 ? null : { atLeast10: true }
			};
			const validator: Validator<any> = new Validator<any>({
				a: atLeast10,
				b: [atLeast10]
			});
			const check: RuleCheckFn<any> = model(() => validator).check;

			return Promise.all([
				check({
					a: 10,
					b: 11
				}, null),
				check({
					a: 10,
					b: 9
				}, null)
			]).then(([res1, res2]) => {
				expect(res1).to.be.null;
				expect(res2).to.deep.equal({
					model: true,
					nested: {
						b: {
							atLeast10: true
						}
					}
				});
			});
		});
		it("should check models with validator schema", () => {
			const atLeast10: Rule<any> = {
				name: "atLeast10",
				check: (value: any) => value >= 10 ? null : { atLeast10: true }
			};
			const check: RuleCheckFn<any> = model({
				a: atLeast10,
				b: [atLeast10]
			}).check;

			return Promise.all([
				check({
					a: 10,
					b: 11
				}, null),
				check({
					a: 10,
					b: 9
				}, null)
			]).then(([res1, res2]) => {
				expect(res1).to.be.null;
				expect(res2).to.deep.equal({
					model: true,
					nested: {
						b: {
							atLeast10: true
						}
					}
				});
			});
		});
		it("should check models with partial keys", () => {
			const atLeast10: Rule<any> = {
				name: "atLeast10",
				check: (value: any) => value >= 10 ? null : { atLeast10: true }
			};
			const validator: Validator<any> = new Validator<any>({
				a: atLeast10,
				b: [atLeast10],
				c: atLeast10
			});
			const check: RuleCheckFn<any> = model(validator, ["a", "b"]).check;

			return Promise.all([
				check({
					a: 10,
					b: 11,
					c: 9
				}, null),
				check({
					a: 10,
					b: 9,
					c: 8
				}, null)
			]).then(([res1, res2]) => {
				expect(res1).to.be.null;
				expect(res2).to.deep.equal({
					model: true,
					nested: {
						b: {
							atLeast10: true
						}
					}
				});
			});
		});
		it("should throw error for invalid deref", () => {
			const check: RuleCheckFn<any> = model(Number.NaN as any).check;
			expect(() => {
				check(null, null);
			}).to.throw("Invalid validator reference");
		});
	});
});
