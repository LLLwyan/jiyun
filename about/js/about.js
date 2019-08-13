var content = request("content");
$(function(){
	getAgreement();
});

function getAgreement(){
	var service = {};
	service.flag = content;
	var fn="getAgreement";
	service = Commonjs.jsonToString(service);
	var params = Commonjs.getParams(fn,service);//获取参数
	var data=Commonjs.ajax(weburl,params,false);
	if(data.result == "success"){
		$("#about_info_ff").html("");
		var head = "";
		head += '<h2>'+data.data.title+'</h2>';
		var flag = (data.data.flag).toUpperCase();
		head += '<p>'+flag+'</p>';
		$("#about_info_ff").append(head);
		//content
		$("#about_count").html("");
		var contentcontent="";
		contentcontent+=data.data.content;
		$("#about_count").append(contentcontent);
	}
}