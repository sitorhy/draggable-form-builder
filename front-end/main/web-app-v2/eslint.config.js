import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import pluginVue from 'eslint-plugin-vue';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig([
	js.configs.recommended,
	eslintPluginPrettierRecommended,
	{
		files: ['**/*.{js,mjs,cjs,ts,mts,cts,vue}'],
		plugins: { js },
		extends: ['js/recommended'],
		languageOptions: { globals: globals.browser }
	},
	tseslint.configs.recommended,
	pluginVue.configs['flat/essential'],
	{
		files: ['**/*.vue'],
		languageOptions: { parserOptions: { parser: tseslint.parser } }
	},
	globalIgnores(['dist', 'build']),
	{
		ignores: ['test/**'],
		rules: {
			'@typescript-eslint/no-explicit-any': 'off',
			'@typescript-eslint/no-empty-object-type': 'off',
			'no-useless-escape': 'off',
			'vue/multi-word-component-names': 'off'
		}
	}
]);
