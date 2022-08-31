<template>
  <div :id="`filter-${idInj}-${scope.column.key}`" :class="{'filter-container': true, 'filter-container-multiple': scope.column.filterMultiple }">
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

<script lang="ts" setup>
import XButton from '@/smart-ui-vue/XButton.vue'
import { defineProps, inject, nextTick, PropType, Ref } from 'vue'
import { ColumnFilterItem, ColumnType, FilterDropdownProps, Key } from 'ant-design-vue-3/lib/table/interface'

defineProps({
  // scope
  scope: {
    type: Object as PropType<FilterDropdownProps<unknown>>
  }
})

const idInj = inject('id') as string
const nullFilterValueRefInj = inject('nullFilterValueRef') as Ref

const handleFilterItemClick = (item: ColumnFilterItem, scope: FilterDropdownProps<unknown>, column: ColumnType) => {
  if (item.value === nullFilterValueRefInj.value) {
    // 清除筛选
    if (scope.clearFilters) scope.clearFilters()
  } else {
    // 筛选
    let value: Key[] = []
    // 建议不要用布尔值做value
    if (typeof item.value === 'boolean') return
    if (column.filterMultiple) {
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
  if (!column.filterMultiple) scope.confirm()
}
</script>

<style scoped>

</style>
