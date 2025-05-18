import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    uni(),
  ],
  optimizeDeps: {
    include: [
      'blockly',
      'blockly/core',
      'blockly/blocks',
      'blockly/javascript',
      'blockly/msg/zh-hans',
      'blockly/python'
    ]
  },
  build: {
    commonjsOptions: {
      include: [/blockly/]
    },
    minify: 'terser',
    sourcemap: true,
    chunkSizeWarningLimit: 1500
  },
  server: {
    host: true,
    port: 5174,
    strictPort: true,
    proxy: {
      '/api/v1': {
        target: 'https://fylogmmflhxi.sealosbja.site',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path
      }
    }
  },
  resolve: {
    alias: {
      '@': '/src',
      'blockly/core/field_colour': 'blockly/core/field_colour.js'
    }
  },
  publicDir: 'public'  // 指定静态资源目录
})
