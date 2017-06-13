import { expect } from "chai";

import { Rules, checkRules } from "../../../../src/validation/definitions/rule";

describe("validation rule definition", () => {
	describe("checkRules", () => {
		it("should run serially and merge results", () => {
			const rules: Rules<any> = [{
				name: "error1",
				check: (value) => value >= 10 ? null : { error: 1 }
			}, {
				name: "error2",
				check: (value) => {
					return new Promise<any>((resolve) => {
						setTimeout(() => {
							resolve(value >= 9 ? null : { error: 2 });
						}, 100);
					});
				}
			}, {
				name: "error3",
				check: (value) => {
					return new Promise<any>((resolve) => {
						setTimeout(() => {
							resolve(value >= 8 ? null : { error: 3 });
						}, 10);
					});
				}
			}, {
				name: "error4",
				check: (value) => value >= 7 ? null : { merge: 4 }
			}];

			return Promise.all([
				checkRules(rules, 10, null as any),
				checkRules(rules, 9, null as any),
				checkRules(rules, 8, null as any),
				checkRules(rules, 7, null as any),
				checkRules(rules, 6, null as any)
			]).then(([res1, res2, res3, res4, res5]) => {
				expect(res1).to.be.null;
				expect(res2).to.deep.equal({
					error: 1
				});
				expect(res3).to.deep.equal({
					error: 2
				});
				expect(res4).to.deep.equal({
					error: 3
				});
				expect(res5).to.deep.equal({
					error: 3,
					merge: 4
				});
			});
		});
		it("should handle checkNull", () => {
			const rules: Rules<any> = [{
				name: "error1",
				check: (value) => {
					if (value == null) {
						return {
							error1: "null"
						};
					}
					return {
						error1: "not null"
					};
				},
				checkNull: true
			}, {
				name: "error2",
				check: (value) => {
					if (value == null) {
						return {
							error2: "null"
						};
					}
					return {
						error2: "not null"
					};
				}
			}];

			return Promise.all([
				checkRules(rules, null, null as any),
				checkRules(rules, 1, null as any)
			]).then(([res1, res2]) => {
				expect(res1).to.deep.equal({
					error1: "null"
				});
				expect(res2).to.deep.equal({
					error1: "not null",
					error2: "not null"
				});
			});
		});
	});
});
