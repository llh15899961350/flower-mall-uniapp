<template>
  <view class="flex flex-col min-h-screen bg-[#F8F9FA] pb-16">
    <!-- Chic header title -->
    <view class="p-6 bg-white border-b border-gray-50 shrink-0">
      <view class="flex items-baseline space-x-1.5">
        <text class="text-lg font-serif font-bold text-black">BEAST BAG</text>
        <text class="text-xs text-gray-400 font-mono">/ 购物袋</text>
      </view>
    </view>
    
    <!-- Empty State or Item list -->
    <view class="flex-grow flex flex-col items-center justify-center p-8 text-center bg-white mt-2">
      <view class="w-20 h-20 rounded-full bg-neutral-50 flex items-center justify-center mb-4 border border-neutral-100">
        <text class="text-3xl">👜</text>
      </view>
      <text class="text-sm font-semibold text-neutral-800">高定艺术购物袋暂空</text>
      <text class="text-xs text-neutral-400 mt-2 max-w-[200px] leading-relaxed">
        去选购限定联名系列，开启您的感官艺术之旅
      </text>
      
      <button 
        @tap="goToProducts" 
        class="mt-6 px-8 py-2 bg-black text-white text-xs font-semibold tracking-widest active:opacity-90"
        style="border-radius: 0;"
      >
        去选购 COLLECTION
      </button>
    </view>
  </view>
</template>

<script setup lang="ts">
const goToProducts = () => {
  uni.switchTab({
    url: '/pages/product/list'
  });
};
</script>

<style scoped>
</style>
