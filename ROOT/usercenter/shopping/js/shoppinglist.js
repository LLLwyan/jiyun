var isDomain=false;
var isCloud=false;
var indexs=0;
$(function(){
	queryUserCartList();
})

//获取购物车列表
function queryUserCartList(){
	var fn="getUserCartList";
	var params = Commonjs.getParams(fn,"");
	Commonjs.ajaxTrue(weburl,params,querySuccess);
}

function querySuccess(result){
	var cartNos="";
	indexs=0;
	var count = 0;
	$("input[name='chkBox']:checked").each(function(){
		if($(this).attr("checked")=="checked"){
			cartNos += $(this).val()+",";
			indexs+=1;
			count+=1;
		}
	});
	if(cartNos != "") {
		cartNos=cartNos.substring(0, cartNos.length-1);
	}

	var html='';
	var domainname="";
	if(result.data.list!=null && result.data.list.length>0){
		var hasDomain = false;
		BaseForeach(result.data.list,function(i,item){
            isDomain = false;
            isCloud = false;
			html+='<tr>';
			if(item.productClass=="domain"){
				isDomain = true;
				domainname=item.productParam.domainName;
			} else {
                isCloud = true;
            }
			var isCheck = false
			if(cartNos != ""){
				if(cartNos.indexOf(item.cartNo) > -1){
					isCheck = true;
				}
			} else {
				if (count == 0){
					isCheck = true;
				}
			}
			if (isCheck){
				html+='<td><input type="checkbox" style="margin-top:5px;" class="'+item.productClass+'" name="chkBox" checked="checked" value="'+item.cartNo+'" index="'+item.productClass+'" domainname="'+domainname+'" carttype="'+item.cartType+'" onclick="checkSingle(this);"></td>';
			} else {
				html+='<td><input type="checkbox" style="margin-top:5px;" class="'+item.productClass+'" name="chkBox"  value="'+item.cartNo+'" index="'+item.productClass+'" domainname="'+domainname+'" carttype="'+item.cartType+'" onclick="checkSingle(this);"></td>';
			}
		    html+='<td>'+item.productClassName+'</td>';
		    html+='<td>'+item.productName+'</td>';
            html+='<td>'+getProductParam(item.productParam,item.productClass,item.cartType, item.regType)+'</td>';
		    if (isDomain == true && item.cartType == "add") {
		    	hasDomain = true;
                html+='<td class="domainUpper">'+getRegType(item.productClass,item.cartNo,item.cartType, item.regType)+'</td>';
			}else {
                html+='<td class="domainUpper"> - </td>';
			}
		    html+='<td>'+item.cartTypeName+'</td>';
		    html+='<td>'+getApplyTime(item.productClass,item.productCode,item.applyTime,item.priceType,item.cartNo,item.cartType, item.regType)+'</td>';
		    html+='<td><span>￥'+item.price+'</span></td>';
		    html+='<td>'+showFormat(item.totalPrice,item.price)+'</td>';
		    html+="<td><a href=\"javascript:void(0)\" onclick=\"delCart('"+item.cartNo+"')\">删除</a></td>";
		    html+='</tr>';
		});
	}
	if(cartNos != ""){
		isCheckAll();
		countTotalPrice();
	} else {
		$(".topNum").html(result.data.total);
		$(".topMoney").html("¥"+result.data.totalPrice);
		$(".bottomNum").html(result.data.total);
		$(".bottomMoney").html("¥"+result.data.totalPrice);
	}

	if(result.data.total==0){
		$(".shopping_cart").hide();
		$(".empty_cart").show();
	}else{
		$(".shopping_cart").show();
		$(".empty_cart").hide();
	}
	$("#orderlist").html(html);
	if (hasDomain) {
		$('.domainUpper').removeClass('domainUpper');
	}

	if(isDomain)
		$("#domainagree").show();
	if(isCloud)
		$("#cloudagree").show();
}

function showFormat(totalPrice,payPrice){
	var html='';
	if(totalPrice<=0 || totalPrice==payPrice)
		html="无";
	else{
		var yhPrice=Math.round(parseFloat(totalPrice-payPrice)*100)/100;
		html='<s style="color:#CCC;font-size:14px;">原价￥'+totalPrice+'</s><br/><span style="color:#01bd01;font-size:14px;">省￥'+yhPrice+'</span>';
	}
	return html;
}

