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
import Icon from '@/smart-ui-vue/helper/Icon.vue'

export default defineComponent({
  name: 'XButton',
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
  }
})
</script>

<style lang="scss">
@import './styles/components/XButton/index.scss';
</style>
