<template>
  <div class="first" v-loading="importing"
       element-loading-text="正在导入...."
       element-loading-spinner="el-icon-loading"
       element-loading-background="rgba(0, 0, 0, 0.8)"
       style="width: 100%">
    <!-- 内容 -->
    <div class="pagecontent">
      <!-- 顶部按钮 -->
      <div class="headerbtn">
        <el-select v-model="selectPaperModel" size="small" placeholder="请选择科目" clearable @change="getList()">
          <el-option v-for="item in paperList" :label="item.subjectName" :value="item.id" :key="item.id"></el-option>
        </el-select>
        <el-button size="small" type="primary" :loading="isLoading" @click="findList(true)">查询</el-button>
        <!--                <el-button size="small" type="primary" @click="addLibrary()">添加试题</el-button>-->
        <el-button size="small" type="primary" @click="askImportLibraryForWord()">导入题库</el-button>
      </div>
      <!-- 表格 -->
      <div class="tablelist">
        <el-table :data="tableData" stripe border v-loading="isLoading">
          <el-table-column header-align="center" align="center" label="序号" type="index" width="70">
            <template slot-scope="scope">
              <span>{{ (currentPage - 1) * size + scope.$index + 1 }}</span>
            </template>
          </el-table-column>
          <el-table-column label="题型" prop="questionType" header-align="center" align="center" width="90">
            <template slot-scope="scope">
              <el-tag type="success" v-if="scope.row.questionType === 1">单选</el-tag>
              <el-tag type="info" v-if="scope.row.questionType === 5">多选</el-tag>
              <el-tag type="warning" v-if="scope.row.questionType === 10">判断</el-tag>
              <el-tag type="danger" v-if="scope.row.questionType === 15">{{scope.row.typeName}}</el-tag>
              <el-tag type="warning" v-if="scope.row.questionType === 20">填空</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="题目内容" prop="questionContent" header-align="center" align="left" show-overflow-tooltip>
            <!--            <template slot-scope="scope">-->
            <!--              <p v-html='scope.row.questionContent'></p>-->
            <!--            </template>-->
            <template slot-scope="scope">
              <p style="white-space: pre-wrap">{{scope.row.questionContent}}</p>
            </template>
          </el-table-column>
          <!--          <el-table-column label="选项数量" prop="resultCount" header-align="center" align="center" width="80"/>-->
          <el-table-column label="正确答案" prop="answer" header-align="center" align="center" width="80"/>

          <el-table-column label="答案解说" prop="explainInfo" header-align="center" align="left"/>
          <el-table-column label="操作" header-align="center" align="center" width="150">
            <template slot-scope="scope">
              <!--                            <el-button size="small" type='warning' @click="tableEdit(scope.$index, scope.row )">修改</el-button>-->
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
    <!-- 导入试题弹框 -->
    <el-dialog :visible.sync="isImportDialog" width="1024px" top="15vh" :title="'题库导入'"
               :show-close="false" :close-on-click-modal="false">
      <div class="dialog_cont">
        <el-form ref="formImport" label-position="right" :model="formImport" status-icon label-width="100px">
          <el-form-item label="科目:" prop="power">
            <el-select v-model="importSubjectModel" size="small" placeholder="请选择科目">
              <el-option v-for="item in importSubjectList" :label="item.subjectName" :value="item.id"
                         :key="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="文件:" prop="power">
            <el-upload
              ref="upload"
              :limit=limitNum
              :auto-upload="false"
              accept=".docx,.doc"
              :action="UploadUrl()"
              :before-upload="beforeUploadFile"
              :on-change="fileChange"
              :on-exceed="exceedFile"
              :on-remove="fileRemove"
              :on-success="handleSuccess"
              :on-error="handleError"
              :file-list="fileList">
              <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
            </el-upload>
          </el-form-item>
          <el-form-item label="导入说明:" prop="">
            <el-image :src="require(`@/assets/importWord.png`)" fit="fill" style="height: 450px">
              <div slot="placeholder" class="image-slot">
                加载中<span class="dot">...</span>
              </div>
            </el-image>
          </el-form-item>
          <el-form-item label="" prop="power"></el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="importDialogFalse('formImport')" size="small">取 消</el-button>
        <el-button size="small" type="primary" @click="uploadFile">立即上传</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
    import {
        libraryForWordImpt,
        getLibraryForWordList,
        editLibraryForWord,
        deleteLibraryForWord,
        libraryImptDoc
    } from '@/api/libraryForWord.js';
    import {getSubList} from '@/api/common.js'

    export default {
        name: 'ListForPaper',
        data() { // 存放数据
            return {
                msg: '题库管理',
                // 加载
                isLoading: true,
                // 查询条件
                isDialog: false,
                isImportDialog: false,
                saveOrEdit: 1,
                // 表格数据
                tableData: [],
                totalRecord: 0, // 初始共00条数据，其实没有，等接口返回,总条数
                size: 10, // 每页的数据条数
                currentPage: 1, // 当前导航页数的默认页数

                Id: '',
                paperList: [],//查询科目
                importSubjectList: [],//导入的科目列表
                addOrEditPaperList: [],//添加和编辑科目列表
                formImport: {
                    subjectId: this.selectPaperModel,//sessionStorage.subjectId,
                    data: [],
                },
                formLibraryForWord: {
                    subjectId: '',//添加和编辑查询科目: '',
                    questionType: '1',
                    questionContent: '',
                    resultCount: '4',
                    explainInfo: '',
                    a: 0,
                    b: 0,
                    c: 0,
                    d: 0,
                    e: 0,
                    f: 0,
                    g: 0,
                },
                selectPaperModel: '',//查询科目
                importSubjectModel: '',//导入的查询科目

                importing: false,
                importData: [],
                limitNum: 1,  // 上传excell时，同时允许上传的最大数
                fileList: [],   // excel文件列表
                Id: '',

                questionItemCheckbox: [],
                questionItemSelect: [],
                questionItemRadio: [],
                isFirst: true,
            }
        },
        computed: {
            // 列表请求参数
            listParams: {
                get: function () {
                    return {
                        subjectId: this.selectPaperModel,
                        pageSize: this.size.toString(),
                        pageNumber: this.currentPage.toString()
                    };
                }
            }
        },
        created() {
            this.getSubList();
        },
        methods: {
            //提示框
            tip(message, type, time) {
                this.$message({
                    message: message,
                    type: type,
                    duration: time
                })
            },

            // 科目列表
            getSubList() {
                const data = {}
                getSubList(data).then(res => {
                    setTimeout(() => {
                        this.isLoading = false;
                    }, 500);
                    if ('成功' === res.msg) {
                        this.paperList = res.data.list;
                        this.addOrEditPaperList = res.data.list;
                        this.importSubjectList = res.data.list;
                    } else {
                        this.tip(res.msg, 'warning', '3000')
                    }

                    if (this.paperList.length > 0) {
                        this.selectPaperModel = this.paperList[0].id;
                        this.getList();
                    } else {
                        setTimeout(() => {
                            this.tip('暂无科目','warning','1000')
                            this.isLoading = false;
                        }, 500);
                    }
                    if(this.importSubjectList.length>0){
                        this.importSubjectModel=this.importSubjectList[0].id;
                    }
                }).catch(() => {
                    setTimeout(() => {
                        this.isLoading = false;
                    }, 500);
                }).finally(() => {
                    setTimeout(() => {
                        this.isLoading = false;
                    }, 500);
                });
            },

            //获取题库列表
            getList() {
                this.isLoading = true
                if (this.isFirst) {
                    this.currentPage = 1;
                }
                this.tableData = [];
                getLibraryForWordList(this.listParams).then(res => {
                    setTimeout(() => {
                        this.isLoading=false;
                      if ('成功' === res.msg) {
                          this.tableData = res.data.list;
                          this.totalRecord = res.data.totalRecord;
                      } else {
                          this.tip(res.msg, 'warning', '3000')
                      }
                    }, 500);
                }).catch(() => {

                }).finally(() => {
                    setTimeout(() => {
                        this.isLoading = false;
                        this.isFirst = false;
                    }, 500);
                });
            },
            // 分页
            handleSizeChange(e) {
                this.isLoading = true;
                this.size = e;
                this.getList();
            },
            handleCurrentChange(e) {
                // console.log(e);
                this.isLoading = true;
                this.currentPage = e;
                this.getList();
            },

            // 查询
            findList() {
                this.isLoading = true;
                this.isFirst = true;
                this.getList();
            },

            //清空上传信息
            clearImportInfo() {
                this.formImport = {
                    subjectId: '',
                    data: [],
                };
                this.fileList = [];
            },
            askImportLibraryForWord() {
                this.isImportDialog = true;
                this.fileList = [];
            },

            // 表格删除
            tableDelete(id) {
                this.isLoading = true;
                const data = {id: id};
                deleteLibraryForWord(data).then(res => {
                    this.getList();
                    setTimeout(() => {
                        this.tip(res.msg, 'success', '3000');
                    }, 600)
                }).finally(() => {
                    setTimeout(() => {
                        this.isLoading = false;
                    }, 500);
                });
            },

            //上传取消按钮事件
            importDialogFalse(formImport) {
                this.isImportDialog = false;
                this.isLoading = false;
                this.clearImportInfo();
                this.$refs[formImport].resetFields()
            }
            ,
            // 文件超出个数限制时的钩子
            exceedFile(files, fileList) {
                this.tip(`只能选择 ${this.limitNum} 个文件，当前共选择了 ${files.length + fileList.length} 个`, 'warning', '2000');
            }
            ,
            // 文件状态改变时的钩子
            fileChange(file, fileList) {
                // console.log(file.raw);
                this.fileList = [];
                this.fileList.push(file.raw);
                // console.log(this.fileList);
            }
            ,
            // 上传文件之前的钩子, 参数为上传的文件,若返回 false 或者返回 Promise 且被 reject，则停止上传
            beforeUploadFile(file) {
                // console.log('before upload');
                // console.log(file);
                let extension = file.name.substring(file.name.lastIndexOf('.') + 1);
                // let size = file.size / 1024 / 1024;
                if (extension !== 'docx' || extension !== 'doc') {
                    this.tip('只能上传后缀是.docx.doc的文件', 'warning', '2000');
                }
                // if(size > 10) {
                //     this.$message.warning('文件大小不得超过10M');
                // }
            }
            ,
            // 文件上传成功时的钩子
            handleSuccess(res, file, fileList) {
                // this.$message.success('文件上传成功');
            }
            ,
            // 文件上传失败时的钩子
            handleError(err, file, fileList) {
                // this.$message.error('文件上传失败');
            }
            ,
            UploadUrl: function () {
                // 因为action参数是必填项，我们使用二次确认进行文件上传时，直接填上传文件的url会因为没有参数导致api报404，所以这里将action设置为一个返回为空的方法就行，避免抛错
                return ""
            }
            ,
            clearInfo() {
                this.formLibraryForWord = {
                    subjectId: '',
                    questionType: '1',
                    questionContent: '',
                    resultCount: '4',
                    explainInfo: '',
                    a: '',
                    b: '',
                    c: '',
                    d: '',
                    e: '',
                    f: '',
                    g: '',
                };
                this.formLibraryForWord.questionContent = '';
            },
            //上传文件
            uploadFile() {
                let that = this;
                if (that.importPaperModel === '') {
                    that.tip('请选择科目！', 'warning', '2000');
                    return;
                }
                if (that.fileList.length === 0) {
                    that.tip('请选择文件！', 'warning', '2000');
                    return;
                }
                that.importing = true;
                that.file = this.fileList[0];
                let f = this.fileList[0];
                let importParams = {
                    subjectId: that.importSubjectModel,//sessionStorage.subjectId,
                };
                // console.log(importParams);
                libraryImptDoc(importParams, f).then(res => {
                    setTimeout(() => {
                        this.importing=false;
                        const msg = res.msg;
                        if ('成功' === msg) {
                            that.tip(msg, 'success', '3000')
                            that.isImportDialog = false;
                            that.clearInfo();
                            that.getList();
                            that.fileList = [];
                        } else {
                            that.tip(msg, 'warning', '3000')
                        }
                    }, 600);
                    that.$refs.importFile.value = ''

                }).catch(error => {
                    // console.log(error);
                }).finally(() => {
                    that.importing = false;
                    that.isImportDialog=false;
                });
            }
            ,
            fileRemove(file, fileList) {
                this.fileList.splice(this.fileList.indexOf(file.raw),1);
            },
        }
    }
