<template>
  <a-empty class="smartui-empty" :image="imageRender">
    <template #description>
      <span v-if="description">{{ description }}</span>
      <slot v-else name="description"></slot>
    </template>
  </a-empty>
</template>

<script lang="ts">
import { computed, defineComponent, h, toRefs } from 'vue'
import Icon from './helper/Icon.vue'
import { Empty as AEmpty } from 'ant-design-vue-3'

export default defineComponent({
  name: 'XEmpty',
  components: { AEmpty },
  props: {
    image: String,
    imageStyle: {
      type: Object,
      default: () => {
        return { width: '180px', height: '164.55px' }
      }
    },
    description: String
  },
  setup(props, context) {
    const { image, imageStyle } = toRefs(props)
    const imageRender = h(Icon, { name: image.value, style: imageStyle.value, image: true }, {})

    return {
      slots: computed(() => Object.keys(context.slots)),
      attrs: context.attrs,
      imageRender
    }
  }
})
</script>

<style lang="scss">
@import './styles/components/XEmpty.scss';
</style>