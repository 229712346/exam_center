<template>
  <div class="first" style="width: 100%">
    <!-- 内容 -->
    <div class="pagecontent">
      <!-- 顶部按钮 -->
      <div class="headerbtn">
        <el-select v-model="selectSubjectModel" size="small" placeholder="请选择科目" @change="getPaperListForSelect">
          <el-option v-for="item in selectSubjectList" :label="item.subjectName" :value="item.id"
                     :key="item.id"></el-option>
        </el-select>
        <el-select v-model="selectPaperModel" size="small" placeholder="请选择试卷" @change="getListCandidate">
          <el-option v-for="item in selectPaperList" :label="item.paperName" :value="item.id"
                     :key="item.id"></el-option>
        </el-select>
        <el-button size="small" type="primary" :loading="isLoading" @click="findListCandidate()">查询</el-button>
        <el-button size="small" type="primary" @click="addCandidate()">添加考生</el-button>
        <el-button size="small" type="primary" @click="askImportCandidate()">导入考生</el-button>
      </div>
      <!-- 表格 -->
      <div class="tablelist">
        <el-table :data="tableData" stripe border v-loading="isLoading">
          <el-table-column header-align="center" align="center" label="序号" type="index" width="70">
            <template slot-scope="scope">
              <span>{{ (currentPage - 1) * size + scope.$index + 1 }}</span>
            </template>
          </el-table-column>
          <el-table-column label="工作单位" prop="workUnit" header-align="center" align="center"></el-table-column>
          <el-table-column label="身份证号" prop="idCard" header-align="center" align="center"></el-table-column>
          <el-table-column label="准考证号" prop="admissionCard" header-align="center" align="center"></el-table-column>
          <el-table-column label="考生姓名" prop="candidateName" header-align="center" align="center"></el-table-column>
          <el-table-column label="操作" header-align="center" align="center" width="260">
            <template slot-scope="scope">
              <el-popconfirm icon="el-icon-info" iconColor="red" title="是否重置密码?"
                             @onConfirm="resetPwd(scope.row.id)"
                             style="marginLeft: 10px">
                <el-button slot="reference" size="small" type='success'>重置密码</el-button>
              </el-popconfirm>
              <el-button size="small" type='warning' style="marginLeft: 10px"
                         @click="tableEdit(scope.$index, scope.row )">修改
              </el-button>
              <el-popconfirm icon="el-icon-info" iconColor="red" title="是否删除?"
                             @onConfirm="tableDeleteCandidate(scope.row.id)"
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
      @size-change="handleSizeChangeCandidate"
      @current-change="handleCurrentChangeCandidate"></el-pagination>
    <!-- 导入试题弹框 -->
    <el-dialog :visible.sync="isImportDialog" width="860px" top="15vh" :title="'考生导入'"
               :show-close="false" :close-on-click-modal="false" v-loading="importing"
               element-loading-text="正在导入...."
               element-loading-spinner="el-icon-loading"
               element-loading-background="rgba(0, 0, 0, 0.8)">
      <div class="dialog_cont">
        <el-form ref="formImport" label-position="right" :model="formImport" status-icon label-width="100px"
        >

          <el-form-item label="工作单位:" prop="workUnit">
            <el-input v-model="formImport.workUnit" size="small" maxlength="20"
                      show-word-limit></el-input>
          </el-form-item>
          <el-form-item label="科目:" prop="power">
            <el-select v-model="formImport.subjectId" size="small" placeholder="请选择科目" @change="getPaperListForImport">
              <el-option v-for="item in importSubjectList" :label="item.subjectName" :value="item.id"
                         :key="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="试卷:" prop="paperId">
            <el-select v-model="formImport.paperId" placeholder="请选择试卷">
              <el-option v-for="item in importPaperList" :label="item.paperName" :value="item.id"
                         :key="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="密码类型:" prop="pwdType">
            <el-radio-group v-model="formImport.pwdType" @change="pwdTypeChangeForImport">
              <el-radio label="0">身份证后6位</el-radio>
              <el-radio label="10">设定密码</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="密码:" prop="pwd" v-if="isShowPwdInputForImport">
            <el-input v-model="formImport.pwd" size="small"></el-input>
          </el-form-item>
          <el-form-item label="文件:" prop="power">
            <el-upload
              ref="upload"
              :limit=limitNum
              :auto-upload="false"
              accept=".xlsx,.xls"
              :action="UploadUrlCandidate()"
              :before-upload="beforeUploadFileCandidate"
              :on-change="fileChangeCandidate"
              :on-exceed="exceedFileCandidate"
              :on-success="handleSuccessCandidate"
              :on-remove="fileRemove"
              :on-error="handleErrorCandidate"
              :file-list="fileList">
              <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
            </el-upload>
          </el-form-item>
          <el-form-item label="导入说明:" prop="">
            <el-image :src="require(`@/assets/studentImport.png`)" fit="fill" style="height: 350px">
              <div slot="placeholder" class="image-slot">
                加载中<span class="dot">...</span>
              </div>
            </el-image>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="importDialogFalseCandidate('formImport')" size="small">取 消</el-button>
        <el-button size="small" type="primary" :loading="isLoading" @click="uploadFileCandidate">立即上传</el-button>
      </div>
    </el-dialog>

    <!-- 添加修改弹框 -->
    <el-dialog :visible.sync="isDialog" width="560px" top="15vh" :title="saveOrEdit === 1 ? '添加考生' : '修改考生'"
               :show-close="false" :close-on-click-modal="false">
      <div class="dialog_cont">
        <el-form ref="formCandidate" label-position="right" :model="formCandidate" status-icon label-width="100px"
                 :rules="rules">
          <el-form-item label="工作单位:" prop="workUnit">
            <el-input v-model="formCandidate.workUnit" size="small" maxlength="20"
                      show-word-limit></el-input>
          </el-form-item>
          <el-form-item label="科目:" prop="subjectId">
            <el-select v-model="formCandidate.subjectId" placeholder="请选择科目" @change="getPaperListForAddEdit">
              <el-option v-for="item in addOrEditSubjectList" :label="item.subjectName" :value="item.id"
                         :key="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="试卷:" prop="paperId">
            <el-select v-model="formCandidate.paperId" placeholder="请选择试卷">
              <el-option v-for="item in addOrEditPaperList" :label="item.paperName" :value="item.id"
                         :key="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="密码类型:" prop="pwdType" v-if="saveOrEdit === 1">
            <el-radio-group v-model="formCandidate.pwdType" @change="pwdTypeChangeForAddEdit">
              <el-radio label="0" border>身份证后6位</el-radio>
              <el-radio label="10" border>设定密码</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="密码:" prop="pwd" v-if="isShowPwdInputForAddEdit">
            <el-input v-model="formCandidate.pwd" size="small"></el-input>
          </el-form-item>
          <el-form-item label="身份证号:" prop="idCard">
            <el-input v-model="formCandidate.idCard" size="small" maxlength="18"
                      show-word-limit></el-input>
          </el-form-item>
          <el-form-item label="准考证号:" prop="admissionCard">
            <el-input v-model="formCandidate.admissionCard" size="small" maxlength="20"
                      show-word-limit></el-input>
          </el-form-item>
          <el-form-item label="考生姓名:" prop="candidateName">
            <el-input v-model="formCandidate.candidateName" size="small" maxlength="16"
                      show-word-limit></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer" style="textAlign: right">
          <el-button @click="dialogFalse('formCandidate')" size="small">取 消</el-button>
          <el-button type="primary" @click="dialogTrue('formCandidate')" :loading="isLoading" size="small">确 定
          </el-button>
        </div>
      </div>

    </el-dialog>
  </div>
