var id = request("id");
$(function(){
	queryAdminAccountDetail();
});

//查询记账详情
function queryAdminAccountDetail(){
	var service = {};
	service.id = id;
	var fn="queryAdminAccountDetail";
	service = Commonjs.jsonToString(service)
	var params = Commonjs.getParams(fn,service);//获取参数
	Commonjs.ajaxTrue(weburl,params,querySuccess);
};

function querySuccess(data){
	if(data.data == null){
		return false;
	}
	
	var view=data.data.view;
	var html="";
	html+='<tr>';
	html+='<th width="20%">会员：</th>';  
	html+='<td align="left">'+view.userName+'</td>';
	html+='</tr>';
	html+='<tr>';
	html+='<th width="20%">业务类型：</th>'; 
	html+='<td align="left">'+view.itemIdName+'</td>';
	html+='</tr>';
	html+='<tr>';
	html+='<th>发生额:</th>';
	html+='<td align="left">¥'+view.amount+'</td>';
	html+='</tr>';
	html+='<tr>';
	html+='<th>余额:</th>'; 
	html+='<td align="left">¥'+view.balance+'</td>';
	html+='</tr>';
	html+='<tr>'; 
	html+='<th>备注：</th>';
	html+='<td align="left">'+view.remark+'</td>'; 
	html+='</tr>'; 
	html+='<tr>';
	html+='<th>时间:</th>';
	html+='<td align="left">'+jsonDateTimeFormat(view.regDate)+'</td>';
	html+='</tr>';
	$("#content").html(html);	
}

