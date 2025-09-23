import type { App } from 'vue';
import { VEmphasize } from './components/put/common/vEmphasize.ts';
import ListItem from './components/put/item/ListItem.vue';

import * as monaco from 'monaco-editor';
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker';
import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker';
import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker';
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker';
import { type Environment } from 'monaco-editor';

import './libs/vue3-quill/fonts.ts';
import 'katex/dist/katex.css';

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

export default function registerGlobalComponents(app: App): void {
	app.component('list-item', ListItem);
	app.directive('emphasize', VEmphasize);
}
