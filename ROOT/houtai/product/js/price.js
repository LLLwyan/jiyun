var notInHostType = ServletUtils.get("noHostType");
var notInHostTypeArr = notInHostType ? notInHostType.split(",") : [];

$(function(){
	queryHostType();
    ipPrice();
});

//获取上级注册商
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
		$('#hosttypelist').html(html);
		queryRegionList();
	}
}

//获取地域
function queryRegionList(){
	var service = {};
	service.hostType = $("#hosttypelist").val();
	var fn="queryHostlist";
	service = Commonjs.jsonToString(service);
	var params = Commonjs.getParams(fn,service);

	$.ajax({
		datatype:"json",
        type:"POST",
        url: weburl,
        data:params,
		cache : false,
		success: function(data){
			var result=jQuery.parseJSON(data);
			if(result.result=="success"){
				var html='';
				if (result.data.length>0){
					BaseForeach(result.data,function(i,item){
						html+='<option value="'+item.regionId+'">'+item.regionName+'</option>';
					});
				}
				$('#specRegion').html(html);
				$('#diskRegion').html(html);
				$('#networkRegion').html(html);
				queryModelList();
				diskItemList();
				networkItemList();
			}
		}
	});
}

//获取机型
function queryModelList(){
	var service = {};
	service.regionId = $("#specRegion").val();
	var fn="getDicModelList";
	service = Commonjs.jsonToString(service);
	var params = Commonjs.getParams(fn,service);

	$.ajax({
		datatype:"json",
        type:"POST",
        url: weburl,
        data:params,
		cache : false,
		success: function(data){
			var result=jQuery.parseJSON(data);
			if(result.result=="success"){
				var html='';
				if (result.data.length>0){
					BaseForeach(result.data,function(i,item){
						html+='<option value="'+item.modelId+'">'+item.modelName+'</option>';;
					});
				}
				$('#modelList').html(html);
				specItemList();
			}
		}
	});
}

//实例计费项
function specItemList(){
	var service = {};
	service.hostType =$("#hosttypelist").val();
	service.modelId=$("#modelList").val();
	var fn="getDicSpecList";
	service = Commonjs.jsonToString(service);
	var params = Commonjs.getParams(fn,service);

	$.ajax({
		datatype:"json",
        type:"POST",
        url: weburl,
        data:params,
		cache : false,
		success: function(data){
			var result=jQuery.parseJSON(data);
			if(result.result=="success"){
				var html='';
				if (result.data.length>0){
					html+='<table class="table table-bordered priceItem" style="margin-bottom:0px;">';
					html+='<tr>';
					//html+='<td width="15%">机型</td>';
					html+='<td width="10%">CPU</td>';
					html+='<td width="10%">内存</td>';
					html+='<td width="10%">计价单位</td>';
					html+='<td class="area">价格</td>';
					html+='</tr>';

					BaseForeach(result.data,function(i,item){
						//html+='<tr><td>'+$("#modelList").find("option:selected").text();+'</td>';
						html+='<tr><td>'+item.cpu+'核</td>';
						html+='<td>'+item.memory+'GB</td>';
						html+='<td>元/月</td>';
						var id="spec_"+$("#specRegion").val()+"_"+$("#modelList").val()+"_"+item.cpu+"_"+item.memory;
						html+='<td><input type="text" id="'+id+'" name="specPrice" cpu="'+item.cpu+'" memory="'+item.memory+'" class="manager-input m-input width200"></td></tr>';
					});
				}
				$('#specItemList').html(html);
				specItemPrice();
			}
		}
	});
}

//显示实例计费项价格
function specItemPrice(){
	var hostType=$("#hosttypelist").val();
	var regionId=$("#specRegion").val();
	var modelId=$("#modelList").val();

	var service = {};
	service.hostType=hostType;
	service.chargeItem="spec";
	service.regionId=regionId;
	service.modelId = modelId;
	var fn="queryDicPrice";
	service = Commonjs.jsonToString(service);
	var params = Commonjs.getParams(fn,service);

	$.ajax({
		datatype:"json",
        type:"POST",
        url: weburl,
        data:params,
		cache : false,
		success: function(data){
			var result=jQuery.parseJSON(data);
			if(result.result=="success"){
				if (result.data.length>0){
					BaseForeach(result.data,function(i,item){
						var param=item.parameter;
						if(param!=null && param!=""){
							$("#spec_"+param.regionId+"_"+param.modelId+"_"+param.cpu+"_"+param.memory).val(item.price);
						}
					});
				}
			}
		}
	});
}

