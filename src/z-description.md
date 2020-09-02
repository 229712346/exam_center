#### 项目介绍

> 目录结构
```
外层目录: 
    build:
    config:
    node_modules: 项目的依赖包

本目录是项目的主要目录

main.js: 项目的主要入口文件

App.vue: 项目的最外层

api: 存放接口和接口封装

assets: 用来存放项目的一些静态资源
    其中图标的使用,需要打开网站寻找图标,找到之后复制图标下方的代码在本文件夹下的codepoints中查找,然后把后边的四位代码复制到页面中替代后四位来使用
    <i class="material-icons">&#xe80e;</i>
    网站: https://material.io/resources/icons/?icon=fingerprint&style=baseline

components： 用来存放项目的公用组件

router： 项目的路由文件

store: 状态管理

styles: 用来存放一些公共的样式设置: 直接在文件中设置好，在页面中就可以直接使用

utils: 存放一些小工具

views： 项目主要页面文件
    home 为首页
    login 用来存放登陆的页面
    components 用来存放主要的页面

```

> 主要使用的技术和插件
- vue
- vue-router
- vuex
- less
- element-ui
- axios
- v-charts
- animate

> 封装的插件主要有
- 富文本
- 复制内容
- 导出表格
- 返回顶部
- 天气插件
- 时间和倒计时
- 瀑布流

> 使用的时候注意事项
- 添加对应的注释
- 命名规范,使用有语意的英文,不得使用拼写和全部缩写(xinxinzhognxin-XXZX-信息中心)
- 所有的文件名使用全小写
- 封装组件的文件名使用大驼峰
- 组件引入的时候使用小驼峰,使用的时候也是
- 文件中变量和方法的命名使用小驼峰
- class和id的命名使用下划线分割,也可以使用全小写(比较短的话)
- 在创建好文件之后,要在文件的顶部备注: 姓名,文件名