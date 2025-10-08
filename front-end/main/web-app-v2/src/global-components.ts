import type { App, Directive } from 'vue';
import { VEmphasize } from './components/put/common/vEmphasize.ts';
import ListItem from './components/put/item/ListItem.vue';

import * as monaco from 'monaco-editor';
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker';
import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker';
import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker';
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker';
import { type Environment } from 'monaco-editor';

import { printPlugin } from 'vue-print-next';

import microApp from '@micro-zoe/micro-app';

import './libs/vue3-quill/fonts.ts';
import './libs/vue3-quill/font-size.ts';
import 'katex/dist/katex.css';

import 'highlight.js/styles/default.min.css';
import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import bash from 'highlight.js/lib/languages/bash';
import shell from 'highlight.js/lib/languages/shell';
import accesslog from 'highlight.js/lib/languages/accesslog';

hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('bash', bash);
hljs.registerLanguage('shell', shell);
hljs.registerLanguage('accesslog', accesslog);

declare global {
	interface Window {
		MonacoEnvironment: Environment;
	}
}

self.MonacoEnvironment = {
	getWorker(_, label) {
		if (label === 'json') {
			return new jsonWorker();
		}
		if (label === 'css' || label === 'scss' || label === 'less') {
			return new cssWorker();
		}
		if (label === 'html' || label === 'handlebars' || label === 'razor') {
			return new htmlWorker();
		}
		if (label === 'typescript' || label === 'javascript') {
			return new tsWorker();
		}
		return new editorWorker();
	}
};

monaco.languages.typescript.typescriptDefaults.setEagerModelSync(true);

microApp.start({
	iframe: true
});

export default function registerGlobalComponents(app: App): void {
	app.component('list-item', ListItem);
	app.directive('emphasize', VEmphasize as Directive);
	app.use(printPlugin);
}
