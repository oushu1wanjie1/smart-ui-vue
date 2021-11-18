<template>
  <a-tag :class="`x-tag x-tag-${colorType}`">
    <template v-for="item in slots" v-slot:[item]>
      <slot :name="item"></slot>
    </template>
    <template v-if="!slots.includes('closeIcon')" #closeIcon>
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g opacity="1">
          <path d="M4.97719 4.89L13.4625 13.3753" style="stroke: currentColor;" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M13.3742 5.10276L4.88896 13.588" style="stroke: currentColor;" stroke-linecap="round" stroke-linejoin="round"/>
        </g>
      </svg>
    </template>
  </a-tag>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'

export default defineComponent({
  name: 'XTag',
  props: {
    // 预设的tag配色方案
    colorType: String
  },
  setup(props, context) {
    return {
      slots: computed(() => Object.keys(context.slots)),
      attrs: context.attrs
    }
  }
})
</script>

<style lang="scss">
@import './styles/components/XTag/index';
</style>