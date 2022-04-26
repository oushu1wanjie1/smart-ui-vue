<template>
  <bordered-range-picker v-if="bordered" select/>
  <underline-range-picker v-else />
</template>

<script>
import BorderedRangePicker from '@/smart-ui-vue/rangepicker/BorderedRangePicker'
import UnderlineRangePicker from '@/smart-ui-vue/rangepicker/UnderlineRangePicker'

export default {
  name: 'XRangePicker',
  components: { BorderedRangePicker, UnderlineRangePicker },
  props: {
    bordered: Boolean
  }
}
</script>
<style lang="scss">
</style>
