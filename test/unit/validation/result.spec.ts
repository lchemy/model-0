import { expect } from "chai";

import { ValidationResult } from "../../../src/validation/result";

describe("validation result", () => {
	it("should initialize properly", () => {
		const result1: ValidationResult = new ValidationResult(null, {
			a: 1
		});
		expect(result1.isValid).to.be.true;

		const result2: ValidationResult = new ValidationResult({
			a: true
		}, {
			a: 1
		});
		expect(result2.isValid).to.be.false;
	});

	it("should get nested errors", () => {
		const result: ValidationResult = new ValidationResult({
			a: {
				object: true,
				nested: {
					b: {
						each: true,
						nested: [{
							error: true
						}, {
							error : true
						}]
					}
				}
			},
			c: {
				model: true,
				nested: {
					d: {
						each: true,
						nested: {
							e: {
								error: true
							},
							f: {
								error: true
							}
						}
					}
				}
			}
		}, {
			a: {
				b: [1, 2, 3],
				x: 4
			},
			c: {
				d: {
					e: 1,
					f: 2,
					y: 3
				},
				z: {
					a: 1
				}
			},
			m: {
				n: {
					o: null
				}
			}
		});

		expect(result.isValid).to.be.false;

		const res1: ValidationResult | undefined = result.get("a");
		expect(res1).to.not.be.undefined;
		expect(res1!.isValid).to.be.false;
		expect(res1!.errors!["object"]).to.be.true;

		const res2: ValidationResult | undefined = result.get("a.b");
		expect(res2).to.not.be.undefined;
		expect(res2!.isValid).to.be.false;
		expect(res2!.errors!["each"]).to.be.true;

		const res3: ValidationResult | undefined = result.get("a.x");
		expect(res3).to.not.be.undefined;
		expect(res3!.isValid).to.be.true;
		expect(res3!.errors).to.be.null;

		const res4: ValidationResult | undefined = result.get("a.b[0]");
		expect(res4).to.not.be.undefined;
		expect(res4!.isValid).to.be.false;
		expect(res4!.errors!["error"]).to.be.true;

		const res5: ValidationResult | undefined = result.get("a.b[1].x");
		expect(res5).to.be.undefined;

		const res6: ValidationResult | undefined = result.get("c");
		expect(res6).to.not.be.undefined;
		expect(res6!.isValid).to.be.false;
		expect(res6!.errors!["model"]).to.be.true;

		const res7: ValidationResult | undefined = result.get("c.d");
		expect(res7).to.not.be.undefined;
		expect(res7!.isValid).to.be.false;
		expect(res7!.errors!["each"]).to.be.true;

		const res8: ValidationResult | undefined = result.get("c.d.e");
		expect(res8).to.not.be.undefined;
		expect(res8!.isValid).to.be.false;
		expect(res8!.errors!["error"]).to.be.true;

		const res9: ValidationResult | undefined = result.get("c.d.y");
		expect(res9).to.not.be.undefined;
		expect(res9!.isValid).to.be.true;
		expect(res9!.errors).to.be.null;

		const res10: ValidationResult | undefined = result.get("c.z");
		expect(res10).to.not.be.undefined;
		expect(res10!.isValid).to.be.true;
		expect(res10!.errors).to.be.null;

		const res11: ValidationResult | undefined = result.get("c.z.a");
		expect(res11).to.not.be.undefined;
		expect(res11!.isValid).to.be.true;
		expect(res11!.errors).to.be.null;

		const res12: ValidationResult | undefined = result.get("b");
		expect(res12).to.not.be.undefined;
		expect(res12!.isValid).to.be.true;
		expect(res12!.errors).to.be.null;

		const res13: ValidationResult | undefined = result.get("m");
		expect(res13).to.not.be.undefined;
		expect(res13!.isValid).to.be.true;
		expect(res13!.errors).to.be.null;

		const res14: ValidationResult | undefined = res13!.get("n.o");
		expect(res14).to.not.be.undefined;
		expect(res14!.isValid).to.be.true;
		expect(res14!.errors).to.be.null;

		const res15: ValidationResult | undefined = res14!.get("p");
		expect(res15).to.be.undefined;

		const res16: ValidationResult | undefined =  result.get("a");
		expect(res1).to.equal(res16);
	});
});
