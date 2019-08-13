$(function(){
    var domainName = request("domainName");
    if(domainName == null || domainName == '' || domainName == "undefined"){
        Commonjs.alerturl("域名不能为空","/default/usercenter/index.html");
    }
    queryUserDomainDetails(domainName)
});


//新网登录控制面板，刷新验证码
function XibNetChangeCheckCode(){
    var dt = Math.random();
    document.getElementById('validateCodeImg').src="http://dcp.xinnet.com/Modules/agent/domain/validate_picture.jsp?d="+dt;
}

//隐藏上级注册商页面
function loginHtmlHide(){
    $("#XinNetLogin").hide();
    $("#ZGSJLogin").hide();
    $("#GodaddyLogin").hide();
}

//获取详情
function queryUserDomainDetails(domain){
    var service = {};
    var fn = "getDomainDetail";
    service.domainName = domain;
    service = Commonjs.jsonToString(service);
    var params = Commonjs.getParams(fn, service);//获取参数
    Commonjs.ajaxTrue(weburl,params,querySuccess);
}

function querySuccess(data){
    if(!isNotNull(data.data)){
        Commonjs.alerturl("不支持的注册商","/houtai/index.html");
    }
    var view=data.data.domainDetail;
    loginHtmlHide();
    if (view.regType == 3){ // 新网
        $("#XinNetLogin").show();
        XibNetChangeCheckCode();
        $("#XWdomainName").val(view.domainName);
        $("#XWpassword").val(view.managepass);
    } else if(view.regType == 4) { // 中国数据
        $("#ZGSJLogin").show();
        $("#ZGSJdomain").val(view.domainName);
        $("#ZGSJpassword").val(view.managepass);
    } else if(view.regType == 21) { // Godaddy
        $("#GodaddyLogin").show();
        godaddyGetAccountInfo(view.remark);
        $("#GDAccount").html(gdAccount);
        $("#GDPassword").html(gdPass);
    } else {
        Commonjs.alerturl("暂不支持","/houtai/index.html");
    }
}

function godaddyGetAccountInfo(remark) {
    if (remark == ""){
        return;
    }
    var strs = new Array(); //定义一数组
    strs = remark.split("|");
    for (i=0;i<strs.length ;i++ ) {

        var strs2 = new Array();
        strs2 = strs[i].split(":");
        if (strs2.length == 2){
            if (strs2[0] == "shopperId"){
                gdAccount = strs2[1];
            }
            if (strs2[0] == "password"){
                gdPass = strs2[1];
            }
        }
    }
}