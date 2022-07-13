<template>
<a-sub-menu v-bind="{...$props, popupClassName: `smartui-submenu-popup ${$props.popupClassName}`}" class="smartui-submenu">
  <template #icon>
    <slot name="icon"/>
  </template>
  <template #title>
    <slot name="title"/>
  </template>
  <template #default>
    <slot name="default"/>
  </template>
  <template #expandIcon>
    <slot v-if="slots.includes('expandIcon')" name="expandIcon">122</slot>
    <icon v-else name="ui-menu/arrow-to-right" color="comment" style="transform: translateX(7px)"/>
  </template>
</a-sub-menu>
</template>
<script lang="ts">
import { computed, defineComponent, PropType } from 'vue'
// @ts-ignore
import Icon from '@/smart-ui-vue/helper/Icon.vue'

export default defineComponent({
  name: 'XSubMenu',
  components: { Icon },
  props: {
    /**
     * 是否禁用
     */
    disabled: Boolean,
    /**
     * 子菜单类名
     */
    popupClassName: {
      type: String,
    },
    /**
     * [x轴偏移量，y轴偏移量]
     */
    popupOffset: {
      type: Array as PropType<number[]>,
      default: () => [7, 0]
    },
    /**
     * 唯一标识
     */
    key: String,
    /**
     * 标题
     */
    title: String,
  },
  slots: ['icon', 'title', 'expandIcon'],
  emits: ['titleClick'],
  setup(props, context) {
    return {
      slots: computed(() => Object.keys(context.slots))
    }
  }
})
</script>
<style lang="scss">
@import "styles/components/XMenu/XSubMenu";
</style>