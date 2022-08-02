<template>
  <a-drawer
      v-bind="{ ...restProps, title: undefined }"
      v-model:visible="visibleLocal"
      :wrapper-class-name="`smartui-drawer ${fixed ? 'smartui-drawer-fix-title' : ''}`"
  >
    <template v-for="item in slots" :key="item" v-slot:[item]>
      <slot :name="item"></slot>
      <div v-if="item === 'title' && closable" class="close-btn-wrapper">
        <icon class="close-icon" name="ui-date-pick/close"/>
      </div>
    </template>
    <template v-if="!slots.includes('title')" v-slot:title>
      <span :title="title">{{ title ?? '' }}</span>
      <div v-if="closable" class="close-btn-wrapper">
        <icon class="close-icon" name="ui-modal/close"/>
      </div>
    </template>
  </a-drawer>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue'
import { Drawer as ADrawer } from 'ant-design-vue'
import { omit } from 'lodash'
import Icon from '@/smart-ui-vue/helper/Icon.vue'
import { useModel } from '@/smart-ui-vue/utils'
import { VNodeChild } from '@vue/runtime-core'

const XDrawer = defineComponent({
  name: 'XDrawer',
  components: { Icon, ADrawer },
  props: {
    // 默认离top 74px（header的高度）
    // 需要 top 为 0 设置本属性即可
    fullScreen: Boolean,
    // 是否固定 title，body overflow auto
    fixed: Boolean,
    closable: {
      type: Boolean,
      default: true,
    },
    destroyOnClose: Boolean,
    getContainer: Object as any,
    maskClosable: {
      type: Boolean,
      default: true,
    },
    mask: {
      type: Boolean,
      default: true,
    },
    maskStyle: Object,
    wrapStyle: Object,
    bodyStyle: Object,
    headerStyle: Object,
    drawerStyle: Object,
    title: [String, Object] as PropType<string | VNodeChild>,
    visible: {
      type: Boolean,
      required: true,
    },
    width: {
      type: [Number, String],
      default: 256,
    },
    height: {
      type: [Number, String],
      default: 256,
    },
    zIndex: Number,
    prefixCls: String,
    placement: {
      type: String as PropType<'top' | 'right' | 'bottom' | 'left'>,
      default: 'right',
    },
    level: {
      type: Object as any,
      default: null,
    },
    wrapClassName: String,
    handle: Object as PropType<VNodeChild>,
    afterVisibleChange: Function,
    keyboard: {
      type: Boolean,
      default: true,
    },
    onClose: Function,
    'onUpdate:visible': Function,
  },
  setup(props, context) {
    return {
      slots: computed(() => Object.keys(context.slots)),
      // @ts-ignore
      visibleLocal: useModel('visible', props, context),
      restProps: omit({ ...props }, ['visible', 'onUpdate:visible']),
    }
  },
})

export default XDrawer
</script>

<style lang="scss">
@import './styles/components/XDrawer';
</style>
