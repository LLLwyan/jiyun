var hostType="";
var zoneId="";

$(function(){
	hostType=request("hostType");
	zoneId = request("zoneId");
	
	queryDicZoneInfo();
})

function queryDicZoneInfo(){
	var service = {};
	service.hostType=hostType; 
	service.zoneId=zoneId;
	var fn="queryDicZone";
	service = Commonjs.jsonToString(service)
	var params = Commonjs.getParams(fn,service);//获取参数
	Commonjs.ajaxTrue(weburl,params,querySuccess);
}

function querySuccess(data){
	if(data.data==null)
		return;
	$("#zoneName").html(data.data.zoneName);
	
	var apiInfo=data.data.apiInfo;
	$("#osAdminUrl").val(apiInfo.osAdminUrl);
	$("#osAdminName").val(apiInfo.osAdminName);
	$("#osAdminPassword").val(apiInfo.osAdminPassword);
	$("#osUserUrl").val(apiInfo.osUserUrl);
	$("#osUserName").val(apiInfo.osUserName);
	$("#osUserPassword").val(apiInfo.osUserPassword);
	$("#adminProjectName").val(apiInfo.adminProjectName);
	$("#userProjectName").val(apiInfo.userProjectName);
	$("#adminProjectId").val(apiInfo.adminProjectId);
	$("#userProjectId").val(apiInfo.userProjectId);
	$("#adminDomainName").val(apiInfo.adminDomainName);
	$("#userDomainName").val(apiInfo.userDomainName);
	$("#adminDomainId").val(apiInfo.adminDomainId);
	$("#userDomainId").val(apiInfo.userDomainId);
	$("#networkName").val(apiInfo.networkName); 
	$("#networkID").val(apiInfo.networkID);
}

function saveInterfaceSet(){
	var apiInfo = {};
	apiInfo.osAdminUrl=$("#osAdminUrl").val();
	apiInfo.osAdminName=$("#osAdminName").val();
	apiInfo.osAdminPassword=$("#osAdminPassword").val();
	apiInfo.osUserUrl=$("#osUserUrl").val();
	apiInfo.osUserName=$("#osUserName").val();
	apiInfo.osUserPassword=$("#osUserPassword").val();	
	apiInfo.adminProjectName=$("#adminProjectName").val();
	apiInfo.userProjectName=$("#userProjectName").val();
	apiInfo.adminProjectId=$("#adminProjectId").val();
	apiInfo.userProjectId=$("#userProjectId").val();
	apiInfo.adminDomainName=$("#adminDomainName").val();
	apiInfo.userDomainName=$("#userDomainName").val();
	apiInfo.adminDomainId=$("#adminDomainId").val();
	apiInfo.userDomainId=$("#userDomainId").val();	
	apiInfo.networkName=$("#networkName").val();
	apiInfo.networkID=$("#networkID").val();    
	apiInfo = Commonjs.jsonToString(apiInfo)
	
	var service = {}; 
	service.hostType=hostType; 
	service.zoneId=zoneId; 
	service.apiInfo=apiInfo;
	var fn="zoneInterfaceSet";
	service = Commonjs.jsonToString(service)
	var params = Commonjs.getParams(fn,service);//获取参数
	Commonjs.ajaxTrue(weburl,params,saveSuccess);
}

function saveSuccess(data){
	$.tooltip(data.msg, 2000, true);
}

function backLast() {
	window.history.back();
}