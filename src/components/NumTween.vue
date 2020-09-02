<template>
  <div class="numtween">
      {{numtween}}
  </div>
</template>

// 使用的时候直接传入默认的值,可以有过渡效果 <num-tween :deflate-num="number"/>
<script>
import TWEEN from '@tweenjs/tween.js' // 数字缓存过渡
export default {
  name: 'NumTween',
  props: {
    deflateNum: [String, Number]
  },
  data () {
    return {
      numtween: 0
    }
  },
  watch: { // 监听
    deflateNum (newValue, oldValue) {
      new TWEEN.Tween({
        number: oldValue
      })
        .to({
          number: newValue
        }, 900)
        .onUpdate(tween => {
          this.numtween = tween.number.toFixed(0)
        })
        .start()
      function animate () {
        if (TWEEN.update()) {
          requestAnimationFrame(animate)
        }
      }
      animate()
    }
  }
}
</script>

<style>
.numtween {
    font-size: 22px;
    color: brown;
}
</style>
