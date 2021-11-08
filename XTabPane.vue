<template>
  <a-tab-pane>
    <slot></slot>
  </a-tab-pane>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'XTabPane'
})
</script>
