<template>
  <a-input-number class="smartui-number-input">
  </a-input-number>
</template>

<script>
export default {
  name: 'XInputNumber',
}
</script>

<style lang="scss">
.smartui-number-input {
  margin-left: 46px;
  margin-right: 46px;
  width: 120px;
  height: 36px;
  border-radius: 4px;

  .ant-input-number-handler-wrap {
    opacity: 1;
    background: transparent;
    width: 100%;
    border: none;
  }

  .ant-input-number-handler {
    width: 36px;
    height: 36px !important;
    border: 1px solid #282B2E;
    border-radius: 4px;
    top: -1px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #282B2E;

    .anticon {
      display: none;
    }

    &-up {
      position: absolute;
      left: calc(100% + 10px);

      &:after {
        content: '+'
      }
    }

    &-down {
      position: absolute;
      left: -46px;

      &:after {
        content: '-'
      }
    }
  }
}
</style>
