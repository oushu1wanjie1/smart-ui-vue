<template>
  <a-table
    :class="{
      'smartui-table-next': true,
      'smartui-table-border': bordered,
      [`x-table-${id}`]: true,
      'smartui-table-edit': editTable,
      'smartui-table-divider': divider
    }"
    ref="aTableRef"
    :columns="mergedColumnsCpt"
    :dataSource="dataSource"
    :loading="loading"
    :pagination="mergedPaginationCpt"
    :style="{ height: dataSource.length ? 'auto' : emptyHeight }"
    :showSorterTooltip="false"
  >
<!--    兼容antd2.x的写法，因为3.x的column不能再配置slots-->
<!--    slots.title to headerCell-->
    <template #headerCell="scope">
<!--      在有filter的情况下header需要和filter放置在一起，点击header也可以弹出filter，所以用filter上的文字代替本来的header-->
      <span v-if="scope.column.filters">{{ '' }}</span>
      <slot v-else-if="columnsWithSlotsCpt.headerCell[scope.column.key]" :name="columnsWithSlotsCpt.headerCell[scope.column.key]" v-bind="scope" />
    </template>
<!--    slots.customRender to bodyCell-->
    <template #bodyCell="scope">
      <slot v-if="columnsWithSlotsCpt.bodyCell[scope.column.key]" :name="columnsWithSlotsCpt.bodyCell[scope.column.key]" v-bind="scope" />
    </template>
<!--    slot.filterDropdown to customFilterDropdown-->
    <template #customFilterDropdown="scope">
      <!--      用户自定义的filter-->
      <slot
        v-if="columnsWithSlotsCpt.customFilterDropdown[scope.column.key]"
        :name="columnsWithSlotsCpt.customFilterDropdown[scope.column.key]"
        v-bind="scope"
      />
      <!--      默认的filter-->
      <x-table-filter-dropdown v-else :scope="scope" />
    </template>
<!--    slot.filterIcon 使用固定的icon-->
    <template #customFilterIcon="{ column }">
      <template v-if="column.filters">
        <span class="smartui-filter-pseudo-title">{{ column.title }}</span>
        <icon class="btn-filter-icon" color="currentColor" name="ui-table/filter"/>
      </template>
    </template>
<!--    空状态-->
    <template #emptyText>
      <x-empty :description="emptyDescription" :image="emptyImage"
               :image-style="{ width: `${DEFAULT_EMPTY_IMAGE_WIDTH}px`, height: `${DEFAULT_EMPTY_IMAGE_HEIGHT}73.13px` }">
        <template #description>
          <slot name="emptyDescription"></slot>
        </template>
      </x-empty>
    </template>
  </a-table>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  h,
  inject,
  nextTick, onBeforeMount,
  onMounted,
  PropType,
  provide,
  reactive,
  ref,
  toRefs
} from 'vue'
import { Table as ATable } from 'ant-design-vue-3'
import {
  XTableColumnFilterItem,
  XTableColumnProps,
  XTableComponentData,
  XTableState
} from '@/smart-ui-vue/table/x-table'
import { uuid } from '@/smart-ui-vue/utils'
import Icon from '@/smart-ui-vue/helper/Icon.vue'
import { TablePaginationConfig } from 'ant-design-vue-3/lib/table/interface'
import XTableFilterDropdown from '@/smart-ui-vue/table/XTableFilterDropdown.vue'
import XEmpty from '@/smart-ui-vue/XEmpty.vue'
import { useDebounceFn } from '@vueuse/core'

// header高度(px)，用于计算空状态高度
const HEADER_HEIGHT = 60
// main-container margin(px)，用于计算空状态高度,包含上下margin
const MAIN_CONTAINER_MARGIN = 20
// 默认空状态图标宽度
const DEFAULT_EMPTY_IMAGE_WIDTH = 80
// 默认空状态图标高度
const DEFAULT_EMPTY_IMAGE_HEIGHT = 78.18
// 触发下拉自动加载的scoll位置比阈值
const AUTO_LOAD_OFFSET = 0.7

