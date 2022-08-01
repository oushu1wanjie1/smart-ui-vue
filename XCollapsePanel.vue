<template>
  <a-collapse-panel>
    <template v-for="slotName in slots" v-slot:[slotName]>
      <slot :name="slotName"></slot>
    </template>
  </a-collapse-panel>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import ACollapsePanel from 'ant-design-vue-3/es/collapse/CollapsePanel'

export default defineComponent({
  name: 'XCollapsePanel',
  components: { ACollapsePanel },
  setup(props, context) {

    return {
      slots: computed(() => Object.keys(context.slots))
    }
  }
})
</script>

<style lang="scss">

</style>