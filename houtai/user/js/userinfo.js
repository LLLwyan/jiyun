var uid=request("id");
$(function(){
	queruserlive();
	querIdtype();
	detail();
})

//显示会员详情
function detail(){
	var service = {};
	service.rid = uid;
	var fn="getUserDetail";
	service = Commonjs.jsonToString(service)
	var params = Commonjs.getParams(fn,service);//获取参数
	var data=Commonjs.ajax(weburl,params,false);
	Commonjs.ajaxTrue(weburl,params,detailSuccess);
}

function detailSuccess(data){
	if(data.data==null){
		return false;
	}
	$('#uname').html(data.data.userName);
	$('#u_email').val(data.data.email);
	$('#u_fullName').val(data.data.fullName);
	$('#u_address').val(data.data.address);
	$('#u_fax').val(data.data.fax);
	$('#u_QQ').val(data.data.QQ);
	$('#u_tel').val(data.data.tel);
	$('#u_mobile').val(cloudEncrypt.decodeSession(data.data.mobile));
	$('#mobileStar').find('span').html(ProtectionStartUtils.mobile(cloudEncrypt.decodeSession(data.data.mobile)));
    $('#mobileStar').find('a').on('click', function () {
        $('#mobileStar').css('display', 'none');
        $('#mobileNormal').css('display', '');
    });
	$('#u_certCode').val(cloudEncrypt.decodeSession(data.data.certCode));
	$('#certCodeStar').find('span').html(ProtectionStartUtils.mobile(cloudEncrypt.decodeSession(data.data.certCode)));
    $('#certCodeStar').find('a').on('click', function () {
		$('#certCodeStar').css('display', 'none');
		$('#certCodeNormal').css('display', '');
    });
	$('#u_certType').val(data.data.certType);
	$('#u_industry').val(data.data.industry);
	$('#u_userlevel').val(data.data.levelCode);
	$('#u_mainBusiness').val(data.data.mainBusiness);
	$('#u_provinceCode').val(data.data.provinceCode);
	$("#u_provinceCode").trigger("change");
	$('#u_cityCode').val(data.data.cityCode);
	$('#u_companyName').val(data.data.companyName);
	if(data.data.userType ==1){
   		 $("#radio2").prop("checked",'checked');
	}else{
		 $("#radio1").prop("checked",'checked');
	}
}

function uptuserinfo(){
	var uname = $('#uname').html();
	var email = $('#u_email').val();
	var fullName = $('#u_fullName').val();
	var address = $('#u_address').val();
	var fax = $('#u_fax').val();
	var QQ = $('#u_QQ').val();
	var tel = $('#u_tel').val();
	var mobile = $('#u_mobile').val();
	var certCode = $('#u_certCode').val();
	var certType = $('#u_certType').val();
	var industry = $('#u_industry').val();
	var userlevel = $('#u_userlevel').val();
	var mainBusiness = $('#u_mainBusiness').val();
	var provinceCode = $('#u_provinceCode').val();
	var cityCode = $('#u_cityCode').val();
	var userType = $('input[name="u_userType"]:checked').val();
	var companyName=$('#u_companyName').val();
	var service = {};
	service.uname = uname;
	service.email = email;
	service.fullName = fullName;
	service.address = address;
	service.fax = fax;
	service.QQ = QQ;
	service.tel = tel;
	service.certCode = certCode;
	service.certType = certType;
	service.industry = industry;
	service.userlevel = userlevel;
	service.mainBusiness = mainBusiness;
	service.cityCode = cityCode;
	service.provinceCode = provinceCode;
	service.userType = userType;
	service.mobile = mobile;
	service.companyName=companyName;
	var fn="updateUserInfo";
	service = Commonjs.jsonToString(service)
	var params = Commonjs.getParams(fn,service);//获取参数
	Commonjs.ajaxTrue(weburl,params,uptuserinfoSuccess,false);
}

function uptuserinfoSuccess(data){
	$.tooltip('修改成功',2000,true);
	detail();
}

//修改会员等级
function uptUserLevel(){
	var service = {};
	service.userName= $('#uname').html();
	service.levelCode = $('#u_userlevel').val();
	var fn="uptAccountLevel";
	service = Commonjs.jsonToString(service)
	var params = Commonjs.getParams(fn,service);//获取参数
	Commonjs.ajaxTrue(weburl,params,uptLevelSuccess);
}

function uptLevelSuccess(data){
	$.tooltip('修改成功',2000,true);
	detail();
}

//获取证件类型
function querIdtype(){
	var service = {};
	service.paramEName = "idType";
	var fn="getListParamItemByEName";
	service = Commonjs.jsonToString(service);
	var params = Commonjs.getParams(fn,service);//获取参数
	var data=Commonjs.ajax(sysurl,params,false);
	if(data.result == "success"){
		$("#u_certType").empty();
		var parentId='';
		if (data.data.length>0){
			BaseForeach(data.data,function(i,item){
				parentId+='<option value="'+item.value+'">'+item.description+'</option>';
			});
		}
		$('#u_certType').append(parentId);
	}
};

//获取会员等级
function queruserlive(){
	var service = {};
	var userlevel=null;
	service.page = 0;
	service.pageSize = 20;
	var fn="queryVipgrade";
	service = Commonjs.jsonToString(service)
	var params = Commonjs.getParams(fn,service);//获取参数
	var data=Commonjs.ajax(weburl,params,false);
	if(data.result == "success"){
		$("#u_userlevel").empty();
		var parentId='';
		if (data.data.length>0){
			BaseForeach(data.data,function(i,item){
				parentId+='<option value="'+item.levelCode+'">'+item.levelName+'</option>';
			});
		}
		$('#u_userlevel').append(parentId);
	}
};

function back(){
	window.history.back(-1);
}
