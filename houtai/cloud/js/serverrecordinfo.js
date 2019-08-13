var id = request("id");
$(function () {
	queryUsRecordDetail();
});

//查看操作记录详情
function queryUsRecordDetail(){  
	var service = {};
	service.id = id;
	var fn="queryUsRecordDetail";
	service = Commonjs.jsonToString(service)
	var params = Commonjs.getParams(fn,service);//获取参数
	Commonjs.ajaxTrue(weburl,params,querySuccess);
}

function querySuccess(data){
	if(data.data == null){
		return false;
	}
	var html="";
	var view=data.data;
	html+='<tr>';
	html+='<td style="text-align:right;width:15%;">序号：</td>';
	html+='<td style="text-align:left;width:85%;">'+view.id+'</td>';  
	html+='</tr>';
	html+='<tr>';
	html+='<td style="text-align:right">会员名：</td>';
	html+='<td style="text-align:left">'+view.userName+'</td>';
	html+='</tr>';
	html+='<tr>';
	html+='<td style="text-align:right">实例Id：</td>';
	html+='<td style="text-align:left">'+view.instanceId+'</td>';
	html+='</tr>';
	html+='<tr>';
	html+='<td style="text-align:right">实例名称：</td>';
	html+='<td style="text-align:left">'+view.instanceName+'</td>';
	html+='</tr>';
	html+='<tr>';
	html+='<td style="text-align:right">公网IP：</td>';
	html+='<td style="text-align:left">'+view.publicIP+'</td>';
	html+='</tr>';
	html+='<tr>';
	html+='<td style="text-align:right">操作类型：</td>';
	html+='<td style="text-align:left">'+view.operateTypeName+'</td>';
	html+='</tr>';
	html+='<tr>';
	html+='<td style="text-align:right">操作时间：</td>';
	html+='<td style="text-align:left">'+jsonDateTimeFormat(view.operateTime)+'</td>';
	html+='</tr>';
	html+='<tr>'; 
	html+='<td style="text-align:right">备注：</td>';
	html+='<td style="text-align:left">'+view.remark+'</td>';
	html+='</tr>';
	$("#recordContent").html(html);		
}