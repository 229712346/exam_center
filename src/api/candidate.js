// 考生全部接口
import request from './request'

function setParams(data) {
  const params = new URLSearchParams();
  params.append('uid', atob(sessionStorage.getItem('userId')));
  params.append('info', JSON.stringify(data));
  return params
}
// 获取所有科目列表
export function getSubjectAllList (data) {
  return request({
    url: '/exam/subject/list',
    method: 'post',
    data: setParams(data)
  })
}
//考生导入
export function candidateImpt (dataParams) {
  return request({
    url: '/exam/candidate/impt',
    method: 'post',
    data: setParams(dataParams)
  })
}
// 考生列表
export function getCandidateList (data) {
  return request({
    url: '/exam/candidate/list',
    method: 'post',
    data: setParams(data)
  })
}
// 考生添加
export function addCandidate (data) {
  return request({
    url: '/exam/candidate/save',
    method: 'post',
    data: setParams(data)
  })
}
// 考生修改
export function editCandidate (data) {
  return request({
    url: '/exam/candidate/update',
    method: 'post',
    data: setParams(data)
  })
}

// 考生删除
export function deleteCandidate (data) {
  return request({
    url: '/exam/candidate/delete',
    method: 'post',
    data: setParams(data)
  })
}// 考生重置密码
export function resetPwd (data) {
  return request({
    url: '/exam/candidate/resetPwd',
    method: 'post',
    data: setParams(data)
  })
}
