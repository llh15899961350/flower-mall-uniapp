import { defineConfig } from 'vite';
import uniPlugin from '@dcloudio/vite-plugin-uni';
import tailwindcss from '@tailwindcss/vite';
import { UnifiedViteWeappTailwindcssPlugin as weappTailwind } from 'weapp-tailwindcss/vite';
import path from 'path';

// Defensively resolve default ESM/CJS exports from @dcloudio/vite-plugin-uni
const uni = typeof uniPlugin === 'function' ? uniPlugin : (uniPlugin as any).default;

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    uni(),
    tailwindcss(),
    // Converts unsupported Tailwind classes for mini-program runtimes (WXML)
    weappTailwind({
      rem2rpx: true // Support standard rem to rpx conversion for pixel-perfect screens
    })
  ],
  resolve: {
    alias: {
      'vue': path.resolve(__dirname, './src/vue-shim.ts')
    }
  },
  server: {
    port: 3000,
    host: '0.0.0.0',
    // HMR is disabled in AI Studio via DISABLE_HMR env var.
    hmr: process.env.DISABLE_HMR !== 'true',
    // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
    watch: process.env.DISABLE_HMR === 'true' ? null : {},
  }
});
