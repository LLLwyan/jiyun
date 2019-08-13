var id = request("id");
$(function () {
	queryNotifyDetails();
});

//查看操作日志详情
function queryNotifyDetails(){
	var service = {};
	service.id = id;
	var fn="queryNotifyRecordDetails";
	service = Commonjs.jsonToString(service);
	var params = Commonjs.getParams(fn,service);//获取参数
	Commonjs.ajaxTrue(weburl,params,queryNotifySuccess);
}

function queryNotifySuccess(data){
	if(data.data == null){
		return false;
	}
	$("#vm-content").html("");
	var userlog="";
	if(data.data !=null){
		BaseForeach(data.data,function(i,item){
			userlog+='<tr>';
			userlog+='<td style="text-align:right;">序号：</td>';
			userlog+='<td style="text-align:left;"> <label for="name" class="control-label">'+item.id+'</label></td>';
			userlog+='</tr>';
			userlog+='<tr>';
			userlog+='<td style="text-align:right;">发送地址：</td>';
			userlog+='<td style="text-align:left;"> <label for="name" class="control-label">'+item.sender+'</label></td>';
			userlog+='</tr>';
			userlog+='<tr>';
			userlog+='<td style="text-align:right;">接收地址：</td>';
			userlog+='<td style="text-align:left;"> <label for="name" class="control-label">'+item.receiver+'</label></td>';
			userlog+='</tr>';
			userlog+='<tr>';
			userlog+='<td style="text-align:right;">通知方式：</td>';
			if(item.msgType==1){
				userlog+='<td style="text-align:left;"><label for="name" class="control-label">邮件通知</label></td>';
			}else if(item.msgType==2){
				userlog+='<td style="text-align:left;"><label for="name" class="control-label">短信通知</label></td>';
			}else if(item.msgType==3){
				userlog+='<td style="text-align:left;"><label for="name" class="control-label">站内信</label></td>';
			}
			userlog+='</tr>';
			userlog+='<tr>';
			userlog+='<td style="text-align:right;">状态：</td>';
			if(item.state==0){
				userlog+='<td style="text-align:left;"><label for="name" class="control-label">未发送</label></td>';
			}else if(item.state==1){
				userlog+='<td style="text-align:left;"><label for="name" class="control-label">发送错误</label></td>';
			}else if(item.state==2){
				userlog+='<td style="text-align:left;"><label for="name" class="control-label">发送成功</label></td>';
			}
			userlog+='</tr>';
			userlog+='<tr>';
			userlog+='<td style="text-align:right;">发送内容：</td>';
			userlog+='<td style="text-align:left;"><textarea rows="10" cols="100">'+item.content+'</textarea></td>';
			userlog+='</tr>';
			userlog+='<tr>';
			userlog+='<td style="text-align:right;">发送时间：</td>';
			userlog+='<td style="text-align:left;"><label for="name" class="control-label">'+jsonDateTimeFormat(item.sendTime)+'</label></td>';
			userlog+='</tr>';
		});
		$("#vm-content").append(userlog);
		 $("#userlogeditable").show();
	}
				
}