<template>
  <a-page-header class="smartui-page-header" @back="() => $router.back()">
    <template #backIcon>
      <x-button icon-name="ui-page-header/back" type="text" />
    </template>
    <template v-for="item in $slots" v-slot:[item]>
      <slot :name="item"></slot>
    </template>
  </a-page-header>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { PageHeader as APageHeader } from 'ant-design-vue-3'
import XButton from '@/smart-ui-vue/XButton.vue'

export default defineComponent({
  name: 'XPageHeader',
  components: { XButton, APageHeader }
})
</script>

<style lang="scss">
@import "./styles/components/XPageHeader";
</style>
