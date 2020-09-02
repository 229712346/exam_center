<!--<template>-->
<!--  <div class="first" v-loading="importing"-->
<!--       element-loading-text="正在导入...."-->
<!--       element-loading-spinner="el-icon-loading"-->
<!--       element-loading-background="rgba(0, 0, 0, 0.8)"-->

<!--       style="width: 100%">-->
<!--    &lt;!&ndash; 内容 &ndash;&gt;-->
<!--    <div class="pagecontent">-->
<!--      &lt;!&ndash; 顶部按钮 &ndash;&gt;-->
<!--      <div class="headerbtn">-->
<!--        <el-select v-model="selectPaperModel" size="small" placeholder="请选择科目" clearable>-->
<!--          <el-option v-for="item in paperList" :label="item.subjectName" :value="item.id" :key="item.id"></el-option>-->
<!--        </el-select>-->
<!--        <el-button size="small" type="primary" :loading="isLoading" @click="findList()">查询</el-button>-->
<!--        &lt;!&ndash;                <el-button size="small" type="primary" @click="addLibrary()">添加试题</el-button>&ndash;&gt;-->
<!--        <el-button size="small" type="primary" @click="askImportLibrary()">导入题库</el-button>-->
<!--      </div>-->
<!--      &lt;!&ndash; 表格 &ndash;&gt;-->
<!--      <div class="tablelist">-->
<!--        <el-table :data="tableData" stripe border v-loading="isLoading">-->
<!--          <el-table-column header-align="center" align="center" label="序号" type="index" width="70">-->
<!--            <template slot-scope="scope">-->
<!--              <span>{{ (currentPage - 1) * size + scope.$index + 1 }}</span>-->
<!--            </template>-->
<!--          </el-table-column>-->
<!--          <el-table-column label="题型" prop="questionType" header-align="center" align="center" width="70">-->
<!--            <template slot-scope="scope">-->
<!--              <el-tag type="success" v-if="scope.row.questionType === 1">单选</el-tag>-->
<!--              <el-tag type="info" v-if="scope.row.questionType === 5">多选</el-tag>-->
<!--              <el-tag type="warning" v-if="scope.row.questionType === 10">判断</el-tag>-->
<!--              <el-tag type="danger" v-if="scope.row.questionType === 15">简答</el-tag>-->

<!--            </template>-->
<!--          </el-table-column>-->
<!--          <el-table-column label="题目内容" prop="questionContent" header-align="center" align="left" show-overflow-tooltip>-->
<!--            <template slot-scope="scope">-->
<!--              <p v-html='scope.row.questionContent'></p>-->
<!--            </template>-->
<!--          </el-table-column>-->
<!--          <el-table-column label="选项数量" prop="resultCount" header-align="center" align="center" width="80"/>-->
<!--          <el-table-column label="正确答案" prop="answer" header-align="center" align="center" width="80"/>-->

<!--          <el-table-column label="答案解说" prop="explainInfo" header-align="center" align="center"/>-->
<!--          <el-table-column label="操作" header-align="center" align="center" width="150">-->
<!--            <template slot-scope="scope">-->
<!--              &lt;!&ndash;                            <el-button size="small" type='warning' @click="tableEdit(scope.$index, scope.row )">修改</el-button>&ndash;&gt;-->
<!--              <el-popconfirm icon="el-icon-info" iconColor="red" title="是否删除?" @onConfirm="tableDelete(scope.row.id)"-->
<!--                             style="marginLeft: 10px">-->
<!--                <el-button slot="reference" size="small" type='danger'>删除</el-button>-->
<!--              </el-popconfirm>-->
<!--            </template>-->
<!--          </el-table-column>-->
<!--        </el-table>-->
<!--      </div>-->
<!--    </div>-->
<!--    &lt;!&ndash; 分页 hide-on-single-page&ndash;&gt;-->
<!--    <el-pagination-->
<!--      class="pagination"-->
<!--      v-if="totalRecord"-->
<!--      :page-sizes="[5, 10, 20, 30]"-->
<!--      :page-size="size"-->
<!--      :current-page="currentPage"-->
<!--      :total="totalRecord"-->
<!--      background-->
<!--      layout=" total, sizes, prev, pager, next, jumper"-->
<!--      @size-change="handleSizeChange"-->
<!--      @current-change="handleCurrentChange"-->
<!--    />-->
<!--    &lt;!&ndash; 添加修改弹框 &ndash;&gt;-->
<!--    <el-dialog :visible.sync="isDialog" width="1020px" height="400px" top="15vh" center-->
<!--               :title="saveOrEdit === 1 ? '添加试题' : '修改试题'"-->
<!--               :show-close="false" :close-on-click-modal="false">-->
<!--      <div class="dialog_cont">-->
<!--        <el-form ref="formLibrary" label-position="right" :model="formLibrary" status-icon label-width="100px"-->
<!--        >-->
<!--          <el-form-item label="科目:" prop="subjectId">-->

