<template>
  <component :is="tableComponent">
    <template v-for="slot in $slots" v-bind:[slot]="scope">
      <slot :name="slot" v-bind="scope" />
    </template>
  </component>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import XTableNext from '@/smart-ui-vue/table/XTableNext.vue'
import XTableCurrent from '@/smart-ui-vue/table/XTableCurrent.vue'

export default defineComponent({
  components: { XTableCurrent, XTableNext },
  props: {
    version: String as PropType<'next'>
  },
  setup(props) {
    return {
      tableComponent: props.version === 'next' ? XTableNext : XTableCurrent
    }
  }
})
</script>
