<template>
  <a-button :class="`x-btn ${wrapperClass}`" v-bind="{ ...props }" :style="wrapperStyle">
    <template v-for="item in slots" v-slot:[item]>
      <slot :name="item"></slot>
    </template>
  </a-button>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref } from 'vue'
import { excludeEventsInProps } from '@/smart-ui-vue/utils'
import { Button } from 'ant-design-vue'

export default defineComponent({
  name: 'XButton',
  props: {
    ...Button.props,
  },
  setup(props, context) {
    const wrapperClass = ref(context.attrs.class || '')
    const wrapperStyle = ref(context.attrs.style)

    return {
      slots: computed(() => Object.keys(context.slots)),
      props,
      wrapperClass,
      wrapperStyle,
    }
  }
})
</script>

<style lang="scss">
@import './styles/components/XButton/index.scss';
</style>
