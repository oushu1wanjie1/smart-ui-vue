<template>
  <a-textarea
    v-if="isRawRef"
    v-model:value="localValue"
    :allow-clear="allowClear"
    :auto-size="autosize"
    :default-value="defaultValue"
    :maxLength="maxLength"
    :show-count="showCount"
    :style="$attrs.style"
    v-bind="inputAttrs"
  />
  <div
    v-else
    :style="$attrs.style"
    class="smartui-textarea-container"
    :class="{
      'smartui-textarea-container-disabled': $attrs.disabled !== undefined
    }"
  >
    <a-textarea
      v-model:value="localValue"
      :allow-clear="allowClear"
      :auto-size="autosize"
      :class="{
        'smartui-textarea-exceed': maxLength < localValue.length,
        'smartui-textarea-prefix': slots.includes('prefixIcon'),
        'smartui-textarea-max-length': maxLength > 0,
      }"
      :default-value="defaultValue"
      :show-count="showCount"
      v-bind="inputAttrs"
    />
    <span class="smartui-textarea-prefix-icon">
        <slot name="prefixIcon"/>
    </span>
    <span
      v-if="maxLength - localValue.length <= 10"
      :class="{ 'smartui-textarea-count-exceed': localValue.length > maxLength }"
      class="smartui-textarea-count"
    >
      {{
        maxLength >= localValue.length
          ? maxLength - localValue.length
          : `${Math.min(localValue.length - maxLength, 10)}${localValue.length - maxLength > 10 ? '+' : ''}`
      }}
    </span>
  </div>
</template>
<script lang="ts">
import { computed, defineComponent, onMounted, ref } from 'vue'
import { useModel } from './utils'

export default defineComponent({
  inheritAttrs: false,
  props: {
    showCount: {
      type: Boolean,
      default: false,
    },
    maxLength: {
      type: Number,
    },
    value: {
      type: String,
    },
    autoSize: {
      type: [Object, Boolean],
      default: false,
    },
    defaultValue: String,
    allowClear: Boolean,
  },
  slots: ['update:value'],
  setup(props, context) {
    const slots = computed(() => {
      return Object.keys(context.slots)
    })

    const inputAttrs = {
      ...context.attrs,
      style: undefined,
    }

    const isRawRef = computed(() => {
      return typeof context.attrs.class === 'string' && context.attrs.class.split(' ').includes('raw')
    })

    const localValue = (typeof props.value === 'string' && typeof context.attrs['update:value'] === 'function')
      ? useModel('value', props, context)
      : ref(props.value ?? '')

    onMounted(() => {
      console.log(context)
    })

    return {
      props,
      slots,

      inputAttrs,

      isRawRef,
      localValue,
    }
  },
})
</script>
<style lang="scss">
@import "./styles/components/XTextarea";
</style>