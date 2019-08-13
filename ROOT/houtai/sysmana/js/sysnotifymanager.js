var sysloginfo = request("sysloginfo");
$(function(){
	querynotify();
});

function querynotify(){
	var service = {};
	var notifytype=$("#notifytypelist").val();
	var index = $("#pagenumber").val();
	service.msgType=notifytype;
	service.page=index;
	service.pagesize=10;
	var fn="queryNotifyRecord";
	service = Commonjs.jsonToString(service);
	var params = Commonjs.getParams(fn,service);//获取参数
	Commonjs.ajaxTrue(weburl,params,querynotifySuccess);
}

function querynotifySuccess(data){
	$("#msgmanager").html("");
	var msg="";
	if (data.msg!="无记录"){
			BaseForeach(data.data,function(i,item){
			msg+='<tr class="gradeX">';
			msg+='<td>'+(i+1)+'</td>';
			if(item.msgType==1){
				msg+='<td>邮件通知</td>';
			}else if(item.msgType==2){
				msg+='<td>短信通知</td>';
			}else if(item.msgType==3){
				msg+='<td>站内信</td>';
			}else{
				msg+='<td>'+item.msgType+'</td>';
			}
			msg+='<td>'+item.receiver+'</td>'; 
			msg+='<td><a href="sysnotifyinfo.html?id='+item.id+'">'+item.title+'</a></td>';
			msg+='<td>'+jsonDateTimeFormat(item.sendTime)+'</td>';
			if(item.state==0){
				msg+='<td>未发送</td>';
			}else if(item.state==1){
				msg+='<td>发送错误</td>';
			}else if(item.state==2){
				msg+='<td>发送成功</td>';
			}else{
				msg+='<td>'+item.state+'</td>';
			}
			msg+='</tr>';
		});
		$("#page").show();
	}else{
		$("#page").hide();
		msg+=' <tr><td colspan="10" style="height:50px;text-align:center;line-height:50px;">找不到相关信息</td></tr>';
		}
	$("#msgmanager").append(msg);
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

//分页	
function Page(totalcounts,pagecount,pager) {
  	$("#"+pager).pager( {
  		totalcounts : totalcounts,
  		pagesize : 10,
  		pagenumber : $("#pagenumber").val(),
  		pagecount : parseInt(totalcounts/pagecount)+(totalcounts%pagecount >0?1:0),
  		buttonClickCallback : function(al) {
  			$("#pagenumber").val(al);
  			querynotify();
  		}
  	});
}

 