var notInHostType = 'vhost';
var notInHostTypeArr = notInHostType ? notInHostType.split(",") : [];

var productCode;
$(function(){
	productCode = request("productCode");
	queryHostType();
	queryOrderForm();
	getCloudProduct();
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
                if ($.inArray(item.value, notInHostTypeArr) < 0) {
                    html += '<option value="' + item.value + '">' + item.description + '</option>';
                }
			});
		}
		$('#hosttype').html(html);
	}
}

//获取申请表单
function queryOrderForm(){
	var service = {};
	service.paramEName = "orderForm";
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
		$('#orderForm').html(html);
	}
}

//获取云主机产品信息
function getCloudProduct(){
	var service = {};
	service.productCode = productCode;
	var fn="getCloudProduct";
	service = Commonjs.jsonToString(service);
	var params = Commonjs.getParams(fn,service);//获取参数
	Commonjs.ajaxTrue(weburl,params,getCloudProductSuccess);
}

function getCloudProductSuccess(data){
	if(data.data == null){
		return false;
	}
	var obj=data.data.productView;
	$("#hidProductClass").val(obj.productClass);
	$("#productClassName").html(obj.productClassName);
	$("#hidProductCode").val(obj.productCode);
	$("#productCode").html(obj.productCode);
	$("#productName").val(obj.productName);
	$("#productDetail").val(obj.productDetail);
	$("#remark").val(obj.remark);
	//设置选中
	$("#hosttype").find("option[value='"+obj.regType+"']").attr("selected",true);
	$("#orderForm").find("option[value='"+obj.orderForm+"']").attr("selected",true);
	$("#status").find("option[value='"+obj.status+"']").attr("selected",true);
	if (typeof obj.productParam == "string") {
		obj.productParam = JSON.parse(obj.productParam);
	}
	if(isNotNull(obj.productParam)){
		var param=obj.productParam;
		$("#maxBandwidth").val(param.maxBandwidth);
		$("#sysDiskMaxSize").val(param.sysDiskMaxSize);
		$("#windowsMinSize").val(param.windowsMinSize);
		$("#otherMinSize").val(param.otherMinSize);
		$("#diskNum").val(param.diskNum);
		$("#snapshotNum").val(param.snapshotNum);
		$("#buyMaxNum").val(param.buyMaxNum);
		$("#resetLimit").val(param.resetLimit);
		$("#secGroupNum").val(param.secGroupNum);
		$("#ingressNum").val(param.ingressNum);
		$("#egressNum").val(param.egressNum);
		$('#allowVnc').val(param.allowVnc);
		$('#shareIp').val(param.shareIp);
		$('#portMapTcp').val(param.portMapTcp);
        $('#portMapUdp').val(param.portMapUdp);
		$('#maxBindDomainNum').val(param.maxBindDomainNum);
		$('#maxBindPortNum').val(param.maxBindPortNum);
	}
	productPromotion(data.data);
}

//产品促销
function productPromotion(data){
	var priceItem=data.promotionList;
	if(priceItem!="" || priceItem.length>0){
		BaseForeach(priceItem,function(i,item){
			var type='';
			if(item.chargeId==1)
				type="buy";
			else if(item.chargeId==2)
				type="renew";

			$("#chk_"+type+'_'+item.applyType+"_"+item.applyTime).attr("checked","checked");
			$("#st_"+type+'_'+item.applyType+"_"+item.applyTime).val(item.saleType);
			$("#txt_"+type+'_'+item.applyType+"_"+item.applyTime).val(item.saleValue);
		})
	}
}

//保存产品数据
function saveProductData(){
	//产品参数
	var param={};
	param.maxBandwidth=$("#maxBandwidth").val();
	param.sysDiskMaxSize=$("#sysDiskMaxSize").val();
	param.windowsMinSize=$("#windowsMinSize").val();
	param.otherMinSize=$("#otherMinSize").val();
	param.diskNum=$("#diskNum").val();
	param.snapshotNum=$("#snapshotNum").val();
	param.buyMaxNum=$("#buyMaxNum").val();
	param.resetLimit=$("#resetLimit").val();
	param.secGroupNum=$("#secGroupNum").val();
	param.ingressNum=$("#ingressNum").val();
	param.egressNum=$("#egressNum").val();
	param.allowVnc=$('#allowVnc').val();
	param.shareIp=$('#shareIp').val();
	param.maxBindDomainNum=$('#maxBindDomainNum').val();
	param.maxBindPortNum=$('#maxBindPortNum').val();
	param.portMapTcp=$('#portMapTcp').val();
	param.portMapUdp=$('#portMapUdp').val();
	//产品信息
	var product = {};
	product.productClass=$("#hidProductClass").val();
	product.productCode = $("#hidProductCode").val();
	product.productName = $("#productName").val();
	product.hostType=$("#hosttype").val();
	product.orderForm=$("#orderForm").val();
	product.productDetail=$("#productDetail").val();
	product.productParam=Commonjs.jsonToString(param);
	product.status=$("#status").val();
	product.remark=$("#remark").val();
	var productStr = Commonjs.jsonToString(product);
	//价格优惠
	var priceItemStr='';
	$("input[name=buyTime]:checked").each(function(){
		var priceItem={};
		priceItem.productCode=$("#hidProductCode").val();
		priceItem.chargeId=1;
		priceItem.applyTime=$(this).val();
		priceItem.applyType=$(this).attr("time");
		priceItem.saleType=$("#st_buy_"+$(this).attr("time")+"_"+$(this).val()).val();
		priceItem.saleValue=$("#txt_buy_"+$(this).attr("time")+"_"+$(this).val()).val();
		priceItemStr+=Commonjs.jsonToString(priceItem)+',';
	});

	$("input[name=renewTime]:checked").each(function(){
		var priceItem={};
		priceItem.productCode=$("#hidProductCode").val();
		priceItem.chargeId=2;
		priceItem.applyTime=$(this).val();
		priceItem.applyType=$(this).attr("time");
		priceItem.saleType=$("#st_renew_"+$(this).attr("time")+"_"+$(this).val()).val();
		priceItem.saleValue=$("#txt_renew_"+$(this).attr("time")+"_"+$(this).val()).val();
		priceItemStr+=Commonjs.jsonToString(priceItem)+',';
	});
	priceItemStr=priceItemStr.substring(0, priceItemStr.length-1);

	var fn="saveCloudProductSet";
	var jsonStr='{"product":['+productStr+'],"timeItem":['+priceItemStr+']}'
	var params = Commonjs.getParams(fn,jsonStr);
	parent.Commonjs.ajaxTrue(weburl,params,saveProductSuccess,false);
}

function saveProductSuccess(data){
	topSuccess(window, data.msg);
	$('body').scrollTop(0);
	getCloudProduct();
}
