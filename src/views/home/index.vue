<template>
  <div class="home">
    <div class="middle">
      <!-- 左侧菜单列表 -->
      <div class="menu" id="menus" :style="{width: width}">
        <div class="menu_top">考试管理系统</div>
        <div class="menu_box" id="box">
          <el-menu
            class="el-menu-demo"
            :default-active="this.$route.path"
            background-color="#202d40"
            text-color="#ffffff"
            active-text-color="#ffffff"
            mode="vertical"
            unique-opened
            router
          >
            <span v-if="role+''==='0'">
              <el-menu-item index="/manager"><i class="el-icon-s-custom" :key="1"></i><span>管理员管理</span></el-menu-item>
              <el-menu-item index="/subject"><i class="el-icon-s-grid" :key="2"></i><span>科目管理</span></el-menu-item>
              <el-menu-item index="/libraryForWord"><i class="el-icon-s-order" :key="4"></i><span>题库管理</span></el-menu-item>
<!--              <el-menu-item index="/listForPaper"><i class="el-icon-s-order" :key="4"></i><span>题库管理(word)</span></el-menu-item>-->
              <el-menu-item index="/testpaper"><i class="el-icon-document" :key="5"></i><span>试卷管理</span></el-menu-item>
              <el-menu-item index="/candidate"><i class="el-icon-user-solid" :key="3"></i><span>考生管理</span></el-menu-item>
              <el-menu-item index="/yueJuanManage"><i class="el-icon-edit-outline" :key="13"></i><span>阅卷管理</span></el-menu-item>
              <el-menu-item index="/exammark"><i class="el-icon-s-data" :key="6"></i><span>考分统计</span></el-menu-item>
            </span>
            <span v-if="role+''==='5'">
              <el-menu-item index="/libraryForWord"><i class="el-icon-s-order" :key="9"></i><span>题库管理</span></el-menu-item>
              <el-menu-item index="/testpaper"><i class="el-icon-document" :key="10"></i><span>试卷管理</span></el-menu-item>
              <el-menu-item index="/candidate"><i class="el-icon-user-solid" :key="8"></i><span>考生管理</span></el-menu-item>
              <el-menu-item index="/exammark"><i class="el-icon-s-data" :key="12"></i><span>考分统计</span></el-menu-item>
            </span>
            <span v-if="role+''==='10'">
              <el-menu-item index="/yueJuanManage"><i class="el-icon-edit-outline" :key="13"></i><span>阅卷管理</span></el-menu-item>
              <el-menu-item index="/exammark"><i class="el-icon-s-data" :key="11"></i><span>考分统计</span></el-menu-item>
            </span>
          </el-menu>
        </div>
      </div>
      <!-- 右侧主体内容 -->
      <div class="content">
        <!-- 头部内容 -->
        <div class="header">
          <div class="isshow" @click="hideOrShow()">
            <i v-if="isShow" class="material-icons isshow">&#xe236;</i>
            <i v-else class="material-icons isshow">&#xe237;</i>
          </div>
          <breadcrumb :breadcrumb="breadcrumb"/>
          <div class="titleinfo">
            <zoomScreen/>
            <userInfo :user-name="userName" :user-id="userId"/>
          </div>
        </div>
        <!-- 显示对应页面 -->
        <div class="bodyBox" id="boxcontent">
          <div class="bodyContent">
            <transition appear enter-active-class="animated fadeIn">
              <router-view class="view"/>
            </transition>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
    import zoomScreen from '@/components/header/ZoomScreen.vue'
    import userInfo from '@/components/header/UserInfo.vue'
    import breadcrumb from '@/components/header/Breadcrumb.vue'

    export default {
        name: 'Home',
        components: {
            zoomScreen,
            userInfo,
            breadcrumb
        },
        data() {
            return {
                userName: 'X',
                userId: '001',
                // 面包屑
                breadcrumb: [],
                // 菜单开关
                width: '220px',
                isShow: true,
                role: '',
            }
        },
        watch: {
            '$route'(to, from) {
                this.breadcrumb.splice(0)
                to.matched.map(item => {
                    this.breadcrumb.push(item)
                })
            }
        },
        created() {
            this.userName = sessionStorage.getItem('userName') !== null ? sessionStorage.getItem('userName') : '';
            this.role = sessionStorage.getItem('role') !== null ? atob(sessionStorage.getItem('role')) : '';
            // if('0'===role+''){
            //     this.isRole0=true;
            // }else {
            //     if('5'===role+''){
            //         this.isRole5=true;
            //     }else{
            //         this.isRole10=true;
            //     }
            // }
            // if (sessionStorage.power == 0) {
            //     that.isXsc = true;
            // } else {
            //     if (sessionStorage.userFrom == 2)//辅导员
            //         that.isTeacher = true;
            //     else
            //         that.isDeptManage = true;
            // }
        },
        mounted() {
            this.$route.matched.map(item => {
                this.breadcrumb.push(item)
            })
        },
        methods: {
            // 菜单隐藏
            hideOrShow() {
                this.width === '0px' ? this.width = '220px' : this.width = '0px'
                this.isShow = !this.isShow
            }
        }
    }
