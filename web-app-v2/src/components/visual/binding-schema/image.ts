import { NInput, NSlider } from 'naive-ui';
import type { SectionsReturnType } from './index.ts';

function sections(): SectionsReturnType {
	return {
		sections: [
			{
				title: '图像模式',
				id: 'props',
				schema: [
					{
						type: NInput,
						prop: 'src',
						label: '地址',
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
						type: NSlider,
						prop: 'height',
						label: '高度',
						config: {
							placeholder: '',
							step: 1,
							min: 1,
							max: 1024
						}
					},
					{
						type: NSlider,
						prop: 'width',
						label: '宽度',
						config: {
							placeholder: '',
							step: 1,
							min: 1,
							max: 1024
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
