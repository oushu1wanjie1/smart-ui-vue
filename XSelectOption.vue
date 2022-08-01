<template>
  <a-select-option>
    <slot></slot>
  </a-select-option>
</template>
<script>
import { SelectOption as ASelectOption } from 'ant-design-vue-3/es/select'
export default {
  name: 'XSelectOption',
  components: { ASelectOption },
}
</script>