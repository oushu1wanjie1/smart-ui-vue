<template>
  <a-form ref="formRef" v-bind="{ ...$props, ...$attrs}" class="smartui-form">
    <slot></slot>
  </a-form>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { Form as AForm } from 'ant-design-vue'

export default defineComponent({
  name: 'XForm',
  components: { AForm },
  props: {
    hideRequiredMark: {
      type: Boolean,
      default: true,
    }
  },
  setup() {
    const formRef = ref<Record<string, any> | null>(null)
    const validate = (...args: any[]) => {
      if (formRef.value) formRef.value.validate.apply(this, args)
    }
    const validateFields = (...args: any[]) => {
      if (formRef.value) formRef.value.validateFields.apply(this, args)
    }
    const scrollToField = (...args: any[]) => {
      if (formRef.value) formRef.value.scrollToField.apply(this, args)
    }
    const resetFields = (...args: any[]) => {
      if (formRef.value) formRef.value.resetFields.apply(this, args)
    }
    const clearValidate = (...args: any[]) => {
      if (formRef.value) formRef.value.clearValidate.apply(this, args)
    }
    return {
      formRef,
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
