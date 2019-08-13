var orderId = null;
var payStatus = "";
var handleStatus = "";
$(function(){
	orderId = request("orderId");
	if(orderId==""){
		Commonjs.alerturl('订单编号不能为空','orderlist.html');
		return;
	}
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
		$("#countryEn").val($(this).toPinyin());
	});
	//省份
	$("#cho_Province").on("keyup keydown change blur",function (){
		$("#cho_ProvinceEN").val($(this).toPinyin());
		$("#cho_CityEN").val($("#cho_City").toPinyin());
	});
	//城市
	$("#cho_City").on("keyup keydown change blur",function (){
		$("#cho_CityEN").val($(this).toPinyin());
	});
	//通讯地址
	$("#addrCn").on("keyup keydown change blur",function (){
		$("#addrEn").val($(this).toPinyin());
	});
	queryOrderInfo();
});

function queryOrderInfo(){
	$("#orderId").val(orderId);
	var service = {};
	service.orderId=orderId;
	var fn="getUserOrder";
	service = Commonjs.jsonToString(service)
	var params = Commonjs.getParams(fn,service);//获取参数
	Commonjs.ajaxTrue(weburl,params,queryOrderInfoSuccess);
}

function queryOrderInfoSuccess(data){
	$("#orderinfo").empty();
	var qryErroe = false;
	var orderinfo="";
	var productInfo="";
	if (data.data!=""){
		var item = data.data;
		payStatus = item.payStatus;
		handleStatus = item.handleStatus;

		orderinfo+='<tr>';
		orderinfo+='<th colspan="3" align="left" >订单信息</th></tr>';
		orderinfo+='<tr align="left"><td colspan="2" width="50%">订单编号：'+item.orderId+'</td>';
		orderinfo+='<td width="50%">用户名：'+item.userName+'</td></tr>';
		orderinfo+='<tr align="left"><td colspan="2">创建时间：'+jsonDateTimeFormat(item.orderDate)+'</td>';
		orderinfo+='<td>订单类型：'+item.orderTypeName+'</td></tr>';
		orderinfo+='<tr align="left"><td>支付状态：<span class="text-danger">'+item.payStatusName+'</span></td>';
		orderinfo+='<td>处理状态：<span class="text-danger">'+item.handleStatusName+'</span></td>';
		if(item.payStatus == "N" && item.handleStatus == "N"){
			orderinfo+='<td><input type="button" onClick="dealOrder(\''+item.orderId+'\',1);" class="manager-btn  mr-10" value="立即付款">';
			orderinfo+='<input type="button" onClick="delOrder(\''+item.orderId+'\')" class="manager-btn  mr-10" value="作废订单"></td></tr>';
		}else if(item.payStatus == "Y" && item.handleStatus == "N"){
			qryErroe = true;
			orderinfo+='<td><input type="button" onClick="dealOrder(\''+item.orderId+'\',2);" class="manager-btn  mr-10" value="继续处理"></td></tr>';
		}else{
			orderinfo+='<td></td></tr>';
		}

		productInfo+='<tr>';
		productInfo+='<td>'+item.productClassName+'</td>';
		productInfo+='<td>'+item.productName+'</td>';
		productInfo+='<td>'+getOrderParam(item.orderParam,item.productClass,item.handleStatus,item.orderType, item.regType)+'</td>';

		var priceType=item.priceType
		if(priceType.toLowerCase()=="y") {
			productInfo+='<td>'+item.applyTime+'年</td>';
		} else if(priceType.toLowerCase()=="m") {
			productInfo+='<td>'+item.applyTime+'月</td>';
		} else if(priceType.toLowerCase()=="d"){
			productInfo+='<td>按天（'+item.applyTime+'天）</td>';
		} else {
			productInfo+='<td>无</td>';
		}
		productInfo+='<td>¥'+item.payAmount+'</td>';
		//});
	}else{
		Commonjs.alert(data.msg);
	}
	$('#orderinfo').html(orderinfo);
	$("#productInfo").html(productInfo);
	if(qryErroe){
		queryOrderError();
	}
}

