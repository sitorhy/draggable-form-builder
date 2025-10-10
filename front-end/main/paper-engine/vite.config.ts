import {defineConfig} from 'vite'
import AutoImport from 'unplugin-auto-import/vite';
import {NaiveUiResolver} from 'unplugin-vue-components/resolvers';
import Components from 'unplugin-vue-components/vite';
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
    base: './',
    server: {
        port: 6681,
        headers: {
            'Access-Control-Allow-Origin': '*'
        }
    },
    plugins: [
        vue(),
        AutoImport({
            imports: [
                'vue',
                {
                    'naive-ui': [
                        'useDialog',
                        'useMessage',
                        'useNotification',
                        'useLoadingBar'
                    ]
                }
            ]
        }),
        Components({
            resolvers: [NaiveUiResolver()]
        })
    ],
    build: {
        rollupOptions: {
            output: {
                manualChunks: function (id) {
                    if (id.includes('node_modules/naive-ui')) {
                        return 'naive-ui';
                    }
                    if (id.includes('node_modules/engine-commons')) {
                        return 'engine-commons';
                    }
                    return null;
                }
            }
        }
    }
})
