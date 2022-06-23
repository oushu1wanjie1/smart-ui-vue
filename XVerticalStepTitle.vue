<template>
  <div :class="{'has-nodes':hasNodes}" class="v-deploy-step-title">
    <div v-if="slots.includes('title')" class="step-title-item step-title-text" style="margin-right: 10px;">
      <slot name="title"></slot>
    </div>
    <div v-if="slots.includes('default')"
         class="step-title-default">
      <slot name="default"></slot>
    </div>
    <div v-if="slots.includes('open')" class="step-title-open">
      <slot name="open"></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'

export default defineComponent({
  name: 'XVerticalStepTitle',
  components: {},
  props: {
    hasNodes: { type: Boolean, default: false },
  },
  emits: [],
  setup(props, context) {
    const slots = computed(() => {
      return Object.keys(context.slots)
    })
    return {
      slots,
    }
  },
})
</script>

<style lang="scss">
.v-deploy-step-title {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 12px;
  font-weight: 400;
  color: #282B2E;

  .step-note {
    color: #85888C;
  }

  &.has-nodes {
    .step-title-text {
      margin-top: 7px;
    }

    .step-title-default {
      margin: -3px -5px -5px;
    }
  }

  .step-title-text {
    font-size: 12px;
    font-weight: 400;
    white-space: nowrap;
  }

  .step-title-open, .step-title-default {
    flex: 1;
  }

  .step-title-open {
    display: none;
  }

  .step-title-default {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
  }
}

.x-vertical-step.open .v-deploy-step-title {
  .step-title-open {
    display: flex;
    align-items: center;
    justify-content: flex-start;
  }

  .step-title-default {
    display: none;
  }
}
</style>
