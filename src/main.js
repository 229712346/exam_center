// 项目入口文件
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'

// 引入element插件
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

// 引入echarts插件注册到原型上
import Vcharts from 'v-charts'

// 引入animation动画插件
import animate from 'animate.css'

// 引入incofont图标库
require('./assets/iconfont/material-icons.css')
require('./styles/index.css')
//富文本css
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
// 引入路由传递参数加密
import Base64 from './utils/Base64'

Vue.prototype.$Base64 = Base64;

Vue.use(ElementUI, animate)
Vue.use(Vcharts)
Vue.use(VueQuillEditor);
Vue.config.productionTip = false

// 关闭提示
window.onbeforeunload = function (e) {
  e = e || window.event
  // 兼容IE8和Firefox 4之前的版本
  if (e) {
    e.returnValue = '关闭提示'
  }
  // Chrome, Safari, Firefox 4+, Opera 12+ , IE 9+
  return '关闭提示'
}

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>',
  store
})
