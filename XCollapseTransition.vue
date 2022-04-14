<template>
  <transition v-bind="listeners">
    <!-- 当visible的值发生改变时，过渡组件的监听器就会触发 -->
    <div v-show="visible" class="x-collapse-transition">
      <slot/>
    </div>
  </transition>
</template>

<script lang="ts">
/* eslint-disable no-return-assign */
import { defineComponent } from 'vue'

const listeners = {
  // 元素由隐藏变为可见
  onEnter(/** @type {HTMLElement} */ el: any) {
    el.style.height = 'auto' // 将高度设为auto，是为了获取该元素的计算高度
    const endHeight = window.getComputedStyle(el).height // 计算高度
    el.style.height = '0px' // 将高度再设置为0
    // eslint-disable-next-line no-unused-expressions
    el.offsetHeight // 强制重绘，重绘后再改变高度才会产生动画
    el.style.height = endHeight // 设置为计算高度
  },
  onAfterEnter(/** @type {HTMLElement} */ el: any) {
    el.style.height = null // 过渡进入之后，将高度恢复为null
  },
  // 元素由可见变为隐藏
  onLeave(/** @type {HTMLElement} */ el: any) {
    el.style.height = window.getComputedStyle(el).height // 计算高度
    // eslint-disable-next-line no-unused-expressions
    el.offsetHeight // 强制重绘，重绘后再改变高度才会产生动画
    el.style.height = '0px' // 将高度设置为0
  },
  onAfterLeave(/** @type {HTMLElement} */ el: any) {
    el.style.height = null // 过渡离开之后，将高度恢复为null
  },
}

export default defineComponent({
  name: 'XCollapseTransition',
  components: {},
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  emits: [],
  setup(props, context) {
    return {
      listeners,
    }
  },
})
</script>

<style lang="scss">
.x-collapse-transition {
  overflow: hidden;
  transition: height .22s ease-in-out;
}
</style>
