<template>
  <a-card class="smartui-card">
    <template v-for="item in slots" v-slot:[item]>
      <slot :name="item"></slot>
    </template>
  </a-card>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { Card as ACard } from 'ant-design-vue'

export default defineComponent({
  name: 'XCard',
  components: { ACard },
  setup(props, context) {
    return {
      slots: computed(() => Object.keys(context.slots))
    }
  }
})
</script>

<style lang="scss">
@import './styles/components/XCard.scss';
</style>
