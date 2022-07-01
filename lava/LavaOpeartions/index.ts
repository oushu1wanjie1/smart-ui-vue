// LavaOperations组件item选项
export interface LavaOperationsItemParams {
  // item组件名称
  name?: string,
  // item组件props
  props?: Record<string, any>,
  // item组件需要声明的events
  events?: string[],
  // item组件对应的数据key
  key?: string,
  // item组件是否位于右边
  right?: boolean,
}
