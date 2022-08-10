<template>
  <a-select-option>
    <slot></slot>
  </a-select-option>
</template>
<script>
import { Select } from 'ant-design-vue-3'

export default {
  name: 'XSelectOption',
  components: { ASelectOption: Select.Option },
}
</script>