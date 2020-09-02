// 全部接口
import request from './request'

function setParams(data) {
  const params = new URLSearchParams();
  params.append('uid', atob(sessionStorage.getItem('userId')));
  params.append('info', JSON.stringify(data));
  return params
}
// 创建试卷时，获取供选择的科目列表
export function getListForPaper (data) {
  return request({
    url: '/exam/subject/listForPaper',
    method: 'post',
    data: setParams(data)
  })
}

export function libraryImpt (dataParams) {
  return request({
    url: '/exam/library/impt',
    method: 'post',
    data: setParams(dataParams)
  })
}
// // 管理员添加
// export function addManager (data) {
//   return request({
//     url: '/exam/manager/save',
//     method: 'post',
//     data: setParams(data)
//   })
// }
//
//
// // 管理员删除
// export function deleteManager (data) {
//   return request({
//     url: '/exam/manager/delete',
//     method: 'post',
//     data: setParams(data)
//   })
// }
