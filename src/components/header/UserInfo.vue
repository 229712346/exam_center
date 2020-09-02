<template>
  <div class="userinfo">
    <!-- icon="el-icon-user-solid" -->
    <el-avatar size="medium" shape="square">{{ userName.substr(0,1).toUpperCase() }}</el-avatar>
    <el-divider direction="vertical"></el-divider>
    <el-popover
      placement="bottom"
      width="150px"
      trigger="hover"
    >
      <div slot="reference">
        <span>{{ userName }}</span>
        <i class="el-icon-caret-bottom"/>
      </div>
      <div style="textAlign: center">
        <div @click="editPassword = true" :style="password" class="dropdownitem">修改密码</div>
        <div @click="signout()" :style="password" class="dropdownitem">退出登录</div>
      </div>
    </el-popover>

    <el-dialog :visible.sync="editPassword" width="480px" :show-close="false" title="修改密码"
               :close-on-click-modal="false">
      <div class="dialog_cont">
        <el-form ref="form" label-position="left" :model="form" status-icon label-width="100px" :rules="rules">
          <el-form-item label="旧密码" prop="oldPassward">
            <el-input v-model="form.oldPassward" size="small" prefix-icon="el-icon-document-checked"
                      show-password></el-input>
          </el-form-item>
          <el-form-item label="新密码" prop="passward">
            <el-input v-model="form.passward" size="small" prefix-icon="el-icon-document-remove"
                      show-password></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="surePassward">
            <el-input v-model="form.surePassward" size="small" prefix-icon="el-icon-document-checked"
                      show-password></el-input>
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
    import {updatePwd} from "../../api/uploadPwd";

    export default {
        name: 'UserInfo',
        props: {
            userName: String
        },
        data() {
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
                    id: '',
                    oldPwd: '',
                    newPwd: '',
                },
                rules: {
                    oldPassward: [ // 输入框
                        {required: true, message: '请输入旧密码', trigger: 'blur'}
                    ],
                    passward: [
                        {required: true, validator: passOne, trigger: 'blur'}
                    ],
                    surePassward: [
                        {required: true, validator: passTwo, trigger: 'blur'}
                    ]
                },

            }
        },
        computed: {
            // 更新密码请求参数
            updatePwdParams: {
                get: function () {
                    const data = {
                        id: '',
                        oldPwd: this.form.oldPassward,
                        newPwd: this.form.passward,
                    }
                    return data;
                }
            }
        },
        methods: {
            // 消息提示
            tip(message, type, time) {
                this.$message({
                    message: message,
                    type: type,
                    duration: time
                })
            },
            // 通过调用接口来获取信息数量
            // 表单验证的关闭和提交验证
            form_no(form) {
                // clearValidate 只是移除检验的结果
                this.$refs[form].resetFields()
                this.editPassword = false

            },
            form_yes(form) {
                this.$refs[form].validate((valid) => {
                    if (valid) {
                        this.editPassword = false;
                        let userId = sessionStorage.getItem('userId') !== null ? atob(sessionStorage.getItem('userId')) : ''
                        if (userId === '') {
                            this.tipUpdatePwd('用户id为空，无法修改密码', 'warning', '2000');
                            return false;
                        }
                        let data = {
                            id: userId,
                            oldPwd: this.form.oldPassward,
                            newPwd: this.form.passward,
                        }
                        console.log(data);
                        updatePwd(data).then(res => {

                            setTimeout(() => {
                                if ('成功' === res.msg) {
                                    this.tip(res.msg, 'success', '3000')
                                } else {
                                    this.tip(res.msg, 'warning', '3000')
                                }
                            }, 600)
                        }).catch(() => {

                        })
                    } else {
                        return false
                    }
                })
            },

            // 退出登录
            signout() {
                sessionStorage.clear()
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
    min-width: 140px;
    display: flex;
    justify-content: space-around;
    align-items: center;
    cursor: pointer;
    padding: 0 10px;

    &:hover {
      background-color: @boldBgcolor;
    }

    .el-dialog__header {
      padding: 0 10px;
    }

    .dialog_cont {
      padding: 0 20px;
    }

    .el-dialog__footer {
      padding: 0 10px;

      .dialog-footer {
        padding: 0 20px;
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
