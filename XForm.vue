<template>
  <a-form ref="antdForm" class="smartui-form">
    <slot></slot>
  </a-form>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { Form } from 'ant-design-vue'

export default defineComponent({
  name: 'XForm',
  components: { AForm: Form },
  setup() {
    const antdForm = ref<Record<string, any> | null>(null)
    const validate = () => {
      if (antdForm.value) antdForm.value.validate.apply(this, arguments)
    }
    const validateFields = () => {
      if (antdForm.value) antdForm.value.validateFields.apply(this, arguments)
    }
    const scrollToField = () => {
      if (antdForm.value) antdForm.value.scrollToField.apply(this, arguments)
    }
    const resetFields = () => {
      if (antdForm.value) antdForm.value.resetFields.apply(this, arguments)
    }
    const clearValidate = () => {
      if (antdForm.value) antdForm.value.clearValidate.apply(this, arguments)
    }
    return {
      antdForm,
      validate,
      validateFields,
      scrollToField,
      resetFields,
      clearValidate
    }
  }
})
</script>

<style lang="scss">
@import './styles/components/XForm';
</style>
