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

export function upperFirstLetter(str = '') {
  if (!str.length) return ''
  return str[0].toUpperCase() + str.substring(1)
}

/**
 * 转换默认的事件名为props风格的事件名(on开头)
 * @param name 事件名
 */
export function toPropsStyleEventName(name: string): string {
  return `on${name[0].toUpperCase() + name.substring(1)}`
}

/**
 * 判断是否是props风格的事件名
 * @param name
 */
export function isPropsStyleEventName(name: string): boolean {
  return /^on[A-Z]\w+$/.test(name)
}

/**
 * 转换props风格的事件名为默认事件名，如果传入的name格式不为props风格，则原样返回
 * @param propsStyleName
 */
export function toNormalEventName(propsStyleName: string): string {
  if (isPropsStyleEventName(propsStyleName)) {
    // eslint-disable-next-line no-magic-numbers
    return propsStyleName.substring(2).toLowerCase()
  } else {
    return propsStyleName
  }
}

/**
 * 排除Props中所有的事件props
 * @param propsObj
 */
export function excludeEventsInProps(propsObj: Record<string, any>): Record<string, any> {
  const result: Record<string, any> = {}
  for (const key in propsObj) {
    if (!isPropsStyleEventName(key)) result[key] = propsObj[key]
  }
  return result
}

