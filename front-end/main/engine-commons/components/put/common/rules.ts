import { useFunctionStore } from '../../../store/function.ts';
import { useFunctionContext } from './function-context.ts';

export function useRulesResolver(options: {
	getBindingPath?: () => string;
	getMessageTool?: () =>
		| {
				info: (message: string) => void;
				error: (message: string) => void;
				success: (message: string) => void;
		  }
		| null
		| undefined;
}) {
	const functionStore = useFunctionStore();
	const { functionContext } = useFunctionContext(options);

	function resolveRules(rules: Record<string, any>) {
		return Object.entries(rules)
			.map(([eventName, rule]) => {
				const ruleList = Array.isArray(rule) ? rule : [rule];

				const listResolved = ruleList.map((i) => {
					const { validatorModule, message, ...oops } = i;
					const validator =
						functionStore.tryGetDefaultFunctionByModuleName(validatorModule);
					return validator
						? {
								...oops,
								message: message ? message : undefined,
								validator: function (...args: any[]) {
									return validator.bind(functionContext.value)(...args);
								}
							}
						: {
								...oops,
								message
							};
				});

				return [eventName, listResolved];
			})
			.reduce((s, i) => {
				return Object.assign(s, {
					[i[0] as string]: i[1]
				});
			}, {});
	}
	return {
		resolveRules
	};
}
