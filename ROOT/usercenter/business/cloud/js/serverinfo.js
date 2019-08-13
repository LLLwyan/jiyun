function jointHtml(view,info,disklist){
	var html='';
	var diskHtml='';
	if(view!=null && info!=null){
		var model = '';
		switch (view.hostType) {
			case 'aliyun':
				model = view.extendInfo.instanceType;
				break;
			case 'huawei':
				model = view.extendInfo.orderInfo.instanceTypeId;
				break;
			case 'hyperv':
				model = info.modelName;
				break;
		}
		html+='<tr><th width="10%" align="right"><span>实例名称：</span></th>';
		html+='<td width="20%">'+info.instanceName+'</td>';
		html+='<th width="10%" align="right"><span>地域：</span></th>';
		html+='<td width="20%">'+info.regionName+'</td>';
		html+='<th width="10%" align="right"><span>可用区：</span></th>';
		html+='<td width="20%">'+info.zoneName+'</td>';
		html+='</tr><tr>';
		html+='<th width="10%" align="right"><span>机型：</span></th>';
		html+='<td width="20%">'+model+'</td>';
		html+='<th width="10%" align="right"><span>实例规格：</span></th>';
		html+='<td width="20%">'+info.cpu+'核'+info.memory+'G</td>';
		html+='<th width="10%" align="right"><span>带宽：</span></th>';
		html+='<td width="20%">'+info.bandwidth+'Mbps</td>';
		html+='</tr><tr>';
		html+='<th width="10%" align="right"><span>公网IP：</span></th>';
		html+='<td width="20%">'+info.publicIP+'</td>';
		html+='<th width="10%" align="right"><span>内网IP：</span></th>';
		html+='<td width="20%">'+info.privateIP+'</td>';
		html+='<th width="10%" align="right"><span>操作系统：</span></th>';
		html+='<td width="20%">'+info.osVersion+'</td>';
		html+='</tr><tr>';
		html+='<th width="10%" align="right"><span>开通时间：</span></th>';
		html+='<td width="20%">'+jsonDateTimeFormat(view.startTime)+'</td>';
		html+='<th width="10%" align="right"><span>到期时间：</span></th>';
		html+='<td width="20%">'+jsonDateFormat(view.endTime)+' 00:00:00</td>';
		if(disklist!=null && disklist.length>0){
			BaseForeach(disklist,function(i,item){
				if(item.diskAttribute==1){
					html+='<th width="10%" align="right"><span>系统盘：</span></th>';
					html+='<td width="20%">'+item.diskSize+'GB</td>';
					html+='</tr>';
					$("#systemDiskSize").val(item.diskSize);
					$("#systemDiskType").val(item.diskType);
				}else if(item.diskAttribute==2){
					diskHtml+=(diskHtml==''?'':'，') + item.diskName+'：['+item.diskSize+'GB]';
				}

				if(disklist.length==1){
					diskHtml="无";
				}
			});
		}

		//数据盘
		html+='<tr>';
		html+='<th width="10%" align="right"><span>数据盘：</span></th>';
		html+='<td width="20%" colspan="5">'+diskHtml+'</td>';
		html+='</tr>';
		$("#view").html(html);
		$("#bandwidth").html(info.bandwidth+'Mbps');
	}
}

function gotoServerList(){
	window.location.href="./server.html";
}

function isNull(str){
	if(str==null || str==undefined)
		return "";
	return str;
}
