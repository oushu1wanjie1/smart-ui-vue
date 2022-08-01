## SearchSelector 关键字搜索组件

### 使用方法

```vue
<search-selector
  @change="handleSearchChange"
  :loading="loading"
  placeholder="搜索告警对象/告警内容"/>
```

### props

| 参数          | 类型            | 说明     | 默认值         |
|-------------|---------------|--------|-------------|
| loading     | ```boolean``` | 是否在加载中 | ```false``` |
| placeholder | ```string```  | 占位符    | ```''```    |

### events

| 事件名    | 说明      | 参数              |
|--------|---------|-----------------|
| change | 输入值发生变化 | ```string```输入值 |
