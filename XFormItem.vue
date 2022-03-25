<template>
  <a-form-item
    :class="{
      'smartui-form-item': true,
      'error-bottom': errorTipPosition === 'bottom',
      'smartui-form-item-disabled': labelDisabled,
    }"
    v-bind="$props"
  >
    <template v-for="item in slots" v-slot:[item]>
      <slot :name="item"/>
    </template>
  </a-form-item>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue'
import PropTypes from 'ant-design-vue/es/_util/vue-types'
import { tuple } from 'ant-design-vue/es/_util/type'
import { VNodeChild } from '@vue/runtime-core'

export default defineComponent({
  name: 'XFormItem',
  props: {
    /**
     * @type {String}
     * errorTip的位置: top | bottom
     */
    errorTipPosition: {
      type: String,
      default: 'top',
    },
    /**
     * 原form-item height = min(50px, form-item-content height)
     * 设为true，取消上述行为
     */
    autoHeight: {
      type: Boolean,
      default: false,
    },
    /**
     * 当前 item label 是否禁用（字体颜色变化）
     */
    labelDisabled: {
      type: Boolean,
      default: false,
    },
    id: String,
    htmlFor: String,
    prefixCls: String,
    label: Object as PropType<string | VNodeChild>,
    help: Object as PropType<string | VNodeChild>,
    extra: Object as PropType<string | VNodeChild>,
    labelCol: Object,
    wrapperCol: Object,
    hasFeedback: {
      type: Boolean,
      default: false
    },
    colon: {
      type: Boolean,
      default: false
    },
    labelAlign: String as PropType<'left' | 'right'>,
    prop: {
      type: [String, Number, Array]
    },
    name: {
      type: [String, Number, Array]
    },
    rules: {
      type: [Array, Object]
    },
    autoLink: {
      type: Boolean,
      default: true,
    },
    // TODO 有问题暂时禁用，可以先用rules里的required
    // required: Boolean,
    validateFirst: Boolean,
    validateStatus: String as PropType<'' | 'success' | 'warning' | 'error' | 'validating'>,
    validateTrigger: {
      type: [String, Array]
    },
    messageVariables: Object,
    hidden: Boolean,
  },
  setup(props, context) {
    return {
      slots: computed(() => Object.keys(context.slots)),
    }
  },
})
</script>

<style lang="scss">
@import './styles/components/XFormItem';
</style>