<template>
  <a-spin class="smartui-spin">
    <slot></slot>
  </a-spin>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { Spin as ASpin } from 'ant-design-vue'

export default defineComponent({
  name: 'XSpin',
  components: { ASpin },
  props: {
    // 指定字体大小
    fontSize: {
      type: [String, Number],
      default: '10px',
    },
  },
  setup(props, context) {
    return {
      slots: computed(() => Object.keys(context.slots)),
      // 'font-size':
      dotFontSize: computed(() => {
        return typeof props.fontSize === 'string' ? props.fontSize : `${props.fontSize}px`
      }),
    }
  },
})
</script>

<style lang="scss">
@import './styles/components/XSpin.scss';

.smartui-spin:not(.raw) {
  font-size: v-bind(dotFontSize);
  min-height: 6em;

  &.#{$ant-prefix}-spin {
    .#{$ant-prefix}-spin-dot {
      font-size: v-bind(dotFontSize);
    }
  }
}

.antv-spin-nested-loading {
  font-size: v-bind(dotFontSize);
  min-height: 6em;
}

.#{$ant-prefix}-spin-nested-loading > div > .#{$ant-prefix}-table-spin-holder.#{$ant-prefix}-spin {
  .#{$ant-prefix}-spin-dot {
    margin: 0;
    transform: translate(-50%, -50%);
  }
}
</style>