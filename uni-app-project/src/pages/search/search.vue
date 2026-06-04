<template>
  <view class="flex flex-col min-h-screen bg-white">
    <!-- Custom Navigation Bar Header (Matches high fidelity screenshot layout exactly) -->
    <view class="fixed left-0 right-0 top-0 z-50 flex flex-col bg-white border-b border-neutral-100">
      <!-- 1. Status Bar space placeholder -->
      <view :style="{ height: statusBarHeight + 'px' }"></view>
      
      <!-- 2. Screen Navigation Bar Row -->
      <view class="flex items-center justify-between px-4 pb-1" :style="{ height: navBarHeight + 'px' }">
        <!-- Back Arrow Button on Left -->
        <view 
          @tap="goBack" 
          class="w-[80px] flex items-center justify-start active:opacity-75 cursor-pointer py-1"
        >
          <text class="text-xl font-medium text-neutral-800 font-sans">←</text>
        </view>
        
        <!-- Center centered title label "搜索" -->
        <view class="flex-grow text-center">
          <text class="text-sm font-semibold text-neutral-900 font-sans">搜索</text>
        </view>
        
        <!-- Right side Capsule button alignment spacer of 80px -->
        <view class="w-[80px] flex items-center justify-end">
          <!-- Leaving empty space so native WeChat Capsule overlaps cleanly -->
        </view>
      </view>
    </view>

    <!-- Scrollable Page Container pushed down by (statusBarHeight + navBarHeight) -->
    <view :style="{ paddingTop: (statusBarHeight + navBarHeight) + 'px' }" class="flex-grow flex flex-col">
      <!-- Search Input Box -->
      <view class="p-4 flex flex-col">
        <view class="relative mb-6">
          <text class="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400 font-sans text-xs">🔍</text>
          <input 
            type="text" 
            v-model="searchQuery" 
            placeholder="搜索全网商品"
            class="w-full h-10 pl-9 pr-9 bg-[#fbfbfb] rounded-lg text-xs font-medium text-neutral-800 placeholder-neutral-400 border border-neutral-100 focus:bg-white focus:border-neutral-300 font-sans"
            @confirm="onSearchTrigger"
            confirm-type="search"
          />
          <text 
            v-if="searchQuery" 
            @tap="clearSearch"
            class="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 text-sm font-bold cursor-pointer p-1"
          >×</text>
        </view>

        <!-- Search Discovery / Default Tags -->
        <view v-if="!searchQuery" class="flex flex-col">
          <text class="text-[11px] font-bold tracking-wider text-neutral-400 uppercase block mb-3 text-left">搜索发现</text>
          <view class="flex flex-wrap gap-2.5">
            <view 
              v-for="(tag, idx) in hotTags" 
              :key="idx"
              @tap="applyHotTag(tag.matches)"
              class="px-3.5 py-1.5 rounded-sm text-xs font-semibold border transition-all active:scale-95 cursor-pointer font-sans"
              :style="{
                borderColor: tag.colorHex ? '#F4DFD4' : '#F1F3F5',
                color: tag.colorHex || '#2C2C2C',
                backgroundColor: tag.colorHex ? '#FDFBF7' : '#FFFFFF'
              }"
            >
              {{ tag.text }}
            </view>
          </view>
        </view>

        <!-- Search Results Listings -->
        <view v-else class="flex flex-col">
          <view class="flex items-center justify-between text-[10px] text-neutral-400 font-bold tracking-wider uppercase mb-3">
            <text>包含 &ldquo;{{ searchQuery }}&rdquo; 的商品</text>
            <text @tap="clearSearch" class="font-semibold text-neutral-500 active:text-black">清除</text>
          </view>

          <!-- No matched results placeholder -->
          <view v-if="matchedProducts.length === 0" class="py-20 text-center text-neutral-400">
            <text class="block text-2xl mb-2">🔍</text>
            <text class="text-xs font-medium">未找到相关的野兽派奢品</text>
          </view>

          <!-- Product Item blocks -->
          <view v-else class="flex flex-col space-y-3 pb-4">
            <view 
              v-for="prod in matchedProducts" 
              :key="prod.id"
              @tap="viewDetail(prod)"
              class="flex space-x-3 bg-neutral-50/50 p-2.5 rounded-lg border border-neutral-100 cursor-pointer"
            >
              <view class="w-16 h-16 rounded-md bg-white border border-neutral-100 flex items-center justify-center p-1 shrink-0 overflow-hidden">
                <image :src="prod.image" class="max-h-full max-w-full" mode="aspectFit" />
              </view>
              <view class="flex-grow flex flex-col justify-between py-0.5">
                <view>
                  <text class="text-xs font-semibold text-neutral-800 line-clamp-1 block text-left font-sans">{{ prod.title }}</text>
                  <text class="text-[10px] text-neutral-400 mt-0.5 line-clamp-1 block text-left font-sans">{{ prod.subtitle }}</text>
                </view>
                <view class="flex justify-between items-baseline">
                  <text class="text-xs font-bold text-neutral-900 font-mono">¥{{ prod.price.toLocaleString() }}</text>
                  <text class="text-[9px] bg-neutral-100 text-neutral-500 px-1.5 py-0.5 rounded font-sans">{{ prod.category }}</text>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';

