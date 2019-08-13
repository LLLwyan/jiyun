var result=true;
$(function () {
    //会员名
    var comserver = '《'+ webname +'用户协议》';
    $('#comserver').html(comserver);
    $('.register_shoppingcart_center2_201').html(webname+' 丨 一站式互联网基础接入服务商');
    $("#txtUserName").blur(function () {
        var userName = $(this).val();
        var objthis = $(this);
        var obj = $(this).parent().parent().next("li");
        userName = userName.toLowerCase();
        objthis.parent().removeClass('on1').removeClass('on2');
        if ($.trim(userName) == "") {
            objthis.parent().addClass('on1');
            objthis.parent().parent().find("p").hide();
            obj.attr("class", "register_msg msg1 dh");
            obj.text("会员名不能为空");
            return;
        }
        if(!CndnsValidate.checkUserName(userName)){
        	objthis.parent().addClass('on1');
            objthis.parent().parent().find("p").hide();
            obj.attr("class", "register_msg msg1 dh");
            obj.text("会员名不符合规则");
            result= false;
        }else {
            obj.attr("class", "register_msg msg3");
            obj.text("");
        }
        isRegister(userName);
    });

    //会员密码
    $("#txtPassWord").blur(function () {
        var usrPassWord = $(this).val();
        var obj = $(this).parent().parent().next("li");

        $(this).parent().removeClass('on1').removeClass('on2');
        if ($.trim(usrPassWord) == "" || !CndnsValidate.checkPassWord(usrPassWord)) {
            $(this).parent().addClass('on1');
            obj.attr("class", "register_msg msg1 dh");
            obj.text("密码不符合要求");
            obj.show();
            $(this).parent().parent().find("p").hide();
            result= false;
        } else {
            obj.attr("class", "register_msg msg3");
            obj.text("");
        }
    });

    $("#txtPassConfirm").blur(function () {
        var usrPassConfirm = $(this).val();
        var usrPassWord = $("#txtPassWord").val();
        var obj = $(this).parent().parent().next("li");
        $(this).parent().removeClass('on1').removeClass('on2');
        if ($.trim(usrPassConfirm) == "" || usrPassConfirm != usrPassWord) {
            $(this).parent().addClass('on1');
            obj.attr("class", "register_msg msg1 dh");
            obj.text("两次密码输入不一致，请重新输入");
            result= false;
        } else {
            //$(this).attr("class", "register_shoppingcart_center2_2text on3");
            obj.attr("class", "register_msg msg3");
            obj.text("");
        }
    });

    //邮箱
    $("#txtEmail").blur(function () {
        var Email = $(this).val();
        var objthis = $(this);
        var obj = $(this).parent().parent().next("li");
        Email = Email.toLowerCase();
        objthis.parent().removeClass('on1').removeClass('on2');
        if ($.trim(Email) == "") {
            objthis.parent().addClass('on1');
            objthis.parent().parent().find("p").hide();
            obj.attr("class", "register_msg msg1 dh");
            obj.text("邮箱不能为空");
            return;
        }
        if (!CndnsValidate.checkEmail(Email)) {
            objthis.parent().addClass('on1');
            objthis.parent().parent().find("p").hide();
            obj.attr("class", "register_msg msg1 dh");
            obj.text("邮箱格式错误");
            result= false;
        }else{
        	obj.attr("class", "register_msg msg3");
        	obj.text("");
            isRegisterEmail(Email);
        }
    });

    //手机号
    $("#txtMobile").blur(function () {
        var usrMbl = $(this).val();
        var obj = $(this).parent().parent().next("li");
        $(this).parent().removeClass('on1').removeClass('on2');
        if ($.trim(usrMbl) == "" || !CndnsValidate.checkMobile(usrMbl)) {
            $(this).parent().addClass('on1');
            obj.attr("class", "register_msg msg1 dh");
            obj.text("请填写真实手机号码");
            result= false;
        } else {
            obj.attr("class", "register_msg msg3");
            obj.text("");
        }
    });

    $("#registercode").blur(function () {
        var val = $(this).val();
        if (val.length != 4) {
            $("#codemsg").attr("class", "register_msg msg1 dh");
            $("#codemsg").text("请填写4位验证码!");
            result= false;
        }
    })
});

function isRegister(userName){
	var service = {};
	service.userName = userName;
	var fn="isRegister";
	service = Commonjs.jsonToString(service)
	var params = Commonjs.getParams(fn,service);//获取参数
	Commonjs.ajaxTrue(weburl,params,isRegisterSuccess,true,"正在检测中...");
}

