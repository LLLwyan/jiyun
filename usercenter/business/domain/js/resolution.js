var domainName=null;
var regcid = null;
var admincid = null;
var techcid = null;
var billcid = null;
var resolutionCid ="";
var regtype=null;
var dns1="";
var dns2="";

$(function(){
	domainName=request("domainName");
	if(domainName==null || domainName =='' || domainName=="undefined"){
		Commonjs.alerturl("域名不能为空","./domain.html");
	}
	
	$("#domaininfo ul li").click(function(){
		 $(this).addClass("liactive").siblings().removeClass("liactive"); //切换选中的按钮高亮状态
		 var index=$(this).index(); //获取被按下按钮的索引值，需要注意index是从0开始的
		 $(".tab_box > div").eq(index).show().siblings().hide(); //在按钮选中时在下面显示相应的内容，同时隐藏不需要的框架内容
	});
		
	$("#userNameCn").on("keyup keydown change blur",function (){
		$("#userNameEn").val($(this).toPinyin());
	});
	$("#linkManLnCn").on("keyup keydown change blur",function (){
		$("#linkManLnEn").val($(this).toPinyin());
	});
	$("#linkManFnCn").on("keyup keydown change blur",function (){
		$("#linkManFnEn").val($(this).toPinyin());
	});
	//地区
	$("#countryCn").on("keyup keydown change blur",function (){
		$("#countryEn").html("");
		$("#countryEn").append("<option value='"+$(this).toPinyin()+"'>"+$(this).toPinyin()+"</option>");
	});
	$("#countryEn").append("<option value='"+$("#countryCn").toPinyin()+"'>"+$("#countryCn").toPinyin()+"</option>");

	//省份
	$("#cho_Province").on("keyup keydown change blur",function (){
		$("#cho_ProvinceEN").html("");
		$("#cho_ProvinceEN").append("<option value='"+$(this).toPinyin()+"'>"+$(this).toPinyin()+"</option>");
		$("#cho_CityEN").html("");
		$("#cho_CityEN").append("<option value='"+$("#cho_City").toPinyin()+"'>"+$("#cho_City").toPinyin()+"</option>");
	});
	$("#cho_ProvinceEN").append("<option value='"+$("#cho_Province").toPinyin()+"'>"+$("#cho_Province").toPinyin()+"</option>");
	//城市
	$("#cho_City").on("keyup keydown change blur",function (){
		$("#cho_CityEN").html("");
		$("#cho_CityEN").append("<option value='"+$(this).toPinyin()+"'>"+$(this).toPinyin()+"</option>");
	});
	$("#cho_CityEN").append("<option value='"+$("#cho_City").toPinyin()+"'>"+$("#cho_City").toPinyin()+"</option>");
	//通讯地址
	$("#addrCn").on("keyup keydown change blur",function (){
		$("#addrEn").val($(this).toPinyin());
	});
 	queryUserDomainList(domainName); 
})

function queryUserDomainList(domainName){
	var service = {};
	var fn = "queryUserDomainList";
	service.domainName = domainName;
	service.page =1;
	service.pageSize = 10;
	service = Commonjs.jsonToString(service);
	var params = Commonjs.getParams(fn, service);//获取参数
	Commonjs.ajaxTrue(weburl,params,querySuccess);	
}

function querySuccess(data){
	if(!isNotNull(data.data))
		return false;
	
	if(data.data.length<=0){
		Commonjs.alerturl("没有找到该域名信息","./domain.html");
		return;
	}
	var dataList=data.data.dataList;
	regcid = dataList[0].regCID;
	admincid = dataList[0].adminCID;
	techcid = dataList[0].techCID;
	billcid = dataList[0].billCID;
	regtype = dataList[0].regType
	$("#DNS1").val(dataList[0].dns1);
	$("#DNS2").val(dataList[0].dns2);
	if (regtype==2){
		$("#completedorders").hide();
		$("#nopayorders").hide();
		$("#processorders").hide();
	}
}

//修改DNS
function uptDNS(){ 
	$("#domaindns").show();
	$("#domaininfo").hide(); 
	$("#position").html("当前位置：修改DNS");
}

//自助解析
function domainControl(){
	var service = {};
	var fn = "domainControl"; 
	service.domainName = domainName;
	service = Commonjs.jsonToString(service);
	var params = Commonjs.getParams(fn, service);//获取参数
	Commonjs.ajaxTrue(weburl,params,gotoSuccess,false);
}

function gotoSuccess(data){
	if(data.data==null)
		return;
	
	
	var result=data.data;
	if(result.code=="-1")
		$.tooltip('未知注册商DNS',2000,false);
	if (regtype == 3 || regtype == 4){ // 新网
		window.open("./domainlogin.html?domainName="+domainName);
	} else if (regtype == 5){
		window.location.href = "./domainnameresolution.html?domainName="+domainName;
	}else {
		//if(result.code=="0")
		window.open(result.url);
	}
}

