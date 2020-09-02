<template>
  <div class="subject">
    <!-- 内容 -->
    <div class="pagecontent">
      <!-- 顶部按钮 -->
      <div class="headerbtn">
        <el-input v-model="findName" size="small" clearable placeholder="请输入科目" maxlength="20"
                  show-word-limit
                  @keyup.enter.native="findList()"></el-input>
        <el-button size="small" type="primary" :loading="isLoading" @click="findList()">查询</el-button>
        <el-button size="small" type="primary" @click="addSubject()">添加科目</el-button>
      </div>
      <!-- 表格 -->
      <div class="tablelist">
        <el-table :data="tableData" stripe border v-loading="isLoading">
          <el-table-column header-align="center" align="center" label="序号" type="index" width="70">
            <template slot-scope="scope">
              <span>{{ (currentPage - 1) * size + scope.$index + 1 }}</span>
            </template>
          </el-table-column>
          <el-table-column label="科目名称" prop="subjectName" header-align="center" align="center"/>
          <el-table-column label="主观题名称" prop="subjectiveName" header-align="center" align="center"/>
<!--          <el-table-column label="状态" prop="status" header-align="center" align="center">-->
<!--            <template slot-scope="scope">-->
<!--              <el-tag type="danger" v-if="scope.row.status === 0">未归档</el-tag>-->
<!--              <el-tag type="success" v-if="scope.row.status === 10">已归档</el-tag>-->
<!--            </template>-->
<!--          </el-table-column>-->
          <el-table-column label="简介" prop="remark" header-align="center" align="center"/>
          <el-table-column label="操作" header-align="center" align="center" width="250">
            <template slot-scope="scope">
<!--              <el-button size="small" type='success' :disabled="scope.row.status === 10" @click="archive(scope.row.id)">-->
<!--                归档-->
<!--              </el-button>-->

              <el-button size="small" type='warning' @click="tableEdit(scope.$index, scope.row)">修改</el-button>
