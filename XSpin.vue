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
  &.ant-spin {
    .ant-spin-dot {
      font-size: v-bind(dotFontSize);
    }
  }
}
</style>