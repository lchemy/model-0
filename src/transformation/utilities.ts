import { Model } from "../model";
import { Transformable, TransformableStatic } from "./transformable";

export function get<T>(json: Object, field: string | (string | number)[], defaultValue: T | null = null): T | null {
	let path: (string | number)[] = Array.isArray(field) ? field : fieldToPath(field);

	let result: T | undefined | null = path.reduce((memo, piece) => {
		return memo != null && typeof memo === "object" ? memo[piece] : undefined;
	}, json) as T | undefined | null;

	if (result === undefined) {
		return defaultValue;
	}
	return result;
}

function fieldToPath(field: string): string[] {
	return field.match(/([^\.\[\]]+)/g)!;
}

export function fromJSON<M extends Model, J>(modelCtor: TransformableStatic<M, J>, json: J): M;
export function fromJSON<M extends Model, J>(modelCtor: TransformableStatic<M, J>, json: J[]): M[];
export function fromJSON<M extends Model, J>(modelCtor: TransformableStatic<M, J>, json: J | undefined): M | undefined;
export function fromJSON<M extends Model, J>(modelCtor: TransformableStatic<M, J>, json: J[] | undefined): M[] | undefined;
export function fromJSON<M extends Model, J>(modelCtor: TransformableStatic<M, J>, json?: J | J[]): M | M[] | undefined {
	if (json == null) {
		return undefined;
	}
	if (Array.isArray(json)) {
		return json.map(modelCtor.fromJSON);
	}
	return modelCtor.fromJSON(json);
}

export function toJSON<M extends Model, J>(modelCtor: TransformableStatic<M, J>, model: Transformable<M, J>): J;
export function toJSON<M extends Model, J>(modelCtor: TransformableStatic<M, J>, model: Transformable<M, J>[]): J[];
export function toJSON<M extends Model, J>(modelCtor: TransformableStatic<M, J>, model: Transformable<M, J> | undefined): J | undefined;
export function toJSON<M extends Model, J>(modelCtor: TransformableStatic<M, J>, model: Transformable<M, J>[] | undefined): J[] | undefined;
export function toJSON<M extends Model, J>(modelCtor: TransformableStatic<M, J>, model?: Transformable<M, J> | Transformable<M, J>[]): J | J[] | undefined {
	if (model == null) {
		return undefined;
	}
	if (Array.isArray(model)) {
		return model.map((m) => m.toJSON()) as J[];
	}
	return model.toJSON() as J;
}
