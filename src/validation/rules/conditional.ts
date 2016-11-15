import { Model } from "../../model";
import { Rule, checkRules } from "../definitions/rule";

const requiredRule: Rule<Model> = {
	name: "required",
	check: (value: any) => value != null ? null : { required: true },
	checkNull: true
};
export function required(): Rule<Model> {
	return requiredRule;
}

export function checkIf<M extends Model>(condition: (value: any, model: M) => boolean, rulesInit: Rule<M>[] | Rule<M>, elseRulesInit?: Rule<M>[] | Rule<M>): Rule<M> {
	let rules: Rule<M>[] = Array.isArray(rulesInit) ? rulesInit : [rulesInit];

	let elseRules: Rule<M>[] | undefined;
	if (Array.isArray(elseRulesInit)) {
		elseRules = elseRulesInit;
	} else if (elseRulesInit == null) {
		elseRules = undefined;
	} else {
		elseRules = [elseRulesInit];
	}

	return {
		name: "checkIf",
		check: (value: any, model: M) => {
			if (!condition(value, model)) {
				return elseRules == null ? null : checkRules(elseRules, value, model);
			}
			return checkRules(rules, value, model);
		},
		checkNull: true
	};
}

export function checkSwitch<M extends Model>(mapper: (value: any, model: M) => string, ruleSet: { [key: string]: Rule<M>[] | Rule<M> }): Rule<M> {
	return {
		name: "checkSwitch",
		check: (value: any, model: M) => {
			let branch: string = mapper(value, model),
				rulesInit: Rule<M>[] | Rule<M> | undefined = ruleSet[branch];
			if (rulesInit == null) {
				return null;
			}

			let rules: Rule<M>[] = Array.isArray(rulesInit) ? rulesInit : [rulesInit];
			return checkRules(rules, value, model);
		},
		checkNull: true
	};
}
