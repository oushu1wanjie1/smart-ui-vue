import { Table, TableColumnProps } from 'ant-design-vue-3'
import { ColumnFilterItem } from 'ant-design-vue-3/lib/table/interface'
import { DefineComponent, Ref } from 'vue'

// XTable的filter item, 除了text和value外可以加其他参数
export type XTableColumnFilterItem = ColumnFilterItem & Record<string, unknown>

// 兼容antd2的column slots格式
export type XTableColumnLegacySlots = {
  filterDropdown?: string,
  filterIcon?: string,
  customRender?: string,
  title?: string,
}

// XTable的props
export type XTableColumnProps = Exclude<TableColumnProps, 'filters'> & {
  // filters支持antd默认格式(可以加额外参数)，和返回该格式的函数(用于无限加载的filters列表)
  filters?: XTableColumnFilterItem[] | ((pageNum: number) => XTableColumnFilterItem[] | Promise<XTableColumnFilterItem[]>),
  // 兼容2.x的slot配置
  slots?: XTableColumnLegacySlots
  // 是否在当前column后显示纵向的分隔线
  divider?: boolean
  // filter默认空值(清除筛选)
  nullFilterValue?: any
}

// XTable的state
export interface XTableState {
  // table唯一标识
  id: string,
  // 所有动态加载的filters列表
  dynamicFilters: Record<string, { item: XTableColumnFilterItem[], pageNum: number }>,
  // 最终控制空状态table高度的值
  finalEmptyHeight: string
}

export type XTableHandlerParams = {
  state: XTableState,
  propEmptyHeight: Ref<string>
  aTableRef: Ref<InstanceType<typeof Table> | null>
}
