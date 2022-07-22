<template>
  <a-form v-bind="{ ...$props, ...$attrs}" class="smartui-form" ref="formRef">
    <slot></slot>
  </a-form>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'XForm',
  props: {
    hideRequiredMark: {
      type: Boolean,
      default: true,
    }
  },
  setup() {
    const formRef = ref()
    return {
      formRef
    }
  }
}
</script>

<style lang="scss">
@import './styles/components/XForm';
</style>
