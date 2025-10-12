import { NSelect } from 'naive-ui';
import { useBindingPathSchema } from './common.ts';
import {
	FORM_LABEL_ALIGN,
	FORM_LABEL_PLACEMENT
} from '../../put/common/constants.ts';
import type { SectionsReturnType } from './index.ts';
import FormRulesEditor from '../FormRulesEditor.vue';

function sections(): SectionsReturnType {
	return {
		sections: [
			{
				title: '表单模式',
				id: 'props',
				schema: [
					useBindingPathSchema(),
					{
						type: NSelect,
						label: '标签对齐',
						prop: 'labelAlign',
						config: {
							options: FORM_LABEL_ALIGN
						}
					},
					{
						type: NSelect,
						label: '标签位置',
						prop: 'labelPlacement',
						config: {
							options: FORM_LABEL_PLACEMENT
						}
					}
				]
			},
			{
				title: '表单项校验',
				id: 'rules',
				schema: [
					{
						type: FormRulesEditor,
						prop: 'rules',
						label: '校验配置'
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
