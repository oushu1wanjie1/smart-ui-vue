<template>
  <a-spin class="smartui-spin">
    <slot></slot>
  </a-spin>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, Prop } from 'vue'

export default defineComponent({
  name: 'XSpin',
  props: {
    // 指定字体大小
    fontSize: {
      type: [String, Number],
      default: '10px'
    },
  },
  setup(props, context) {
    return {
      slots: computed(() => Object.keys(context.slots)),
      // 'font-size':
      dotFontSize: computed(() => {
        return typeof props.fontSize === 'string' ? props.fontSize : `${props.fontSize}px`
      })
    }
  }
})
</script>

<style lang="scss">
@import './styles/components/XSpin.scss';

.smartui-spin:not(.raw) {
  &.#{$ant-prefix}-spin {
    .#{$ant-prefix}-spin-dot {
      font-size: v-bind(dotFontSize);
    }
  }
}

.#{$ant-prefix}-spin-nested-loading > div > .#{$ant-prefix}-table-spin-holder.#{$ant-prefix}-spin {
  .#{$ant-prefix}-spin-dot {
    margin: 0;
    transform: translate(-50%, -50%);
  }
}
</style>