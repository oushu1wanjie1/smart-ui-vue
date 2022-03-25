<template>
  <a-button :class="`x-btn`" v-bind="{ ...props }">
    <template v-if="!slots.includes('icon') && iconName" #icon>
      <icon :name="iconName"/>
    </template>
    <template v-for="item in slots" v-slot:[item]>
      <slot :name="item"/>
    </template>
  </a-button>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { Button } from 'ant-design-vue'
import Icon from './helper/Icon.vue'

export default defineComponent({
  name: 'XButton',
  // 修复 disabled tooltip 未消失的问题
  // 详见 tooltip.tsx 源代码 getDisabledCompatibleChildren 方法（line 92）
  __ANT_BUTTON: true,
  components: { Icon },
  props: {
    ...Button.props,
    /**
     * 作为 icon 组件的 name
     */
    iconName: String,
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
