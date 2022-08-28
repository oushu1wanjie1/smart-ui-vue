<template>
  <div class="lava-user-info">
    <lava-avatar v-if="showAvatar" :user-id="id" class="user-avatar"/>
    <!--      name      -->
    <div>
      <slot name="extra"/>
      <x-button
        v-if="id && name"
        class="user-name"
        type="link"
        @click="$router.push(`/main/UserCenter/user/${id}`)"
        :title="name"
      >
        {{ name }}
      </x-button>
      <span v-else-if="id" :title="defaultName">{{ defaultName }}</span>
      <span v-else title="已注销">已注销</span>
    </div>
    <!--     remark       -->
    <span v-if="id && remark" class="name-remark" :title="remark">{{ remark }}</span>
    <span v-else-if="id" class="logoff-remark" :title="defaultRemark">{{ defaultRemark }}</span>
    <span v-else class="logoff-remark" title="已注销">已注销</span>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import XButton from '../XButton.vue'
import LavaAvatar from '@/smart-ui-vue/lava/LavaAvatar.vue'

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
    defaultName: {
      type: String,
      default: '无姓名'
    },
    // 用户名备注
    remark: {
      type: String
    },
    defaultRemark: {
      type: String,
      default: '无备注',
    },
    showAvatar: {
      type: Boolean,
      default: true
    }
  },
  // 名字前额外的扩展内容
  slots: ['extra']
})
</script>

<style lang="scss">
.lava-user-info {
  display: flex;
  align-items: center;
  overflow: hidden;
  text-overflow: ellipsis;

  .user-avatar {
    width: 24px;
    height: 24px;
    margin-right: 10px;
    flex-shrink: 0;
  }

  // 加权重
  .user-name.#{$ant-prefix}-btn {
    justify-content: flex-start;
    padding: 0;
    margin-right: 10px;
    max-width: 100%;

    > span {
      overflow: hidden; //超出一行文字自动隐藏
      text-overflow: ellipsis; //文字隐藏后添加省略号
      white-space: nowrap; //强制不换行
    }
  }

  .name-remark {
    color: $color-primary-black;
  }

  .name-remark,
  .logoff-remark {
    @include font-small();
    overflow: hidden; //超出一行文字自动隐藏
    text-overflow: ellipsis; //文字隐藏后添加省略号
    white-space: nowrap; //强制不换行
  }
}
</style>