<!--            <el-select v-model="formLibrary.subjectId" size="small" placeholder="请选择科目">-->
<!--              <el-option v-for="item in addOrEditPaperList" :label="item.subjectName" :value="item.id"-->
<!--                         :key="item.id"></el-option>-->
<!--            </el-select>-->
<!--          </el-form-item>-->
<!--          <el-form-item label="题型:" prop="questionType">-->
<!--            <el-radio-group v-model="formLibrary.questionType" @change="questionTypeChange">-->
<!--              <el-radio label="1">单选</el-radio>-->
<!--              <el-radio label="5">多选</el-radio>-->
<!--              <el-radio label="10">判断</el-radio>-->
<!--              <el-radio label="15">简答</el-radio>-->
<!--            </el-radio-group>-->
<!--          </el-form-item>-->
<!--          <el-form-item label="选项数量:" prop="resultCount" v-show="isResultCount">-->
<!--            <el-input-number v-model="formLibrary.resultCount" :min="2" :max="7" label="选项数量"-->
<!--                             @change="resultCountChange"></el-input-number>-->
<!--          </el-form-item>-->
<!--          <el-form-item label="正确答案:" prop="questionItemRadio" v-show="formLibrary.questionType==1">-->
<!--            <el-radio-group v-model="questionItemRadio">-->
<!--              <el-radio label="A">A</el-radio>-->
<!--              <el-radio label="B">B</el-radio>-->
<!--              <el-radio label="C" v-show="formLibrary.resultCount>=3">C</el-radio>-->
<!--              <el-radio label="D" v-show="formLibrary.resultCount>=4">D</el-radio>-->
<!--              <el-radio label="E" v-show="formLibrary.resultCount>=5">E</el-radio>-->
<!--              <el-radio label="F" v-show="formLibrary.resultCount>=6">F</el-radio>-->
<!--              <el-radio label="G" v-show="formLibrary.resultCount>=7">G</el-radio>-->
<!--            </el-radio-group>-->


<!--          </el-form-item>-->
<!--          <el-form-item label="正确答案:" prop="questionItemCheckbox" v-show="formLibrary.questionType==5">-->
<!--            <el-checkbox-group v-model="questionItemCheckbox">-->
<!--              <el-checkbox label="A"></el-checkbox>-->
<!--              <el-checkbox label="B"></el-checkbox>-->
<!--              <el-checkbox label="C" v-show="formLibrary.resultCount>=3"></el-checkbox>-->
<!--              <el-checkbox label="D" v-show="formLibrary.resultCount>=4"></el-checkbox>-->
<!--              <el-checkbox label="E" v-show="formLibrary.resultCount>=5"></el-checkbox>-->
<!--              <el-checkbox label="F" v-show="formLibrary.resultCount>=6"></el-checkbox>-->
<!--              <el-checkbox label="G" v-show="formLibrary.resultCount>=7"></el-checkbox>-->
<!--            </el-checkbox-group>-->
<!--          </el-form-item>-->
<!--          <el-form-item label="正确答案:" prop="questionItemSelect" v-show="formLibrary.questionType==10">-->
<!--            <el-radio-group v-model="questionItemSelect">-->
<!--              <el-radio label="A">A</el-radio>-->
<!--              <el-radio label="B">B</el-radio>-->
<!--            </el-radio-group>-->
<!--          </el-form-item>-->

<!--          &lt;!&ndash;          <el-form-item label="正确答案:" prop="resultCount" v-show="formLibrary.questionType==15">&ndash;&gt;-->
<!--          &lt;!&ndash;            <el-input type="textarea" v-model="formLibrary.subjectid" size="small" :rows="4"></el-input>&ndash;&gt;-->
<!--          &lt;!&ndash;          </el-form-item>&ndash;&gt;-->

<!--          <el-form-item label="题目内容:" prop="questionContent">-->
<!--            &lt;!&ndash;            <quill-editor-goods :deflate-content="formLibrary.questionContent" v-model="formLibrary.questionContent"&ndash;&gt;-->
<!--            &lt;!&ndash;                                ref="editor"&ndash;&gt;-->
<!--            &lt;!&ndash;                                :change-content="changeContent"/>&ndash;&gt;-->

<!--            <quill-editor-->
<!--              v-model="formLibrary.questionContent"-->
<!--              ref="myQuillEditor"-->
<!--              :options="editorOption">-->
<!--            </quill-editor>-->

<!--          </el-form-item>-->
<!--          <el-form-item label="答案解说:" prop="explainInfo">-->
<!--            <el-input v-model="formLibrary.explainInfo" size="small"></el-input>-->
<!--          </el-form-item>-->
<!--        </el-form>-->
<!--      </div>-->
<!--      <div slot="footer" class="dialog-footer">-->
<!--        <el-button @click="dialogFalse('formLibrary')" size="small">取 消</el-button>-->
<!--        <el-button type="primary" @click="dialogTrue('formLibrary')" size="small">确 定</el-button>-->
<!--      </div>-->
<!--    </el-dialog>-->
<!--    &lt;!&ndash; 导入试题弹框 &ndash;&gt;-->
<!--    <el-dialog :visible.sync="isImportDialog" width="1024px" top="15vh" :title="'题库导入'"-->
<!--               :show-close="false" :close-on-click-modal="false">-->
<!--      <div class="dialog_cont">-->
<!--        <el-form ref="formImport" label-position="right" :model="formImport" status-icon label-width="100px"-->
<!--        >-->

