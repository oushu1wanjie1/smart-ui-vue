<template>
  <a-model class="x-modal">
    <template v-for="item in slots" v-slot:[item]>
      <slot :name="item"></slot>
    </template>
  </a-model>
</template>

<script lang="ts">
import {computed, defineComponent, Prop} from "vue";

export default defineComponent({
  name: 'XModal',
  setup(props, context) {
    return {
      slots: computed(() => Object.keys(context.slots))
    }
  }
})
</script>

<style lang="scss">
@import './styles/components/XModal/index.scss';
</style>