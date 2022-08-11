<template>
  <a-radio>
    <template v-for="item in slots" v-slot:[item]>
      <slot :name="item"></slot>
    </template>
  </a-radio>
</template>

<script lang="ts">
import { computed, defineComponent, Prop } from 'vue'
import { Radio as ARadio } from 'ant-design-vue'

export default defineComponent({
  name: 'XRadio',
  components: { ARadio },
  setup(props, context) {
    return {
      slots: computed(() => Object.keys(context.slots))
    }
  }
})
</script>

<style scoped>

</style>