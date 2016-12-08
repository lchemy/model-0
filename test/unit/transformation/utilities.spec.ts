import { expect } from "chai";

import { Json, Transformable, fromJSON, get, toJSON } from "../../../src/transformation";

describe("transformable utilities", () => {
	it("should deep get", () => {
		let obj: any = {
			a: [{
				b: {
					c: [{
						d: 1
					}]
				}
			}],
			b: "not an object"
		};

		expect(get(obj, "a[0].b.c[0].d")).to.eq(1);
		expect(get(obj, ["a", 0, "b", "c", 0, "d"])).to.eq(1);
		expect(get(obj, "a.0.b.c.0.d")).to.eq(1);
		expect(get(obj, "c")).to.be.undefined;
		expect(get(obj, "b.toString")).to.be.undefined;
	});

	it("should use default if deep get fails to find anything", () => {
		let obj: any = {
			a: [{
				b: {
					c: [{
						d: 1
					}]
				}
			}],
			b: "not an object"
		};
		expect(get(obj, "c", "default")).to.eq("default");
		expect(get(obj, "b.toString", 1)).to.eq(1);
	});

	it("should transform to json", () => {
		expect(toJSON(1)).to.eq(1);
		expect(toJSON("string")).to.eq("string");

		expect(toJSON({
			a: 1
		})).to.deep.eq({
			a: 1
		});

		expect(toJSON([1])).to.deep.eq([1]);

		expect(toJSON(null)).to.be.null;
		expect(toJSON(undefined)).to.be.undefined;

		class Test extends Transformable<Test> {
			a: number;
			b?: number;
		}
		let test: Test = new Test();
		test.a = 1;
		expect(toJSON(test)).to.deep.eq({
			a: 1
		});

		expect(test.toJSON()).to.deep.eq({
			a: 1
		});
	});

	it("should transform from json", () => {
		class Test extends Transformable<Test> {
			static fromJSON(json: Json<Test>): Test {
				let model: Test = new Test();
				model.a = json.a!;
				model.b = json.b!;
				return model;
			}

			a: number;
			b?: number;
		}

		expect(fromJSON(Test, null)).to.be.undefined;
		expect(fromJSON(Test, undefined)).to.be.undefined;

		let model: Test = fromJSON(Test, {
			a: 1
		});
		expect(model).to.be.instanceof(Test);
		expect(toJSON(fromJSON(Test, model))).to.deep.eq({
			a: 1
		});
		expect(toJSON(Test.fromJSON(model))).to.deep.eq({
			a: 1
		});

		let models: Test[] = fromJSON(Test, [{
			a: 2,
			b: 1
		}, {
			a: 3
		}]);
		expect(models).to.have.length(2);
		models.forEach((m) => {
			expect(m).to.be.instanceof(Test);
		});
		expect(toJSON(fromJSON(Test, models))).to.deep.eq([{
			a: 2,
			b: 1
		}, {
			a: 3
		}]);
	});

	it("should throw error if transform from json is not defined", () => {
		class Test extends Transformable<Test> {
			a: number;
			b?: number;
		}

		expect(() => {
			fromJSON(Test, {});
		}).to.throw("Unimplemented");

		expect(() => {
			Test.fromJSON({});
		}).to.throw("Unimplemented");
	});
});
