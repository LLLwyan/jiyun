$(function(){
	$('#u_name').html($.cookie('uat'));	
})

//更新会员密码
function updatePwd(){
	var service = {};
	var oldKey = $("#oldKey");
	var newKey = $("#newKey");
	var new_password = $("#new_password");
	
	if(Commonjs.isEmpty(oldKey.val())){
		$.tooltip('旧密码不能为空',2000,false); 
		oldKey.focus();
		return false;
	}
	if(!CndnsValidate.checkPassWord(newKey.val())){
		$.tooltip('密码由字母、数字和特殊符号组成，区分大小写(6~16位)',2000,false); 
		newKey.focus();
		return false;
	}
	if(	oldKey.val() == newKey.val()){
		$.tooltip('新密码与旧密码不能一致，请重新输入',2000,false); 
		newKey.focus();
		return false;
	}
	if($.trim(new_password.val()) == "" || new_password.val() != newKey.val()){
		$.tooltip('两次密码输入不一致，请重新输入',2000,false); 
		new_password.focus();
		return false;
	}
	service.oldKey = encodeURIComponent(oldKey.val());
	service.newKey = encodeURIComponent(newKey.val());
	var fn="updatePwd";
	service = Commonjs.jsonToString(service)
	var params = Commonjs.getParams(fn,service);//获取参数
	Commonjs.ajaxTrue(weburl,params,updatePwdSuccess,true,"正在更新中...");
}

function updatePwdSuccess(data){
	Commonjs.alert(data.msg);
	$("#oldKey").val('');
	$("#newKey").val('');
	$("#new_password").val('');
}