import { Model } from "../model";

export type Json<M extends Model> = {
	[K in keyof M]?: M[K]
};
