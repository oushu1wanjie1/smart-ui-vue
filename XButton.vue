<template>
  <a-button :class="`x-btn`" v-bind="{ ...props }">
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
