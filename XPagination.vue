<template>
  <a-pagination>
    <template v-for="item in slots" v-slot:[item]>
      <slot :name="item"></slot>
    </template>
  </a-pagination>
</template>

<script lang="ts">
import { computed, defineComponent, Prop } from 'vue'
import { Pagination as APagination } from 'ant-design-vue'

export default defineComponent({
  name: 'XPagination',
  components: { APagination },
  setup(props, context) {
    return {
      slots: computed(() => Object.keys(context.slots))
    }
  }
})
</script>

<style scoped>

</style>