$(function(){
	$(".managertitle ul li").click(function(){
		 $(this).addClass("liactive").siblings().removeClass("liactive"); //切换选中的按钮高亮状态
		 var index=$(this).index(); //获取被按下按钮的索引值，需要注意index是从0开始的
		 $(".tab_box > div").eq(index).show().siblings().hide(); //在按钮选中时在下面显示相应的内容，同时隐藏不需要的框架内容
	});
	queryOrders();
	queryorderType();
	queryproductclass();
})

function queryOrders(){
	$("input[name='checkBoxAll']").prop("checked",false);
	$("#totalcount").val(0);
	var orderId = $("#orderId").val();
	var product = $("#product").val();
	var starttime = $("#starttime").val();
	var endtime = $("#endtime").val();
	var orderType = $("#orderType").val();
	var payStatus = $("#payStatus").val();
	var handleStatus = $("#handleStatus").val();
	var userName = $("#userName").val();
	var orderParam = $("#orderParam").val();
	var index = $("#pagenumber").val();
	var service = {};
	service.orderId=orderId;
	service.productClass=product;
	service.start=starttime;
	service.end=endtime;
	service.orderType=orderType;
	service.payStatus=payStatus;
	service.handleStatus=handleStatus;
	service.userName=userName;
	service.orderParam=orderParam;
	service.page = index;
	service.pagesize = 10;
	var fn="queryAdminOrder";
	service = Commonjs.jsonToString(service)
	var params = Commonjs.getParams(fn,service);//获取参数
	Commonjs.ajaxTrue(weburl,params,queryOrdersSuccess);
	$("#checkType").attr("ordertype","YN");
};

function queryOrdersSuccess(data){
	if(data.data == null){
		return false
	}
	$("#orderlist").empty();
	var orderlist="";
	if (data.data.length>0){
		BaseForeach(data.data,function(i,item){
			if(item.payStatus == "N" && item.handleStatus == "N"){
				orderlist+=' <tr><td><input value="'+item.orderId+'" type="checkbox" style="margin-top:5px;" name="chkBox" ></td>';
			}else{
				orderlist+=' <tr><td><input disabled = "disabled" type="checkbox" style="margin-top:5px;" name="chkBoxtem" ></td>';
			}
			orderlist+=' <td>'+item.userName+'</td>';
			orderlist+=' <td>'+item.orderId+'</td>';
			orderlist+=' <td>'+item.orderTypeName+'</td>';
			orderlist+=' <td>'+item.productClassName+'</td>';
			orderlist+=' <td>'+item.productName+'</td>';
			orderlist+=' <td>'+item.payAmount+'</td>';
			orderlist+=' <td>'+item.payStatusName+'</td>';
			orderlist+=' <td>'+item.handleStatusName+'</td>';
			orderlist+=' <td>'+jsonDateTimeFormat(item.orderDate)+'</td>';
			orderlist+=' <td>'
			orderlist+='<a href="orderinfo.html?orderId='+item.orderId+'" class="btn btn-primary">详情</a> '
			orderlist+='</td></tr>';
		});
	}else{
		orderlist+=' <tr><td colspan="11" style="height:50px;text-align:center;line-height:50px;">找不到相关信息</td></tr>';
	}
	$('#orderlist').append(orderlist);
	if(data.rows!=undefined){
		if(data.rows!=0){
			$("#totalcount").val(data.rows);
		}else{
			if(data.page==0)$("#totalcount").val(0);
		}
	}else{
		$("#totalcount").val(0);
	}
	Page($("#totalcount").val(),data.pagesize,'pager');
}

function queryOrder(payStatus,handleStatus){
	$("#orderId").val('');
	$("#product").val('');
	$("#starttime").val('');
	$("#endtime").val('');
	$("#orderType").val('');
	$("#userName").val('');
	$("#totalcount").val(1);
	$("#pagenumber").val(1);
	$("input[name='checkBoxAll']").prop("checked",false);
	$("#payStatus").val(payStatus);
	$("#handleStatus").val(handleStatus);
	var index = $("#pagenumber").val();
	var service = {};
	service.payStatus=payStatus;
	service.handleStatus=handleStatus;
	service.page = index;
	service.pagesize = 10;
	var fn="queryAdminOrder";
	service = Commonjs.jsonToString(service)
	var params = Commonjs.getParams(fn,service);//获取参数
	Commonjs.ajaxTrue(weburl,params,queryOrderSuccess);
	$("#checkType").attr("ordertype",payStatus+handleStatus);
};

