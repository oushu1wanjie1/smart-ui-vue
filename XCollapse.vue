<template>
  <a-collapse class="smartui-collapse" :expandIconPosition="expandIconPosition">
    <template #expandIcon>
      <icon image name="ui-collapse/arrow"></icon>
    </template>
    <template v-for="slotName in slots" v-slot:[slotName]>
      <slot :name="slotName"></slot>
    </template>
  </a-collapse>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import Icon from './helper/Icon.vue'
import { Collapse as ACollapse } from 'ant-design-vue-3'

export default defineComponent({
  name: 'XCollapse',
  components: {
    Icon,
    ACollapse,
  },
  props: {
    expandIconPosition: {
      type: String,
      default: 'right'
    }
  },
  setup(props, context) {

    return {
      slots: computed(() => Object.keys(context.slots))
    }
  }
})
</script>

<style lang="scss">
@import './styles/components/XCollapse';
</style>