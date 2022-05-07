<template>
  <a-progress>
    <template v-for="item in $slots" v-slot:[item]>
      <slot :name="item"></slot>
    </template>
  </a-progress>
</template>

<script>
export default {
  name: 'XProgress'
}
</script>

<style scoped>

</style>