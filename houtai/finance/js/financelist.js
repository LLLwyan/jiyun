$(function(){
	queryfinanceItem();
});

//查询财务列表
function queryAdminAccount(){
	var index = $("#pagenumber").val();
	$("#totalcount").val(0);
	var service = {};
	var fn = "queryAdminAccount";
	service.userName = $("#userName").val();
	service.start = $("#start").val();
	service.end = $("#end").val();
	service.subject =  $("#subject").val();
	service.page = index;
	service.pagesize = 10;
	service = Commonjs.jsonToString(service);
	var params = Commonjs.getParams(fn, service);//获取参数
	Commonjs.ajaxTrue(weburl,params,querySuccess);
};

function querySuccess(data){
	if(data.data==null)
		return;
	var datalist=data.data.list;
	var totalAmount=data.data.totalAmount; 

	var html = "";
	if(datalist.length > 0){
		BaseForeach(datalist,function(i, item){
			html += '<tr><td>'+(i+1)+'</td>';
			html += '<td>'+item.userName+'</td>';
			html += '<td>'+item.itemIdName+'</td>';
			html += '<td>'+item.amount+'</td>';
			html += '<td>'+item.balance+'</td>';
			html += '<td title='+item.remark+' class="f_remark" >'+item.remark+'</td>';
			html += '<td>'+item.operator+'</td>';
			html += '<td>'+jsonDateTimeFormat(item.regDate)+'</td>';
			html += '<td><a href="./financedetail.html?id='+item.id+'" class="btn btn-primary">查看</a></td>';
			html+='</tr>'; 
		}); 
	} else {
		html+=' <tr><td colspan="8" style="height:50px;text-align:center;line-height:50px;">找不到相关信息</td></tr>';
	}
	$('#finacelist').html(html);
	
	$(".f_remark").each(function(){
		var maxwidth=50;
		if($(this).text().length>maxwidth){
			$(this).text($(this).text().substring(0,maxwidth));
			$(this).html($(this).html()+'...');
		}
	});
	
	//显示总额
	if($("#subject").val()!=""){  
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

function queryfinanceItem(){
	var service = {};
	service.paramEName = "financeItem";
	var fn="getListParamItemByEName";
	service = Commonjs.jsonToString(service);
	var params = Commonjs.getParams(fn,service);//获取参数
	var data=Commonjs.ajax(sysurl,params,false);
	if(data.result == "success"){
		$("#subject").empty();
		var itemId='<option value="">所有</option>';
		if (data.data.length>0){
			BaseForeach(data.data,function(i,item){
				itemId+='<option value="'+item.value+'">'+item.description+'</option>';
			});
		}
		$('#subject').append(itemId);
		queryAdminAccount();
	}
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
  			queryAdminAccount();
  		}
  	});
}