<template>
  <a-time-picker>
    <template v-for="item in slots" v-slot:[item]>
      <slot :name="item"></slot>
    </template>
  </a-time-picker>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { TimePicker as ATimePicker } from 'ant-design-vue-3'

export default defineComponent({
  name: 'XTimePicker',
  components: { ATimePicker },
  setup(props, context) {
    return {
      slots: computed(() => Object.keys(context.slots))
    }
  }
})
</script>

<style scoped>

</style>