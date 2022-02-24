<template>
  <a-drawer
    v-model:visible="visibleLocal"
    v-bind="{ ...restProps, title: undefined }"
    wrapper-class-name="smartui-drawer"
  >
    <template v-for="item in slots" :key="item" v-slot:[item]>
      <slot :name="item"></slot>
      <div v-if="item === 'title' && closable" class="close-btn-wrapper">
        <icon class="close-icon" name="ui-date-pick/close"/>
      </div>
    </template>
    <template v-if="!slots.includes('title')" v-slot:title>
      {{ title ?? '' }}
      <div v-if="closable" class="close-btn-wrapper">
        <icon class="close-icon" name="ui-date-pick/close"/>
      </div>
    </template>
  </a-drawer>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue'
import { omit } from 'lodash'
import Icon from '@/components/Icon.vue'
import { useModel } from '@/smart-ui-vue/utils'
import PropTypes from 'ant-design-vue/es/_util/vue-types'
import { VNodeChild } from '@vue/runtime-core'

const XDrawer = defineComponent({
  name: 'XDrawer',
  components: { Icon },
  props: {
    // 默认离top 74px（header的高度）
    // 需要 top 为 0 设置本属性即可
    fullScreen: Boolean,
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
    title: Object as PropType<string | VNodeChild>,
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
      default: 'right'
    },
    level: {
      type: Object as any,
      default: null
    },
    wrapClassName: String,
    handle: Object as PropType<VNodeChild>,
    afterVisibleChange: Function,
    keyboard: {
      type: Boolean,
      default: true
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
