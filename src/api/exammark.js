// 考分统计
import request from './request'

function setParams(data) {
  const params = new URLSearchParams();
  params.append('uid', atob(sessionStorage.getItem('userId')));
  params.append('info', JSON.stringify(data));
  return params
}

// 试卷列表
export function getTestPaperList (data) {
  return request({
    url: '/exam/paper/listAll',
    method: 'post',
    data: setParams(data)
  })
}

// 考分列表
export function getExammarkList (data) {
  return request({
    url: '/exam/score/listForPaper',
    method: 'post',
    data: setParams(data)
  })
}

// 考分导出
export function exportExammark (data) {
  return request({
    url: '/exam/score/expt',
    method: 'post',
    responseType: 'blob',
    params: setParams(data)
  })
}

// 学生答题详情
export function exammarkDetail (data) {
  return request({
    url: '/exam/sheet/listForCandidate',
    method: 'post',
    data: setParams(data)
  })
}

// 修改分数
export function editExammarkScore (data) {
  return request({
    url: '/exam/detail/updateForSpecial',
    method: 'post',
    data: setParams(data)
  })
}

// 删除
export function deleteExammark (data) {
  return request({
    url: '/exam/score/delete',
    method: 'post',
    data: setParams(data)
  })
}
// 修改学生的客观题答题数据，可导致学生实际得分发生变化
export function updateForSpecial (data) {
  return request({
    url: '/exam/detail/updateForSpecial',
    method: 'post',
    data: setParams(data)
  })
}
