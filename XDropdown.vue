<template>
  <a-dropdown v-bind="{...props}">
    <template #overlay>
      <slot name="overlay"></slot>
    </template>
    <template v-for="item in slots" v-slot:[item]>
      <slot :name="item"></slot>
    </template>
  </a-dropdown>
</template>

<script lang="ts">
import { computed, CSSProperties, defineComponent, PropType } from 'vue'
import { DropdownArrowOptions } from 'ant-design-vue-3/lib/dropdown/props'
import PropTypes from 'ant-design-vue/es/_util/vue-types'
import { Dropdown as ADropdown } from 'ant-design-vue'


type Align = {
  points?: [string, string];
  offset?: [number, number];
  targetOffset?: [number, number];
  overflow?: {
    adjustX?: boolean;
    adjustY?: boolean;
  };
  useCssRight?: boolean;
  useCssBottom?: boolean;
  useCssTransform?: boolean;
};


export default defineComponent({
  name: 'XDropdown',
  components: { ADropdown },
  props: {
    arrow: {
      type: [Boolean, Object] as PropType<boolean | DropdownArrowOptions>,
      default: undefined,
    },
    trigger: {
      type: [Array, String] as PropType<
        ('click' | 'hover' | 'contextmenu')[] | 'click' | 'hover' | 'contextmenu'
        >,
      default: 'hover'
    },
    overlay: PropTypes.any,
    visible: { type: Boolean, default: undefined },
    disabled: { type: Boolean, default: undefined },
    align: { type: Object as PropType<Align> },
    getPopupContainer: Function as PropType<(triggerNode: HTMLElement) => HTMLElement>,
    prefixCls: String,
    transitionName: String,
    placement: {
      type: String as PropType<
        | 'topLeft'
        | 'topCenter'
        | 'top'
        | 'topRight'
        | 'bottomLeft'
        | 'bottomCenter'
        | 'bottom'
        | 'bottomRight'
        >,
      default: 'bottomLeft'
    },
    overlayClassName: String,
    overlayStyle: { type: Object as PropType<CSSProperties>, default: undefined as unknown as CSSProperties },
    forceRender: { type: Boolean, default: undefined },
    mouseEnterDelay: { type: Number, default: 0.15 },
    mouseLeaveDelay: { type: Number, default: 0.1 },
    openClassName: String,
    minOverlayWidthMatchTrigger: { type: Boolean, default: undefined },
    destroyPopupOnHide: { type: Boolean, default: undefined },
    onVisibleChange: {
      type: Function as PropType<(val: boolean) => void>,
    },
    'onUpdate:visible': {
      type: Function as PropType<(val: boolean) => void>,
    },
  },
  setup(props, context) {
    return {
      props,
      slots: computed(() => Object.keys(context.slots))
    }
  }
}
)</script>

<style scoped>

</style>