//充值记录
$(function(){
	var orderId = request('orderId');
	getReChargeByOId(orderId);
})

//订单号查询详情
function getReChargeByOId(orderId){
	var service = {};
	service.orderId = orderId;
	var fn="getChargeByOId";
	service = Commonjs.jsonToString(service)
	var params = Commonjs.getParams(fn,service);//获取参数
	Commonjs.ajaxTrue(weburl,params,getReChargeSuccess);
}

function getReChargeSuccess(data){
	var item = data.data.getUserCharge;
	$('#orderId').html(item.orderId);
	$('#userNameD').html(item.userName);
	$('#amount').html(item.amount);
	if(data.data.getListParamItemByEName.length >0){
		BaseForeach(data.data.getListParamItemByEName,function(i,item2){	
			if(item2.value==item.bankCode){
				$('#eNameDesc').html(item2.description);
			}
		});
	}
	$('#regTime').html(jsonDateTimeFormat(item.regTime));
	if(data.data.getListParamItemByStatus.length >0){
		BaseForeach(data.data.getListParamItemByStatus,function(i,item1){	
			if(item1.value==item.status){
				$('#StatusDesc').html(item1.description);
			}
		});
	}		
}

//手工处理充值订单
function rechargeManual(type){
	var content = '注意：此操作不可逆，您要手工处理这个订单吗？';
	art.dialog({
 		id: 'testID',
 	    width: '245px',
 	    height: '109px',
 	    content: content,
 	    lock: true,
 	    button: [{
      	name: '确定',
       	callback: function () {  
			var orderId = $("#orderId").html();
			  var fn = 'rechargeManual';
			  var service = {};
			  service.orderId = orderId;
			  service.type = type;
			  service = Commonjs.jsonToString(service);
			  var params = Commonjs.getParams(fn, service);	
			Commonjs.ajaxTrue(weburl,params,reManualSuccess,false);
 	       }
 	 	},{
 	 		name: '取消'
 	 	}]
 	});
}

function reManualSuccess(data){
	  $.tooltip(data.msg, 2000, true);
	  location.href = 'rechargelist.html';
}