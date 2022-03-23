<template>
  <a-tab-pane>
<!--    <template v-for="item in slots" v-slot:[item]>-->
<!--      <slot :name="item"></slot>-->
<!--    </template>-->
    <template #default>
      <slot name="default"></slot>
    </template>
    <template #tab>
      <slot name="tab"></slot>
    </template>
  </a-tab-pane>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, PropType } from 'vue'
import { VNodeChild } from '@vue/runtime-core'

export default defineComponent({
  name: 'XTabPane',
  props: {
    forceRender: Boolean,
    tab: Object as PropType<string | VNodeChild>
  },
  setup(props, context) {

    return {
      slots: computed(() => Object.keys(context.slots))
    }
  }
})
</script>
