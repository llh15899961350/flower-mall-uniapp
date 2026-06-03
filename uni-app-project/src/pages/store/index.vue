<template>
  <view class="flex flex-col min-h-screen bg-[#FFFFFF] p-4">
    <!-- Store Card Content -->
    <view class="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm mb-4">
      <view class="aspect-video w-full rounded-xl bg-gray-100 overflow-hidden relative mb-4">
        <image 
          class="w-full h-full object-cover" 
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=600&q=80" 
          mode="aspectFill"
        />
        <view class="absolute inset-0 bg-black/30 flex items-center justify-center">
          <text class="text-white text-sm font-bold tracking-[0.2em]">THE BEAST ART LIVING</text>
        </view>
      </view>

      <text class="text-xs font-bold text-gray-900 uppercase tracking-widest block mb-1">野兽派高定制艺空间 (上海桃江路店)</text>
      <text class="text-[11px] text-gray-500 leading-relaxed block mb-3">
        作为野兽派的起点，桃江路旗舰店融花艺、高级香散与特等生活寝具于一堂快享。
      </text>
      <view class="flex gap-2">
        <button 
          @click="makePhoneCall('021-5432XXXX')"
          class="flex-1 py-2 border border-black rounded text-[10px] font-bold bg-transparent text-black flex items-center justify-center"
        >
          预约专属艺术管家
        </button>
        <button 
          @click="openMap(31.2096, 121.4475, '野兽派上海桃江路店')"
          class="flex-1 py-1.5 bg-black text-white rounded text-[10px] font-bold flex items-center justify-center"
        >
          导航到店
        </button>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
const makePhoneCall = (phoneNumber: string) => {
  uni.makePhoneCall({ phoneNumber });
};

const openMap = (latitude: number, longitude: number, name: string) => {
  uni.openLocation({
    latitude,
    longitude,
    name,
    address: '上海市徐汇区桃江路15号'
  });
};
</script>
