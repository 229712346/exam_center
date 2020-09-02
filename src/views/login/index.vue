<template>
  <div class="login_box">
    <transition appear enter-active-class="animated fadeInRight">
      <div class="login">
        <p>欢迎登录</p>
        <el-form ref="form" label-position="left" :model="form" :rules="rules" status-icon label-width="90px">
          <el-form-item label="用户名字" prop="username">
            <el-input v-model="form.username" placeholder="请输入用户名" @keyup.enter.native="login('form')" prefix-icon="el-icon-user" suffix-icon="el-icon-more"></el-input>
          </el-form-item>
          <el-form-item label="输入密码" prop="password">
            <el-input v-model="form.password" placeholder="请输入密码" @keyup.enter.native="login('form')" prefix-icon="el-icon-document-remove" show-password></el-input>
          </el-form-item>
          <el-form-item>
            <el-checkbox v-model="isRember">记住密码</el-checkbox>
          </el-form-item>
        </el-form>
        <div class="top"><el-button type="danger" plain size="small" @click="login('form')">{{ msg }}</el-button></div>
      </div>
    </transition>
  </div>
</template>

<script>
import { login } from '@/api/common.js'
export default {
  name: 'Login',
  data () {
    return {
      msg: '登 录',

      isRember: false,
      form: {
        username: '',
        password: ''
      },
      rules: {
        username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
      }
    }
  },
  computed: {
    loginParams: {
      get: function() {
        const obj = {
          managerName: this.form.username,
          managerPwd: this.form.password
        }
        return obj
      }
    }
  },
  created () {
    this.getCookie()
  },
  methods: {
      // 提示信息
      tip(message, type, time) {
          this.$message({
              message: message,
              type: type,
              duration: time
          })
      },
    login (form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          if (this.isRember) {    // 如果选中了记住密码的选项
            this.setCookie(this.form.username, this.form.password, 1)  // 则去设置cookie,username是要提交的用户名，password是密码，7是要存储的天数
          } else {
            this.clearCookie()  // 如果没有选中记住密码，那就清除cookie
          }
          login(this.loginParams).then(res => {

              // console.log(res.data.msg +"=================");
              if('成功' === res.data.msg){
                  const obj = {
                      role: res.data.data.power,
                      userId: res.data.data.uid,
                      token: res.data.data.accessToken,
                      userName: this.form.username
                  }
                  this.$store.dispatch('setUserRole', obj)
                  sessionStorage.setItem('isLogin', true)
                  this.$router.replace({
                      path: '/home'
                  })
              }else{
                  this.tip(res.data.msg, 'warning', '3000')
              }

          })
        } else {
          return false
        }
      })
    },

    // 设置cookie
    setCookie (c_name, c_pwd, exdays) {
      var exdate = new Date() // 获取时间
      exdate.setTime(exdate.getTime() + 24 * 60 * 60 * 1000 * exdays) // 保存的天数
      // 字符串拼接cookie
      window.document.cookie = 'username' + '=' + c_name + ';path=/;expires=' + exdate.toGMTString()
      // expires是设置cookie的过期时间，toGMTString是将日期转为GMT的字符串进行拼接
      window.document.cookie = 'password' + '=' + c_pwd + ';path=/;expires=' + exdate.toGMTString()
    },
    // 清除cookie
    clearCookie: function () {
      this.setCookie('', '', -1) // 修改2值都为空，天数为负1天就好了
    },
    // 读取cookie  将用户名和密码回显到input框中喽~~
    getCookie: function () {
      if (document.cookie.length > 0) {
        this.isRember = true
        var arr = document.cookie.split('; ') // 这里显示的格式需要切割一下自己可输出看下
        for (var i = 0; i < arr.length; i++) {
          var arr2 = arr[i].split('=') // 再次切割
          // 判断查找相对应的值
          if (arr2[0] == 'username') {
            this.form.username = arr2[1] // 保存到保存数据的地方 （data中）
          } else if (arr2[0] == 'password') {
            this.form.password = arr2[1]
          }
        }
      }
    }
  }
}
</script>

<style lang='less' scoped>
.login_box {
  width: 100%;
  height: 100%;
  background-color: @boldBgcolor;
  background-size: cover;
  position: relative;
  user-select: none;
  // background-position: center;
  .login {
    width: 560px;
    height: 360px;
    border-radius: 5px;
    overflow: hidden;
    background-color: #ffffff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    margin: auto;
    margin-left: 50%;
    .el-form {
      width: 60%;
      height: 80%;
      margin: auto;
      margin-top: 100px;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
    }
    p {
      position: absolute;
      left: 0;
      right: 0;
      text-align: center;
      font-size: 24px;
      color: @textColor;
    }
  }
  .top {
    width: 100%;
    height: 52px;
    line-height: 52px;
    text-align: center;
    background-color: #eeeeee;
    position: absolute;
    bottom: 0px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
    .el-button {
      width: 130px;
    }
    :hover {
      width: 90px;
    }
  }
}
</style>
