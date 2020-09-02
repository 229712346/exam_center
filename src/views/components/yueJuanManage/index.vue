<template>
  <div class="yueJuanManage">
    <!-- 内容 -->
    <div class="pagecontent">
      <!-- 顶部按钮 -->
      <div class="headerbtn">
        <el-select v-model="selectSubjectModel" size="small" placeholder="请选择科目" @change="getPaperListForSelect">
          <el-option v-for="item in selectSubjectList" :label="item.subjectName" :value="item.id"
                     :key="item.id"></el-option>
        </el-select>
        <el-select v-model="selectPaperModel" size="small"  placeholder="请选择试卷" @change="getList">
          <el-option v-for="(item, index) in selectPaperList" :key="index" :label="item.paperName"
                     :value="item.id"></el-option>
        </el-select>
        <el-input v-model="findCard" size="small" clearable placeholder="请输入身份证号"  maxlength="18"
                  show-word-limit
                  @keyup.enter.native="findList()"></el-input>
        <el-input v-model="findNo" size="small" clearable placeholder="请输入准考证号" maxlength="20"
                  show-word-limit
                  @keyup.enter.native="findList()"></el-input>
        <el-input v-model="findName" size="small" clearable placeholder="请输入姓名" maxlength="20"
                  show-word-limit
                  @keyup.enter.native="findList()"></el-input>
        <el-button size="small" type="primary" :loading="isLoading" @click="findList()">查询</el-button>
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
          <el-table-column label="主观题得分" prop="subjectiveScore" header-align="center" align="center"></el-table-column>

          <el-table-column label="状态" prop="markingStatus" header-align="center" align="center" width="120">
            <template slot-scope="scope">
              <el-tag type="info" v-if="scope.row.markingStatus === 0">未阅卷</el-tag>
              <el-tag type="success" v-if="scope.row.markingStatus === 1">已阅卷</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" header-align="center" align="center" width="100">
            <template slot-scope="scope">
              <el-button size="small" type='warning' @click="tableDetail(scope.row)">阅卷</el-button>
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
      @current-change="handleCurrentChange"></el-pagination>
    <!-- 考生的简答题列表 -->
    <el-dialog :visible.sync="dialogMarkingDetail" width="90%" top="5vh" :title="candidateInfo">
      <div class="dialog_cont">
        <el-table :data="detailsMarkingInfo" border v-loading="isDetail">
          <el-table-column label="序号" type="index" width="80" align="center"></el-table-column>

          <el-table-column label="试题内容" prop="questionContent" header-align="center" align="left" show-overflow-tooltip>
            <template slot-scope="scope">
<!--              <p v-html="scope.row.questionContent"></p>-->
              <p style="white-space: pre-wrap" >{{scope.row.questionContent}}</p>
            </template>
          </el-table-column>
          <el-table-column label="试题解说" prop="explainInfo" header-align="center" align="left"></el-table-column>
          <el-table-column label="考生答案" prop="shortAnswer" header-align="center" align="left">
            <template slot-scope="scope">
              <p v-html="scope.row.shortAnswer"></p>
