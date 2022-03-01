<template>
  <a-divider class="x-divider">
    <slot></slot>
  </a-divider>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'XDivider',
})
</script>

<style scoped>
.x-divider.ant-divider {
  border-top: 1px solid #D5D8D8;
}
</style>
