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
          <x-select class="select" v-model:value="type" @change="handleChangeSelector">
            <template #prefixIcon><icon :name="`lava-auth-of-object/${selectorIcon}`"></icon></template>
            <x-select-option value="user">用户</x-select-option>
            <x-select-option value="role">角色</x-select-option>
          </x-select>
          <x-input-search
            class="search raw"
            allowClear
            v-model:value="searchVal"
            :placeholder="searchPlaceholder"
            @search="handleSearch"
          ></x-input-search>
        </div>
      </div>
      <x-divider style="margin: 10px 0;"></x-divider>
      <!-- 权限列表 -->
      <lava-auth-list></lava-auth-list>
    </div>
    <lava-auth-edit v-model:visible="insideDrawerVisible"></lava-auth-edit>
  </x-drawer>
</template>

<script lang="ts">
import { computed, ComputedRef, defineComponent, ref, Ref } from 'vue'
import Icon from '../../helper/Icon.vue'
import XDrawer from '../../XDrawer.vue'
import XButton from '../../XButton.vue'
import XSelect from '../../XSelect.vue'
import XSelectOption from '../../XSelectOption.vue'
import XInputSearch from '../../XInputSearch.vue'
import XDivider from '../../XDivider.vue'
import LavaObjectBasicInfo from '../LavaObjectBasicInfo.vue'
import LavaActionTag from './LavaActionTag.vue'
import LavaAuthList from './LavaAuthList.vue'
import LavaAuthEdit from './LavaAuthEdit.vue'
import { SOURCE_SELF, SOURCE_INHERIT, ROLE, USER } from './type'

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
    LavaObjectBasicInfo,
    LavaActionTag,
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
      type: Function,
      required: true
    },
    apiGetAuthOfUserOrRole: {
      type: Function,
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
  emits: [ 'update:visible', 'close' ],
  setup(props, context) {
    const type: Ref<string> = ref(USER)
    const searchVal: Ref<string> = ref('')
    const userAuthList = ref([])
    const roleAuthList = ref([])
    const insideDrawerVisible: Ref<Boolean> = ref(false)

    const searchPlaceholder: ComputedRef<string> = computed(() => {
      return type.value === USER ? '请输入需要搜索的用户名' : '请输入需要搜索的角色名'
    })

    const selectorIcon: ComputedRef<string> = computed(() => {
      return type.value === USER ? 'user' : 'role'
    })

    const authList = computed(() => {
      return type.value === USER ? userAuthList : roleAuthList
    })

    const handleGetAuthList = () => {
      console.log('handleGetAuthList')
    }

    const handleChangeSelector = (val: string) => {
      if (val === USER && userAuthList.value.length === 0) {
        handleGetAuthList()
      }
      if (val === ROLE && roleAuthList.value.length === 0) {
        handleGetAuthList()
      }
    }

    const handleSearch = () => {
      handleGetAuthList()
    }

    const handleClose = () => {
      context.emit('update:visible', false)
      context.emit('close', false)
    }

    return {
      USER,
      ROLE,
      SOURCE_SELF,
      SOURCE_INHERIT,
      type,
      selectorIcon,
      searchVal,
      searchPlaceholder,
      authList,
      insideDrawerVisible,
      handleChangeSelector,
      handleSearch,
      handleClose
    }
  }
})
</script>

<style lang="scss">
@import "../../styles/variables.scss";

.lava-auth-of-object-drawer-outside {
  .container {
    margin-top: 10px;
    margin-right: 40px;
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