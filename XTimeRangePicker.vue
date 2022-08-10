<template>
  <a-time-range-picker>
    <template v-for="item in slots" v-slot:[item]>
      <slot :name="item"></slot>
    </template>
  </a-time-range-picker>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { TimePicker } from 'ant-design-vue-3'

export default defineComponent({
  name: 'XTimeRangePicker',
  // eslint-disable-next-line vue/no-unused-components
  components: { TimePicker, ATimeRangePicker: TimePicker.TimeRangePicker },
  setup(props, context) {
    return {
      slots: computed(() => Object.keys(context.slots))
    }
  }
})
</script>

<style>

</style>