</script>

<style lang='less' scoped>
  .home {
    width: 100%;
    height: 100%;
    overflow: hidden;
    background-color: @backGround;

    .middle {
      width: 100%;
      height: 100%;
      display: flex;
      overflow: hidden;
      background-color: @backGround;

      .menu {
        background-color: @boldBgcolor;
        height: 100%;
        user-select: none;

        .menu_top {
          height: 56px;
          line-height: 56px;
          text-align: center;
          cursor: pointer;
          font-size: 18px;
          color: @white;
          border-bottom: 2px solid #336699;
          white-space: nowrap;
        }

        .menu_box {
          height: calc(100% - 58px);
          overflow: auto;
          // 导航栏
          .el-menu {
            border: 0;

            i {
              font-weight: 500;
              color: @white;
            }

            span {
              margin-left: 10px;
              font-size: 14px;
            }

            .el-menu-item {
              margin-bottom: 0px;
            }

            // 改变选中样式
            .el-menu-item.is-active {
              background-color: #336699 !important;
              border-left: 3px solid @white;

              i {
                color: @white;
                margin-left: -5px;
              }
            }

            // 子菜单设置
            .el-menu-item-group {
              i {
                font-size: 12px;
              }

              span {
                font-size: 14px;
              }
            }
          }
        }

        #box::-webkit-scrollbar {
          display: none;
        }

        transition: all 0.3s;
      }

      #menus::-webkit-scrollbar {
        display: none;
      }

      .content {
        background-color: @backGround;
        // width: calc(100% - 220px);
        width: 100%;
        height: 100%;
        overflow: hidden;

        .header {
          width: 100%;
          height: 56px;
          color: @white;
          user-select: none;
          padding: 0 30px 0 0;
          box-sizing: border-box;
          background-color: @headerColor;
          position: relative;
          box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);

          .isshow {
            display: inline-block;
            width: 56px;
            height: 56px;
            line-height: 56px;
            text-align: center;
            position: absolute;
            top: 0;
            left: 0;
            cursor: pointer;

            &:hover {
              background-color: @boldBgcolor;
            }
          }

          .titleinfo {
            float: right;
            min-width: 220px;
            height: 56px;
            line-height: 56px;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
        }

        .bodyBox {
          background-color: @backGround;
          width: 100%;
          height: calc(100% - 56px);
          overflow: auto;
          box-sizing: border-box;
          padding: 10px;

          .bodyContent {
            width: 100%;
            min-height: 100%;
            margin: auto;
            border-radius: 4px;
            box-sizing: border-box;
            background-color: @backGround;
            display: flex;

            .view {
              width: 100%;
              border: 1px solid @borderColor;
              border-radius: 3px;
              background-color: @white;
            }
          }
        }

        #boxcontent::-webkit-scrollbar {
          display: none;
        }
      }
    }
  }
</style>