//全选或者全不选
function checkAll(checkall){
	if(checkall.checked){
		$("input[name='chkBox']").prop("checked",true);
		$("input[name='checkBoxAll']").prop("checked",true);

	}else{
		$("input[name='chkBox']").prop("checked",false);
		$("input[name='checkBoxAll']").prop("checked",false);
	}
	countTotalPrice();
}

//单项
function checkSingle(chk){
	var checkBoxNum=$("input[name='chkBox']").length
	var checkedNum=$("input[name='chkBox']:checked").length
	if(checkBoxNum!=checkedNum){
		$("input[name='checkBoxAll']").prop("checked",false);
	}else{
		$("input[name='checkBoxAll']").prop("checked",true);
	}
	countTotalPrice();
}

//单项
function isCheckAll(){
	var checkBoxNum=$("input[name='chkBox']").length
	var checkedNum=$("input[name='chkBox']:checked").length
	if(checkBoxNum!=checkedNum){
		$("input[name='checkBoxAll']").prop("checked",false);
	}else{
		$("input[name='checkBoxAll']").prop("checked",true);
	}
}

function countTotalPrice(){
	var cartNos="";
	indexs=0;
	$("input[name='chkBox']:checked").each(function(){
		if($(this).attr("checked")=="checked"){
			cartNos += $(this).val()+",";
			indexs+=1;
		}
	});
	cartNos=cartNos.substring(0, cartNos.length-1);

	var service = {};
	service.cartNos = cartNos;
	var fn="countTotalPrice";
	service = Commonjs.jsonToString(service);
	var params = Commonjs.getParams(fn,service);//获取参数
	Commonjs.ajaxTrue(weburl,params,countTotalPriceSuccess);
}

function countTotalPriceSuccess(data){
	$(".topNum").html(indexs);
	$(".topMoney").html("¥"+data.data);
	$(".bottomNum").html(indexs);
	$(".bottomMoney").html("¥"+data.data);
}

//批量删除
function delSelect(){
	var cartNos="";
	$("input[name='chkBox']:checked").each(function(){
		if($(this).attr("checked")=="checked"){
			cartNos += $(this).val()+",";
		}
	});

	if(cartNos==""){
		alert("请选择需要删除的商品");
		return;
	}
	cartNos=cartNos.substring(0, cartNos.length-1);
	delCart(cartNos);
}

var aliyunTimeLine = [
    {
        value: 1,
        label: '1 个月',
		type: 'm'
    },
    {
        value: 2,
        label: '2 个月',
        type: 'm'
    },
    {
        value: 3,
        label: '3 个月',
        type: 'm'
    },
    {
        value: 6,
        label: '半年',
        type: 'm'
    },
    {
        value: 12,
        label: '1 年',
        type: 'y'
    },
    {
        value: 24,
        label: '2 年',
        type: 'y'
    },
    {
        value: 36,
        label: '3 年',
        type: 'y'
    },
    {
        value: 48,
        label: '4 年',
        type: 'y'
    },
    {
        value: 60,
        label: '5 年',
        type: 'y'
    }
];

var aliyunTimeLineHuawei = [
    {
        value: 1,
        label: '1 个月',
        type: 'm'
    },
    {
        value: 2,
        label: '2 个月',
        type: 'm'
    },
    {
        value: 3,
        label: '3 个月',
        type: 'm'
    },
    {
        value: 4,
        label: '4 个月',
        type: 'm'
    },
    {
        value: 5,
        label: '3 个月',
        type: 'm'
    },
    {
        value: 6,
        label: '半年',
        type: 'm'
    },
    {
        value: 7,
        label: '7 个月',
        type: 'm'
    },
    {
        value: 8,
        label: '8 个月',
        type: 'm'
    },
    {
        value: 9,
        label: '9 个月',
        type: 'm'
    },
    {
        value: 12,
        label: '1 年',
        type: 'y'
    },
    {
        value: 24,
        label: '2 年',
        type: 'y'
    },
    {
        value: 36,
        label: '3 年',
        type: 'y'
    }
];

