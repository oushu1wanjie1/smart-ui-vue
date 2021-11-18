<template>
  <a-table class="smartui-table">
    <template v-for="item in slots" v-slot:[item]="scope">
      <slot :name="item" v-bind="scope"></slot>
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

<style lang="scss">
@import './styles/components/XTable';
</style>
