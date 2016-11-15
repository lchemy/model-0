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
