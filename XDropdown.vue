<template>
  <a-dropdown v-bind="{...props}">
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
      props,
      slots: computed(() => Object.keys(context.slots))
    }
  }
}
</script>

<style scoped>

</style>