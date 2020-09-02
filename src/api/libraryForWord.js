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
export function libraryForWordImpt (dataParams) {
  return request({
    url: '/exam/library/impt',
    method: 'post',
    data: setParams(dataParams)
  })
}
// 题库列表
export function getLibraryForWordList (data) {
  return request({
    url: '/exam/library/list',
    method: 'post',
    data: setParams(data)
  })
}
// 题库添加
export function addLibraryForWord (data) {
  return request({
    url: '/exam/library/save',
    method: 'post',
    data: setParams(data)
  })
}
// 题库修改
export function editLibraryForWord (data) {
  return request({
    url: '/exam/library/update',
    method: 'post',
    data: setParams(data)
  })
}

// 题库删除
export function deleteLibraryForWord (data) {
  return request({
    url: '/exam/library/delete',
    method: 'post',
    data: setParams(data)
  })
}

function setParams(data,file) {
  const params = new FormData();
  params.append('uid', atob(sessionStorage.getItem('userId')));
  params.append('info', JSON.stringify(data));
  params.append('file',file);
  return params
}

export function libraryImptDoc (data,file) {
  return request({
    url: '/exam/library/imptDoc',
    method: 'post',
    data: setParams(data,file)
  })
}
