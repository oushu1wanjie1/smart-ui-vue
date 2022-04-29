<template>
  <a-menu v-bind="{...$props}" class="smartui-menu">
    <template #default>
      <slot name="default"/>
    </template>
  </a-menu>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue'
import { MenuTheme } from 'ant-design-vue'
import { MenuMode } from 'ant-design-vue/es/menu/src/interface'

export default defineComponent({
  name: 'XMenu',
  props: {
    /**
     * 用户鼠标离开子菜单后关闭延时，单位：秒
     */
    subMenuOpenDelay: { type: Number, default: 0.1 },
    /**
     * 用户鼠标离开子菜单后开启延时，单位：秒
     */
    subMenuCloseDelay: { type: Number, default: 0.1 },
    /**
     * 	主题颜色
     */
    theme: { type: String as PropType<MenuTheme>, default: 'light' },
    /**
     * 菜单类型，现在支持垂直、水平、和内嵌模式三种
     */
    mode: { type: String as PropType<MenuMode>, default: 'vertical' },
    /**
     * inline 时菜单是否收起状态
     */
    inlineCollapsed: Boolean,
    /**
     * 	inline 模式的菜单缩进宽度
     */
    inlineIndent: { type: Number, default: 24 },
    /**
     * 当前选中的菜单项 key 数组
     */
    selectedKeys: Array,
    /**
     * 当前展开的 SubMenu 菜单项 key 数组
     */
    openKeys: Array,
    /**
     * 	是否允许选中
     */
    selectable: { type: Boolean, default: true },
    /**
     * 是否允许多选
     */
    multiple: { type: Boolean, default: false },
    'onUpdate:selectedKeys': Function,
    'onSelect': Function,
    'onDeselect': Function,
  },
  emits: [
    'update:openKeys',
    'openChange',
    'select',
    'deselect',
    'update:selectedKeys',
    'click',
  ],
  slots: ['expandIcon', 'overflowedIndicator'],
  setup(props, context) {
    return {
      slots: computed(() => Object.keys(context.slots))
    }
  }
})
</script>

<style lang="scss">
@import "styles/components/XMenu/XMenu";
</style>