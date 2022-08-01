<template>
  <a-tab-pane>
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
import { Tabs as ATabs } from 'ant-design-vue'

export default defineComponent({
  name: 'XTabPane',
  components: { ATabPane: ATabs.TabPane },
  props: {},
  setup(props, context) {

    return {
      slots: computed(() => Object.keys(context.slots))
    }
  }
})
</script>
