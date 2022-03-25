<template>
  <div class="lava-role-panel">
    <div class="lava-action-tag-source">
      <span v-if="type === SOURCE_SELF">自身权限</span>
      <span v-if="type === SOURCE_INHERIT">继承自角色</span>
      <span v-if="type === SOURCE_SELF_INHERIT">自身权限且继承自角色</span>
    </div>
    <div class="lava-action-tag-roles" v-if="type === SOURCE_INHERIT || type === SOURCE_SELF_INHERIT">
      <div class="row header">
        <div class="name">角色名</div>
        <div class="desc">备注</div>
      </div>
      <div class="row" v-for="role in roles" :key="role.id">
        <div class="name">
          <div class="role-name">
            <icon name="lava-auth-of-object/role-blue"></icon>
            <a :title="role.name" @click="$router.push(`/main/user_center/role/${role.id}`)">{{ role.name }}</a>
          </div>
        </div>
        <div class="desc" :title="role.description">{{ role.description }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import Icon from '../../helper/Icon.vue'
import { Role, SOURCE_SELF, SOURCE_INHERIT, SOURCE_SELF_INHERIT } from './type'

export default defineComponent({
  name: 'LavaRolePanel',
  components: {
    Icon
  },
  props: {
    type: {
      type: String,
      required: true
    },
    roles: {
      type: Array as PropType<Role[]>,
      required: true
    }
  },
  setup() {
    return {
      SOURCE_SELF,
      SOURCE_INHERIT,
      SOURCE_SELF_INHERIT
    }
  }
})
</script>

<style lang="scss">
@import "../../styles/variables.scss";

.lava-role-panel {

  .lava-action-tag-source {
    color: $color-text-sub;
    font-size: $font-size-small;
  }

  .lava-action-tag-roles {
    min-width: 200px;
    margin-top: 5px;

    .row {
      display: flex;
      align-items: flex-start;

      &.header {
        color: $color-text-sub;
        font-size: $font-size-small;
        margin-bottom: 7px;

        .desc {
          color: $color-text-sub;
        }
      }

      .name {
        flex-basis: 120px;
        flex-shrink: 0;
        margin-right: 5px;

        .role-name {
          display: inline-block;
          font-size: $font-size-normal;
          width: 120px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          margin-bottom: 4px;

          a {
            color: $color-primary-blue;
            margin-left: 2px;
          }
        }
      }

      .desc {
        color: $color-primary-black;
      }
    }
  }
}
</style>