//修改联系人
function uptContacts(){
	
	//TODO阿里域名暂不支持修改联系人资料处理
	var tips = "";
	if (regtype == 5){
		$("#subUptContacts").hide();
		tips = "<strong class='redColor f-l10'>(阿里域名暂不支持修改域名资料)</strong>";
	}
    if (regtype == 3){
        $("#nopayorders").hide();
        $("#processorders").hide();
    }
	$("#domaindns").hide();
	$("#domaininfo").show();
	$("#position").html("当前位置：修改联系人" + tips);
	querycontacts("regcid");
}


function querycontacts(data){
	var cid=""; 
	resolutionCid=data;
	switch(data) 
	{
		case 'regcid':
			cid = regcid;
			break;
		case 'admincid':
			cid = admincid;
			break;
		case 'techcid':
			cid = techcid;
			break;
		case 'billcid':
			cid = billcid;
			break;
	}
	var service = {};
	var fn = "queryUserDomaincontactsList"; 
	service.CID = cid;
	service = Commonjs.jsonToString(service);
	var params = Commonjs.getParams(fn, service);//获取参数
	Commonjs.ajaxTrue(weburl,params,querycontactsSuccess,false);
}

function querycontactsSuccess(data){
	if(!isNotNull(data.data))
		return false;
	
	if(data.data.length<=0){
		Commonjs.alerturl("没有找到该域名信息","./domain.html");
		return;
	}
	var tempdata=data.data[0];
	$("#domainName").val(domainName);
	if(tempdata.userType ==1){
		$("#radio1").prop("checked",'checked');
	}else{
		$("#radio2").prop("checked",'checked');
	}
	$("#userNameCn").val(tempdata.userNameCn);
	$("#linkManLnCn").val(tempdata.linkManLnCn);
	$("#linkManFnCn").val(tempdata.linkManFnCn);
	
	$("#postcode").val(tempdata.postcode);
	$("#email").val(tempdata.email);
	
	$("#telArea").val(tempdata.telephoneArea);
	$("#telephone").val(tempdata.telephone);
	$("#telNumber").val(tempdata.telNumber);

	$("#faxArea").val(tempdata.faxArea);
	$("#fax").val(tempdata.fax);
	$("#faxNumber").val(tempdata.faxNumber);
	
	$("#addrCn").val(tempdata.addrCn);
	$("#userNameEn").val(tempdata.userNameEn);
	
	$("#linkManLnEn").val(tempdata.linkManLnEn);
	$("#linkManFnEn").val(tempdata.linkManFnEn);
	
	$("#addrEn").val(tempdata.addrEn);
	$("#countryCn").val(tempdata.countryCn);
	$("#cho_Province").val(tempdata.provinceCn);
	$("#CID").val(tempdata.cid);
	$("#cho_Province").trigger("change");
	$("#countryCn").trigger("change");
	$("#cho_City").val(tempdata.cityCn);
	$("#cho_City").trigger("change");
	$("#countryEn").val(tempdata.countryEn);
	$("#cho_ProvinceEN").val(tempdata.provinceEn);
	$("#cho_CityEN").val(tempdata.cityEn);	
}

