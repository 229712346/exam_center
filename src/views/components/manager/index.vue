<template>
  <div class="first">
    <!-- 内容 -->
    <div class="pagecontent">
      <!-- 顶部按钮 -->
      <div class="headerbtn">
        <el-input v-model="findName" size="small" clearable placeholder="请输入管理员名称" @keyup.enter.native="findList()"
                  maxlength="15"
                  show-word-limit></el-input>
        <el-button size="small" type="primary" :loading="isLoading" @click="findList()">查询</el-button>
        <el-button size="small" type="primary" @click="addManager()">添加管理员</el-button>
      </div>
      <!-- 表格 -->
      <div class="tablelist">
        <el-table :data="tableData" stripe border v-loading="isLoading">
          <el-table-column header-align="center" align="center" label="序号" type="index" width="70">
            <template slot-scope="scope">
              <span>{{ (currentPage - 1) * size + scope.$index + 1 }}</span>
            </template>
          </el-table-column>
          <el-table-column label="管理员名称" prop="managerName" header-align="center" align="center"/>
          <el-table-column label="角色" prop="power" header-align="center" align="center">
            <template slot-scope="scope">
              <el-tag type="success" v-if="scope.row.power === 5">设置试卷</el-tag>
              <el-tag type="danger" v-if="scope.row.power === 10">考试阅卷</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" header-align="center" align="center">
            <template slot-scope="scope">
              <el-popconfirm icon="el-icon-info" iconColor="red" title="是否重置密码?" @onConfirm="resetPwd(scope.row.id)"
                             style="marginLeft: 10px">
                <el-button slot="reference" size="small" type='success'>重置密码</el-button>
              </el-popconfirm>
              <el-button size="small" type='warning' style="marginLeft: 10px"
                         @click="tableEdit(scope.$index, scope.row )">修改
              </el-button>
              <el-popconfirm icon="el-icon-info" iconColor="red" title="是否删除?" @onConfirm="tableDelete(scope.row.id)"
                             style="marginLeft: 10px">
                <el-button slot="reference" size="small" type='danger'>删除</el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!-- 分页 hide-on-single-page-->
    <el-pagination
      class="pagination"
      v-if="totalRecord"
      :page-sizes="[10, 20, 30, 50]"
      :page-size="size"
      :current-page="currentPage"
      :total="totalRecord"
      background
      layout=" total, sizes, prev, pager, next, jumper"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <!-- 添加修改弹框 -->
    <el-dialog :visible.sync="isDialog" width="730px" top="5vh" :title="saveOrEdit === 1 ? '添加管理员' : '管理员修改'"
               :show-close="false" :close-on-click-modal="false">
      <div class="dialog_cont">
        <el-form ref="formManager" label-position="right" :model="formManager" status-icon label-width="70px" :rules="rules">
          <el-form-item label="名称:" prop="managerName">
            <el-input v-model="formManager.managerName" size="small" style="width: 60%" maxlength="15" show-word-limit></el-input>
            <span style="marginLeft: 30px; color: #3a4a5a; fontWeight: 500">{{pwd}}</span>
          </el-form-item>
          <el-form-item label="角色:" prop="power">
            <el-select v-model="formManager.power" size="small" style="width: 60%" placeholder="请选择角色" @change="powerChange">
              <el-option v-for="item in powerList" :label="item.label" :value="item.value" :key="item.value"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="科目:" v-if="formManager.power === 5" style="minHeight: 400px">
            <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选
            </el-checkbox>
            <el-checkbox-group v-model="formManager.subjectList" @change="handleCheckedCitiesChange">
              <el-checkbox style="width: 30%; margin: 0 2% 0 0" v-for="subItem in subjectList" :label="subItem.id"
                           :key="subItem.id">{{ subItem.subjectName }}
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="试卷:" v-if="formManager.power === 10">
            <el-tree ref="tree" :data="subjectList" show-checkbox node-key="id" :default-checked-keys="defList"
                     :props="defaultProps" @check="treeChange"></el-tree>
          </el-form-item>

        </el-form>
        <div slot="footer" class="dialog-footer" style="textAlign: right">
          <el-button @click="dialogFalse('formManager')" size="small">取 消</el-button>
          <el-button type="primary" @click="dialogTrue('formManager')" size="small">确 定</el-button>
        </div>
      </div>

    </el-dialog>
  </div>
</template>

