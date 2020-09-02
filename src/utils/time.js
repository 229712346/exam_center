// 返回现在的时间
export function nowTime () {
  const date = new Date() // 先获取现在的时间
  const nowYear = date.getFullYear().toString()
  const nowMonth = (date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1).toString() : (date.getMonth() + 1).toString()
  const nowdate = date.getDate() < 10 ? '0' + date.getDate().toString() : date.getDate().toString()
  const hh = date.getHours() < 10 ? '0' + date.getHours().toString() : date.getHours().toString()
  const mm = date.getMinutes() < 10 ? '0' + date.getMinutes().toString() : date.getMinutes().toString()
  const ss = date.getSeconds() < 10 ? '0' + date.getSeconds().toString() : date.getSeconds().toString()
  const nowTime = nowYear + '年' + nowMonth + '月' + nowdate + '日'
  const nowtime = hh + ':' + mm + ':' + ss
  const time = nowTime + ' ' + nowtime
  // console.log(' ===> ' + nowTime + nowtime)

  return time
}
// 返回几个月之前的时间，传入几就是几个月之前
export function lastTime (num) {
  const date = new Date() // 先获取现在的时间
  const nowYear = date.getFullYear().toString()
  const nowMonth = (date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1).toString() : (date.getMonth() + 1).toString()
  const nowdate = date.getDate() < 10 ? '0' + date.getDate().toString() : date.getDate().toString()
  const hh = date.getHours() < 10 ? '0' + date.getHours().toString() : date.getHours().toString()
  const mm = date.getMinutes() < 10 ? '0' + date.getMinutes().toString() : date.getMinutes().toString()
  const ss = date.getSeconds() < 10 ? '0' + date.getSeconds().toString() : date.getSeconds().toString()
  const nowtime = hh + ':' + mm + ':' + ss

  let staYear = nowYear
  let staMonth = nowMonth
  let staDate = nowdate
  if (nowMonth + 1 === 1) { // 返回几个月前的时间
    staYear = (nowYear - 1).toString()
    staMonth = (12).toString() - (num - 1)
  } else {
    staMonth = nowMonth - num
  }
  const staTime = staYear + '-' + (staMonth < 10 ? '0' + staMonth : staMonth) + '-' + staDate + ' ' + nowtime

  return staTime
}

// 倒计时方法  传入格式：'2020/01/25 00:00:00'
export function Countdown (over) {
  var date = (new Date(over)) - (new Date()) // 计算剩余的毫秒数
  var dd = parseInt(date / 1000 / 60 / 60 / 24, 10) // 计算剩余天数
  var hh = parseInt(date / 1000 / 60 / 60 % 24, 10) // 计算剩余小时
  if (hh < 10) hh = '0' + hh
  var mm = parseInt(date / 1000 / 60 % 60, 10) // 计算剩余分钟
  if (mm < 10) mm = '0' + mm
  var ss = parseInt(date / 1000 % 60, 10) + 1 // 计算剩余秒数
  if (ss < 10) ss = '0' + ss
  var time = dd + '天' + hh + ':' + mm + ':' + ss
  // console.log('1', over, time)
  return time
}
