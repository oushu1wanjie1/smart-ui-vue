<template>
  <div :class="{selected}" class="smartui-date-picker smartui-date-picker-common">
    <a-date-picker
        ref="DatePickerRef"
        v-bind="{ ...props }"
        v-model:value="valueLocal"
        :class="`${wrapperClass}`"
        :style="wrapperStyle">
      <template v-for="item in slots" v-slot:[item]>
        <slot :name="item"></slot>
      </template>
    </a-date-picker>
    <div class="close-container" @click="clear">
      <icon color="#85888C" name="ui-date-pick/close"></icon>
    </div>
  </div>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { computed, defineComponent, Ref, ref } from 'vue'
import { DatePicker as ADatePicker } from 'ant-design-vue'
import { excludeNotExistProps, useModel } from '@/smart-ui-vue/utils'
import Icon from './helper/Icon.vue'

export default defineComponent({
  name: 'XDatePicker',
  components: { Icon, ADatePicker },
  props: {
    ...ADatePicker.props,
  },
  setup(props, context) {
    const resultProps = excludeNotExistProps(props) // 剔除未传参数
    const DatePickerRef: Ref = ref(null)
    const wrapperClass = ref(context.attrs.class || '')
    const wrapperStyle = ref(context.attrs.style)
    return {
      slots: computed(() => Object.keys(context.slots)),
      selected: computed(() => !!(props as any).value),
      valueLocal: useModel('value', props, context),
      props: resultProps,
      DatePickerRef,
      wrapperStyle,
      wrapperClass,
      clear() {
        context.emit('update:value', '')
      }
    }
  }
})
</script>

<style lang="scss">
@import 'styles/components/XDatePick';
</style>
