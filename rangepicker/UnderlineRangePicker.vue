<template>
  <div :class="{selected}" class="smartui-range-picker smartui-date-picker-common">
    <div class="time-split-box">
      <icon color="#85888C" name="ui-date-pick/time-split"></icon>
    </div>
    <div class="close-container" @click="clear">
      <icon color="#85888C" name="ui-date-pick/close"></icon>
    </div>
    <a-range-picker v-bind="{ ...props }" v-model:value="valueLocal">
      <template v-for="item in slots" v-slot:[item]>
        <slot :name="item"></slot>
      </template>
      <template #suffixIcon>
        <icon color="#85888C" name="ui-date-pick/calendar"></icon>
      </template>
    </a-range-picker>
  </div>
</template>

<script>
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { computed } from 'vue'
import { DatePicker } from 'ant-design-vue'
import { excludeNotExistProps, useModel } from '@/smart-ui-vue/utils'
import Icon from '@/smart-ui-vue/helper/Icon.vue'

export default {
  name: 'UnderlineRangePicker',
  components: { Icon },
  inheritAttrs: false,
  props: {
    ...DatePicker.props,
  },
  setup(props, context) {
    const resultProps = excludeNotExistProps(props) // 剔除未传参数
    return {
      slots: computed(() => Object.keys(context.slots)),
      selected: computed(() => props?.value?.length > 0),
      valueLocal: useModel('value', props, context),
      props: resultProps,
      clear() {
        context.emit('update:value', [])
      }
    }
  },
}
</script>
<style lang="scss">
@import '../styles/components/XDatePick';
</style>
