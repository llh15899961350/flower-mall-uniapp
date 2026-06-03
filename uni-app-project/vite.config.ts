import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'
import { UnifiedViteWeappTailwindcssPlugin } from 'weapp-tailwindcss/vite'
import path from 'node:path'
import tailwindcss from '@tailwindcss/postcss'
import autoprefixer from 'autoprefixer';

export default defineConfig({
  plugins: [
    uni(),
    UnifiedViteWeappTailwindcssPlugin({
      rem2rpx: true,
      cssEntries: [
        path.resolve(__dirname, './src/main.css')
      ]
    })
  ],

  css: {
    postcss: {
      plugins: [
        tailwindcss(),
        autoprefixer()
      ]
    }
  }
})