import type { NormalizeDataSource } from '../../../types.ts';

export function parseUri(uri: string): NormalizeDataSource {
    let result = {
        schema: '',
        host: '',
        path: '',
        filter: ''
    };

    if (!uri) {
        return result;
    }

    if (uri.startsWith('http')) {
        result.schema = 'http';

        // 1. 定义占位符和替换值
        const placeholderHost = 'placeholder.com';
        // 替换占位符，使其成为一个有效的 URL
        const validUri = uri.replace('${BASE_URL}', placeholderHost);

        const url = new URL(validUri);
        const params = url.searchParams;

        let filterValue = '';
        const remainingParams = [];

        const targetFilterKey = 'filter';

        // 2. 遍历参数，提取 filter 的值，同时构建剩余参数列表
        for (const [key, value] of params.entries()) {
            if (key === targetFilterKey) {
                filterValue = value;
            } else {
                // 保留所有非 'filter' 参数及其原始大小写
                remainingParams.push(`${key}=${value}`);
            }
        }

        // 3. 重构 path 字段
        let customPath = url.pathname;
        if (remainingParams.length > 0) {
            customPath += '?' + remainingParams.join('&');
        }

        // 4. 组装结果对象，将 host 还原为占位符
        result = {
            schema: url.protocol.slice(0, -1),
            // 还原 host 字段中的占位符
            host: url.host === placeholderHost ? '${BASE_URL}' : url.host,
            path: customPath,
            filter: filterValue
        };
    } else {
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
    }

    return result;
}