//磁盘计费项
function diskItemList(){
	var service = {};
	service.hostType = $("#hosttypelist").val();
	var fn="queryDicDiskList";
	service = Commonjs.jsonToString(service);
	var params = Commonjs.getParams(fn,service);

	$.ajax({
		datatype:"json",
        type:"POST",
        url: weburl,
        data:params,
		cache : false,
		success: function(data){
			var result=jQuery.parseJSON(data);
			if(result.result=="success"){
				var html='';
				if (result.data.length>0){
					html='<table class="table table-bordered priceItem" style="margin-bottom:0px;">';
					html+='<tr><td width="10%">计费项</td>';
					html+='<td width="8%">类型</td>';
					html+='<td width="20%">规格</td>';
					html+='<td width="8%">计价单位</td>';
					html+='<td width="20%">价格</td></tr>';
					html+='<tr>';

					BaseForeach(result.data,function(i,item){
						html+='<tr><td>系统盘(起售价)</td>';
						html+='<td>'+item.typeName+'</td>';
						html+='<td>Windows系统：<input type="text" id="'+item.typeId+'_windows_size" class="manager-input m-input width50"/>GB，其它系统：<input type="text" id="'+item.typeId+'_other_size" class="manager-input m-input width50"/>GB</td>';
						html+='<td>元 /GB/月</td>';
						wId="disk_"+$("#diskRegion").val()+"_0_"+item.typeId;
						html+='<td><input type="text" id="'+wId+'" name="diskPrice" data="0" typeId="'+item.typeId+'" class="manager-input m-input width200"></td>';
						html+='</tr>';
					});

					BaseForeach(result.data,function(i,item){
						html+='<tr><td>系统盘</td>';
						html+='<td>'+item.typeName+'</td>';
						html+='<td>1GB</td>';
						html+='<td>元 /GB/月</td>';
						var id="disk_"+$("#diskRegion").val()+"_1_"+item.typeId;
						html+='<td><input type="text" id="'+id+'" name="diskPrice" data="1" typeId="'+item.typeId+'"  class="manager-input m-input width200"></td>';
						html+='</tr>';
					});

					BaseForeach(result.data,function(i,item){
						html+='<tr><td>数据盘</td>';
						html+='<td>'+item.typeName+'</td>';
						html+='<td>1GB</td>';
						html+='<td>元 /GB/月</td>';
						var id="disk_"+$("#diskRegion").val()+"_2_"+item.typeId;
						html+='<td><input type="text" id="'+id+'" name="diskPrice" data="2" typeId="'+item.typeId+'"  class="manager-input m-input width200"></td>';
						html+='</tr>';
					});
				}
				$("#diskItemList").html(html);
				diskItemPrice();
			}
		}
	});
}

//显示磁盘计费项价格
function diskItemPrice(){
	var hostType=$("#hosttypelist").val();
	var regionId=$("#diskRegion").val();

	var service = {};
	service.hostType=hostType;
	service.chargeItem="disk";
	service.regionId=regionId;
	var fn="queryDicPrice";
	service = Commonjs.jsonToString(service);
	var params = Commonjs.getParams(fn,service);

	$.ajax({
		datatype:"json",
        type:"POST",
        url: weburl,
        data:params,
		cache : false,
		success: function(data){
			var result=jQuery.parseJSON(data);
			if(result.result=="success"){
				if (result.data.length>0){
					BaseForeach(result.data,function(i,item){
						var param=item.parameter;
						if(param!=null && param!=""){
							$("#disk_"+param.regionId+"_"+param.diskAttribute+"_"+param.diskType).val(item.price);
							if(param.diskAttribute=="0"){
								$("#"+param.diskType+"_windows_size").val(param.windows);
								$("#"+param.diskType+"_other_size").val(param.other);
							}
						}
					});
				}
			}
		}
	});
}

