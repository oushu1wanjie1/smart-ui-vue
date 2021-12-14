<template>
  <x-form :ref="formInstance" v-if="rules">
    <x-form-item v-bind="validateInfos.value">
      <slot v-bind="attrs"></slot>
    </x-form-item>
  </x-form>
  <slot v-else v-bind="attrs"></slot>
</template>

<script>
import XForm from '../XForm.vue'
import XFormItem from '../XFormItem.vue'
import { computed, ref, toRefs } from 'vue'
import { useForm } from 'ant-design-vue/es/form'

export function upperFirstLetter(str = '') {
  if (!str.length) return ''
  return str[0].toUpperCase() + str.substring(1)
}
export default {
  inheritAttrs: false,
  name: 'SingleFormWrapper',
  components: { XFormItem, XForm },
  props: {
    rules: Array,
  },
  setup(props, context) {
    const { rules } = toRefs(props)
    const formInstance = ref(null)
    const hiddenForm = computed(() => {
      return {
        value: context.attrs.value
      }
    })
    const hiddenRules = ref({ value: rules })
    const { clearValidate, resetFields, validate, validateInfos } = useForm(hiddenForm, hiddenRules)

    const mergedAttrs = computed(() => {
      const triggers = rules.value.filter(rule => rule.trigger).reduce((prev, item) => {
        const key = `on${upperFirstLetter(item.trigger)}`
        return {
          [key]: () => {
            validate('value', { trigger: item.trigger }).catch(() => {})
          }
        }
      }, {})
      return {
        ...triggers,
        ...context.attrs
      }
    })

    return {
      attrs: mergedAttrs,
      validateInfos,
      hiddenForm,
      formInstance,
      resetFields,
      validate,
      clearValidate,
    }
  },
}
</script>

<style lang="scss">

</style>