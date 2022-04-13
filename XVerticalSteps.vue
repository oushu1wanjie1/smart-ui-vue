<template>
  <div class="x-vertical-steps">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { defineComponent, provide, ref } from 'vue'

export default defineComponent({
  name: 'XVerticalSteps',
  components: {},
  props: {
    showStatus: {
      type: Boolean,
      default: false,
    },
  },
  emits: [],
  setup(props) {
    const steps = ref([])
    provide('xVerticalSteps', { props, steps })
    return {}
  },
})
</script>

<style lang="scss">
.x-vertical-steps {
}
</style>
