//阅卷接口
import request from './request'

function setParams(data) {
  const params = new URLSearchParams();
  params.append('uid', atob(sessionStorage.getItem('userId')));
  params.append('info', JSON.stringify(data));
  return params
}



//试卷列表
export function getPaperList (data) {
  return request({
    url: '/exam/paper/listAll',
    method: 'post',
    data: setParams(data)
  })
}

// 阅卷列表
export function getYueJuanManageList (data) {
  return request({
    url: '/exam/score/listForPaper',
    method: 'post',
    data: setParams(data)
  })
}
// 考生的简答题列表
export function getListForMarking (data) {
  return request({
    url: '/exam/sheet/listForMarking',
    method: 'post',
    data: setParams(data)
  })
}
// 阅卷提交
export function saveForMarking (data) {
  return request({
    url: '/exam/detail/saveForMarking',
    method: 'post',
    data: setParams(data)
  })
}
