// 防抖处理
let timeout = null
export function debounce (fn, wait) {
  timeout = timeout || wait
  if (timeout !== null) clearTimeout(timeout)
  timeout = setTimeout(fn, wait)
}
// 先导入 import {debounce} from '@/utils/unshake.js'
// 再使用 监听一个属性，当他有变化的时候执行的方法 debounce(() => { this.getList() }, 300)


// 下载文件
export function downlodFile (data, name) {
  let blob = new Blob([data])
  let objectUrl = window.URL.createObjectURL(blob)
  var link = document.createElement('a')
  link.href = objectUrl
  link.download = `${name}.xls`;
  link.click()
  URL.revokeObjectURL(objectUrl) // 释放内存
}
// import {downlodFile} from '@/utils/unshake.js'
// downlodFile(res.data, '征迁评估结果通知单')  直接把返回的数据放入就可以


// 传入分数,计算是否和为1 1/2 1/3 2/3
// numArr = ['6/10', '2/5']
export function computedSum (numArr) {
  console.log(numArr)

  let isSum = false
  let commonNum = 1 // 公倍数
  let moleculeNum = 0 // 分子和

  numArr.map((item, index) => {
    commonNum *= item.split('/')[1]
    console.log(index, item, commonNum)
  })

  numArr.map((items, index) => {
    moleculeNum += commonNum / items.split('/')[1] * items.split('/')[0]
    console.log(index, moleculeNum)
  })

  if (commonNum === moleculeNum) isSum = true
  return isSum
}
