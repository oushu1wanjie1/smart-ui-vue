1. 默认展示 cancel 和 ok 两个按钮

2. 只展示 ok 按钮，不展示 cancel 的设置: `:cancel-text="''"`

3. template
```vue
  <!-- cancel-text: ' ' a-modal里应该会先判断这个属性的长度，为0则忽略，不为0，则trim后当作文本，-->
  <!-- 则可利用空格字符串 ' ' 触发 a-button:empty，使得取消按钮不出现 -->
  <!--  <a-modal :visible="isModalVisible" @ok="handleOk" @cancel="handleCancel" :cancel-text="' '">-->
  <a-modal :visible="isModalVisible" @ok="handleOk" @cancel="handleCancel" :cancel-text="''">
    <template v-slot:title>basic modal</template>
    <p>内容区域</p>
    <p>内容区域</p>
  </a-modal>
```