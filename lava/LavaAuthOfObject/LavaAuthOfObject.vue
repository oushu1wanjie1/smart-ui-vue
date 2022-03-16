<template>
  <x-drawer
    wrapClassName="lava-auth-of-object-drawer-outside"
    :title="title"
    :visible="visible"
    :width="800"
    @close="handleClose"
  >
    <div class="container">
      <!-- 控制条 -->
      <div class="controls">
        <div class="left">
          <x-button class="add" @click="insideDrawerVisible = true">
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
            @search="handleSearch"
          ></x-input-search>
        </div>
      </div>
      <x-divider style="margin: 10px 0;"></x-divider>
      <!-- 权限列表 -->
      <lava-auth-list :type="userOrRole" :loading="loading" :auth-list="authList"></lava-auth-list>
    </div>
    <lava-auth-edit v-model:visible="insideDrawerVisible"></lava-auth-edit>
  </x-drawer>
</template>

<script lang="ts">
import { computed, ComputedRef, defineComponent, PropType, ref, Ref, watch } from 'vue'
import Icon from '../../helper/Icon.vue'
import XDrawer from '../../XDrawer.vue'
import XButton from '../../XButton.vue'
import XSelect from '../../XSelect.vue'
import XSelectOption from '../../XSelectOption.vue'
import XInputSearch from '../../XInputSearch.vue'
import XDivider from '../../XDivider.vue'
import LavaAuthList from './LavaAuthList.vue'
import LavaAuthEdit from './LavaAuthEdit.vue'
import {
  SOURCE_SELF,
  SOURCE_INHERIT,
  ROLE,
  USER,
  ApiGetAuthListReq,
  ApiGetAuthList,
  ApiGetAuthOfUserOrRole, ApiGetAuthListRes, AuthListItem, ActionTag, Action, Role,
} from './type'
import { message } from 'ant-design-vue'
import { debounce } from 'lodash'

const handleFormatActionTag = (actions: Action[], type: string): ActionTag[] => {
  return actions.map(act => ({
    type,
    id: act.rs_type_action_id,
    name: act.action_name,
    roles: []
  }))
}

const handleFormatAuthList = (data: ApiGetAuthListRes, type: string): AuthListItem[] => {
  const _data = data.user_or_role_privileges
  return _data.map(item => ({
    type,
    id: item.user_or_role_id,
    name: item.user_or_role_name,
    remark: item.comment,
    icon: `/images/avatar/${Math.abs(item.user_or_role_id) % 6}.svg`,
    actions: handleFormatActionTag(item.actions, type),
    isOwner: type === USER && item.is_owner
  }))
}

const STRATEGY_DATA = {

}

const STRATEGY_COMMON = {

}

const STRATEGY = {
  database: STRATEGY_DATA,
  schema: STRATEGY_DATA,
  table: STRATEGY_DATA,
  common: STRATEGY_COMMON
}

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
    LavaAuthEdit
  },
  props: {
    title: {
      type: String,
      required: true
    },
    visible: {
      type: Boolean,
      required: true
    },
    type: {
      type: String,
      required: true
    },
    apiGetAuthList: {
      type: Function as PropType<ApiGetAuthList>,
      required: true
    },
    apiGetAuthOfUserOrRole: {
      type: Function as PropType<ApiGetAuthOfUserOrRole>,
      required: true
    },
    apiGetInheritRoles: {
      type: Function,
      required: true
    },
    apiSetAuth: {
      type: Function,
      required: true
    }
  },
  emits: [ 'close' ],
  setup(props, context) {
    const delay = 500
    const loading: Ref<boolean> = ref(false)
    const userOrRole: Ref<string> = ref(USER)
    const searchVal: Ref<string> = ref('')
    const userAuthList: Ref<AuthListItem[]> = ref([])
    const roleAuthList: Ref<AuthListItem[]> = ref([])
    const searchAuthList: Ref<AuthListItem[]> = ref([])
    const insideDrawerVisible: Ref<boolean> = ref(false)

    const searchPlaceholder: ComputedRef<string> = computed(() => {
      return userOrRole.value === USER ? '请输入需要搜索的用户名' : '请输入需要搜索的角色名'
    })

    const selectorIcon: ComputedRef<string> = computed(() => {
      return userOrRole.value === USER ? 'user' : 'role'
    })

    const authList = computed(() => {
      if (searchAuthList.value.length > 0) {
        return searchAuthList.value
      } else {
        return userOrRole.value === USER ? userAuthList.value : roleAuthList.value
      }
    })

    const handleChangeSelector = (val: string) => {
      if (val === USER && userAuthList.value.length === 0) {
        handleGetAuthList()
      }
      if (val === ROLE && roleAuthList.value.length === 0) {
        handleGetAuthList()
      }
    }

    const handleSearch = (val: string) => {
      console.log('handleSearch: ', val)
      loading.value = true
      // 前端搜索
      const list = userOrRole.value ? userAuthList.value : roleAuthList.value
      const result: AuthListItem[] = []
      list.forEach(item => {
        if (item.name.indexOf(searchVal.value) > -1 || (item.remark && item.remark.indexOf(searchVal.value) > -1)) {
          result.push(item)
        }
      })
      searchAuthList.value = result
      console.log('search result: ', result)
      loading.value = false
      // 后端搜索
      // _handleGetAuthList().then(data => {
      //   if (data && data.user_or_role_privileges.length > 0) {
      //     const list = handleFormatAuthList(data, userOrRole.value)
      //     searchAuthList.value = list
      //   } else {
      //     searchAuthList.value = []
      //   }
      // })
    }

    const handleClose = () => {
      context.emit('close', false)
    }

    const handleReset = () => {
      searchVal.value = ''
      userAuthList.value = []
      roleAuthList.value = []
      insideDrawerVisible.value = false
    }

    const _handleGetAuthList = () => {
      const params: ApiGetAuthListReq = {
        resource_type_id: 0,
        object_id: 0,
        user_type: userOrRole.value,
        user_or_role_name: searchVal.value
      }
      return props.apiGetAuthList(params).then(({ meta, data }) => {
        if (meta.success) {
          return data
        } else {
          throw new Error(meta.message || meta.status_code)
        }
      })
    }

    const handleGetAuthList = () => {
      if (typeof props.apiGetAuthList !== 'function') return
      loading.value = true
      _handleGetAuthList().then(data => {
        const list = handleFormatAuthList(data, userOrRole.value)
        console.log('handleGetAuthList: ', list)
        if (userOrRole.value === USER) {
          userAuthList.value = list
        } else {
          roleAuthList.value = list
        }
      }).catch(err => {
        message.error(`获取权限列表失败: ${err}`)
      }).finally(() => {
        loading.value = false
      })
    }

    const handleInit = () => {
      // 1. 重置状态
      handleReset()
      // 2. 发送请求
      handleGetAuthList()
    }

    watch(() => props.visible, (visible) => {
      if (visible) {
        // 打开抽屉
        handleInit()
      } else {
        // 关闭抽屉
      }
    })

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
      insideDrawerVisible,
      handleChangeSelector,
      handleSearch: debounce(handleSearch, delay),
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
    margin-top: 10px;
    margin-bottom: 40px;
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