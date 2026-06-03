<template>
    <view class="fixed left-0 right-0 top-0 z-50" :style="navStyle">
        <view class="relative h-full">
            <!-- 左侧文字 -->
            <view class="absolute left-4 flex items-center" :style="{ top: `${menuTop - statusBarHeight}px` }">
                <text class="text-lg font-bold text-white" :style="titleStyle">
                    {{ title }}
                </text>
            </view>
        </view>
    </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useNavBar } from '@/hooks'

import { NavbarInfo } from '@/hooks'

defineOptions({
    name: 'NavBar'
})

defineProps<{
    title: string
}>()

const navbar: NavbarInfo = useNavBar()
const { statusBarHeight, menuHeight, navBarHeight, menuTop } = navbar
const navStyle = computed(() => ({

    height: `${menuHeight}px`,
    lineHeight: `${menuHeight}px`
}))

const titleStyle = computed(() => ({
    height: `${navbar.navBarHeight}px`,
    paddingTop: `${statusBarHeight}px`,
    backgroundColor: 'transparent'
}))
</script>