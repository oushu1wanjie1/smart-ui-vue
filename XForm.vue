<template>
  <a-form v-bind="{ ...$props, ...$attrs}" class="smartui-form" ref="formRef">
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
      if (formRef.value) return formRef.value.validate.apply(this, args)
      else return Promise.reject('未找到Antd Form实例')
    }
    const validateFields = (...args: any[]) => {
      if (formRef.value) return formRef.value.validateFields.apply(this, args)
      else return Promise.reject('未找到Antd Form实例')
    }
    const scrollToField = (...args: any[]) => {
      if (formRef.value) return formRef.value.scrollToField.apply(this, args)
      else return Promise.reject('未找到Antd Form实例')
    }
    const resetFields = (...args: any[]) => {
      if (formRef.value) return formRef.value.resetFields.apply(this, args)
      else return Promise.reject('未找到Antd Form实例')
    }
    const clearValidate = (...args: any[]) => {
      if (formRef.value) return formRef.value.clearValidate.apply(this, args)
      else return Promise.reject('未找到Antd Form实例')
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
