var userName=request("uname");
var userEmail=request("email");
$(function () {
	$("#email").text(userEmail);
});
	
function mailValidate(){
	var service = {};
	service.userName = userName; 
	var fn = "mailValidate";
	service = Commonjs.jsonToString(service);
	var params = Commonjs.getParams(fn,service);//获取参数
	Commonjs.ajaxTrue(weburl,params,sendSuccess,true,"发送中...");   
}

function sendSuccess(data){ 
	$("#setmail").attr("style", "display:none");
	var count = 60;
	var countdown = setInterval(CountDown, 1000);
 	function CountDown() {
		$("#miao").html("重新发送(" + count + ")");
		if (count == 0) {
			$("#setmail").attr("style", "display:block");
		 	$("#miao").html("");
		 	clearInterval(countdown); 
		}
		count--;
 	}	 
}

function verifyMail(){
	if($.trim($("#checkcode").val()) == ""){
		Commonjs.alert('请输入邮箱验证码'); 
	 	$("#userName").focus();
		return false;
	}
	var service = {};
	service.userName = userName;
	service.checkcode = $("#checkcode").val();
	var fn = "verifymail";
	service = Commonjs.jsonToString(service);
	var params = Commonjs.getParams(fn,service);//获取参数
	Commonjs.ajaxTrue(weburl,params,verifyMailSuccess,false); 
}

function verifyMailSuccess(data){  
	window.location.href="resetpwd.html?uname="+userName+"&checkcode="+$("#checkcode").val();
}