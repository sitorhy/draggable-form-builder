import { defineConfig, type PluginOption } from 'vite';
import vue from '@vitejs/plugin-vue';
import MonacoEditorPlugin from 'vite-plugin-monaco-editor-esm';

// https://vite.dev/config/
export default defineConfig({
	base: './',
	optimizeDeps: {
		exclude: ['uuid']
	},
	server: {
		port: 6680,
		headers: {
			'Access-Control-Allow-Origin': '*'
		}
	},
	plugins: [
		vue({
			template: {
				compilerOptions: {
					isCustomElement: (tag) => /^micro-app/.test(tag)
				}
			}
		}),
		MonacoEditorPlugin() as PluginOption
	],
	build: {
		rollupOptions: {
			output: {
				manualChunks: function (id) {
					if (id.includes('node_modules/monaco-editor')) {
						return 'monaco-editor';
					}
					if (id.includes('node_modules/katex')) {
						return 'katex';
					}
					if (id.includes('node_modules/@vicons')) {
						return '@vicons';
					}
					if (id.includes('node_modules/naive-ui')) {
						return 'naive-ui';
					}
					return null;
				}
			}
		}
	}
});