</template>

<script>
    import {
        addCandidate,
        candidateImpt,
        deleteCandidate,
        editCandidate,
        getCandidateList,
        resetPwd,
    } from '../../../api/candidate.js';
    import {defaultPwd} from "../../../api/manager";
    import {getTestpaperList} from "../../../api/testpaper";
    import {getSubList, getPaperList} from '@/api/common.js'

    export default {

        name: 'Candidate',
        data() { // 存放数据
            const validID = (rule, value, callback) => {
                //严格身份证认证
                if (!/(^\d{15}$)|(^\d{17}(\d|X|x)$)/.test(value)) {
                    callback(new Error('你输入的身份证长度或格式错误'))
                }
                //身份证城市
                var aCity = {
                    11: "北京",
                    12: "天津",
                    13: "河北",
                    14: "山西",
                    15: "内蒙古",
                    21: "辽宁",
                    22: "吉林",
                    23: "黑龙江",
                    31: "上海",
                    32: "江苏",
                    33: "浙江",
                    34: "安徽",
                    35: "福建",
                    36: "江西",
                    37: "山东",
                    41: "河南",
                    42: "湖北",
                    43: "湖南",
                    44: "广东",
                    45: "广西",
                    46: "海南",
                    50: "重庆",
                    51: "四川",
                    52: "贵州",
                    53: "云南",
                    54: "西藏",
                    61: "陕西",
                    62: "甘肃",
                    63: "青海",
                    64: "宁夏",
                    65: "新疆",
                    71: "台湾",
                    81: "香港",
                    82: "澳门",
                    91: "国外"
                };
                if (!aCity[parseInt(value.substr(0, 2))]) {
                    callback(new Error('你的身份证地区非法'))
                }

                // 出生日期验证
                var sBirthday = (value.substr(6, 4) + "-" + Number(value.substr(10, 2)) + "-" + Number(value.substr(12, 2))).replace(/-/g, "/"),
                    d = new Date(sBirthday)
                if (sBirthday != (d.getFullYear() + "/" + (d.getMonth() + 1) + "/" + d.getDate())) {
                    callback(new Error('身份证上的出生日期非法'))
                }

                // 身份证号码校验
                var sum = 0,
                    weights = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2],
                    codes = "10X98765432"
                for (var i = 0; i < value.length - 1; i++) {
                    sum += value[i] * weights[i];
                }
                var last = codes[sum % 11]; //计算出来的最后一位身份证号码
                if (value[value.length - 1] != last) {
                    callback(new Error('你输入的身份证号非法，如果末尾为X,请填大写X'))
                }
                callback()

                //下面为简单的身份证认证 身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X
                // let reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
                // if (reg.test(value)) {
                //     callback()
                // } else {
                //     callback(new Error('身份证号码不正确'))
                // }
            }

            return {
                msg: '考生管理',
                // 加载
                isLoading: true,
                // 查询条件
                isDialog: false,
                isImportDialog: false,

                // 表格数据
                tableData: [],
                totalRecord: 0, // 初始共00条数据，其实没有，等接口返回,总条数
                size: 10, // 每页的数据条数
                currentPage: 1, // 当前导航页数的默认页数

                Id: '',
                selectSubjectList: [],//查询科目
                selectPaperList: [],//查询试卷
                importSubjectList: [],//导入的科目列表
                importPaperList: [],//导入的试卷列表
                addOrEditSubjectList: [],//添加和编辑的科目列表
                addOrEditPaperList: [],//添加和编辑的试卷列表
                formImport: {
                    pwdType: '0',
                    pwd: '666666',
                    subjectId: '',
                    paperId: this.selectPaperModel,//sessionStorage.subjectId,
                    workUnit: '',
                    data: [],
                },
                formCandidate: {
                    pwdType: '0',
                    pwd: '',
                    subjectId: '',
                    paperId: '',
                    idCard: '',
                    admissionCard: '',
                    candidateName: '',
                    workUnit: '',
                },
                selectSubjectModel: '',//查询科目
                selectPaperModel: '',//查询试卷

                importing: false,
                importData: [],
                limitNum: 1,  // 上传excell时，同时允许上传的最大数
                fileList: [],   // excel文件列表

                saveOrEdit: '',
                rules: {
                    paperId: [
                        {required: true, message: '请选择科目', trigger: 'blur'}
                    ],
                    pwd: [
                        {required: true, message: '请填写设定密码', trigger: 'blur'},
                    ],
                    idCard: [
                        {required: true, message: '请填写身份证号', trigger: 'blur'},
                        {required: true, validator: validID, trigger: 'blur'}
                    ],
                    admissionCard: [
                        {required: true, message: '请填写准考证号', trigger: 'blur'}
                    ],
                    candidateName: [
                        {required: true, message: '请填写考生姓名', trigger: 'blur'}
                    ],
                    workUnit: [
                        {required: true, message: '请填写工作单位', trigger: 'blur'}
                    ],
                },

                // passwordTypeList:[{'textInfo':'身份证后6位',id:0},{'textInfo':'填写密码',id:10},],
                isShowPwdInputForAddEdit: false,//添加编辑是否显示密码框
                isShowPwdInputForImport: false,//导入是否显示密码框
                isFirst: true,
            }
        },
        computed: {
            importSubjectParams: {
                get: function () {
                    return {
                        status: 0,
                    };
                }
            },
            // 列表请求参数
            listParams: {
                get: function () {
                    return {
                        paperId: this.selectPaperModel,
                        pageSize: this.size.toString(),
                        pageNumber: this.currentPage.toString()
                    };
                }
            },
            addParams: {
                get: function () {
                    const data = {
                        pwdType: this.formCandidate.pwdType,
                        pwd: this.formCandidate.pwd,
                        paperId: this.formCandidate.paperId,
                        idCard: this.formCandidate.idCard,
                        admissionCard: this.formCandidate.admissionCard,
                        candidateName: this.formCandidate.candidateName,
                        workUnit: this.formCandidate.workUnit,
                    };
                    return data;
                }
            },
            editParams: {
                get: function () {
                    const data = {
                        id: this.Id,
                        pwdType: this.formCandidate.pwdType,
                        pwd: this.formCandidate.pwd,
                        subjectId: this.formCandidate.subjectId,
                        paperId: this.formCandidate.paperId,
                        idCard: this.formCandidate.idCard,
                        admissionCard: this.formCandidate.admissionCard,
                        candidateName: this.formCandidate.candidateName,
                        workUnit: this.formCandidate.workUnit,
                    };
                    return data;
                }
            },
        },
        created() {
            this.getSubjectListForSelect();
            this.getSubjectListForAddEdit();
            this.getSubjectListForImport();
            this.getDefaultPwd();
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
            fileRemove(file, fileList) {
                this.fileList.splice(this.fileList.indexOf(file.raw), 1);
            },
            // 查询的科目列表
            getSubjectListForSelect() {
                const data = {}
                getSubList(data).then(res => {
                    setTimeout(() => {
                        this.isLoading = false;
                    }, 500);
                    if ('成功' === res.msg) {
                        this.selectSubjectList = res.data.list;
                    } else {
                        this.tip(res.msg, 'warning', '3000')
                    }

                    if (this.selectSubjectList.length > 0) {
                        this.selectSubjectModel = this.selectSubjectList[0].id;
                        this.getPaperListForSelect();
                    } else {
                        setTimeout(() => {
                            this.tip('暂无科目', 'warning', '1000')
                            this.isLoading = false;
                        }, 500);
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
            // 添加编辑的科目列表
            getSubjectListForAddEdit() {
                const data = {}
                this.isLoading = true
                getSubList(data).then(res => {
                    setTimeout(() => {
                        this.isLoading = false;
                    }, 500);
                    if ('成功' === res.msg) {
                        this.addOrEditSubjectList = res.data.list;
                    } else {
                        this.tip(res.msg, 'warning', '3000')
                    }

                    if (this.addOrEditSubjectList.length > 0) {
                        this.formCandidate.subjectId = this.addOrEditSubjectList[0].id;
                        this.getPaperListForAddEdit();
                    } else {
                        setTimeout(() => {
                            this.tip('暂无科目', 'warning', '1000')
                            this.isLoading = false;
                        }, 500);
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
            // 导入的科目列表
            getSubjectListForImport() {
                const data = {}
                this.isLoading = true
                getSubList(data).then(res => {
                    setTimeout(() => {
                        this.isLoading = false;
                    }, 500);
                    if ('成功' === res.msg) {
                        this.importSubjectList = res.data.list;
                    } else {
                        this.tip(res.msg, 'warning', '3000')
                    }

                    if (this.importSubjectList.length > 0) {
                        this.formImport.subjectId = this.importSubjectList[0].id;
                        this.getPaperListForImport();
                    } else {
                        setTimeout(() => {
                            this.tip('暂无科目', 'warning', '1000')
                            this.isLoading = false;
                        }, 500);
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

            // 试卷列表
            getPaperListForSelect() {
                let that = this;
                that.selectPaperList = [];
                const data = {
                    subjectId: that.selectSubjectModel
                };
                getPaperList(data).then(res => {
                    setTimeout(() => {
                        that.isLoading = false;
                    }, 500);
                    if ('成功' === res.msg) {
                        that.selectPaperList = res.data.list;
                        // console.log(that.selectPaperList);
                        if (that.selectPaperList) {
                            if (that.selectPaperList.length > 0) {
                                that.selectPaperModel = that.selectPaperList[0].id;
                                this.getListCandidate();
                            } else {
                                that.selectPaperModel = ''
                            }
                        } else {
                            that.selectPaperList = [];
                            that.selectPaperModel = '';
                        }
                    } else {
                        that.tip(res.msg, 'warning', '3000')
                    }
                }).catch(() => {
                    setTimeout(() => {
                        that.isLoading = false;
                    }, 500);
                }).finally(() => {
                    setTimeout(() => {
                        this.isLoading = false;
                    }, 500);
                });
            },
            getPaperListForAddEdit() {
                let that = this;
                that.addOrEditPaperList = [];
                const data = {
                    subjectId: that.formCandidate.subjectId
                };
                getPaperList(data).then(res => {
                    setTimeout(() => {
                        that.isLoading = false;
                    }, 500);
                    if ('成功' === res.msg) {
                        that.addOrEditPaperList = res.data.list;
                        // console.log(that.selectPaperList);
                        if (that.addOrEditPaperList) {
                            if (this.saveOrEdit === 1) {
                                if (that.addOrEditPaperList.length > 0) {
                                    that.formCandidate.paperId = that.addOrEditPaperList[0].id;
                                    // this.getListCandidate();
                                } else {
                                    that.formCandidate.paperId = ''
                                }
                            }
                        } else {
                            that.addOrEditPaperList = [];
                            that.formCandidate.paperId = '';
                        }
                    } else {
                        that.tip(res.msg, 'warning', '3000')
                    }
                }).catch(() => {
                    setTimeout(() => {
                        that.isLoading = false;
                    }, 500);
                }).finally(() => {
                    setTimeout(() => {
                        this.isLoading = false;
                    }, 500);
                });
            },
            getPaperListForImport() {
                let that = this;
                that.importPaperList = [];
                const data = {
                    subjectId: that.formImport.subjectId
                };
                getPaperList(data).then(res => {
                    setTimeout(() => {
                        that.isLoading = false;
                    }, 500);
                    if ('成功' === res.msg) {
                        that.importPaperList = res.data.list;
                        // console.log(that.selectPaperList);
                        if (that.importPaperList) {
                            if (that.importPaperList.length > 0) {
                                that.formImport.paperId = that.importPaperList[0].id;
                            } else {
                                that.formImport.paperId = ''
                            }
                        } else {
                            that.importPaperList = [];
                            that.formImport.paperId = '';
                        }
                    } else {
                        that.tip(res.msg, 'warning', '3000')
                    }
                }).catch(() => {
                    setTimeout(() => {
                        that.isLoading = false;
                    }, 500);
                }).finally(() => {
                    setTimeout(() => {
                        this.isLoading = false;
                    }, 500);
                });
            },

            //获取考生列表
            getListCandidate() {
                if (this.isFirst) {
                    this.currentPage = 1;
                }
                this.isLoading = true
                this.tableData = [];
                getCandidateList(this.listParams).then(res => {
                    setTimeout(() => {
                        this.isLoading = false;
                        this.tableData = res.data.list;
                        if ('成功' === res.msg) {
                            this.totalRecord = res.data.totalRecord;
                        } else {
                            this.tip(res.msg, 'warning', '3000')
                        }
                    }, 500);
                }).catch((err) => {
                    console.log('错误=' + err);
                    setTimeout(() => {
                        this.isLoading = false;
                    }, 500)
                }).finally(() => {
                    setTimeout(() => {
                        this.isFirst = false;
                        this.isLoading = false;
                    }, 500)
                })
            },
            // 分页
            handleSizeChangeCandidate(e) {
                this.isLoading = true;
                this.size = e;
                this.getListCandidate();
            },
            handleCurrentChangeCandidate(e) {
                this.isLoading = true;
                this.currentPage = e;
                this.getListCandidate();
            },

            // 获取默认密码
            getDefaultPwd() {
                let defaultPwdParams = {
                    type: '10',
                };
                defaultPwd(defaultPwdParams).then(res => {

                    if ('成功' === res.msg) {
                        const pwd = res.data.pwd;
                        if (pwd) {
                            this.formCandidate.pwd = pwd;
                            this.formImport.pwd = pwd;
                        } else {
                            this.formCandidate.pwd = '666666';
                            this.formImport.pwd = '666666';
                        }
                    } else {
                        this.tip(res.msg, 'warning', '3000')
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

            // 查询
            findListCandidate() {
                if (this.selectPaperModel === '') {
                    this.tip('查询前请选择试卷', 'warning', '3000');
                    return;
                }
                this.isLoading = true;
                this.isFirst = true;
                this.getListCandidate();
            },

            // 表格删除
            tableDeleteCandidate(id) {
                this.isLoading = true;
                const data = {id: id};
                deleteCandidate(data).then(res => {
                    this.getListCandidate();
                    setTimeout(() => {
                        if ('成功' === res.msg) {
                            this.tip(res.msg, 'success', '3000')
                        } else {
                            this.tip(res.msg, 'warning', '3000')
                        }
                    }, 600)
                }).finally(() => {
                    setTimeout(() => {
                        this.isLoading = false;
                    }, 500);
                });
            },


            clearInfo() {
                this.formCandidate = {
                    pwdType: '0',
                    pwd: '',
                    paperId: '',
                    idCard: '',
                    admissionCard: '',
                    candidateName: '',
                    workUnit: '',
                };
                this.saveOrEdit = 1;
                this.isShowPwdInputForAddEdit = false;//添加编辑是否显示密码框
            },
            addCandidate() {
                this.isDialog = true;
                this.saveOrEdit = 1;
            },
            tableEdit(index, row) {
                this.saveOrEdit = 0;
                this.Id = row.id;
                this.formCandidate = {
                    id: row.Id,
                    pwdType: row.pwdType,
                    pwd: row.pwd,
                    subjectId: row.subjectId,
                    paperId: row.paperId,
                    idCard: row.idCard,
                    admissionCard: row.admissionCard,
                    candidateName: row.candidateName,
                    workUnit: row.workUnit,
                };
                this.getPaperListForAddEdit();
                this.isDialog = true;
            },
            resetPwd(id) {
                let resetPwdParams = {
                    id: id,
                };
                this.isLoading = true;
                resetPwd(resetPwdParams).then(res => {
                    this.isLoading = false;

                    if ('成功' === res.msg) {
                        const pwd = res.data.pwd;
                        this.$alert('新密码为：' + pwd, '重置密码成功', {
                            confirmButtonText: '确定',
                            callback: action => {

                            }
                        });
                    } else {
                        this.tip(res.msg, 'warning', '3000')
                    }
                }).finally(() => {
                    setTimeout(() => {
                        this.isLoading = false;
                    }, 500);
                });
            },
            dialogFalse(formCandidate) {
                this.isDialog = false;
                this.isLoading = false;
                this.clearInfo();
                this.$refs[formCandidate].resetFields()
            },
            dialogTrue(formCandidate) {

                this.$refs[formCandidate].validate((valid) => {
                    if (valid) {
                        if (this.saveOrEdit === 1) {
                            this.isLoading = true;
                            addCandidate(this.addParams).then(res => {
                                this.isDialog = false;
                                this.isLoading = false;
                                if ('成功' === res.msg) {
                                    this.tip(res.msg, 'success', '3000')
                                } else {
                                    this.tip(res.msg, 'warning', '3000')
                                }


                                this.clearInfo();
                                this.getListCandidate();
                            }).finally(() => {
                                setTimeout(() => {
                                    this.isLoading = false;
                                    this.isDialog = false;
                                }, 500);
                            });
                        } else {
                            editCandidate(this.editParams).then(res => {
                                this.isDialog = false;
                                this.isLoading = false;
                                const msg = res.msg;
                                if ('成功' === msg) {
                                    this.tip(msg, 'success', '3000')
                                } else {
                                    this.tip(msg, 'warning', '3000')
                                }
                                this.clearInfo();
                                this.getListCandidate();
                            }).finally(() => {
                                setTimeout(() => {
                                    this.isLoading = false;
                                    this.isDialog = false;
                                }, 500);
                            });
                        }
                    } else {
                        return false;
                    }
                })
            },
            pwdTypeChangeForAddEdit() {
                if (parseInt(this.formCandidate.pwdType) === 0) {
                    this.isShowPwdInputForAddEdit = false
                } else {
                    this.isShowPwdInputForAddEdit = true;
                    if (this.formCandidate.pwd === '') {
                        this.formCandidate.pwd = '666666';
                    }
                }

            },
            pwdTypeChangeForImport() {
                if (parseInt(this.formImport.pwdType) === 0) {
                    this.isShowPwdInputForImport = false
                } else {
                    this.isShowPwdInputForImport = true;
                    if (this.formImport.pwd === '') {
                        this.formImport.pwd = '666666';
                    }
                }

            },

            // 导入考生
            askImportCandidate() {
                this.isImportDialog = true;
                this.fileList = [];
            },
            //清空上传信息
            clearImportInfoCandidate() {
                this.formImport = {
                    subjectId: '',
                    paperId: '',
                    pwdType: '0',
                    pwd: '666666',
                    workUnit: '',
                    data: [],
                };
                this.fileList = [];
                this.isShowPwdInputForImport = false;//导入是否显示密码框
            },
            //上传取消按钮事件
            importDialogFalseCandidate(formImport) {
                this.isImportDialog = false;
                this.isLoading = false;
                this.clearImportInfoCandidate();
                this.$refs[formImport].resetFields()
            },
            // 文件超出个数限制时的钩子
            exceedFileCandidate(files, fileList) {
                this.tip(`只能选择 ${this.limitNum} 个文件，当前共选择了 ${files.length + fileList.length} 个`, 'warning', '2000');
            }
            ,
            // 文件状态改变时的钩子
            fileChangeCandidate(file, fileList) {
                // console.log(file.raw);
                this.fileList = [];
                this.fileList.push(file.raw);
                // console.log(this.fileList);
            }
            ,
            // 上传文件之前的钩子, 参数为上传的文件,若返回 false 或者返回 Promise 且被 reject，则停止上传
            beforeUploadFileCandidate(file) {
                // console.log('before upload');
                // console.log(file);
                let extension = file.name.substring(file.name.lastIndexOf('.') + 1);
                // let size = file.size / 1024 / 1024;
                if (extension !== 'xlsx' || extension !== 'xls') {
                    this.tip('只能上传后缀是.xlsx和.xls的文件', 'warning', '2000');
                }
                // if(size > 10) {
                //     this.$message.warning('文件大小不得超过10M');
                // }
            }
            ,
            // 文件上传成功时的钩子
            handleSuccessCandidate(res, file, fileList) {
                // this.$message.success('文件上传成功');
            }
            ,
            // 文件上传失败时的钩子
            handleErrorCandidate(err, file, fileList) {
                // this.$message.error('文件上传失败');
            }
            ,
            UploadUrlCandidate: function () {
                // 因为action参数是必填项，我们使用二次确认进行文件上传时，直接填上传文件的url会因为没有参数导致api报404，所以这里将action设置为一个返回为空的方法就行，避免抛错
                return ""
            }
            ,
            //上传文件
            uploadFileCandidate() {
                // debugger
                let that = this;
                if (that.formImport.workUnit.length === 0) {
                    that.tip('请输入设定工作单位！', 'warning', '2000');
                    return;
                }
                if (that.formImport.paperId === '') {
                    that.tip('请选择试卷！', 'warning', '2000');
                    return;
                }
                if (that.fileList.length === 0) {
                    that.tip('请选择文件！', 'warning', '2000');
                    return;
                }
                if (that.formImport.pwd.length === 0) {
                    that.tip('请输入设定密码！', 'warning', '2000');
                    return;
                }

                that.importing = true;
                that.isLoading = true;
                that.file = this.fileList[0];
                let rABS = false; //是否将文件读取为二进制字符串
                let f = that.file;
                let reader = new FileReader();
                let outdata;
                //if (!FileReader.prototype.readAsBinaryString) {
                FileReader.prototype.readAsBinaryString = function (f) {
                    let binary = "";
                    let rABS = false; //是否将文件读取为二进制字符串
                    let wb; //读取完成的数据
                    let reader = new FileReader();
                    reader.onload = function (e) {
                        let bytes = new Uint8Array(reader.result);
                        let length = bytes.byteLength;
                        for (let i = 0; i < length; i++) {
                            binary += String.fromCharCode(bytes[i]);
                        }
                        let XLSX = require('xlsx');
                        if (rABS) {
                            wb = XLSX.read(btoa(fixdata(binary)), { //手动转化
                                type: 'base64'
                            });
                        } else {
                            wb = XLSX.read(binary, {
                                type: 'binary'
                            });
                        }
                        // outdata就是你想要的东西 excel导入的数据
                        outdata = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
                        // that.importData=outdata;
                        // console.log(outdata);

                        let importParams = {
                            paperId: that.formImport.paperId,//sessionStorage.paperId,
                            pwdType: that.formImport.pwdType,
                            pwd: that.formImport.pwd,
                            workUnit: that.formImport.workUnit,
                            data: outdata,
                        };
                        // console.log(outdata);
                        console.log(importParams);

                        candidateImpt(importParams).then(res => {
                            setTimeout(() => {
                                const msg = res.msg;
                                if ('成功' === msg) {
                                    that.tip(msg, 'success', '3000')
                                    that.isImportDialog = false;
                                    that.clearImportInfoCandidate();
                                    that.findListCandidate();
                                    that.fileList = [];
                                } else {
                                    that.tip(msg, 'warning', '3000')
                                }

                            }, 600);
                            // that.$refs.importFile.value = ''

                        }).catch(error => {
                            console.log(error);
                        }).finally(() => {
                            that.importing = false;
                            that.isLoading = false;
                        });

                    }
                    reader.readAsArrayBuffer(f);
                }
                if (rABS) {
                    reader.readAsArrayBuffer(f);
                } else {
                    reader.readAsBinaryString(f);
                }
            }
            ,
        }
    }
</script>
