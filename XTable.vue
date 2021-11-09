<template>
  <a-table>
    <template v-for="item in slots" v-slot:[item]>
      <slot :name="item"></slot>
    </template>
  </a-table>
</template>

<script lang="ts">
import { computed, defineComponent, Prop } from 'vue'

export default defineComponent({
  name: 'XTable',
  setup(props, context) {
    return {
      slots: computed(() => Object.keys(context.slots))
    }
  }
})
</script>

<style scoped>

</style>