<!--          <el-form-item label="科目:" prop="power">-->
<!--            <el-select v-model="importSubjectModel" size="small" placeholder="请选择科目">-->
<!--              <el-option v-for="item in importSubjectList" :label="item.subjectName" :value="item.id"-->
<!--                         :key="item.id"></el-option>-->
<!--            </el-select>-->
<!--          </el-form-item>-->
<!--          <el-form-item label="文件:" prop="power">-->
<!--            <el-upload-->
<!--              ref="upload"-->
<!--              :limit=limitNum-->
<!--              :auto-upload="false"-->
<!--              accept=".xlsx,.xls"-->
<!--              :action="UploadUrl()"-->
<!--              :before-upload="beforeUploadFile"-->
<!--              :on-change="fileChange"-->
<!--              :on-exceed="exceedFile"-->
<!--              :on-success="handleSuccess"-->
<!--              :on-error="handleError"-->
<!--              :file-list="fileList">-->
<!--              <el-button slot="trigger" size="small" type="primary">选取文件</el-button>-->
<!--            </el-upload>-->
<!--          </el-form-item>-->
<!--          <el-form-item label="导入说明:" prop="">-->
<!--            <el-image :src="require(`@/assets/libraryImportNew.png`)" fit="fill" style="height: 350px">-->
<!--              <div slot="placeholder" class="image-slot">-->
<!--                加载中<span class="dot">...</span>-->
<!--              </div>-->
<!--            </el-image>-->
<!--          </el-form-item>-->
<!--          <el-form-item label="" prop="power">-->
<!--          </el-form-item>-->
<!--        </el-form>-->
<!--      </div>-->
<!--      <div slot="footer" class="dialog-footer">-->
<!--        <el-button @click="importDialogFalse('formImport')" size="small">取 消</el-button>-->
<!--        <el-button size="small" type="primary" @click="uploadFile">立即上传</el-button>-->
<!--      </div>-->
<!--    </el-dialog>-->
<!--  </div>-->
<!--</template>-->

<!--<script>-->
<!--    import {-->
<!--        getSubjectAllList,-->
<!--        libraryImpt,-->
<!--        getLibraryList,-->
<!--        addLibrary,-->
<!--        editLibrary,-->
<!--        deleteLibrary,-->
<!--    } from '@/api/library.js';-->
<!--    import {getSubjectListByStatus} from "../../../api/subject";-->

