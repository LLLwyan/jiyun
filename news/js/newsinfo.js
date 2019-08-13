var id;
$(function () {
	 id = request("id");
	 if(id=="")
	 {
		Commonjs.alerturl('未选择新闻',realPath+'/index/index.html');
		return;
	 }
	 getNewsInfo(id);
});
function getNewsInfo(id){
	var service = {};
	service.id = id;
	var fn = "getSysArticle";
	service = Commonjs.jsonToString(service);
	var params = Commonjs.getParams(fn, service);//获取参数
	
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
			if(data.data.parentId!="news")
			 {
				Commonjs.alerturl('参数错误',realPath+'/index/index.html');
				return;
			 }
			$("#noticeinfo").empty();
			var noticeinfo='';
			noticeinfo+='<h3>'+data.data.title+'</h3>';
			noticeinfo+='<div class="xy_content">'+data.data.content+'</div>';
			$('#noticeinfo').append(noticeinfo);	
		}				
	});
}