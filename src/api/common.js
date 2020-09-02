import request from './request'
import axios from 'axios'

function setParams(data) {
  const params = new URLSearchParams();
  params.append('uid', atob(sessionStorage.getItem('userId')));
  params.append('info', JSON.stringify(data));
  return params
}
// 登录接口,并且获取用户信息
export function login(data) {
  const params = new URLSearchParams();
  params.append('uid', 0);
  params.append('info', (`{"managerName": "${data.managerName}","managerPwd": "${data.managerPwd}"}`));
  return axios({
    method: 'POST',
    // url: 'http://10.2.98.249:8088/exam/manager/login',
    // url: 'http://10.0.4.16:8088/exam/manager/login',
    url: 'http://10.2.98.200:8088/exam/manager/login',

    data: params
  })
}

// 获取所有科目列表
export function getSubList (data) {
  return request({
    url: '/exam/subject/listForUid',
    method: 'post',
    data: setParams(data)
  })
}
// 试卷列表
export function getPaperList (data) {
  return request({
    url: '/exam/paper/listForUid',
    method: 'post',
    data: setParams(data)
  })
}

// 下载文件方法 = 使用
// const params = { id: this.id }
// exportReport(params).then(res => {
//   downlodFile(res.data, '征迁评估结果通知单')
// })
export function exportExammark(params) {
  return request({
    url: '/exam/score/expt',
    method: 'get',
    params: setParams(params),
    responseType: 'blob'
  })
}
