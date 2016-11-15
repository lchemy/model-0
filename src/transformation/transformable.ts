import { Model } from "../model";

export interface Transformable<M extends Model> {
	toJSON(this: M): Object;
}

export interface TransformableStatic<M extends Model> {
	new(): M;
	fromJSON(json: Object): M;
}
