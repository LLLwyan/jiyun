var productCode;
$(function(){	
	productCode = request("productCode");
	queryHostType();
	getCloudDiskProduct();
});

//获取云主机上级注册商
function queryHostType(){
	var service = {};
	service.paramEName = "hostType";
	var fn="getListParamItemByEName";
	service = Commonjs.jsonToString(service);
	var params = Commonjs.getParams(fn,service);//获取参数
	var data=Commonjs.ajax(sysurl,params,false);
	if(data.result == "success"){
		var html='';
		if (data.data.length>0){
			BaseForeach(data.data,function(i,item){
				html+='<option value="'+item.value+'">'+item.description+'</option>';
			});
		}
		$('#hosttype').html(html);	
	}
}

//获取云硬盘产品信息
function getCloudDiskProduct(){
	var service = {};
	service.productCode = productCode; 
	var fn="getCloudDiskProduct";
	service = Commonjs.jsonToString(service);
	var params = Commonjs.getParams(fn,service);//获取参数
	Commonjs.ajaxTrue(weburl,params,getSuccess);
}

function getSuccess(data){
	if(data.data == null){
		return false;
	}
	var obj=data.data;
	$("#hidProductClass").val(obj.productClass);
	$("#productClassName").html(obj.productClassName);
	$("#hidProductCode").val(obj.productCode);
	$("#productCode").html(obj.productCode);
	$("#productName").val(obj.productName);
	$("#productDetail").val(obj.productDetail);
	$("#remark").val(obj.remark);
	//设置选中
	$("#hosttype").find("option[value='"+obj.regType+"']").attr("selected",true);
	$("#status").find("option[value='"+obj.status+"']").attr("selected",true);
}

//保存产品数据
function saveProductData(){
	//产品信息
	var product = {};
	product.productClass=$("#hidProductClass").val();
	product.productCode = $("#hidProductCode").val();
	product.productName = $("#productName").val();
	product.hostType=$("#hosttype").val();
	product.productDetail=$("#productDetail").val();
	product.status=$("#status").val(); 
	product.remark=$("#remark").val(); 
	var productStr = Commonjs.jsonToString(product);
	var fn="saveCloudDiskProductSet";
	var jsonStr='{"product":['+productStr+']}'
	var params = Commonjs.getParams(fn,jsonStr);
	Commonjs.ajaxTrue(weburl,params,saveSuccess,false);
}

function saveSuccess(data){
	$.tooltip(data.msg,2000,true);
	$('html,body').scrollTop(0);
	getCloudDiskProduct();
}