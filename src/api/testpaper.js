// 试卷管理页面全部接口
import request from './request'

function setParams(data) {
  const params = new URLSearchParams();
  params.append('uid', atob(sessionStorage.getItem('userId')));
  params.append('info', JSON.stringify(data));
  return params
}

// 试卷添加时的科目下拉框
export function getSubjectSelectList (data) {
  return request({
    url: '/exam/subject/listForPaper',
    method: 'post',
    data: setParams(data)
  })
}

// 根据科目获取各类题型的数量
export function getCountForSubjectList (data) {
  return request({
    url: '/exam/library/countForSubject',
    method: 'post',
    data: setParams(data)
  })
}

// 试卷列表
export function getTestpaperList (data) {
  return request({
    url: '/exam/paper/list',
    method: 'post',
    data: setParams(data)
  })
}

// 试卷添加
export function addTestpaper (data) {
  return request({
    url: '/exam/paper/create',
    method: 'post',
    data: setParams(data)
  })
}

// 试卷修改
export function editTestpaper (data) {
  return request({
    url: '/exam/paper/update',
    method: 'post',
    data: setParams(data)
  })
}

// 试卷回显
export function testpaperInfo (data) {
  return request({
    url: '/exam/paper/findById',
    method: 'post',
    data: setParams(data)
  })
}

// 试卷详情
export function detailTestpaper (data) {
  return request({
    url: '/exam/sheet/listForPaper',
    method: 'post',
    data: setParams(data)
  })
}

// 试卷删除
export function deleteTestpaper (data) {
  return request({
    url: '/exam/paper/delete',
    method: 'post',
    data: setParams(data)
  })
}
//归档
export function paperFile (data) {
  return request({
    url: '/exam/paper/file',
    method: 'post',
    data: setParams(data)
  })
}
