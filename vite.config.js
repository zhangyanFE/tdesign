import { defineConfig } from 'vite';
import { viteMockServe } from 'vite-plugin-mock';
import { createVuePlugin } from 'vite-plugin-vue2';
import { createSvgPlugin } from 'vite-plugin-vue2-svg';

import path from 'path';

import proxy from './src/config/proxy';

// 如有引用.env 文件，可通过下面的方法拿到变量，类似于 process.env
// import.meta.env.VITE_SOME_KEY

export default defineConfig({
  base: './',
  resolve: {
    alias: {
      '~': path.resolve(__dirname, './'),
      '@': path.resolve(__dirname, './src'),
    },
  },

  css: {
    preprocessorOptions: {
      less: {
        modifyVars: {
          // 如需自定义组件其他 token, 在此处配置
        },
      },
    },
  },

  plugins: [
    createVuePlugin({
      jsx: true,
    }),
    viteMockServe({
      mockPath: 'mock',
      localEnabled: true,
    }),
    createSvgPlugin(),
  ],

  build: {
    cssCodeSplit: false,
  },

  server: {
    port: 3001,
    proxy: {
      ...proxy,
    },
  },
});
