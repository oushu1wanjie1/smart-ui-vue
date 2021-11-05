<template>
  <a-range-picker class="smartui-range-picker" v-model:value="valueLocal">
    <template v-for="item in slots" v-slot:[item]>
      <slot :name="item"></slot>
    </template>
  </a-range-picker>
</template>

<script>
import { useModel } from './utils'
import { computed } from 'vue'
export default {
  name: 'XRangePicker',
  props: {
    value: Array
  },
  setup(props, context) {
    const slots = computed(() => Object.keys(context.slots))
    return {
      slots,
      valueLocal: useModel('value', props, context)
    }
  }
}
</script>
<style lang="scss">
@use './styles/components/XRangePicker';

</style>