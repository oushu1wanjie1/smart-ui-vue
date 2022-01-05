<template>
  <a-date-picker :class="`smartui-date-picker ${wrapperClass}`" v-bind="{ ...props }" :style="wrapperStyle">
    <template v-for="item in slots" v-slot:[item]>
      <slot :name="item"></slot>
    </template>
  </a-date-picker>
</template>

<script lang="ts">
import { computed, defineComponent, Prop, ref } from 'vue'
import { DatePicker } from 'ant-design-vue'

export default defineComponent({
  name: 'XDatePicker',
  props: {
    ...DatePicker.props
  },
  setup(props, context) {
    const wrapperClass = ref(context.attrs.class || '')
    const wrapperStyle = ref(context.attrs.style)
    return {
      slots: computed(() => Object.keys(context.slots)),
      wrapperStyle,
      wrapperClass,
      props,
    }
  }
})
</script>

<style scoped>

</style>