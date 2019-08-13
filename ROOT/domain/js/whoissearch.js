$(function (){
	var domain = request("domain");
	whois(domain);
});	


function whois(domainName){
	$("#domainName").val(decodeURI(domainName));
	var service = {};		
	service.domainName = encodeURI(encodeURI(domainName));
	var fn="rawwhois";
	service = Commonjs.jsonToString(service);
	var params = Commonjs.getParams(fn,service);
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
			$('#infos').html(data.msg);
		},
		error: function () {
			alertNew('查询失败,请稍后再查');
    	}
	});
}	

function searchwhois(){
	var domainName=$("#domainName").val();
	if($.trim(domainName) == ""){
		alertNew('请输入域名');
	}
	location.href="whoissearch.html?domain="+domainName;
}	