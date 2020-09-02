<template>
  <div class="badgeinfo" @click="toPage">
    <el-tooltip effect="dark" :content="infoNum + '条未读信息'" placement="bottom" >
      <el-badge :value="infoNum" :max="99">
       <i class="el-icon-message-solid" />
      </el-badge>
    </el-tooltip>
  </div>
</template>

<script>
export default {
  name: 'NewsInfo',
  props: {
  },
  data () {
    return {
      infoNum: 8
    }
  },
  methods: {
    // 通过调用接口来获取信息数量
    toPage () {
      this.$router.push(
        {
          name: 'Infomation'
        }
      )
    }
  }
}
</script>

<style lang="less">
  .badgeinfo {
    width: 66px;
    height: 100%;
    text-align: center;
    cursor: pointer;
    .el-badge {
      width: 33px;
      height: 33px;
      text-align: center;
      line-height: 33px;
      font-size: 24px;
    }
    &:hover {
      background-color: @boldBgcolor;
    }
  }
</style>