<!--    const toolbarOptions = [-->
<!--        ['bold', 'italic', 'underline', 'strike'], // 加粗 斜体 下划线 删除线-->
<!--        // ['blockquote', 'code-block'], // 引用  代码块-->
<!--        [{header: 1}, {header: 2}], // 1、2 级标题-->
<!--        [{list: 'ordered'}, {list: 'bullet'}], // 有序、无序列表-->
<!--        [{script: 'sub'}, {script: 'super'}], // 上标/下标-->
<!--        [{indent: '-1'}, {indent: '+1'}], // 缩进-->
<!--        [{'direction': 'rtl'}], // 文本方向-->
<!--        [{size: ['small', false, 'large', 'huge']}], // 字体大小-->
<!--        [{header: [1, 2, 3, 4, 5, 6, false]}], // 标题-->
<!--        [{color: []}, {background: []}], // 字体颜色、字体背景颜色-->
<!--        //   [{ font: [] }], // 字体种类-->
<!--        [{align: []}], // 对齐方式-->
<!--        ['clean'], // 清除文本格式-->
<!--        ['link', 'image', 'video'] // 链接、图片、视频-->
<!--    ]-->
<!--    export default {-->
<!--        name: 'ListForPaper',-->
<!--        data() { // 存放数据-->
<!--            return {-->
<!--                msg: '题库管理',-->
<!--                // 加载-->
<!--                isLoading: true,-->
<!--                // 查询条件-->
<!--                isDialog: false,-->
<!--                isImportDialog: false,-->
<!--                saveOrEdit: 1,-->
<!--                // 表格数据-->
<!--                tableData: [],-->
<!--                totalRecord: 0, // 初始共00条数据，其实没有，等接口返回,总条数-->
<!--                size: 10, // 每页的数据条数-->
<!--                currentPage: 1, // 当前导航页数的默认页数-->

<!--                Id: '',-->
<!--                paperList: [],//查询科目-->
<!--                importSubjectList: [],//导入的科目列表-->
<!--                addOrEditPaperList: [],//添加和编辑科目列表-->
<!--                formImport: {-->
<!--                    subjectId: this.selectPaperModel,//sessionStorage.subjectId,-->
<!--                    data: [],-->
<!--                },-->
<!--                formLibrary: {-->
<!--                    subjectId: '',//添加和编辑查询科目: '',-->
<!--                    questionType: '1',-->
<!--                    questionContent: '',-->
<!--                    resultCount: '4',-->
<!--                    explainInfo: '',-->
<!--                    a: 0,-->
<!--                    b: 0,-->
<!--                    c: 0,-->
<!--                    d: 0,-->
<!--                    e: 0,-->
<!--                    f: 0,-->
<!--                    g: 0,-->
<!--                },-->
<!--                selectPaperModel: '',//查询科目-->
<!--                importSubjectModel: '',//导入的查询科目-->

<!--                importing: false,-->
<!--                importData: [],-->
<!--                limitNum: 1,  // 上传excell时，同时允许上传的最大数-->
<!--                fileList: [],   // excel文件列表-->
<!--                Id: '',-->

<!--                questionItemCheckbox: [],-->
<!--                questionItemSelect: [],-->
<!--                questionItemRadio: [],-->
<!--                isResultCount: true,-->
<!--                editorOption: {-->
<!--                    placeholder: "请输入...",-->
<!--                    modules: {-->
<!--                        toolbar: {-->
<!--                            container: toolbarOptions-->
<!--                        }-->
<!--                    }-->
<!--                },-->
<!--                isFirst:true,-->
<!--            }-->
<!--        },-->
<!--        computed: {-->
<!--            // 科目列表请求参数-->
<!--            paperListParams: {-->
<!--                get: function () {-->
<!--                    const data = {-->
<!--                        pageSize: 99999,-->
<!--                        pageNumber: 1-->
<!--                    };-->
<!--                    return data;-->
<!--                }-->
<!--            },-->
<!--            importSubjectParams: {-->
<!--                get: function () {-->
<!--                    const data = {-->
<!--                        status: 0,-->
<!--                    };-->
<!--                    return data;-->
<!--                }-->
<!--            },-->
<!--            // 列表请求参数-->
<!--            listParams: {-->
<!--                get: function () {-->
<!--                    const data = {-->
<!--                        subjectId: this.selectPaperModel,-->
<!--                        pageSize: this.size.toString(),-->
<!--                        pageNumber: this.currentPage.toString()-->
<!--                    }-->
<!--                    return data;-->
<!--                }-->
<!--            },-->
<!--            // 添加-->
<!--            addParams: {-->
<!--                get: function () {-->
<!--                    const data = {-->
<!--                        subjectId: this.formLibrary.subjectId,-->
<!--                        questionType: this.formLibrary.questionType,-->
<!--                        questionContent: this.formLibrary.questionContent,-->
<!--                        resultCount: this.formLibrary.resultCount,-->
<!--                        explainInfo: this.formLibrary.explainInfo,-->
<!--                        a: this.formLibrary.a,-->
<!--                        b: this.formLibrary.b,-->
<!--                        c: this.formLibrary.c,-->
<!--                        d: this.formLibrary.d,-->
<!--                        e: this.formLibrary.e,-->
<!--                        f: this.formLibrary.f,-->
<!--                        g: this.formLibrary.g,-->

<!--                    }-->
<!--                    return data;-->
<!--                }-->
<!--            },-->
<!--            // 修改参数-->
<!--            editParams: {-->
<!--                get: function () {-->
<!--                    const data = {-->
<!--                        id: this.Id,-->
<!--                        questionType: this.formLibrary.questionType,-->
<!--                        questionContent: this.formLibrary.questionContent,-->
<!--                        resultCount: this.formLibrary.resultCount,-->
<!--                        explainInfo: this.formLibrary.explainInfo,-->
<!--                        a: this.formLibrary.a,-->
<!--                        b: this.formLibrary.b,-->
<!--                        c: this.formLibrary.c,-->
<!--                        d: this.formLibrary.d,-->
<!--                        e: this.formLibrary.e,-->
<!--                        f: this.formLibrary.f,-->
<!--                        g: this.formLibrary.g,-->

<!--                    };-->
<!--                    return data;-->
<!--                }-->
<!--            }-->
<!--        },-->
<!--        created() {-->
<!--            this.getSubjectAllList();-->
<!--            this.getSubjectListByStatus();-->

<!--        },-->
<!--        methods: {-->
<!--            //提示框-->
<!--            tip(message, type, time) {-->
<!--                this.$message({-->
<!--                    message: message,-->
<!--                    type: type,-->
<!--                    duration: time-->
<!--                })-->
<!--            },-->

<!--            //题型改变事件-->
<!--            questionTypeChange(val) {-->
<!--                // this.formLibrary.questionType = val;-->
<!--                // this.clearInfo();-->
<!--                if (this.formLibrary.questionType === '10') {-->
<!--                    this.isResultCount = false;-->
<!--                    this.formLibrary.resultCount = 2;-->
<!--                } else {-->
<!--                    this.isResultCount = true;-->
<!--                }-->
<!--                if (this.formLibrary.questionType === '15') {-->
<!--                    this.isResultCount = false;-->
<!--                    this.formLibrary.resultCount = 4;-->
<!--                } else {-->
<!--                    this.isResultCount = true;-->
<!--                }-->
<!--            },-->
<!--            resultCountChange(currentValue, oldValue) {-->

<!--            },-->
<!--            // 科目列表-->
<!--            getSubjectAllList() {-->
<!--                getSubjectAllList(this.paperListParams).then(res => {-->
<!--                    setTimeout(() => {-->
<!--                        this.isLoading = false;-->
<!--                    }, 500);-->
<!--                    if ('成功' === res.msg) {-->
<!--                        this.paperList = res.data.list;-->
<!--                        this.addOrEditPaperList = res.data.list;-->

<!--                    } else {-->
<!--                        this.tip(res.msg, 'warning', '3000')-->
<!--                    }-->

<!--                    if (this.paperList.length > 0) {-->
<!--                        this.selectPaperModel = this.paperList[0].id;-->
<!--                        this.getList();-->
<!--                    }-->
<!--                }).catch(() => {-->
<!--                    setTimeout(() => {-->
<!--                        this.isLoading = false;-->
<!--                    }, 500);-->
<!--                })-->
<!--            },-->
<!--            getSubjectListByStatus() {-->
<!--                getSubjectListByStatus(this.importSubjectParams).then(res => {-->
<!--                    setTimeout(() => {-->
<!--                        this.isLoading = false;-->
<!--                    }, 500);-->
<!--                    if ('成功' === res.msg) {-->
<!--                        this.importSubjectList = res.data.list;-->
<!--                    } else {-->
<!--                        this.tip(res.msg, 'warning', '3000')-->
<!--                    }-->


<!--                    // if (this.selectSubjectList.length > 0) {-->
<!--                    //     this.selectSubjectModel = this.selectSubjectList[0].id;-->
<!--                    // }-->
<!--                }).catch(() => {-->
<!--                    setTimeout(() => {-->
<!--                        this.isLoading = false;-->
<!--                    }, 500);-->
<!--                })-->
<!--            },-->
<!--            // 分页-->
<!--            handleSizeChange(e) {-->
<!--                this.isLoading = true;-->
<!--                this.size = e;-->
<!--                this.getList();-->
<!--            },-->
<!--            handleCurrentChange(e) {-->
<!--                this.isLoading = true;-->
<!--                this.currentPage = e;-->
<!--                this.getList();-->
<!--            },-->
<!--            clearInfo() {-->
<!--                this.formLibrary = {-->
<!--                    subjectId: '',-->
<!--                    questionType: '1',-->
<!--                    questionContent: '',-->
<!--                    resultCount: '4',-->
<!--                    explainInfo: '',-->
<!--                    a: '',-->
<!--                    b: '',-->
<!--                    c: '',-->
<!--                    d: '',-->
<!--                    e: '',-->
<!--                    f: '',-->
<!--                    g: '',-->
<!--                };-->
<!--                this.formLibrary.questionContent = '';-->
<!--            },-->
<!--            //清空上传信息-->
<!--            clearImportInfo() {-->
<!--                this.formImport = {-->
<!--                    subjectId: '',-->
<!--                    data: [],-->
<!--                };-->
<!--                this.fileList = [];-->
<!--            },-->
<!--            askImportLibrary() {-->
<!--                this.isImportDialog = true;-->
<!--                this.fileList = [];-->
<!--            },-->
<!--            //获取题库列表-->
<!--            getList() {-->
<!--                // console.log(this.listParams);-->
<!--                if (this.isFirst) {-->
<!--                    this.currentPage = 1;-->
<!--                }-->
<!--                this.tableData = [];-->
<!--                getLibraryList(this.listParams).then(res => {-->
<!--                    // setTimeout(() => {-->
<!--                    this.isLoading = false;-->
<!--                    // }, 500);-->
<!--                    if ('成功' === res.msg) {-->
<!--                        this.tableData = res.data.list;-->
<!--                        // console.log(this.tableData);-->
<!--                        this.totalRecord = res.data.totalRecord;-->
<!--                    } else {-->
<!--                        this.tip(res.msg, 'warning', '3000')-->
<!--                    }-->

<!--                }).catch(() => {-->

<!--                }).finally(()=>{-->
<!--                    this.isFirst=false;-->
<!--                })-->
<!--            },-->
<!--            // 查询-->
<!--            findList() {-->
<!--                this.isLoading = true;-->
<!--                this.isFirst=true;-->
<!--                this.getList();-->
<!--            },-->
<!--            // 表格删除-->
<!--            tableDelete(id) {-->
<!--                this.isLoading = true;-->
<!--                const data = {id: id};-->
<!--                deleteLibrary(data).then(res => {-->
<!--                    this.getList();-->
<!--                    setTimeout(() => {-->
<!--                        this.tip(res.msg, 'success', '3000');-->
<!--                    }, 600)-->
<!--                })-->
<!--            },-->

<!--            // 添加管理员/修改管理员-->
<!--            // clearInfo() {-->
<!--            //     // this.formLibrary.LibraryName = '';-->
<!--            //     this.formLibrary.power = '';-->
<!--            // },-->
<!--            addLibrary() {-->
<!--                this.isDialog = true;-->
<!--                this.saveOrEdit = 1;-->
<!--                this.clearInfo();-->

<!--            },-->
<!--            tableEdit(index, row) {-->
<!--                console.log(row);-->
<!--                this.saveOrEdit = 0;-->
<!--                this.Id = row.id;-->
<!--                this.formLibrary = {-->
<!--                    subjectId: row.subjectId,-->
<!--                    questionType: row.questionType,-->
<!--                    questionContent: row.questionContent,-->
<!--                    resultCount: row.resultCount,-->
<!--                    explainInfo: row.explainInfo,-->
<!--                    a: row.a,-->
<!--                    b: row.b,-->
<!--                    c: row.c,-->
<!--                    d: row.d,-->
<!--                    e: row.e,-->
<!--                    f: row.f,-->
<!--                    g: row.g,-->
<!--                }-->
<!--                this.isDialog = true;-->
<!--            },-->
<!--            dialogFalse(formLibrary) {-->
<!--                this.isDialog = false;-->
<!--                this.isLoading = false;-->
<!--                this.clearInfo();-->
<!--                this.$refs[formLibrary].resetFields();-->
<!--            },-->
<!--            dialogTrue(formLibrary) {-->
<!--                let that = this;-->
<!--                that.isLoading = true;-->
<!--                if (that.formLibrary.subjectId === '') {-->
<!--                    that.tip('请选择科目', 'warning', '2000');-->
<!--                    return;-->
<!--                }-->
<!--                if (that.formLibrary.questionType === '') {-->
<!--                    that.tip('请选择题型', 'warning', '2000');-->
<!--                    return;-->
<!--                } else {-->
<!--                    if (that.formLibrary.questionType === '1') {-->
<!--                        if (that.questionItemRadio.length === 0) {-->
<!--                            that.tip('单选题至少选择一个答案', 'warning', '2000');-->
<!--                            return;-->
<!--                        }-->
<!--                    }-->

<!--                    if (that.formLibrary.questionType === '5') {-->
<!--                        if (that.questionItemCheckbox.length === 0) {-->
<!--                            that.tip('多选题至少选择一个答案', 'warning', '2000');-->
<!--                            return;-->
<!--                        }-->
<!--                    }-->
<!--                    if (that.formLibrary.questionType === '10') {-->
<!--                        if (that.questionItemSelect.length === 0) {-->
<!--                            that.tip('判断题请选择一个答案', 'warning', '2000');-->
<!--                            return;-->
<!--                        }-->
<!--                    }-->
<!--                }-->
<!--                if (that.formLibrary.questionContent === '') {-->
<!--                    that.tip('请填写题目内容', 'warning', '2000');-->
<!--                    return;-->
<!--                }-->
<!--                if (that.formLibrary.resultCount === '') {-->
<!--                    that.tip('请选择选项数量', 'warning', '2000');-->
<!--                    return;-->
<!--                }-->
<!--                if (that.formLibrary.questionType === '1') {-->
<!--                    that.formLibrary.a = that.questionItemRadio[0] === 'A' ? 1 : 0;-->
<!--                    that.formLibrary.b = that.questionItemRadio[0] === 'B' ? 1 : 0;-->
<!--                    that.formLibrary.c = that.questionItemRadio[0] === 'C' ? 1 : 0;-->
<!--                    that.formLibrary.d = that.questionItemRadio[0] === 'D' ? 1 : 0;-->
<!--                    that.formLibrary.e = that.questionItemRadio[0] === 'E' ? 1 : 0;-->
<!--                    that.formLibrary.f = that.questionItemRadio[0] === 'F' ? 1 : 0;-->
<!--                    that.formLibrary.g = that.questionItemRadio[0] === 'G' ? 1 : 0;-->
<!--                } else if (that.formLibrary.questionType === '5') {-->
<!--                    that.questionItemCheckbox.forEach((item, index) => {-->
<!--                        if (item === 'A') that.formLibrary.a = 1;-->
<!--                        if (item === 'B') that.formLibrary.b = 1;-->
<!--                        if (item === 'C') that.formLibrary.c = 1;-->
<!--                        if (item === 'D') that.formLibrary.d = 1;-->
<!--                        if (item === 'E') that.formLibrary.e = 1;-->
<!--                        if (item === 'F') that.formLibrary.f = 1;-->
<!--                        if (item === 'G') that.formLibrary.g = 1;-->
<!--                    });-->
<!--                    if (that.formLibrary.a === '') that.formLibrary.a = 0;-->
<!--                    if (that.formLibrary.b === '') that.formLibrary.b = 0;-->
<!--                    if (that.formLibrary.c === '') that.formLibrary.c = 0;-->
<!--                    if (that.formLibrary.d === '') that.formLibrary.d = 0;-->
<!--                    if (that.formLibrary.e === '') that.formLibrary.e = 0;-->
<!--                    if (that.formLibrary.f === '') that.formLibrary.f = 0;-->
<!--                    if (that.formLibrary.g === '') that.formLibrary.g = 0;-->


<!--                } else if (that.formLibrary.questionType === '10') {-->
<!--                    that.formLibrary.a = that.questionItemSelect[0] === 'A' ? 1 : 0;-->
<!--                    that.formLibrary.b = that.questionItemSelect[0] === 'B' ? 1 : 0;-->
<!--                    that.formLibrary.c = that.questionItemSelect[0] === 'C' ? 1 : 0;-->
<!--                    that.formLibrary.d = that.questionItemSelect[0] === 'D' ? 1 : 0;-->
<!--                    that.formLibrary.e = that.questionItemSelect[0] === 'E' ? 1 : 0;-->
<!--                    that.formLibrary.f = that.questionItemSelect[0] === 'F' ? 1 : 0;-->
<!--                    that.formLibrary.g = that.questionItemSelect[0] === 'G' ? 1 : 0;-->
<!--                }-->
<!--                console.log(this.formLibrary);-->

<!--                if (this.saveOrEdit === 1) {-->
<!--                    addLibrary(this.addParams).then(res => {-->
<!--                        this.isDialog = false;-->
<!--                        this.clearInfo();-->
<!--                        this.getList();-->
<!--                        setTimeout(() => {-->
<!--                            const msg = res.msg;-->
<!--                            if ('成功' === msg) {-->
<!--                                this.tip(msg, 'success', '2000')-->
<!--                            } else {-->
<!--                                this.tip(msg, 'warning', '2000')-->
<!--                            }-->
<!--                        }, 600)-->
<!--                    })-->
<!--                } else {-->
<!--                    editLibrary(this.editParams).then(res => {-->
<!--                        this.isDialog = false;-->
<!--                        this.clearInfo();-->
<!--                        this.getList();-->
<!--                        setTimeout(() => {-->
<!--                            const msg = res.msg;-->
<!--                            if ('成功' === msg) {-->
<!--                                this.tip(msg, 'success', '2000')-->
<!--                            } else {-->
<!--                                this.tip(msg, 'warning', '2000')-->
<!--                            }-->
<!--                        }, 600);-->
<!--                    })-->
<!--                }-->
<!--            },-->


<!--            //上传取消按钮事件-->
<!--            importDialogFalse(formImport) {-->
<!--                this.isImportDialog = false;-->
<!--                this.isLoading = false;-->
<!--                this.clearImportInfo();-->
<!--                this.$refs[formImport].resetFields()-->
<!--            }-->
<!--            ,-->
<!--            // 文件超出个数限制时的钩子-->
<!--            exceedFile(files, fileList) {-->
<!--                this.tip(`只能选择 ${this.limitNum} 个文件，当前共选择了 ${files.length + fileList.length} 个`, 'warning', '2000');-->
<!--            }-->
<!--            ,-->
<!--            // 文件状态改变时的钩子-->
<!--            fileChange(file, fileList) {-->
<!--                console.log(file.raw);-->
<!--                this.fileList = [];-->
<!--                this.fileList.push(file.raw);-->
<!--                console.log(this.fileList);-->
<!--            }-->
<!--            ,-->
<!--            // 上传文件之前的钩子, 参数为上传的文件,若返回 false 或者返回 Promise 且被 reject，则停止上传-->
<!--            beforeUploadFile(file) {-->
<!--                console.log('before upload');-->
<!--                console.log(file);-->
<!--                let extension = file.name.substring(file.name.lastIndexOf('.') + 1);-->
<!--                // let size = file.size / 1024 / 1024;-->
<!--                if (extension !== 'xlsx' || extension !== 'xls') {-->
<!--                    this.tip('只能上传后缀是.xlsx和.xls的文件', 'warning', '2000');-->
<!--                }-->
<!--                // if(size > 10) {-->
<!--                //     this.$message.warning('文件大小不得超过10M');-->
<!--                // }-->
<!--            }-->
<!--            ,-->
<!--            // 文件上传成功时的钩子-->
<!--            handleSuccess(res, file, fileList) {-->
<!--                // this.$message.success('文件上传成功');-->
<!--            }-->
<!--            ,-->
<!--            // 文件上传失败时的钩子-->
<!--            handleError(err, file, fileList) {-->
<!--                // this.$message.error('文件上传失败');-->
<!--            }-->
<!--            ,-->
<!--            UploadUrl: function () {-->
<!--                // 因为action参数是必填项，我们使用二次确认进行文件上传时，直接填上传文件的url会因为没有参数导致api报404，所以这里将action设置为一个返回为空的方法就行，避免抛错-->
<!--                return ""-->
<!--            }-->
<!--            ,-->
<!--            //上传文件-->
<!--            uploadFile() {-->
<!--                let that = this;-->
<!--                if (that.importSubjectModel === '') {-->
<!--                    that.tip('请选择科目！', 'warning', '2000');-->
<!--                    return;-->
<!--                }-->
<!--                if (that.fileList.length === 0) {-->
<!--                    that.tip('请选择文件！', 'warning', '2000');-->
<!--                    return;-->
<!--                }-->
<!--                that.importing = true;-->
<!--                that.file = this.fileList[0];-->
<!--                let rABS = false; //是否将文件读取为二进制字符串-->
<!--                let f = that.file;-->
<!--                let reader = new FileReader();-->
<!--                let outdata;-->
<!--                //if (!FileReader.prototype.readAsBinaryString) {-->
<!--                FileReader.prototype.readAsBinaryString = function (f) {-->
<!--                    let binary = "";-->
<!--                    let rABS = false; //是否将文件读取为二进制字符串-->
<!--                    let wb; //读取完成的数据-->
<!--                    let reader = new FileReader();-->
<!--                    reader.onload = function (e) {-->
<!--                        let bytes = new Uint8Array(reader.result);-->
<!--                        let length = bytes.byteLength;-->
<!--                        for (let i = 0; i < length; i++) {-->
<!--                            binary += String.fromCharCode(bytes[i]);-->
<!--                        }-->
<!--                        let XLSX = require('xlsx');-->
<!--                        if (rABS) {-->
<!--                            wb = XLSX.read(btoa((fixdata(binary))), { //手动转化-->
<!--                                type: 'base64'-->
<!--                            });-->
<!--                        } else {-->
<!--                            wb = XLSX.read(binary, {-->
<!--                                type: 'binary'-->
<!--                            });-->
<!--                        }-->
<!--                        // outdata就是你想要的东西 excel导入的数据-->
<!--                        outdata = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);-->
<!--                        // that.importData=outdata;-->
<!--                        // console.log(outdata);-->

<!--                        let importParams = {-->
<!--                            subjectId: that.importSubjectModel,//sessionStorage.subjectId,-->
<!--                            data: outdata,-->
<!--                        };-->
<!--                        console.log(outdata);-->
<!--                        console.log(importParams);-->

<!--                        libraryImpt(importParams).then(res => {-->
<!--                            setTimeout(() => {-->
<!--                                const msg = res.msg;-->
<!--                                if ('成功' === msg) {-->
<!--                                    that.tip(msg, 'success', '3000')-->
<!--                                    that.isImportDialog = false;-->
<!--                                    that.clearInfo();-->
<!--                                    that.getList();-->
<!--                                    that.fileList = [];-->
<!--                                } else {-->
<!--                                    that.tip(msg, 'warning', '3000')-->
<!--                                }-->
<!--                            }, 600);-->
<!--                            that.$refs.importFile.value = ''-->

<!--                        }).catch(error => {-->
<!--                            console.log(error);-->
<!--                        }).finally(() => {-->
<!--                            that.importing = false;-->
<!--                        });-->

<!--                    }-->
<!--                    reader.readAsArrayBuffer(f);-->
<!--                }-->
<!--                if (rABS) {-->
<!--                    reader.readAsArrayBuffer(f);-->
<!--                } else {-->
<!--                    reader.readAsBinaryString(f);-->
<!--                }-->
<!--            }-->
<!--            ,-->
<!--        }-->
<!--    }-->
<!--</script>-->

