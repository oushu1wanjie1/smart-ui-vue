<template>
  <a-menu-divider class="smartui-menu-divider"></a-menu-divider>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import { Menu as AMenu } from 'ant-design-vue'

export default defineComponent({
  name: 'XMenuDivider',
  // eslint-disable-next-line vue/no-unused-components
  components: { AMenu, AMenuDivider: AMenu.Divider }
})
</script>
<style lang="scss">
@import "styles/components/XMenu/XMenuDivider";
</style>