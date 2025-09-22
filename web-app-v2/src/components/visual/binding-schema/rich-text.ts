import type { SectionsReturnType } from './index.ts';
import RichTextEditor from '../RichTextEditor.vue';

function sections(): SectionsReturnType {
	return {
		sections: [
			{
				title: '富文本模式',
				id: 'props',
				schema: [
					{
						type: RichTextEditor,
						prop: 'value',
						label: '内容',
						config: {}
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
