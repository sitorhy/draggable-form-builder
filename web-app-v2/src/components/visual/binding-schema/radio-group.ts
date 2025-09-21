import { NInput, NSwitch } from 'naive-ui';
import { useBindingPathSchema } from './common.ts';
import type { SectionsReturnType } from './index.ts';

function sections(): SectionsReturnType {
	return {
		sections: [
			{
				title: '单选组模式',
				id: 'props',
				schema: [
					useBindingPathSchema(),
					{
						type: NSwitch,
						prop: 'disabled',
						label: '禁用',
						config: {}
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
