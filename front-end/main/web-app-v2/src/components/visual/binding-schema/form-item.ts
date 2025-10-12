import { NInput, NSelect, NSwitch } from 'naive-ui';
import { useBindingPathSchema } from './common.ts';
import {
	FORM_LABEL_ALIGN,
	FORM_LABEL_PLACEMENT
} from '../../put/common/constants.ts';
import type { SectionsReturnType } from './index.ts';

function sections(): SectionsReturnType {
	return {
		sections: [
			{
				title: '表单项模式',
				id: 'props',
				schema: [
					useBindingPathSchema(),
					{
						type: NInput,
						prop: 'label',
						label: '标签信息',
						config: {
							placeholder: ''
						}
					},
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
					},
					{
						type: NSwitch,
						label: '必填星号',
						prop: 'showRequireMark'
					},
					{
						type: NSwitch,
						label: '只展示首个出错信息',
						prop: 'first'
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
