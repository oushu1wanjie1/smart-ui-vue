<template>
  <div class="lava-auth-list-container">
    <x-spin wrapperClassName="lava-auth-list-spin" :spinning="loading" :delay="loadingDelay">
      <div class="lava-auth-list">
        <template v-if="authList.length > 0">
          <div class="lava-auth-list-item" v-for="auth in authList" :key="auth.id || auth.name">
            <lava-object-basic-info
                class="object-info"
                :type="type"
                :id="auth.id"
                :name="auth.name"
                :remark="auth.remark"
                :icon="type === USER ? auth.icon : 'lava-auth-of-object/role-blue'"
            >
            <span class="object-tag owner" v-if="type === USER && auth.isOwner">
              <icon name="lava-auth-of-object/key"></icon>拥有人
            </span>
              <span class="object-tag system-role" v-if="auth.roleType !== undefined && auth.roleType === 0">系统角色</span>
            </lava-object-basic-info>
            <div class="actions">
              <lava-action-tag
                  class="action-tag"
                  v-for="action in auth.actions"
                  :key="action.id"
                  :type="type"
                  :action="action"
                  @mouseenter="isShowRolePanel(type, action.type) && onMouseEnter(auth, action.id)"
              >
              </lava-action-tag>
            </div>
            <div class="edit" v-if="!(auth.userOrRole === ROLE && auth.roleType === 0)">
              <icon name="lava-auth-of-object/edit" @click="handleClickEditBtn(auth)"></icon>
            </div>
          </div>
        </template>
        <div class="empty" v-else-if="!loading">
          <icon image name="lava-auth-of-object/search-empty"></icon>
        </div>
        <!-- TODO: 加载更多，可能不分页了 -->
        <!--<div class="loadmore"></div>-->
      </div>
    </x-spin>
  </div>
</template>

<script lang="ts">
import { PropType, defineComponent, inject } from 'vue'
import Icon from '../../helper/Icon.vue'
import XSpin from '../../XSpin.vue'
import LavaObjectBasicInfo from '../LavaObjectBasicInfo.vue'
import LavaActionTag from './LavaActionTag.vue'
import { USER, ROLE, SOURCE_SELF, AuthListItem } from './type'
import { Strategy, isShowRolePanel } from '@/smart-ui-vue/lava/LavaAuthOfObject/strategy'
import { message } from 'ant-design-vue-3'
import { debounce } from 'lodash'

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
  emits: [ 'edit' ],
  setup(props, context) {
    const hoverDelay = 500
    // 延迟显示 loading 效果。当 spinning 状态在 delay 时间内结束，则不显示 loading 状态
    const loadingDelay = 500
    const strategy = inject('strategy') as Strategy

    const handleGetAuthSourceRoles = (auth: AuthListItem, actionFlag: string | number) => {
      const action = auth.actions.find(act => {
        if (typeof actionFlag === 'number') {
          return act.id === actionFlag
        } else {
          return act.name === actionFlag
        }
      })
      if (!action || action.roles.length > 0) return
      strategy.getAuthSourceRoles(auth.id, actionFlag).then(data => {
        action.roles.push(...data)
      }).catch(err => {
        // message.error(`获取继承角色失败: ${err}`)
      })
    }

    const handleClickEditBtn = (authItem: AuthListItem) => {
      context.emit('edit', authItem.userOrRole, authItem.id)
    }

    return {
      USER,
      ROLE,
      SOURCE_SELF,
      loadingDelay,
      onMouseEnter: debounce(handleGetAuthSourceRoles, hoverDelay),
      handleClickEditBtn,
      isShowRolePanel
    }
  }
})
</script>

<style lang="scss">
@import "../../styles/variables.scss";

.lava-auth-list-container {
  height: calc(100% - 50px);
  overflow-y: auto;

  .lava-auth-list-spin {
    height: 100%;

    .#{$ant-prefix}-spin-container {
      height: 100%;
    }
  }
}

.lava-auth-list {
  position: relative;
  height: 100%;
  padding-top: 1px;

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

  .empty {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 200px;
    height: 200px;
    transform: translate(-50%, -50%);

    svg {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
