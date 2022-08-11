<template>
  <a-slider>
    <template v-for="item in slots" v-slot:[item]>
      <slot :name="item"></slot>
    </template>
  </a-slider>
</template>

<script lang="ts">
import { computed, defineComponent, Prop } from 'vue'
import { Slider as ASlider } from 'ant-design-vue'

export default defineComponent({
  name: 'XSlider',
  components: { ASlider },
  setup(props, context) {
    return {
      slots: computed(() => Object.keys(context.slots))
    }
  }
})
</script>

<style scoped>

</style>