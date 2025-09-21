import { NInput } from 'naive-ui';
import type { SectionsReturnType } from './index.ts';

function sections(): SectionsReturnType {
	return {
		sections: [
			{
				title: '单选模式',
				id: 'props',
				schema: [
					{
						type: NInput,
						prop: 'label',
						label: '标签',
						config: {
							placeholder: ''
						},
						formItemProps: {
							useBinding: true
						}
					},
					{
						type: NInput,
						prop: 'value',
						label: '值',
						config: {
							placeholder: ''
						},
						formItemProps: {
							useBinding: true
						}
					},
					{
						type: NInput,
						prop: 'name',
						label: '分组名称',
						config: {
							placeholder: ''
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
