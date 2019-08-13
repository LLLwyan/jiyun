var domain = request("domain");
$(function(){
	queryUserDomainDetails(); 
});

//获取详情
function queryUserDomainDetails(){
	var service = {};
	var fn = "getDomainDetail";
	service.domainName = domain;
	service = Commonjs.jsonToString(service);
	var params = Commonjs.getParams(fn, service);//获取参数
	Commonjs.ajaxTrue(weburl,params,querySuccess);
	//queryDomaincert(domain);
}

function querySuccess(data){
	if(!isNotNull(data.data))
		return false;
	var view=data.data.domainDetail;   
	
	$("#u_orderid").html(view.orderId);    
	$("#u_username").html(view.userName);  
	$("#u_domain").html(view.domainName);
	$("#u_passwd").html(view.managepass);   
	$("#u_product").html(view.productCode);
	$("#u_status").html(view.statusName);
	$("#u_startime").html(jsonDateTimeFormat(view.startTime));
	$("#u_endtrme").html(jsonDateTimeFormat(view.endTime));
	$("#u_DNS1").html(view.dns1);
	$("#u_DNS2").html(view.dns2);
    $("#u_remark").html(view.remark);
}

//获取详情
function queryDomaincert(domainName){
	var service = {};
	service.domain = domainName;
	var fn = "getdomaincrert";
	service.domainName = domain;
	service = Commonjs.jsonToString(service);
	var params = Commonjs.getParams(fn, service);//获取参数
	Commonjs.ajaxTrue(weburl,params,queryDomaincertSuccess);	
}

function queryDomaincertSuccess(data){
	if(!isNotNull(data.result))
		return false;
	$('#cert').html("<img src='data:image/gif;base64,"+decodeURI(data.result)+"'/>");
}