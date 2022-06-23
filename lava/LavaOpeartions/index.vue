<template>
  <div class="lava-operations">
    <component
      v-for="item in items"
      :key="item.name"
      v-bind="item.props || {}"
      :is="itemLibs[item.name]"
      v-on="(item.events || []).reduce((prev, eventName) => ({ eventName: $ev => $emit(eventName, $ev) }), {})"
      v-model:value="paramsLocal[item.key]"
      :class="{ 'operation': true, 'placement-right': item.right }"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, watch } from 'vue'
import { LavaOperationsItemParams } from '@/smart-ui-vue/lava/LavaOpeartions/index'
import { useModel } from '@/smart-ui-vue/utils'

export default defineComponent({
  name: 'LavaOperations',
  emits: ['change'],
  props: {
    // 参数结构
    params: {
      type: Object as PropType<Record<string, any>>,
      default: () => ({})
    },
    // item组件配置
    items: {
      type: Array as PropType<LavaOperationsItemParams[]>,
      default: () => []
    },
    // 是否异步加载
    // 设为true则等到所有的异步组件加载完成才会触发一次初始化的change事件
    // 设为false则会在开始时触发一次初始化的change事件
    async: {
      type: Boolean,
      default: false
    },
    // 外部加载组件库，注意该项不能使用响应式变量
    libs: {
      type: Array as PropType<Record<string, any>[]>,
      default: () => []
    }
  },
  setup(props, context) {
    const paramsLocal = useModel('params', props, context)

    watch(paramsLocal, (val) => context.emit('change', val), { deep: true, immediate: !props.async })

    return {
      paramsLocal,
      // 所有item组件库
      itemLibs: props.libs instanceof Array ? props.libs.reduce((prev, lib) => ({ ...prev, ...lib }), {}) : []
    }
  }
})
</script>

<style lang="scss">
.lava-operations {
  display: flex;
  margin-bottom: 10px;
  .operation {
    margin-right: 10px;

    &.placement-right {
      margin-left: auto;
    }
    &.placement-right ~ .placement-right {
      margin-left: inherit;
    }
  }
}
</style>
