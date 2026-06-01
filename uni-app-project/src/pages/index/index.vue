<template>
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
</script>
