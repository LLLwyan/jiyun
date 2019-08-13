$(function(){
	getPayChannl();
	getDicVipgrade();
    getWxPay();
});

function getDicVipgrade(){
	var service = {};
	var fn="queryDicVipgradeByUid";
	service = Commonjs.jsonToString(service)
	var params = Commonjs.getParams(fn,service);//获取参数
	Commonjs.ajaxTrue(weburl,params,getDicVipgradeSuccess,false);
}

function getDicVipgradeSuccess(data){
	if(data.data==null)
		return;

	var view=data.data;
	if(view.minCharge!=0)
		$("#prompt").html("提示：当前会员级别最低充值："+view.minCharge+"元");
}

//充值
function OnlineRecharge(){
	var amount = $("#amount");
	var payType = $('input:radio:checked').val();
	if(payType=="sftpay"){
		var bankCode = $('input:radio:checked').attr("instcode");
	}

	if(Commonjs.isEmpty(amount.val())){
		$.tooltip('充值金额不能为空',2000,false);
		amount.focus();
		return false;
	}
	if(amount.val()<=0){
		$.tooltip('充值金额不能小于0',2000,false);
		amount.focus();
		return false;
	}

	if(isNaN(amount.val())){
		$.tooltip('金额只能为数字',2000,false);
		amount.focus();
		return false;
	}
	if(typeof(payType)=="undefined"){
		$.tooltip('请选择充值方式',2000,false);
		return false;
	}
	var service = {};
	service.amount = amount.val();
	service.payType = payType;
	if(payType=="sftpay"){
		service.bankCode = bankCode;
	}
	var fn="OnlineRecharge";
	service = Commonjs.jsonToString(service)
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

function getPayChannl(){
	var service = {};
	var fn="getPayChannl";
	service = Commonjs.jsonToString(service)
	var params = Commonjs.getParams(fn,service);//获取参数
	Commonjs.ajaxTrue(weburl,params,getPayChannlSuccess,false);
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
	},500);
}

function wxPay(orderId) {
    var modalWin = wModal(window).add('wxPayPage', $('#_wxPayPage').html()).show();

    var service = {};
    service.orderid = orderId;
    service = Commonjs.jsonToString(service)
    var url = weburl + '?fn=qrCode&p=' + encodeURIComponent(service);
	modalWin.find('#qrCodeImg').attr('src', url);

    modalWin.find('.btn-primary').unbind('click').on('click', function () {
        parent.location.href = '/usercenter/index.html';
    });
}


