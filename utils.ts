import { computed } from 'vue'

export function useModel(name: string, props: any, context: any) {
  return computed({
    get() {
      return props[name]
    },
    set(val) {
      context.emit(`update:${name}`, val)
    },
  })
}

export function getModelType(formItemType: any) {
  switch (formItemType) {
    case 'XSelect':
    case 'XRangePicker':
      return []
    default:
      return null
  }
}

export function getModelName(formItemType: any) {
  switch (formItemType) {
    case 'XSelect':
    case 'XRangePicker':
      return 'value'
    default:
      return 'modelValue'
  }
}

export default {
  useModel,
  getModelType,
  getModelName,
}