//查询订单是否有处理结果，并显示报错
function queryOrderError(){
	var service = {};
	service.orderId = orderId;
	var fn = "qryOrderErrMsg";
	service = Commonjs.jsonToString(service)
	var params = Commonjs.getParams(fn,service);//获取参数
	Commonjs.ajaxTrue(weburl,params,queryOrderErrorSuccess);
}

function queryOrderErrorSuccess(data){
	if(data.data == null)
		return false;
	$("#ordererror").empty();
	var orderlist="";
	if (data.data.code == "-1"){
		ordererror += '<tr>';
		ordererror += ' <td width="100%" align="left">';
		ordererror += ' 处理失败: ';
		ordererror += ' <font color="#FF0000"><b>';
		ordererror += data.data.message;
		ordererror += ' </b></font>';
		ordererror += ' </td>';
		ordererror += '</tr>';
	}
	$('#ordererror').html(ordererror);
}

//订单参数
function getOrderParam(param,productClass,handleStatus,cartType,regType){
	var html='';
	if(productClass=="cloudDisk"){
		html+='实例名：'+param.instanceName+'<br/>';
		html+='地域：'+param.regionName+'<br/>';
		html+='可用区：'+param.zoneName+'<br/>';
		html+='磁盘类型：'+param.diskTypeName+'<br/>';
		html+='大小：'+param.size+'GB<br/>';
	}
	else if(productClass=='cloud'){
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
		$('#domaininfo').hide();
		$('#uptdomain').hide();
	}else if(productClass=='domain'){
		html=param.domainName;
		getinformation(param);
	} else if (productClass == 'vhost') {
        console.log(param);
        if (param.serviceType.indexOf('web') > -1) {
        	html += '' === html ? '' : '<br />';
        	html += 'WEB（链接数：' + param.webLinks + '个；<br />';
        	html += '&nbsp;&nbsp;&nbsp;&nbsp;带宽：' + param.webWidth + 'KBps；<br />';
        	html += '&nbsp;&nbsp;&nbsp;&nbsp;流量：' + param.webFlow + 'GB；<br />';
        	html += '&nbsp;&nbsp;&nbsp;&nbsp;空间大小：' + param.ftpDiskQuota + 'MB）';
		}
		if (param.serviceType.indexOf('ftp') > - 1 && param.serviceType.indexOf('web') < 0) {
            html += '' === html ? '' : '<br />';
        	html += 'FTP（空间大小：' + param.ftpDiskQuota + 'MB）<br />';
		}
		if (param.serviceType.indexOf('mysql') > -1) {
            html += '' === html ? '' : '<br />';
        	html += 'MySQL（空间大小：' + param.mySQLSize + 'MB）';
		}
		if (param.serviceType.indexOf('mssql') > -1) {
            html += '' === html ? '' : '<br />';
        	html += 'SQL Server（空间大小：' + param.MSSQLSize + '；<br />';
        	html += '&nbsp;&nbsp;&nbsp;&nbsp;日志大小：' + param.MSSQLLogSize + '；)';
		}
	} else if (productClass == 'diy') {
		html += param.productDetail.replace(/\n/g, '<br />');
	}
	return html;
}

