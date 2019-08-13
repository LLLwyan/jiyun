$(function(){
	queryUsRecord();
	queryUsOptType();    
})
 
function queryUsRecord(){
	var userName = $("#userName").val();
	var instanceName = $("#instanceName").val();
	var publicIP = $("#publicIP").val();
	var optType = $("#optType").val();
	var remark = $("#remark").val();
	var start = $("#start").val();
	var end = $("#end").val(); 
	var index = $("#pagenumber").val();
	var service = {};
	service.userName=userName;
	service.instanceName=instanceName;
	service.publicIP=publicIP;
	service.optType=optType;
	service.remark=remark;
	service.start=start;
	service.end=end;
	service.page = index;
	service.pagesize = 10;
	var fn="queryUsRecordList";
	service = Commonjs.jsonToString(service)
	var params = Commonjs.getParams(fn,service);//获取参数
	Commonjs.ajaxTrue(weburl,params,querySuccess);
};

function querySuccess(data){
	if(data.data == null){
		return false
	}
	var html="";
	if (data.data.length>0){
		BaseForeach(data.data,function(i,item){
			html+='<tr>';
			html+='<td>'+item.userName+'</td>';
			html+='<td>'+item.instanceName+'</td>'; 
			html+='<td>'+item.publicIP+'</td>';
			html+='<td>'+item.operateTypeName+'</td>';
			html+='<td>'+jsonDateTimeFormat(item.operateTime)+'</td>';  
			html+='<td><a href="serverrecordinfo.html?id='+item.id+'" class="btn btn-primary">详情</a></td>'
			html+='</tr>';
		});
	}else{
		html+=' <tr><td colspan="11" style="height:50px;text-align:center;line-height:50px;">找不到相关信息</td></tr>';	
	}
	$('#recordlist').html(html);
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

//获取云服务操作类型
function queryUsOptType(){
	var service = {};
	service.paramEName = "usOptType";
	var fn="getListParamItemByEName";
	service = Commonjs.jsonToString(service);
	var params = Commonjs.getParams(fn,service);//获取参数 
	var data=Commonjs.ajax(sysurl,params,false);
	if(data.result == "success"){
		var orderTypelist='<option value="">所有</option>';
		if (data.data.length>0){
			BaseForeach(data.data,function(i,item){
				orderTypelist+='<option value="'+item.value+'">'+item.description+'</option>';
			}); 
		}
		$('#optType').html(orderTypelist);
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
			queryUsRecord(); 
		}
	});  	
}