import { Rule } from "../definitions/rule";

const isBooleanRule: Rule<any> = wrapTypeCheck("isBoolean", (value) => typeof value === "boolean");
export function isBoolean(): Rule<any> {
	return isBooleanRule;
}

const isStringRule: Rule<any> = wrapTypeCheck("isString", (value) => typeof value === "string");
export function isString(): Rule<any> {
	return isStringRule;
}

const isNumberRule: Rule<any> = wrapTypeCheck("isNumber", (value) => typeof value === "number" && !Number.isNaN(value));
export function isNumber(): Rule<any> {
	return isNumberRule;
}

const isIntRule: Rule<any> = wrapTypeCheck("isInt", (value) => typeof value === "number" && !Number.isNaN(value) && (value % 0 === value || Math.floor(value) === value));
export function isInt(): Rule<any> {
	return isIntRule;
}

const isDateRule: Rule<any> = wrapTypeCheck("isDate", (value) => value instanceof Date);
export function isDate(): Rule<any> {
	return isDateRule;
}

const isArrayRule: Rule<any> = wrapTypeCheck("isArray", Array.isArray);
export function isArray(): Rule<any> {
	return isArrayRule;
}

const isObjectRule: Rule<any> = wrapTypeCheck("isObject", (value) => typeof value === "object" && !Array.isArray(value));
export function isObject(): Rule<any> {
	return isObjectRule;
}

function wrapTypeCheck(name: string, fn: (value: any) => boolean): Rule<any> {
	return {
		name,
		check: (value) => {
			return fn(value) ? null : {
				[name]: true
			};
		}
	};
}