//获取域名注册人信息
function getinformation(param){
	$('#domaininfo').show();

	if(payStatus == "Y" && handleStatus == "Y") {
		$('#uptdomain').hide();
	} else if(payStatus == "Y" && handleStatus == "C") {
		$('#uptdomain').hide();
	} else {
		$('#uptdomain').show();
	}

	if(param.userType ==1){
	    $("#radio1").prop("checked",'checked');
	}else{
	     $("#radio2").prop("checked",'checked');
	}

	$("#userNameCn").val(param.userNameCn);
	$("#linkManLnCn").val(param.linkManLnCn);
	$("#linkManFnCn").val(param.linkManFnCn);
	$("#postcode").val(param.postcode);
	$("#email").val(param.email);

	$("#telArea").val(param.telephoneArea);
	$("#telephone").val(param.telephone);
	$("#telNumber").val(param.telNumber);

	$("#faxArea").val(param.faxArea);
	$("#fax").val(param.fax);
	$("#faxNumber").val(param.faxNumber);

	$("#addrCn").val(param.addrCn);
	$("#userNameEn").val(param.userNameEn);
	$("#linkManLnEn").val(param.linkManLnEn);
	$("#linkManFnEn").val(param.linkManFnEn);
	$("#addrEn").val(param.addrEn);
	$("#countryCn").val(param.countryCn);
	$("#cho_Province").val(param.provinceCn);
	$("#CID").val(param.cid);
	$("#cho_Province").trigger("change");
	$("#countryCn").trigger("change");
	$("#cho_City").val(param.cityCn);
	$("#cho_City").trigger("change");
	$("#countryEn").val(param.countryEn);
	$("#cho_ProvinceEN").val(param.provinceEn);
	$("#cho_CityEN").val(param.cityEn);
	$("#dns1").val(param.dns1);
	$("#dns2").val(param.dns2);
	$("#managepass").val(param.managepass);
	$("#domainName").val(param.domainName);
}

//修改信息
function uptTemplate(){
	var service={};
	service.userNameCn = $("#userNameCn").val();
	service.postcode = $("#postcode").val();
	service.email = $("#email").val();
	service.fax = $("#fax").val();
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
	service.dns1 = $("#dns1").val();
	service.dns2 = $("#dns2").val();
	service.managepass = $("#managepass").val();
	service.domainName = $("#domainName").val();

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
	if(Commonjs.isEmpty(service.dns1)){
		$.tooltip('域名DNS1不能为空',2000,false);
		$("#dns1").focus();
		return false;
	}
	if(Commonjs.isEmpty(service.dns2)){
		$.tooltip('域名DNS2不能为空',2000,false);
		$("#dns2").focus();
		return false;
	}
	if(Commonjs.isEmpty(service.managepass)){
		$.tooltip('域名管理密码不能为空',2000,false);
		$("#managepass").focus();
		return false;
	}
	//表单验证结束
	var datalist={};
	var fn="modUserOrder";
	datalist.orderparam=service;
	var orderId=$("#orderId").val();
	datalist.orderid=orderId;
	datalist = Commonjs.jsonToString(datalist)
	var params = Commonjs.getParams(fn,datalist);//获取参数
	Commonjs.ajaxTrue(weburl,params,uptTemplateSuccess,false);
}

function uptTemplateSuccess(data){
	$.tooltip(data.msg,2000,true);
	queryOrderInfo(orderId);
}

//处理订单
function dealOrder(orderId,type){
	if(orderId == ""){
		return;
	}
	clearCookie("orderIds");
	document.cookie="orderIds="+orderId+";path=/";
	if(type == 1){
		window.parent.frames.location.href ="../shopping/settlement.html";
	}else if(type == 2){
		window.parent.frames.location.href ="../shopping/payment.html";
	}else{
		return ;
	}
}

//删除订单
function delOrder(orderId){
	art.dialog({
		id:'testID',
		width:'245px',
		height:'109px',
		content:'您确定要作废吗？注意：删除后数据将不能恢复',
		lock:true,
		button:[{
			name:'确定',
			callback:function(){
				var service = {};
				service.orderId = orderId;
				var fn = "delUserOrder";
				service = Commonjs.jsonToString(service)
				var params = Commonjs.getParams(fn,service);
				Commonjs.ajaxTrue(weburl,params,delOrderSuccess,false);
			}
		}, {
			name:'取消'
		}]
	});
}

function delOrderSuccess(data){
	$.tooltip(data.msg, 2000, true);
	window.parent.frames.location.href =realPath+"/usercenter/index.html?url=order/orderlist.html";
}
