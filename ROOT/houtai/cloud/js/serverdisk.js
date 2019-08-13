$(function(){
	var instanceId=request("iId");
	var hostType=request("hostType");
	queryUserDisk(instanceId);

	if(instanceId!=""){
		$("#instanceDetail").attr("href","serverdetail.html?iId="+instanceId+"&hostType="+hostType);
		$("#instanceDisk").attr("href","serverdisk.html?iId="+instanceId+"&hostType="+hostType);
		$("#instanceSnapshot").attr("href","serversnapshot.html?iId="+instanceId+"&hostType="+hostType);
        if (hostType != configParam.cloudType.huawei) {
            $('li[value="snapshot"]').css('display', '');
        }
		$("#instanceId").html(instanceId);
	}
});

function queryUserDisk(instanceId){
	var index = $("#pagenumber").val();
	var service = {};
	service.instanceId=instanceId
	service.page = index;
	service.pageSize = 10;
	var fn="queryAdminDiskList";
	service = Commonjs.jsonToString(service)
	var params = Commonjs.getParams(fn,service);//获取参数
	Commonjs.ajaxTrue(weburl,params,querySuccess);
}

function querySuccess(data){
	if(data.data==null)
		return false;

	var html='';
	if (data.data.length>0){
		BaseForeach(data.data,function(i,item){
			html+='<tr>';
			html+='<td>'+item.userName+'</td>';
			html+='<td>'+item.diskName+'</td>';
			html+='<td>'+item.diskTypeName+'</td>';
			html+='<td>'+item.statusName+'</td>';
			html+='<td>'+item.diskSize+'G</td>';

			if(item.isMount==1)
				html+='<td>支持</td>';
			else
				html+='<td>不支持</td>';
			if(item.diskAttribute==1)
				html+='<td>系统盘</td>';
			else if(item.diskAttribute==2)
				html+='<td>数据盘</td>';
			if(item.payType==1)
				html+='<td>包年包月</td>';
			else if(item.payType==2)
				html+='<td>按流量计费</td>';

			var fn="snapshotDialog('"+item.diskId+"')";
			html+='</tr>';
		});
		$("#page").show();
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
	}else{
		$("#page").hide();
		html+='<tr><td colspan="10" style="height:50px;text-align:center;line-height:50px;">找不到相关信息</td></tr>';
	}
	$("#diskList").html(html);
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
  			queryUserDisk("");
  		}
  	});
}
