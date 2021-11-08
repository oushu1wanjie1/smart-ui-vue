<template>
  <a-time-picker>
    <template v-for="item in slots" v-slot:[item]>
      <slot :name="item"></slot>
    </template>
  </a-time-picker>
</template>

<script lang="ts">
import {computed, defineComponent, Prop} from "vue";

export default defineComponent({
  name: 'XTimePicker',
  setup(props, context) {
    return {
      slots: computed(() => Object.keys(context.slots))
    }
  }
})
</script>

<style scoped>

</style>