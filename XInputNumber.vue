<template>
  <a-input-number
    v-model:value="value"
    v-bind="{ ...props }"
    :class="`smartui-number-input`"
    :style="{...wrapperStyle}" @change="handleChange"
    max-length="3"
  >
  </a-input-number>
</template>

<script>
import { ref, toRefs, watch } from 'vue'
import { InputNumber } from 'ant-design-vue'
import { useModel } from '@/smart-ui-vue/utils'

export default {
  name: 'XInputNumber',
  emits: ['change'],
  props: {
    inputWidth: {
      type: String,
      default: '120px'
    },
    ...InputNumber.props
  },
  setup(props, context) {
    const wrapperStyle = ref(context.attrs.style)
    const { max: maxRef, min: minRef } = toRefs(props)
    const value = useModel('value', props, context)
    if (wrapperStyle.value && wrapperStyle.value.width === undefined) {
      wrapperStyle.value.width = '120px'
    }

    watch(value, (val, oldVal) => {
      if (isNaN(val)) value.value = oldVal
    })
    const handleChange = (val) => {
      if (maxRef.value !== undefined && val > maxRef.value) value.value = maxRef.value
      if (minRef.value !== undefined && val < minRef.value) value.value = minRef.value
      context.emit('change', val)
    }

    return {
      props,
      wrapperStyle,
      value,
      handleChange
    }
  }
}
</script>

<style lang="scss">
@import './styles/components/XInputNumber';
</style>
