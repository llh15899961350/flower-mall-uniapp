<template>
  <view class="flex items-center justify-center min-h-screen bg-white">
    <!-- BEAST Splash Logo with luxury font-serif spacing and elegant gradient color sweeping -->
    <view class="flex items-baseline tracking-[0.25em]">
      <text class="text-4xl text-sweep">BEAST</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';

onMounted(() => {
  // 启动页展示并等待接口加载后，2.4秒后自动跳转至首页
  setTimeout(() => {
    uni.switchTab({
      url: '/pages/index/index'
    });
  }, 2400);
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,900&display=swap');

@keyframes beast-loading-sweep {
  0% {
    background-position: 100% 0;
  }
  42% {
    background-position: 50% 0;
  }
  58% {
    background-position: 50% 0;
  }
  90% {
    background-position: 0% 0;
  }
  100% {
    background-position: 0% 0;
  }
}

.text-sweep {
  font-family: "Playfair Display", Didot, "Didot LT Pro", "Hoefler Text", "Times New Roman", serif;
  font-weight: 900;
  text-transform: uppercase;
  background: linear-gradient(to right, #CCCCCC 0%, #CCCCCC 33%, #111111 50%, #CCCCCC 66%, #CCCCCC 100%);
  background-size: 300% 100%;
  background-position: 100% 0;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
  animation: beast-loading-sweep 2.8s cubic-bezier(0.25, 1, 0.5, 1) infinite;
}
</style>
