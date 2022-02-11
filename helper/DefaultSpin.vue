<template>
  <div class="loadingio-spinner-double-ring-0n4oczukkohd">
    <div class="ldio-4oij86wskfe">
      <div></div>
      <div></div>
      <div>
        <div></div>
      </div>
      <div>
        <div></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'DefaultSpin',
  components: {},
  props: {},
  emits: [],
  setup() {
    return {}
  },
})
</script>

<style lang="scss">
@keyframes ldio-4oij86wskfe {
  0% {
    transform: rotate(0)
  }
  100% {
    transform: rotate(360deg)
  }
}

.ldio-4oij86wskfe div {
  box-sizing: border-box !important
}

.ldio-4oij86wskfe > div {
  position: absolute;
  width: 74px;
  height: 74px;
  top: 13px;
  left: 13px;
  border-radius: 50%;
  border: 10px solid #000;
  border-color: #336cff transparent #336cff transparent;
  animation: ldio-4oij86wskfe 1.2s linear infinite;
}

.ldio-4oij86wskfe > div:nth-child(2), .ldio-4oij86wskfe > div:nth-child(4) {
  width: 52px;
  height: 52px;
  top: 24px;
  left: 24px;
  animation: ldio-4oij86wskfe 1s linear infinite reverse;
}

.ldio-4oij86wskfe > div:nth-child(2) {
  border-color: transparent #f5991b transparent #f5991b
}

.ldio-4oij86wskfe > div:nth-child(3) {
  border-color: transparent
}

.ldio-4oij86wskfe > div:nth-child(3) div {
  position: absolute;
  width: 100%;
  height: 100%;
  transform: rotate(45deg);
}

.ldio-4oij86wskfe > div:nth-child(3) div:before, .ldio-4oij86wskfe > div:nth-child(3) div:after {
  content: "";
  display: block;
  position: absolute;
  width: 10px;
  height: 10px;
  top: -10px;
  left: 22px;
  background: #336cff;
  border-radius: 50%;
  box-shadow: 0 64px 0 0 #336cff;
}

.ldio-4oij86wskfe > div:nth-child(3) div:after {
  left: -10px;
  top: 22px;
  box-shadow: 64px 0 0 0 #336cff;
}

.ldio-4oij86wskfe > div:nth-child(4) {
  border-color: transparent;
}

.ldio-4oij86wskfe > div:nth-child(4) div {
  position: absolute;
  width: 100%;
  height: 100%;
  transform: rotate(45deg);
}

.ldio-4oij86wskfe > div:nth-child(4) div:before, .ldio-4oij86wskfe > div:nth-child(4) div:after {
  content: "";
  display: block;
  position: absolute;
  width: 10px;
  height: 10px;
  top: -10px;
  left: 11px;
  background: #f5991b;
  border-radius: 50%;
  box-shadow: 0 42px 0 0 #f5991b;
}

.ldio-4oij86wskfe > div:nth-child(4) div:after {
  left: -10px;
  top: 11px;
  box-shadow: 42px 0 0 0 #f5991b;
}

.loadingio-spinner-double-ring-0n4oczukkohd {
  width: 60px;
  height: 60px;
  display: inline-block;
  overflow: hidden;
  background: transparent;
}

.ldio-4oij86wskfe {
  width: 100%;
  height: 100%;
  position: relative;
  transform: translateZ(0) scale(0.6);
  backface-visibility: hidden;
  transform-origin: 0 0; /* see note above */
}

.ldio-4oij86wskfe div {
  box-sizing: content-box;
}
</style>
