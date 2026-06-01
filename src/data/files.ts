/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { FileEntry } from '../types';

export const mockProjectFiles: FileEntry[] = [
  {
    path: 'package.json',
    name: 'package.json',
    language: 'json',
    content: `{
  "name": "beast-mini-program",
  "version": "1.0.0",
  "description": "BEAST & tbh WeChat Mini Program built with Uni-app, Vue3, and Tailwind CSS v4.",
  "scripts": {
    "dev:mp-weixin": "uni -p mp-weixin",
    "build:mp-weixin": "uni -p mp-weixin"
  },
  "dependencies": {
    "@dcloudio/uni-app": "3.0.0-alpha-4010820240508001",
    "vue": "^3.3.0"
  },
  "devDependencies": {
    "@dcloudio/types": "^3.4.0",
    "@dcloudio/vite-plugin-uni": "3.0.0-alpha-4010820240508001",
    "tailwindcss": "^4.0.0",
    "weapp-tailwindcss": "^4.0.0",
    "typescript": "^4.9.5",
    "vite": "^5.2.0"
  }
}`
  },
  {
    path: 'vite.config.ts',
    name: 'vite.config.ts',
    language: 'typescript',
    content: `import { defineConfig } from 'vite';
import uni from '@dcloudio/vite-plugin-uni';
import { UnifiedViteWeappTailwindcssPlugin as weappTailwind } from 'weapp-tailwindcss/vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    uni(),
    // Converts unsupported Tailwind classes for mini-program runtimes (WXML)
    weappTailwind({
      rem2rpx: true // Support standard rem to rpx conversion for pixel-perfect screens
    })
  ]
});`
  },
  {
    path: 'src/main.css',
    name: 'main.css',
    language: 'css',
    content: `/* Support for Tailwind CSS V4.0 @import syntax */
@import "tailwindcss";

/* Common resets for wechat mini program container */
page {
  background-color: #fcfcfc;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  color: #111111;
}

view, text, image, scroll-view {
  box-sizing: border-box;
}

/* Custom fade animations */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10rpx); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in {
  animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}`
  },
  {
    path: 'src/pages/splash/splash.vue',
    name: 'splash.vue',
    language: 'html',
    content: `<template>
  <view class="flex items-center justify-center min-h-screen bg-white">
    <!-- BEAST Splash Logo with luxury font-serif spacing -->
    <view class="flex items-baseline tracking-[0.25em] transition-opacity duration-1000">
      <text class="text-4xl font-serif font-bold text-black">B</text>
      <text class="text-3xl font-serif text-gray-300 ml-0.5">EAST</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';

onMounted(() => {
  // Splash holds for 1.8 seconds then navigates to main home page
  setTimeout(() => {
    uni.switchTab({
      url: '/pages/index/index'
    });
  }, 1800);
});
<\/script>`
  },
  {
    path: 'src/pages/index/index.vue',
    name: 'index.vue',
    language: 'html',
    content: `<template>
  <view class="flex flex-col min-h-screen bg-white pb-16">
    <!-- Hero Header visual with active peach tone -->
    <view class="relative w-full h-80 bg-[#E7926C] flex flex-col justify-end pt-12">
      <!-- tbh Brand Header label -->
      <view class="absolute top-12 left-1/2 -translate-x-1/2 text-white font-black text-5xl tracking-widest opacity-95">
        tbh
      </view>
      
      <!-- Ambient Image Background -->
      <view class="relative w-full h-full flex items-center justify-center overflow-hidden">
        <image 
          class="absolute inset-0 w-full h-full object-cover opacity-80" 
          src="https://images.unsplash.com/photo-1545239351-ef35f43d514b?auto=format&fit=crop&w=600&q=80" 
          mode="aspectFill" 
        />
        
        <!-- Spokesperson Info Overlay -->
        <view class="absolute bottom-6 flex flex-col items-center text-center z-10 px-4">
          <text class="text-xs text-yellow-300 tracking-wider font-semibold">
            宋雨琦 | tbh家居品牌代言人
          </text>
          <text class="text-xs text-white tracking-widest mt-1 opacity-90">
            「夏日冒险岛」限定家纺系列
          </text>
          <text class="text-lg font-bold text-white tracking-widest mt-1">
            Hello Kitty × tbh
          </text>
          
          <button 
            @tap="goToProducts" 
            class="mt-4 px-6 py-2 bg-white text-black text-xs font-semibold tracking-widest rounded-none shadow-md active:bg-gray-100"
          >
            即刻选购
          </button>
        </view>
      </view>
    </view>

    <!-- New Client Register Incentive -->
    <view class="bg-black text-white py-3 px-4 flex justify-between items-center text-xs">
      <text class="tracking-wide">注册领100元新人券大礼包</text>
      <text class="underline font-semibold active:opacity-75">立即注册</text>
    </view>

    <!-- Fast QuickNav Access Icons -->
    <view class="grid grid-cols-4 gap-4 py-8 px-4 bg-white border-b border-gray-50">
      <view class="flex flex-col items-center space-y-2 active:opacity-75" @tap="goToProducts">
        <view class="w-12 h-12 rounded-full border border-gray-100 flex items-center justify-center bg-gray-50 text-xl">
          🎀
        </view>
        <text class="text-xs text-gray-700 font-medium">上新</text>
      </view>
      <view class="flex flex-col items-center space-y-2 active:opacity-75" @tap="goToProducts">
        <view class="w-12 h-12 rounded-full border border-gray-100 flex items-center justify-center bg-gray-50 text-xl">
          🌸
        </view>
        <text class="text-xs text-gray-700 font-medium">订花</text>
      </view>
      <view class="flex flex-col items-center space-y-2 active:opacity-75" @tap="goToProducts">
        <view class="w-12 h-12 rounded-full border border-gray-100 flex items-center justify-center bg-gray-50 text-xl">
          🌴
        </view>
        <text class="text-xs text-gray-700 font-medium">礼物</text>
      </view>
      <view class="flex flex-col items-center space-y-2 active:opacity-75" @tap="goToProducts">
        <view class="w-12 h-12 rounded-full border border-gray-100 flex items-center justify-center bg-gray-50 text-xl">
          🏷️
        </view>
        <text class="text-xs text-gray-700 font-medium">折扣</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
const goToProducts = () => {
  uni.switchTab({
    url: '/pages/product/list'
  });
};
<\/script>`
  },
  {
    path: 'src/pages/product/list.vue',
    name: 'list.vue',
    language: 'html',
    content: `<template>
  <view class="flex flex-col min-h-screen bg-gray-50">
    <!-- Filter Bar Header -->
    <view class="flex justify-around items-center bg-white py-3 border-b border-gray-100 sticky top-0 z-10">
      <text class="text-xs font-semibold text-black">综合</text>
      <text class="text-xs text-gray-500">新品</text>
      <view class="flex items-center text-xs text-gray-500">
        <text>价格</text>
        <text class="text-[10px] ml-0.5">⇅</text>
      </view>
      <view class="flex items-center text-xs text-gray-500">
        <text>筛选</text>
        <text class="text-[10px] ml-0.5">▽</text>
      </view>
    </view>

    <!-- 2-Column Responsive Store Grid -->
    <view class="grid grid-cols-2 gap-px bg-gray-100">
      <view 
        v-for="item in products" 
        :key="item.id" 
        class="bg-white p-4 flex flex-col justify-between"
      >
        <!-- Product Image -->
        <view class="aspect-square w-full bg-gray-50 flex items-center justify-center overflow-hidden">
          <image :src="item.image" class="w-11/12 h-11/12 object-contain" mode="aspectFit" />
        </view>

        <!-- Product Copy & Purchase Action -->
        <view class="mt-4 flex flex-col items-center text-center">
          <text class="text-xs text-gray-800 line-clamp-2 min-h-[32px] px-2 leading-relaxed">
            {{ item.title }}
          </text>
          <text class="text-xs font-bold text-black mt-2">
            ¥ {{ item.price.toLocaleString() }}
          </text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';

interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
}

// Simulated data fetching
const products = ref<Product[]>([
  {
    id: 1,
    title: '“我心童真”生日限定花束',
    price: 1680,
    image: 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=300&q=80'
  }
]);
<\/script>`
  },
  {
    path: 'src/pages.json',
    name: 'pages.json',
    language: 'json',
    content: `{
  "pages": [
    {
      "path": "pages/splash/splash",
      "style": {
        "navigationStyle": "custom"
      }
    },
    {
      "path": "pages/index/index",
      "style": {
        "navigationStyle": "custom"
      }
    },
    {
      "path": "pages/product/list",
      "style": {
        "navigationBarTitleText": "商品列表"
      }
    }
  ],
  "globalStyle": {
    "navigationBarTextStyle": "black",
    "navigationBarTitleText": "BEAST",
    "navigationBarBackgroundColor": "#F8F8F8"
  }
}`
  }
];
