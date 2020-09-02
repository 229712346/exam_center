const user = {
  state: {
    role: sessionStorage.getItem('role') !== null ? atob(sessionStorage.getItem('role')) : '',
    userId: sessionStorage.getItem('userId') !== null ? atob(sessionStorage.getItem('userId')) : '',
    token: sessionStorage.getItem('token') !== null ? atob(sessionStorage.getItem('token')) : ''
  },

  getter: {},

  // 在这里改变state中的数据
  mutations: {
    SET_USER_INFO (state, obj) {
      state.role = obj.role
      state.userId = obj.userId
      state.token = obj.token
    },
  },

  // 在这里提交mutations,并且可以在页面中调用actions
  // 可以给actions传递参数 this.addnum(5)
  actions: {
    setUserRole (context, obj) {
      // 把用户信息存储在store中
      context.commit('SET_USER_INFO', obj)

      // 存储在session中,防止页面刷新数据
      sessionStorage.setItem('role', btoa(obj.role))
      sessionStorage.setItem('userId', btoa(obj.userId))
      sessionStorage.setItem('token', btoa(obj.token))
      // sessionStorage.setItem('userName', btoa(obj.userName))
      sessionStorage.setItem('userName', obj.userName)
    },
    getnum (context) { // 定义
      return new Promise((resolve, reject) => {
        const num = 9998
        resolve(num)
      })
    }
  }
}

export default user