</script>

<style lang='less' scoped>
  .first {
  }

</style>
<style>
  .cmm-wrapper {
    white-space: pre-wrap;
    line-height: 40px;
    color: #000032;
    font-size: 28px; /*px*/
  }

  .edit_container,
  .ql-snow .ql-picker.ql-size .ql-picker-label::before,
  .ql-snow .ql-picker.ql-size .ql-picker-item::before {
    content: "14px";
  }

  .ql-snow .ql-picker.ql-size .ql-picker-label[data-value="small"]::before,
  .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="small"]::before {
    content: "10px";
  }

  .ql-snow .ql-picker.ql-size .ql-picker-label[data-value="large"]::before,
  .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="large"]::before {
    content: "18px";
  }

  .ql-snow .ql-picker.ql-size .ql-picker-label[data-value="huge"]::before,
  .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="huge"]::before {
    content: "32px";
  }

  .ql-snow .ql-picker.ql-header .ql-picker-label::before,
  .ql-snow .ql-picker.ql-header .ql-picker-item::before {
    content: "文本";
  }

  .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="1"]::before,
  .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="1"]::before {
    content: "标题1";
  }

  .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="2"]::before,
  .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="2"]::before {
    content: "标题2";
  }

  .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="3"]::before,
  .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="3"]::before {
    content: "标题3";
  }

  .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="4"]::before,
  .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="4"]::before {
    content: "标题4";
  }

  .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="5"]::before,
  .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="5"]::before {
    content: "标题5";
  }

  .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="6"]::before,
  .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="6"]::before {
    content: "标题6";
  }

  .ql-snow .ql-picker.ql-font .ql-picker-label::before,
  .ql-snow .ql-picker.ql-font .ql-picker-item::before {
    content: "标准字体";
  }

  .ql-snow .ql-picker.ql-font .ql-picker-label[data-value="serif"]::before,
  .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="serif"]::before {
    content: "衬线字体";
  }

  .ql-snow .ql-picker.ql-font .ql-picker-label[data-value="monospace"]::before,
  .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="monospace"]::before {
    content: "等宽字体";
  }

  .ql-editor {
    height: 200px;
  }

</style>
