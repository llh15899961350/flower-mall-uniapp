<template>
  <view class="flex flex-col min-h-screen bg-[#f9f9f9] p-4">
    <!-- Chic Member Card -->
    <view class="bg-gradient-to-br from-neutral-900 to-stone-880 text-stone-200 rounded-2xl p-5 shadow-lg relative overflow-hidden mb-4">
      <view class="flex justify-between items-start mb-6">
        <view>
          <text class="text-[10px] tracking-widest font-mono text-stone-400 block">BEAST BLACK UNIQUE</text>
          <text class="text-base font-serif font-black tracking-wider text-white mt-1 block">野兽派高级艺术金卡</text>
        </view>
      </view>
      <view class="flex justify-between items-end mt-4">
        <view>
          <text class="text-[9px] text-stone-400 font-mono block">AUTHORIZED VISITOR ID</text>
          <text class="font-mono text-xs text-white tracking-widest block font-bold">NO. 8881-2290-6611</text>
        </view>
        <view class="bg-white/10 px-2 py-0.5 rounded">
          <text class="text-[10px] text-white font-semibold">专享92折特权</text>
        </view>
      </view>
    </view>

    <!-- Services -->
    <view class="bg-white rounded-xl border border-gray-100 overflow-hidden">
      <view class="p-4 border-b border-gray-50 flex justify-between" @click="showToast('正在加载高级大客户接口...')">
        <text class="text-xs font-bold text-gray-700">我的高定特权与订单</text>
        <text class="text-xs text-neutral-400">SF速递</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
const showToast = (title: string) => {
  uni.showToast({ title, icon: 'none' });
};
</script>
