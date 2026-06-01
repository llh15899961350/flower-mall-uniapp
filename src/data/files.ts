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
}

/* 经典高定启动页「由左向右由灰变黑」渐变过渡动效 */
.text-sweep {
  background: linear-gradient(to right, #111111 0%, #111111 50%, #e5e5e5 50%, #e5e5e5 100%);
  background-size: 200% 100%;
  background-position: 100% 0;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
  transition: background-position 1500ms cubic-bezier(0.25, 1, 0.5, 1);
}

.text-sweep-active {
  background-position: 0 0;
}`
  },
  {
    path: 'src/pages/splash/splash.vue',
    name: 'splash.vue',
    language: 'html',
    content: `<template>
  <view class="flex items-center justify-center min-h-screen bg-white">
    <!-- BEAST Splash Logo with luxury font-serif spacing and elegant gradient color sweeping -->
    <view class="flex items-baseline tracking-[0.25em]">
      <text 
        class="text-4xl font-serif font-black text-sweep"
        :class="{ 'text-sweep-active': isLoaded }"
      >BEAST</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

const isLoaded = ref(false);

onMounted(() => {
  // 模拟当接口数据加载完成时，触发状态改变切换字色，所有文本由左向右渐变过渡到纯黑色
  setTimeout(() => {
    isLoaded.value = true;
  }, 600);

  // 启动页展示并等待接口加载后，2.4秒后自动跳转至首页
  setTimeout(() => {
    uni.switchTab({
      url: '/pages/index/index'
    });
  }, 2400);
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
  <view class="flex flex-col min-h-screen bg-gray-50 pb-12 animate-fade-in">
    <!-- Filter Bar Header -->
    <view class="flex justify-around items-center bg-white py-3 border-b border-gray-100 sticky top-0 z-10">
      <text 
        @tap="changeCategory('全部')" 
        class="text-xs font-semibold" 
        :class="currentCategory === '全部' ? 'text-black font-bold border-b-2 border-black pb-1' : 'text-gray-500'"
      >
        综合
      </text>
      <text 
        @tap="changeCategory('花艺')" 
        class="text-xs" 
        :class="currentCategory === '花艺' ? 'text-black font-bold' : 'text-gray-500'"
      >
        新品花艺
      </text>
      <view @tap="togglePriceSort" class="flex items-center text-xs text-gray-500">
        <text :class="priceSort !== 'none' ? 'text-black font-semibold' : ''">价格</text>
        <text class="text-[10px] ml-0.5">{{ priceSort === 'asc' ? '▲' : priceSort === 'desc' ? '▼' : '⇅' }}</text>
      </view>
      <view @tap="showFilterModal" class="flex items-center text-xs text-gray-500">
        <text>筛选</text>
        <text class="text-[10px] ml-0.5">▽</text>
      </view>
    </view>

    <!-- 2-Column Responsive Store Grid -->
    <view class="grid grid-cols-2 gap-px bg-gray-200">
      <view 
        v-for="item in filteredProducts" 
        :key="item.id" 
        class="bg-white p-4 flex flex-col justify-between active:bg-gray-50/50"
        @tap="viewDetail(item)"
      >
        <!-- Product Image -->
        <view class="aspect-square w-full bg-gray-50 flex items-center justify-center overflow-hidden relative">
          <image :src="item.image" class="w-11/12 h-11/12" mode="aspectFit" />
          <text v-if="item.originalPrice" class="absolute top-2 left-2 bg-black text-white text-[8px] px-1.5 py-0.5 font-bold uppercase tracking-wide">
            LIMITED
          </text>
        </view>

        <!-- Product Copy & Purchase Action -->
        <view class="mt-4 flex flex-col">
          <text class="text-xs text-gray-800 line-clamp-2 min-h-[36px] px-1 leading-relaxed text-center">
            {{ item.title }}
          </text>
          <text v-if="item.subtitle" class="text-[9px] text-gray-400 text-center mt-0.5 block truncate">{{ item.subtitle }}</text>
          
          <view class="mt-3 flex items-baseline justify-between px-1">
            <view class="flex items-baseline space-x-1">
              <text class="text-xs font-bold text-black font-mono">¥{{ item.price }}</text>
              <text v-if="item.originalPrice" class="text-[9px] text-gray-400 line-through font-mono ml-1">¥{{ item.originalPrice }}</text>
            </view>
            <view class="w-5 h-5 rounded-full bg-black text-white flex items-center justify-center text-xs font-bold">+</view>
          </view>
        </view>
      </view>
    </view>

    <!-- Detailed Product Bottom Sheet Drawer -->
    <view v-if="selectedProduct" class="fixed inset-0 z-50">
      <view class="absolute inset-0 bg-black/60 transition-opacity" @tap="selectedProduct = null" />
      <view class="absolute bottom-0 inset-x-0 bg-white rounded-t-3xl p-5 pb-8 flex flex-col max-h-[85%] overflow-y-auto">
        <view class="flex space-x-4 border-b border-gray-100 pb-4 relative">
          <image :src="selectedProduct.image" class="w-20 h-20 bg-gray-50 border border-gray-100 p-1" mode="aspectFit" />
          <view class="flex-grow flex flex-col justify-end">
            <text class="text-sm font-bold text-gray-900 leading-snug line-clamp-2">{{ selectedProduct.title }}</text>
            <text class="text-xs font-mono font-bold text-black mt-1.5">¥{{ selectedProduct.price }}</text>
            <text class="text-[10.5px] text-gray-400 mt-1">已选: {{ selectedColor }} / {{ selectedSpec }}</text>
          </view>
        </view>

        <!-- Spec Selections -->
        <view v-if="selectedProduct.colors && selectedProduct.colors.length" class="py-4 border-b border-gray-100">
          <text class="text-xs text-gray-700 block mb-2 font-medium">款式选择 Choice</text>
          <view class="flex flex-wrap gap-2">
            <text 
              v-for="color in selectedProduct.colors" 
              :key="color"
              @tap="selectedColor = color"
              class="text-xs px-3 py-1.5 border"
              :class="selectedColor === color ? 'bg-black text-white border-black font-semibold' : 'bg-gray-50 text-gray-600 border-gray-200'"
            >
              {{ color }}
            </text>
          </view>
        </view>

        <view v-if="selectedProduct.specs && selectedProduct.specs.length" class="py-4 border-b border-gray-100">
          <text class="text-xs text-gray-700 block mb-2 font-medium">规格说明 Dimensions</text>
          <view class="flex flex-wrap gap-2">
            <text 
              v-for="spec in selectedProduct.specs" 
              :key="spec"
              @tap="selectedSpec = spec"
              class="text-xs px-3 py-1.5 border"
              :class="selectedSpec === spec ? 'bg-black text-white border-black font-semibold' : 'bg-gray-50 text-gray-600 border-gray-200'"
            >
              {{ spec }}
            </text>
          </view>
        </view>

        <view class="py-4 flex justify-between items-center">
          <text class="text-xs text-gray-700 font-medium">购买数量 Quantity</text>
          <view class="flex border border-gray-200">
            <text @tap="buyQuantity = Math.max(1, buyQuantity - 1)" class="px-3 py-1 text-gray-500 font-bold">-</text>
            <text class="px-4 py-1 text-xs font-bold leading-relaxed font-mono">{{ buyQuantity }}</text>
            <text @tap="buyQuantity = buyQuantity + 1" class="px-3 py-1 text-gray-500 font-bold">+</text>
          </view>
        </view>

        <!-- Bottom trigger buttons -->
        <view class="flex gap-3 mt-4">
          <button @tap="addToCart" class="flex-1 py-3 border border-black text-xs font-bold tracking-widest bg-white">加入艺术袋</button>
          <button @tap="checkoutImmediate" class="flex-grow py-3 bg-black text-white text-xs font-bold tracking-widest">立即结算</button>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

interface Product {
  id: number;
  title: string;
  subtitle?: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  description: string;
  colors?: string[];
  specs?: string[];
}

// 联名艺术馆专属8款高定商品清单
const products = ref<Product[]>([
  {
    id: 1,
    title: 'Hello Kitty × tbh 「我心童真」生日限定花束',
    subtitle: 'Classic Floral Romance',
    price: 1680,
    originalPrice: 1880,
    image: 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?q=80&w=600&auto=format&fit=crop',
    category: '花艺',
    description: '野兽派精选「我心童真」联名款花束。搭配经典红、奶油粉玫瑰，以及高定绣球花，融合Hello Kitty优雅蝴蝶结丝带。',
    colors: ['红粉初心', '经典复古'],
    specs: ['大号高约60cm', '精选昆明直供特级玫瑰']
  },
  {
    id: 2,
    title: 'Hello Kitty × tbh 「我心童真」生日限定花桶-小号',
    subtitle: 'Tabletop Blossom Box',
    price: 2280,
    originalPrice: 2480,
    image: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?q=80&w=600&auto=format&fit=crop',
    category: '花艺',
    description: '采用野兽派标志性的圆柱高定皮质花桶，将满满的暖色玫瑰和玲珑配草锁入其中。点缀特制Hello Kitty金属电镀挂饰。',
    colors: ['香槟金桶', '珊瑚粉桶'],
    specs: ['精巧圆桶直径22cm']
  },
  {
    id: 3,
    title: 'tbh「夏日冒险岛」不锈钢吸管保温杯 (含mini包挂件)',
    subtitle: 'Adventure Tumbler',
    price: 269,
    originalPrice: 299,
    image: 'https://images.unsplash.com/photo-1577937927133-66ef06acdf18?q=80&w=600&auto=format&fit=crop',
    category: '家居',
    description: '双层食品级304不锈钢抽真空设计，强效保温。印有Hello Kitty探险家限定手绘。附赠Mini羽绒杯套挂件。',
    colors: ['珊瑚粉 700ml', '椰林绿 700ml'],
    specs: ['双层304不锈钢', 'Tritan食品级吸管']
  },
  {
    id: 4,
    title: 'Hello Kitty × tbh 全棉高密缎纹印花四件套-黄色豹纹',
    subtitle: 'Sateen Bedding Sheet Set',
    price: 999,
    originalPrice: 1299,
    image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=600&auto=format&fit=crop',
    category: '床品',
    description: '100%长绒棉，80支五枚缎纹，交织出丝缎般的光泽。狂野的黄色豹纹与可爱Kitty头印花趣味碰撞。',
    colors: ['黄色豹纹-双人1.8米', '香草奶黄-单人1.5米'],
    specs: ['100%长绒棉', '80支高密五枚缎']
  },
  {
    id: 5,
    title: 'tbh 莫代尔经典真丝镶边家居睡衣套装',
    subtitle: 'Silk-Trim Lounge Pajamas',
    price: 590,
    originalPrice: 690,
    image: 'https://images.unsplash.com/photo-1598121696010-039d6406028d?q=80&w=600&auto=format&fit=crop',
    category: '家居',
    description: '采用高支莫代尔纤维，融入天然桑蚕丝细密收口滚边，实现丝滑糯感，透气慵懒随性美。',
    colors: ['浅杏白', '复古藏青'],
    specs: ['莫代尔 + 桑蚕丝镶边']
  }
]);

const currentCategory = ref('全部');
const priceSort = ref<'none' | 'asc' | 'desc'>('none');
const selectedProduct = ref<Product | null>(null);
const selectedColor = ref('');
const selectedSpec = ref('');
const buyQuantity = ref(1);

const changeCategory = (cat: string) => {
  currentCategory.value = cat;
};

const togglePriceSort = () => {
  if (priceSort.value === 'none') priceSort.value = 'asc';
  else if (priceSort.value === 'asc') priceSort.value = 'desc';
  else priceSort.value = 'none';
};

const filteredProducts = computed(() => {
  let list = products.value;
  if (currentCategory.value !== '全部') {
    list = list.filter(p => p.category === currentCategory.value);
  }
  if (priceSort.value === 'asc') {
    list = [...list].sort((a, b) => a.price - b.price);
  } else if (priceSort.value === 'desc') {
    list = [...list].sort((a, b) => b.price - a.price);
  }
  return list;
});

const viewDetail = (item: Product) => {
  selectedProduct.value = item;
  selectedColor.value = item.colors?.[0] || '默认款';
  selectedSpec.value = item.specs?.[0] || '标准版';
  buyQuantity.value = 1;
};

const showFilterModal = () => {
  uni.showToast({ title: '已加载高级专属推荐过滤器', icon: 'none' });
};

const addToCart = () => {
  uni.showToast({ title: '已添加至艺术袋', icon: 'success' });
  selectedProduct.value = null;
};

const checkoutImmediate = () => {
  uni.showToast({ title: '正在调起微信支付...', icon: 'loading' });
  setTimeout(() => {
    uni.showToast({ title: '高定商品支付订购成功！', icon: 'success' });
    selectedProduct.value = null;
  }, 1000);
};
</script>`
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
