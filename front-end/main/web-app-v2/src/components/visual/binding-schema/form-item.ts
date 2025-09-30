import { NInput, NSelect } from 'naive-ui';
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
