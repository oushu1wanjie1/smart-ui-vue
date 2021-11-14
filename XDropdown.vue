<template>
  <a-dropdown>
    <template v-for="item in slots" v-slot:[item]>
      <slot :name="item"></slot>
    </template>
  </a-dropdown>
</template>

<script lang="ts">
import { computed, Prop } from 'vue'
export default {
  name: 'XDropdown',
  setup(props: Prop<any>, context: any ) {
    return {
      slots: computed(() => Object.keys(context.slots))
    }
  }
}
</script>

<style scoped>

</style>