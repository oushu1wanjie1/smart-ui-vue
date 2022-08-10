<template>
  <x-form v-if="rules && !originForm" style="width: 100%;">
    <x-form-item :error-tip-position="errorTipPosition" v-bind="validateInfos.value" auto-height>
      <slot v-bind="events"></slot>
    </x-form-item>
  </x-form>
  <a-form v-else-if="rules && originForm" style="width: 100%;">
    <x-form-item v-bind="validateInfos.value" class="raw">
      <slot v-bind="events"></slot>
    </x-form-item>
  </a-form>
  <slot v-else v-bind="events"></slot>
</template>

<script lang="ts">
import XForm from '../XForm.vue'
import XFormItem from '../XFormItem.vue'
import { computed, defineComponent, nextTick, ref, toRefs, PropType } from 'vue'
import { useForm } from 'ant-design-vue/es/form'
import { Props } from 'ant-design-vue/es/form/useForm'
import { Form as AForm } from 'ant-design-vue'


export default defineComponent({
  inheritAttrs: false,
  name: 'SingleFormWrapper',
  components: { XFormItem, XForm, AForm },
  props: {
    rules: {
      type: Array as PropType<Props[]>,
      default: () => []
    },
    value: {
      type: [String, Number, Boolean],
      default: ''
    },
    errorTipPosition: {
      type: String,
      default: 'top'
    },
    originForm: {
      type: Boolean,
      default: false
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
      return (rules.value || []).map(item => item.trigger || 'change').flat().reduce((prev, item) => {
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