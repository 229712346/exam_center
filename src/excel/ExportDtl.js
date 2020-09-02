import api_score from "../../api/api_score";
let exportDtl={
  exportDtlReal(classesId,xh,studentName,gradeYear,status) {
    let params = { // 参数
      classesId: classesId,
      xh: xh,
      studentName: studentName,
      gradeYear: gradeYear,
      status:status,
    };
    api_score.scoreExportDetail(params).then(function (res) {
      const content = res;
      const blob = new Blob([content], {type: 'application/vnd.ms-excel;charset=utf-8'});
      let yy = new Date().getFullYear();
      let mm = new Date().getMonth()+1;
      let dd = new Date().getDate();
      let hh = new Date().getHours();
      let mf = new Date().getMinutes()<10 ? '0'+new Date().getMinutes() : new Date().getMinutes();
      let ss = new Date().getSeconds()<10 ? '0'+new Date().getSeconds() : new Date().getSeconds();
      let nowTime = ''+yy+mm+dd+hh+mf+ss;
      const fileName = '班级评分详细表'+nowTime+'.xls'
      if ('download' in document.createElement('a')) { // 非IE下载
        const eLink = document.createElement('a')
        eLink.download = fileName;
        eLink.style.display = 'none';
        eLink.href = URL.createObjectURL(blob);
        document.body.appendChild(eLink);
        eLink.click();
        URL.revokeObjectURL(eLink.href) ;// 释放URL 对象
        document.body.removeChild(eLink)
      } else { // IE10+下载
        navigator.msSaveBlob(blob, fileName)
      }
    }).catch(error => {
      console.log(error);
    });

  },
};
export default exportDtl;
