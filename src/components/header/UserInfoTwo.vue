<template>
  <div class="userinfo">
    <!-- icon="el-icon-user-solid" -->
    <!-- <el-avatar shape="square">{{ userName.substr(0,1).toUpperCase() }}</el-avatar> -->
    <div class="logo">
      <div class="logo_inside">
        <i class="material-icons">&#xe8ab;</i>
      </div>
    </div>
    <div>
      <el-popover placement="bottom" width="150px" trigger="hover" >
        <div slot="reference">
          <span>{{ userName }}</span>
          <i class="el-icon-caret-bottom" />
        </div>
        <div style="textAlign: center">
          <!-- <div @click="editPassword = true" :style="password" class="dropdownitem">修改密码</div> -->
          <div @click="signout()" :style="password" class="dropdownitem">退出登录</div>
        </div>
      </el-popover>
      <p>信息员</p>
    </div>
      

    <el-dialog :visible.sync="editPassword" width="480px" :show-close="false" title="修改密码" :close-on-click-modal="false">
      <div class="dialog_cont">
        <el-form ref="form" label-position="left" :model="form" status-icon label-width="100px" :rules="rules">
          <el-form-item label="旧密码" prop="oldPassward">
            <el-input v-model="form.oldPassward" size="small" prefix-icon="el-icon-user" suffix-icon="el-icon-more"></el-input>
          </el-form-item>
          <el-form-item label="新密码" prop="passward">
            <el-input v-model="form.passward" size="small" prefix-icon="el-icon-document-remove" show-password></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="surePassward">
            <el-input v-model="form.surePassward" size="small" prefix-icon="el-icon-document-checked" show-password></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" plain size="small" @click="form_no('form')">取消</el-button>
        <el-button type="primary" size="small" @click="form_yes('form')">确认修改</el-button>
      </div>
    </el-dialog>
  </div>

</template>

<script>
export default {
  name: 'UserInfoTwo',
  props: {
    userName: String,
    userId: String
  },
  data () {
    var passOne = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.form.passward !== '') {
          this.$refs.form.validateField('checkPass')
        }
        callback()
      }
    }
    var passTwo = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.form.passward) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      // 弹框控制
      editPassword: false,
      // 密码的样式
      password: {
        cursor: 'pointer',
        fontSize: '20px;',
        fontWeight: '500',
        color: '#3a4a5a',
        margin: '5px 0px',
        padding: '5px 0px'
      },
      // 表单数据
      form: {
        oldPassward: '',
        passward: '',
        surePassward: ''
      },
      rules: {
        oldPassward: [ // 输入框
          { required: true, message: '请输入旧密码', trigger: 'blur' }
        ],
        passward: [
          { required: true, validator: passOne, trigger: 'blur' }
        ],
        surePassward: [
          { required: true, validator: passTwo, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 消息提示
    tip (message, type, time) {
      this.$message({
        message: message,
        type: type,
        duration: time
      })
    },

    // 通过调用接口来获取信息数量
    // 表单验证的关闭和提交验证
    form_no (form) {
      // clearValidate 只是移除检验的结果
      this.$refs[form].resetFields()
      this.editPassword = false
      setTimeout(() => { this.tip('取消修改', 'warning', '2000') }, 200)
    },
    form_yes (form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          this.editPassword = false
          setTimeout(() => { this.tip('修改成功', 'success', '2000') }, 200)
        } else {
          return false
        }
      })
    },

    // 退出登录
    signout () {
      this.$router.replace({
        path: '/'
      })
    }
  }
}
</script>

<style lang="less">
  .userinfo {
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    cursor: pointer;
    .logo {
      width: 64px;
      height: 64px;
      background-color: rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      position: relative;
      .logo_inside {
        width: 48px;
        height: 48px;
        background-color: #ffffff;
        border-radius: 50%;
        position: absolute;
        top: 8px;
        left: 8px;
        text-align: center;
        color: #3a4a5a;
        font-weight: 500;
        padding: 12px;
        box-sizing: border-box;
      }
    }
    p {
      margin: 0px;
      display: inline-block;
      background-color: rgba(255, 255, 255, 0.2);
      border-radius: 3px;
      color: #adbbca;
      margin-top: 3px;
      padding: 2px 10px;
      font-size: 14px;
      font-weight: 300;
      transform: translate(-10px,0);
    }
    .el-dialog__header {
      padding: 20px 10px;
    }
    .dialog_cont {
      padding: 0 20px;
    }
    .el-dialog__footer {
      padding: 0 10px;
      .dialog-footer {
        padding: 20px;
        border-top: 1px solid @borderColor;
      }
    }
  }
  .dropdownitem {
    border-radius: 3px;
    &:hover {
      background-color: #eceff2;
    }
  }
</style>
