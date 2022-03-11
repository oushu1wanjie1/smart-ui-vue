<template>
  <div class="lava-auth-list">
    <div class="lava-auth-list-item" v-for="item in list">
      <lava-object-basic-info :type="USER" id="111" name="malin" remark="balabala..." class="object-info">
        <span class="object-tag owner">
          <icon name="lava-auth-of-object/key"></icon>拥有人
        </span>
        <span class="object-tag system-role">系统角色</span>
      </lava-object-basic-info>
      <div class="actions">
        <lava-action-tag class="action-tag" v-for="item in list" :action="{ name: '连接', type: SOURCE_SELF, roles: [
            { name: '系统角色' },
            { name: '权限管理员' },
            { name: '设备维护' },
            { name: '运维人员' }
            ] }">
        </lava-action-tag>
      </div>
      <div class="edit"><icon name="lava-auth-of-object/edit"></icon></div>
    </div>
    <!-- TODO: 加载更多，可能不分页了 -->
    <!--<div class="loadmore"></div>-->
  </div>
</template>

<script lang="ts">
import { PropType, defineComponent, ref } from 'vue'
import Icon from '../../helper/Icon.vue'
import LavaObjectBasicInfo from '../LavaObjectBasicInfo.vue'
import LavaActionTag from './LavaActionTag.vue'
import { USER, SOURCE_SELF, SOURCE_INHERIT, AuthListItem } from './type'

export default defineComponent({
  name: 'LavaAuthList',
  components: {
    Icon,
    LavaObjectBasicInfo,
    LavaActionTag
  },
  props: {
    type: {
      type: String,
      required: true
    },
    authList: {
      type: Object as PropType<AuthListItem>,
      default: () => []
    }
  },
  setup() {
    const list = ref(new Array(10))

    return {
      USER,
      SOURCE_SELF,
      list
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
      align-self: start;
    }

    .actions {
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
      padding: 2px 6px;
      border-radius: 4px;
      margin-left: 10px;
      font-size: $font-size-small;
      color: $color-text-sub;
      line-height: initial;
      background-color: $color-line-bold;

      &.owner {
        color: $color-primary-blue;
        background-color: rgba(51, 108, 255, 0.2);
      }
    }
  }
}
</style>