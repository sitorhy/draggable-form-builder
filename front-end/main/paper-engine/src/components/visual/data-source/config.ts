import type { NormalizeDataSource } from '../../../types.ts';

export function parseUri(uri: string): NormalizeDataSource {
	const result = {
		schema: '',
		host: '',
		path: '',
		filter: ''
	};

	if (!uri) {
		return result;
	}

	// 1. 查找并拆分 schema
	const schemaSeparatorIndex = uri.indexOf('://');
	if (schemaSeparatorIndex === -1) {
		return result; // 格式不正确，返回空
	}
	result.schema = uri.substring(0, schemaSeparatorIndex);

	// 2. 截取剩余部分，并查找 host 和 path
	const rest = uri.substring(schemaSeparatorIndex + 3);

	// 查找 host 和 path 的分隔符
	const hostSeparatorIndex = rest.indexOf(':');
	if (hostSeparatorIndex === -1) {
		// 如果没有 host 分隔符，说明格式不正确，或者 host 就是全部
		return result;
	}
	result.host = rest.substring(0, hostSeparatorIndex);

	// 3. 查找 path 和查询参数的分隔符
	const pathAndQuery = rest.substring(hostSeparatorIndex + 1);
	const querySeparatorIndex = pathAndQuery.indexOf('?');

	if (querySeparatorIndex !== -1) {
		result.path = pathAndQuery.substring(0, querySeparatorIndex);
	} else {
		result.path = pathAndQuery;
	}

	if (querySeparatorIndex >= 0) {
		const filterIndex = uri.indexOf('filter=', querySeparatorIndex + 1);
		const end = uri.indexOf('&', filterIndex);
		const filter = uri.substring(
			filterIndex + 'filter='.length,
			end === -1 ? uri.length : end
		);
		if (filter) {
			result.filter = filter;
		}
	}

	return result;
}