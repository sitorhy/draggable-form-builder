import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import MonacoEditorPlugin from 'vite-plugin-monaco-editor-esm';

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        MonacoEditorPlugin(),
    ],
})
