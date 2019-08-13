var orderIds;
$(function(){
	getPayChannl();
	orderIds=getCookie("orderIds");
	getPayOrder(orderIds);
    getWxPay();
});

function getPayOrder(orderIds){
	clearCookie("orderIds");
	document.cookie="orderIds="+orderIds+";path=/";
	var service = {};
	service.orderIds = orderIds;
	var fn="getPayUserOrder";
	service = Commonjs.jsonToString(service);
	var params = Commonjs.getParams(fn,service);//获取参数
	Commonjs.ajaxTrue(weburl,params,getPayOrderSuccess);
}

function getPayOrderSuccess(result){
	var payPrice=result.data.payPrice;
	$("#show_price").html("¥"+payPrice);
	var ua=result.data.userAccount;
	if(ua!=null && ua!=""){
		$("#userName").html(ua.userName);
		$("#balance").html(ua.balance);
	}

	if(payPrice<=ua.balance){
		$("#onlinePay").show();
		$("#payMsg").html("您的帐户余额可支付当前订单，可使用余额支付！");
	}
	else{
		$("#onlinePay").hide();
		$("#payMsg").html("您的帐户余额不足，请充值后再进行支付，或选择在线支付！");
	}
}

function OnlineRecharge(){
	var payType = $('input:radio:checked').val();
	if(payType=="sftpay"){
	var bankCode = $('input:radio:checked').attr("instcode");
	}
	if(typeof(payType)=="undefined"){
		$.tooltip('请选择充值方式',2000,false);
		return false;
	}
	var service = {};
	service.orderId = orderIds;
	service.payType = payType;
	if(payType=="sftpay"){
		service.bankCode = bankCode;
	}
	var fn="OrderRecharge";
	service = Commonjs.jsonToString(service);
	var params = Commonjs.getParams(fn,service);//获取参数
	Commonjs.ajaxTrue(weburl,params,OnlineRechargeSuccess,false);
}

function OnlineRechargeSuccess(result){
	if(result.data==null) return false;
	var datas=result.data;
	if(datas.code>0){
		if(datas.paychannel=="alipay"){
			window.open(datas.data,'_parent');
		}else if(datas.paychannel=="sftpay"){
			shengpay(datas);
		}else if (datas.paychannel == "wxpay") {
            var orderId = datas.orderid;
            wxPay(orderId);
        }
	}else{
		Commonjs.alert(datas.message);
	}
}

function getPayChannl(){
	var service = {};
	var fn="getPayChannl";
	service = Commonjs.jsonToString(service)
	var params = Commonjs.getParams(fn,service);//获取参数
	Commonjs.ajaxTrue(weburl,params,getPayChannlSuccess,false);
}

function getWxPay() {
    var service = {};
    var fn="getParamByNameAndType";
    service.paramName = configParam.dic.wxPayOpen.name;
    service.paramType = configParam.dic.wxPayOpen.type;
    service = Commonjs.jsonToString(service)
    var params = Commonjs.getParams(fn,service);//获取参数
    Commonjs.ajaxTrue(sysurl,params,function (data) {
        if (parseInt(data.data.paramValue) === 1) {
            $('#wxbank').show();
        }
    },false);
}

function getPayChannlSuccess(result){
	if(result.data==null) return false;
	if(result.result="success"){
		var channl=result.data.channl.split(",")
		for(i=0;i<channl.length;i++){
			if(channl[i]=="alipay"){
				$("input[type='radio'][name=bankId][id='alipay']").attr("checked",true);
				$("#alibank").show();
			}
			if(channl[i]=="sftpay"){
				$("input[type='radio'][name=bankId][id='CEB']").attr("checked",true);
				$("#sftbank").show();
			}
		}
	}else{
		Commonjs.alert(datas.message);
	}
}

//充值确认
function shengpay(data){
	$("#PayChannel").val(data.payChannel);
	$("#InstCode").val(data.instCode);
	$("#MsgSender").val(data.msgSender);
	$("#SendTime").val(data.sendTime);
	$("#OrderTime").val(data.orderTime);
	$("#PageUrl").val(data.pageUrl);
	$("#NotifyUrl").val(data.notifyUrl);
	$("#BuyerIp").val(data.buyerIp);
	$("#Ext1").val(data.ext1);
	$("#SignMsg").val(data.signMsg);
	$("#OrderNo").val(data.orderNo);
	$("#OrderAmount").val(data.orderAmount);
	$("#ProductName").val(data.productName);
	$("#BuyerContact").val(data.buyerContact);
	setTimeout(function(){
		$('#addBox').find("input[type='submit']").trigger('click');
	},1000);
}

function wxPay(orderId) {
    var modalWin = wModal(window).add('wxPayPage', $('#_wxPayPage').html()).show();
	//应付金额
    modalWin.find('#payMoney').html($('#show_price').html());

    var service = {};
    service.orderid = orderId;
    service = Commonjs.jsonToString(service)
    var url = weburl + '?fn=qrCode&p=' + encodeURIComponent(service);
    modalWin.find('#qrCodeImg').attr('src', url);

    modalWin.find('.btn-primary').unbind('click').on('click', function () {
        parent.location.href = '/usercenter/index.html';
    });
}


