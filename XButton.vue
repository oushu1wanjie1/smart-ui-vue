<template>
  <a-button class="x-btn">
    <template v-for="item in slots" v-slot:[item]>
      <slot :name="item"></slot>
    </template>
  </a-button>
</template>

<script lang="ts">
import {computed, defineComponent, Prop} from "vue";

export default defineComponent({
  name: 'XButton',
  setup(props, context) {
    return {
      slots: computed(() => Object.keys(context.slots))
    }
  }
})
</script>

<style lang="scss">
@import './styles/components/XButton/index.scss';
</style>