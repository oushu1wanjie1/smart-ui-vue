<template>
  <a-anchor class="smartui-anchor">
    <template v-for="item in slots" v-slot:[item]>
      <slot :name="item"></slot>
    </template>
  </a-anchor>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { Anchor as AAnchor } from 'ant-design-vue'

export default defineComponent({
  name: 'XAnchor',
  components: { AAnchor },
  setup(props, context) {
    return {
      slots: computed(() => Object.keys(context.slots))
    }
  }
})
</script>

<style lang="scss">
@import './styles/components/XAnchor.scss';
</style>