<template>
  <a-modal class="x-modal" v-bind="{...$props}">
    <template v-for="item in slots" v-slot:[item]>
      <slot :name="item"></slot>
    </template>
  </a-modal>
</template>

<script lang="ts">
import { computed, CSSProperties, defineComponent, PropType } from 'vue'
import type { ButtonProps as ButtonPropsType, LegacyButtonType } from 'ant-design-vue/es/button/buttonTypes'
import { Modal as AModal } from 'ant-design-vue'

type getContainerFunc = () => HTMLElement;

export default defineComponent({
  name: 'XModal',
  components: { AModal },
  props: {
    prefixCls: String,
    visible: { type: Boolean, default: false },
    confirmLoading: { type: Boolean, default: false },
    /**
     * 也可以是 slot
     */
    title: String,
    closable: { type: Boolean, default: true },
    /**
     * vnode or slot
     */
    closeIcon: Object,
    onOk: Function as PropType<(e: MouseEvent) => void>,
    onCancel: Function as PropType<(e: MouseEvent) => void>,
    'onUpdate:visible': Function as PropType<(visible: boolean) => void>,
    onChange: Function as PropType<(visible: boolean) => void>,
    afterClose: Function as PropType<() => void>,
    /**
     * 默认居中
     */
    centered: { type: Boolean, default: true },
    width: {
      type: [String, Number],
      default: 400
    },
    /**
     * 底部内容，当不需要默认底部按钮时，可以设为 :footer="null"
     * 也可以是 slot
     * 默认值：确定取消按钮
     */
    footer: String,
    /**
     * 确定按钮文字
     * 也可以是 slot
     */
    okText: String,
    okType: {
      type: String as PropType<LegacyButtonType>,
      default: 'primary'
    },
    /**
     * 关闭按钮文字
     * 也可以是 slot
     */
    cancelText: String,
    /**
     * 自定义图标
     * 	VNode | ()=>VNode
     */
    icon: Object,
    maskClosable: { type: Boolean, default: true },
    forceRender: { type: Boolean, default: false },
    okButtonProps: Object as PropType<ButtonPropsType>,
    cancelButtonProps: Object as PropType<ButtonPropsType>,
    destroyOnClose: { type: Boolean, default: false },
    wrapClassName: String,
    maskTransitionName: {
      type: String,
      default: 'fade',
    },
    transitionName: {
      type: String,
      default: 'zoom',
    },
    getContainer: {
      type: [String, Function, Boolean, Object] as PropType<string | HTMLElement | getContainerFunc | false>,
      default: () => document.body,
    },
    zIndex: Number,
    bodyStyle: { type: Object as PropType<CSSProperties>, default: undefined as unknown as CSSProperties },
    maskStyle: { type: Object as PropType<CSSProperties>, default: undefined as unknown as CSSProperties },
    mask: { type: Boolean, default: true },
    keyboard: { type: Boolean, default: true },
    wrapProps: Object,
  },
  setup(props, context) {
    return {
      slots: computed(() => Object.keys(context.slots))
    }
  }
})
</script>

<style lang="scss">
@import 'styles/components/XModal/index';
</style>
