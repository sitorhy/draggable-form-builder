import type { SectionsReturnType } from './index.ts';
import { NSwitch } from 'naive-ui';
import JsonEditorModal from '../JsonEditorModal.vue';
import type { PropertyFormItemSchemaOptions } from './common.ts';

function sections(options: PropertyFormItemSchemaOptions): SectionsReturnType {
	return {
		sections: [
			{
				title: '线性表模式',
				id: 'props',
				schema: [
					{
						type: NSwitch,
						prop: 'static',
						label: '使用静态数据'
					},
					{
						type: JsonEditorModal,
						prop: 'loop',
						label: '静态数据',
						config: {
							readOnly: !options.schema.static
						}
					}
				]
			}
		]
	};
}

export default function (options: PropertyFormItemSchemaOptions) {
	return {
		schemas: sections(options),
		formProps: {}
	};
}
