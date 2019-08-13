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

/* document.write('<link rel="stylesheet" href="'+realPath+'https://cdn.bootcss.com/bootstrap/4.1.0/css/bootstrap.min.css">'); */
document.write('<link rel="stylesheet" href="'+realPath+'/css/bootstrap.min.css">');
/* document.write('<link rel="stylesheet" href="'+realPath+'http://www.jq22.com/jquery/font-awesome.4.6.0.css">'); */
document.write('<link rel="stylesheet" href="'+realPath+'/css/animate.css">');
document.write('<link rel="stylesheet" href="'+realPath+'/css/owl.carousel.min.css">');
document.write('<link rel="stylesheet" href="'+realPath+'/css/meanmenu.min.css">');
document.write('<link rel="stylesheet" href="'+realPath+'/css/style2.css">');
document.write('<link rel="stylesheet" href="'+realPath+'/css/head-footer.css">');
document.write('<link rel="stylesheet" href="'+realPath+'/public/css/artDialog.css">');