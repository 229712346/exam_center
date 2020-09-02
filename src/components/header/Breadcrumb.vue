<template>
  <div class="title">
    <div class="breadcrumb">
      <div class="breadcrumb-item" v-for="(item, index) in breadcrumb" :key="index" @click="toJump(index, item)">
        {{item.meta.title}} 
        <span v-if="index !== (breadcrumb.length - 1)">/</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Breadcrumb',
  props: {
    breadcrumb: {
      type: Array,
      required: true,
      default: []
    }
  },
  data() {
    return {
      // 用来保存每一点击的是哪一项
      clickItem: 'Home'
    }
  },

  // mounted () {
  //   this.$route.matched.map(item => {
  //     this.breadcrumb.push(item)
  //   })
  // },
  // watch: {
  //   '$route' (to, from) {
  //     this.breadcrumb.splice(0)
  //     to.matched.map(item => {
  //       this.breadcrumb.push(item)
  //     })
  //   }
  // },
  // 需要在父页面来监听路由的变化

  methods: {
    toJump (index, item) {
      // console.log(index, item, this.breadcrumb.length - 1)
      // console.log(item)
      // console.log(this.$route)
      // 如果本次点击和上一次点击相同,则不会执行跳转,点击最后一个面包屑不会跳转
      if(index !== (this.breadcrumb.length - 1)) {
        this.$router.replace({
          path: item.path
        })
      }
      this.clickItem = item.name
    },
  }
}
</script>

<style lang="less">
.title {
  display: inline-block;
  height: 100%;
  margin-left: 60px;
  padding-left: 10px;
  .breadcrumb {
    height: 100%;
    display: flex;
    align-items: center;
    font-size: 14px;
    .breadcrumb-item {
      &:nth-last-child(n+2) {
        color: #ffffff;
        margin: 0 5px;
        font-weight: 500;
        cursor: pointer;
        &:hover {
          color: #409eff;
        }
      }
    }
    span {
      color: #8E8E8F;
    }
  }
}
</style>
