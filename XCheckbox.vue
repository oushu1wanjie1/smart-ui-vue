<template>
  <a-checkbox class="smartui-checkbox">
    <template v-for="item in slots" v-slot:[item]>
      <slot :name="item"></slot>
    </template>
  </a-checkbox>
</template>

<script lang="ts">
import { computed, defineComponent, Prop } from 'vue'

export default defineComponent({
  name: 'XCheckbox',
  setup(props, context) {
    return {
      slots: computed(() => Object.keys(context.slots)),
    }
  },
})
</script>

<style lang="scss">
@import "./styles/components/XCheckbox.scss";
</style>
