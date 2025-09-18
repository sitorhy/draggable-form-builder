import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import MonacoEditorPlugin from 'vite-plugin-monaco-editor-esm';

// https://vite.dev/config/
export default defineConfig({
	optimizeDeps: {
		exclude: ['uuid']
	},
	plugins: [vue(), MonacoEditorPlugin()]
});
