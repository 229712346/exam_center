import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

// 重写路由添加方法
const routerPush = Router.prototype.push
Router.prototype.push = function push (location) {
  return routerPush.call(this, location).catch(error => error)
}

const router = new Router({
  // mode: 'history', // 可以去掉地址中的#号,但是需要后台配置

  routes: [
    {
      path: '/',
      name: 'Login',
      meta: { title: '登录', login: false },
      component: () => import('@/views/login/index')
    },
    {
      path: '/home',
      name: 'Home',
      redirect: '/form',
      meta: { title: '首页', login: true },
      component: () => import('@/views/home/index'),
      children: [
        {
          path: '/manager',
          name: 'Manager',
          meta: { title: '管理员管理', login: true },
          component: () => import('@/views/components/manager/index')
        },
        {
          path: '/subject',
          name: 'Subject',
          meta: { title: '科目管理', login: true },
          component: () => import('@/views/components/subject/index')
        },
        {
          path: '/libraryForWord',
          name: 'LibraryForWord',
          meta: { title: '题库管理', login: true },
          component: () => import('@/views/components/libraryForWord/index')
        },
        {
          path: '/listForPaper',
          name: 'ListForPaper',
          meta: { title: '题库管理(word)', login: true },
          component: () => import('@/views/components/listForPaper/index')
        },
        {
          path: '/testpaper',
          name: 'Testpaper',
          meta: { title: '试卷管理', login: true },
          component: () => import('@/views/components/testpaper/index')
        },
        {
          path: '/candidate',
          name: 'candidate',
          meta: { title: '考生管理', login: true },
          component: () => import('@/views/components/candidate/index')
        },
        {
          path: '/yueJuanManage',
          name: 'YueJuanManage',
          meta: { title: '阅卷管理', login: true },
          component: () => import('@/views/components/yueJuanManage/index')
        },
        {
          path: '/exammark',
          name: 'Exammark',
          meta: { title: '考分统计', login: true },
          component: () => import('@/views/components/exammark/index')
        }
      ]
    },
    {
      path: '*',
      redirect: '/exammark'
    }
  ]
})

// router.beforeEach((to, from, next) => {
//   console.log('全局路由导航', to, from)
//   next()
// })

router.beforeEach((to, from, next) => {
  window.document.title = to.meta.title + '—考试管理系统'

  let isLogin = false
  sessionStorage.getItem('isLogin') === null || sessionStorage.getItem('isLogin') === 'false' ? isLogin = false : isLogin = true
  // 是否登录
  if(isLogin) {
    // 登录之后: 如果跳转到登录也不允许,重新跳转至首页
    to.name === 'Login' ? router.push({ name: 'Home' }) : next()
  } else {
    // 未登录: 跳转到其他页面会跳转到登录页
    (to.name !== 'Login') ? next({name: 'Login'}) : next()
  }
})

router.beforeResolve((to, from, next) => {
  next()
})

router.afterEach((to, from) => {
})

export default router