interface Product {
  id: number;
  title: string;
  subtitle?: string;
  price: number;
  image: string;
  category: string;
  description: string;
}

interface HotTag {
  text: string;
  colorHex?: string;
  matches: string;
}

const statusBarHeight = ref<number>(44);
const navBarHeight = ref<number>(44);

onMounted(() => {
  try {
    const sysInfo = uni.getSystemInfoSync();
    if (sysInfo.statusBarHeight) {
      statusBarHeight.value = sysInfo.statusBarHeight;
    }
  } catch (e) {
    // Graceful fallback
  }
});

const goBack = () => {
  uni.navigateBack();
};

const searchQuery = ref<string>('');

const hotTags = ref<HotTag[]>([
  { text: "黑皮Kitty系列", colorHex: "#E7926C", matches: "Kitty" },
  { text: "端午节限定", colorHex: "#E7926C", matches: "限定" },
  { text: "杯子", matches: "杯" },
  { text: "拖鞋", matches: "拖鞋" },
  { text: "睡衣", matches: "睡衣" },
  { text: "Hello Kitty", matches: "Hello Kitty" }
]);

const products = ref<Product[]>([
  {
    id: 1,
    title: 'Hello Kitty × tbh 「我心童真」生日限定花束',
    subtitle: 'Classic Floral Romance',
    price: 1680,
    image: 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?q=80&w=600&auto=format&fit=crop',
    category: '花艺',
    description: '野兽派精选「我心童真」联名款花束。'
  },
  {
    id: 2,
    title: 'Hello Kitty × tbh 「我心童真」生日限定花桶-小号',
    subtitle: 'Tabletop Blossom Box',
    price: 2280,
    image: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?q=80&w=600&auto=format&fit=crop',
    category: '花艺',
    description: '采用野兽派标志性的圆柱高定皮质花桶'
  },
  {
    id: 3,
    title: 'tbh「夏日冒险岛」不锈钢吸管保温杯 (含mini包挂件)',
    subtitle: 'Adventure Tumbler',
    price: 269,
    image: 'https://images.unsplash.com/photo-1577937927133-66ef06acdf18?q=80&w=600&auto=format&fit=crop',
    category: '家居',
    description: '双层食品级304不锈钢抽真空设计'
  },
  {
    id: 4,
    title: 'Hello Kitty × tbh 全棉高密缎纹印花四件套-黄色豹纹',
    subtitle: 'Sateen Bedding Sheet Set',
    price: 999,
    image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=600&auto=format&fit=crop',
    category: '床品',
    description: '100%长绒棉，80支五枚缎纹'
  },
  {
    id: 5,
    title: 'tbh 莫代尔经典真丝镶边家居睡衣套装',
    subtitle: 'Silk-Trim Lounge Pajamas',
    price: 590,
    image: 'https://images.unsplash.com/photo-1598121696010-039d6406028d?q=80&w=600&auto=format&fit=crop',
    category: '家居',
    description: '采用高支莫代尔纤维，并融入天然桑蚕丝细密收口滚边'
  }
]);

const matchedProducts = computed<Product[]>(() => {
  if (!searchQuery.value) return [];
  const query = searchQuery.value.toLowerCase().trim();
  return products.value.filter(p => 
    p.title.toLowerCase().includes(query) ||
    p.category.toLowerCase().includes(query) ||
    (p.subtitle && p.subtitle.toLowerCase().includes(query))
  );
});

const onSearchTrigger = () => {
  uni.showToast({ title: '已执行精品智检搜索', icon: 'none' });
};

const clearSearch = () => {
  searchQuery.value = '';
};

const applyHotTag = (matches: string) => {
  searchQuery.value = matches;
};

const viewDetail = (prod: Product) => {
  uni.setStorageSync('selectedProductId', prod.id);
  uni.switchTab({
    url: '/pages/product/list'
  });
};
</script>
