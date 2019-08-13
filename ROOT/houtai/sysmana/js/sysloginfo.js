var id = request("id");
var type = request("type"); 
$(function () {
	queryLogDetails();
});

//查看操作日志详情
function queryLogDetails(){  
	var service = {};
	service.id = id;
	var fn="";
	if(type=="userlog")
		fn="queryLogDetails"; 
	else
		fn="queryRLDetail";
	service = Commonjs.jsonToString(service)
	var params = Commonjs.getParams(fn,service);//获取参数
	Commonjs.ajaxTrue(sysurl,params,queryLogSuccess);
}

function queryLogSuccess(data){
	if(data.data == null){
		return false;
	}
	$("#vm-content").html("");
	var userlog="";
	if(data.data !=null){
		BaseForeach(data.data,function(i,item){
			userlog+='<tr>';
			userlog+='<td style="text-align:right">序号：</td>';
			userlog+='<td style="text-align:left"> <label for="name" class="control-label">'+item.id+'</label></td>';
			userlog+='</tr>';
			userlog+='<tr>';
			userlog+='<td style="text-align:right">用户名：</td>';
			userlog+='<td style="text-align:left"> <label for="name" class="control-label">'+item.userName+'</label></td>';
			userlog+='</tr>';
			userlog+='<tr>';
			userlog+='<td style="text-align:right">操作组件：</td>';
			userlog+='<td style="text-align:left"> <label for="name" class="control-label">'+item.module+'</label></td>';
			userlog+='</tr>';
			userlog+='<tr>';
			userlog+='<td style="text-align:right">操作类型：</td>';
			userlog+='<td style="text-align:left"> <label for="name" class="control-label">'+item.logTypeName+'</label></td>';
			userlog+='</tr>';
			userlog+='<tr>';
			userlog+='<td style="text-align:right">操作人员：</td>';
			if(item.logTypeId==0){
				userlog+='<td style="text-align:left"><label for="name" class="control-label">管理员</label></td>';
			}else if(item.logTypeId==1){
				userlog+='<td style="text-align:left"><label for="name" class="control-label">会员</label></td>';
			}else if(item.logTypeId==-1){
				userlog+='<td style="text-align:left"><label for="name" class="control-label">访客</label></td>';
			}
			userlog+='</tr>';
			userlog+='<tr>';
			userlog+='<td style="text-align:right">日志内容：</td>';
			userlog+='<td style="text-align:left"><textarea rows="10" cols="100">'+item.logDesc+'</textarea></td>';
			userlog+='</tr>';
			userlog+='<tr>';
			userlog+='<td style="text-align:right">操作时间：</td>';
			userlog+='<td style="text-align:left"><label for="name" class="control-label">'+jsonDateTimeFormat(item.logTime)+'</label></td>';
			userlog+='</tr>';
		});
		$("#vm-content").append(userlog);
		 $("#userlogeditable").show();
	}
				
}