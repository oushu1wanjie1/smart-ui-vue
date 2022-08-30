import { TableColumnProps } from 'ant-design-vue-3'
import { ColumnFilterItem } from 'ant-design-vue-3/lib/table/interface'

export type XTableColumnFilterItem = ColumnFilterItem & Record<string, unknown>
export type XTableColumnLegacySlots = {
  filterDropdown?: string,
  filterIcon?: string,
  customRender?: string,
  title?: string,
}

export type XTableColumnProps = Exclude<TableColumnProps, 'filters'> & {
  // filters支持antd默认格式(可以加额外参数)，和返回该格式的函数(用于无限加载的filters列表)
  filters?: XTableColumnFilterItem[] | ((pageNum: number) => XTableColumnFilterItem[] | Promise<XTableColumnFilterItem[]>),
  // 兼容2.x的slot配置
  slots?: XTableColumnLegacySlots
}