<!--              <p style="white-space: pre-wrap" >{{scope.row.shortAnswer}}</p>-->
            </template>

          </el-table-column>

          <el-table-column label="是否答题" header-align="center" align="center" width="150px">
            <template slot-scope="scope">
              <el-tag type="success" v-if="parseInt(scope.row.scoreDetailId) > 0">已答题</el-tag>
              <el-tag type="info" v-if="parseInt(scope.row.scoreDetailId) === 0">未答题</el-tag>

            </template>
          </el-table-column>
          <el-table-column label="此题分值" prop="score" header-align="center" align="center" width="80"></el-table-column>
          <el-table-column label="考生得分" header-align="center" align="center" width="160px">

            <template slot-scope="scope">
              <el-input-number size="mini" :precision="1" :disabled="parseInt(scope.row.scoreDetailId)===0"
                               v-model="scope.row.candidateScore"
                               :min="0"
                               :max="scope.row.score"
              >
              </el-input-number>
            </template>
          </el-table-column>
          <!--          <el-table-column label="操作" header-align="center" align="center" width="150">-->
          <!--            <template slot-scope="scope" v-if="scope.row.candidateScore === '0.0'">-->
          <!--              <el-popconfirm icon="el-icon-info" iconColor="red" title="修改为正确答案?"-->
          <!--                             @onConfirm="changeRight(scope.row,scope.index)">-->
          <!--                <el-button slot="reference" size="small" type='danger'>修改为正确答案</el-button>-->
          <!--              </el-popconfirm>-->
          <!--            </template>-->
          <!--          </el-table-column>-->
        </el-table>

      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFalse()" size="small">取 消</el-button>
        <el-button type="primary" @click="commitScore()" size="small"  :loading="isLoading">提交分数</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
    import { getYueJuanManageList, getListForMarking, saveForMarking } from '@/api/yueJuanManage.js'
    import {getSubList, getPaperList} from '@/api/common.js'
    export default {
        name: 'yueJuanManage',
        data() { // 存放数据
            return {
                msg: '阅卷管理',
                // 加载
                isLoading: true,
                isExport: false,
                isDetail: false,


                findName: '',
                findCard: '',
                findNo: '',
                testPaperList: [], // 试卷列表

                // 表格数据
                tableData: [],
                totalRecord: 0, // 初始共00条数据，其实没有，等接口返回,总条数
                size: 10, // 每页的数据条数
                currentPage: 1, // 当前导航页数的默认页数

                // 弹框
                dialogMarkingDetail: false,
                detailsMarkingInfo: [],
                candidateInfo: '',
                candidateId:0,
                selectSubjectList:[],
                selectSubjectModel:'',
                selectPaperList: [],//查询试卷
                selectPaperModel:'',
                isFirst:true,
            }
        },
        computed: {
            // 试题类型
            testType() {
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
                    };
                    return data
                }
            }
        },
        created() {
            this.getSubjectListForSelect();
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
                            this.tip('暂无科目','warning','1000')
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
                    }, 500)
                });
            },
            // 试卷列表
            getPaperListForSelect() {
                this.isLoading = true
                let that = this;
                that.selectPaperList = [];
                const data = {
                    subjectId: that.selectSubjectModel
                }
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
                                // this.getListCandidate();
                                this.getList();
                            } else {
                            	that.selectPaperModel = '';
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
                    }, 500)
                });
            },
            // 阅卷列表
            getList() {
                this.isLoading = true
                this.tableData = [];
                if (this.selectPaperModel === '') {
                    this.tip('请至少选择一份试卷', 'warning', '3000');
                    this.isLoading = false
                } else {
                    if (this.isFirst) {
                        this.currentPage = 1;
                    }
                    getYueJuanManageList(this.listParams).then(res => {
                        setTimeout(() => {
                            if ('成功' === res.msg) {
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
                        this.isLoading = false;
                        }, 500);
                    }).finally(() => {
                        setTimeout(() => {
                            this.isLoading = false;
                        }, 500)
                    });
                }
            }
            ,
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
                this.getList()
            },
            // 详情
            tableDetail(row) {
                this.isDetail = true;
                this.dialogMarkingDetail = true;
                const data = {
                    paperId: row.paperId,
                    candidateId: row.candidateId,
                    idCard: row.idCard,
                    candidateName: row.candidateName,
                    score: row.score,
                };
                this.candidateId=row.candidateId;
                console.log("this.candidateId="+this.candidateId);
                this.candidateInfo = '考生简答题列表-考生信息【身份证：' + data.idCard + ' 姓名：' + data.candidateName + '】';
                getListForMarking(data).then(res => {
                    setTimeout(() => {
                        this.isDetail = false
                    }, 600);
                    if ('成功' === res.msg) {
                        this.detailsMarkingInfo = res.data.list;
                    } else {
                        this.tip(res.msg, 'warning', '3000')
                    }
                }).finally(() => {
                    setTimeout(() => {
                        this.isLoading = false;
                        this.isDetail=false;
                    }, 500)
                });
            },
            dialogFalse() {
                this.dialogMarkingDetail = false;
                this.candidateId=0;
            },
            commitScore() {
                let that = this;
                // debugger
                // console.log(that.detailsMarkingInfo)
                let scoreNull = false;
                let nullIndex = 0;
                let outIndex = 0;
                let outScore = false;
                for (let i = 0; i < that.detailsMarkingInfo.length; i++) {//判断是否填写和是否超出此题分值
                    let tempData = that.detailsMarkingInfo[i];
                    console.log(tempData.candidateScore);
                    if (tempData.candidateScore == null) {
                        scoreNull = true;
                        nullIndex = i + 1;
                        break;
                    }
                    if (parseFloat(tempData.candidateScore) > parseFloat(tempData.score)) {
                        outScore = true;
                        outIndex = i + 1;
                        break;
                    }
                }
                if (scoreNull) {
                    that.tip('第' + nullIndex + '行得分没有填写，请检查', 'warning', '3000');
                    return;
                }
                if (outScore) {
                    that.tip('第' + outIndex + '行得分超出此题分值，请检查', 'error', '3000');
                    return;
                }
                let commitDataList = [];

                for (let i = 0; i < that.detailsMarkingInfo.length; i++) {//循环要提交的数据
                    let tempData = that.detailsMarkingInfo[i];
                    const oneData = {
                        candidateId: that.candidateId,
                        paperId: tempData.paperId,
                        scoreDetailId: tempData.scoreDetailId,
                        score: tempData.candidateScore,
                    }
                    commitDataList.push(oneData);
                }
                // console.log(commitDataList);
                // debugger
                this.isLoading=true;
                saveForMarking(commitDataList).then(res => {
                    that.dialogMarkingDetail = false;
                    if ('成功' === res.msg) {
                        that.tip(res.msg, 'success', '3000')
                    } else {
                        that.tip(res.msg, 'warning', '3000')
                    }
                    that.candidateId=0;
                    that.getList();
                }).finally(()=>{
                    this.isLoading=false;
                    this.detailsMarkingInfo=false;
                })
            }
        }
    }
</script>

