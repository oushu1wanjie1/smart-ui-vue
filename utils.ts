import { computed, ref } from 'vue'

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

export function useModelWithDefault(name: string, props: any, context: any) {
  if (typeof props[`onUpdate:${name}`] === 'function')
    return useModel(name, props, context)
  else
    return ref(props.name)
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
  return /^on[A-Z][\w|:]+$/.test(name)
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


/**
 * 删除 undefined 的属性
 * - 如果传了参数propKeys，则对propKeys的每一项进行检查，如果没有传值，则在propsObj中删除
 * - 否则，对所有propsObj内的key进行上述检查
 * @param propsObj
 * @param propKeys
 */
export function excludeNotExistProps(propsObj: Record<string, any>, propKeys?: string[]): Record<string, any> {
  const result: Record<string, any> = { ...propsObj }
  if (propKeys) {
    propKeys.forEach((propKey: string) => {
      if (result[propKey] === undefined) {
        delete result[propKey]
      }
    })
  } else {
    Object.keys(result).forEach((key: string) => {
      if (result[key] === undefined) {
        delete result[key]
      }
    })
  }
  return result
}

/**
 * 获取一个随机uuid
 * @param dash
 */
export const uuid = ({ dash } = { dash: true }) => {
  let result = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0,
      v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
  if (!dash) result = result.replaceAll('-', '')
  return result
}

export function windowOpen(url: string, strWindowName: string) {
  window.open(url, strWindowName)
}

export const isProduction = process.env.NODE_ENV === 'production'


export declare function toHandler<T, U extends any[], V>(f: (x: T, ...args: U) => V, x: T): (...args: U) => V


type F<T, U extends any[], V, S extends string> = Record<S, (x: T, ...args: U) => V>

export const useHandler = <T, U extends any[], V, S extends string>(params: T, functions: F<T, U, V, S>) => {
  const result = {} as Record<S, (...args: U) => V>
  (Object.keys(functions) as S[]).forEach(key => {
    result[key] = (...args) => functions[key](params, ...args)
  })
  return result
}

export const useHandler1 = <T, U extends any[], V, K extends string>(params: T, functions: Record<K, (p: T, ...args: U) => V>) => {
  const result = {} as Record<K, (...args: U) => V>
  (Object.keys(functions) as K[]).forEach(key => {
    result[key] = (...args) => functions[key](params, ...args)
  })
  return result
}

// declare function bind<T, U extends any[], V>(f: (x: T, ...args: U) => V, x: T): (...args: U) => V;
//
// declare function f3(x: number, y: string, z: boolean): void;
//
// const f2 = bind(f3, 42) // (y: string, z: boolean) => void
// const f1 = bind(f2, 'hello') // (z: boolean) => void
// const f0 = bind(f1, true) // () => void

