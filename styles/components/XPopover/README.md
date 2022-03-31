使用指南：
1. 左上角tooltip: `placement="topLeft"`

2. 左下角tooltip: `placement="bottomLeft"`

3. danger tooltip: `color="red"`

4. template:
```vue
      <a-tooltip placement="bottomLeft" title="prompt text">
        <span>左下提示</span>
      </a-tooltip>
      <a-tooltip placement="topLeft" title="prompt text">
        <span>左上提示</span>
      </a-tooltip>
      <a-tooltip placement="bottomLeft" title="prompt text" color="red">
        <span>左下危险提示</span>
      </a-tooltip>
      <a-tooltip placement="topLeft" title="prompt text" color="red">
        <span>左上危险提示</span>
      </a-tooltip>
```