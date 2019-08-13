var runCount = 5;//总共执行次数
var nextTime = 30*1000; //再次请求后台间隔时
$(function(){
	var orderIds=getCookie("orderIds");
	getHandleOrder(orderIds);
})

function handleProcess(){
	var $progress = $('.progress__handle'),
	$bar = $('.progress__bar'),
	percent = 0,
	update, resetColors,
	speed = 2, timer;
	resetColors = function () {
	    $progress.removeClass('progress--complete');
	};
	update = function () {
	    timer = setTimeout(function () {
	        percent += speed;
	        if (percent >= 95) {
	            percent = 0;
	        }
	        update();

	        $bar.css({ left: percent + '%' });
	    }, 40);
	};

	setTimeout(function () {
	    $progress.addClass('progress--active');
	    update();
	}, 500);
}

function getHandleOrder(orderIds){
	var service = {};
	service.orderIds = orderIds;
	var fn="getUserOrderList";
	service = Commonjs.jsonToString(service);
	var params = Commonjs.getParams(fn,service);//获取参数
	Commonjs.ajaxTrue(weburl,params,getHandleOrderSuccess);
}

function getHandleOrderSuccess(data){
	if(data.data==null)
		return false;

	$("#handleList").html("");
	if(data.data.length>0){
		BaseForeach(data.data,function(i,item){
			var html='';
			html+='<tr>';
			html+='<input id="run_' + i + '" value="0" type="hidden" >';
			if(item.productClass=="domain" && item.regType == "5"){
				html+='<input id="again_' + i + '" value="1" type="hidden" >';
			} else {
				html+='<input id="again_' + i + '" value="0" type="hidden" >';
			}
			html+='<td>'+(i+1)+'</td>';
			html+="<td><a href=\"javascript:void(0)\" target=\"iframe\" onclick=\"orderDetail('"+item.orderId+"')\">"+item.orderId+"</a></td>";
			html+='<td>'+item.productClassName+'</td>';
			html+='<td>'+item.orderTypeName+'</td>';
			html+='<td>¥'+item.payAmount+'</td>';
			html+='<td>';
			if(item.productClass=="cloud" || item.productClass=="cloudDisk"){
				html+='<div id="handleResult_'+i+'" style="float:left;padding-top:5px;">您订购的产品正在执行中，需要1-5分钟，请您耐心等待。</div>';
			}else{
				html+='<div id="handleOnline_'+i+'" style="display:none;width:300px;float:left;padding-top:5px;">';
				html+='<div class="htmleaf-content">';
				html+='<div class="progress__handle progress--active">';
				html+='<b class="progress__bar" style="left: 50%;"></b>';
				html+='</div></div></div>';
				html+='<div id="handleResult_'+i+'" style="float:left;padding-top:5px;"></div>';
			}
			html+='<div id="goHandle_'+i+'" style="float:right;margin-right:50px;display:none;">';
			html+="<input type=\"button\" class=\"bottom_btn\" value=\"继续处理\" onclick=\"gotoHandleOrder('"+item.orderId+"',"+i+",'"+item.productClass+"')\" style=\"border: none; padding: 5px 12px; line-height: 22px; display: inline-block;\" >";
			html+='</div>';
			html+='</td>';
			html+='</tr>';

			$("#handleList").append(html);
			handleProcess();
			handleOrder(item.orderId,i);
		});
	}
}

function gotoHandleOrder(orderId,index,productClass){
	$("#handleResult_"+index).html('');
	$("#run_"+index).val(0);
	if(productClass=="cloud" || productClass=="cloudDisk" || productClass=="vhost"){
		$("#handleResult_"+index).html("您订购的产品正在执行中，需要1-5分钟，请您耐心等待。");
	}
	handleOrder(orderId,index);
}

