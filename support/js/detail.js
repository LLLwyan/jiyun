var id=request("id");
$(function () {
	getOnlineHelpInfo(); 
});

function getOnlineHelpInfo(){
	var service = {};
	service.id = id;
	var fn = "getSysArticle";
	service = Commonjs.jsonToString(service);
	var params = Commonjs.getParams(fn, service);//获取参数
	Commonjs.ajaxTrue(weburl,params,getInfoSuccess,true,"正在加载数据...");
}

function getInfoSuccess(data){
	if(data.data==null)
		return false;
	
	var HelpInfo='';
	HelpInfo+='<h1 class="questitle">'+data.data.title+'</h1>';
	HelpInfo+='<div class="quesdetail">'+data.data.content+'</div>';
	$('#HelpInfo').html(HelpInfo);
}