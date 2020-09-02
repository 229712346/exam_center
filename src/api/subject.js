// 科目管理页面全部接口
import request from './request'

function setParams(data) {
  const params = new URLSearchParams();
  params.append('uid', atob(sessionStorage.getItem('userId')));
  params.append('info', JSON.stringify(data));
  return params
}

// 科目列表
export function getSubjectList (data) {
  return request({
    url: '/exam/subject/list',
    method: 'post',
    data: setParams(data)
  })
}

// 科目添加
export function addSubject (data) {
  return request({
    url: '/exam/subject/save',
    method: 'post',
    data: setParams(data)
  })
}

// 科目修改
export function editSubject (data) {
  return request({
    url: '/exam/subject/update',
    method: 'post',
    data: setParams(data)
  })
}

// 科目删除
export function deleteSubject (data) {
  return request({
    url: '/exam/subject/delete',
    method: 'post',
    data: setParams(data)
  })
}

// 科目归档
export function archiveSubject (data) {
  return request({
    url: '/exam/subject/file',
    method: 'post',
    data: setParams(data)
  })
}
// 科目列表（按状态）
export function getSubjectListByStatus (data) {
  return request({
    url: '/exam/subject/listByStatus',
    method: 'post',
    data: setParams(data)
  })
}export function findSubjectiveName (data) {
  return request({
    url: '/exam/subject/findSubjectiveName',
    method: 'post',
    data: setParams(data)
  })
}