<!--<style lang='less' scoped>-->
<!--  .first {-->
<!--  }-->

<!--</style>-->
<!--<style>-->
<!--  .cmm-wrapper {-->
<!--    white-space: pre-wrap;-->
<!--    line-height: 40px;-->
<!--    color: #000032;-->
<!--    font-size: 28px; /*px*/-->
<!--  }-->

<!--  .edit_container,-->
<!--  .ql-snow .ql-picker.ql-size .ql-picker-label::before,-->
<!--  .ql-snow .ql-picker.ql-size .ql-picker-item::before {-->
<!--    content: "14px";-->
<!--  }-->

<!--  .ql-snow .ql-picker.ql-size .ql-picker-label[data-value="small"]::before,-->
<!--  .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="small"]::before {-->
<!--    content: "10px";-->
<!--  }-->

<!--  .ql-snow .ql-picker.ql-size .ql-picker-label[data-value="large"]::before,-->
<!--  .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="large"]::before {-->
<!--    content: "18px";-->
<!--  }-->

<!--  .ql-snow .ql-picker.ql-size .ql-picker-label[data-value="huge"]::before,-->
<!--  .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="huge"]::before {-->
<!--    content: "32px";-->
<!--  }-->

<!--  .ql-snow .ql-picker.ql-header .ql-picker-label::before,-->
<!--  .ql-snow .ql-picker.ql-header .ql-picker-item::before {-->
<!--    content: "文本";-->
<!--  }-->

