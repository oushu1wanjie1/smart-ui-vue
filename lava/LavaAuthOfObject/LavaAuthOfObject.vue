<template>
  <x-drawer
    wrapClassName="lava-auth-of-object-drawer-outside"
    :title="title"
    :visible="visible"
    :width="800"
    :bodyStyle="{ height: 'calc(100% - 100px)' }"
    @close="handleClose"
  >
    <div class="container">
      <!-- 控制条 -->
      <div class="controls">
        <div class="left">
          <x-button class="add" @click="handleShowAddDrawer">
            <icon class="add-inactive" name="lava-auth-of-object/add"></icon>
            <icon class="add-active" name="lava-auth-of-object/add-active"></icon>
            添加权限
          </x-button>
        </div>
        <div class="right">
          <x-select class="select" v-model:value="userOrRole" @change="handleChangeSelector">
            <template #prefixIcon><icon :name="`lava-auth-of-object/${selectorIcon}`"></icon></template>
            <x-select-option value="user">用户</x-select-option>
            <x-select-option value="role">角色</x-select-option>
          </x-select>
          <x-input-search
            class="search raw"
            allowClear
            v-model:value="searchVal"
            :placeholder="searchPlaceholder"
            @change="handleSearch"
          ></x-input-search>
        </div>
      </div>
      <x-divider style="margin: 10px 0;"></x-divider>
      <!-- 权限列表 -->
      <lava-auth-list
        :type="userOrRole"
        :loading="loading"
        :auth-list="authList"
        @edit="handleShowEditDrawer"
      ></lava-auth-list>
    </div>
    <lava-auth-add
      :rs-type="rsType"
      :visible="addVisible"
      :user-list="userList"
      :role-list="roleList"
      @getUserList="handleGetUserList"
      @getRoleList="handleGetRoleList"
      @close="handleAddOrEditDrawerClose"
    ></lava-auth-add>
    <lava-auth-edit
      :visible="editVisible"
      :type="userOrRoleSelected"
      :id="userOrRoleIdSelected"
      @close="handleAddOrEditDrawerClose"
    ></lava-auth-edit>
  </x-drawer>
</template>

<script lang="ts">
import { computed, ComputedRef, defineComponent, PropType, provide, ref, Ref, watch } from 'vue'
import Icon from '../../helper/Icon.vue'
import XDrawer from '../../XDrawer.vue'
import XButton from '../../XButton.vue'
import XSelect from '../../XSelect.vue'
import XSelectOption from '../../XSelectOption.vue'
import XInputSearch from '../../XInputSearch.vue'
import XDivider from '../../XDivider.vue'
import LavaAuthList from './LavaAuthList.vue'
import LavaAuthAdd from './LavaAuthAdd.vue'
import LavaAuthEdit from './LavaAuthEdit.vue'
import {
  SOURCE_SELF,
  SOURCE_INHERIT,
  ROLE,
  USER,
  ApiGetAuthList,
  ApiGetAuthOfUserOrRole,
  AuthListItem,
  ApiGetAuthSourceRoles,
  ApiSetAuth,
  ApiGetUserList,
  ApiGetRoleList,
  UserOrRoleSelectorOption,
  ApiGetAuthListOfDst,
  ApiSetAuthOfDst,
  ApiGetAuthOfUserOrRoleOfDst,
  ApiGetAuthSourceRolesOfDst,
  RS_COMMON,
  RS_DATABASE,
  RS_SCHEMA, RS_TABLE,
} from './type'
import { message } from 'ant-design-vue-3'
import { StrategyCommon, StrategyDb } from '@/smart-ui-vue/lava/LavaAuthOfObject/strategy'

