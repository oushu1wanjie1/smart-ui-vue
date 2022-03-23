<template>
  <a-col v-bind="{ ...$props }">
    <template #default>
      <slot name="default"/>
    </template>
  </a-col>
</template>
<script lang="ts">
import { defineComponent, PropType } from 'vue'

import { ColSize } from 'ant-design-vue/es/grid'

const stringOrNumber = [String, Number] as PropType<string | number>
const objectOrNumber = [Object, Number] as PropType<ColSize | number | Record<string, unknown> >

export default defineComponent({
  name: 'XCol',
  props: {
    span: stringOrNumber,
    order: stringOrNumber,
    offset: stringOrNumber,
    push: stringOrNumber,
    pull: stringOrNumber,
    xs: objectOrNumber,
    sm: objectOrNumber,
    md: objectOrNumber,
    lg: objectOrNumber,
    xl: objectOrNumber,
    xxl: objectOrNumber,
    flex: stringOrNumber,
  }
})
</script>