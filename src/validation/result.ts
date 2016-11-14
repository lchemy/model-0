import { RuleCheckResult } from "./definitions/rule";

export class ValidationResult {
	private cache: Map<string, ValidationResult> = new Map();

	get isValid(): boolean {
		return this.errors == null;
	}

	constructor(public errors: RuleCheckResult = null, private value: any) {

	}

	get(field: string): ValidationResult | undefined {
		let path: string[] = fieldToPath(field);

		field = path.join("."); // normalize field for cache hit check
		if (this.cache.has(field)) {
			return this.cache.get(field);
		}

		let pathExists: boolean = checkPathExists(this.value, path);
		if (this.isValid) {
			return pathExists ? VALID_RESULT : undefined;
		} else if (!pathExists) {
			return undefined;
		}

		let result: RuleCheckResult = getResultAtPath(this.errors, path),
			value: any = getValueAtPath(this.value, path),
			out: ValidationResult = new ValidationResult(result, value);
		this.cache.set(field, out);
		return out;
	}
}

const VALID_RESULT: ValidationResult = new ValidationResult(null, null);

function fieldToPath(field: string): string[] {
	return field.match(/([^\.\[\]]+)/g)!;
}

function checkPathExists(piece: any, path: string[]): boolean {
	if (piece == null) {
		return false;
	}

	let l: number = path.length;
	return path.every((part, i) => {
		piece = piece[part];
		return i === l - 1 || (piece != null && typeof piece === "object");
	});
}

function getValueAtPath(value: any, path: string[]): any {
	return path.reduce((memo, part) => {
		return memo[part];
	}, value);
}

function getResultAtPath(result: RuleCheckResult, path: string[]): RuleCheckResult {
	return path.reduce((memo, part, i) => {
		if (i === path.length - 1) {
			return memo == null ? null : memo[part];
		}
		return memo == null || memo[part] == null ? null : memo[part].nested;
	}, result);
}
