<template>
  <a-checkbox-group>
    <template v-for="item in slots" v-slot:[item]>
      <slot :name="item"></slot>
    </template>
  </a-checkbox-group>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import ACheckboxGroup from 'ant-design-vue/es/checkbox/index'
import { Checkbox as ACheckbox } from 'ant-design-vue'

export default defineComponent({
  name: 'XCheckboxGroup',
  // eslint-disable-next-line vue/no-unused-components
  components: { ACheckbox, ACheckboxGroup },
  setup(props, context) {
    return {
      slots: computed(() => Object.keys(context.slots))
    }
  }
})
</script>

<style scoped>

</style>