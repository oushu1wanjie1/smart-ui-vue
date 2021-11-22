<template>
  <a-checkbox-group>
    <template v-for="item in slots" v-slot:[item]>
      <slot :name="item"></slot>
    </template>
  </a-checkbox-group>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'

export default defineComponent({
  name: 'XCheckboxGroup',
  setup(props, context) {
    return {
      slots: computed(() => Object.keys(context.slots))
    }
  }
})
</script>

<style scoped>

</style>