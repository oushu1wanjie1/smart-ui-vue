<template>
  <a-upload v-bind="{...$props}">
    <template v-for="item in slots" v-slot:[item]>
      <slot :name="item"></slot>
    </template>
  </a-upload>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue'

export default defineComponent({
  name: 'XUpload',
  props: {
    type: {
      type: String as PropType<'select' | 'drag'>,
      default: 'select',
    },
    name: String,
    fileList: {
      type: Array as PropType<Array<{ name: string, uid: number | string }>>,
    },
    action: {
      type: [String, Function],
      default: '',
    },
    directory: Boolean,
    data: {
      type: [Object, Function],
      default: () => {
        return {}
      },
    },
    method: String as PropType<'POST' | 'PUT' | 'PATCH' | 'post' | 'put' | 'patch'>,
    headers: Object,
    showUploadList: {
      type: [Boolean, Object] as PropType<boolean | { showRemoveIcon: boolean, showPreviewIcon: boolean }>,
      default: true,
    },
    multiple: {
      type: Boolean,
      default: false,
    },
    accept: {
      type: String,
      default: '',
    },
    beforeUpload: {
      type: Function,
      default: () => () => true,
    },
    listType: {
      type: String as PropType<'text' | 'picture' | 'picture-card'>,
      default: 'text',
    },
    remove: Function,
    supportServerRender: {
      type: Boolean,
      default: true,
    },
    // style: PropsTypes.object,
    disabled: {
      type: Boolean,
      default: false,
    },
    prefixCls: String,
    customRequest: Function,
    withCredentials: Boolean,
    openFileDialogOnClick: {
      type: Boolean,
      default: true
    },
    previewFile: Function,
    transformFile: Function,
    onChange: Function,
    onPreview: Function,
    onRemove: Function,
    onDownload: Function,
    'onUpdate:fileList': Function,
  },
  setup(props, context) {
    return {
      slots: computed(() => Object.keys(context.slots)),
    }
  },
})
</script>

<style scoped>

</style>