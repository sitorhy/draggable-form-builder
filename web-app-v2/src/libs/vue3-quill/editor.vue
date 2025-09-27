<template>
	<section ref="editor"></section>
</template>

<script lang="js">
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import 'quill/dist/quill.bubble.css';

import Quill from 'quill';
import { onMounted, ref, watch, onUnmounted, onBeforeUnmount } from 'vue';
import fonts from './fonts';

const defaultOptions = {
	theme: 'snow',
	boundary: document.body,
	modules: {
		toolbar: [
			['bold', 'italic', 'underline', 'strike'],
			['blockquote', 'code-block'],
			[{ header: 1 }, { header: 2 }],
			[{ list: 'ordered' }, { list: 'bullet' }],
			[{ script: 'sub' }, { script: 'super' }],
			[{ indent: '-1' }, { indent: '+1' }],
			[{ direction: 'rtl' }],
			[{ size: ['small', false, 'large', 'huge'] }],
			[{ header: [1, 2, 3, 4, 5, 6, false] }],
			[{ color: [] }, { background: [] }],
			[{ font: fonts }],
			[{ align: [] }],
			['clean'],
			['link', 'image', 'video']
		]
	},
	placeholder: 'Insert content here ...',
	readOnly: false
};
export default {
	name: 'quill-editor',
	props: {
		content: String,
		value: String,
		disabled: {
			type: Boolean,
			default: false
		},
		options: {
			type: Object,
			required: false,
			default: () => ({})
		}
	},
	emits: ['ready', 'change', 'input', 'blur', 'focus', 'update:value'],
	setup(props, context) {
		const state = {
			editorOption: {},
			quill: null
		};

		let _content = '';

		watch(
			() => props.value,
			(val) => {
				if (state.quill) {
					if (val && val !== _content) {
						_content = val;
						state.quill.clipboard.dangerouslyPasteHTML(val);
					} else if (!val) {
						state.quill.setText('');
					}
				}
			}
		);

		watch(
			() => props.content,
			(val) => {
				if (state.quill) {
					if (val && val !== _content) {
						_content = val;
						state.quill.clipboard.dangerouslyPasteHTML(val);
					} else if (!val) {
						state.quill.setText('');
					}
				}
			}
		);

		watch(
			() => props.disabled,
			(val) => {
				if (state.quill) {
					state.quill.enable(!val);
				}
			}
		);

		const editor = ref(null);

		const mergeOptions = (def, custom) => {
			for (const key in custom) {
				if (!def[key] || key !== 'modules') {
					def[key] = custom[key];
				} else {
					mergeOptions(def[key], custom[key]);
				}
			}
			return def;
		};

		const initialize = () => {
			if (editor.value) {
				// Options
				state.editorOption = mergeOptions(defaultOptions, props.options);
				state.editorOption.readOnly = !!props.disabled;
				// Instance
				state.quill = new Quill(editor.value, state.editorOption);
				// console.log('intilized')

				// Set editor content
				if (props.value) {
					state.quill.clipboard.dangerouslyPasteHTML(props.value);
				}

				// Mark model as touched if editor lost focus
				state.quill.on('selection-change', (range) => {
					if (!range) {
						context.emit('blur', state.quill);
					} else {
						context.emit('focus', state.quill);
					}
				});
				// Update model if text changes
				state.quill.on('text-change', () => {
					// diabled editor after content initialized
					if (props.disabled) {
						state.quill.enable(false);
					}
					let html = editor.value.children[0].innerHTML;
					const quill = state.quill;
					const text = state.quill.getText();
					if (html === '<p><br></p>') html = '';
					_content = html;
					context.emit('update:value', _content);
					context.emit('change', { html, text, quill });
				});

				// Emit ready event
				context.emit('ready', state.quill);
			}
		};

		onBeforeUnmount(() => {
			const editorToolbar = editor.value.previousSibling;
			if (
				editorToolbar &&
				editorToolbar.nodeType === 1 &&
				editorToolbar.className.indexOf('ql-toolbar') > -1
			) {
				editorToolbar.parentNode.removeChild(editorToolbar);
			}
		});

		onMounted(() => {
			initialize();
		});

		onUnmounted(() => {
			state.quill = null;
		});

		return { editor };
	}
};
</script>

<style>
.ql-snow .ql-picker.ql-font .ql-picker-label[data-value='SimSun']::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value='SimSun']::before {
	content: '宋体';
	font-family: 'SimSun';
}
.ql-snow .ql-picker.ql-font .ql-picker-label[data-value='SimHei']::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value='SimHei']::before {
	content: '黑体';
	font-family: 'SimHei';
}
.ql-snow
	.ql-picker.ql-font
	.ql-picker-label[data-value='Microsoft-YaHei']::before,
.ql-snow
	.ql-picker.ql-font
	.ql-picker-item[data-value='Microsoft-YaHei']::before {
	content: '微软雅黑';
	font-family: 'Microsoft YaHei';
}
.ql-snow .ql-picker.ql-font .ql-picker-label[data-value='KaiTi']::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value='KaiTi']::before {
	content: '楷体';
	font-family: 'KaiTi';
}
.ql-snow .ql-picker.ql-font .ql-picker-label[data-value='FangSong']::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value='FangSong']::before {
	content: '仿宋';
	font-family: 'FangSong';
}
.ql-snow .ql-picker.ql-font .ql-picker-label[data-value='Arial']::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value='Arial']::before {
	content: 'Arial';
	font-family: 'Arial';
}
.ql-snow
	.ql-picker.ql-font
	.ql-picker-label[data-value='Times-New-Roman']::before,
.ql-snow
	.ql-picker.ql-font
	.ql-picker-item[data-value='Times-New-Roman']::before {
	content: 'Times New Roman';
	font-family: 'Times New Roman';
}
.ql-snow .ql-picker.ql-font .ql-picker-label[data-value='sans-serif']::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value='sans-serif']::before {
	content: 'sans-serif';
	font-family: 'sans-serif';
}

.ql-font-SimSun {
	font-family: 'SimSun';
}
.ql-font-SimHei {
	font-family: 'SimHei';
}
.ql-font-Microsoft-YaHei {
	font-family: 'Microsoft YaHei';
}
.ql-font-KaiTi {
	font-family: 'KaiTi';
}
.ql-font-FangSong {
	font-family: 'FangSong';
}
.ql-font-Arial {
	font-family: 'Arial';
}
.ql-font-Times-New-Roman {
	font-family: 'Times New Roman';
}
.ql-font-sans-serif {
	font-family: 'sans-serif';
}
</style>
