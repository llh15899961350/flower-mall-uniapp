<template>
  <view class="nav-bar-container">
    <!-- Status Bar Spacer (Simulating typical Notch height) -->
    <view class="status-bar-spacer" />
    
    <!-- Header Bar Contents -->
    <view class="nav-bar-content">
      <!-- Left Branding: K-HEI with matching text-sweep animation and Playfair Display font -->
      <view class="nav-bar-left">
        <text class="logo-title text-sweep">K-HEI</text>
      </view>
      
      <!-- Center Title (kept clean and subtle or empty based on specification screenshot) -->
      <view class="nav-bar-center">
        <!-- Optional title can go here, but in brand screenshot it's blank or clean -->
      </view>
      
      <!-- Right Side WeChat Translucent Glassmorphism Capsule Menu (红色框右上角半透明胶囊) -->
      <view class="nav-bar-right">
        <view class="wechat-capsule">
          <view class="capsule-button capsule-menu">
            <view class="menu-dot" />
            <view class="menu-dot" />
            <view class="menu-dot" />
          </view>
          <view class="capsule-divider" />
          <view class="capsule-button capsule-exit">
            <view class="exit-circle-outer">
              <view class="exit-circle-inner" />
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
// Custom navigation bar component
</script>

<style scoped>
@font-face {
  font-family: "Playfair Display";
  src: url("http://cloud.135006.xyz/fonts/PlayfairDisplay-Black.ttf")
       format("truetype");
  font-weight: 900;
}

.nav-bar-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 999;
  background-color: transparent;
  pointer-events: none;
}

.status-bar-spacer {
  height: 44px; /* iOS Status bar standard height */
  width: 100%;
}

.nav-bar-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 48px;
  padding: 0 16px;
  width: 100%;
  box-sizing: border-box;
  pointer-events: auto;
}

.nav-bar-left {
  display: flex;
  align-items: center;
  flex: 1;
}

.logo-title {
  font-size: 20px;
  letter-spacing: 0.1em;
}

.nav-bar-center {
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
}

.nav-bar-right {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  flex: 1;
}

/* 微信高定右上角半透明胶囊 (Frosted Glassmorphism Style) */
.wechat-capsule {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 84px;
  height: 32px;
  border-radius: 16px;
  /* Semi-transparent white backing with a delicate border and backdrop-blur */
  background-color: rgba(255, 255, 255, 0.32);
  border: 1px solid rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  padding: 0 10px;
  box-sizing: border-box;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.capsule-button {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.capsule-menu {
  display: flex;
  gap: 3px;
  width: 24px;
}

.menu-dot {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background-color: #111111;
  opacity: 0.9;
}

.capsule-divider {
  width: 1px;
  height: 14px;
  background-color: rgba(0, 0, 0, 0.12);
}

.capsule-exit {
  width: 24px;
}

.exit-circle-outer {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 15px;
  height: 15px;
  border: 1.5px solid #111111;
  border-radius: 50%;
  opacity: 0.9;
}

.exit-circle-inner {
  width: 6px;
  height: 6px;
  background-color: #111111;
  border-radius: 50%;
}

/* K-HEI Font Sweeping Keyframe & Styles */
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
