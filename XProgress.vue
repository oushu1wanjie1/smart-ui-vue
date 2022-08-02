<template>
  <a-progress>
    <template v-for="item in $slots" v-slot:[item]>
      <slot :name="item"></slot>
    </template>
  </a-progress>
</template>

<script>
import { Progress as AProgress } from 'ant-design-vue-3'

export default {
  name: 'XProgress',
  components: { AProgress },
}
</script>

<style scoped>

</style>