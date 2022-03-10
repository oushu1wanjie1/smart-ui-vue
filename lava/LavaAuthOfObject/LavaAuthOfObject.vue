<template>
  <div id="lava-auth-of-object">
    <x-drawer
      wrapClassName="lava-auth-of-object-drawer-outside"
      :title="title"
      :visible="visible"
      :width="800"
    >
      <div class="container">
        <div class="controls">
          <div class="left">
            <x-button class="add">
              <icon class="add-inactive" name="lava-auth-of-object/add"></icon>
              <icon class="add-active" name="lava-auth-of-object/add-active"></icon>
              添加权限
            </x-button>
          </div>
          <div class="right">
            <x-select class="select" v-model:value="type" @change="handleChangeSelector">
              <template #prefixIcon><icon :name="`lava-auth-of-object/${selectIcon}`"></icon></template>
              <x-select-option value="user">用户</x-select-option>
              <x-select-option value="role">角色</x-select-option>
            </x-select>
            <x-input-search
              class="search raw"
              v-model:value="searchVal"
              :placeholder="searchPlaceholder"
              @search="handleSearch"
            ></x-input-search>
          </div>
        </div>
        <x-divider style="margin: 10px 0;"></x-divider>
      </div>
    </x-drawer>
  </div>
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

export const USER = 'user'
export const ROLE = 'role'

export default defineComponent({
  name: 'LavaAuthOfObject',
  components: {
    Icon,
    XDrawer,
    XButton,
    XSelect,
    XSelectOption,
    XInputSearch,
    XDivider
  },
  props: {
    title: {
      type: String,
      required: true
    },
    visible: {
      type: String,
      required: true
    }
  },
  setup() {
    const type: Ref<string> = ref(USER)
    const searchVal: Ref<string> = ref('')
    const userAuthList = ref([])
    const roleAuthList = ref([])

    const searchPlaceholder: ComputedRef<string> = computed(() => {
      return type.value === USER ? '请输入需要搜索的用户名' : '请输入需要搜索的角色名'
    })

    const selectIcon: ComputedRef<string> = computed(() => {
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

    return {
      type,
      selectIcon,
      searchVal,
      searchPlaceholder,
      authList,
      handleChangeSelector,
      handleSearch
    }
  }
})
</script>

<style lang="scss">
@import "../../styles/variables.scss";

#lava-auth-of-object {

}

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