function handleOrder(orderId,index){
	var count = Number($("#run_"+index).val());//已执行次数
	var againFlag = Number($("#again_"+index).val()); //是否继续执行
	if (count < 0) {
		count = 0;
		againFlag = 0;
	}
	
	$("#handleOnline_"+index).css("display","block");
	$("#handleResult_"+index).css("display","block");
	$("#goHandle_"+index).hide();

	var service = {};
	service.orderId = orderId;
	var fn="handleOrder";
	service = Commonjs.jsonToString(service);
	var params = Commonjs.getParams(fn,service);//获取参数
	$.ajax({
		datatype:"json",
        type:"POST",
        url: weburl,
        data:params,
		cache : false,
		success: function(data){
   			var result=eval("("+data+")");
			$("#handleOnline_"+index).css("display","none");
   			if(result.result=="success"){
   				var msg=result.data.message;
   				if(!isNotNull(msg))
   					msg="操作失败";
				
   				if(result.data.code=="-1"){
   					$("#handleResult_"+index).html("订单处理失败："+msg);
   					$("#goHandle_"+index).show();
   				} else if(result.data.code=="-2"){
					$("#handleResult_"+index).html(msg);
	    		} else if(result.data.code=="-3"){
					if (againFlag > 0 && count < runCount){
						$("#handleOnline_"+index).css("display","block");
						$("#handleResult_"+index).css("display","none");
						qryHandleStatus(orderId, index, result.data.taskNo);
					}else{
						$("#handleOnline_"+index).css("display","none");
						$("#handleResult_"+index).css("display","block");
						$("#handleResult_"+index).html(msg);
						$("#goHandle_"+index).show();
					}
	    		} else if(result.data.code=="0"){
    				var fn="getProductDetail('"+result.data.instanceId+"','"+result.data.productClass+"')";
    				var html='<a href="javascript:void(0)" onclick="'+fn+'">立即进入控制台</a>';
    				$("#handleResult_"+index).html("订单处理成功："+html);
    			}
   			}else{
   				$("#handleResult_"+index).html("订单处理失败："+result.msg);
   			}
		},
		error: function () {
        	alertNew('服务器忙，请稍候再试！');
    	}
	});
}

function qryHandleStatus(orderId, index, taskNo){
	var count = Number($("#run_"+index).val());//已执行次数
	var againFlag = Number($("#again_"+index).val()); //是否继续执行
	if (count < 0) {
		count = 0;
		againFlag = 0;
	}
	
	$("#handleOnline_"+index).css("display","block");
	$("#handleResult_"+index).css("display","block");
	$("#goHandle_"+index).hide();
	
	var service = {};
	service.orderId = orderId;
	service.taskNo = taskNo;
	var fn = "qryOrderHandleStatus";
	service = Commonjs.jsonToString(service);
	var params = Commonjs.getParams(fn,service);//获取参数
	$.ajax({
		datatype:"json",
        type:"POST",
        url: weburl,
        data:params,
		cache : false,	
		success: function(data){ 
		var result=eval("("+data+")");
		$("#handleOnline_"+index).css("display","none");
			if(result.result=="success"){
				var msg=result.data.message;
				if(!isNotNull(msg))
					msg="操作失败";
				
				if(result.data.code=="0"){
					handleOrder(orderId,index);
				} else if(result.data.code=="-1"){
					$("#handleResult_"+index).html(msg);
    			} else if(result.data.code=="-3"){
					if (againFlag > 0 && count < runCount){
						$("#run_"+index).val(Number(count) + 1);
						$("#handleOnline_"+index).css("display","block");
						$("#handleResult_"+index).css("display","none");
						//N秒后再次请求
						setTimeout("qryHandleStatus('"+orderId+"','"+index+"','"+taskNo+"');", nextTime);
					}else{
						$("#handleOnline_"+index).css("display","none");
						$("#handleResult_"+index).css("display","block");
						$("#handleResult_"+index).html(msg);
						$("#goHandle_"+index).show();
					}
	    		}
			} else {
				$("#handleResult_"+index).html("订单处理失败："+result.msg);
			}
		}
	});
}

function orderDetail(orderId){
	window.location.href=realPath+"/usercenter/index.html?url=order/orderinfo.html?orderId="+orderId;
}

function getProductDetail(instanceId,productClass){
	if(productClass=="domain"){

	}else if(productClass=="cloud"){
		window.location.href=realPath+"/usercenter/index.html?url=business/cloud/serverdetail.html?iId="+instanceId;
	} else if (productClass=="vhost") {
		if (instanceId && undefined != instanceId && "undefined" != instanceId) {
            window.location.href=realPath+"/usercenter/index.html?url=business/vhost/detail.html?iId=" + instanceId;
		} else {
            window.location.href=realPath+"/usercenter/index.html?url=business/vhost/index.html";
		}
	} else {
        window.location.href=realPath+"/usercenter/index.html";
	}
}
