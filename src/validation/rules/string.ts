import { Rule } from "../definitions/rule";

export function matches(pattern: RegExp): Rule<any> {
	return {
		name: "matches",
		check: (value: string) => pattern.test(value) ? null : {
			matches: {
				requiredPattern: pattern,
				actualValue: value
			}
		}
	};
}

// http://emailregex.com/, https://www.w3.org/TR/html-markup/input.email.html#input.email.attrs.value.multiple
const emailRegexp: RegExp = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
const isEmailRule: Rule<any> = wrapRegexpCheck("isEmail", emailRegexp);
export function isEmail(): Rule<any> {
	return isEmailRule;
}

const alphanumericRegexp: RegExp = /^[a-z0-9]+$/i;
const isAlphanumericRule: Rule<any> = wrapRegexpCheck("isAlphanumeric", alphanumericRegexp);
export function isAlphanumeric(): Rule<any> {
	return isAlphanumericRule;
}

// TODO: isUrl

// TODO: isUppercase

// TODO: isLowercase

function wrapRegexpCheck(name: string, pattern: RegExp): Rule<any> {
	return {
		name,
		check: (value: string) => pattern.test(value) ? null : { [name]: true }
	};
}