export default defineComponent({
  name: 'LavaAuthOfObject',
  components: {
    Icon,
    XDrawer,
    XButton,
    XSelect,
    XSelectOption,
    XInputSearch,
    XDivider,
    LavaAuthList,
    LavaAuthAdd,
    LavaAuthEdit
  },
  props: {
    // 通用 props
    title: {
      type: String,
      required: true
    },
    visible: {
      type: Boolean,
      required: true
    },
    rsType: {
      type: String,
      required: true
    },
    // common 专属 props
    rsTypeId: {
      type: Number,
    },
    objectId: {
      type: Number
    },
    apiGetAuthList: {
      type: Function as PropType<ApiGetAuthList>
    },
    apiGetAuthOfUserOrRole: {
      type: Function as PropType<ApiGetAuthOfUserOrRole>
    },
    apiGetAuthSourceRoles: {
      type: Function as PropType<ApiGetAuthSourceRoles>
    },
    apiSetAuth: {
      type: Function as PropType<ApiSetAuth>
    },
    apiGetUserList: {
      type: Function as PropType<ApiGetUserList>
    },
    apiGetRoleList: {
      type: Function as PropType<ApiGetRoleList>
    },
    // db 专属 props
    clusterId: {
      type: Number
    },
    databaseName: {
      type: String
    },
    schemaName: {
      type: String
    },
    tableName: {
      type: String
    },
    apiGetAuthListOfDst: {
      type: Function as PropType<ApiGetAuthListOfDst>
    },
    apiGetAuthOfUserOrRoleOfDst: {
      type: Function as PropType<ApiGetAuthOfUserOrRoleOfDst>
    },
    apiGetAuthSourceRolesOfDst: {
      type: Function as PropType<ApiGetAuthSourceRolesOfDst>
    },
    apiSetAuthOfDst: {
      type: Function as PropType<ApiSetAuthOfDst>
    }
  },
  emits: [ 'close' ],
  setup(props, context) {
    const loading: Ref<boolean> = ref(false)
    const userOrRole: Ref<string> = ref(USER)
    const searchVal: Ref<string> = ref('')
    const userAuthList: Ref<AuthListItem[]> = ref([])
    const roleAuthList: Ref<AuthListItem[]> = ref([])
    const searchAuthList: Ref<AuthListItem[]> = ref([])
    const addVisible: Ref<boolean> = ref(false)
    const editVisible: Ref<boolean> = ref(false)
    const userOrRoleSelected: Ref<string> = ref('')
    const userOrRoleIdSelected: Ref<number> = ref(0)
    const userList: Ref<UserOrRoleSelectorOption[]> = ref([])
    const roleList: Ref<UserOrRoleSelectorOption[]> = ref([])

    const searchPlaceholder: ComputedRef<string> = computed(() => {
      return userOrRole.value === USER ? '请输入需要搜索的用户名' : '请输入需要搜索的角色名'
    })

    const selectorIcon: ComputedRef<string> = computed(() => {
      return userOrRole.value === USER ? 'user' : 'role'
    })

    const authList: ComputedRef<AuthListItem[]> = computed(() => {
      if (searchVal.value) {
        return searchAuthList.value
      } else {
        return userOrRole.value === USER ? userAuthList.value : roleAuthList.value
      }
    })

    // 选择策略
    const strategy = ((rsType: string) => {
      if (rsType === RS_DATABASE || rsType === RS_SCHEMA || rsType === RS_TABLE) {
        return new StrategyDb(
          props.rsType,
          props.clusterId!,
          props.databaseName!,
          props.schemaName!,
          props.tableName!,
          props.apiGetAuthListOfDst!,
          props.apiGetAuthOfUserOrRoleOfDst!,
          props.apiGetAuthSourceRolesOfDst!,
          props.apiSetAuthOfDst!,
        )
      } else {
        return new StrategyCommon(
          props.rsType,
          props.rsTypeId!,
          props.objectId!,
          props.apiGetAuthList!,
          props.apiGetAuthOfUserOrRole!,
          props.apiGetAuthSourceRoles!,
          props.apiSetAuth!
        )
      }
    })(props.rsType)

    // 提供给子孙组件
    provide('strategy', strategy)

    const handleChangeSelector = (val: string) => {
      if (val === USER && userAuthList.value.length === 0) {
        handleGetAuthList(USER)
      }
      if (val === ROLE && roleAuthList.value.length === 0) {
        handleGetAuthList(ROLE)
      }
    }

    const handleSearch = () => {
      // 前端搜索
      loading.value = true
      const list = userOrRole.value === USER ? userAuthList.value : roleAuthList.value
      const result: AuthListItem[] = []
      const keyword = searchVal.value.trim().toLowerCase()
      if (keyword !== '') {
        list.forEach(item => {
          if (item.name.toLowerCase().indexOf(keyword) > -1) {
            result.push(item)
          } else if (item.remark && item.remark.toLowerCase().indexOf(keyword) > -1) {
            result.push(item)
          }
        })
      }
      searchAuthList.value = result
      loading.value = false
    }

    const handleShowAddDrawer = () => {
      addVisible.value = true
    }

    const handleShowEditDrawer = (type: string, id: number) => {
      userOrRoleSelected.value = type
      userOrRoleIdSelected.value = id
      editVisible.value = true
    }

    const handleAddOrEditDrawerClose = (userRole: string, success: boolean) => {
      addVisible.value = false
      editVisible.value = false
      // 如果是因 "新建" or "编辑" 成功触发的关闭抽屉，那么应该刷新列表
      if (success && userRole === USER) {
        handleGetAuthList(USER)
      }
      if (success && userRole === ROLE) {
        handleGetAuthList(ROLE)
      }
    }

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
        }
      }).catch(err => {
        message.error(`获取角色列表失败: ${err}`)
      })
    }

    const handleClose = () => {
      context.emit('close', false)
      handleReset()
    }

    const handleReset = () => {
      userOrRole.value = USER
      searchVal.value = ''
      userAuthList.value = []
      roleAuthList.value = []
      searchAuthList.value = []
      addVisible.value = false
      editVisible.value = false
      userOrRoleSelected.value = ''
      userOrRoleIdSelected.value = 0
      userList.value = []
      roleList.value = []
    }

    const handleGetAuthList = (userRole = USER) => {
      if (props.rsType === RS_COMMON && typeof props.apiGetAuthList !== 'function') {
        return
      }
      if (
        (props.rsType === RS_DATABASE || props.rsType === RS_SCHEMA || props.rsType === RS_TABLE) &&
        typeof props.apiGetAuthListOfDst !== 'function'
      ) {
        return
      }

      loading.value = true
      strategy.getAuthList(userRole, searchVal.value).then(data => {
        if (userRole === USER) {
          userAuthList.value = data
        } else {
          roleAuthList.value = data
        }
      }).catch(err => {
        message.error(`获取权限列表失败: ${err}`)
      }).finally(() => {
        loading.value = false
      })
    }

    const handleInit = () => {
      handleReset()
      handleGetAuthList(USER)
    }

    watch(() => props.visible, visible => visible && handleInit())

    return {
      USER,
      ROLE,
      SOURCE_SELF,
      SOURCE_INHERIT,
      loading,
      userOrRole,
      selectorIcon,
      searchVal,
      searchPlaceholder,
      authList,
      addVisible,
      editVisible,
      userOrRoleSelected,
      userOrRoleIdSelected,
      userList,
      roleList,
      handleChangeSelector,
      handleSearch,
      handleShowAddDrawer,
      handleShowEditDrawer,
      handleAddOrEditDrawerClose,
      handleGetUserList,
      handleGetRoleList,
      handleClose,
      handleInit
    }
  }
})
</script>

<style lang="scss">
@import "../../styles/variables.scss";

.lava-auth-of-object-drawer-outside {
  .container {
    height: calc(100%);
    margin-top: 10px;
    overflow: hidden;
  }

  .controls {
    display: flex;
    justify-content: space-between;

    .right {
      display: flex;
    }

    .add {
      border-color: $color-line-bold!important;

      .add-inactive {
        display: block;
      }

      .add-active {
        display: none;
      }

      &:hover {
        .add-inactive {
          display: none;
        }

        .add-active {
          display: block;
        }
      }
    }

    .select {
      width: 100px;
      margin-right: 10px;
    }

    .search {
      width: 208px;
    }
  }
}
</style>
