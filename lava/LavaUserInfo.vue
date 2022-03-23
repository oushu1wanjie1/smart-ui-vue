<template>
  <div class="lava-user-info">
    <lava-avatar class="user-avatar" :user-id="id"/>
    <div class="user-info">
      <!--      name      -->
      <x-button
        class="user-name"
        v-if="id"
        type="link"
        @click="$router.push(`/main/user_center/user/${id}`)"
      >{{ name || '姓名' }}</x-button>
      <span v-else>已注销</span>
      <!--     remark       -->
      <span v-if="id" class="name-remark">{{ remark || '姓名' }}</span>
      <span v-else class="logoff-remark">已注销</span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import XButton from '../XButton.vue'
import LavaAvatar from './LavaAvatar.vue'

export default defineComponent({
  name: 'LavaUserInfo',
  components: { LavaAvatar, XButton },
  props: {
    // 用户id
    id: {
      type: Number,
      required: true
    },
    // 用户名
    name: {
      type: String,
    },
    // 用户名备注
    remark: {
      type: String
    }
  }
})
</script>

<style lang="scss">
.lava-user-info {
  display: flex;
  align-items: center;

  .user-avatar {
    width: 24px;
    height: 24px;
    margin-right: 10px;
  }
  .user-info {
    display: flex;
    flex-direction: column;
    color: $color-text-comment;

    .user-name {
      height: 20px;
      margin-bottom: 2px;
      padding: 0;
    }
    .name-remark {
      font-size: 12px;
      color: $color-primary-black;
    }
    .logoff-remark {
      font-size: 12px;
    }
  }
}
</style>