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

	async function resolveRules(rules: Record<string, any>) {
		const allResolvedList = Object.keys(rules).map(async (path: string) => {
			const r = rules[path];
			const list = Array.isArray(r) ? r : [r];

			const listResolve = await Promise.all(
				list.map(
					async (
						rule: Record<string, any> & {
							validatorModule?: string;
						}
					) => {
						const { validatorModule, message, ...opts } = rule;
						if (validatorModule) {
							const moduleDescription =
								await functionStore.findFunctionCodeByName(validatorModule);
							if (moduleDescription) {
								const module =
									await functionStore.loadModule(moduleDescription);
								if (module) {
									const validator = module['default'];
									return {
										...opts,
										message: message ? message : undefined,
										validator:
											typeof validator === 'function'
												? validator.bind(functionContext.value)
												: validator
									};
								}
							}
						}
						return {
							...opts,
							message
						};
					}
				)
			);

			return [path, listResolve];
		});

		const arr: (string | Record<string, any>)[] =
			await Promise.all(allResolvedList);
		return arr.reduce((s, i) => {
			const j = i as any[];

			const p = j[0] as string;
			const rules = j[1] as Record<string, any>;
			return Object.assign(s, {
				[p]: rules
			});
		}, {});
	}

	return {
		resolveRules
	};
}
