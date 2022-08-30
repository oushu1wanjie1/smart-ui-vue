<template>
  <a-button :class="`x-btn`" v-bind="{ ...props }">
    <template v-if="!slots.includes('icon') && iconName" #icon>
      <icon :name="iconName" image/>
    </template>
    <template v-for="item in slots" v-slot:[item]>
      <slot :name="item"/>
    </template>
  </a-button>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue'
import { Button as AButton } from 'ant-design-vue-3'
import Icon from './helper/Icon.vue'
import { ButtonType } from 'ant-design-vue/es/button'

export default defineComponent({
  name: 'XButton',
  // 修复 disabled tooltip 未消失的问题
  // 详见 tooltip.tsx 源代码 getDisabledCompatibleChildren 方法（line 92）
  __ANT_BUTTON: true,
  components: { Icon, AButton },
  props: {
    ...AButton.props,
    /**
     * 作为 icon 组件的 name
     */
    iconName: String,
    type: String as PropType<ButtonType>,
    disabled: Boolean,
    loading: Boolean
  },
  setup(props, context) {
    return {
      slots: computed(() => Object.keys(context.slots)),
      props,
    }
  },
})
</script>

<style lang="scss">
@import './styles/components/XButton/index.scss';
</style>
