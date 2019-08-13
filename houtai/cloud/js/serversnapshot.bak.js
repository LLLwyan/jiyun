var instanceId;
$(function(){
    instanceId=request("iId");
	queryUserSnapshot(instanceId);
	
	if(instanceId!=""){
		$("#instanceDetail").attr("href","serverdetail.html?iId="+instanceId);
		$("#instanceDisk").attr("href","serverdisk.html?iId="+instanceId);
		$("#instanceSnapshot").attr("href","serversnapshot.html?iId="+instanceId);
		$("#instanceId").html(instanceId);
	}
});

function queryUserSnapshot(instanceId){
	var service = {};
	service.instanceId=instanceId
	var fn="queryAdminSnapshotList";
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
			html+='<tr><td>'+item.snapshotName+'</td>';
			html+='<td>'+item.systemName+'</td>'; 
			html+='<td>'+item.diskSize+'G</td>';
			if(item.snapshotType==1)
				html+='<td>系统盘</td>';
			else if(item.snapshotType==2)
				html+='<td>数据盘</td>';	
			else
				html+='<td>未知</td>';	
			html+='<td>'+item.diskName+'</td>';   
			html+='<td>'+item.statusName+'</td>';
			html+='<td>'+jsonDateTimeFormat(item.snapshotTime)+'</td>';
		});
	}else{
		html+='<tr><td colspan="10" style="height:50px;text-align:center;line-height:50px;">找不到相关信息</td></tr>';	
	}
	$("#snapshotList").html(html);
}

