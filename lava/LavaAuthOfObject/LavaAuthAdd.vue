<template>
  <x-drawer
    wrapClassName="lava-auth-of-object-drawer-inside"
    :visible="visible"
    :width="800"
    @close="handleClose()"
  >
    <x-form class="form" layout="vertical">
      <x-form-item label="关联">
        <div class="controls">
          <x-select class="type-selector" v-model:value="type" :isInForm="true" @change="handleSelectType">
            <x-select-option value="user">用户</x-select-option>
            <x-select-option value="role">角色</x-select-option>
          </x-select>
          <x-select
            dropdownClassName="lava-auth-of-object-drawer-inside-type-list-selector-dropdown"
            show-search
            option-label-prop="label"
            :isInForm="true"
            :placeholder="userOrRoleSelectorPlaceholder"
            :options="userOrRoleList"
            v-model:value="id"
            :filterOption="handleSearchUserOrRole"
            @change="handleSelectUserOrRole"
          >
            <template #prefixIcon><icon :name="`lava-auth-of-object/${userOrRoleSelectorIcon}`"></icon></template>
            <template #option="{ label, value, type, remark }">
              <x-avatar class="avatar" v-if="type === USER" :src="`/images/avatar/${ Math.abs(value) % AVATAR_NUM }.svg`"></x-avatar>
              <icon class="avatar" v-else name="lava-auth-of-object/role-blue"></icon>
              <span class="name">{{ label }}</span>
              <span class="remark">({{ remark }})</span>
            </template>
          </x-select>
        </div>
      </x-form-item>
      <x-form-item label="权限">
        <x-select
          class="action-selector"
          mode="tags"
          placeholder="请选择需要授予的权限"
          :isInForm="true"
          :disabled="disableActionSelector"
          :options="actions"
          v-model:value="actionsSelected"
          @change="handleActionSelectorChange"
        >
          <template #prefixIcon><icon :name="`lava-auth-of-object/${actionSelectorIcon}`"></icon></template>
        </x-select>
      </x-form-item>
    </x-form>
    <div class="footer">
      <x-button type="primary" class="submit" @click="handleSubmit" :disabled="isUnChange">
        <template #icon><icon name="lava-auth-of-object/submit"></icon></template>
        提交
      </x-button>
    </div>
  </x-drawer>
</template>

<script lang="ts">
import { computed, ComputedRef, defineComponent, inject, PropType, Ref, ref, watch } from 'vue'
import Icon from '../../helper/Icon.vue'
import XForm from '../../XForm.vue'
import XFormItem from '../../XFormItem.vue'
import XSelect from '../../XSelect.vue'
import XSelectOption from '../../XSelectOption.vue'
import XButton from '../../XButton.vue'
import XDrawer from '../../XDrawer.vue'
import XAvatar from '../../XAvatar.vue'
import { USER, ADD, ApiGetUserList, ApiGetRoleList, ROLE } from './type'
import { AVATAR_NUM, Strategy } from '@/smart-ui-vue/lava/LavaAuthOfObject/strategy'
import { message } from 'ant-design-vue'

interface UserOrRoleSelectorOption {
  label: string;
  value: number;
  type: string;
  remark: string;
}

