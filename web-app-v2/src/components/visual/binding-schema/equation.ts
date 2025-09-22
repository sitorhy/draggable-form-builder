import { NInput } from 'naive-ui';
import type { SectionsReturnType } from './index.ts';

function sections(): SectionsReturnType {
	return {
		sections: [
			{
				title: '公式模式',
				id: 'props',
				schema: [
					{
						type: NInput,
						prop: 'katex',
						label: 'Katex公式配置',
						config: {
							placeholder: '',
							clearable: true,
							type: 'textarea',
							rows: 5
						},
						formItemProps: {
							useBinding: true
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
