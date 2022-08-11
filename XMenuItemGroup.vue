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
import { Menu } from 'ant-design-vue'

export default defineComponent({
  name: 'XMenuItemGroup',
  // eslint-disable-next-line vue/no-unused-components
  components: { Menu, AMenuItemGroup: Menu.ItemGroup },
  slots: ['title'],
  props: {
    title: String
  }
})
</script>
<style lang="scss">
@import "styles/components/XMenu/XMenuGroup";

</style>