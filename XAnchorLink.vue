<template>
  <a-anchor-link
    :class="{ 'smartui-anchor-link': true, 'has-child': slots.length }"
    :data-depth="depth"
    ref="anchorLink"
  >
    <template v-for="item in slots" v-slot:[item]>
      <slot :name="item"></slot>
    </template>
  </a-anchor-link>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref, Ref, ComponentPublicInstance } from 'vue'

const BASE_OFFSET = 17
const DEPTH_OFFSET = 16

export default defineComponent({
  name: 'XAnchorLink',
  props: {
    depth: {
      type: Number,
      default: 0
    }
  },
  setup(props, context) {
    const left = computed(() => `-${props.depth * DEPTH_OFFSET + BASE_OFFSET}px`)
    const anchorLink: Ref<any> = ref(null)

    function handleAddPoint(): void {
      const linkEl: HTMLElement = (<Ref<ComponentPublicInstance>>anchorLink).value.$el
      const linkTitle = linkEl.querySelector('.ant-anchor-link-title')
      const div = document.createElement('div')
      div.setAttribute('class', 'x-ant-anchor-link-point')
      div.style.left = left.value
      if (linkTitle) linkTitle.append(div)
    }
    onMounted(() => {
      handleAddPoint()
    })
    return {
      slots: computed(() => Object.keys(context.slots)),
      anchorLink
    }
  }
})
</script>

<style lang="scss">
@import './styles/components/XAnchorLink.scss';
</style>