//获取购买时长
function getApplyTime(productClass,productCode,applyTime,applyType,cartNo,cartType,regType){
	var html='';
	if(productClass=="cloudDisk"){
		html='按天（'+applyTime+'天）';
		return html;
	}
	else if(productClass=="cloud" || productClass=="vhost" || productClass=="diy"){
        if(cartType=="update"){
            html='按天（'+applyTime+'天）';
            return html;
        }
		if (regType == 'aliyun') {
            var fun="uptApplyTime(this,'"+cartNo+"')";
            html+='<select class="form-control" style="width:85px;" onchange="'+fun+'">';
            applyTime = "m" == applyType ? applyTime : (applyTime * 12);
            BaseForeach(aliyunTimeLine,function(i,item){
                //选中
                if(applyTime==item.value){
                    isSelected=" selected='selected'";
                }else{
                    isSelected="";
                }
                var value = item.value;
                if (value > 11) {
                	value = value / 12;
				}
                html+='<option type="'+item.type+'" value="'+value+'"'+isSelected+'>'+item.label+'</option>';
            });
            html+='</select>';
		} else if (regType == configParam.cloudType.huawei) {
            var fun="uptApplyTime(this,'"+cartNo+"')";
            html+='<select class="form-control" style="width:85px;" onchange="'+fun+'">';
            applyTime = "m" == applyType ? applyTime : (applyTime * 12);
            BaseForeach(aliyunTimeLineHuawei,function(i,item){
                //选中
                if(applyTime==item.value){
                    isSelected=" selected='selected'";
                }else{
                    isSelected="";
                }
                var value = item.value;
                if (value > 11) {
                    value = value / 12;
                }
                html+='<option type="'+item.type+'" value="'+value+'"'+isSelected+'>'+item.label+'</option>';
            });
            html+='</select>';
		} else {
            var service = {};
            if(cartType=="add"){
                service.chargeId = 1;
            }else if(cartType=="renew"){
                service.chargeId = 2;
            }
            service.productCode = productCode;
            var fn="getPromotionTime";
            service = Commonjs.jsonToString(service);
            var params = Commonjs.getParams(fn,service);//获取参数
            var result=Commonjs.ajax(weburl,params,false);
            if(result.result=="success"){
                var desc="";
                var isSelected="";
                if(result.data!=null && result.data.length>0){
                    var fun="uptApplyTime(this,'"+cartNo+"')";
                    html+='<select class="form-control" style="width:85px;" onchange="'+fun+'">';
                    BaseForeach(result.data,function(i,item){
                        if(item.applyType=="y"){
                            desc="年";
                        }else if(item.applyType=="m"){
                            desc="个月";
                        }

                        //选中
                        if(applyTime==item.applyTime && applyType==item.applyType){
                            isSelected="selected='selected'";
                        }else{
                            isSelected="";
                        }
                        html+='<option type="'+item.applyType+'" value="'+item.applyTime+'" '+isSelected+'>'+item.applyTime+desc+'</option>';
                    });
                    html+='</select>';
                }
            }
		}
	}else if(productClass=="domain"){
		var service = {};
		if(cartType=="add"){
			service.chargeId = 1;
		}else if(cartType=="renew"){
			service.chargeId = 2;
		}
		service.productCode = productCode;
		var fn="getProductBuyTime";
		service = Commonjs.jsonToString(service);
		var params = Commonjs.getParams(fn,service);//获取参数
		var result=Commonjs.ajax(weburl,params,false);
		if(result.result=="success"){
			var desc="";
			var isSelected="";
			var list=result.data;
			if(list!=null && list.length>0){
				var fun="uptApplyTime(this,'"+cartNo+"')";
				html+='<select class="form-control" style="width:85px;" onchange="'+fun+'">';
				for(var i=0;i<list.length;i++){
					//选中
		    		if(applyTime==list[i]){
		    			isSelected="selected='selected'";
		    		}else{
		    			isSelected="";
		    		}
					html+='<option type="y" value="'+list[i]+'" '+isSelected+'>'+list[i]+'年</option>';
				}
				html+='</select>';
			}
		}
	}
	return html;
}

//更改购买时长
function uptApplyTime(obj,cartNo){
	var service = {};
	service.cartNo = cartNo;
	service.applyTime=$(obj).val();
	service.priceType=$(obj).find("option:selected").attr("type");
	var fn="uptUserCart";
	service = Commonjs.jsonToString(service);
	var params = Commonjs.getParams(fn,service);//获取参数
	Commonjs.ajaxTrue(weburl,params,uptApplyTimeSuccess,false);
}

function uptApplyTimeSuccess(data){
	queryUserCartList();
}

