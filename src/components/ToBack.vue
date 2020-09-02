<template>
  <div class="toback" v-show="showTop">
    <i :class="msg" @click="scrollToY(0, 1500, 'easeInOutQuint')"></i>
  </div>
</template>

<script>
window.requestAnimFrame = (function () {
  return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame ||
    function (callback) {
      window.setTimeout(callback, 1000 / 60)
    }
})()
export default {
  name: 'ToBack',
  props: {
    id: {
      type: Number,
      default: () => {
        return 0
      }
    }
  },
  data () {
    return {
      msg: 'el-icon-top',
      scrollTop: 0
    }
  },
  computed: {
    showTop: function () {
      return this.scrollTop > 200
    }
  },
  mounted () {
    window.addEventListener('scroll', this.getScrollTop)
  },
  methods: {
    scrollToY (scrollTargetY, speed, easing) {
      // scrollTargetY: the target scrollY property of the window
      // speed: time in pixels per second
      // easing: easing equation to use

      let scrollY = window.scrollY || document.documentElement.scrollTop
      scrollTargetY = scrollTargetY || 0
      speed = speed || 2000
      easing = easing || 'easeOutSine'
      let currentTime = 0
      // min time .1, max time .8 seconds
      let time = Math.max(0.1, Math.min(Math.abs(scrollY - scrollTargetY) / speed, 0.8))

      // easing equations from https://github.com/danro/easing-js/blob/master/easing.js
      let easingEquations = {
        easeOutSine: function (pos) {
          return Math.sin(pos * (Math.PI / 2))
        },
        easeInOutSine: function (pos) {
          return (-0.5 * (Math.cos(Math.PI * pos) - 1))
        },
        easeInOutQuint: function (pos) {
          if ((pos /= 0.5) < 1) {
            return 0.5 * Math.pow(pos, 5)
          }
          return 0.5 * (Math.pow((pos - 2), 5) + 2)
        }
      }

      // add animation loop
      function tick () {
        currentTime += 1 / 60
        let p = currentTime / time
        let t = easingEquations[easing](p)
        if (p < 1) {
          window.requestAnimFrame(tick)
          window.scrollTo(0, scrollY + ((scrollTargetY - scrollY) * t))
        } else {
          window.scrollTo(0, scrollTargetY)
        }
      }
      // call it once to get started
      tick()
    },
    getScrollTop () {
      this.scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
    }
  }
}
</script>

<style lang="less" scoped>
.toback {
  width: 40px;
  height: 40px;
  position: fixed;
  right: 30px;
  bottom: 50px;
  text-align: center;
  line-height: 42px;
  font-size: 22px;
  color: #3a4a5a;
  font-weight: 900;
  border-radius: 5px;
  cursor: pointer;
  background-color: #ffffff;
  z-index: 100;
  box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
}
</style>
