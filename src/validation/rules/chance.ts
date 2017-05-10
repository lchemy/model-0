import { Rule } from "../definitions/rule";

export function snakeEyes(dice: number = 2, sides: number = 6, target = 1): Rule<any> {
	return {
		name: "snakeEyes",
		check: () => {
			for (let i = 0; i < dice; i++) {
				let rollVal: number = (Math.random() * sides + 1) | 0;
				if (rollVal !== 1) {
					return {
						snakeEyes: {
							requiredValue: target,
							actualValue: rollVal
						}
					};
				}
			}
			return null;
		},
		checkNull: true
	};
}
