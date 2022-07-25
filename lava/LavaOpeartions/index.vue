<template>
  <div class="lava-operations">
    <component
      v-for="(item, name) in items"
      :key="name"
      v-bind="createBindProps(item)"
      :is="itemLibs[name]"
      v-model:value="paramsLocal[item.key]"
      :class="{ 'operation': true, 'placement-right': item.right }"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, inject, PropType, provide, watch } from 'vue'
import { LavaOperationsItemParams } from '@/smart-ui-vue/lava/LavaOpeartions/index'
import { useModel } from '@/smart-ui-vue/utils'

export default defineComponent({
  name: 'LavaOperations',
  props: {
    // 参数结构
    params: {
      type: Object as PropType<Record<string, any>>,
      default: () => ({})
    },
    // item组件配置
    items: {
      type: Object as PropType<Record<string, LavaOperationsItemParams>>,
      default: () => ({})
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
    const scope = inject('scope')

    // provide父组件状态
    provide('scope', scope)

    // provide全部组件参数
    provide('params', paramsLocal)

    watch(paramsLocal, (val) => {
      context.emit('change', val)
    }, { deep: true, immediate: !(props.async && Object.values(props.items).some(item => item.async)) })

    // 合并item的props和events
    const createBindProps = (item: LavaOperationsItemParams) => {
      return {
        ...(item.props || {}),
        ...(item.events || []).reduce((prev, eventName) => {
          const eventNameWithPrefix = 'on' + eventName.substring(0, 1).toUpperCase() + eventName.substring(1)
          return {
            ...prev,
            [eventNameWithPrefix]: ($ev: any) => context.emit(eventName, $ev)
          }
        }, {})
      }
    }

    return {
      paramsLocal,
      createBindProps,
      scope,
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

    &:last-child {
      margin-right: 0;
    }

    &.placement-right {
      margin-left: auto;
    }
    &.placement-right ~ .placement-right {
      margin-left: inherit;
    }
  }
}
</style>