export default defineComponent({
  name: 'XTableNext',
  components: { XEmpty, XTableFilterDropdown, Icon, ATable },
  props: {
    columns: {
      type: [Array, null] as PropType<XTableColumnProps[] | null>,
      default: null,
    },
    dataSource: {
      type: Array,
      default: () => [],
    },
    // 是否给table添加边框
    // 效果
    // 1. table: 10px padding
    // 2. table: 1px solid border
    bordered: {
      type: Boolean,
      default: false,
    },
    /**
     * 是否为可编辑表（影响样式）
     */
    editTable: {
      type: Boolean,
      default: false
    },
    // 是否加上尾部的纵向分隔线
    // 支持在columns中配置，单独为某个column后加分隔线，属性也是divider
    // template风格下不支持，若想在template风格下使用请在a-table-column的default slot下包裹一层<div class="td-with-divider">
    divider: {
      type: Boolean,
      default: false,
    },
    // loading状态
    loading: {
      type: Boolean,
      default: false,
    },
    // pagination
    pagination: {
      type: [Object, Boolean] as PropType<TablePaginationConfig | false>,
      default: () => ({}),
    },
    // 自定义pageSize
    // 默认所有图表的pageSize按照localstorage里的PAGE_SIZE，如果不想跟随可以使用这个选项
    customPageSize: {
      type: Boolean,
      default: false,
    },
    // filter默认空值(清除筛选)
    // 默认为''
    nullFilterValue: {
      default: '',
    },
    // 空状态图片
    emptyImage: {
      type: String,
      default: 'ui-empty/empty',
    },
    // 空状态描述，默认值"暂无数据"
    emptyDescription: {
      type: String,
      default: '暂无数据'
    },
    // 空状态时高度，默认为auto
    emptyHeight: {
      type: String,
      default: 'auto'
    },
  },
  setup(props) {
    const {
      columns: propColumns,
      pagination: propPagination,
      customPageSize: propCustomPageSize,
      nullFilterValue: propNullFilterValue,
      emptyHeight: propEmptyHeight
    } = toRefs(props)

    const state: XTableState = reactive({
      id: uuid(),
      dynamicFilters: (propColumns.value || []).filter(item => item.key && item.filters instanceof Function).reduce((prev, item) => {
        return {
          ...prev,
          [item.key as string]: { item: [], pageNum: 1 },
        }
      }, {} as Record<string, { item: XTableColumnFilterItem[], pageNum: number }>),
      finalEmptyHeight: propEmptyHeight.value
    })

    // 模块名，用于配置sorter图标样式
    const MODULE_NAME = inject('$moduleName') as string

    // a-table el实例
    const aTableRef = ref<InstanceType<typeof ATable> | null>(null)

    // antd3.x slot的column HashMap
    const columnsWithSlotsCpt = computed(() => formatSlot(propColumns.value))

    // 处理后的columns的配置
    const mergedColumnsCpt = computed(() => mergeColumns(state, propColumns.value))

    // 处理后的pagination配置
    const mergedPaginationCpt = computed(() => mergePagination(state, propPagination.value, propCustomPageSize.value))

    const componentData: XTableComponentData = {
      state,
      propEmptyHeight,
      propColumns,
      aTableRef
    }

    const handleSetEmptyHeight = () => _handleSetEmptyHeight(componentData)
    const handleInitDynamicFilters = () => _handleInitDynamicFilters(componentData)
    const handlerDynamicFiltersInfinityScroll = () => _handlerDynamicFiltersInfinityScroll(componentData)

    onBeforeMount(() => {
      handleInitDynamicFilters()
    })

    onMounted(() => {
      nextTick(() => {
        handleSetEmptyHeight()
        chageSortIcon(MODULE_NAME)
        handlerDynamicFiltersInfinityScroll()
      })
    })

    provide('id', state.id)
    provide('nullFilterValueRef', propNullFilterValue)

    return {
      DEFAULT_EMPTY_IMAGE_WIDTH,
      DEFAULT_EMPTY_IMAGE_HEIGHT,
      ...toRefs(state),
      columnsWithSlotsCpt,
      mergedColumnsCpt,
      mergedPaginationCpt
    }
  }
})

/**
 * 将2.x的column式的slot结构同步成3.x的table prop式的slot结构
 * @param columns columns配置列表
 */
function formatSlot(columns?: XTableColumnProps[] | null) {
  const result = {
    headerCell: {},
    bodyCell: {},
    customFilterDropdown: {},
    customFilterIcon: {}
  }
  for (const column of (columns || [])) {
    if (column.slots && column.key) {
      if (column.slots.title) result.headerCell = { ...result.headerCell, [column.key]: column.slots.title }
      if (column.slots.customRender) result.bodyCell = { ...result.bodyCell, [column.key]: column.slots.customRender }
      if (column.slots.filterIcon) result.customFilterIcon = { ...result.customFilterIcon, [column.key]: column.slots.filterIcon }
      if (column.slots.filterDropdown) result.customFilterDropdown = { ...result.customFilterDropdown, [column.key]: column.slots.filterDropdown }
    }
  }
  return result
}

/**
 * 处理columns配置
 * @param state
 * @param columns
 */
function mergeColumns(state: XTableState, columns?: XTableColumnProps[] | null) {
  if (!columns) return null
  return columns.map(item => {
    const it = { ...item }
    // 因为默认的filter也是自定义的，所以始终配置customFilterDropdown为true
    if (item.filters) it.customFilterDropdown = true
    // 动态配置filter下，劫持默认的filter配置
    if (item.key && item.filters instanceof Function) it.filters = state.dynamicFilters[item.key].item
    delete it.slots
    return it
  })
}

