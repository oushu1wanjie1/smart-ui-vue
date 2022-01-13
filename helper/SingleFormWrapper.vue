<template>
  <x-form v-if="rules">
    <x-form-item :error-tip-position="errorTipPosition" v-bind="validateInfos.value">
      <slot v-bind="events"></slot>
    </x-form-item>
  </x-form>
  <slot v-else v-bind="events"></slot>
</template>

<script lang="ts">
import XForm from '../XForm.vue'
import XFormItem from '../XFormItem.vue'
import { computed, defineComponent, nextTick, ref, toRefs } from 'vue'
import { useForm } from 'ant-design-vue/es/form'


export default defineComponent({
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
  setup(props) {
    const { rules, value } = toRefs(props)
    const hiddenForm = computed(() => {
      return {
        value: value.value,
      }
    })
    const hiddenRules = ref({ value: rules.value || [] })
    const { clearValidate, resetFields, validate, validateInfos } = useForm(hiddenForm, hiddenRules)
    const events = computed(() => {
      return (rules.value || []).map((item: unknown) => (<Record<string, any>>item).trigger || 'change').flat().reduce((prev, item) => {
        return {
          ...prev,
          [item]: () => {
            nextTick(() => {
              validate('value', { trigger: [item] })
            })
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
})
</script>

<style lang="scss">

</style>