<!--  .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="1"]::before,-->
<!--  .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="1"]::before {-->
<!--    content: "标题1";-->
<!--  }-->

<!--  .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="2"]::before,-->
<!--  .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="2"]::before {-->
<!--    content: "标题2";-->
<!--  }-->

<!--  .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="3"]::before,-->
<!--  .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="3"]::before {-->
<!--    content: "标题3";-->
<!--  }-->

<!--  .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="4"]::before,-->
<!--  .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="4"]::before {-->
<!--    content: "标题4";-->
<!--  }-->

<!--  .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="5"]::before,-->
<!--  .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="5"]::before {-->
<!--    content: "标题5";-->
<!--  }-->

<!--  .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="6"]::before,-->
<!--  .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="6"]::before {-->
<!--    content: "标题6";-->
<!--  }-->

<!--  .ql-snow .ql-picker.ql-font .ql-picker-label::before,-->
<!--  .ql-snow .ql-picker.ql-font .ql-picker-item::before {-->
<!--    content: "标准字体";-->
<!--  }-->

<!--  .ql-snow .ql-picker.ql-font .ql-picker-label[data-value="serif"]::before,-->
<!--  .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="serif"]::before {-->
<!--    content: "衬线字体";-->
<!--  }-->

<!--  .ql-snow .ql-picker.ql-font .ql-picker-label[data-value="monospace"]::before,-->
<!--  .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="monospace"]::before {-->
<!--    content: "等宽字体";-->
<!--  }-->

<!--  .ql-editor {-->
<!--    height: 200px;-->
<!--  }-->

<!--</style>-->