<script>
    import {
        getSubjectList,
        getManagerList,
        addManager,
        editManager,
        deleteManager,
        defaultPwd,
        resetPwd
    } from '@/api/manager.js'

    export default {
        name: 'Manager',
        data() { // 存放数据
            return {
                msg: '管理员管理',
                // 加载
                isLoading: true,
                // 查询条件
                findName: '',

                // 表格数据
                tableData: [],
                totalRecord: 0, // 初始共00条数据，其实没有，等接口返回,总条数
                size: 10, // 每页的数据条数
                currentPage: 1, // 当前导航页数的默认页数
                powerList: [
                    {
                        value: 5,
                        label: '设置试卷'
                    }, {
                        value: 10,
                        label: '考试阅卷'
                    }
                ],

                // 添加和修改弹框
                isDialog: false,
                saveOrEdit: 1,
                formManager: {
                    pwd: '',
                    managerName: '',
                    power: 5,
                    subjectList: []
                },
                rules: {
                    managerName: [
                        {required: true, message: '请输入管理员', trigger: 'blur'}
                    ],
                    power: [
                        {required: true, message: '请选择角色', trigger: 'blur'}
                    ],
                    subjectList: [
                        {required: true, message: '请选择科目', trigger: 'change'}
                    ]
                },

                editId: '',
                pwd: '',
                isFirst: true,

                subjectList: [], // 科目列表
                isIndeterminate: false, // 是否shezhi全选
                checkAll: false, // 全选按钮是否选中
                subjectIdList: [], // 全选
                treeList: [], // 试卷选中列表tree
                defList: [], // 数列表默认选中,回显
                isHave: true,
                defaultProps: {
                    children: 'paperList',
                    label: 'subjectName'
                }
            }
        },
        computed: {
            // 列表请求参数
            listParams: {
                get: function () {
                    const data = {
                        managerName: this.findName,
                        pageSize: this.size.toString(),
                        pageNumber: this.currentPage.toString()
                    }
                    return data
                }
            },
            // 添加
            addParams: {
                get: function () {
                    const data = {
                        managerName: this.formManager.managerName,
                        power: this.formManager.power,
                        operateId: this.formManager.power === 5 ? this.formManager.subjectList.toString() : this.treeList.toString()
                    }
                    return data
                }
            },
            // 修改参数
            editParams: {
                get: function () {
                    const data = {
                        id: this.editId,
                        managerName: this.formManager.managerName,
                        power: this.formManager.power,
                        operateId: this.formManager.power === 5 ? this.formManager.subjectList.toString() : this.treeList.toString()
                    }
                    return data
                }
            }
        },
        created() {
            this.getList()
            this.getDefaultPwd()
        },
        methods: {
            tip(message, type, time) {
                this.$message({
                    message: message,
                    type: type,
                    duration: time
                })
            },
            // 获取默认密码
            getDefaultPwd() {
                let defaultPwdParams = {
                    type: '0'
                }
                defaultPwd(defaultPwdParams).then(res => {
                    if (res.msg === '成功') {
                        const pwd = res.data.pwd
                        if (pwd) {
                            this.pwd = '默认密码为：' + pwd
                        }
                    } else {
                        this.tip(res.msg, 'warning', '3000')
                    }
                }).catch(() => {
                    setTimeout(() => {
                        this.isLoading = false
                    }, 500)
                }).finally(() => {
                    setTimeout(() => {
                        this.isLoading = false;
                    }, 500)
                });
            },
            // 重置密码
            resetPwd(id) {
                let resetPwdParams = {
                    id: id
                }
                this.isLoading = true
                resetPwd(resetPwdParams).then(res => {
                    this.isLoading = false

                    if (res.msg === '成功') {
                        const pwd = res.data.pwd
                        this.$alert('新密码为：' + pwd, '重置密码成功', {
                            confirmButtonText: '确定',
                            callback: action => {

                            }
                        })
                    } else {
                        this.tip(res.msg, 'warning', '3000')
                    }
                }).finally(() => {
                    setTimeout(() => {
                        this.isLoading = false;
                    }, 500)
                });
            },

            // 管理员列表
            getList() {
                this.tableData = []
                if (this.isFirst) {
                    this.currentPage = 1
                }
                getManagerList(this.listParams).then(res => {
                    setTimeout(() => {
                        this.isLoading=false;
                        if (res.msg === '成功') {
                            if (res.data.totalRecord > 0) {
                                this.tableData = res.data.list
                                this.totalRecord = res.data.totalRecord
                            }
                        } else {
                            this.tip(res.msg, 'warning', '1000')
                        }
                    }, 500);
                }).catch(() => {
                }).finally(() => {
                    setTimeout(() => {
                        this.isLoading = false;
                        this.isFirst = false;
                    }, 500);

                })
            },
            // 分页
            handleSizeChange(e) {
                this.isLoading = true
                this.size = e
                this.getList()
            },
            handleCurrentChange(e) {
                this.isLoading = true
                this.currentPage = e
                this.getList()
            },

            // 查询
            findList() {
                this.isLoading = true
                this.isFirst = true
                this.getList()
            },
            // 表格删除
            tableDelete(id) {
                this.isLoading = true
                const data = {id: id}
                deleteManager(data).then(res => {
                    if (res.msg === '成功') {
                        this.tip(res.msg, 'success', '3000')
                    } else {
                        this.tip(res.msg, 'warning', '3000')
                    }
                    this.getList()
                    this.clearInfo()
                    this.getSubjectList()
                }).finally(() => {
                    setTimeout(() => {
                        this.isLoading = false;
                    }, 500);
                });
            },

            // 获取科目
            getSubjectList() {
                const data = {}
                getSubjectList(data).then(res => {
                    if ('成功' === res.msg) {
                        this.subjectList = res.data.list;
                        this.subjectList.map(item => {
                            this.subjectIdList.push(item.id)
                            item.paperList.map(items => {
                                items.subjectName = items.paperName
                            })
                        })
                        // console.log('huo qu', this.subjectList)
                    }
                }).finally(() => {
                    setTimeout(() => {
                        this.isLoading = false;
                    }, 500)
                });
            },
            // 角色变化
            powerChange() {
                // this.formManager.subjectList = []
                // this.isIndeterminate = false
                // this.checkAll = false
            },

            // tree
            treeChange(value) {
                if (!value.hasOwnProperty('paperList')) {
                    this.treeList.includes(value.id) ? this.treeList.splice(this.treeList.indexOf(value.id), 1) : this.treeList.push(value.id)
                } else {
                    this.isHave = true
                    value.paperList.map(item => {
                        if (!this.treeList.includes(item.id)) this.isHave = false
                    })
                    if (this.isHave) {
                        // console.log('dou xuan zhong')
                        value.paperList.map(item => {
                            this.treeList.splice(this.treeList.indexOf(item.id), 1)
                        })
                    } else {
                        // console.log('mei xuan quan', this.treeList)
                        value.paperList.map(item => {
                            if (!this.treeList.includes(item.id)) this.treeList.push(item.id)
                        })
                    }
                }
                // console.log(this.treeList)
            },
            // 全选
            handleCheckAllChange(val) {
                this.formManager.subjectList = val ? this.subjectIdList : []
                this.isIndeterminate = false
            },
            handleCheckedCitiesChange(value) {
                let checkedCount = value.length
                this.checkAll = checkedCount === this.subjectList.length
                this.isIndeterminate = checkedCount > 0 && checkedCount < this.subjectList.length;
            },

            // 添加管理员/修改管理员
            clearInfo() {
                this.formManager.managerName = ''
                this.formManager.power = 5
                this.formManager.subjectList = []
                this.isIndeterminate = false
                this.checkAll = false
                this.defList = []
                this.treeList = []
                // console.log(this.formManager)
            },
            addManager() {
                this.isDialog = true
                this.saveOrEdit = 1
                this.subjectIdList = []
                this.getSubjectList()
            },
            tableEdit(index, row) {
                // 获得科目
                this.subjectIdList = []
                this.getSubjectList()

                this.saveOrEdit = 0
                this.editId = row.id
                // 基本数据回显
                this.formManager = {
                    managerName: row.managerName,
                    power: row.power,
                    subjectList: []
                }
                // shehzi kemu
                if (this.formManager.power === 5) {
                    // console.log(row)
                    row.operateId.split(',').map(item => {
                        this.formManager.subjectList.push(parseInt(item))
                    })
                    const data = {}
                    getSubjectList(data).then(res => {
                        if ('成功' === res.msg) {
                            let list = res.data.list;
                            this.isIndeterminate = this.formManager.subjectList.length > 0 && this.formManager.subjectList.length < list.length
                            this.checkAll = this.formManager.subjectList.length.toString() === list.length.toString()
                        }
                    })
                }
                // yuejuan
                if (this.formManager.power === 10) {
                    // console.log('2')
                    row.operateId.split(',').map(item => {
                        this.defList.push(parseInt(item))
                    })
                    this.treeList = this.defList
                }

                this.isDialog = true
            },
            dialogFalse(formManager) {
                this.isDialog = false
                this.$refs[formManager].resetFields()
                this.clearInfo()
            },
            dialogTrue(formManager) {
                this.isLoading = true
                this.$refs[formManager].validate((valid) => {
                    if (valid) {
                        if (this.formManager.power === 10 && this.treeList.length === 0) {
                            this.tip('请选择试卷', 'warning', '1000')
                            this.isLoading = false
                        } else {
                            const text = this.saveOrEdit === 1 ? '添加成功' : '修改成功'
                            if (this.saveOrEdit === 1) {
                                addManager(this.addParams).then(res => {
                                    this.isDialog = false
                                    this.clearInfo()
                                    this.getList()
                                    setTimeout(() => {
                                        if (res.msg === '成功') {
                                            this.tip(text, 'success', '3000')
                                        } else {
                                            this.tip(res.msg, 'warning', '3000')
                                        }
                                    }, 600)
                                }).finally(() => {
                                    setTimeout(() => {
                                        this.isLoading = false;
                                    }, 500)
                                });
                            } else {
                                editManager(this.editParams).then(res => {
                                    this.isDialog = false
                                    this.clearInfo()
                                    this.getList()
                                    setTimeout(() => {
                                        const msg = res.msg
                                        if (msg === '成功') {
                                            this.tip(msg, 'success', '3000')
                                            this.defList = []
                                        } else {
                                            this.tip(msg, 'warning', '3000')
                                        }
                                    }, 600)
                                }).finally(() => {
                                    setTimeout(() => {
                                        this.isLoading = false;
                                    }, 500)
                                });
                            }
                        }
                    } else {
                        this.isLoading = false
                        return false
                    }
                })
            }
        }
    }
</script>
