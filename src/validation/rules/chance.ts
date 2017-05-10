import { Rule } from "../definitions/rule";

export function snakeEyes(dice: number = 2, sides: number = 6, target: number = 1): Rule<any> {
	return {
		name: "snakeEyes",
		check: () => {
			const resArr: number[] = [];
			for (let i: number = 0; i < dice; i++) {
				const rollVal: number = (Math.random() * sides + 1) | 0;
				if (rollVal !== target) {
					return {
						snakeEyes: {
							requiredValue: target,
							actualValue: resArr
						}
					};
				} else {
					resArr.push(rollVal);
				}
			}
			return null;
		},
		checkNull: true
	};
}
