var proflag = request("flag");
$(function () {
	 getService();
});
function getService(){
	var service = {};
	service.flag = proflag;
	var fn = "getAgreement";
	service = Commonjs.jsonToString(service);
	var params = Commonjs.getParams(fn, service);//获取参数
	$.ajax({
		datatype:"json",
        type:"POST",
        url: weburl,
        data:params,
		cache : false,	
		success: function(data){
			var data=jQuery.parseJSON(data);
			if (data.result == "success") {
				$("#serviceagree").empty();
				var agreeinfo='';
				agreeinfo+='<h3>'+data.data.title+'</h3>';
				agreeinfo+='<div class="xy_content" style="border-bottom:1px solid #ccc;">'+data.data.content+'</div>';
				$('#serviceagree').append(agreeinfo);
			}
		},
		error: function () {
        	alertNew('服务器忙，请稍候再试！');
    	}
	});
	
}