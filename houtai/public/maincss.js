// JavaScript Document
//获取当前网址
var curWwwPath=window.document.location.href;
var pathName=window.document.location.pathname;
var pos=curWwwPath.indexOf(pathName);
var localhostPath=curWwwPath.substring(0,pos);
var projectName=pathName.substring(0,pathName.substr(1).indexOf('/')+1);
var realPath=localhostPath;

document.write('<link rel="stylesheet" href="'+realPath+'/public/bootstrap/css/bootstrap.min.css">');
document.write('<link rel="stylesheet" href="'+realPath+'/public/css/load.css">');
document.write('<link rel="stylesheet" href="'+realPath+'/public/css/style.min.css">');
document.write('<link rel="stylesheet" href="'+realPath+'/public/css/font-awesome.min.css">');
document.write('<link rel="stylesheet" href="'+realPath+'/public/css/popup.css">');
document.write('<link rel="stylesheet" href="'+realPath+'/public/css/jquery.datetimepicker.css">');
document.write('<link rel="stylesheet" href="'+realPath+'/public/bootstrap/css/bootstrap.min.css">');
document.write('<link rel="stylesheet" href="'+realPath+'/public/css/artDialog.css">');
document.write('<link rel="stylesheet" href="'+realPath+'/public/css/pager.css">');
document.write('<link rel="stylesheet" href="'+realPath+'/houtai/css/manage.css">');
document.write('<link rel="stylesheet" href="'+realPath+'/public/css/style.css">');
document.write(unescape('%3Cscript%20src%3D%22'+realPath+'/public/js/jquery.min.js%22%3E%3C/script%3E'));
document.write('<link rel="shortcut icon" href="'+realPath+'/favicon.ico">');
document.write('<link rel="stylesheet" href="'+realPath+'/public/fonts/iconfont.css">');
