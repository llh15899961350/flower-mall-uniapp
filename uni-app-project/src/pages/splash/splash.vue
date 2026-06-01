<template>
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
</script>