/**
 * 处理pagination配置
 * @param state
 * @param pagination
 * @param customPageSize
 */
function mergePagination(state: XTableState, pagination: TablePaginationConfig | false | undefined, customPageSize: boolean) {
  // 如果没有配置pagination返回false
  if (!pagination) return false
  const result: TablePaginationConfig = {
    ...pagination,
    // 配置前进后退按钮样式
    itemRender: ({ type, originalElement }) => {
      if (type === 'prev') return h(originalElement, {}, h(Icon, { name: 'ui-table/prev', color: '' }))
      else if (type === 'next') return h(originalElement, {}, h(Icon, { name: 'ui-table/next', color: '' }))
      else return originalElement
    },
    // 默认显示每页条数切换选择器
    showSizeChanger: true,
    // 同步每页条数切换选择器的变化到所有表格(CustomPageSize = false的)
    onShowSizeChange: (current, size) => {
      if (!pagination) window.localStorage.setItem('PAGE_SIZE', String(size))
    },
  }
  // 初始化时从系统localstorage获取pagesize
  if (!customPageSize) result.pageSize = Number(window.localStorage.getItem('PAGE_SIZE')) || 20
  return result
}

/**
 * 排序图标替换
 */
function chageSortIcon(moduleName: string) {
  document.querySelectorAll('.antv-table-column-sorter-inner .anticon').forEach(item => {
    /* eslint-disable max-len */
    item.innerHTML = `
              <svg image="false" class="icon btn-sort-icon" disabled="false" style="color: currentcolor; stroke: none; fill: currentColor""><use xlink:href="#${moduleName}/ui-table/sort"></use></svg>
              <svg image="false" class="icon btn-sort-icon btn-sort-icon-asc" disabled="false" style="color: currentcolor; stroke: none; fill: currentColor"><use xlink:href="#${moduleName}/ui-table/sort-asc"></use></svg>
              <svg image="false" class="icon btn-sort-icon btn-sort-icon-desc" disabled="false" style="color: currentcolor; stroke: none; fill: currentColor""><use xlink:href="#${moduleName}/ui-table/sort-desc"></use></svg>
            `
  })
}

/**
 * 设置列表空状态时高度
 * @handler
 * @param state
 * @param propEmptyHeight
 * @param aTableRef
 */
function _handleSetEmptyHeight({ state, propEmptyHeight, aTableRef }: XTableComponentData): void {
  if (aTableRef.value && propEmptyHeight.value === 'auto') {
    state.finalEmptyHeight = `
      calc(100vh - ${(aTableRef.value.$el as HTMLElement).getBoundingClientRect().top - HEADER_HEIGHT - MAIN_CONTAINER_MARGIN}px)
    `
  }
}

/**
 * 设置动态filter的选项数据
 * @param state
 * @param column
 */
function handlerSetDynamicFilters({ state }: XTableComponentData, column: XTableColumnProps) {
  if (column.key && typeof column.filters === 'function' && state.dynamicFilters[column.key]?.pageNum > -1) {
    let getFilterItems = column.filters(state.dynamicFilters[column.key]?.pageNum)
    getFilterItems = getFilterItems instanceof Promise ? getFilterItems : Promise.resolve(getFilterItems)
    getFilterItems.then(res => {
      if (column.key) state.dynamicFilters[column.key] = {
        item: res,
        pageNum: state.dynamicFilters[column.key].pageNum + 1
      }
    })
  }
}

/**
 * 初始化动态的filters数据
 * @handler
 * @param componentData
 */
function _handleInitDynamicFilters(componentData: XTableComponentData): void {
  const { propColumns } = componentData;
  (propColumns.value || []).forEach(item => handlerSetDynamicFilters(componentData, item))
}

/**
 * 动态filters设置滚动无限加载
 * @param componentData
 */
function _handlerDynamicFiltersInfinityScroll(componentData: XTableComponentData) {
  const { state, propColumns } = componentData;
  (propColumns.value ?? []).forEach(item => {
    if (typeof item.filters === 'function') {
      const handleMoreData = useDebounceFn((ev: Event) => {
        const target = ev.target as (HTMLElement | null)
        if (target && target.scrollTop / (target.scrollHeight - 300) > AUTO_LOAD_OFFSET) handlerSetDynamicFilters(componentData, item)
      }, 1000)
      const scrollElement = document.getElementById(`filter-${state.id}-${item.key}`)?.parentElement
      if (scrollElement) scrollElement.addEventListener('scroll', handleMoreData)
    }
  })
}
</script>

<style lang="scss">
@import "./styles/components/XTableNext/index";
</style>
