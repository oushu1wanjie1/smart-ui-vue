<template>
  <a-checkbox-group>
    <template v-for="item in slots" v-slot:[item]>
      <slot :name="item"></slot>
    </template>
  </a-checkbox-group>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { Checkbox as ACheckbox } from 'ant-design-vue'

export default defineComponent({
  name: 'XCheckboxGroup',
  // eslint-disable-next-line vue/no-unused-components
  components: { ACheckbox, ACheckboxGroup: ACheckbox.Group },
  setup(props, context) {
    return {
      slots: computed(() => Object.keys(context.slots))
    }
  }
})
</script>

<style scoped>

</style>