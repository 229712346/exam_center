// 题库全部接口
import request from './request'

function setParams(data) {
  const params = new URLSearchParams();
  params.append('uid', atob(sessionStorage.getItem('userId')));
  params.append('info', JSON.stringify(data));
  return params
}
// 全部科目
export function getSubjectAllList (data) {
  return request({
    url: '/exam/subject/list',
    method: 'post',
    data: setParams(data)
  })
}
//题库导入
export function libraryImpt (dataParams) {
  return request({
    url: '/exam/library/impt',
    method: 'post',
    data: setParams(dataParams)
  })
}
// 题库列表
export function getLibraryList (data) {
  return request({
    url: '/exam/library/list',
    method: 'post',
    data: setParams(data)
  })
}
// 题库添加
export function addLibrary (data) {
  return request({
    url: '/exam/library/save',
    method: 'post',
    data: setParams(data)
  })
}
// 题库修改
export function editLibrary (data) {
  return request({
    url: '/exam/library/update',
    method: 'post',
    data: setParams(data)
  })
}

// 题库删除
export function deleteLibrary (data) {
  return request({
    url: '/exam/library/delete',
    method: 'post',
    data: setParams(data)
  })
}
