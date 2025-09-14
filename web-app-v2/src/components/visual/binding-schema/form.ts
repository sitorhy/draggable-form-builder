import { NSelect } from 'naive-ui';
import { useBindingPathSchema } from './common.ts';
import {
	FORM_LABEL_ALIGN,
	FORM_LABEL_PLACEMENT
} from '../../put/common/constants.ts';

function sections() {
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
