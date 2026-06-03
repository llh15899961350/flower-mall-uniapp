<template>
  <view class="flex flex-col min-h-screen bg-white pb-16">
    <nav-bar title="用户中心" />
    <!-- Hero Header visual with active bedroom background and transparent overlay for custom navigation -->
    <view class="relative w-full h-[360px] flex flex-col justify-between overflow-hidden">
      <!-- Ambient Image Background -->
      <image class="absolute inset-0 w-full h-full object-cover"
        src="https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=800&q=80"
        mode="aspectFill" />
      <!-- Transparent subtle gradient vignette -->
      <view class="absolute inset-0 bg-black/15 z-0" />
    </view>
     <!-- 页面内容 -->
    <view class="pt-[1300px] px-4">
      <text class="text-black text-lg">页面内容</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import NavBar from '@/components/nav-bar/index.vue'

</script>
