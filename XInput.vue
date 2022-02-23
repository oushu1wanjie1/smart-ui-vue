<template>
  <single-form-wrapper ref="form" :rules="rules" :error-tip-position="errorTipPosition" :value="value">
    <template #default>
      <a-input :class="`smartui-input ${wrapperClass}`" v-bind="{ ...props }" :data-comp-id="compId" :style="wrapperStyle" v-on="mergedEvents">
        <template v-for="item in slots" v-slot:[item]>
          <slot :name="item"></slot>
        </template>
      </a-input>
    </template>
  </single-form-wrapper>
</template>

<script lang="ts">
import { computed, defineComponent, Ref, ref } from 'vue'
import SingleFormWrapper from './helper/SingleFormWrapper.vue'
import { excludeEventsInProps, isPropsStyleEventName, toNormalEventName, upperFirstLetter } from './utils'
import { Input } from 'ant-design-vue'
export default defineComponent({
  name: 'XInput',
  components: {
    SingleFormWrapper
  },
  props: {
    ...excludeEventsInProps(Input.props),
    value: {
      type: String,
      default: ''
    },
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
    const compId = context.attrs['data-comp-id'] || ''
    // 表单wrapper实例
    const form: Ref<InstanceType<typeof SingleFormWrapper> | null> = ref(null)
    // 表单class
    const wrapperClass = ref(context.attrs.class || '')
    const wrapperStyle = ref(context.attrs.style)
    const resetFields = computed(() => form.value && form.value.resetFields)
    const validate = computed(() => form.value && form.value.validate)
    const clearValidate = computed(() => form.value && form.value.clearValidate)
    // wrapper的验证事件和用户自定义事件的合并
    const mergedEvents = computed(() => {
      const result: Record<string, unknown> = {}
      // 获取用户自定义事件的key
      const userEvent = Object.keys(context.attrs).filter(isPropsStyleEventName)
      userEvent.forEach((key) => {
        const normalEventName = toNormalEventName(key)
        if (form.value && form.value.events && form.value.events[normalEventName]) {
          result[normalEventName] = () => {
            (<() => unknown>context.attrs[key])()
            if (form.value) form.value.events[normalEventName]()
          }
        } else {
          result[normalEventName] = context.attrs[key]
        }
      })
      return result
    })
    return {
      props,
      form,
      compId,
      resetFields,
      validate,
      clearValidate,
      slots,
      wrapperClass,
      wrapperStyle,
      mergedEvents
    }
  }
})
</script>

<style lang="scss">
@import './styles/components/XInput';
</style>