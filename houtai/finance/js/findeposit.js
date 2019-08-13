$(function(){
	querybankCode();
	queryfinanceItem();
})

//添加
function addUserAccountDetail(){
	var u_itemId = $('#itemId');
	var u_userName = $('#userName');
	var u_amount = $('#amount');
	var u_snId = $('#snId');
	var u_bankCode = $('#bankCode');
	var u_billno = $('#billno');
	var u_remark = $('#remark');
	if(Commonjs.isEmpty(u_userName.val())){
		$.tooltip('用戶名不能位空',2000,false); 
		u_userName.focus();
		return false;
	}
	if(Commonjs.isEmpty(u_amount.val())){
		$.tooltip('金額不能为空',2000,false); 
		u_amount.focus();
		return false;
	}
	if(!(u_amount.val()>0)){
		$.tooltip('金額不能小于0',2000,false); 
		u_amount.focus();
		return false;
	}
	if(Commonjs.isEmpty(u_bankCode.val())){
		$.tooltip('请选择付款方式',2000,false); 
		u_bankCode.focus();
		return false;
	}
	var service = {};
	service.itemId = u_itemId.val();
	service.itemName=$("#itemId").find("option:selected").text();
	service.userName = u_userName.val();
	service.amount = u_amount.val();
	service.snId = u_snId.val();
	service.bankCode = u_bankCode.val();
	service.billno = u_billno.val();
	service.remark = u_remark.val();
	var fn = "addUserAccountDetail";	
	service = Commonjs.jsonToString(service);
	var params = Commonjs.getParams(fn, service);//获取参数
	Commonjs.ajaxTrue(weburl,params,addDetailSuccess,false);
}

function addDetailSuccess(data){
	$('#financefrom')[0].reset();
	$.tooltip(data.msg, 2000, true);
}

function querybankCode(){
	var service = {};
	service.paramEName = "payType";
	var fn="getListParamItemByEName";
	service = Commonjs.jsonToString(service);
	var params = Commonjs.getParams(fn,service);//获取参数
	var data=Commonjs.ajax(sysurl,params,false);
	if(data.result == "success"){
		$("#bankCode").empty();
		var bankCode='<option value="">请选择付款方式</option>';
		if (data.data.length>0){
			BaseForeach(data.data,function(i,item){
				bankCode+='<option value="'+item.value+'">'+item.description+'</option>';
			});
		}
		$('#bankCode').append(bankCode);
	}
}

function queryfinanceItem(){
	var service = {};
	service.paramEName = "financeItem";
	var fn="getListParamItemByEName";
	service = Commonjs.jsonToString(service);
	var params = Commonjs.getParams(fn,service);//获取参数
	var data=Commonjs.ajax(sysurl,params,false);
	if(data.result == "success"){
		$("#itemId").empty();
		var itemId='';
		if (data.data.length>0){
			BaseForeach(data.data,function(i,item){
				itemId+='<option value="'+item.value+'">'+item.description+'</option>';
			});
		}
		$('#itemId').append(itemId);
	}
}