function queryOrderSuccess(data){
	if(data.data == null){
		return false
	}
	$("#orderlist").empty();
	var orderlist="";
	if (data.data.length>0){
		BaseForeach(data.data,function(i,item){
			if(item.payStatus == 'Y' && item.handleStatus == 'N'){
				orderlist+=' <tr><td><input value="'+item.orderId+'" type="checkbox" style="margin-top:5px;" name="chkBox"></td>';
			}else{
				orderlist+=' <tr><td><input disabled = "disabled" type="checkbox" style="margin-top:5px;" name="chkBoxtem" ></td>';
			}
			orderlist+=' <td>'+item.userName+'</td>';
			orderlist+=' <td>'+item.orderId+'</td>';
			orderlist+=' <td>'+item.orderTypeName+'</td>';
			orderlist+=' <td>'+item.productClassName+'</td>';
			orderlist+=' <td>'+item.productName+'</td>';
			orderlist+=' <td>'+item.payAmount+'</td>';
			orderlist+=' <td>'+item.payStatusName+'</td>';
			orderlist+=' <td>'+item.handleStatusName+'</td>';
			orderlist+=' <td>'+jsonDateTimeFormat(item.orderDate)+'</td>';
			orderlist+=' <td>'
			orderlist+='<a href="orderinfo.html?orderId='+item.orderId+'" class="btn btn-primary">详情</a> '
			orderlist+='</td></tr>';
		});
	}else{
		orderlist+=' <tr><td colspan="11" style="height:50px;text-align:center;line-height:50px;">找不到相关信息</td></tr>';
	}
	$('#orderlist').append(orderlist);
	if(data.rows!=undefined){
		if(data.rows!=0){
			$("#totalcount").val(data.rows);
		}else{
			if(data.page==0)$("#totalcount").val(0);
		}
	}else{
		$("#totalcount").val(0);
	}
	Page($("#totalcount").val(),data.pagesize,'pager');
}

//获取订单类型
function queryorderType(){
	var service = {};
	service.paramEName = "orderType";
	var fn="getListParamItemByEName";
	service = Commonjs.jsonToString(service);
	var params = Commonjs.getParams(fn,service);//获取参数
	var data=Commonjs.ajax(sysurl,params,false);
	if(data.result == "success"){
		$("#orderType").empty();
		var orderTypelist='<option value="">所有</option>';
		if (data.data.length>0){
			BaseForeach(data.data,function(i,item){
				orderTypelist+='<option value="'+item.value+'">'+item.description+'</option>';
			});
		}
		$('#orderType').append(orderTypelist);
	}
};

//获取产品分类
function queryproductclass(){
	var service = {};
	service.paramEName = "productclass";
	var fn="getListParamItemByEName";
	service = Commonjs.jsonToString(service);
	var params = Commonjs.getParams(fn,service);//获取参数
	var data=Commonjs.ajax(sysurl,params,false);
	if(data.result == "success"){
		$("#product").empty();
		var productlist='<option value="">所有</option>';
		if (data.data.length>0){
			BaseForeach(data.data,function(i,item){
				productlist+='<option value="'+item.value+'">'+item.description+'</option>';
			});
		}
		$('#product').append(productlist);
	}
};

//分页
function Page(totalcounts,pagecount,pager) {
	$("#"+pager).pager( {
		totalcounts : totalcounts,
		pagesize : 10,
		pagenumber : $("#pagenumber").val(),
		pagecount : parseInt(totalcounts/pagecount)+(totalcounts%pagecount >0?1:0),
		buttonClickCallback : function(al) {
			$("#pagenumber").val(al);
			queryOrders();
		}
	});
}
//-----------------------------------以上为完成部分------------------------------
function checkAllOrder(checkall){
	if(checkall.checked){
		$("input[name='chkBox']").prop("checked",true);
		$("input[name='checkBoxAll']").prop("checked",true);

	}else{
		$("input[name='chkBox']").prop("checked",false);
		$("input[name='checkBoxAll']").prop("checked",false);
	}
}
function updataOrder(){
	var orderStrId = "";
	clearCookie("orderIds");
	if($("#checkType").attr("ordertype") == "YN"){
		$("input[name='chkBox']:checked").each(function(){
			orderStrId += $(this).attr("value")+',';
		});
		if(orderStrId == ""){
			return;
		}
		document.cookie="orderIds="+orderStrId.substring(0,orderStrId.length-1)+";path=/";;
		window.location.href="orderhanding.html";
	}
	return;
}
