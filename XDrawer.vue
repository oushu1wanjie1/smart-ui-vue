<template>
  <a-drawer wrapper-class-name="smartui-drawer" :fullScreen="fullScreen">
    <template v-for="item in slots" v-slot:[item]>
      <slot :name="item"></slot>
    </template>
  </a-drawer>
</template>

<script lang="ts">
import { computed, defineComponent, Prop } from 'vue'

export default defineComponent({
  name: 'XDrawer',
  props: {
    // 默认离top 74px（header的高度）
    // 需要 top 为 0 设置本属性即可
    fullScreen: {
      type: Boolean,
      default: false
    }
  },
  setup(props, context) {
    return {
      slots: computed(() => Object.keys(context.slots))
    }
  }
})
</script>

<style lang="scss">
@import './styles/components/XDrawer';
</style>
