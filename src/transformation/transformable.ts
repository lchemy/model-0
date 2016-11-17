import { Model } from "../model";

export interface Transformable<M extends Model, J> {
	toJSON(this: Transformable<M, J>): J;
}

export interface TransformableStatic<M extends Model, J> {
	new(): M;
	fromJSON(json: J): M;
}
