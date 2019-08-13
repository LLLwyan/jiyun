$(function() {
	$('.register_shoppingcart_center2_201').html(webname);
});
function sendActiveUser(){
	var uid = $.session.get("reguid");
	if(uid=="" || uid=="undefined"){
		Commonjs.alert('发送失败,请联系客服');
		return;
	}	
	var service = {};
 	service.uid = uid;
 	//service.email = email; 	
 	var fn="sendActiveUser";
 	service = Commonjs.jsonToString(service)
 	var params = Commonjs.getParams(fn,service);//获取参数
 	var data=Commonjs.ajaxTrue(weburl,params,sendActiveUserSuccess,true,"正在重新发送...");
}
function sendActiveUserSuccess(data){
	if(data.data==null) 
		return false;
	var count = 15;
	var countdown = setInterval(CountDown, 1000);
	function CountDown() {
		$("#setmail").attr("style", "display:none");
		$("#miao").html("重新发送(" + count + ")");
		if (count == 0) {
			$("#setmail").attr("style", "display:block");
			$("#miao").html("");
			clearInterval(countdown);
		}
		count--;
	 }
}