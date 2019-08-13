$(function () {
	var code=request("code");
	var sendFlag = false;
	if(isNotNull(code))
		if(code=="expiry")
			$("#msg").html("会话已过期，请重新登录");

	/*if ($.cookie(config.cookie.userName)==null || $.cookie(config.cookie.userName)=="undefined"){

	}else{
		window.location.href='./usercenter/index.html';
	}*/

	//会员名
    $("#u_name").focus(function () {
		$("#u_name_msg").attr("class", "login_msg msg2");
		$("#u_name_msg").text("请输入您的会员名");
    }).blur(function () {
		var usrName = $(this).val();
		var objthis = $(this);
		if ($.trim(usrName) == "") {
			$("#u_name_msg").attr("class", "login_msg msg1");
			$("#u_name_msg").text("会员名不能为空");
            return false;
        }
		$("#u_name_msg").attr("class", "");
		$("#u_name_msg").text("");
	});
	//密码
	$("#u_password").focus(function () {
		$("#u_password_msg").attr("class", "login_msg msg2");
		$("#u_password_msg").text("请输入您的验证码");
    }).blur(function () {
		 var usrPword = $(this).val();
		   var objthis = $(this);
		  if ($.trim(usrPword) == "") {
			$("#u_password_msg").attr("class", "login_msg msg1");
			$("#u_password_msg").text("验证码不能为空");
            return false;
        }
		 $("#u_password_msg").attr("class", "");
		$("#u_password_msg").text("");
	 });


	//滑块拖动标识
    function DragValidate (dargEle,msgEle){
        var dragging = false;//滑块拖动标识
        var iX;
        dargEle.mousedown(function(e) {
            msgEle.text("");
            dragging = true;
            iX = e.clientX; //获取初始坐标
        });
        $(document).mousemove(function(e) {
            if (dragging) {
                var e = e || window.event;
                var oX = e.clientX - iX;
                if(oX < 30){
                    return false;
                };
                if(oX >= 210){//容器宽度+10
                    oX = 200;
                    return false;
                };
                dargEle.width(oX + "px");
                //console.log(oX);
                return false;
            };
        });
        $(document).mouseup(function(e) {
            var width = dargEle.width();
            if(width < 180){
                //console.log(width);
                dargEle.width("30px");
                msgEle.text(">>拖动滑块获取验证码<<");
            }else{
                var usrName = $("#u_name").val();
                if ($.trim(usrName) == "") {
                    $("#u_name_msg").attr("class", "login_msg msg1");
                    $("#u_name_msg").text("会员名\\邮箱\\手机号不能为空");
                    return false;
                }

                if (sendFlag) {
                    return;
                }
                sendFlag = true;

                var service = {};
                service.userName = usrName;
                var fn="getLoginCode";
                service = Commonjs.jsonToString(service)
                var params = Commonjs.getParams(fn,service);//获取参数

                $.ajax({
                    datatype: "json",
                    type: "POST",
                    url: weburl,
                    data: params,
                    async: true,
                    timeout: 8000,
                    cache: false,
                    success: function (obj) {
						//$('#u_password_msg').attr('验证码已发送成功，请注意查收');
                        dargEle.attr("validate","true").text("验证码已发送成功！").unbind("mousedown");
                    }
                });

            }
            dragging = false;
        });
    }

    DragValidate($("#dragEle"),$(".tips"));
    $("#submit").click(function(){
        if(!$("#dragEle").attr("validate")){
            alert("请先拖动滑块验证！");
        }else{
            alert("验证成功！");
        }
    });

});

//登录
function logMember(objs) {
	var usrName = $("#u_name").val();
    var usrPassWord = $("#u_password").val();
    var code = $("#u_code").val();
	if ($.trim(usrName) == "") {
			$("#u_name_msg").attr("class", "login_msg msg1");
			$("#u_name_msg").text("会员名\\邮箱\\手机号不能为空");
            return false;
        }
	if ($.trim(usrPassWord) == "") {
			$("#u_password_msg").attr("class", "login_msg msg1");
			$("#u_password_msg").text("密码不能为空");
            return false;
        }
	var service = {};
	service.userName = usrName;
	service.password = cloudEncrypt.encodePublic(encodeURIComponent(usrPassWord));
	var fn="codeLogin";
	service = Commonjs.jsonToString(service);
	var params = Commonjs.getParams(fn,service);//获取参数

	$.ajax({
		datatype:"json",
		type:"POST",
		url: weburl,
		data:params,
		async: true,
		timeout : 8000,
		cache : false,
		success: function(obj){
			data =jQuery.parseJSON(obj);
			if(data.result == "success"){
				if(data.msg != "已登录，无需再登录"){
					var cookietime = new Date();
					var date = new Date();
					cookietime.setTime(date.getTime() + (360 * 360 * 1000));//coockie保存1小时
					$.cookie(config.cookie.userName,data.data.userName,{expires: cookietime,path:"/"});
					window.location.href='usercenter/index.html';
				}else{
					Commonjs.alert("请勿重复登陆");
				}
			}else
			{
				refreshVcode();
				$("#u_password").val('');
				$("#u_code").val('')
				if(data.result=="S210")
				{
					$.session.set("reguid",data.data.userId);
					Commonjs.alerturl(data.msg+",点击确定,重新激活帐号","register/regactivity.html");
				}else{
					Commonjs.alert(data.msg);
					return false;
				}
			}
		}
	});
}

//刷新验证码
refreshVcode();
