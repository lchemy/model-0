import { expect } from "chai";

import { RuleCheckFn } from "../../../../src/validation/definitions/rule";
import { checkIf, checkSwitch, required } from "../../../../src/validation/rules/conditional";

describe("validation rule conditionals", () => {
	describe("required", () => {
		it("should check if not null", () => {
			let check: RuleCheckFn<any> = required().check;

			expect(check("non-null", null)).to.be.null;
			expect(check(null, null)).to.deep.equal({
				required: true
			});
		});
	});
	describe("checkIf", () => {
		it("should check rules only if condition is matched", () => {
			let check: RuleCheckFn<any> = checkIf((value) => {
				return value < "g";
			}, [{
				name: "fail",
				check: () => {
					return {
						fail: true
					};
				}
			}]).check;

			return Promise.all([
				check("not matched", null),
				check("definitely matched", null)
			]).then(([res1, res2]) => {
				expect(res1).to.be.null;
				expect(res2).to.deep.equal({
					fail: true
				});
			});
		});
		it("should check elseRules only if condition is not matched", () => {
			let check: RuleCheckFn<any> = checkIf((value) => {
				return value < "g";
			}, [{
				name: "fail",
				check: () => {
					return {
						fail: true
					};
				}
			}], [{
				name: "failElse",
				check: () => {
					return {
						failElse: true
					};
				},
				checkNull: true
			}]).check;

			return Promise.all([
				check("not matched", null),
				check("definitely matched", null),
				check(null, null)
			]).then(([res1, res2, res3]) => {
				expect(res1).to.deep.equal({
					failElse: true
				});
				expect(res2).to.deep.equal({
					fail: true
				});
				expect(res3).to.deep.equal({
					failElse: true
				});
			});
		});
		it("should check handle single rule definition", () => {
			let check: RuleCheckFn<any> = checkIf((value) => {
				return value < "g";
			}, {
				name: "fail",
				check: () => {
					return {
						fail: true
					};
				}
			}, {
				name: "failElse",
				check: () => {
					return {
						failElse: true
					};
				}
			}).check;

			return Promise.all([
				check("not matched", null),
				check("definitely matched", null)
			]).then(([res1, res2]) => {
				expect(res1).to.deep.equal({
					failElse: true
				});
				expect(res2).to.deep.equal({
					fail: true
				});
			});
		});
	});

	describe("checkSwitch", () => {
		it("should check only if mapped to a branch", () => {
			let check: RuleCheckFn<any> = checkSwitch((value) => {
				switch (value) {
					case 1:
						return "a";
					case 2:
						return "b";
					default:
						return "default";
				}
			}, {
				a: {
					name: "aFail",
					check: (value) => {
						return {
							aFail: true
						};
					}
				},
				default: [{
					name: "defaultFail",
					check: (value) => {
						return {
							defaultFail: true
						};
					},
					checkNull: true
				}]
			}).check;

			return Promise.all([
				check(2, null),
				check(1, null),
				check("default branch", null),
				check(null, null)
			]).then(([res1, res2, res3, res4]) => {
				expect(res1).to.be.null;
				expect(res2).to.deep.equal({
					aFail: true
				});
				expect(res3).to.deep.equal({
					defaultFail: true
				});
				expect(res4).to.deep.equal({
					defaultFail: true
				});
			});
		});
	});
});
