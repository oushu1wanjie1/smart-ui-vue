<template>
  <a-radio-group>
    <template v-for="item in slots" v-slot:[item]>
      <slot :name="item"></slot>
    </template>
  </a-radio-group>
</template>

<script lang="ts">
import { computed, defineComponent, Prop } from 'vue'
import { Radio as ARadio } from 'ant-design-vue'

export default defineComponent({
  name: 'XRadioGroup',
  components: { ARadioGroup: ARadio.Group },
  setup(props, context) {
    return {
      slots: computed(() => Object.keys(context.slots))
    }
  }
})
</script>

<style scoped>

</style>