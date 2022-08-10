<template>
  <a-switch class="x-switch" v-model:checked="checkedLocal">
    <template v-for="item in slots" v-slot:[item]>
      <slot :name="item"></slot>
    </template>
  </a-switch>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useModel } from './utils'
import { Switch as ASwitch } from 'ant-design-vue'

export default defineComponent({
  name: 'XSwitch',
  components: { ASwitch },
  props: {
    checked: {
      type: Boolean,
      default: false
    }
  },
  __ANT_SWITCH: true,
  setup(props, context) {
    const checkedLocal = useModel('checked', props, context)
    return {
      slots: computed(() => Object.keys(context.slots)),
      checkedLocal,
    }
  }
})
</script>

<style lang="scss">
@import './styles/components/XSwitch/index';
</style>