var fn;
$(function () {
	ActiveUser();
	$('#register_shoppingcart_center2_201').html('帐户激活成功，欢迎访问'+webname+'！');
	$('.register_shoppingcart_center2_201').html(webname);
});
function ActiveUser(){
	var uid = request("uid");
	var code = request("code");
	if(uid=="")
	{
		Commonjs.alerturl('参数格式错误',realPath+'/login.html');
	}
	var service = {};
 	service.uid = uid;
 	service.code = code;
 	var fn="activeUser";
 	service = Commonjs.jsonToString(service)
 	var params = Commonjs.getParams(fn,service);//获取参数
	$.ajax({
		datatype:"json",
        type:"POST",
        url: weburl,
        data:params,
		cache : false,	
		success: function(data){
			var data=jQuery.parseJSON(data);
		 	if(data.result="success"){
		 		if(data.msg=="帐号已激活，不需要再次激活"){
		 			$.tooltip(data.msg, 2000, false);
		 		}else{
					$.tooltip(data.msg, 2000, true);
		 		}
		 	}
		 	else
		 	{
		 		Commonjs.alerturl("帐号激活失败,请联系客服人员",realPath+'/login.html');
		 	}
		},
		error: function () {
        	alertNew('服务器忙，请稍候再试！');
    	}
	});

}