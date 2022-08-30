<template>
  <a-table
    :class="{
      'smartui-table': true,
      'smartui-table-border': bordered,
      'x-ant-table-empty': isEmpty || isConditionalEmpty,
      [`x-table-${id}`]: true,
      'smartui-table-edit': editTable,
      'smartui-table-divider': divider
    }"
    :columns="formattedColumns"
    :dataSource="dataSource"
    :expanded-row-keys="expandedRowKeys"
    :loading="loading"
    :pagination="mergedPagination"
    :style="{ height: (isEmpty || isConditionalEmpty) ? emptyHeightRef : 'auto' }"
  >
<!--    兼容antd2.x的写法，因为3.x的column不能再配置slots-->
<!--    slots.customRender to bodyCell-->
    <template v-slot:bodyCell="scope">
      <slot v-if="scope.column.slots." :name="item" v-bind="scope"></slot>
    </template>
  </a-table>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, reactive, toRefs } from 'vue'
import { Table as ATable } from 'ant-design-vue-3'
import { XTableColumnProps } from '@/smart-ui-vue/table/XTable'

export default defineComponent({
  name: 'XTableNext',
  components: { ATable },
  props: {
    columns: {
      type: [Array, null] as PropType<XTableColumnProps[] | null>,
      default: null,
    },
  },
  setup(props) {
    const { columns: columnsRef } = toRefs(props)
    // 所有需要配置bodyCell(2.x slots.customRender)的column HashMap
    const columnsWithBodyCellSlot = computed(() => {
      return (columnsRef.value || [])
        .filter(item => item.key && item.slots?.customRender)
        .reduce((prev, item) => ({ ...prev, [item.key as string]: item.slots?.customRender }), {})
    })
  }
})
</script>

<style scoped>

</style>
