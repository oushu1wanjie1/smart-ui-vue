<template>
  <a-checkbox class="smartui-checkbox">
    <template v-for="item in slots" v-slot:[item]>
      <slot :name="item"></slot>
    </template>
  </a-checkbox>
</template>

<script lang="ts">
import { computed, defineComponent, Prop } from 'vue'
import { Checkbox as ACheckbox } from 'ant-design-vue'

export default defineComponent({
  name: 'XCheckbox',
  __ANT_CHECKBOX: true,
  components: { ACheckbox },
  setup(props, context) {
    return {
      slots: computed(() => Object.keys(context.slots)),
    }
  },
})
</script>

<style lang="scss">
@import "./styles/components/XCheckbox.scss";
</style>
