<template>
  <a-tag class="x-tag">
    <template v-for="item in slots" v-slot:[item]>
      <slot :name="item"></slot>
    </template>
  </a-tag>
</template>

<script lang="ts">
import {computed, defineComponent, Prop} from "vue";

export default defineComponent({
  name: 'XTag',
  setup(props, context) {
    return {
      slots: computed(() => Object.keys(context.slots))
    }
  }
})
</script>

<style lang="scss">
@import './styles/components/XTag/index';
</style>