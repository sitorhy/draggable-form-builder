import { NInput, NInputNumber } from 'naive-ui';
import type { SectionsReturnType } from './index.ts';

function sections(): SectionsReturnType {
	return {
		sections: [
			{
				title: '文本模式',
				id: 'props',
				schema: [
					{
						type: NInput,
						prop: 'text',
						label: '内容',
						config: {
							placeholder: '',
							clearable: true,
							type: 'textarea',
							rows: 5
						},
						formItemProps: {
							useBinding: true
						}
					},
					{
						type: NInputNumber,
						prop: 'lineClamp',
						label: '最大行数',
						config: {
							placeholder: '',
							clearable: true
						}
					}
				]
			}
		]
	};
}

export default function () {
	return {
		schemas: sections(),
		formProps: {}
	};
}
