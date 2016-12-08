import { Model } from "../model";
import { Json } from "./json";
import { Transformable, TransformableStatic } from "./transformable";

export function get<T>(json: Object, field: string | Array<string | number>, defaultValue: T | undefined = undefined): T | undefined {
	let path: Array<string | number> = Array.isArray(field) ? field : fieldToPath(field);

	let result: T | undefined = path.reduce<Object | undefined>((memo, piece) => {
		return memo != null && typeof memo === "object" ? memo[piece] : undefined;
	}, json) as T | undefined;

	if (result === undefined) {
		return defaultValue;
	}
	return result;
}

function fieldToPath(field: string): string[] {
	return field.match(/([^\.\[\]]+)/g)!;
}

export function fromJSON<M extends Transformable<M>>(modelCtor: TransformableStatic<M>, json: Json<M>): M;
export function fromJSON<M extends Transformable<M>>(modelCtor: TransformableStatic<M>, json: Array<Json<M>>): M[];
export function fromJSON<M extends Transformable<M>>(modelCtor: TransformableStatic<M>, json: Json<M> | undefined | null): M | undefined;
export function fromJSON<M extends Transformable<M>>(modelCtor: TransformableStatic<M>, json: Array<Json<M>> | undefined | null): M[] | undefined;
export function fromJSON<M extends Transformable<M>>(modelCtor: TransformableStatic<M>, json?: Json<M> | Array<Json<M>> | null): M | M[] | undefined {
	if (json == null) {
		return undefined;
	}
	if (Array.isArray(json)) {
		return json.map(modelCtor.fromJSON);
	}
	return modelCtor.fromJSON(json);
}

export function toJSON<M extends Transformable<M>>(item: M): Json<M>;
export function toJSON<M extends Transformable<M>>(item: M[]): Array<Json<M>>;
export function toJSON<M extends Transformable<M>>(item: M | undefined): Json<M> | undefined;
export function toJSON<M extends Transformable<M>>(item: M[] | undefined): Array<Json<M>> | undefined;
export function toJSON<T, J>(item: T): J;
export function toJSON<T, J>(item: T[]): J[];
export function toJSON<T, J>(item: T | undefined): J | undefined;
export function toJSON<T, J>(item: T[] | undefined): J[] | undefined;
export function toJSON(item: any): any {
	if (item == null) {
		return item;
	}
	if (Array.isArray(item)) {
		return item.map(toJSON);
	}
	if (item instanceof Model || (typeof item === "object" && item.constructor === Object)) {
		return Object.keys(item).reduce((memo, key) => {
			let value: any | null | undefined = toJSON<any, any>(item[key]);
			if (value !== undefined) {
				memo[key] = value;
			}
			return memo;
		}, {});
	}
	return item;
}
