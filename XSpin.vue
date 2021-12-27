<template>
  <a-spin class="smartui-spin">
    <slot></slot>
  </a-spin>
</template>

<script lang="ts">
import { computed, defineComponent, Prop } from 'vue'

export default defineComponent({
  name: 'XSpin',
  setup(props, context) {
    return {
      slots: computed(() => Object.keys(context.slots))
    }
  }
})
</script>

<style lang="scss">
@import './styles/components/XSpin.scss';
</style>