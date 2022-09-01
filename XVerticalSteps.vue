<template>
  <div :class="{'no-step':noStep}" class="x-vertical-steps">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { defineComponent, provide, ref } from 'vue'

export default defineComponent({
  name: 'XVerticalSteps',
  components: {},
  props: {
    isDefaultOpenFirst: {
      type: Boolean,
      default: true,
    },
    showStatus: {
      type: Boolean,
      default: false,
    },
    noStep: {
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
  &.no-step {
    .x-vertical-step.open .x-vertical-step-container {
      border-color: transparent !important;
    }
  }

  .x-vertical-step-container {
    cursor: auto !important;
  }
}
</style>
