<template>
  <div class="zoomScreen" @click="handleFullScreen">
    <el-tooltip effect="dark" :content="fullscreen ? `取消全屏` : `全屏`" placement="bottom" >
      <i class="el-icon-full-screen"></i>
    </el-tooltip>
  </div>
</template>

<script>
export default {
  name: 'ZoomScreen',
  props: {
  },
  data () {
    return {
      fullscreen: false
    }
  },
  methods: {
    // 全屏事件
    handleFullScreen() {
        let element = document.documentElement;
        if (this.fullscreen) {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitCancelFullScreen) {
                document.webkitCancelFullScreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
        } else {
            if (element.requestFullscreen) {
                element.requestFullscreen();
            } else if (element.webkitRequestFullScreen) {
                element.webkitRequestFullScreen();
            } else if (element.mozRequestFullScreen) {
                element.mozRequestFullScreen();
            } else if (element.msRequestFullscreen) {
                // IE11
                element.msRequestFullscreen();
            }
        }
        this.fullscreen = !this.fullscreen;
    }
  }
}
</script>

<style lang="less">
  .zoomScreen {
    width: 66px;
    height: 100%;
    text-align: center;
    cursor: pointer;
    font-size: 22px;
    &:hover {
      background-color: @boldBgcolor;
    }
  }
</style>
