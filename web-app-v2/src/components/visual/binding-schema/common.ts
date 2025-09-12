/**
 * 快速判断字符串是否为有效的 ASCII 变量名
 * @param {string} str
 * @returns {boolean}
 */
export function isValidAsciiVariableName(str: string): boolean {
	// 变量名必须以字母、下划线或 $ 符号开头，
	// 后面可以跟字母、数字、下划线或 $ 符号
	const regex = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/;
	return regex.test(str);
}
