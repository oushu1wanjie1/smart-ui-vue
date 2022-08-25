<template>
  <a-menu-divider class="smartui-menu-divider"></a-menu-divider>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import { Menu } from 'ant-design-vue'

export default defineComponent({
  name: 'XMenuDivider',
  components: { AMenuDivider: Menu.Divider }
})
</script>
<style lang="scss">
@import "../styles/components/XMenu/XMenuDivider";
</style>