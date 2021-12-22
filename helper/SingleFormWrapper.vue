<template>
  <x-form v-if="rules">
    <x-form-item :error-tip-position="errorTipPosition" v-bind="validateInfos.value">
      <slot v-bind="events"></slot>
    </x-form-item>
  </x-form>
  <slot v-else></slot>
</template>

<script>
import XForm from '../XForm.vue'
import XFormItem from '../XFormItem.vue'
import { computed, onUpdated, ref, toRefs } from 'vue'
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
    rules: {
      type: Array,
      default: () => []
    },
    value: {
      type: [String, Number, Boolean],
      default: ''
    },
    errorTipPosition: {
      type: String,
      default: 'top'
    }
  },
  setup(props, context) {
    const { rules, value } = toRefs(props)
    const hiddenForm = computed(() => {
      return {
        value: value.value,
      }
    })
    const hiddenRules = ref({ value: rules })
    const { clearValidate, resetFields, validate, validateInfos } = useForm(hiddenForm, hiddenRules)
    const events = computed(() => {
      return (rules.value || []).filter(rule => rule.trigger).reduce((prev, item) => {
        const key = `on${upperFirstLetter(item.trigger)}`
        return {
          [key]: () => {
            validate('value', { trigger: item.trigger })
          }
        }
      }, {})
    })

    return {
      validateInfos,
      hiddenForm,
      resetFields,
      validate,
      clearValidate,
      events
    }
  },
}
</script>

<style lang="scss">

</style>