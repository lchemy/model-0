import { Rule } from "../definitions/rule";

export function min(minValue: number): Rule<any> {
	return {
		name: "min",
		check: (value: number) => value >= minValue ? null : {
			min: {
				requiredValue: minValue,
				actualValue: value
			}
		}
	};
}

export function max(maxValue: number): Rule<any> {
	return {
		name: "max",
		check: (value: number) => value <= maxValue ? null : {
			max: {
				requiredValue: maxValue,
				actualValue: value
			}
		}
	};
}

export function minDate(minValue: Date): Rule<any> {
	return {
		name: "minDate",
		check: (value: Date) => value >= minValue ? null : {
			minDate: {
				requiredValue: minValue,
				actualValue: value
			}
		}
	};
}

export function maxDate(maxValue: Date): Rule<any> {
	return {
		name: "maxDate",
		check: (value: Date) => value <= maxValue ? null : {
			maxDate: {
				requiredValue: maxValue,
				actualValue: value
			}
		}
	};
}

export function minLength(minValue: number): Rule<any> {
	return {
		name: "minlength",
		check: (value: string | any[]) => value.length >= minValue ? null : {
			minlength: {
				requiredLength: minValue,
				actualLength: value.length
			}
		}
	};
}

export function maxLength(maxValue: number): Rule<any> {
	return {
		name: "maxlength",
		check: (value: string | any[]) => value.length <= maxValue ? null : {
			maxlength: {
				requiredLength: maxValue,
				actualLength: value.length
			}
		}
	};
}

export function isIn(rawValues: any[] | Set<any> | { [key: string]: number } | any): Rule<any> {
	let values: any[];
	if (Array.isArray(rawValues)) {
		values = rawValues;
	} else if (rawValues instanceof Set) {
		values = Array.from(rawValues.values());
	} else {
		// extract numeric values from enums
		values = Object.keys(rawValues).map((key) => {
			return rawValues[key];
		}).filter((value) => {
			return typeof value === "number";
		});
	}

	return {
		name: "isIn",
		check: (value: any) => values.indexOf(value) >= 0 ? null : { isIn: true }
	};
}