//带宽计费项
function networkItemList(){
	var html="";
	var type=$("#hosttypelist").val();
	switch(type){
		case "osc":
		case "alc":
		case "hyperv":
			html=alcNetworkItemList();
			break;
	}
	$("#networkItemList").html(html);
	networkItemPrice();
}

//osc、alc带宽计费项
function alcNetworkItemList(){
	var regionId=$("#networkRegion").val();
	var html='<table class="table table-bordered priceItem" style="margin-bottom:0px;">';
	html+='<tr><td width="10%">规格</td>';
	html+='<td width="10%">计价单位</td>';
	html+='<td width="10%">价格</td></tr>';
	html+='<tr>';
	html+='<td>1Mbps</td><td>元/1Mbps/月</td><td><input type="text" name="bandwidthPrice" id="bandWidth_'+regionId+'_1" spec="1" class="manager-input m-input width200"></td></tr>';
	html+='<tr><td>2Mbps</td><td>元/2Mbps/月</td><td><input type="text" name="bandwidthPrice" id="bandWidth_'+regionId+'_2" spec="2" class="manager-input m-input width200"></td></tr>';
	html+='<tr><td>3Mbps</td><td>元/3Mbps/月</td><td><input type="text" name="bandwidthPrice" id="bandWidth_'+regionId+'_3" spec="3" class="manager-input m-input width200"></td></tr>';
	html+='<tr><td>4Mbps</td><td>元/4Mbps/月</td><td><input type="text" name="bandwidthPrice" id="bandWidth_'+regionId+'_4" spec="4" class="manager-input m-input width200"></td></tr>';
	html+='<tr><td>5Mbps</td><td>元/5Mbps/月</td><td><input type="text" name="bandwidthPrice" id="bandWidth_'+regionId+'_5" spec="5" class="manager-input m-input width200"></td></tr>';
	html+='<tr><td>6Mbps及以上，n 为带宽值。</td><td>元/Mbps/月</td><td>基数：<input type="text" name="bandwidthPrice" id="bandWidth_'+regionId+'_6" spec="6" class="manager-input m-input width200"></td></tr>';
	html+='</table>';
	return html;
}

//显示带宽计费项价格
function networkItemPrice(){
	var hostType=$("#hosttypelist").val();
	var regionId=$("#networkRegion").val();

	var service = {};
	service.hostType=hostType;
	service.chargeItem="bandwidth";
	service.regionId=regionId;
	var fn="queryDicPrice";
	service = Commonjs.jsonToString(service);
	var params = Commonjs.getParams(fn,service);

	$.ajax({
		datatype:"json",
        type:"POST",
        url: weburl,
        data:params,
		cache : false,
		success: function(data){
			var result=jQuery.parseJSON(data);
			if(result.result=="success"){
				if (result.data.length>0){
					BaseForeach(result.data,function(i,item){
						var param=item.parameter;
						if(param!=null && param!=""){
							$("#bandWidth_"+param.regionId+"_"+param.spec).val(item.price);
						}
					});
				}
			}
		}
	});
}

//保存实例价格
function saveSpecPrice(){
	var hostType=$("#hosttypelist").val();
	var regionId=$("#specRegion").val();
	var modelId=$("#modelList").val();

	var dataStr='';
	$("input[name=specPrice]").each(function(){
		var param='';
		param+='{"regionId":"'+regionId+'",';
		param+='"modelId":"'+modelId+'",';
		param+='"cpu":"'+$(this).attr("cpu")+'",';
		param+='"memory":"'+$(this).attr("memory")+'"}';

		var dataItem={};
		dataItem.hostType=hostType;
		dataItem.chargeItem='spec';
		dataItem.parameter=param;
		dataItem.price=$(this).val();
		dataStr+=Commonjs.jsonToString(dataItem)+',';
	});
	dataStr='['+dataStr.substring(0, dataStr.length-1)+']';
	savePrice(hostType,"spec",regionId,modelId,dataStr);
}

