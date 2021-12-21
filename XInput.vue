<template>
  <single-form-wrapper ref="form" :rules="rules" :error-tip-position="errorTipPosition">
    <a-input :class="`smartui-input ${wrapperClass}`" v-bind="props">
      <template v-for="item in slots" v-slot:[item]>
        <slot :name="item"></slot>
      </template>
    </a-input>
  </single-form-wrapper>
</template>

<script>
import { computed, onMounted, reactive, ref } from 'vue'
import SingleFormWrapper from './helper/SingleFormWrapper.vue'
import { Input } from 'ant-design-vue'
export default {
  name: 'XInput',
  components: {
    SingleFormWrapper
  },
  props: {
    ...Input.props,
    rules: {
      type: Array || null,
      default: null
    },
    errorTipPosition: {
      type: String,
      default: 'top'
    }
  },
  setup(props, context) {
    // 全部slots
    const slots = computed(() => Object.keys(context.slots))
    // 表单wrapper实例
    const form = ref({})
    // 表单class
    const wrapperClass = ref(context.attrs.class)
    let resetFields = null
    let validate = null
    let clearValidate = null
    onMounted(() => {
      resetFields = form.value.resetFields
      validate = form.value.validate
      clearValidate = form.value.clearValidate
    })
    return {
      props,
      form,
      resetFields,
      validate,
      clearValidate,
      slots,
      wrapperClass
    }
  }
}
</script>

<style lang="scss">
@import './styles/components/XInput';
</style>