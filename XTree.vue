<template>
  <component
    :is="willUsingTreeRawComp"
    :class="{'smartui-tree': true, 'smartui-tree-directory': isDirectoryTree}"
  >
    <template v-for="item in slots" v-slot:[item]="scope">
      <slot :name="item" v-bind="scope"></slot>
    </template>
  </component>
</template>

<script lang="ts">
import { Tree as ATree } from 'ant-design-vue-3'
import { computed, defineComponent, toRefs } from 'vue'

export default defineComponent({
  name: 'XTree',
  components: { ATree, ADirectoryTree: ATree.DirectoryTree },
  props: {
    // 是否为文件夹树，设为true将使用a-directory-tree
    isDirectoryTree: {
      type: Boolean,
      default: false
    }
  },
  setup(props, context) {
    const { isDirectoryTree: isDirectoryTreeRef } = toRefs(props)
    // 将要使用的Tree原始组件，根据isDirectoryTree使用ATree或者ATree.DirectoryTree
    const willUsingTreeRawCompCpt = computed(() => isDirectoryTreeRef.value ? 'ADirectoryTree' : 'ATree')
    return {
      willUsingTreeRawComp: willUsingTreeRawCompCpt,
      slots: computed(() => Object.keys(context.slots)),
    }
  }
})
</script>

<style lang="scss">
@import './styles/components/XTree/index.scss';
</style>
