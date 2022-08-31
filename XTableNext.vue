<template>
  <a-table
    :class="{
      'smartui-table': true,
      'smartui-table-border': bordered,
      [`x-table-${id}`]: true,
      'smartui-table-edit': editTable,
      'smartui-table-divider': divider
    }"
    :columns="mergedColumnsCpt"
    :loading="loading"
    :pagination="mergedPaginationCpt"
  >
<!--    兼容antd2.x的写法，因为3.x的column不能再配置slots-->
<!--    slots.title to headerCell-->
    <template v-slot:headerCell="scope">
      <slot v-if="columnsWithSlotsCpt.headerCell[scope.column.key]" :name="columnsWithSlotsCpt.headerCell[scope.column.key]" v-bind="scope" />
    </template>
<!--    slots.customRender to bodyCell-->
    <template v-slot:bodyCell="scope">
<!--      包裹内容的wrapper，在divide模式下显示divider-->
      <div :class="{ 'td-with-divider': divider || scope.column.divider }">
        <slot v-if="columnsWithSlotsCpt.bodyCell[scope.column.key]" :name="columnsWithSlotsCpt.bodyCell[scope.column.key]" v-bind="scope" />
      </div>
    </template>
<!--    slot.filterDropdown to customFilterDropdown-->
    <template v-slot:customFilterDropdown="scope">
      <!--      用户自定义的filter-->
      <slot v-if="columnsWithSlotsCpt.customFilterDropdown[scope.column.key]" :name="columnsWithSlotsCpt.customFilterDropdown[scope.column.key]" v-bind="scope" />
      <!--      默认的filter-->
      <template v-else>
        <div :id="`filter-${id}-${scope.column.key}`" :class="{'filter-container': true, 'filter-container-multiple': scope.column.filterMultiple }">
          <div
            v-for="item in scope.filters"
            :key="item.value"
            :class="{
              'filter-item': true,
              'filter-item-selected': scope.selectedKeys.includes(item.value)
            }"
            @click="handleFilterItemClick(item, scope, column)">
            <span>{{ item.text }}</span>
          </div>
        </div>
        <x-button v-if="column.filterMultiple" class="filter-multiple-confirm-btn" type="link" @click="scope.confirm()">
          确定
        </x-button>
      </template>
    </template>
<!--    slot.filterIcon 使用固定的icon-->
    <template v-slot:customFilterIcon>
      <icon class="btn-filter-icon" color="currentColor" name="ui-table/filter"/>
    </template>
  </a-table>
</template>

<script lang="ts">
import { computed, defineComponent, h, PropType, provide, reactive, ref, toRefs } from 'vue'
import { Table as ATable } from 'ant-design-vue-3'
import { XTableColumnFilterItem, XTableColumnProps, XTableState } from '@/smart-ui-vue/table/x-table'
import { uuid } from '@/smart-ui-vue/utils'
import Icon from '@/components/Icon.vue'
import { TablePaginationConfig } from 'ant-design-vue-3/lib/table/interface'

export default defineComponent({
  name: 'XTableNext',
  components: { Icon, ATable },
  props: {
    columns: {
      type: [Array, null] as PropType<XTableColumnProps[] | null>,
      default: null,
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
  },
  setup(props) {
    const {
      columns: propColumns,
      pagination: propPagination,
      customPageSize: propCustomPageSize,
      nullFilterValue: propNullFilterValue
    } = toRefs(props)
    const state: XTableState = reactive({
      id: uuid(),
      dynamicFilters: (props.columns || []).filter(item => item.key && item.filters instanceof Function).reduce((prev, item) => {
        return {
          ...prev,
          [item.key as string]: { item: [], pageNum: 1 },
        }
      }, {} as Record<string, { item: XTableColumnFilterItem[], pageNum: number }>),
    })

    // 所有antd2.x slots映射到antd3.x slot的column HashMap
    const columnsWithSlotsCpt = computed(() => {
      const result = {
        headerCell: {},
        bodyCell: {},
        customFilterDropdown: {},
        customFilterIcon: {}
      }
      for (const column of (propColumns.value || [])) {
        if (column.slots && column.key) {
          if (column.slots.title) result.headerCell = { ...result.headerCell, [column.key]: column.slots.title }
          if (column.slots.customRender) result.bodyCell = { ...result.bodyCell, [column.key]: column.slots.customRender }
          if (column.slots.filterIcon) result.customFilterIcon = { ...result.customFilterIcon, [column.key]: column.slots.filterIcon }
          if (column.slots.filterDropdown) result.customFilterDropdown = { ...result.customFilterDropdown, [column.key]: column.slots.filterDropdown }
        }
      }
      return result
    })

    // 处理后的columns的配置
    const mergedColumnsCpt = computed(() => {
      if (!propColumns.value) return null
      return propColumns.value.map(item => {
        const it = { ...item }
        // 因为默认的filter也是自定义的，所以始终配置customFilterDropdown为true
        it.customFilterDropdown = true
        // 动态配置filter下，劫持默认的filter配置
        if (item.key && item.filters instanceof Function) it.filters = state.dynamicFilters[item.key].item
        return it
      })
    })

    // 处理后的pagination配置
    const mergedPaginationCpt = computed(() => {
      // 如果没有配置pagination返回false
      if (!propPagination.value) return false
      const result: TablePaginationConfig = {
        ...propPagination.value,
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
          if (!propCustomPageSize.value) window.localStorage.setItem('PAGE_SIZE', String(size))
        },
      }
      // 初始化时从系统localstorage获取pagesize
      if (!propCustomPageSize.value) result.pageSize = Number(window.localStorage.getItem('PAGE_SIZE')) || 20
      return result
    })

    provide('id', state.id)
    provide('nullFilterValueRef', propNullFilterValue)

    return {
      ...toRefs(state),
      columnsWithSlotsCpt,
      mergedColumnsCpt,
      mergedPaginationCpt
    }
  }
})
</script>

<style scoped>

</style>
