<template>
  <a-form-item :class="{ 'smartui-form-item': true, 'error-bottom': errorTipPosition === 'bottom' }">
    <slot></slot>
  </a-form-item>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'XFormItem',
  props: {
    /**
     * @type {String}
     * errorTip的位置: top | bottom
     */
    errorTipPosition: {
      type: String,
      default: 'top'
    }
  }
})
</script>

<style lang="scss">
@import './styles/components/XFormItem';
</style>