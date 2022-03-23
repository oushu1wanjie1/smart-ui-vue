<template>
  <a-switch class="x-switch">
    <template v-for="item in slots" v-slot:[item]>
      <slot :name="item"></slot>
    </template>
  </a-switch>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'

export default defineComponent({
  name: 'XSwitch',
  __ANT_SWITCH: true,
  setup(props, context) {
    return {
      slots: computed(() => Object.keys(context.slots))
    }
  }
})
</script>

<style lang="scss">
@import './styles/components/XSwitch/index';
</style>