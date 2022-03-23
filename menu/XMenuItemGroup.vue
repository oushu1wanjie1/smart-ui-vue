<template>
  <a-menu-item-group class="smartui-menu-item-group" v-bind="{ ...$props }">
    <template #default>
      <slot name="default"></slot>
    </template>
    <template #title>
      <slot name="title"></slot>
    </template>
  </a-menu-item-group>
</template>
<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'XMenuItemGroup',
  slots: ['title'],
  props: {
    title: String
  }
})
</script>
<style lang="scss">
@import "../styles/components/XMenu/XMenuGroup";

</style>