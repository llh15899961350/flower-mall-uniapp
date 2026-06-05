import * as Vue from '../node_modules/vue';

// Re-export standard APIs from the real Vue package
export {
  // Core reactivity primitives
  ref,
  reactive,
  computed,
  watch,
  watchEffect,
  shallowRef,
  shallowReactive,
  toRef,
  toRefs,
  isRef,
  isReactive,
  isProxy,
  toRaw,
  markRaw,
  unref,
  customRef,
  triggerRef,
  
  // Standard component lifecycles
  onMounted,
  onUnmounted,
  onUpdated,
  onBeforeMount,
  onBeforeUnmount,
  onBeforeUpdate,
  onActivated,
  onDeactivated,
  onErrorCaptured,
  
  // Provide/inject
  provide,
  inject,
  
  // Rendering APIs
  h,
  defineComponent,
  defineAsyncComponent,
  getCurrentInstance,
  nextTick,
  
  // Bootstrap & SSR APIs
  createApp,
  createSSRApp
} from '../node_modules/vue';

// Defensively shim the custom internal helpers demanded by Uni-App
export const isInSSRComponentSetup = function(): boolean {
  return false;
};

export const injectHook = function(): any {
  return null;
};
