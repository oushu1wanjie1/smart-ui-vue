<template>
  <a-tab-pane>
    <template v-for="item in slots" v-slot:[item]>
      <slot :name="item"></slot>
    </template>
  </a-tab-pane>
</template>

<script>
import { computed, defineComponent } from 'vue'

export default defineComponent({
  name: 'XTabPane',
  setup(props, context) {
    return {
      slots: computed(() => Object.keys(context.slots))
    }
  }
})
</script>
