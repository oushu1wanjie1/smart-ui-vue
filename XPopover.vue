<template>
  <a-popover v-bind="props">
    <template v-for="item in slots" v-slot:[item]>
      <slot :name="item"></slot>
    </template>
  </a-popover>
</template>

<script lang="ts">
import { computed, defineComponent, Prop, PropType, toRefs } from 'vue'
import { useModel } from '@/smart-ui-vue/utils'

interface AlignProps {
  points?: string[],
  offset?: number[],
  targetOffset?: string[],
  overflow?: {
    adjustX?: boolean,
    adjustY?: boolean,
    alwaysByViewport?: boolean,
  },
  useCssRight?: boolean,
  useCssBottom?: boolean,
  useCssTransform?: boolean,
}

const DEFAULT_MOUSE_ENTER_DELAY = 0.1
const DEFAULT_MOUSE_LEAVE_DELAY = 0.1

export default defineComponent({
  name: 'XPopover',
  emits: ['visibleChange'],
  props: {
    /**
     * 该值将合并到 placement 的配置中，设置参考 [dom-align](https://github.com/yiminghe/dom-align)
     */
    align: {
      type: Object as PropType<AlignProps>,
      default: () => ({})
    },
    // 箭头是否指向目标元素中心
    arrowPointAtCenter: {
      type: Boolean,
      default: false
    },
    // 气泡被遮挡时是否自动调整位置
    autoAdjustOverflow: {
      type: Boolean,
      default: true
    },
    // popover内容文字
    content: {
      type: String
    },
    // 默认是否显隐
    defaultVisible: {
      type: Boolean,
      default: false,
    },
    // 隐藏后是否销毁 tooltip
    destroyTooltipOnHide: {
      type: Boolean,
      default: false
    },
    // 浮层渲染节点，默认渲染到body上
    getPopupContainer: {
      type: Function as PropType<() => HTMLElement>,
      default: () => document.body
    },
    // 鼠标移入后延迟多少才显示Tooltip, 单位秒
    mouseEnterDelay: {
      type: Number,
      default: DEFAULT_MOUSE_ENTER_DELAY
    },
    // 鼠标移出后延时多少才隐藏 Tooltip，单位：秒
    mouseLeaveDelay: {
      type: Number,
      default: DEFAULT_MOUSE_LEAVE_DELAY
    },
    // 卡片类名
    // 支持传入字符串数组
    overlayClassName: {
      type: (String || Array) as PropType<string | string[]>,
    },
    // 卡片样式
    overlayStyle: {
      type: Object,
    },
    // 气泡框位置，可选 top left right bottom topLeft topRight bottomLeft bottomRight leftTop leftBottom rightTop rightBottom
    // 默认值改为topLeft
    placement: {
      type: String as PropType<'top' | 'left' | 'right' | 'bottom' | 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight' | 'leftTop' | 'leftBottom' | 'rightTop' | 'rightBottom'>,
      default: 'topLeft'
    },
    // popover标题文字
    title: {
      type: String,
    },
    // 触发行为，可选 hover/focus/click/contextmenu
    trigger: {
      type: String as PropType<'hover' | 'focus' | 'click' | 'contextmenu'>,
      default: 'hover',
    },
    // 用于手动控制浮层显隐 (v-model)
    visible: {
      type: (Boolean || undefined) as PropType<boolean | undefined>,
      default: undefined
    },
  },
  setup(props, context) {
    const { arrowPointAtCenter, overlayClassName, align } = toRefs(props)
    // align配置
    const mergedAlign = computed(() => {
      let result: AlignProps = {
        offset: [0, 0],
      }
      if (align.value) result = { ...result, ...align.value }
      return result
    })
    // overlayClass 配置
    const mergedOverlayClassName = computed(() => {
      let result = ['x-popover']
      if (overlayClassName.value instanceof Array) result = [...result, ...overlayClassName.value]
      else if (typeof overlayClassName.value === 'string') result = [...result, ...overlayClassName.value.split(' ')]
      return result.join(' ')
    })
    // props
    const mergedProps = computed(() => {
      const result: Omit<typeof props, 'visible' | 'color'> & { visible?: boolean, color?: string } = {
        ...props,
        align: mergedAlign.value,
        overlayClassName: mergedOverlayClassName.value,
      }
      // 自动显隐fix：当用户未配置visible时删除这个prop
      if (result.visible === undefined) delete result.visible
      return result
    })
    return {
      slots: computed(() => Object.keys(context.slots)),
      props: mergedProps,
      visibleLocal: useModel('visible', props, context),
    }
  }
})
</script>

<style lang="scss">
@import './styles/components/XPopover/index.scss';
</style>
