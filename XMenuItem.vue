<template>
  <a-menu-item v-bind="{ ...$props }">
    <template #icon>
      <slot name="icon"></slot>
    </template>
    <template #titile>
      <slot name="title"></slot>
    </template>
    <template #default>
      <slot name="default"></slot>
    </template>
  </a-menu-item>
</template>

<script>
import { defineComponent } from 'vue'
import { Menu } from 'ant-design-vue'

export default defineComponent({
  name: 'XMenuItem',
  // eslint-disable-next-line vue/no-unused-components
  components: { AMenuItem: Menu.Item, Menu },
  props: {
    role: String,
    disabled: Boolean,
    danger: Boolean,
    key: {
      type: String,
      required: true
    },
    title: { type: [String, Boolean], default: undefined },
  },
  slots: ['icon', 'title'],
})
</script>

<style>

</style>