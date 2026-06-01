<template>
  <view class="flex flex-col min-h-screen bg-neutral-50 pb-16">
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
        <view class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30 z-0" />
        
        <!-- Spokesperson Info Overlay -->
        <view class="absolute bottom-6 flex flex-col items-center text-center z-10 px-4">
          <view class="bg-amber-300 text-black font-semibold text-[10px] uppercase tracking-wider px-2 py-0.5 mb-1.5 rounded-[2px]">
            宋雨琦 | tbh家居品牌代言人
          </view>
          <text class="text-xs text-white tracking-widest mt-1 opacity-90 block">
            「夏日冒险岛」限定家纺系列
          </text>
          <text class="text-lg font-bold text-white tracking-widest mt-1 block">
            Hello Kitty × tbh
          </text>
          
          <button 
            @tap="goToProducts" 
            class="mt-4 px-6 py-2 bg-white text-black text-xs font-semibold tracking-widest rounded-none shadow-md active:bg-gray-100"
          >
            即刻选购 COLLECTION
          </button>
        </view>
      </view>
    </view>

    <!-- New Client Register Incentive -->
    <view class="bg-black text-white py-3 px-4 flex justify-between items-center text-xs">
      <view class="flex items-center space-x-1">
        <text class="text-yellow-300">★</text>
        <text class="tracking-wide">注册领100元新人券大礼包</text>
      </view>
      <text class="underline font-semibold active:opacity-75" @tap="registerUser">立即领</text>
    </view>

    <!-- Fast QuickNav Access Icons -->
    <view class="grid grid-cols-4 gap-4 py-6 px-4 bg-white border-b border-gray-50">
      <view class="flex flex-col items-center space-y-1.5 active:opacity-75" @tap="categorySelect('全部')">
        <view class="w-13 h-13 rounded-full border border-gray-100 flex items-center justify-center bg-gray-50 text-2xl">
          🎀
        </view>
        <text class="text-[11px] text-gray-700 font-medium">上新</text>
      </view>
      <view class="flex flex-col items-center space-y-1.5 active:opacity-75" @tap="categorySelect('花艺')">
        <view class="w-13 h-13 rounded-full border border-gray-100 flex items-center justify-center bg-gray-50 text-2xl">
          🌸
        </view>
        <text class="text-[11px] text-gray-700 font-medium">花艺</text>
      </view>
      <view class="flex flex-col items-center space-y-1.5 active:opacity-75" @tap="categorySelect('香氛')">
        <view class="w-13 h-13 rounded-full border border-gray-100 flex items-center justify-center bg-gray-50 text-2xl">
          🌴
        </view>
        <text class="text-[11px] text-gray-700 font-medium">香氛</text>
      </view>
      <view class="flex flex-col items-center space-y-1.5 active:opacity-75" @tap="categorySelect('床品')">
        <view class="w-13 h-13 rounded-full border border-gray-100 flex items-center justify-center bg-gray-50 text-2xl">
          🏷️
        </view>
        <text class="text-[11px] text-gray-700 font-medium font-bold">床品</text>
      </view>
    </view>

    <!-- Hot Recommendations Grid -->
    <view class="p-4 bg-neutral-50 flex-1">
      <view class="flex items-center justify-between mb-3.5">
        <view class="flex items-baseline space-x-1.5">
          <text class="text-xs font-serif font-bold text-black border-l-2 border-black pl-1.5">EDITOR'S PICK</text>
          <text class="text-[10px] text-gray-400 font-mono tracking-tighter">/ 本季主推</text>
        </view>
        <text @tap="goToProducts" class="text-[10px] text-neutral-500 active:text-black">查看全部 &rarr;</text>
      </view>

      <view class="space-y-4">
        <!-- Featured Big Spotlight Banner item -->
        <view 
          class="bg-white rounded-xl overflow-hidden border border-neutral-100 shadow-sm active:opacity-90"
          @tap="viewProductDetail(1)"
        >
          <view class="relative aspect-video w-full overflow-hidden bg-neutral-100">
            <image 
              class="w-full h-full object-cover" 
              src="https://images.unsplash.com/photo-1561181286-d3fee7d55364?q=80&w=600&auto=format&fit=crop" 
              mode="aspectFill"
            />
            <view class="absolute top-3 left-3 bg-red-500 text-white font-bold text-[9px] px-2 py-0.5 rounded-sm">
              LIMITED
            </view>
          </view>
          <view class="p-4 flex justify-between items-center">
            <view>
              <text class="font-semibold text-xs text-neutral-800 line-clamp-1 block text-left">Hello Kitty × tbh 「我心童真」生日限定花束</text>
              <text class="text-[10px] text-neutral-400 mt-0.5 font-mono tracking-tight block text-left">Classic Floral Romance</text>
            </view>
            <view class="text-right shrink-0 ml-2">
              <text class="text-xs font-bold text-neutral-950 font-mono block">¥1,680</text>
            </view>
          </view>
        </view>

        <!-- Side by side mini list recommended slots -->
        <view class="grid grid-cols-2 gap-3.5">
          <view 
            class="bg-white rounded-lg p-3 border border-neutral-100 flex flex-col justify-between active:opacity-95"
            @tap="viewProductDetail(3)"
          >
            <view class="aspect-square w-full rounded bg-neutral-50 flex items-center justify-center p-1 relative">
              <image class="max-h-full max-w-full" src="https://images.unsplash.com/photo-1577937927133-66ef06acdf18?q=80&w=600&auto=format&fit=crop" mode="aspectFit" />
              <text class="absolute bottom-1 right-1 text-[9px] font-serif font-black bg-black/5 text-black px-1 rounded-xs">tbh</text>
            </view>
            <view class="mt-2 text-center">
              <text class="text-[10px] text-gray-700 line-clamp-1 block text-left">tbh「夏日冒险岛」不锈钢吸管保温杯</text>
              <view class="mt-1 flex items-center space-x-1.5 justify-start">
                <text class="text-xs font-bold text-black font-mono">¥269</text>
                <text class="text-[9px] text-gray-400 line-through font-mono">¥299</text>
              </view>
            </view>
          </view>

          <view 
            class="bg-white rounded-lg p-3 border border-neutral-100 flex flex-col justify-between active:opacity-95"
            @tap="viewProductDetail(4)"
          >
            <view class="aspect-square w-full rounded bg-neutral-50 flex items-center justify-center p-1 relative">
              <image class="max-h-full max-w-full" src="https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=600&auto=format&fit=crop" mode="aspectFit" />
              <text class="absolute bottom-1 right-1 text-[9px] font-serif font-black bg-black/5 text-black px-1 rounded-xs">tbh</text>
            </view>
            <view class="mt-2 text-center">
              <text class="text-[10px] text-gray-700 line-clamp-1 block text-left">Hello Kitty × tbh 全棉四件套</text>
              <view class="mt-1 flex items-center space-x-1.5 justify-start">
                <text class="text-xs font-bold text-black font-mono">¥999</text>
                <text class="text-[9px] text-gray-400 line-through font-mono">¥1,299</text>
              </view>
            </view>
          </view>
        </view>
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

const categorySelect = (category: string) => {
  uni.setStorageSync('activeCategory', category);
  uni.switchTab({
    url: '/pages/product/list'
  });
};

const registerUser = () => {
  uni.showToast({
    title: '微信授权注册成功，新人优惠券已存入卡包！',
    icon: 'success',
    duration: 2000
  });
};

const viewProductDetail = (id: number) => {
  uni.setStorageSync('selectedProductId', id);
  uni.switchTab({
    url: '/pages/product/list'
  });
};
</script>
