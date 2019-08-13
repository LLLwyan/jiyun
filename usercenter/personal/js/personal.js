$(function (){
	getAccountDetail();
});

function getAccountDetail(){
	var service = {};
	var fn="getAccountDetail";
	service = Commonjs.jsonToString(service)
	var params = Commonjs.getParams(fn,service);//获取参数
	Commonjs.ajaxTrue(weburl,params,getAccountDetailSuccess);
}

function getAccountDetailSuccess(data){
	if(data.data==null)
		return false;

	$('#uid').html(data.data.userName);
	$('#u_email').val(data.data.email);
	$('#u_fullName').val(data.data.fullName);
	$('#u_address').val(data.data.address);
	$('#u_fax').val(data.data.fax);
	$('#u_QQ').val(data.data.QQ);
	$('#u_tel').val(data.data.tel);
	$('#u_mobile').val(data.data.mobile);
	$('#u_certCode').val(cloudEncrypt.decodeSession(data.data.certCode));
	$('#showCertCode').find('span').html(ProtectionStartUtils.idCard(cloudEncrypt.decodeSession(data.data.certCode)));
	$('#u_certType').val(data.data.certType);
	$('#u_industry').val(data.data.industry);
	$('#u_mainBusiness').val(data.data.mainBusiness);
	$('#u_provinceCode').val(data.data.provinceCode);
	$("#u_provinceCode").trigger("change");
	$('#u_cityCode').val(data.data.cityCode);
	$('#u_companyName').val(data.data.companyName);
	if(data.data.userType ==0){
		 $("#radio1").prop("checked",'checked');
	}else{
		 $("#radio2").prop("checked",'checked');
	}
	$('#showCertCode').find('a').on('click', function () {
        $('#showCertCode').css('display', 'none');
        $('#u_certCode').css('display', '');
    });
}

function u_update(){
	var qq=$('#u_QQ');
	var address=$('#u_address');
	var certCode=$('#u_certCode');
	var certType=$('#u_certType');
	var cityCode=$('#u_cityCode');
	var provinceCode=$('#u_provinceCode');
	var fax=$('#u_fax');
	var fullName=$('#u_fullName');
	var industry=$('#u_industry');
	var mainBusiness=$('#u_mainBusiness');
	var mobile=$('#u_mobile');
	var tel=$('#u_tel');
	var email=$("#u_email");
	var userType=$("input[name='u_userType']:checked");
	var companyName=$('#u_companyName').val();

	if(!CndnsValidate.checkChineseInput(fullName.val())){
		Commonjs.alert("真实姓名必须使用中文2-8位");
		fullName.focus();
		return false;
	}
	if(Commonjs.isEmpty(certType.val())){
		Commonjs.alert("证件类型不能为空");
		certType.focus();
		return false;
	}
	if(certType.val()==1){
		if(!CndnsValidate.checkIDCard(certCode.val())){
			Commonjs.alert("身份证格式不对");
			certCode.focus();
			return false;
		}
	}
	if(Commonjs.isEmpty(industry.val())){
		Commonjs.alert("所属行业不能为空");
		industry.focus();
		return false;
	}
	if(!CndnsValidate.checkIsqq(qq.val())){
		Commonjs.alert("QQ格式不对");
		qq.focus();
		return false;
	}
	if(!Commonjs.isEmpty(tel.val())){
		if(!CndnsValidate.checkTel1(tel.val())){
			Commonjs.alert("电话格式不对");
			tel.focus();
			return false;
		}
	}
	if(!Commonjs.isEmpty(fax.val())){
		if(!CndnsValidate.checkTel1(fax.val())){
			Commonjs.alert("传真格式不对");
			fax.focus();
			return false;
		}
	}
	if(Commonjs.isEmpty(provinceCode.val())){
		Commonjs.alert("省份不能为空");
		provinceCode.focus();
		return false;
	}
	if(Commonjs.isEmpty(cityCode.val())){
		Commonjs.alert("城市不能为空");
		cityCode.focus();
		return false;
	}
	if(Commonjs.isEmpty(address.val())){
		Commonjs.alert("地址不能为空");
		address.focus();
		return false;
	}
	var service = {};
	service.QQ=qq.val();
	service.address=address.val();
	service.certCode=cloudEncrypt.encodeSession(certCode.val());
	service.certType=certType.val();
	service.cityCode=cityCode.val();
	service.provinceCode=provinceCode.val();
	service.fax=fax.val();
	service.fullName=fullName.val();
	service.industry=industry.val();
	service.mainBusiness=mainBusiness.val();
	service.mobile=mobile.val();
	service.tel=tel.val();
	service.email = email.val();
	service.userType=userType.val();
	service.companyName=companyName;
	service = Commonjs.jsonToString(service)
	var fn='updateUserDoc';
	var params = Commonjs.getParams(fn,service);//获取参数
	Commonjs.ajaxTrue(weburl,params,updateSuccess,false);
}

function updateSuccess(data){
	Commonjs.alert("更新成功");
	getAccountDetail();
}
