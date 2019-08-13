//流水查询
$(function(){
	$(".managertitle ul li").click(function(){
		$(this).addClass("liactive").siblings().removeClass("liactive"); //切换选中的按钮高亮状态
	});

	$('#start').datepicker(
	{
		dateFormat:'yy-mm-dd',
		dayNamesMin:['日','一','二','三','四','五','六'],
		firstDay:'1',
		changeYear:true,
		yearRange:'1950:2020',
		changeMonth:true,
		monthNamesShort:['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'],
	});

	$('#end').datepicker(
	{
		dateFormat:'yy-mm-dd',
		dayNamesMin:['日','一','二','三','四','五','六'],
		firstDay:'1',
		changeYear:true,
		yearRange:'1950:2020',
		changeMonth:true,
		monthNamesShort:['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'],
	});

	getAccountType();
});

//流水查询列表
function queryAccountFinance(){
	var index = $("#pagenumber").val();
	var service = {};
	var fn = "queryAccountConsume";
	service.start = $("#start").val();
	service.end = $("#end").val();
	service.subject = $("#accountType").val();
	service.amount=$("#amount").val();
	service.remark=$("#remark").val();
	service.voucherId=$("#orderId").val();
	service.page = index;
	service.pagesize = configParam.page.size;
	service = Commonjs.jsonToString(service);
	var params = Commonjs.getParams(fn, service);//获取参数
	Commonjs.ajaxTrue(weburl,params,function (data) {
		querySuccess(data, (parseInt(index) - 1) * configParam.page.size);
    });
};

function querySuccess(data, from){
	if(data.data==null)
		return;
	var datalist=data.data.list;
	var totalAmount=data.data.totalAmount;

	var finacelist = "";
	if(datalist.length>0){
		BaseForeach(datalist,function(i, item){
			finacelist += '<tr><td>'+(from+i+1)+'</td>';
			finacelist += '<td>'+item.itemIdName+'</td>';
			finacelist += '<td>'+item.amount+'</td>';
			finacelist += '<td>'+item.balance+'</td>';
			finacelist += '<td style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" title='+item.remark+' >'+item.remark+'</td>';
			finacelist += '<td>'+jsonDateTimeFormat(item.regDate)+'</td>';
			finacelist += '<td>';
			finacelist += '<a href="javascript:void(0)" onclick="gotoDetail('+item.id+')" class="manager-btn  mr-10">查看</a> '
			finacelist += '</td></tr>';
		});
		$('#finacelist').html(finacelist);
		$("#page").show();
	} else {
		$("#page").hide();
		finacelist+='<tr><td colspan="7" style="height:50px;text-align:center;line-height:50px;">找不到相关信息</td></tr>';
		$('#finacelist').html(finacelist);
	}

	//显示总额
	if($("#accountType").val()!=""){
		if(parseFloat(totalAmount)>0){
			$("#divtotal").show();
			$("#totalAmount").html("¥"+totalAmount);
		}else{
			$("#divtotal").hide();
			$("#totalAmount").html("");
		}
	}else{
		$("#divtotal").hide();
		$("#totalAmount").html("");
	}

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

function gotoDetail(id){
	window.location.href="consumedetail.html?id="+id;
}

//获取记账类型
function getAccountType(){
	var paramEName="financeItem";
	var service = {};
	var fn = "getListParamItemByEName";
	service.paramEName = paramEName;
	service = Commonjs.jsonToString(service);
	var params = Commonjs.getParams(fn, service);//获取参数
	Commonjs.ajaxTrue(sysurl,params,getAccountTypeSuccess,false);
}

function getAccountTypeSuccess(data){
	if(data.data==null)
		return;

	var html = "";
	html += '<option value="">全部</option>';
	if(data.data.length > 0){
		BaseForeach(data.data,function(i, item){
			html +='<option value="'+item.value+'">'+item.description+'</option>'
		});
	}
	$('#accountType').html(html);
}

//分页
function Page(totalcounts,pagecount,pager) {
  	$("#"+pager).pager( {
  		totalcounts : totalcounts,
  		pagesize : 10,
  		pagenumber : $("#pagenumber").val(),
  		pagecount : parseInt(totalcounts/pagecount)+(totalcounts%pagecount >0?1:0),
  		buttonClickCallback : function(al) {
  			$("#pagenumber").val(al);
  			queryAccountFinance();
  		}
  	});
}
