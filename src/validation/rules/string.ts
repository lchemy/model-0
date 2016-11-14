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

// TODO: isUrl

// TODO: isUppercase

// TODO: isLowercase

function wrapRegexpCheck(name: string, pattern: RegExp): Rule<any> {
	return {
		name,
		check: (value: string) => pattern.test(value) ? null : { [name]: true }
	};
}
