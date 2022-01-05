<template>
  <a-input-number v-model:value="value" v-bind="{ ...props }" :class="`smartui-number-input ${wrapperClass}`" :style="{...wrapperStyle}">
  </a-input-number>
</template>

<script>
import { ref } from 'vue'
import { InputNumber } from 'ant-design-vue'
import { useModel } from '@/smart-ui-vue/utils'

export default {
  name: 'XInputNumber',
  props: {
    inputWidth: {
      type: String,
      default: '120px'
    },
    ...InputNumber.props
  },
  setup(props, context) {
    const wrapperClass = ref(context.attrs.class || '')
    const wrapperStyle = ref(context.attrs.style)
    if (wrapperStyle.value && wrapperStyle.value.width === undefined) {
      wrapperStyle.value.width = '120px'
    }

    return {
      props,
      wrapperClass,
      wrapperStyle,
      value: useModel('value', props, context),
    }
  }
}
</script>

<style lang="scss">
@import './styles/components/XInputNumber';
</style>
