<template>
  <a-textarea
    v-if="isRawRef"
    v-model:value="localValue"
    v-bind="inputAttrs"
  />
  <div
    v-else
    :class="{
      'smartui-textarea-container-disabled': disabled !== undefined
    }"
    :style="$attrs.style"
    class="smartui-textarea-container"
  >
    <a-textarea
      v-model:value="localValue"
      :class="{
        'smartui-textarea-exceed': maxlength < localValue.length,
        'smartui-textarea-prefix': slots.includes('prefixIcon'),
        'smartui-textarea-max-length': maxlength > 0,
      }"
      v-bind="inputAttrs"
    />
    <span class="smartui-textarea-prefix-icon">
        <slot name="prefixIcon"/>
    </span>
    <span
      v-if="maxlength - localValue.length <= 10"
      :class="{ 'smartui-textarea-count-exceed': localValue.length > maxlength }"
      class="smartui-textarea-count"
    >
      {{
        maxlength >= localValue.length
          ? maxlength - localValue.length
          : `${Math.min(localValue.length - maxlength, 10)}${localValue.length - maxlength > 10 ? '+' : ''}`
      }}
    </span>
  </div>
</template>
<script lang="ts">
import { computed, defineComponent, onMounted, ref } from 'vue'
import { omit } from 'lodash'
import { useModel } from './utils'
import inputProps from 'ant-design-vue/es/input/inputProps'
import PropTypes, { withUndefined } from 'ant-design-vue/es/_util/vue-types'

const TextAreaProps = {
  ...inputProps,
  autosize: withUndefined(PropTypes.oneOfType([Object, Boolean])),
  autoSize: withUndefined(PropTypes.oneOfType([Object, Boolean])),
  showCount: PropTypes.looseBool,
  onCompositionstart: PropTypes.func,
  onCompositionend: PropTypes.func,
}

export default defineComponent({
  inheritAttrs: false,
  props: { ...TextAreaProps },
  setup(props, context) {
    const slots = computed(() => {
      return Object.keys(context.slots)
    })

    const inputAttrs = omit(
      {
        ...context.attrs,
        ...props,
        style: undefined,
      }, ['value', 'update:value']
    )

    const isRawRef = computed(() => {
      return typeof context.attrs.class === 'string' && context.attrs.class.split(' ').includes('raw')
    })

    const localValue = (typeof props.value === 'string' && typeof context.attrs['update:value'] === 'function')
      ? useModel('value', props, context)
      : ref(props.value ?? '')

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