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
/* 
 * 1. 经典奢侈品级衬线字体 (Playfair Display) 注册及 CDN 配置
 * 您只需将下面的 `url(...)` 中的 CDN 地址替换为您的真实 CDN 连通网址
 */
@font-face {
  font-family: 'Playfair Display';
  src: url('https://fonts.gstatic.com/s/playfairdisplay/v37/ur4U73o6_gY-76v9Vcf8A_gY.woff2') format('woff2'),
       url('https://your-cdn-server.com/fonts/PlayfairDisplay-Black.ttf') format('truetype');
  font-weight: 900;
  font-style: normal;
  font-display: swap;
}

@keyframes logo-loading-sweep {
  0% {
    background-position: 100% 0;
  }
  80% {
    background-position: 0% 0;
  }
  92% {
    background-position: 0% 0;
  }
  92.1% {
    background-position: 100% 0;
  }
  100% {
    background-position: 100% 0;
  }
}

.text-sweep {
  font-family: "Playfair Display", Didot, "Didot LT Pro", "Hoefler Text", "Times New Roman", serif;
  font-weight: 900;
  text-transform: uppercase;
  background: linear-gradient(to right, #2c2c2c 50%, #dbdbdb 50%);
  background-size: 200% 100%;
  background-position: 100% 0;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
  animation: logo-loading-sweep 2.6s cubic-bezier(0.16, 1, 0.3, 1) infinite;
}
</style>
