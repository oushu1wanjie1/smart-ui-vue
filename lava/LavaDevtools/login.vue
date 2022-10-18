<template>
  <x-button @click="handleToggleLoginModal">子项目快速登录</x-button>
  <x-modal v-model:visible="loginModalVisible" title="子项目快速登录" @ok="handleLogin">
    <x-form>
      <x-form-item label="用户名">
        <x-input v-model:value="username"/>
      </x-form-item>
      <x-form-item label="密码">
        <x-input type="password" v-model:value="pwd" />
      </x-form-item>
    </x-form>
  </x-modal>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue'
import XModal from '@/smart-ui-vue/XModal.vue'
import XButton from '@/smart-ui-vue/XButton.vue'
import XForm from '@/smart-ui-vue/XForm.vue'
import XFormItem from '@/smart-ui-vue/XFormItem.vue'
import XInput from '@/smart-ui-vue/XInput.vue'
import http, { Response } from 'lava-fe-lib/lib-common/http'
import { message } from 'ant-design-vue-3'

interface State {
  // 登录弹窗显示状态
  loginModalVisible: boolean,
  // 用户名
  username: string,
  // 密码
  pwd: string
}

export default defineComponent({
  name: 'LavaDevToolLogin',
  components: { XInput, XFormItem, XForm, XButton, XModal },
  setup() {
    const state: State = reactive({
      loginModalVisible: false,
      username: '',
      pwd: ''
    })

    const handleToggleLoginModal = () => _handleToggleLoginModal(state)
    const handleLogin = () => _handleLogin(state)

    return {
      ...toRefs(state),
      handleToggleLoginModal,
      handleLogin
    }
  }
})

// 打开关闭登录弹框
export function _handleToggleLoginModal(state: State) {
  state.loginModalVisible = !state.loginModalVisible
}

// 登录
export async function _handleLogin(state: State) {
  const res: Response<any> = await http.post('/user/login', {
    login_type: 1,
    name: state.username,
    password: state.pwd
  })
  if (res.meta.success) {
    message.success('登录成功')
    _handleToggleLoginModal(state)
  }
}
</script>

<style scoped>

</style>
