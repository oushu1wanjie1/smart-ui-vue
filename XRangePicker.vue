<template>
  <div :class="{selected}" class="smartui-range-picker smartui-date-picker-common">
    <div class="time-split-box">
      <icon color="#B1B2B5" name="ui-date-pick/time-split"></icon>
    </div>
    <div class="close-container" @click="clear">
      <icon color="#85888C" name="ui-date-pick/close"></icon>
    </div>
    <a-range-picker v-bind="{ ...props }" v-model:value="valueLocal">
      <template v-for="item in slots" v-slot:[item]>
        <slot :name="item"></slot>
      </template>
      <template v-if="!(slots&&slots.includes('suffixIcon'))" #suffixIcon>
        <icon name="ui-date-pick/calendar" color="#85888C"></icon>
      </template>
    </a-range-picker>
  </div>
</template>

<script>
import {computed} from 'vue'
import {DatePicker} from "ant-design-vue";
import {excludeNotExistProps, useModel} from "@/smart-ui-vue/utils";
import Icon from "@/components/Icon";

export default {
  name: 'XRangePicker',
  components: {Icon},
  inheritAttrs: false,
  props: {
    ...DatePicker.props,
  },
  setup(props, context) {
    const resultProps = excludeNotExistProps(props) // 剔除未传参数
    return {
      slots: computed(() => Object.keys(context.slots)),
      selected: computed(() => props.value.length > 0),
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
@import 'styles/components/XDatePick';
</style>
