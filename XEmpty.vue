<template>
  <a-empty :image="imageRender">
  </a-empty>
</template>

<script lang="ts">
import { computed, defineComponent, h, toRefs } from 'vue'
import Icon from './helper/Icon.vue'

export default defineComponent({
  name: 'XEmpty',
  components: { Icon },
  props: {
    image: String
  },
  setup(props, context) {
    const { image } = toRefs(props)
    const imageRender = computed(() => {
      return h(Icon, { name: image.value }, {})
    })
    return {
      slots: computed(() => Object.keys(context.slots)),
      attrs: context.attrs,
      imageRender
    }
  }
})
</script>

<style scoped>

</style>