<!--              <el-popconfirm icon="el-icon-info" iconColor="red" title="是否归档?" @onConfirm="archive(scope.row.id)" style="marginLeft: 10px">-->
<!--                <el-button slot="reference" size="small" :disabled="scope.row.status === 10" type='success'>归档</el-button>-->
<!--              </el-popconfirm>-->
              <el-popconfirm icon="el-icon-info" iconColor="red" title="是否删除?" @onConfirm="tableDelete(scope.row.id)" style="marginLeft: 10px">
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
    <el-dialog :visible.sync="isDialog" width="500px" top="15vh" :title="saveOrEdit === 1 ? '添加科目' : '科目修改'"
               :show-close="false" :close-on-click-modal="false">
      <div class="dialog_cont">
        <el-form ref="formSubject" label-position="right" :model="formSubject" status-icon label-width="100px"
                 :rules="rules">
          <el-form-item label="名称:" prop="subjectName">
            <el-input v-model="formSubject.subjectName" placeholder="请输入名称" size="small"  maxlength="20"
                      show-word-limit></el-input>
          </el-form-item>
          <el-form-item label="主观题名称:" prop="subjectiveName">
            <el-input v-model="formSubject.subjectiveName" placeholder="请输入主观题名称" size="small" maxlength="20"
                      show-word-limit></el-input>
          </el-form-item>
          <el-form-item label="简介:" prop="subjectRemark">
            <el-input v-model="formSubject.subjectRemark" type="textarea" :autosize="{ minRows: 3, maxRows: 6}"
                      placeholder="请输入简介" maxlength="200" show-word-limit></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer" >
        <el-button @click="dialogFalse('formSubject')" size="small">取 消</el-button>
        <el-button type="primary" @click="dialogTrue('formSubject')" size="small">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
    import {addSubject, archiveSubject, deleteSubject, editSubject, getSubjectList} from '@/api/subject.js'

    export default {
        name: 'Subject',
        data() { // 存放数据
            return {
                msg: '科目管理',

                // 加载
                isLoading: true,

                // 查询条件
                findName: '',

                // 表格数据
                tableData: [],
                totalRecord: 0, // 初始共00条数据，其实没有，等接口返回,总条数
                size: 10, // 每页的数据条数
                currentPage: 1, // 当前导航页数的默认页数

                // 添加和修改弹框
                isDialog: false,
                saveOrEdit: 1,
                subjectId: '', // 用来修改
                formSubject: {
                    subjectName: '',
                    subjectRemark: '',
                    subjectiveName:'简答题',
                },
                rules: {
                    subjectName: [
                        {required: true, message: '请输入科目', trigger: 'blur'}
                    ],
                    subjectiveName: [
                        {required: true, message: '请输入主观题名称', trigger: 'blur'}
                    ],
                    subjectRemark: [
                        {required: true, message: '请输入简介', trigger: 'blur'}
                    ]
                },
                isFirst:true,
            }
        },
        computed: {
            // 列表请求参数
            listParams: {
                get: function () {
                    return {
                        subjectName: this.findName,
                        pageSize: this.size.toString(),
                        pageNumber: this.currentPage.toString()
                    }
                }
            },
            // 添加
            addParams: {
                get: function () {
                    return {
                        subjectName: this.formSubject.subjectName,
                        subjectiveName: this.formSubject.subjectiveName,
                        remark: this.formSubject.subjectRemark
                    }
                }
            },
            // 修改参数
            editParams: {
                get: function () {
                    return {
                        id: this.subjectId,
                        subjectName: this.formSubject.subjectName,
                        subjectiveName: this.formSubject.subjectiveName,
                        remark: this.formSubject.subjectRemark
                    }
                }
            }
        },
        created() {
            this.getList();
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

            // 科目列表
            getList() {
                if (this.isFirst) {
                    this.currentPage = 1;
                }
                this.tableData = [];
                getSubjectList(this.listParams).then(res => {
                    setTimeout(() => {
                        this.isLoading=false;
                        if ('成功' === res.msg) {
                            if (res.data.totalRecord > 0) {
                                this.tableData = res.data.list;
                                this.totalRecord = res.data.totalRecord;
                            }
                        } else {
                            this.tip(res.msg, 'warning', '3000')
                        }
                    }, 500);
                }).catch(() => {

                }).finally(() => {
                    this.isFirst = false;
                    setTimeout(() => {
                        this.isLoading = false;
                    }, 500);
                })
            },

            // 分页
            handleSizeChange(e) {
                this.isLoading = true;
                this.size = e;
                this.getList()
            },
            handleCurrentChange(e) {
                this.isLoading = true;
                this.currentPage = e;
                this.getList()
            },

            // 查询
            findList() {
                this.isLoading = true;
                this.isFirst=true;
                this.getList();
            },

            // 表格删除
            tableDelete(id) {
                this.isLoading = true;
                const data = {id: id};
                deleteSubject(data).then(res => {
                    this.getList();
                    setTimeout(() => {
                        if('成功' === res.msg){
                            this.tip(res.msg, 'success', '3000');
                        }else{
                            this.tip(res.msg, 'warning', '3000');
                        }
                    }, 600)
                }).finally(() => {
                    setTimeout(() => {
                        this.isLoading = false;
                    }, 500)
                });
            },

            // 归档
            archive(id) {
                const data = {id: id};
                archiveSubject(data).then(res => {
                    this.getList();
                    setTimeout(() => {
                        if('成功' === res.msg){
                            this.tip(res.msg, 'success', '3000')
                        }else{
                            this.tip(res.msg, 'warning', '3000')
                        }
                    }, 600)
                }).finally(() => {
                    setTimeout(() => {
                        this.isLoading = false;
                    }, 500)
                });
            },

            // 添加科目/修改项目
            clearInfo() {
                this.formSubject.subjectName = '';
                this.formSubject.subjectRemark = '';
                this.formSubject.subjectiveName='';
            },
            addSubject() {
                this.saveOrEdit = 1;
                this.isDialog = true;
            },
            tableEdit(index, row) {
                this.saveOrEdit = 0;
                this.subjectId = row.id;
                this.formSubject = {
                    subjectName: row.subjectName,
                    subjectiveName:row.subjectiveName,
                    subjectRemark: row.remark
                };
                this.isDialog = true
            },
            dialogFalse(formSubject) {
                this.isDialog = false;
                this.isLoading = false;
                this.clearInfo();
                this.$refs[formSubject].resetFields();
            },
            dialogTrue(formSubject) {
                this.$refs[formSubject].validate((valid) => {
                    if (valid) {
                        this.isLoading = true;
                        const text = this.saveOrEdit === 1 ? '添加成功' : '修改成功'
                        if (this.saveOrEdit === 1) {
                            addSubject(this.addParams).then(res => {
                                this.isDialog = false;
                                this.clearInfo();
                                this.getList();
                                setTimeout(() => {
                                    this.tip(text, 'success', '1000');
                                }, 600)
                            }).finally(() => {
                                setTimeout(() => {
                                    this.isLoading = false;
                                    this.isDialog=false;
                                }, 500)
                            });
                        } else {
                            editSubject(this.editParams).then(res => {
                                this.isDialog = false;
                                this.clearInfo();
                                this.getList();
                                setTimeout(() => {
                                    this.tip(text, 'success', '1000');
                                }, 600)
                            }).finally(() => {
                                setTimeout(() => {
                                    this.isLoading = false;
                                    this.isDialog=false;
                                }, 500)
                            });
                        }
                    } else {
                        return false
                    }
                })
            },
        }
    }
</script>
