<template>
  <single-form-wrapper :rules="rules" :class="`smartui-input ${attrs.class}`">
    <template #default="attrs">
      <a-input v-bind="attrs">
        <template v-for="item in slots" v-slot:[item]>
          <slot :name="item"></slot>
        </template>
      </a-input>
    </template>
  </single-form-wrapper>
</template>

<script>
import { computed } from 'vue'
import SingleFormWrapper from './helper/SingleFormWrapper.vue'
export default {
  name: 'XInput',
  components: {
    SingleFormWrapper
  },
  props: {
    rules: Array,
  },
  setup(props, context) {
    console.log('attr', context.attrs)
    // 全部slots
    const slots = computed(() => Object.keys(context.slots))
    // 根据是否有表单验证，控制传给a-input的attrs里的class名称
    const formattedAttrs = computed(() => {
      const result = { ...context.attrs }
      result.class = `smartui-input ${result.class}`
      if (props.rules && result.class) delete result.class
      return result
    })
    return {
      attrs: context.attrs,
      formattedAttrs,
      slots
    }
  }
}
</script>

<style lang="scss">
@import './styles/components/XInput';
</style>