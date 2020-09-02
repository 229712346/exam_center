<template>
  <div class="testpaper">
    <!-- 内容 -->
    <div class="pagecontent">
      <!-- 顶部按钮 -->
      <div class="headerbtn">
        <el-select
          v-model="selectSubjectModel"
          size="small"
          placeholder="请选择科目"
          @change="subChange"
        >
          <el-option
            v-for="item in selectSubjectList"
            :label="item.subjectName"
            :value="item.id"
            :key="item.id"
          ></el-option>
        </el-select>
        <el-input
          v-model="findName"
          size="small"
          clearable
          placeholder="请输入试卷名称"
          maxlength="20"
          show-word-limit
          @keyup.enter.native="findList()"
        ></el-input>
        <el-button size="small" type="primary" :loading="isLoading" @click="findList()">查询</el-button>
        <el-button size="small" type="primary" @click="addTestpaper()">添加试卷</el-button>
        <el-button size="small" type="primary" @click="addTempPaper()">添加临时试卷</el-button>
      </div>
      <!-- 表格 -->
      <div class="tablelist">
        <el-table :data="tableData" stripe border v-loading="isLoading">
          <el-table-column header-align="center" align="center" label="序号" type="index" width="70">
            <template slot-scope="scope">
              <span>{{ (currentPage - 1) * size + scope.$index + 1 }}</span>
            </template>
          </el-table-column>
          <el-table-column label="科目" prop="subjectName" header-align="center" align="center" />
          <el-table-column label="试卷名称" prop="paperName" header-align="center" align="center" />
          <el-table-column label="考试时长(分钟)" prop="timeLength" header-align="center" align="center" />
          <el-table-column label="开始时间" prop="startTime" header-align="center" align="center" />
          <el-table-column label="结束时间" prop="endTime" header-align="center" align="center" />
          <el-table-column
            label="状态"
            prop="status"
            header-align="center"
            align="center"
            width="120"
          >
            <template slot-scope="scope">
              <el-tag type="primary" v-if="scope.row.status === 0">未开始</el-tag>
              <el-tag type="success" v-if="scope.row.status === 5">进行中</el-tag>
              <el-tag type="danger" v-if="scope.row.status === 10">已结束</el-tag>
              <el-tag type="warning" v-if="scope.row.status === 20">已归档</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" header-align="center" align="center" width="300">
            <template slot-scope="scope">
              <el-button size="small" type="success" @click="detailTable(scope.row.id)">详情</el-button>
              <el-popconfirm
                icon="el-icon-info"
                iconColor="red"
                title="是否归档?"
                @onConfirm="archive(scope.row.id)"
                style="marginLeft: 10px"
              >
                <el-button
                  slot="reference"
                  size="small"
                  :disabled="scope.row.status !== 10"
                  type="success"
                >归档</el-button>
              </el-popconfirm>
              <el-button
                size="small"
                type="warning"
                @click="tableEdit(scope.row)"
                style="marginLeft: 10px"
                :disabled="scope.row.status !== 0"
              >修改</el-button>
              <el-popconfirm
                icon="el-icon-info"
                iconColor="red"
                title="是否删除?"
                @onConfirm="tableDelete(scope.row.id)"
                style="marginLeft: 10px"
              >
                <el-button slot="reference" size="small" type="danger">删除</el-button>
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
    <el-dialog
      :visible.sync="isDialog"
      width="740px"
      top="15vh"
      :title="saveOrEdit === 1 ? '添加试卷 ( 添加之后科目不可修改 )' : '试卷修改'"
      :show-close="false"
      :close-on-click-modal="false"
    >
      <div class="dialog_cont">
        <el-form
          ref="formTestpaper"
          label-position="right"
          :model="formTestpaper"
          status-icon
          label-width="100px"
          :rules="rules"
        >
          <el-row>
            <el-col :span="12">
              <el-form-item label="试卷名称:" prop="testpaperName">
                <el-input v-model="formTestpaper.testpaperName" placeholder="请输入试卷名称" size="small"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item v-if="saveOrEdit === 1" label="考试科目:" prop="subjectType">
                <el-select
                  v-model="formTestpaper.subjectType"
                  size="small"
                  placeholder="请选择考试科目"
                  @change="selectChange"
                >
                  <el-option
                    v-for="(item, index) in subjectList"
                    :key="index"
                    :label="item.subjectName"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item v-if="saveOrEdit === 0" label="考试科目:">
                <el-input size="small" v-model="subjectName" :disabled="true"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
              <el-form-item label="考试时长:" prop="testpaperTime">
                <el-input
                  v-model.number="formTestpaper.testpaperTime"
                  placeholder="请填写考试时长"
                  size="small"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="开始时间:" prop="startTime">
                <el-date-picker
                  v-model="formTestpaper.startTime"
                  type="date"
                  placeholder="开始日期"
                  size="small"
                  value-format="yyyy-MM-dd"
                  format="yyyy-MM-dd"
                />
                <el-time-picker
                  v-model="formTestpaper.starttimes"
                  placeholder="开始时间"
                  size="small"
                  value-format="HH:mm:ss"
                  format="HH:mm:ss"
                />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="10">
              <el-form-item label="单选题:" prop="radioNum">
                <el-input v-model.number="formTestpaper.radioNum" placeholder="单选题数量" size="small"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="2">
              <p style="margin: 10px">道</p>
            </el-col>
            <el-col :span="10">
              <el-form-item label="多选题:" prop="checkoutNum">
                <el-input
                  v-model.number="formTestpaper.checkoutNum"
                  placeholder="多选题数量"
                  size="small"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="2">
              <p style="margin: 10px">道</p>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="10">
              <el-form-item prop="radioCount">
                <el-select v-model="formTestpaper.radioCount" size="small" placeholder="每道题分值">
                  <el-option
                    v-for="(item, index) in countList"
                    :key="index"
                    :label="item.value"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="2">
              <p style="margin: 10px">分/道</p>
            </el-col>
            <el-col :span="10">
              <el-form-item prop="checkoutCount">
                <el-select v-model="formTestpaper.checkoutCount" size="small" placeholder="每道题分值">
                  <el-option
                    v-for="(item, index) in countList"
                    :key="index"
                    :label="item.value"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="2">
              <p style="margin: 10px">分/道</p>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="10">
              <el-form-item label="判断题:" prop="judgeNum">
                <el-input v-model.number="formTestpaper.judgeNum" placeholder="判断题数量" size="small"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="2">
              <p style="margin: 10px">道</p>
            </el-col>
            <el-col :span="10">
              <el-form-item :label="subjectiveName" prop="answerNum">
                <el-input
                  v-model.number="formTestpaper.answerNum"
                  :placeholder="subjectiveName+'数量'"
                  size="small"
                />
              </el-form-item>
            </el-col>
            <el-col :span="2">
              <p style="margin: 10px">道</p>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="10">
              <el-form-item prop="judgeCount">
                <el-select v-model="formTestpaper.judgeCount" size="small" placeholder="每道题分值">
                  <el-option
                    v-for="(item, index) in countList"
                    :key="index"
                    :label="item.name"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="2">
              <p style="margin: 10px">分/道</p>
            </el-col>
            <el-col :span="10">
              <el-form-item prop="answerCount">
                <el-select v-model="formTestpaper.answerCount" size="small" placeholder="每道题分值">
                  <el-option
                    v-for="(item, index) in countList"
                    :key="index"
                    :label="item.name"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="2">
              <p style="margin: 10px">分/道</p>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFalse('formTestpaper')" size="small">取 消</el-button>
        <el-button type="primary" @click="dialogTrue('formTestpaper')" size="small">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 考分弹框 -->
    <el-dialog :visible.sync="dialogDetail" width="80%" top="5vh" title="试卷详情">
      <div class="dialog_cont">
        <el-table :data="detailInfo" border>
          <el-table-column label="序号" type="index" width="80" align="center" />
          <el-table-column label="类型" header-align="center" align="center" width="140">
            <template slot-scope="scope">
              <el-tag type="success" v-if="scope.row.questionType === 1">单选</el-tag>
              <el-tag type="info" v-if="scope.row.questionType === 5">多选</el-tag>
              <el-tag type="warning" v-if="scope.row.questionType === 10">判断</el-tag>
              <el-tag type="danger" v-if="scope.row.questionType === 15">{{scope.row.typeName}}</el-tag>
              <el-tag type="warning" v-if="scope.row.questionType === 20">填空</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            label="试题内容"
            prop="questionContent"
            header-align="center"
            align="left"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <p style="white-space: pre-wrap">{{scope.row.questionContent}}</p>
            </template>
          </el-table-column>
          <el-table-column
            label="标准答案"
            prop="validResult"
            header-align="center"
            align="center"
            width="168"
          />
          <!--          <el-table-column label="备选答案数量" prop="resultCount" header-align="center" align="center" width="120"/>-->
          <el-table-column
            label="本题分值"
            prop="score"
            header-align="center"
            align="center"
            width="120"
          />
        </el-table>
      </div>
    </el-dialog>

    <!-- 导入临时试卷弹框 -->
    <el-dialog
      :visible.sync="isImportDialogTemp"
      width="1024px"
      top="10vh"
      :title="'临时试卷导入'"
      :show-close="false"
      :close-on-click-modal="false"
    >
      <div class="dialog_cont">
        <el-form
          ref="formImportTemp"
          label-position="right"
          :model="formImportTemp"
          status-icon
          label-width="100px"
          
        >
          <el-row>
            <el-col :span="12">
              <el-form-item label="科目:" prop="power">
                <el-select v-model="formImportTemp.subjectId" size="small" placeholder="请选择科目">
                  <el-option
                    v-for="item in importSubjectList"
                    :label="item.subjectName"
                    :value="item.id"
                    :key="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="试卷名称:" prop="power">
                <el-input
                  v-model="formImportTemp.paperName"
                  size="small"
                  placeholder="请输入试卷名称"
                  maxlength="20"
                  show-word-limit
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
                          <el-col :span="12">
              <el-form-item label="开始时间:" prop="power">
                <el-col :span="12">
                  <el-date-picker
                    v-model="formImportTemp.paperStartDate"
                    type="date"
                    placeholder="开始日期"
                    size="small"
                    value-format="yyyy-MM-dd"
                    format="yyyy-MM-dd"
                  />
                </el-col>
                <el-col :span="12">
                  <el-time-picker
                    v-model="formImportTemp.paperStartTime"
                    placeholder="时间"
                    size="small"
                    value-format="HH:mm:ss"
                    format="HH:mm:ss"
                  />
                </el-col>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="考试时长:" prop="power">
                <el-input-number
                  v-model.number="formImportTemp.paperlength"
                  placeholder="请填写考试时长"
                  size="medium"
                  style="width: 100%;"
                  :min="1" :max="1000"
                ></el-input-number>
              </el-form-item>
            </el-col>

          </el-row>
          <el-row>
            <el-col>
              <el-form-item label="文件:" prop="power">
                <el-upload
                  ref="upload"
                  :limit="limitNum"
                  :auto-upload="false"
                  accept=".docx, .doc"
                  :action="UploadUrl()"
                  :before-upload="beforeUploadFile"
                  :on-change="fileChange"
                  :on-exceed="exceedFile"
                  :on-remove="fileRemove"
                  :on-success="handleSuccess"
                  :on-error="handleError"
                  :file-list="fileList"
                >
                  <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                </el-upload>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col>
              <el-form-item label="导入说明:" prop>
                <el-image
                  :src="require(`@/assets/importWord.png`)"
                  fit="fill"
                  style="height: 450px"
                >
                  <div slot="placeholder" class="image-slot">
                    加载中
                    <span class="dot">...</span>
                  </div>
                </el-image>
              </el-form-item>
              <el-form-item label prop="power"></el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="importDialogFalse('formImportTemp')" size="small">取 消</el-button>
        <el-button size="small" type="primary" @click="uploadFile('formImportTemp')">立即上传</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getCountForSubjectList,
  getTestpaperList,
  addTestpaper,
  editTestpaper,
  detailTestpaper,
  testpaperInfo,
  deleteTestpaper,
  paperFile,
} from "@/api/testpaper.js";
import { findSubjectiveName } from "../../../api/subject";
import { getSubList } from "@/api/common.js";
import {libraryImptDocForTemp} from "@/api/libraryForWord.js"
export default {
  name: "Testpaper",
  data() {
    // 存放数据
    var testTime = (rule, value, callback) => {
      if (value === "") {
        return callback(new Error("请输入考试时间"));
      } else if (value === 0) {
        return callback(new Error("考试时间不能为0"));
      } else if (!Number.isInteger(value)) {
        callback(new Error("请输入数字值"));
      } else {
        callback();
      }
    };
    var radioRule = (rule, value, callback) => {
      const one = this.formTestpaper.radioNum.toString() > "0";
      const two = value.toString() === "0";
      const three = Number.isInteger(this.formTestpaper.radioNum);
      if (one && two && three) {
        return callback(new Error("分值不能为0"));
      } else {
        callback();
      }
    };
    var checkoutRule = (rule, value, callback) => {
      const one = this.formTestpaper.checkoutNum.toString() > "0";
      const two = value.toString() === "0";
      const three = Number.isInteger(this.formTestpaper.checkoutNum);
      if (one && two && three) {
        return callback(new Error("分值不能为0"));
      } else {
        callback();
      }
    };
    var judgeRule = (rule, value, callback) => {
      const one = this.formTestpaper.judgeNum.toString() > "0";
      const two = value.toString() === "0";
      const three = Number.isInteger(this.formTestpaper.judgeNum);
      if (one && two && three) {
        return callback(new Error("分值不能为0"));
      } else {
        callback();
      }
    };
    var answerRule = (rule, value, callback) => {
      const one = this.formTestpaper.answerNum.toString() > "0";
      const two = value.toString() === "0";
      const three = Number.isInteger(this.formTestpaper.answerNum);
      if (one && two && three) {
        return callback(new Error("分值不能为0"));
      } else {
        callback();
      }
    };
    var radioNumRule = (rule, value, callback) => {
      if (this.formTestpaper.subjectType === "") {
        return callback(new Error("请先选择考试科目"));
      } else if (value === "") {
        callback(new Error("请输入单选题数量"));
      } else if (value > this.subjectNumObj.questionType1Num) {
        callback(
          new Error(
            `单选题最大数量为 ${this.subjectNumObj.questionType1Num} 个`
          )
        );
      } else if (!Number.isInteger(value)) {
        callback(new Error("请输入数字值"));
      } else {
        callback();
      }
    };
    var checkoutNumRule = (rule, value, callback) => {
      if (this.formTestpaper.subjectType === "") {
        return callback(new Error("请先选择考试科目"));
      } else if (value === "") {
        callback(new Error("请输入多选题数量"));
      } else if (value > this.subjectNumObj.questionType5Num) {
        callback(
          new Error(
            `多选题最大数量为 ${this.subjectNumObj.questionType5Num} 个`
          )
        );
      } else if (!Number.isInteger(value)) {
        callback(new Error("请输入数字值"));
      } else {
        callback();
      }
    };
    var judgeNumRule = (rule, value, callback) => {
      if (this.formTestpaper.subjectType === "") {
        return callback(new Error("请先选择考试科目"));
      } else if (value === "") {
        callback(new Error("请输入判断题数量"));
      } else if (value > this.subjectNumObj.questionType10Num) {
        callback(
          new Error(
            `判断题最大数量为 ${this.subjectNumObj.questionType10Num} 个`
          )
        );
      } else if (!Number.isInteger(value)) {
        callback(new Error("请输入数字值"));
      } else {
        callback();
      }
    };
    var answerNumRule = (rule, value, callback) => {
      if (this.formTestpaper.subjectType === "") {
        return callback(new Error("请先选择考试科目"));
      } else if (value === "") {
        callback(new Error("请输入" + this.subjectiveName + "数量"));
      } else if (value > this.subjectNumObj.questionType15Num) {
        callback(
          new Error(
            `简答题最大数量为 ${this.subjectNumObj.questionType15Num} 个`
          )
        );
      } else if (!Number.isInteger(value)) {
        callback(new Error("请输入数字值"));
      } else {
        callback();
      }
    };
    return {
      msg: "试卷管理",

      // 加载
      isLoading: true,

      // 查询条件
      findName: "",

      // 表格数据
      tableData: [],
      totalRecord: 0, // 初始共00条数据，其实没有，等接口返回,总条数
      size: 10, // 每页的数据条数
      currentPage: 1, // 当前导航页数的默认页数

      // 添加和修改弹框
      isDialog: false,
      saveOrEdit: 1,
      testpaperId: "", // 用来修改
      subjectName: "", // 修改科目

      subjectList: [], // 科目列表
      countList: [], // 多少分值
      subjectNumObj: {}, // 题目数量最大值

      formTestpaper: {
        testpaperName: "",
        subjectType: "",
        testpaperTime: "",
        startTime: "",
        starttimes: "",
        radioNum: "",
        radioCount: "0",
        checkoutNum: "",
        checkoutCount: "0",
        judgeNum: "",
        judgeCount: "0",
        answerNum: "",
        answerCount: "0",
      },
      rules: {
        testpaperName: [
          { required: true, message: "请输入试卷名称", trigger: "blur" },
        ],
        subjectType: [
          { required: true, message: "请选择考试科目", trigger: "change" },
        ],
        testpaperTime: [
          { required: true, validator: testTime, trigger: "blur" },
        ],
        startTime: [
          { required: true, message: "请选择开始时间", trigger: "blur" },
        ],
        radioNum: [
          { required: true, validator: radioNumRule, trigger: "blur" },
        ],
        radioCount: [{ validator: radioRule, trigger: "change" }],
        checkoutNum: [
          { required: true, validator: checkoutNumRule, trigger: "blur" },
        ],
        checkoutCount: [{ validator: checkoutRule, trigger: "change" }],
        judgeNum: [
          { required: true, validator: judgeNumRule, trigger: "blur" },
        ],
        judgeCount: [{ validator: judgeRule, trigger: "change" }],
        answerNum: [
          { required: true, validator: answerNumRule, trigger: "blur" },
        ],
        answerCount: [{ validator: answerRule, trigger: "change" }],
      },
    //   importRules: {
    //     formImportTemp.subjectId: [
    //       { required: true, message: "请选择考试科目", trigger: "change" },
    //     ],
    //     formImportTempPaperName: [
    //       { required: true, message: "请输入试卷名称", trigger: "blur" },
    //     ],
    //     formImportTempPaperlength: [
    //       { required: true, message: "请输入考试时长", trigger: "blur" },
    //     ],
    //     formImportTempPaperStartDate: [
    //       { required: true, message: "请选择开始时间", trigger: "blur" },
    //     ],
    //   },

      dialogDetail: false,
      detailInfo: [], // 详情数据
      selectSubjectList: [],
      selectSubjectModel: "",
      isFirst: true,
      subjectiveName: "主观题",

      isImportDialogTemp: false,
      importSubjectModel: "",
      formImportTemp: {
        subjectId: "",
        paperName: "",
        paperlength: "",
        paperStartDate: "",
        paperStartTime: "",
        data: [],
      },
      fileList: [],
      limitNum: 1,
      importSubjectList: [],
    };
  },
  computed: {
    // 试题类型
    testType() {
      return function (type) {
        return type === 1
          ? "单选题"
          : type === 5
          ? "多选题"
          : type === 10
          ? "判断题"
          : "简答题";
      };
    },
    // 列表请求参数
    listParams: {
      get: function () {
        const data = {
          subjectId: this.selectSubjectModel,
          paperName: this.findName,
          pageSize: this.size.toString(),
          pageNumber: this.currentPage.toString(),
        };
        return data;
      },
    },
    // 添加
    addParams: {
      get: function () {
        const data = {
          paperName: this.formTestpaper.testpaperName,
          subjectId: this.formTestpaper.subjectType,
          timeLength: this.formTestpaper.testpaperTime,
          startTime:
            this.formTestpaper.startTime + " " + this.formTestpaper.starttimes,
          questionType1Num: this.formTestpaper.radioNum.toString(),
          questionType1Score: this.formTestpaper.radioCount.toString(),
          questionType5Num: this.formTestpaper.checkoutNum.toString(),
          questionType5Score: this.formTestpaper.checkoutCount.toString(),
          questionType10Num: this.formTestpaper.judgeNum.toString(),
          questionType10Score: this.formTestpaper.judgeCount.toString(),
          questionType15Num: this.formTestpaper.answerNum.toString(),
          questionType15Score: this.formTestpaper.answerCount.toString(),
        };
        return data;
      },
    },
    // 修改参数
    editParams: {
      get: function () {
        const data = {
          id: this.testpaperId,
          paperName: this.formTestpaper.testpaperName,
          subjectId: this.formTestpaper.subjectType,
          timeLength: this.formTestpaper.testpaperTime,
          startTime:
            this.formTestpaper.startTime + " " + this.formTestpaper.starttimes,
          questionType1Num: this.formTestpaper.radioNum.toString(),
          questionType1Score: this.formTestpaper.radioCount.toString(),
          questionType5Num: this.formTestpaper.checkoutNum.toString(),
          questionType5Score: this.formTestpaper.checkoutCount.toString(),
          questionType10Num: this.formTestpaper.judgeNum.toString(),
          questionType10Score: this.formTestpaper.judgeCount.toString(),
          questionType15Num: this.formTestpaper.answerNum.toString(),
          questionType15Score: this.formTestpaper.answerCount.toString(),
        };
        return data;
      },
    },
  },
  created() {
    this.getSubList();
    this.getScore();
  },
  methods: {
    // 提示信息
    tip(message, type, time) {
      this.$message({
        message: message,
        type: type,
        duration: time,
      });
    },

    // 分数列表
    getScore() {
      var start = 0;
      for (var or = 0; or <= 40; or++) {
        const obj = { value: start };
        this.countList.push(obj);
        start = start + 0.5;
      }
    },

    // 获得科目下拉框数据
    findSubjectiveName() {
      this.subjectiveName = "";
      let data = {};
      if (this.saveOrEdit === 1) {
        data = {
          id: this.formTestpaper.subjectType,
        };
      } else {
        data = {
          id: this.selectSubjectModel,
        };
      }
      findSubjectiveName(data).then((res) => {
        if ("成功" === res.msg) this.subjectiveName = res.data.subjectiveName;
      });
    },
    // 获得科目下拉框数据
    getSubList() {
      const data = {};
      getSubList(data)
        .then((res) => {
          this.subjectList = res.data.list;
          this.selectSubjectList = res.data.list;
          this.importSubjectList = res.data.list;
          if (this.selectSubjectList && this.selectSubjectList.length > 0) {
            this.selectSubjectModel = this.selectSubjectList[0].id;
            this.getList();
          } else {
            setTimeout(() => {
              this.tip("暂无科目", "warning", "1000");
              this.isLoading = false;
            }, 500);
          }
        })
        .finally(() => {
          setTimeout(() => {
            this.isLoading = false;
          }, 500);
        });
    },

    // 试卷列表
    getList() {
      this.tableData = [];
      if (this.isFirst) {
        this.currentPage = 1;
      }
      getTestpaperList(this.listParams)
        .then((res) => {
          setTimeout(() => {
            if (res.msg == "成功") {
              if (res.data.totalRecord > 0) {
                this.tableData = res.data.list;
                this.totalRecord = res.data.totalRecord;
              }
            }
            this.isLoading = false;
          }, 500);
        })
        .catch(() => {
          setTimeout(() => {
            this.isLoading = false;
          }, 500);
        })
        .finally(() => {
          setTimeout(() => {
            this.isFirst = false;
            this.isLoading = false;
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
    subChange() {
      this.isLoading = true;
      this.getList();
    },

    // 获取题数量
    selectChange(e) {
      const data = { subjectId: e };
      getCountForSubjectList(data).then((res) => {
        this.subjectNumObj = res.data;
      });
      this.findSubjectiveName();
    },

    // 表格删除
    tableDelete(id) {
      this.isLoading = true;
      const data = { id: id };
      deleteTestpaper(data)
        .then((res) => {
          this.getList();
          if (res.msg === "该试卷已经开始考试，无法删除")
            setTimeout(() => {
              this.tip("该试卷已经开始考试，无法删除", "warning", "1500");
            }, 600);
          if (res.msg === "成功")
            setTimeout(() => {
              this.tip("删除成功", "success", "1500");
            }, 600);
        })
        .finally(() => {
          setTimeout(() => {
            this.isLoading = false;
          }, 500);
        });
    },

    //  表格详情
    detailTable(id) {
      const data = { paperId: id };
      detailTestpaper(data).then((res) => {
        this.dialogDetail = true;
        this.detailInfo = res.data.list;
      });
    },

    // 回显
    testpaperInfo(row) {
      const data = { id: row.id };
      testpaperInfo(data).then((res) => {
        this.formTestpaper = {
          testpaperName: row.paperName,
          subjectType: row.subjectId,
          testpaperTime: row.timeLength,
          startTime: row.startTime.substring(0, 10),
          starttimes: row.startTime.substring(11),
          radioNum: res.data.type1Num,
          radioCount: res.data.type1Score,
          checkoutNum: res.data.type5Num,
          checkoutCount: res.data.type5Score,
          judgeNum: res.data.type10Num,
          judgeCount: res.data.type10Score,
          answerNum: res.data.type15Num,
          answerCount: res.data.type15Score,
        };
        this.isDialog = true;
      });
    },

    // 添加科目/修改项目
    clearInfo() {
      this.formTestpaper = {
        testpaperName: "",
        subjectType: "",
        testpaperTime: "",
        startTime: "",
        starttimes: "",
        radioNum: "",
        radioCount: "0",
        checkoutNum: "",
        checkoutCount: "0",
        judgeNum: "",
        judgeCount: "0",
        answerNum: "",
        answerCount: "0",
      };
    },
    addTestpaper() {
      this.saveOrEdit = 1;
      this.isDialog = true;
    },
    addTempPaper() {
      this.isImportDialogTemp = true;
    },
    tableEdit(row) {
      this.saveOrEdit = 0;
      this.testpaperId = row.id;
      this.subjectName = row.subjectName;
      this.selectChange(row.subjectId);
      this.testpaperInfo(row);
    },
    dialogFalse(formTestpaper) {
      this.isDialog = false;
      this.isLoading = false;
      this.clearInfo();
      this.$refs[formTestpaper].resetFields();
    },
    dialogTrue(formTestpaper) {
      this.$refs[formTestpaper].validate((valid) => {
        if (valid) {
          this.isLoading = true;
          const text = this.saveOrEdit === 1 ? "添加成功" : "修改成功";
          if (this.saveOrEdit === 1) {
            addTestpaper(this.addParams)
              .then((res) => {
                if (res.msg === "成功") {
                  this.isDialog = false;
                  this.clearInfo();
                  this.getList();
                  setTimeout(() => {
                    this.tip(text, "success", "1000");
                  }, 600);
                } else {
                  setTimeout(() => {
                    this.tip("请重试", "warning", "1000");
                  }, 600);
                }
              })
              .finally(() => {
                setTimeout(() => {
                  this.isLoading = false;
                  this.isDialog = false;
                }, 500);
              });
          } else {
            editTestpaper(this.editParams)
              .then((res) => {
                if (res.msg === "成功") {
                  this.isDialog = false;
                  this.clearInfo();
                  this.getList();
                  setTimeout(() => {
                    this.tip(text, "success", "1000");
                  }, 600);
                } else {
                  setTimeout(() => {
                    this.tip("请重试", "warning", "1000");
                  }, 600);
                }
              })
              .finally(() => {
                setTimeout(() => {
                  this.isLoading = false;
                  this.isDialog = false;
                }, 500);
              });
          }
        } else {
          return false;
        }
      });
    },
    //归档
    archive(id) {
      const data = { id: id };
      paperFile(data)
        .then((res) => {
          setTimeout(() => {
            if ("成功" === res.msg) {
              this.tip(res.msg, "success", "3000");
            } else {
              this.tip(res.msg, "warning", "3000");
            }
          }, 600);
          this.getList();
        })
        .finally(() => {
          setTimeout(() => {
            this.isLoading = false;
          }, 500);
        });
    },

    //清空上传信息
    clearImportInfo() {
      this.formImportTemp = {
        subjectId: "",
        paperName: "",
        paperlength: "",
        paperStartDate: "",
        paperStartTime: "",
        data: [],
      };
      this.fileList = [];
    },
    //上传取消按钮事件
    importDialogFalse(formImportTemp) {
      this.isImportDialogTemp = false;
      this.isLoading = false;
      this.clearImportInfo();
      this.$refs[formImportTemp].resetFields();
    },
    // 文件超出个数限制时的钩子
    exceedFile(files, fileList) {
      this.tip(
        `只能选择 ${this.limitNum} 个文件，当前共选择了 ${
          files.length + fileList.length
        } 个`,
        "warning",
        "2000"
      );
    },
    // 文件状态改变时的钩子
    fileChange(file, fileList) {
      // console.log(file.raw);
      this.fileList = [];
      this.fileList.push(file.raw);
      // console.log(this.fileList);
    },
    // 上传文件之前的钩子, 参数为上传的文件,若返回 false 或者返回 Promise 且被 reject，则停止上传
    beforeUploadFile(file) {
      // console.log('before upload');
      // console.log(file);
      let extension = file.name.substring(file.name.lastIndexOf(".") + 1);
      // let size = file.size / 1024 / 1024;
      if (extension !== "docx" || extension !== "doc") {
        this.tip("只能上传后缀是.docx.doc的文件", "warning", "2000");
      }
      // if(size > 10) {
      //     this.$message.warning('文件大小不得超过10M');
      // }
    },
    // 文件上传成功时的钩子
    handleSuccess(res, file, fileList) {
      // this.$message.success('文件上传成功');
    },
    // 文件上传失败时的钩子
    handleError(err, file, fileList) {
      // this.$message.error('文件上传失败');
    },
    UploadUrl: function () {
      // 因为action参数是必填项，我们使用二次确认进行文件上传时，直接填上传文件的url会因为没有参数导致api报404，所以这里将action设置为一个返回为空的方法就行，避免抛错
      return "";
    },
    //上传文件
    uploadFile(formImportTemp) {
     
          let that = this;
          if (that.formImportTemp.subjectId === "") {
            that.tip("请选择科目！", "warning", "2000");
            return;
          }
          if (that.formImportTemp.paperName === "") {
            that.tip("请填写试卷名称！", "warning", "2000");
            return;
          }
          if (that.formImportTemp.paperlength === "") {
            that.tip("请填写考试时长！", "warning", "2000");
            return;
          }
          if (that.formImportTemp.paperStartDate === "") {
            that.tip("请填写开始日期！", "warning", "2000");
            return;
          }
          if (that.formImportTemp.paperStartTime === "") {
            that.tip("请填写开始时间！", "warning", "2000");
            return;
          }
          if (that.fileList.length === 0) {
            that.tip("请选择文件！", "warning", "2000");
            return;
          }
          that.importing = true;
          that.file = this.fileList[0];
          let f = this.fileList[0];
          let importParams = {
            subjectId: that.formImportTemp.subjectId, //sessionStorage.subjectId,
            timeLength:that.formImportTemp.paperlength,
            startTime:that.formImportTemp.paperStartDate+" "+that.formImportTemp.paperStartTime,
            paperName:that.formImportTemp.paperName,
          };
          // console.log(importParams);
          libraryImptDocForTemp(importParams, f)
            .then((res) => {
              setTimeout(() => {
                this.importing = false;
                const msg = res.msg;
                if ("成功" === msg) {
                  that.tip(msg, "success", "3000");
                  that.isImportDialogTemp = false;
                  that.clearImportInfo();
                  that.getList();
                  that.fileList = [];
                } else {
                  that.tip(msg, "warning", "3000");
                }
              }, 600);
              that.$refs.importFile.value = "";
            })
            .catch((error) => {
              // console.log(error);
            })
            .finally(() => {
              that.importing = false;
              that.isImportDialog = false;
            });
       
    },
    fileRemove(file, fileList) {
      this.fileList.splice(this.fileList.indexOf(file.raw), 1);
    },
  },
};
</script>
