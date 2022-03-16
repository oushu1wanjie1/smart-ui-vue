<template>
  <div class="lava-auth-list">
    <x-spin v-if="loading"></x-spin>
    <template v-else>
    <div class="lava-auth-list-item" v-for="auth in authList" :key="auth.id || auth.name">
      <lava-object-basic-info
        class="object-info"
        :type="type"
        id="111"
        :name="auth.name"
        :remark="auth.remark"
        :icon="type === USER ? auth.icon : 'lava-auth-of-object/role-blue'"
      >
        <span class="object-tag owner" v-if="type === USER && auth.isOwner">
          <icon name="lava-auth-of-object/key"></icon>拥有人
        </span>
        <span class="object-tag system-role">系统角色</span>
      </lava-object-basic-info>
      <div class="actions">
        <lava-action-tag
          class="action-tag"
          v-for="action in auth.actions"
          :key="action.id"
          :action="action">
        </lava-action-tag>
      </div>
      <div class="edit"><icon name="lava-auth-of-object/edit"></icon></div>
    </div>
    <!-- TODO: 加载更多，可能不分页了 -->
    <!--<div class="loadmore"></div>-->
    </template>
  </div>
</template>

<script lang="ts">
import { PropType, defineComponent } from 'vue'
import Icon from '../../helper/Icon.vue'
import XSpin from '../../XSpin.vue'
import LavaObjectBasicInfo from '../LavaObjectBasicInfo.vue'
import LavaActionTag from './LavaActionTag.vue'
import { USER, AuthListItem } from './type'

export default defineComponent({
  name: 'LavaAuthList',
  components: {
    Icon,
    XSpin,
    LavaObjectBasicInfo,
    LavaActionTag
  },
  props: {
    type: {
      type: String,
      required: true
    },
    loading: {
      type: Boolean,
      default: false
    },
    authList: {
      type: Array as PropType<AuthListItem[]>,
      default: () => []
    }
  },
  setup() {

    return {
      USER,
    }
  }
})
</script>

<style lang="scss">
@import "../../styles/variables.scss";

.lava-auth-list {

  .lava-auth-list-item {
    display: flex;
    align-items: center;
    position: relative;
    padding: 15px;
    border-bottom: 1px solid $color-line-bold;

    &:hover {
      border-radius: 4px;

      &::after {
        position: absolute;
        top: -1px;
        left: 0;
        content: '';
        display: block;
        width: 100%;
        height: calc(100% + 2px);
        border: 1px solid $color-text-sub;
        border-radius: 4px;
        // 事件穿透
        pointer-events: none;
      }

      .edit svg {
        display: block;
      }
    }

    .object-info {
      flex-basis: 300px;
      flex-shrink: 0;
      align-self: start;
      padding-right: 10px;
    }

    .actions {
      flex-grow: 1;
      // 妙哉！！！巧用 margin 折叠，解决最后一行外边距问题
      margin-bottom: -10px;

      .action-tag {
        margin-right: 10px;
        margin-bottom: 10px;
      }
    }

    .edit {
      flex-basis: 33px;
      display: flex;
      justify-content: end;
      cursor: pointer;

      svg {
        display: none;
      }
    }

    .object-tag {
      display: flex;
      height: 22px;
      padding: 2.5px 4px;
      border-radius: 4px;
      margin-left: 4px;
      font-size: $font-size-small;
      color: $color-text-sub;
      background-color: rgba(213, 216, 219, 0.5);

      &.owner {
        color: $color-primary-blue;
        background-color: rgba(51, 108, 255, 0.2);
      }
    }
  }
}
</style>