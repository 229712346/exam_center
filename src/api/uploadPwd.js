// 修改密码全部接口
import request from './request'

function setParams(data) {
  const params = new URLSearchParams();
  params.append('uid', atob(sessionStorage.getItem('userId')));
  params.append('info', JSON.stringify(data));
  return params
}
// 修改密码
export function updatePwd (data) {
  return request({
    url: '/exam/manager/updatePwd',
    method: 'post',
    data: setParams(data)
  })
}
