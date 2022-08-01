<template>
  <a-divider class="x-divider">
    <slot></slot>
  </a-divider>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { Divider as ADivider } from 'ant-design-vue'

export default defineComponent({
  name: 'XDivider',
  components: { ADivider }
})
</script>

<style scoped>
.x-divider {
  display: block;
  width: 100%;
  height: 1px;
  background: #D5D8D8;
}
</style>
