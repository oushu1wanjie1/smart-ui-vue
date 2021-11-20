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
import { computed, provide, ref, toRefs } from 'vue'
import { useForm } from 'ant-design-vue/es/form'
export default {
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
    const { validateInfos } = useForm(hiddenForm, hiddenRules)

    provide('form', formInstance)
    return {
      attrs: context.attrs,
      validateInfos,
    }
  },
}
</script>

<style lang="scss">

</style>