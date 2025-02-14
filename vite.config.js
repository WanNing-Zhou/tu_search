import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
// https://www.npmjs.com/package/vite-plugin-utools-helper

import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import Icons from 'unplugin-icons/vite'
import {ElementPlusResolver} from 'unplugin-vue-components/resolvers'
import IconsResolver from 'unplugin-icons/resolver'
import { resolve } from 'path';
import {createSvgIconsPlugin} from "vite-plugin-svg-icons";
// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        AutoImport({
            resolvers: [ElementPlusResolver(),
                IconsResolver({
                    prefix: 'Icon',
                }),],
            eslintrc: {
                enabled: true, // <-- this
            },
        }),
        Components({
            resolvers: [ElementPlusResolver(),
                IconsResolver({
                    enabledCollections: ['ep'],
                }),
            ],
        }),
        Icons({
            autoInstall: true,
        }),
        //启用插件
        createSvgIconsPlugin({
            // 指定图标文件夹，绝对路径（NODE代码）
            iconDirs: [resolve(process.cwd(), 'public')],
        })
    ],
    base: './',
    resolve: {
        alias: {
            '@': resolve(__dirname, 'src'),
            '@public':resolve(__dirname, 'public'),
        }
    },
    publicDir: 'public'
})