//保存磁盘价格
function saveDiskPrice(){
	var hostType=$("#hosttypelist").val();
	var regionId=$("#diskRegion").val();

	var dataStr='';
	$("input[name=diskPrice]").each(function(){
		var param='';
		if($(this).attr("data")=="0"){
			param+='{"regionId":"'+regionId+'",';
			param+='"diskAttribute":"'+$(this).attr("data")+'",';
			param+='"diskType":"'+$(this).attr("typeId")+'",';
			param+='"windows":"'+$("#"+$(this).attr("typeId")+"_windows_size").val()+'",';
			param+='"other":"'+$("#"+$(this).attr("typeId")+"_other_size").val()+'"}';
		}else{
			param+='{"regionId":"'+regionId+'",';
			param+='"diskAttribute":"'+$(this).attr("data")+'",';
			param+='"diskType":"'+$(this).attr("typeId")+'",';
			param+='"spec":"1"}';
		}

		var dataItem={};
		dataItem.hostType=hostType;
		dataItem.chargeItem='disk';
		dataItem.parameter=param;
		dataItem.price=$(this).val();
		dataStr+=Commonjs.jsonToString(dataItem)+',';
	});

	dataStr='['+dataStr.substring(0, dataStr.length-1)+']';
	savePrice(hostType,"disk",regionId,"",dataStr);
}

//保存带宽价格
function saveBandwidthPrice(){
	var hostType=$("#hosttypelist").val();
	var regionId=$("#networkRegion").val();

	var dataStr='';
	$("input[name=bandwidthPrice]").each(function(){
		var param='';
		param+='{"regionId":"'+regionId+'",';
		param+='"spec":"'+$(this).attr("spec")+'"}';

		var dataItem={};
		dataItem.hostType=hostType;
		dataItem.chargeItem='bandwidth';
		dataItem.parameter=param;
		dataItem.price=$(this).val();
		dataStr+=Commonjs.jsonToString(dataItem)+',';
	});
	dataStr='['+dataStr.substring(0, dataStr.length-1)+']';
	savePrice(hostType,"bandwidth",regionId,"",dataStr);
}

//保存价格
function savePrice(hostType,chargeItem,regionId,modelId,dataItem){
	var service = {};
	service.hostType=hostType;
	service.chargeItem=chargeItem;
	service.regionId=regionId;
	service.modelId = modelId;
	service.dataItem=dataItem;
	var fn="uptDicPrice";
	service = Commonjs.jsonToString(service);
	var params = Commonjs.getParams(fn,service);

	$.ajax({
		datatype:"json",
        type:"POST",
        url: weburl,
        data:params,
		cache : false,
		success: function(data){
			var result=jQuery.parseJSON(data);
			if(result.result=="success"){
				var result=jQuery.parseJSON(data);
				if(result.result == "success"){
					$.tooltip(result.msg,2000,true);
				}
			}
		}
	});
}

//显示IP价格
function ipPrice(){
    var hostType=$("#hosttypelist").val();
    var regionId=$("#networkRegion").val();

    var service = {};
    service.hostType=hostType;
    service.chargeItem="ip";
    service.regionId="all";
    var fn="queryDicPrice";
    service = Commonjs.jsonToString(service);
    var params = Commonjs.getParams(fn,service);

    $.ajax({
        datatype:"json",
        type:"POST",
        url: weburl,
        data:params,
        cache : false,
        success: function(data){
            var result=jQuery.parseJSON(data);
            if(result.result=="success"){
                if (result.data.length>0){
                    BaseForeach(result.data,function(i,item){
                        var param=item.parameter;
                        if(param!=null && param!=""){
                            $("#ip_"+param.regionId+"_"+param.spec).val(item.price);
                        }
                    });
                }
            }
        }
    });
}

//保存IP价格
function saveIpPrice() {
    var hostType=$("#hosttypelist").val();
    var regionId='all';

    var dataStr='';
    $("input[name=theIpPrice]").each(function(){
        var param='';
        param+='{"regionId":"'+regionId+'",';
        param+='"spec":"'+$(this).attr("spec")+'"}';

        var dataItem={};
        dataItem.hostType=hostType;
        dataItem.chargeItem='ip';
        dataItem.parameter=param;
        dataItem.price=$(this).val();
        dataStr+=Commonjs.jsonToString(dataItem)+',';
    });
    dataStr='['+dataStr.substring(0, dataStr.length-1)+']';
    savePrice(hostType,"ip",regionId,"",dataStr);
}
