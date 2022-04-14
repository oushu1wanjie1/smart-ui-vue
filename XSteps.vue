<template>
  <div :class="stepsClassRef" class="x-steps">
    <slot></slot>
  </div>
</template>

<script lang="ts">
/* eslint-disable  @typescript-eslint/no-explicit-any */

import { computed, defineComponent, PropType, provide, ref, watch } from 'vue'
import { StepItemState } from '@/smart-ui-vue/XStep.vue'

export type StepDirection = 'horizontal' | 'vertical'

export default defineComponent({
  name: 'XSteps',
  props: {
    direction: {
      type: String as PropType<StepDirection>,
      default: 'horizontal',
    },
    selectIndex: {
      type: Number,
      default: 1,
    },
    finishIndex: {
      type: Number,
      default: 1,
    },
    layoutAlign: {
      type: String,
      default: 'left', // center
    },
  },
  setup(props, context) {
    const stepsClassRef = computed(() => _stepsClassRef(props))
    const steps = ref([])
    provide('xSteps', { props, steps })
    watch(steps, () => {
      steps.value.forEach((instance: StepItemState, index) => {
        instance.setIndex(index)
      })
    })
    return {
      slots: computed(() => Object.keys(context.slots)),
      stepsClassRef,
    }
  },
})

function _stepsClassRef(props: any) {
  return {
    horizontal: props.direction === 'horizontal',
    vertical: props.direction === 'vertical',
    'layout-left': props.layoutAlign === 'left',
    'layout-center': props.layoutAlign === 'center',
  }
}

</script>

<style lang="scss">
.x-steps {
  &.horizontal {
    display: flex;
    align-items: flex-start;

    .x-step {
      flex: 1;
    }

    &:not(.layout-center) {
      .x-step:last-child {
        flex: none;
      }

      .x-step:last-child .x-step-dotted-container {
        display: none;
      }

      .x-step .x-step-dotted-container:first-child {
        display: none;
      }
    }
  }
}
</style>
