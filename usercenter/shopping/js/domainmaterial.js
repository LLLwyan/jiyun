var shopp_productlist="";
var shopp_orderIds="";
var obj="";

$(function(){
	shopp_productlist = getCookie("shopp_productlist")
	shopp_orderIds = getCookie("shopp_orderIds")
	if(shopp_orderIds == null || shopp_orderIds == undefined || shopp_orderIds.length <= 0){
		Commonjs.alerturl("参数错误.点击确定返回",'./shoppinglist.html')
	}
	if(shopp_productlist == null || shopp_productlist == undefined || shopp_productlist.length <= 0){
		Commonjs.alerturl("参数错误.点击确定返回",'./shoppinglist.html')
	}
	obj =jQuery.parseJSON(shopp_productlist);
	
	$("#userNameCn").on("keyup keydown change blur",function (){
		$("#userNameEn").val($.trim($(this).toPinyin()));
	});
	$("#linkManLnCn").on("keyup keydown change blur",function (){
		$("#linkManLnEn").val($.trim($(this).toPinyin()));
	});
	
	$("#linkManFnCn").on("keyup keydown change blur",function (){
		$("#linkManFnEn").val($.trim($(this).toPinyin()));
	});
	//地区
	$("#countryCn").on("keyup keydown change blur",function (){
		$("#countryEn").html("");
		$("#countryEn").append("<option value='"+$.trim($(this).toPinyin())+"'>"+$.trim($(this).toPinyin())+"</option>");
	});
	$("#countryEn").append("<option value='"+$.trim($("#countryCn").toPinyin())+"'>"+$.trim($("#countryCn").toPinyin())+"</option>");

	//省份
	$("#cho_Province").on("keyup keydown change blur",function (){
		$("#cho_ProvinceEN").html("");
		$("#cho_ProvinceEN").append("<option value='"+$.trim($(this).toPinyin())+"'>"+$.trim($(this).toPinyin())+"</option>");
		$("#cho_CityEN").html("");
		$("#cho_CityEN").append("<option value='"+$.trim($("#cho_City").toPinyin())+"'>"+$.trim($("#cho_City").toPinyin())+"</option>");
	});
	$("#cho_ProvinceEN").append("<option value='"+$.trim($("#cho_Province").toPinyin())+"'>"+$.trim($("#cho_Province").toPinyin())+"</option>");
	//城市
	$("#cho_City").on("keyup keydown change blur",function (){
		$("#cho_CityEN").html("");
		$("#cho_CityEN").append("<option value='"+$.trim($(this).toPinyin())+"'>"+$.trim($(this).toPinyin())+"</option>");
	});
	$("#cho_CityEN").append("<option value='"+$.trim($("#cho_City").toPinyin())+"'>"+$.trim($("#cho_City").toPinyin())+"</option>");
	//通讯地址
	$("#addrCn").on("keyup keydown change blur",function (){
		$("#addrEn").val($.trim($(this).toPinyin()));
	});
	getDicParamApi();
	getTemplateListPage();
})

//查询模版信息
function getTemplateListPage(){
	$('#templateId').html('');
	var service = {};
	service.page = 1;
	service.pageSize = 100;
	var fn="getTemplateListPage";
	service = Commonjs.jsonToString(service)
	var params = Commonjs.getParams(fn,service);//获取参数
	var data=Commonjs.ajax(weburl,params,false);
	if(data.result="success"){
		var templateName='<option value="">请选择模板</option>';
		if(data.rows!=0){
			BaseForeach(data.data,function(i,item){
				templateName+='<option value="'+item.id+'">'+item.templateName+'</option>';
			});
		}
		$('#templateId').append(templateName);
	}	
}

//查询具体模板信息
function selTemplate(obj){
	if($(obj).val()==""){
		return;
	}
	var service = {};
	service.id=$(obj).val();
	service = Commonjs.jsonToString(service)
	var fn="getTemplateInfo";
	var params = Commonjs.getParams(fn,service);//获取参数
	Commonjs.ajaxTrue(weburl,params,selTemplateSuccess);
}

