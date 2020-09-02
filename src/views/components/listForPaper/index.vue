<template  >
  <div class="first" v-loading="importing" element-loading-text="正在导入...." element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)" style="width: 100%">
    <div class="pagecontent">
      <!-- 顶部按钮 -->
      <div class="headerbtn">
        <el-select v-model="selectPaperModel" size="small" placeholder="请选择科目" clearable @change="getList()">
          <el-option v-for="item in paperList" :label="item.subjectName" :value="item.id" :key="item.id"></el-option>
        </el-select>
        <el-button size="small" type="primary" :loading="isLoading" @click="findList(true)">查询</el-button>
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
            </template>
          </el-table-column>
          <el-table-column label="题目内容" prop="questionContent" header-align="center" align="left" show-overflow-tooltip>
            <template slot-scope="scope">
              <p style="white-space: pre-wrap" >{{scope.row.questionContent}}</p>
            </template>
          </el-table-column>
          <el-table-column label="选项数量" prop="resultCount" header-align="center" align="center" width="80"/>
          <el-table-column label="正确答案" prop="answer" header-align="center" align="center" width="80"/>
          <el-table-column label="答案解说" prop="explainInfo" header-align="center" align="left"/>
          <el-table-column label="操作" header-align="center" align="center" width="150">
            <template slot-scope="scope">
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
		<!-- 弹框 -->
    <el-dialog :visible.sync="isImportDialog" width="1024px" top="15vh" :title="'题库导入'" :show-close="false" :close-on-click-modal="false">
      <div class="dialog_cont">
        <el-form ref="formImport" label-position="right" :model="formImport" status-icon label-width="100px">
          <el-form-item label="科目:">
            <el-select v-model="formImport.importPaperModel" size="small" placeholder="请选择科目">
              <el-option v-for="item in paperList" :label="item.subjectName" :value="item.id" :key="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="文件:" prop="power">
            <el-upload
              ref="upload"
              accept=".docx"
              action="I =am a action"
              :limit=limitNum
              :auto-upload="false"
              :file-list="fileList"
              :on-change="fileChange"
              :on-exceed="exceedFile"
              :before-upload="beforeUploadFile"
              :on-success="handleSuccess"
              :on-error="handleError">
              <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
            </el-upload>
          </el-form-item>
          <el-form-item label="导入说明:">
            <el-image :src="require(`@/assets/importWord.png`)" fit="contain" style="height: 360px">
              <div slot="placeholder" class="image-slot">
                加载中<span class="dot">...</span>
              </div>
            </el-image>
          </el-form-item>
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
  import { getLibraryForWordList, deleteLibraryForWord } from '@/api/libraryForWord.js';
  import {libraryImptDoc} from "../../../api/libraryForWord";
  import { getSubList } from '@/api/common.js'
  import { scrollTo } from '@/utils/scroll-to'
	export default {
		name: 'ListForPaper',
		data() { // 存放数据
			return {
				msg: '题库管理(word)',
				// 加载
				importing: false,
				isLoading: true,

				// 查询条件
				selectPaperModel: '',
				paperList: [],

				// 表格数据
				tableData: [],
				totalRecord: 0, // 初始共00条数据，其实没有，等接口返回,总条数
				currentPage: 1, // 当前导航页数的默认页数
				size: 10, // 每页的数据条数

				// 弹框
				isImportDialog: false,
				formImport: {
					importPaperModel: '', // 科目
					testList: []
				},

				limitNum: 1,
				fileList: []

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
					}
				}
			}
		},
		created () {
			this.getSubList()
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

			// 获得科目列表
			getSubList () {
				const data = {}
				getSubList(data).then(res => {
					if(res.msg === '成功') {
						this.paperList = res.data.list
					} else {
						this.tip(res.msg, 'warning', '3000')
					}

					if (this.paperList.length > 0) {
						this.selectPaperModel = this.paperList[0].id
						this.getList()
					}
				})
			},

			// 列表数据
			getList () {
				this.isLoading = true
				getLibraryForWordList(this.listParams).then(res => {
					setTimeout(() => {
						this.isLoading = false;
					}, 500)
					if(res.msg === '成功') {
						this.tableData = res.data.list;
						this.totalRecord = res.data.totalRecord;
					} else {
						this.tip(res.msg, 'warning', '2000')
					}
				}).catch(() => {
					setTimeout(() => {
						this.isLoading = false;
					}, 500);
				})
			},
			// 分页
			handleSizeChange(e) {
				this.isLoading = true;
				this.size = e;
				scrollTo(0, 0)
				this.getList();
			},
			handleCurrentChange(e) {
				this.isLoading = true;
				this.currentPage = e;
				scrollTo(0, 0)
				this.getList();
			},

			// 查询
			findList() {
				this.isLoading = true
				this.getList()
			},

			// 删除
			tableDelete(id) {
				this.isLoading = true;
				const data = {id: id};
				deleteLibraryForWord(data).then(res => {
					this.getList();
					setTimeout(() => {
						this.tip(res.msg, 'success', '3000');
					}, 600)
				})
			},

			// 弹框
			askImportLibraryForWord () {
				this.isImportDialog = true
			},

			importDialogFalse () {
				this.isImportDialog = false
				this.formImport = {
					importSubjectModel: '',
					testList: []
				}
			},
			uploadFile () {},

			// 上传
			// 文件超出个数限制时的钩子
			exceedFile(files, fileList) {
					this.tip(`只能选择 ${this.limitNum} 个文件，当前共选择了 ${files.length + fileList.length} 个`, 'warning', '2000')
			},
			// 文件状态改变时的钩子
			fileChange(file, fileList) {
					this.fileList = []
					this.fileList.push(file.raw)
					// console.log('改变', file.raw, this.fileList)
			},
			// 上传文件之前的钩子, 参数为上传的文件,若返回 false 或者返回 Promise 且被 reject，则停止上传
			beforeUploadFile(file) {
				// console.log('before upload',file);
				let extension = file.name.substring(file.name.lastIndexOf('.') + 1);
				// let size = file.size / 1024 / 1024;
				if (extension !== 'docx' || extension !== 'doc') {
					this.tip('只能上传后缀是.docx.doc的文件', 'warning', '2000');
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
			uploadFile() {
					let that = this;
					if (that.formImport.importPaperModel === '') {
							that.tip('请选择科目！', 'warning', '2000')
							return
					}
					if (that.fileList.length === 0) {
							that.tip('请选择文件！', 'warning', '2000')
							return
					}

					let f = this.fileList[0];
          let importParams = {
              subjectId: that.formImport.importPaperModel,//sessionStorage.subjectId,
          };
          // console.log(importParams);
          libraryImptDoc(importParams,f).then(res => {
              setTimeout(() => {
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
          });
			}


		}
	}
</script>
