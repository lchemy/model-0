import { Model } from "../model";
import { Json } from "./json";
import { toJSON } from "./utilities";

export abstract class Transformable<M extends Transformable<M>> extends Model {
	static fromJSON<M extends Transformable<M>>(_: Json<M>): M {
		throw new Error("Unimplemented");
	}

	toJSON(this: M): Json<M> {
		return toJSON(this);
	}
}

export interface TransformableStatic<M extends Transformable<M>> {
	new(): M;
	fromJSON(json: Json<M>): M;
}
