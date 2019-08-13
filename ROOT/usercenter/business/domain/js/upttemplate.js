//域名模板
var id=null;
id=request("id");

$(function(){	
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
	queryTemplate();
})

//查看模板
function queryTemplate(){
	var service = {};
	service.id=id;
	service = Commonjs.jsonToString(service)
	var fn="getTemplateInfo";
	var params = Commonjs.getParams(fn,service);//获取参数
	Commonjs.ajaxTrue(weburl,params,queryTemplateSuccess);		
}

function queryTemplateSuccess(data){
	if(!isNotNull(data.data))
		return false;
	var template = data.data;
	$("#templateName").val(template.templateName);
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
	if(template.userType =="1"){
		$("#radio1").prop("checked",'checked');
		checkI();
	}else{
		 $("#radio2").prop("checked",'checked');
		 checkO();
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

//修改数据模板
function uptTemplate(){
	var service = {};
	service.id=id;
	service.userNameCn=$("#userNameCn").val();
	service.linkManLnCn=$("#linkManLnCn").val();
	service.linkManFnCn=$("#linkManFnCn").val();
	service.postcode=$("#postcode").val();
	service.email=$("#email").val();
	service.telArea=$("#telArea").val();
	service.telephone=$("#telephone").val();
	service.telNumber=$("#telNumber").val();
	service.faxArea=$("#faxArea").val();
	service.fax=$("#fax").val();
	service.faxNumber=$("#faxNumber").val();
	service.addrCn=$("#addrCn").val();
	service.userNameEn=$("#userNameEn").val();
	service.linkManLnEn=$("#linkManLnEn").val();
	service.linkManFnEn=$("#linkManFnEn").val();
	service.addrEn=$("#addrEn").val();
	service.userType=$("input[name='userType']:checked").val();
	service.countryCn=$("#countryCn").val();
	service.provinceCn=$("#cho_Province").val();
	service.cityCn=$("#cho_City").val();
	service.countryEn=$("#countryEn").val();
	service.provinceEn=$("#cho_ProvinceEN").val();
	service.cityEn=$("#cho_CityEN").val();
	if(service.userType == "I"){
        service.userNameCn = service.linkManLnCn + service.linkManFnCn;
        service.userNameEn = service.linkManLnEn + service.linkManFnEn;
	}

	if(Commonjs.isEmpty(service.userNameCn)){
		$.tooltip('域名所有者不能为空',2000,false);
		$("#userNameCn").focus();
		return false;
	}
	if(Commonjs.isEmpty(service.linkManLnCn + service.linkManFnCn)){
		$.tooltip('域名管理者不能为空',2000,false);
		$("#linkManLnCn").focus();
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
	if(!(CndnsValidate.checkMobile(service.telephone) || CndnsValidate.checkTel1(service.telArea+service.telephone))){
		$.tooltip('固话/手机格式不对',2000,false);
		$("#telephone").focus();
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
	if(!CndnsValidate.checkEnglishName(service.linkManLnEn+service.linkManFnEn)){
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
	//表单验证结束
	var fn="uptTemplate";
	service = Commonjs.jsonToString(service)
	var params = Commonjs.getParams(fn,service);//获取参数
	Commonjs.ajaxTrue(weburl,params,uptTemplateSuccess,false);
}

function uptTemplateSuccess(data){
	$.tooltip(data.msg,2000,true);
}


function  checkI() {
    $("#userNameTrCn").css("display", "none");
    $("#userNameTrEn").css("display", "none");
    $("#linkManTdCn").text("域名所有者：");
    $("#linkManTdEn").text("域名所有者：");
}

function checkO() {
    $("#userNameTrCn").css("display", "");
    $("#userNameTrEn").css("display", "");
    $("#linkManTdCn").text("域名联系人：");
    $("#linkManTdEn").text("域名联系人：");
}