function selTemplateSuccess(data){
	if(!isNotNull(data.data))
		return false;

	var template = data.data;
	$("#templateId").val(template.id);
	$("#userNameCn").val(template.userNameCn);
	$("#linkManLnCn").val(template.linkManLnCn);
	$("#linkManFnCn").val(template.linkManFnCn);
	$("#postcode").val(template.postcode);
	$("#email").val(template.email);
		
	$("#telArea").val(template.telArea);
	$("#telephone").val(template.telephone);
	$("#telNumber").val(template.telNumber);

	$("#faxArea").val(template.faxArea);
	$("#fax").val(template.fax);
	$("#faxNumber").val(template.faxNumber);
	
	$("#addrCn").val(template.addrCn);
	$("#userNameEn").val(template.userNameEn);
	$("#linkManLnEn").val(template.linkManLnEn);
	$("#linkManFnEn").val(template.linkManFnEn);
	$("#addrEn").val(template.addrEn);
	$("#radio1").removeAttr("checked");
	$("#radio2").removeAttr("checked");
	if(template.userType == "1"){
	    $("#u_radio").prop("checked",'checked');
	}else{
	     $("#c_radio").prop("checked",'checked');
	}
	$("#countryCn").val(template.countryCn);
	$("#cho_Province").val(template.provinceCn);
	$("#cho_Province").trigger("change");
	$("#countryCn").trigger("change");
	$("#cho_City").val(template.cityCn);
	$("#cho_City").trigger("change");
	$("#countryEn").val(template.countryEn);
	$("#cho_ProvinceEN").val(template.provinceEn);
	$("#cho_CityEN").val(template.cityEn);
}

//添加域名信息
function subForm(){
	var service = {};
	service.userNameCn = $("#userNameCn").val();
	service.postcode = $("#postcode").val();
	service.email = $("#email").val();
	service.addrCn = $("#addrCn").val();
	service.userNameEn = $("#userNameEn").val();
	service.addrEn = $("#addrEn").val();
	service.userType = $("input[name='userType']:checked").val();
	service.countryCn = $("#countryCn").val();
	service.provinceCn = $("#cho_Province").val();
	service.cityCn = $("#cho_City").val();
	service.countryEn = $("#countryEn").val();
	service.provinceEn = $("#cho_ProvinceEN").val();
	service.cityEn = $("#cho_CityEN").val();
	service.dns1 = $("#DNS1").val();
	service.dns2 = $("#DNS2").val();
	
	service.linkManLnCn = $.trim($("#linkManLnCn").val());
	service.linkManFnCn = $.trim($("#linkManFnCn").val());
	service.linkManLnEn = $.trim($("#linkManLnEn").val());
	service.linkManFnEn = $.trim($("#linkManFnEn").val());	
	
	var telephone = $("#telephone").val();
	var fax = $("#fax").val();
	var telArea = $("#telArea").val();
	var faxArea = $("#faxArea").val();
	
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
	if(!CndnsValidate.checkEnglishName(service.linkManLnEn + " " + service.linkManLnEn)){
		$.tooltip('英文管理人格式不对',2000,false);
		$("#linkManEn").focus();
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
	if(Commonjs.isEmpty(service.dns1)){
		$.tooltip('dns1不能为空',2000,false);
		$("#DNS1").focus();
		return false;
	}
	if(Commonjs.isEmpty(service.dns2)){
		$.tooltip('dns2不能为空',2000,false);
		$("#DNS2").focus();
		return false;
	}
	//表单验证结束
	var func=0;
	BaseForeach(obj.productlist,function(i,item){
		service.domainName=item.productParam;
		service.managepass=_getRandomString(6)//获取密码
		var datalist={};
		var fn="upDomainUserCart";

		datalist.productParam=service;
		datalist.cartNo=item.cartNo;
		datalist = Commonjs.jsonToString(datalist);
		var params = Commonjs.getParams(fn,datalist);//获取参数
		var data=Commonjs.ajax(weburl,params,false);
		if(data.result=="success"){
			func++;
		}
	});
	if(func>0){
		var UserOrder = {};
		UserOrder.cartNos = shopp_orderIds;
		var fn="addUserOrder";
		UserOrder = Commonjs.jsonToString(UserOrder);
		var params = Commonjs.getParams(fn,UserOrder);//获取参数
		var result=Commonjs.ajax(weburl,params,false);
		if(result.result=="success"){
			clearCookie("orderIds");
			document.cookie="orderIds="+result.data.orderIds;
			window.location.href="settlement.html";
		}
	}
}

//获取系统dns
function getDicParamApi(){
	var service = {};
	var fn="getDicParamApi";
	service = Commonjs.jsonToString(service)
	var params = Commonjs.getParams(fn,service);//获取参数
	Commonjs.ajaxTrue(sysurl,params,getDicParamApiSuccess);
}

function getDicParamApiSuccess(data){
	if(!isNotNull(data.data))
		return false;

	if(data.data.length>0){
		BaseForeach(data.data,function(i,item){
			switch(item.paramName)
			{
				case "defaultDNS1":
				 $('#DNS1').val(cloudEncrypt.decodeSession(item.paramValue));
				  break;
				case "defaultDNS2":
				  $('#DNS2').val(cloudEncrypt.decodeSession(item.paramValue));
				  break;
			}
		});
	}
}
