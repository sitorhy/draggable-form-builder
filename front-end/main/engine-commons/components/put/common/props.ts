import { computed } from 'vue';
import type { NormalizeDataSource } from '../../../types.ts';
import { useFunctionStore } from '../../../store/function.ts';

export function useEmptyPropsInjection() {
	const emptyPropsInjection = computed(() => {
		return {};
	});

	return {
		emptyPropsInjection
	};
}

export function useRemoteDatasourceResolver() {
	const funcStore = useFunctionStore();

	async function resolveRemoteDatasource(
		dataSourceSchema: NormalizeDataSource
	) {
		const resolvedSchema: NormalizeDataSource = {
			...dataSourceSchema,
			host: dataSourceSchema.host.replace(
				'${BASE_URL}',
				`${location.host}/${import.meta.env.BASE_URL}`.replace(/\/+/, '/')
			),
			schema: location.protocol.startsWith('https') ? 'https' : 'http'
		};

		let path = `${resolvedSchema.host}/${resolvedSchema.path}`.replace(
			/\/+/,
			'/'
		);
		if (path.indexOf('?') >= 0) {
			path = `${path}&filter=${resolvedSchema.filter}`;
		} else {
			path = `${path}?filter=${resolvedSchema.filter}`;
		}
		const fullUrl = `${resolvedSchema.schema}://${path}`;

		const response = await fetch(fullUrl, {
			method: 'GET'
		});

		if (!response.ok) {
			throw new Error(
				`HTTP error! Status: ${response.status} ${response.statusText}`
			);
		}

		try {
			return await response.json();
		} catch (e) {
			if (dataSourceSchema.filter) {
				const moduleNames = dataSourceSchema.filter
					.split(',')
					.filter((i) => !!i);
				const filters = (moduleNames || []).map((moduleName) => {
					return funcStore.tryGetDefaultFunctionByModuleName(moduleName);
				});
				let filterValue: any = undefined;
				filters.forEach((filter) => {
					if (typeof filter === 'function') {
						filterValue = filter(filterValue);
					}
				});
				return filterValue;
			} else {
				throw e;
			}
		}
	}

	return {
		resolveRemoteDatasource
	};
}