var regTypes = null;
//获取域名注册商
function getRegType(productClass,cartNo,cartType, regType){
    var html='';
    if(productClass=="domain" && cartType=="add"){

    	if(regTypes == null){
			var service = {};
			var fn="queryUseRegType";
			service = Commonjs.jsonToString(service);
			var params = Commonjs.getParams(fn,service);//获取参数
			var result=Commonjs.ajax(weburl,params,false);
            regTypes = result;
        }
        if(regTypes.result == "success"){
            var isSelected="";
            var list=regTypes.data;
            if(list!=null && list.length>0){
                var fun="uptDomainRegType(this,'"+cartNo+"')";
                html+='<select class="form-control" style="width:114px;" onchange="'+fun+'">';
                for(var i=0;i<list.length;i++){
                    //选中
                    if(regType==list[i].value){
                        isSelected="selected='selected'";
                    }else{
                        isSelected="";
                    }
                    html+='<option value="'+list[i].value+'" '+isSelected+'>'+list[i].description+'</option>';
                }
                html+='</select>';
            }
        }
    }
    return html;
}

//修改域名注册商
function uptDomainRegType(obj, cartNo){
    var service = {};
    service.cartNo = cartNo;
    service.regType=$(obj).val();
    var fn="uptUserCartDomainRegtype";
    service = Commonjs.jsonToString(service);
    var params = Commonjs.getParams(fn,service);//获取参数
    Commonjs.ajaxTrue(weburl,params,uptDomainRegTypeSuccess,false);
}

function uptDomainRegTypeSuccess(data){
    queryUserCartList();
}

//购物车产品参数
function getProductParam(param,productClass,cartType, regType){
	var html='';
	if(productClass=="cloudDisk"){
		html+='实例名：'+param.instanceName+'<br/>';
		html+='地域：'+param.regionName+'<br/>';
		html+='可用区：'+param.zoneName+'<br/>';
		html+='磁盘类型：'+param.diskTypeName+'<br/>';
		html+='大小：'+param.size+'GB<br/>';
	}else if(productClass=='cloud'){
        if (cartType == "renew" || cartType == "update") {//续费与升级
            html += '实例名：' + param.instanceName + '<br/>';
        } else {
        	if (regType == 'aliyun') {
                html += '实例数量：' + param.amount + '<br/>';
			}
		}
		if (regType == 'hyperv') {
            html += '地域：' + param.regionName + '<br/>';
            html += '可用区：' + param.zoneName + '<br/>';
            if (cartType == "add" || cartType == "renew") {//开通与续费
                html += 'CPU：' + param.cpu + '核<br/>';
                html += '内存：' + param.memory + 'G<br/>';
                html += 'IP类型：' + (param.ipType.toUpperCase() == 'PUB' ? '共享IP' : '独立IP') + '<br />';
                html += '带宽：' + param.bandwidth + 'Mbps<br/>';
                html += '系统盘：' + param.systemDiskSize + 'GB<br/>';
                var dataDiskList = param.dataDisklist;
                if (dataDiskList != null && dataDiskList.length > 0) {
                    BaseForeach(dataDiskList, function (i, item) {
                        if (item.dataDiskSize != "0") {
                            html += '数据盘：' + item.dataDiskSize + 'GB<br/>';
                        }
                    });
                }
                html += '操作系统：' + param.osVersion;
            } else if (cartType == "update") {//升级
                if (param.type == "spec") {
                    html += 'CPU：' + param.oldCpu + '核=>' + param.newCpu + '核<br/>';
                    html += '内存：' + param.oldMemory + 'G=>' + param.newMemory + 'G<br/>';
                } else if (param.type == "bandwidth") {
                    html += '带宽：' + param.oldBandwidth + 'Mbps=>' + param.newBandwidth + 'Mbps<br/>';
                } else if (param.type == "disk") {
                    html += '磁盘名称：' + param.diskName + '<br/>';
                    if (param.diskAttribute == 1)
                        html += '磁盘属性：系统盘<br/>';
                    else if (param.diskAttribute == 2)
                        html += '磁盘属性：数据盘<br/>';
                    html += '大小：' + param.oldDiskSize + 'G=>' + param.newDiskSize + 'G<br/>';
                }
            }
        } else if ('aliyun' == regType || 'huawei' == regType) {
            html += '地域：' + param.regionName + '<br/>';
            html += '可用区：' + param.zoneName + '<br/>';
            if (cartType == "add" || cartType == "renew") {//开通与续费
                html += 'CPU：' + param.instanceDetail.cpuCoreCount + '核<br/>';
                html += '内存：' + param.instanceDetail.memorySize + 'GiB<br/>';
                html += '带宽：' + param.internetMaxBandwidthOut + 'Mbps<br/>';
                html += '系统盘：' + param.sysDiskSize + 'GiB<br/>';
                var dataDiskList = param.dataDisk;
                if (dataDiskList != null && dataDiskList.length > 0) {
                    BaseForeach(dataDiskList, function (i, item) {
                        if (item.diskSize && item.diskSize != "0") {
                            html += '数据盘：' + item.diskSize + 'GiB<br/>';
                        } else if (item.dataDiskSize && item.dataDiskSize != '0') {
                            html += '数据盘：' + item.dataDiskSize + 'GiB<br/>';
						}
                    });
                }
                html += '操作系统：' + param.imageName;
            } else if (cartType == 'update') {
            	if (param.type=="disk") {
                    html += '磁盘名称：' + param.diskName + '<br/>';
                    if (param.diskAttribute == 1) {
                        html += '磁盘属性：系统盘<br/>';
                    } else if (param.diskAttribute == 2) {
                        html += '磁盘属性：数据盘<br/>';
                    }
                    html += '大小：' + param.oldDiskSize + 'G=>' + param.newDiskSize + 'G<br/>';
                } else if (param.type == 'aliyun_ecs_system') {
                    html += '原操作系统：' + param.oldImageName + '<br />';
                    html += '新操作系统：' + param.newImageName + '<br />';
                    html += '系统盘容量：' + param.newSystemDiskSize + 'G<br />';
                } else {
                    if (param.instanceType && '' != param.instanceType) {
                        html += 'CPU：' + param.oldCpu + '核=>' + param.newCpu + '核<br/>';
                        html += '内存：' + param.oldMemory + 'G=>' + param.newMemory + 'G<br/>';
                    }
                    if (param.internetMaxBandwidthOut > param.oldBandwidth) {
                        html += '带宽：' + param.oldBandwidth + 'Mbps=>' + param.internetMaxBandwidthOut + 'Mbps<br/>';
                    }
                }
			}
		}
	}else if(productClass=='domain'){
		html=param.domainName;
	} else if (productClass == 'vhost') {
		html += '开通的服务：';
		if (param.serviceType.indexOf('web') > -1) {
			html += "WEB、"
		}
        if (param.serviceType.indexOf('ftp') > -1) {
            html += "FTP、"
        }
        if (param.serviceType.indexOf('mysql') > -1) {
            html += "MySQL、"
        }
        if (param.serviceType.indexOf('mssql') > -1) {
            html += "SQL Server、"
        }
        html = html.substr(0, html.length - 1);
	} else if (productClass == 'diy') {
	    html += "" == param.order_describe ? "" : param.order_describe.replace(/\n/g, "<br />");
    }
	return html;
}

