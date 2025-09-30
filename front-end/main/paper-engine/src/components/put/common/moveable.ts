/**
 * 提取 "[数字]" 或 "['字符串']" 形式中的数字或字符串。
 * @param {string} str 要处理的字符串。
 * @returns {number | string | null} 提取到的值，如果无法匹配则返回 null。
 */
function extractValueFromBracket(str: string): string | number | null {
	// 正则表达式解释:
	// \[            匹配左方括号 [
	// (?:           非捕获分组的开始 (用于组合 OR 逻辑)
	//   '([^']+)'     捕获单引号中的内容 (第一个捕获组)
	//   |           或者
	//   "([^"]+)"     捕获双引号中的内容 (第二个捕获组)
	//   |           或者
	//   (\d+)       捕获连续的数字 (第三个捕获组)
	// )             非捕获分组的结束
	// \]            匹配右方括号 ]
	const match = str.match(/\[(?:'([^']+)'|"([^"]+)"|(\d+))]/);

	if (!match) {
		return null; // 没有找到匹配项
	}

	// match[1] 是单引号中的内容
	if (match[1] !== undefined) {
		return match[1];
	}

	// match[2] 是双引号中的内容
	if (match[2] !== undefined) {
		return match[2];
	}

	// match[3] 是数字
	if (match[3] !== undefined) {
		return parseInt(match[3], 10);
	}

	return null;
}

export function useContainerMove() {
	/**
	 * schema id 全局唯一
	 * 出现相同 schema 说明存在索引分支，比较索引是否相同即可
	 * @returns {boolean} 位于不同分支，禁止拖入，返回 false
	 */
	function areOnDifferentBranches(pathA: string, pathB: string): boolean {
		// 匹配所有以 . 分隔的子串或方括号索引
		const segmentsA = pathA.match(/[^.\[]+|\[\d+]/g) || [];
		const segmentsB = pathB.match(/[^.\[]+|\[\d+]/g) || [];

		// 遍历最短的路径，寻找第一个不匹配的片段
		const minLength = Math.min(segmentsA.length, segmentsB.length);
		for (let i = 0; i < minLength; i++) {
			if (segmentsA[i] !== segmentsB[i]) {
				// 找到分歧点，证明它们有共同祖先并位于不同分支

				const pathA = segmentsA[i];
				const pathB = segmentsB[i];

				const regex = /^\[(?:'[^']+'|"[^"]+"|\d+)]$/;
				if (!regex.test(pathA) || !regex.test(pathB)) {
					return true;
				}

				const indexA = extractValueFromBracket(pathA);
				const indexB = extractValueFromBracket(pathB);

				// 不同模板分支
				return indexA === indexB;
			}
		}

		return true;
	}

	function containerDragMove(
		evt: CustomEvent & {
			from: HTMLElement;
			to: HTMLElement;
			draggedContext: {
				element: {
					type: string;
					label: string;
				};
				from: HTMLElement;
				to: HTMLElement;
				futureIndex: number;
				index: number;
			};
		}
	) {
		const fromBindingPath = evt.from.dataset.bindingPath;
		const toBindingPath = evt.to.dataset.bindingPath;

		return areOnDifferentBranches(fromBindingPath || '', toBindingPath || '');
	}

	return {
		containerDragMove
	};
}