//修改信息
function uptTemplate(){
	var service = {};
	service.resolutionCid=resolutionCid;
	service.CID=$("#CID").val();
	service.userNameCn=$("#userNameCn").val();
	service.postcode=$("#postcode").val();
	service.email=$("#email").val();
	service.addrCn=$("#addrCn").val();
	service.userNameEn=$("#userNameEn").val();
	service.addrEn=$("#addrEn").val();
	service.userType=$("input[name='userType']:checked").val();
	service.countryCn=$("#countryCn").val();
	service.provinceCn=$("#cho_Province").val();
	service.cityCn=$("#cho_City").val();
	service.countryEn=$("#countryEn").val();
	service.provinceEn=$("#cho_ProvinceEN").val();
	service.cityEn=$("#cho_CityEN").val();
	service.cid=$("#CID").val();
	
	service.linkManLnCn = $.trim($("#linkManLnCn").val());
	service.linkManFnCn = $.trim($("#linkManFnCn").val());
	service.linkManLnEn = $.trim($("#linkManLnEn").val());
	service.linkManFnEn = $.trim($("#linkManFnEn").val());	
	
	//电话和传真处理
	service.telephoneArea = $("#telArea").val();
	service.telephone = $("#telephone").val();
	service.telNumber = $("#telNumber").val();
	
	service.faxArea = $("#faxArea").val();
	service.fax = $("#fax").val();
	service.faxNumber = $("#faxNumber").val();
	
	//表单验证开始
	if(Commonjs.isEmpty(service.userNameCn)){
		$.tooltip('域名所有者不能为空',2000,false);
		$("#userNameCn").focus();
		return false;
	}
	
	if(Commonjs.isEmpty(service.linkManLnCn)){
		$.tooltip('域名管理者 姓 不能为空',2000,false);
		$("#linkManLnCn").focus();
		return false;
	}
	if(Commonjs.isEmpty(service.linkManFnCn)){
		$.tooltip('域名管理者 名 不能为空',2000,false);
		$("#linkManFnCn").focus();
		return false;
	}
	
	if(!CndnsValidate.checkPostCode(service.postcode)){
		$.tooltip('邮政编码格式不对',2000,false);
		$("#postcode").focus();
		return false;
	}
	if(!CndnsValidate.checkEmail(service.email)){
		$.tooltip('电子邮箱格式不对',2000,false);
		$("#email").focus();
		return false;
	}
	
	if(!(CndnsValidate.checkMobile(service.telephone) || CndnsValidate.checkTel1(service.telephoneArea+service.telephone))){
		$.tooltip('固话/手机格式不对',2000,false);
		$("#telephone").focus();
		return false;
	}
	
	if(!(CndnsValidate.checkMobile(service.fax) || CndnsValidate.checkTel1(service.faxArea+service.fax))){
		$.tooltip('传真格式不对',2000,false);
		$("#fax").focus();
		return false;
	}
	
	if(!CndnsValidate.checkChinese(service.addrCn)){
		$.tooltip('通讯地址必须包含中文',2000,false);
		$("#addrCn").focus();
		return false;
	}
	if(!CndnsValidate.checkEnglishName(service.userNameEn)){
		$.tooltip('英文所有者格式不对',2000,false);
		$("#userNameEn").focus();
		return false;
	}
	
	if(Commonjs.isEmpty(service.linkManLnEn)){
		$.tooltip('英文管理人 姓 不能为空',2000,false);
		$("#linkManLnEn").focus();
		return false;
	}
	if(Commonjs.isEmpty(service.linkManFnEn)){
		$.tooltip('英文管理人 名 不能为空',2000,false);
		$("#linkManFnEn").focus();
		return false;
	}
	
	if(!CndnsValidate.checkEnglishInput(service.addrEn)){
		$.tooltip('英文地址必须英文开头',2000,false);
		$("#addrEn").focus();
		return false;
	}
	if(Commonjs.isEmpty(service.countryCn)){
		$.tooltip('地区中文不能为空',2000,false);
		$("#countryCn").focus();
		return false;
	}
	if(Commonjs.isEmpty(service.provinceCn)){
		$.tooltip('省份中文不能为空',2000,false);
		$("#cho_Province").focus();
		return false;
	}
	if(Commonjs.isEmpty(service.cityCn)){
		$.tooltip('城市中文不能为空',2000,false);
		$("#cho_City").focus();
		return false;
	}
	if(Commonjs.isEmpty(service.countryEn)){
		$.tooltip('地区英文不能为空',2000,false);
		$("#countryEn").focus();
		return false;
	}
	if(Commonjs.isEmpty(service.provinceEn)){
		$.tooltip('省份英文不能为空',2000,false);
		$("#cho_ProvinceEN").focus();
		return false;
	}
	if(Commonjs.isEmpty(service.cityEn)){
		$.tooltip('城市英文不能为空',2000,false);
		$("#cho_CityEN").focus();
		return false;
	}
	//表单验证结束
	var fn="modUserDomaincontacts";
	service = Commonjs.jsonToString(service)
	var params = Commonjs.getParams(fn,service);//获取参数
	Commonjs.ajaxTrue(weburl,params,uptTemplateSuccess,false);
}

function uptTemplateSuccess(data){
	$.tooltip('修改成功',2000,false);
	querycontacts(resolutionCid);
}

//修改DNS
function uptdns(){
	if(Commonjs.isEmpty($("#DNS1").val())){
		$.tooltip('请输入DNS1',2000,false);
		$("#DNS1").focus();
		return false;
	}
	
	if(Commonjs.isEmpty($("#DNS2").val())){
		$.tooltip('请输入DNS2',2000,false);
		$("#DNS2").focus();
		return false;
	}
	dns1 = $("#DNS1").val();
	dns2 = $("#DNS2").val();
	var service = {};
	service.domainName = domainName;
	service.dns1 = $("#DNS1").val();
	service.dns2 = $("#DNS2").val();
	service.regType = regtype;
	var fn="uptDomainDns";
	service = Commonjs.jsonToString(service)
	var params = Commonjs.getParams(fn,service);//获取参数
	Commonjs.ajaxTrue(weburl,params,uptdnsSuccess);
}

function uptdnsSuccess(data){
	if(!isNotNull(data.data)) {
		Commonjs.alert("修改成功");  
	}
	var datas = data.data;
	
	if (datas.code == "-3"){
		//继续处理
		setTimeout("qryUptDnsStatus('"+datas.taskNo+"');", 5000);
	} else if(datas.code == "-1"){
		Commonjs.alert("修改失败"); 
	} else if(datas.code == "0"){
		Commonjs.alert("修改成功"); 
	}
}

function qryUptDnsStatus(taskNo){
	var service = {};
	service.taskNo = taskNo;
	service.domainName = domainName;
	service.dns1 = dns1;
	service.dns2 = dns2;
	service.flag = "1";// 是否查询接口
	var fn="qryUptDnsStatus";
	service = Commonjs.jsonToString(service)
	var params = Commonjs.getParams(fn,service);//获取参数
	Commonjs.ajaxTrue(weburl,params,uptdnsSuccess);
}

//返回
function resReturn(){
	window.location.href= './domain.html';
}