export default defineComponent({
  name: 'LavaAuthEdit',
  components: {
    Icon,
    XForm,
    XFormItem,
    XSelect,
    XSelectOption,
    XButton,
    XDrawer,
    XAvatar
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    apiGetUserList: {
      type: Function as PropType<ApiGetUserList>
    },
    apiGetRoleList: {
      type: Function as PropType<ApiGetRoleList>
    }
  },
  emits: [ 'close' ],
  setup(props, context) {
    const type: Ref<string> = ref(USER)
    const id: Ref<string | number | undefined> = ref(undefined)
    const userList: Ref<UserOrRoleSelectorOption[]> = ref([])
    const roleList: Ref<UserOrRoleSelectorOption[]> = ref([])
    const actions: Ref<{label: string, value: number}[]> = ref([])
    const actionsSelected: Ref<number[]> = ref([])
    const strategy = inject('strategy') as Strategy

    const userOrRoleSelectorIcon: ComputedRef<string> = computed(() => {
      return type.value === USER ? 'user' : 'role'
    })

    const userOrRoleSelectorPlaceholder: ComputedRef<string> = computed(() => {
      return type.value === USER ? '请选择或搜索需要关联的用户' : '请选择或搜索需要关联的角色'
    })

    const userOrRoleList: ComputedRef<UserOrRoleSelectorOption[]> = computed(() => {
      return type.value === USER ? userList.value : roleList.value
    })

    const disableActionSelector = computed(() => !id.value)

    const actionSelectorIcon = computed(() => {
      return disableActionSelector.value ? 'auth' : 'auth-active'
    })

    const isUnChange: ComputedRef<boolean> = computed(() => {
      return actionsSelected.value.length === 0
    })

    const handleGetUserList = () => {
      if (typeof props.apiGetUserList !== 'function') return
      props.apiGetUserList().then(({ meta, data }) => {
        if (meta.success) {
          userList.value = data ? data.map(item => ({
            label: item.name,
            value: item.id,
            type: USER,
            remark: item.name_remark
          })) : []
        } else {
          throw new Error(meta.message || meta.status_code)
        }
      }).catch(err => {
        message.error(`获取用户列表失败: ${err}`)
      })
    }

    const handleGetRoleList = () => {
      if (typeof props.apiGetRoleList !== 'function') return
      props.apiGetRoleList().then(({ meta, data }) => {
        if (meta.success) {
          roleList.value = data ? data.map(item => ({
            label: item.name,
            value: item.id,
            type: ROLE,
            remark: item.description
          })) : []
        } else {
          throw new Error(meta.message || meta.status_code)
        }
      }).catch(err => {
        message.error(`获取角色列表失败: ${err}`)
      })
    }

    const handleSelectType = (val: string) => {
      id.value = undefined
      actions.value = []
      actionsSelected.value = []
      if (val === USER && userList.value.length === 0) {
        handleGetUserList()
      }
      if (val === ROLE && roleList.value.length === 0) {
        handleGetRoleList()
      }
    }

    // @change
    const handleSelectUserOrRole = (val: number) => {
      console.log('handleSelectUserOrRole: ', id.value)
      strategy.getAuthOfUserOrRole(type.value, val).then(data => {
        const { options } = strategy.formatAuthOfUserOrRole(data, '')
        actions.value = options
      }).catch(err => {
        actions.value = []
        message.error(`获取权限列表失败: ${err}`)
      }).finally(() => {
        actionsSelected.value = []
      })
    }

    // filterOption
    const handleSearchUserOrRole = (input: string, option: UserOrRoleSelectorOption) => {
      // 前端搜索
      console.log('handleSearchUserOrRole: ', input)
      const keyword = input.trim().toLowerCase()
      const label = option.label.trim().toLowerCase()
      const remark = option.remark.trim().toLowerCase()
      return label.indexOf(keyword) > -1 || remark.indexOf(keyword) > -1
    }

    const handleActionSelectorChange = () => {
      console.log('handleActionSelectorChange: ', actionsSelected.value)
    }

    const handleReset = () => {
      type.value = USER
      id.value = undefined
      userList.value = []
      roleList.value = []
      actions.value = []
      actionsSelected.value = []
    }

    const handleInit = () => {
      console.log('handleInit')
      handleReset()
      handleGetUserList()
    }

    const handleSubmit = () => {
      console.log('handleSubmit')
      // privileges 是完整的 actions 列表
      const privileges = actions.value.map(act => ({
        rs_type_action_id: act.value,
        checked: !!actionsSelected.value.find(id => id === act.value)
      }))
      strategy.setAuth(type.value, id.value as number, privileges).then(() => {
        message.success('新建成功')
        handleClose(true)
      }).catch(err => {
        message.error(`新建失败: ${err}`)
      })
    }

    // 注意该方法不能直接赋值给 @close，因为 close 回调函数的参数是 event
    const handleClose = (success = false) => {
      console.log('handleClose: ', success)
      // 先 emit，再 reset，防止先把 type 的值重置了
      context.emit('close', type.value, success)
      handleReset()
    }

    watch(() => props.visible, visible => visible && handleInit())

    return {
      ADD,
      USER,
      AVATAR_NUM,
      type,
      id,
      userOrRoleList,
      actions,
      actionsSelected,
      disableActionSelector,
      userOrRoleSelectorIcon,
      userOrRoleSelectorPlaceholder,
      actionSelectorIcon,
      isUnChange,
      handleSelectType,
      handleSelectUserOrRole,
      handleSearchUserOrRole,
      handleActionSelectorChange,
      handleClose,
      handleSubmit
    }
  }
})
</script>

<style lang="scss">
@import './addOrEdit.scss';
</style>