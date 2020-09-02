<template>
  <div class="exammark">
    <!-- 内容 -->
    <div class="pagecontent">
      <!-- 顶部按钮 -->
      <div class="headerbtn">
        <el-select v-model="selectSubjectModel" size="small" placeholder="请选择科目" @change="getPaperList">
          <el-option v-for="item in selectSubjectList" :label="item.subjectName" :value="item.id"
                     :key="item.id"></el-option>
        </el-select>
        <el-select v-model="selectPaperModel" size="small"  placeholder="请选择试卷" @change="findList">
          <el-option v-for="(item, index) in selectPaperList" :key="index" :label="item.paperName"
                     :value="item.id"></el-option>
        </el-select>
        <el-input v-model="findCard" size="small" clearable placeholder="请输入身份证号" maxlength="18"
                  show-word-limit
                  @keyup.enter.native="findList()"></el-input>
        <el-input v-model="findNo" size="small" clearable placeholder="请输入准考证号" maxlength="20"
                  show-word-limit
                  @keyup.enter.native="findList()"></el-input>
        <el-input v-model="findName" size="small" clearable placeholder="请输入姓名" maxlength="20"
                  show-word-limit
                  @keyup.enter.native="findList()"></el-input>
        <el-button size="small" type="primary" :loading="isLoading" @click="findList()">查询</el-button>
        <el-button size="small" type="primary" :loading="isExport" :disabled="tableData.length===0"
                   @click="exportList()">导出
        </el-button>
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
          <el-table-column label="姓名" prop="candidateName" header-align="center" align="center"></el-table-column>
          <el-table-column label="身份证号" prop="idCard" header-align="center" align="center"></el-table-column>
          <el-table-column label="准考证号" prop="admissionCard" header-align="center" align="center"></el-table-column>
          <el-table-column label="交卷时间" prop="commitTime" header-align="center" align="center"></el-table-column>
          <el-table-column label="客观题得分" prop="objectiveScore" header-align="center" align="center"></el-table-column>
          <el-table-column label="主观题得分" prop="subjectiveScore" header-align="center" align="center"></el-table-column>
          <el-table-column label="总得分" prop="score" header-align="center" align="center" width="110">
            <template slot-scope="scope">
              <el-tag style="width: 80px" type="danger" v-if="scope.row.score < 60">{{ scope.row.score }}</el-tag>
              <el-tag style="width: 80px" type="success" v-if="scope.row.score >= 60">{{ scope.row.score }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" header-align="center" align="center" width="100">
            <template slot-scope="scope">
              <el-button size="small" type='warning' @click="tableDetail(scope.row)">详情</el-button>
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
    <!-- 详情弹框 //:row-class-name="tableRowClassName"-->
    <el-dialog :visible.sync="dialogDetail" width="90%" top="5vh" :title="showInfo">
      <div class="dialog_cont">
        <el-table :data="detailsInfo" border v-loading="isDetail" >
          <el-table-column label="序号" type="index" width="80" align="center"/>
          <el-table-column label="类型" header-align="center" align="center" width="100px">
            <template slot-scope="scope">
              <!--              <el-tag style="width: 70px" type="info">{{ testType(scope.row.questionType) }}</el-tag>-->
              <el-tag type="success" v-if="scope.row.questionType === 1">单选</el-tag>
              <el-tag type="info" v-if="scope.row.questionType === 5">多选</el-tag>
              <el-tag type="warning" v-if="scope.row.questionType === 10">判断</el-tag>
              <el-tag type="danger" v-if="scope.row.questionType === 15">{{scope.row.typeName}}</el-tag>
              <el-tag type="warning" v-if="scope.row.questionType === 20">填空</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="试题内容" prop="questionContent" header-align="center" align="left" show-overflow-tooltip>
            <template slot-scope="scope">
<!--              <p v-html="scope.row.questionContent"></p>-->
              <p style="white-space: pre-wrap" >{{scope.row.questionContent}}</p>
            </template>
          </el-table-column>
<!--          <el-table-column label="备选答案数量" prop="resultCount" header-align="center" align="center" width="80">-->
<!--            <template slot-scope="scope">-->
<!--              <span style="width: 80px" type="danger" v-if="parseInt(scope.row.resultCount) === 0">无</span>-->
<!--              <span style="width: 80px" type="success" v-if="parseInt(scope.row.resultCount) !== 0">{{ scope.row.resultCount }}</span>-->
<!--            </template>-->
<!--          </el-table-column>-->
          <el-table-column label="本题分值" prop="score" header-align="center" align="center" width="80px"/>
          <el-table-column label="标准答案" prop="validResult" header-align="center" align="center" width="80"/>
<!--          <el-table-column label="客观题答案" prop="candidateResult" header-align="center" align="center" width="80px"/>-->
          <el-table-column label="考生答案" prop="candidateResult" header-align="center" align="left">
            <template slot-scope="scope">
              <p v-html="scope.row.candidateResult"></p>
<!--              <p style="white-space: pre-wrap" >{{scope.row.candidateResult}}</p>-->
            </template>
          </el-table-column>
          <el-table-column label="本题得分" prop="candidateScore" header-align="center" align="center" width="80px">

          </el-table-column>
        </el-table>

      </div>
    </el-dialog>
  </div>
</template>

<script>
    import { getExammarkList, exportExammark, exammarkDetail, updateForSpecial } from '@/api/exammark.js'
    import {getTestpaperList} from '../../../api/testpaper'
    import {getSubList, getPaperList} from '@/api/common.js'

    export default {
        name: 'exammark',
        data () { // 存放数据
            return {
                msg: '考分统计',
                showInfo: '',
                // 加载
                isLoading: true,
                isExport: false,
                isDetail: false,

                // 查询条件
                findId: '',
                findName: '',
                findCard: '',
                findNo: '',

                // 表格数据
                tableData: [],
                totalRecord: 0, // 初始共00条数据，其实没有，等接口返回,总条数
                size: 10, // 每页的数据条数
                currentPage: 1, // 当前导航页数的默认页数

                // 弹框
                dialogDetail: false,
                detailsInfo: [],
                exportListData: [],

                selectSubjectList: [], // 科目数据
                selectSubjectModel: '', // 科目id

                selectPaperList: [], // 试卷数据
                selectPaperModel: '', // 试卷id

                isFirst: true
            }
        },
        computed: {
            // 试题类型
            testType () {
                return function (type) {
                    return type === 1 ? '单选题'
                        : type === 5 ? '多选题'
                            : type === 10 ? '判断题'
                                : '简答题'
                }
            },
            // 列表请求参数
            listParams: {
                get: function () {
                    const data = {
                        paperId: this.selectPaperModel,
                        idCard: this.findCard,
                        admissionCard: this.findNo,
                        candidateName: this.findName,
                        pageSize: this.size.toString(),
                        pageNumber: this.currentPage.toString()
                    }
                    return data
                }
            }
        },
        created () {
            this.getSubList()
        },
        methods: {
            // 提示信息
            tip (message, type, time) {
                this.$message({
                    message: message,
                    type: type,
                    duration: time
                })
            },

            getSummaries (param) {
                const {columns, data} = param
                const sums = []
                const values = []
                columns.forEach((column, index) => {
                    if (index === 0) {
                        sums[index] = '总分'
                    } else if (index === 8) {
                        const values = data.map(item => Number(item['candidateScore']))
                        if (!values.every(value => isNaN(value))) {
                            sums[index] = values.reduce((prev, curr) => {
                                const value = Number(curr)
                                if (!isNaN(value)) {
                                    return prev + curr
                                } else {
                                    return prev
                                }
                            }, 0)
                            sums[index] += ' 分'
                        }
                    } else {
                        sums[index] = ''
                    }
                })
                return sums
            },

            tableRowClassName ({row, rowIndex}) {
                if (row.candidateScore === '0.0') {
                    return 'error-row'
                }
                return ''
            },

            // 查询的科目列表
            getSubList () {
                const data = {}
                getSubList(data).then(res => {
                    setTimeout(() => {
                        this.isLoading = false
                    }, 500)
                    if (res.msg === '成功') {
                        this.selectSubjectList = res.data.list
                    } else {
                        this.tip(res.msg, 'warning', '3000')
                    }
                    if (this.selectSubjectList.length > 0) {
                        this.selectSubjectModel = this.selectSubjectList[0].id;
                        this.getPaperList()
                    } else {
                        setTimeout(() => {
                            this.tip('暂无科目','warning','1000')
                            this.isLoading = false;
                        }, 500);
                    }
                }).finally(() => {
                    setTimeout(() => {
                        this.isLoading = false;
                    }, 500);
                });
            },

            // 试卷列表
            getPaperList () {
                let that = this
                that.isLoading = true
                that.selectPaperList = []
                const data = {subjectId: that.selectSubjectModel}
                getPaperList(data).then(res => {
                    if (res.msg === '成功') {
                        that.selectPaperList = res.data.list
                        if (that.selectPaperList.length > 0) {
                            that.selectPaperModel = that.selectPaperList[0].id
                            that.getList()
                        } else {
                            that.selectPaperList = []
                            that.selectPaperModel = ''
                            that.isLoading = false
                            that.tableData = []
                            that.totalRecord = 0
                        }
                    } else {
                        that.tip(res.msg, 'warning', '3000')
                    }
                }).finally(() => {
                    setTimeout(() => {
                        this.isLoading = false;
                    }, 500);
                });
            },

            // 考分列表
            getList () {
                this.tableData = []
                if (this.isFirst) {
                    this.currentPage = 1
                }
                if (this.selectPaperModel === '') {
                    this.tip('请至少选择一份试卷', 'warning', '3000')
                    this.isLoading = false
                    this.totalRecord = 0
                } else {
                    getExammarkList(this.listParams).then(res => {
                        setTimeout(() => {
                            if (res.msg === '成功') {
                                if (res.data.totalRecord > 0) {
                                    this.tableData = res.data.list
                                    this.totalRecord = res.data.totalRecord
                                } else {
                                    this.totalRecord = 0
                                }
                            } else {
                                this.tip(res.msg, 'warning', '3000')
                            }
                            this.isLoading = false
                        }, 500)
                    }).catch(() => {
                        setTimeout(() => {
                            this.isLoading = false
                        }, 500)
                    }).finally(() => {
                        setTimeout(() => {
                            this.isLoading = false;
                        }, 500);
                    });
                }
            },
            // 分页
            handleSizeChange (e) {
                this.isLoading = true
                this.size = e
                this.getList()
            },
            handleCurrentChange (e) {
                this.isLoading = true
                this.currentPage = e
                this.getList()
            },

            // 查询
            findList () {
                this.isLoading = true
                this.isFirst = true
                this.getList()
            },
            // 修改为正确答案
            changeRight (row, index) {
                const data = {
                    paperSheetId: row.id,
                    paperId: row.paperId,
                    libraryId: row.libraryId,
                    candidateId: row.candidateId
                }
                console.log(row)
                updateForSpecial(data).then(res => {
                    setTimeout(() => {
                        this.isDetail = false
                        // this.dialogMarkingDetail = false;
                        if (res.msg === '成功') {
                            this.tip(res.msg, 'success', '3000')
                            // 下面两行把当前的按钮隐藏
                            row.candidateScore = row.score
                            this.$set(this.tableData, index, row)
                        } else {
                            this.tip(res.msg, 'warning', '3000')
                        }
                    }, 600)
                    this.getList()
                })
            },
            // 导出
            exportList () {
                this.isExport = true
                const data = {
                    paperId: this.selectPaperModel,
                    idCard: this.findCard,
                    admissionCard: this.findNo,
                    candidateName: this.findName
                }
                exportExammark(data).then(res => {
                    setTimeout(() => {
                        this.isExport = false
                    }, 600)

                    console.log(res)
                    const content = res
                    const blob = new Blob([content], {type: 'application/vnd.ms-excel;charset=utf-8'})
                    let yy = new Date().getFullYear()
                    let mm = new Date().getMonth() + 1
                    let dd = new Date().getDate()
                    let hh = new Date().getHours()
                    let mf = new Date().getMinutes() < 10 ? '0' + new Date().getMinutes() : new Date().getMinutes()
                    let ss = new Date().getSeconds() < 10 ? '0' + new Date().getSeconds() : new Date().getSeconds()
                    let nowTime = '' + yy + mm + dd + hh + mf + ss
                    const fileName = '分数统计' + nowTime + '.xls'
                    if ('download' in document.createElement('a')) { // 非IE下载
                        const elink = document.createElement('a')
                        elink.download = fileName
                        elink.style.display = 'none'
                        elink.href = URL.createObjectURL(blob)
                        document.body.appendChild(elink)
                        elink.click()
                        URL.revokeObjectURL(elink.href)// 释放URL 对象
                        document.body.removeChild(elink)
                    } else { // IE10+下载
                        navigator.msSaveBlob(blob, fileName)
                    }
                })
            },

            // 详情
            tableDetail (row) {
                this.isDetail = true
                this.dialogDetail = true
                const data = {
                    paperId: row.paperId,
                    candidateId: row.candidateId,
                    idCard: row.idCard,
                    candidateName: row.candidateName,
                    score: row.score
                }
                this.showInfo = '考生信息【身份证：' + data.idCard + ' 姓名：' + data.candidateName + '】'
                exammarkDetail(data).then(res => {
                    setTimeout(() => {
                        this.isDetail = false
                    }, 600)
                    if (res.msg === '成功') {
                        this.detailsInfo = res.data.list
                    } else {
                        this.tip(res.msg, 'warning', '3000')
                    }
                }).finally(() => {
                    setTimeout(() => {
                        this.isLoading = false;
                        this.isDetail=false;
                    }, 500);
                });

            }

        }
    }
</script>
