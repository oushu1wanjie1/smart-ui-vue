## LavaOperations

用于实现单栏布局的配置项，通常位于页面，表格的顶部，用于对页面数据进行一些参数限制，筛选，操作等功能。

![实例图](./lava-operations.png)

### 使用方法

```vue
<template>
    <lava-operations
      :libs="operationLibs"
      async
      :items="operation.items"
      @refresh="handleRefresh"
      @inspectCreated="handleRefresh"
      v-model:params="operation.params"
    />
</template>
<script lang="ts">
...
const operationLibs = [{ NewInspect, PeriodicInspect, OushuDbInstanceSelector, RefreshOperation }]

export default defineComponent({
  name: 'Inspect',
  setup() {
    const state: State = reactive({
      // 操作栏配置
      operation: {
        items: {
          NewInspect: {events: ['inspectCreated']},
          PeriodicInspect: {},
          OushuDbInstanceSelector: {key: 'instance', right: true},
          RefreshOperation: {right: true, props: {loading: false}, events: ['refresh']}
        },
        params: {
          instance: undefined,
          search: ''
        }
      }
    })
    ...
  }
</script>
```

### api

#### LavaOperations

| 参数                   | 说明                                                                                     | 类型                                | 默认值   |
|----------------------|----------------------------------------------------------------------------------------|-----------------------------------|-------|
| async(即将depreceated) | 初始化时是否异步加载，在operation中有异步加载的组件时，该值应设为true，现在可在item内部配置                                 | ```boolean```                     | false |
| items                | 每一项operation配置，为Key-value键值对，key值应严格等于operation的组件名，value具体配置项见下面LavaOperations.items， | ```Record<string, value>```       | {}    |
| libs                 | 挂载组件应用的operation组件库，最终的operation组件库将为内置组件库和外部挂载组件库的结合                                  | ```Record<string, Component>[]``` | []    |
| params(v-model)      | 最终传递到外部参数结构，应该与items配置中的key一一对应。                                                       | ```Record<string, any>```            | {}    |

#### LavaOperations.items

| 参数     | 说明                               | 类型                        | 默认值   |
|--------|----------------------------------|---------------------------|-------|
| async  |    初始化时是否异步加载                                             | ```boolean```                | false |
| events | 该operation组件需要暴露出来的事件，事件将会在LavaOperations中向外发出 | ```string[]```            | []    |
| key    | 该operation组件对应参数(params)的key               | ```string```              |       |
| props  | 该operation组件自身的props              | ```Record<string, any>``` |       |
| right  | 组件靠右边                            | ```boolean```             | false |

#### Events

| 参数     | 说明             | 参数        |
|--------|----------------|-----------|
| change | params发生变化触发事件 | ```params``` |
