//获取当前网址，如： http://localhost:8083/myproj/view/my.jsp
var curWwwPath=window.document.location.href;
   //获取主机地址之后的目录，如： myproj/view/my.jsp
var pathName=window.document.location.pathname;
var pos=curWwwPath.indexOf(pathName);
  //获取主机地址，如： http://localhost:8083
var localhostPath=curWwwPath.substring(0,pos);
  //获取带"/"的项目名，如：/myproj
var projectName=pathName.substring(0,pathName.substr(1).indexOf('/')+1);
 //得到了 http://localhost:8083/myproj
var realPath=localhostPath;

document.write('<link rel="stylesheet" href="'+realPath+'/public/css/global.css">');
document.write('<link rel="stylesheet" href="'+realPath+'/public/css/load.css">');
document.write('<link rel="stylesheet" href="'+realPath+'/public/bootstrap/css/bootstrap.min.css">');
document.write('<link rel="stylesheet" href="'+realPath+'/public/css/artDialog.css">');
document.write('<link rel="stylesheet" href="'+realPath+'/public/css/jquery.datetimepicker.css">');
document.write('<link rel="stylesheet" href="'+realPath+'/public/css/pager.css">');
document.write('<link rel="stylesheet" href="'+realPath+'/css/default.css">');
document.write('<link rel="stylesheet" href="'+realPath+'/public/css/popup.css">');
document.write('<link rel="stylesheet" href="'+realPath+'/public/css/style.css">');
document.write('<link rel="stylesheet" href="'+realPath+'/public/css/rangeslider.css">');
document.write('<link rel="icon" href="'+realPath+'/favicon.ico" type="image/x-icon">');
document.write('<link rel="stylesheet" href="'+realPath+'/public/css/jquery.toast.min.css">');
document.write('<link rel="stylesheet" href="'+realPath+'/public/fonts/iconfont.css">');
document.write('<link rel="stylesheet" href="'+realPath+'/css/nav.css">');