//删除购物车
function delCart(cartNos){
	if(confirm("确定要从购物车中删除选中的商品吗?")){
		var service = {};
		service.cartNos = cartNos;
		var fn="delUserCart";
		service = Commonjs.jsonToString(service);
		var params = Commonjs.getParams(fn,service);//获取参数
		Commonjs.ajaxTrue(weburl,params,delCartSuccess,false);
	}
}

function delCartSuccess(data){
	queryUserCartList();
	//queryUserCartCount();
}

function subForm(){
	var result=$("input[name='checkAgree']:checked").length
	if(result<1){
		Commonjs.alert("只能同意协议才能购买产品");
		return;
	}
	var flag=false;
	var cartNos="";
	var productlist='';
	$("input[name='chkBox']:checked").each(function(){
		if($(this).attr("checked")=="checked"){
			cartNos += $(this).val()+",";
			if($(this).attr("index")=="domain" && $(this).attr("carttype")=="add"){
				productlist+='{"cartNo":"'+$(this).val()+'","productParam":"'+$(this).attr("domainname")+'"},';
				flag=true;
			}
		}
	});

	if(cartNos==""){
		alert("请选择需要购买的产品");
		return;
	}
	cartNos=cartNos.substring(0, cartNos.length-1);

	if(flag){
		productlist=productlist.substring(0, productlist.length-1);
		var jsonStr='{"productlist":['+productlist+']}';
		clearCookie("shopp_productlist");
		clearCookie("shopp_orderIds");
		document.cookie="shopp_productlist="+jsonStr;
		document.cookie="shopp_orderIds="+cartNos;
		window.location.href="domainmaterial.html";
		return;
	}

	var service = {};
	service.cartNos = cartNos;
	var fn="addUserOrder";
	service = Commonjs.jsonToString(service);
	var params = Commonjs.getParams(fn,service);//获取参数
	Commonjs.ajaxTrue(weburl,params,subFormSuccess,false);
}

function subFormSuccess(data){
	if(data.data==null)
		return false;

	clearCookie("orderIds");
	document.cookie="orderIds="+data.data.orderIds+";path=/";
	window.location.href="settlement.html";
}
