import { Model } from "../../model";

export type RuleCheckResult = { [key: string]: any } | null;
export type RuleCheckFn<M extends Model> = (value: any, model: M) => RuleCheckResult | Promise<RuleCheckResult>;

export interface Rule<M extends Model> {
	name: string;
	check: RuleCheckFn<M>;
	checkNull?: boolean;
}

export type Rules<M extends Model> = Array<Rule<M>>;

export function checkRules(rules: Rules<Model>, value: any, model: Model): Promise<RuleCheckResult> {
	let result: RuleCheckResult = null,
		prev: Promise<any> = Promise.resolve();

	rules.forEach((rule) => {
		if (value == null && !rule.checkNull) {
			return;
		}

		prev = prev.then(() => {
			return rule.check(value, model);
		}).then((ruleResult) => {
			if (ruleResult == null) {
				return;
			}
			result = Object.assign(result || {}, ruleResult);
		});
	});

	return prev.then(() => result);
}

export function isRule(value: any): value is Rule<Model> {
	return typeof value === "object" && value.name != null && value.check != null;
}
