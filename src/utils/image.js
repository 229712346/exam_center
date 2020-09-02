// url转base64格式
export function urlToBase64 (url) {
  return new Promise((resolve, reject) => {
    let image = new Image()
    image.onload = function () {
      let canvas = document.createElement('canvas')
      canvas.width = this.naturalWidth
      canvas.height = this.naturalHeight
      // 将图片插入画布并开始绘制
      canvas.getContext('2d').drawImage(image, 0, 0)
      // result
      let result = canvas.toDataURL('image/png')
      resolve(result)
    }
    image.setAttribute('crossOrigin', 'Anonymous')
    image.src = url
    // 图片加载失败的错误处理
    image.onerror = () => {
      reject(new Error('图片流异常'))
    }
  })
}
// 调用
// urlToBase64(this.url).then(res => {
//   console.log(res)
// })

// blob to base64 的方法
// 原理：利用fileReader的readAsDataURL，将blob转为base64
export function blobToBase64 (blob) {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader()
    fileReader.onload = (e) => {
      resolve(e.target.result)
    }
    // readAsDataURL
    fileReader.readAsDataURL(blob)
    fileReader.onerror = () => {
      reject(new Error('文件流异常'))
    }
  })
}
// 复制代码你可以这样调用：
// blobToBase64(blob).then(res => {
//    console.log('base64', res)
// })

// base64 to blob 的方法封装
// 原理：利用URL.createObjectURL为blob对象创建临时的URL
export function base64ToBlob ({b64data = '', contentType = '', sliceSize = 512} = {}) {
  return new Promise((resolve, reject) => {
    // 使用 atob() 方法将数据解码
    let byteCharacters = atob(b64data)
    let byteArrays = []
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      let slice = byteCharacters.slice(offset, offset + sliceSize)
      let byteNumbers = []
      for (let i = 0; i < slice.length; i++) {
        byteNumbers.push(slice.charCodeAt(i))
      }
      // 8 位无符号整数值的类型化数组。内容将初始化为 0。
      // 如果无法分配请求数目的字节，则将引发异常。
      byteArrays.push(new Uint8Array(byteNumbers))
    }
    let result = new Blob(byteArrays, {
      type: contentType
    })
    result = Object.assign(result, {
      // jartto: 这里一定要处理一下 URL.createObjectURL
      preview: URL.createObjectURL(result),
      name: `图片示例.png`
    })
    resolve(result)
  })
}

// let base64 = base64.split(',')[1]
// 调用
// base64ToBlob({b64data: base64, contentType: 'image/png'}).then(res => {
//     // 转后后的blob对象
//     console.log('blob', res)
// })

// Base64 to file 的方法封装
export function base64ImgToFile (base64, filename, contentType) {
  var arr = base64.split(',') // 去掉base64格式图片的头部
  var bstr = window.atob(arr[1]) // atob()方法将数据解码
  var leng = bstr.length
  var u8arr = new Uint8Array(leng)
  while (leng--) {
    u8arr[leng] = bstr.charCodeAt(leng) // 返回指定位置的字符的 Unicode 编码
  }
  return new File([u8arr], filename, {type: contentType})
}
// 调用 图片base64必须完整+data:image/png;base64,
// let base64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgA...此处省略 ...q"
// let result = base64ImgToFile (this.base, "testImg.png","image/png")
//  console.log(result) 不知道怎么用file显示图片

// base64 to url 的方法封装
export function base64ToUrl () {}

// 下载图片封装 == 网络地址
export function downloadImage (imgsrc, name) { // 下载图片地址和图片名
  var image = new Image()
  // 解决跨域 Canvas 污染问题
  image.setAttribute('crossOrigin', 'anonymous')
  image.onload = function () {
    var canvas = document.createElement('canvas')
    canvas.width = image.width
    canvas.height = image.height
    var context = canvas.getContext('2d')
    context.drawImage(image, 0, 0, image.width, image.height)
    var url = canvas.toDataURL('image/png') // 得到图片的base64编码数据
    var a = document.createElement('a') // 生成一个a元素
    var event = new MouseEvent('click') // 创建一个单击事件
    a.download = name || 'photo' // 设置图片名称
    a.href = url // 将生成的URL设置为a.href属性
    a.dispatchEvent(event) // 触发a的单击事件
  }
  image.src = imgsrc + '?time=' + new Date().valueOf()
}

// 下载base64地址格式的图片
export function dowmloadBase (imgUrl, name = '图片下载') {
  if (window.navigator.msSaveOrOpenBlob) {
    var bstr = atob(imgUrl.split(',')[1])
    var n = bstr.length
    var u8arr = new Uint8Array(n)
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n)
    }
    var blob = new Blob([u8arr])
    window.navigator.msSaveOrOpenBlob(blob, name + '.' + 'png')
  } else {
    // 这里就按照chrome等新版浏览器来处理
    const a = document.createElement('a')
    a.href = imgUrl
    a.setAttribute('download', name)
    a.click()
  }
}
// 调用 dowmloadBase(this.base, '二维码下载')

// 文件上传 https://developer.mozilla.org/zh-CN/docs/Web/API/File/Using_files_from_web_applications#Example.3A_Using_object_URLs_to_display_images
/* <input type="file" id="fileItem" multiple onchange="processFiles(this.files)" />
<img class="previewImg" src=""/> */
// documen.getElementById('fileItem').files[0]; // 得到文件的对象
export function processFiles (files) {
  var dataUrl
  var file = files[0]
  var fr = new FileReader()
  // fr.readAsBinaryString(file) 读取文件内容，读取完成，result属性中将包含所读取文件的原始二进制数据。
  // fr.readAsText(file) 读取文件内容,读取完成,result属性中将包含一个字符串以表示所读取的文件内容。
  // fr.readAsArrayBuffer(file) 读取文件内容,读取完成,result 属性中保存的将是被读取文件的 ArrayBuffer 数据对象.
  fr.onload = function () { // 文件读取成功回调
    dataUrl = fr.result // result属性为data:URL格式,与读取方式有关
    document.querySelector('img.previewImg').src = dataUrl
  }
  fr.readAsDataURL(file) // 读取文件内容，读取完成,result属性中将包含一个data: URL格式的字符串以表示所读取文件的内容。

  // 获得一个http格式的url路径
  var windowURL = window.URL
  // createObjectURL创建一个指向该参数对象(图片)的URL--创建的是一个临时的地址
  var dataURL = windowURL.createObjectURL(files[0])
}
