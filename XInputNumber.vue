<template>
  <a-input-number class="smartui-number-input" :style="{ width: inputWidth }">
  </a-input-number>
</template>

<script>
export default {
  name: 'XInputNumber',
  props: {
    inputWidth: {
      type: String,
      default: '120px'
    }
  }
}
</script>

<style lang="scss">
@import './styles/components/XInputNumber';
</style>
