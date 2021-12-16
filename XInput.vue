<template>
  <single-form-wrapper ref="form" :rules="rules" :class="`smartui-input`">
    <template #default="slotAttrs">
      <a-input v-bind="slotAttrs">
        <template v-for="item in slots" v-slot:[item]>
          <slot :name="item"></slot>
        </template>
      </a-input>
    </template>
  </single-form-wrapper>
</template>

<script>
import { computed, ref } from 'vue'
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
    // 全部slots
    const slots = computed(() => Object.keys(context.slots))
    // 表单wrapper实例
    const form = ref({})
    const resetFields = computed(() => form.value.resetFields)
    const validate = computed(() => form.value.validate)
    const clearValidate = computed(() => form.value.clearValidate)
    return {
      attrs: context.attrs,
      form,
      resetFields,
      validate,
      clearValidate,
      slots
    }
  }
}
</script>

<style lang="scss">
@import './styles/components/XInput';
</style>