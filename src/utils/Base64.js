const Base64 = {
  //加密
  encode(str) {
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
    function toSolidBytes(match, p1) {
        return String.fromCharCode('0x' + p1);
    }));
  },
  //解密
  decode(str) {
    return decodeURIComponent(atob(str).split('').map(function (c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
  }
}
export default Base64

// 传递对象和普通数据的时候,使用方法都一样
// query: {
//   prople: this.$Base64.encode(JSON.stringify(this.prople))
//   name: this.$Base64.encode(JSON.stringify(this.name))
// }

// 接收 this.prople = JSON.parse(this.$Base64.decode(this.$route.query.prople))
//     this.names = JSON.parse(this.$Base64.decode(this.$route.query.name))
