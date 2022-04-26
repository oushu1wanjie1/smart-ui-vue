<template>
  <a-collapse-panel>
    <template v-for="slotName in slots" v-slot:[slotName]>
      <slot :name="slotName"></slot>
    </template>
  </a-collapse-panel>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'

export default defineComponent({
  name: 'XCollapsePanel',
  setup(props, context) {

    return {
      slots: computed(() => Object.keys(context.slots))
    }
  }
})
</script>

<style lang="scss">

</style>