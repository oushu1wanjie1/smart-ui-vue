<template>
  <div :id="`filter-${idInj}-${scope.column.key}`" :class="{'filter-container': true, 'filter-container-multiple': scope.column.filterMultiple }">
    <div
      v-for="item in scope.filters"
      :key="item.value"
      :class="{
        'filter-item': true,
        'filter-item-selected': checkIfItemSelected(item, scope)
      }"
      @click="handleItemClick(item, scope)">
      <span>{{ item.text }}</span>
    </div>
  </div>
<!--  多选的确认按钮-->
  <x-button v-if="scope.column.filterMultiple" class="filter-multiple-confirm-btn" type="link" @click="scope.confirm()">
    确定
  </x-button>
</template>

<script lang="ts" setup>
import XButton from '@/smart-ui-vue/XButton.vue'
import { defineProps, inject, PropType, Ref } from 'vue'
import { ColumnFilterItem, FilterDropdownProps, Key } from 'ant-design-vue-3/lib/table/interface'

defineProps({
  // scope
  scope: {
    type: Object as PropType<FilterDropdownProps<unknown>>
  }
})

const idInj = inject('id') as string
const nullFilterValueRefInj = inject('nullFilterValueRef') as Ref

// filter选项点击事件
const handleItemClick = (item: ColumnFilterItem, scope: FilterDropdownProps<unknown>) => {
  if (item.value === nullFilterValueRefInj.value) {
    // 清除筛选
    if (scope.clearFilters) scope.clearFilters()
  } else {
    // 筛选
    let value: Key[] = []
    // 建议不要用布尔值做value
    if (typeof item.value === 'boolean') return
    if (scope.column.filterMultiple) {
      // 多选操作
      value = [...scope.selectedKeys]
      // 反选
      if (value.indexOf(item.value) > -1) value.splice(value.indexOf(item.value), 1)
      // 选择
      else value.push(item.value)
    } else {
      // 单选操作
      value.push(item.value)
    }
    scope.setSelectedKeys(value)
  }
  // 如果是单选直接提交；如果是多选，不在此处提交，点击确认按钮才提交
  if (!scope.column.filterMultiple) scope.confirm()
}

// 检测filter item是否被选中
const checkIfItemSelected = (item: ColumnFilterItem, scope: FilterDropdownProps<unknown>) => {
  return typeof(item.value) !== 'boolean' && scope.selectedKeys.includes(item.value)
}
</script>

<style lang="scss">

</style>
