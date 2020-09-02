// 管理员管理页面全部接口
import request from './request'

function setParams(data) {
  const params = new URLSearchParams();
  params.append('uid', atob(sessionStorage.getItem('userId')));
  params.append('info', JSON.stringify(data));
  return params
}
// 管理员列表
export function getManagerList (data) {
  return request({
    url: '/exam/manager/list',
    method: 'post',
    data: setParams(data)
  })
}
// 管理员添加
export function addManager (data) {
  return request({
    url: '/exam/manager/save',
    method: 'post',
    data: setParams(data)
  })
}

// 管理员修改
export function editManager (data) {
  return request({
    url: '/exam/manager/update',
    method: 'post',
    data: setParams(data)
  })
}

// 管理员删除
export function deleteManager (data) {
  return request({
    url: '/exam/manager/delete',
    method: 'post',
    data: setParams(data)
  })
}
// 获取默认密码
export function defaultPwd (data) {
  return request({
    url: '/exam/manager/defaultPwd',
    method: 'post',
    data: setParams(data)
  })
}
//重置密码
export function resetPwd (data) {
  return request({
    url: '/exam/manager/resetPwd',
    method: 'post',
    data: setParams(data)
  })
}
// 科目列表
export function getSubjectList (data) {
  return request({
    url: '/exam/subject/listForManager',
    method: 'post',
    data: setParams(data)
  })
}