function isRegisterSuccess(data){
	if(data.data==null)
		return;

	if(data.data.code=="-1"){
		//Commonjs.alert("该会员名已注册！");
		var objthis = $("#txtUserName");
		var obj = objthis.parent().parent().next("li");
	    objthis.parent().removeClass('on1').removeClass('on2');
		objthis.parent().addClass('on1');
        objthis.parent().parent().find("p").hide();
        obj.attr("class", "register_msg msg1 dh");
        obj.text("该会员名已注册");
	}
}

function isRegisterEmail(Email){
	var service = {};
	service.Email = Email;
	var fn="isRegisterEmail";
	service = Commonjs.jsonToString(service)
	var params = Commonjs.getParams(fn,service);//获取参数
	Commonjs.ajaxTrue(weburl,params,isRegisterEmailSuccess,true,"正在检测中...");
}

function isRegisterEmailSuccess(data){
	if(data.data==null)
		return;

	if(data.data.code=="-1"){
		//Commonjs.alert("该会员名已注册！");
		var objthis = $("#txtEmail");
		var obj = objthis.parent().parent().next("li");
	    objthis.parent().removeClass('on1').removeClass('on2');
		objthis.parent().addClass('on1');
        objthis.parent().parent().find("p").hide();
        obj.attr("class", "register_msg msg1 dh");
        obj.text("该邮箱已注册");
	}
}

//注册会员
function regMember(objs) {
    $(objs).next('p').html('');
    var usrName = $("#txtUserName").val();
    var usrPassWord = encodeURIComponent($("#txtPassWord").val());
    var usrPassConfirm = encodeURIComponent($("#txtPassConfirm").val());
    var usrMbl = $("#txtMobile").val();
    var user_u_ctt_cn = $("#agreeBox").val();
    var code = $("#registercode").val();
	var email = $("#txtEmail").val();
    var obj = "";
    var this_obj = "";
    usrName = usrName.toLowerCase();
	 if ($.trim(usrName) == "" || !CndnsValidate.checkUserName(usrName)) {
        $("#txtUserName").parent().removeClass('on1').removeClass('on2').addClass('on1');
        $("#txtUserName").parent().parent().find("p").hide();
        $("#txtUserName").parent().parent().next("li").attr("class", "register_msg msg1 dh");
        $("#txtUserName").parent().parent().next("li").text("会员名格式错误");
		$("#txtUserName").focus();
        return false;
    }
    if ($.trim(usrPassWord) == "" || !CndnsValidate.checkPassWord(usrPassWord)) {
        obj = $("#txtPassWord");
        this_obj = obj.parent().parent().next("li");
        obj.parent().removeClass('on1').removeClass('on2').addClass('on1');
        this_obj.attr("class", "register_msg msg1 dh");
        this_obj.text("密码不符合要求");
		obj.focus();
        return false;
    }
    if ($.trim(usrPassConfirm) == "" || usrPassConfirm != usrPassWord) {
        obj = $("#txtPassConfirm");
        this_obj = obj.parent().parent().next("li");
        obj.parent().removeClass('on1').removeClass('on2').addClass('on1');
        this_obj.attr("class", "register_msg msg1 dh");
        this_obj.text("两次密码输入不一致，请重新输入");
		obj.focus();
        return false;
    }

    if ($.trim(usrMbl) == "" || !CndnsValidate.checkMobile(usrMbl)) {
        obj = $("#txtMobile");
        this_obj = obj.parent().parent().next("li");
        obj.parent().removeClass('on1').removeClass('on2').addClass('on1');
        this_obj.attr("class", "register_msg msg1 dh");
        this_obj.text("请输入合法的手机号码");
		obj.focus();
        return false;
    }
    if ($.trim(code) == "" ) {
    	obj = $("#registercode");
        var obj = obj.parent().parent().next("li");
        $(this).parent().removeClass('on1').removeClass('on2');
        if (code.length != 4) {
            $(this).parent().addClass('on1');
            obj.attr("class", "register_msg msg1 dh");
            obj.text("请填写4位验证码!");
			obj.focus();
            return false;
        }
    }

    var service = {};
	service.userName = usrName;
	service.userType = $('input[name="userType"]:checked').val();
	service.email = email;
	service.mobile = usrMbl;
	service.password=usrPassWord;
	service.checkcode=code;
	var fn="register";
	service = Commonjs.jsonToString(service)
	var params = Commonjs.getParams(fn,service);//获取参数
	Commonjs.ajaxTrue(weburl,params,registerSuccess,true,"正在注册中...");
}

function registerSuccess(data) {
	if(data==null){
		return false;
	}
	$.session.set("reguid",data.data.uid);
	Commonjs.alerturl("注册成功，请登录邮箱激活账户","regactivity.html");
}
//获取验证码
refreshVcode();
