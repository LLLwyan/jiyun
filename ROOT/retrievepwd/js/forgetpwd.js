$(function(){
	//刷新验证码
	refreshVcode();
});

var userName;
function checkoutUserName() {
	userName = $("#userName").val();
    var checkcode = $("#checkcode").val();
	if($.trim(userName) == ""){
		Commonjs.alert('请输入会员名'); 
	 	$("#userName").focus();
		return false; 
	}
	
	if($.trim(checkcode) == ""){
		Commonjs.alert('请输入验证码');  
	 	$("#checkcode").focus();
		return false;
	}
	
	var service = {};
	service.userName = userName;
	service.checkcode = checkcode;
	var fn="sendFindPwdMail";
	service = Commonjs.jsonToString(service)
	var params = Commonjs.getParams(fn,service);//获取参数
	Commonjs.ajaxTrue(weburl,params,checkoutSuccess,false);  
}

function checkoutSuccess(data){
	if(data.data==null)
		return;
	
	window.location.href="confirm.html?uname="+userName+"&email="+data.data.email; 
}