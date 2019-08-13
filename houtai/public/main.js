if (undefined == realPath) {
    var curWwwPath=window.document.location.href;
    var pathName=window.document.location.pathname;
    var pos=curWwwPath.indexOf(pathName);
    var localhostPath=curWwwPath.substring(0,pos);
    var projectName=pathName.substring(0,pathName.substr(1).indexOf('/')+1);
    var realPath=localhostPath;
    document.write(unescape('%3Cscript%20src%3D%22'+realPath+'/public/js/jquery.min.js%22%3E%3C/script%3E'));
}
document.write(unescape('%3Cscript%20src%3D%22'+realPath+'/public/bootstrap/js/bootstrap.min.js%22%3E%3C/script%3E'));
document.write(unescape('%3Cscript%20src%3D%22'+realPath+'/public/js/jquery.md5.js%22%3E%3C/script%3E'));
document.write(unescape('%3Cscript%20src%3D%22'+realPath+'/public/js/jquery.cookies.js%22%3E%3C/script%3E'));
document.write(unescape('%3Cscript%20src%3D%22'+realPath+'/public/js/jquery.artDialog.js%22%3E%3C/script%3E'));
document.write(unescape('%3Cscript%20src%3D%22'+realPath+'/public/js/common.js%22%3E%3C/script%3E'));
document.write(unescape('%3Cscript%20src%3D%22'+realPath+'/public/js/htmlshiv.js%22%3E%3C/script%3E'));
document.write(unescape('%3Cscript%20src%3D%22'+realPath+'/public/js/respond.js%22%3E%3C/script%3E'));
document.write(unescape('%3Cscript%20src%3D%22'+realPath+'/public/bootstrap/js/bootstrap.min.js%22%3E%3C/script%3E'));
document.write(unescape('%3Cscript%20src%3D%22'+realPath+'/public/layer/layer.min.js%22%3E%3C/script%3E'));
document.write(unescape('%3Cscript%20src%3D%22'+realPath+'/public/laydate/laydate.js%22%3E%3C/script%3E'));
document.write(unescape('%3Cscript%20src%3D%22'+realPath+'/public/js/popup.js%22%3E%3C/script%3E'));
document.write(unescape('%3Cscript%20src%3D%22'+realPath+'/public/js/jquery.pager.js%22%3E%3C/script%3E'));
document.write(unescape('%3Cscript%20src%3D%22'+realPath+'/public/ueditor/ueditor.config.js%22%3E%3C/script%3E'));
document.write(unescape('%3Cscript%20src%3D%22'+realPath+'/public/ueditor/ueditor.all.js%22%3E%3C/script%3E'));;
document.write(unescape('%3Cscript%20src%3D%22'+realPath+'/public/js/CndnsValidate.js%22%3E%3C/script%3E'));
document.write(unescape('%3Cscript%20src%3D%22'+realPath+'/public/js/distpickerdata.js%22%3E%3C/script%3E'));
document.write(unescape('%3Cscript%20src%3D%22'+realPath+'/public/js/session.js%22%3E%3C/script%3E'));
document.write(unescape('%3Cscript%20src%3D%22'+realPath+'/public/js/utils.js%22%3E%3C/script%3E'));
document.write(unescape('%3Cscript%20src%3D%22'+realPath+'/public/fonts/iconfont.js%22%3E%3C/script%3E'));
document.write(unescape('%3Cscript%20src%3D%22'+realPath+'/public/cryptojs/crypto-js.js%22%3E%3C/script%3E'));
document.write(unescape('%3Cscript%20src%3D%22'+realPath+'/houtai/public/right.js%22%3E%3C/script%3E'));

