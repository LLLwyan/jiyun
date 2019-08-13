$(function(){
	queryUserSnapshot();
});

function queryUserSnapshot(){
	var index = $("#pagenumber").val(); 
	var service = {}; 
	service.page = index;
	service.pageSize = 10;
	var fn="queryUserSnapshotList";
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
			html+='<td><input id="chk_'+i+'" value="'+item.snapshotId+'" name="chkBox" type="checkbox" style="display:none">';
			html+='<img id="img_'+i+'" src="../../../images/wait.gif"/></td>';
			html+='<td>'+item.snapshotName+'</td>';
			html+='<td>'+item.diskSize+'G</td>';
			if(item.snapshotType==1)
				html+='<td>系统盘</td>';
			else if(item.snapshotType==2) 
				html+='<td>数据盘</td>';	
			else
				html+='<td>未知</td>';	  
			html+='<td>'+item.diskName+'</td>';  
			html+='<td class="stn" id="status_'+i+'">'+getStatusColor(item.status,item.statusName)+'</td>';
			html+='<td>'+jsonDateTimeFormat(item.snapshotTime)+'</td>';
			html+='<td id="btn_'+i+'">'+getOptItem(item.status,item.snapshotId)+'</td>';
			html+='</td></tr>'; 
			
			getSnapshotStatus(i,item.status,item.hostType,item.snapshotId,item.id);
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
	$("#snapshotList").html(html);
}

function getStatusColor(status,name){ 
	var html=''; 
	if(status=="InUse") 
		html='<span style="color:#090">'+name+'</span>';
	else
		html='<span style="color:#F90">'+name+'</span>';
	return html;
}

function getSnapshotStatus(index,status,hostType,snapshotId,id){
	var service = {};
	service.hostType=hostType;
	service.id=id;
	var fn="querySnapshotStatus";
	service = Commonjs.jsonToString(service)
	var params = Commonjs.getParams(fn,service);//获取参数	
	$.ajax({
		datatype:"json",
        type:"POST",
        url: weburl,
        data:params,
		cache : false,	
		success: function(data){
			var result=jQuery.parseJSON(data);
			if(result.result == "success"){
				if(result.data.code=="0"){
					$("#chk_"+index).show();  
					$("#img_"+index).hide(); 
					$("#btn_"+index).html(getOptItem(result.data.status,result.data.snapshotId));
				}else if(result.data.code=="-1"){
					getSnapshotStatus(index,status,hostType,snapshotId,id); 
				}
				
				//颜色区分
				$("#status_"+index).html(getStatusColor(result.data.status,result.data.statusName));
			}
		}
	});
}

function getOptItem(status,snapshotId){    
	var html='';   
	if(status=="InUse"){  
		html+='<a onclick="singleDelSnapshot(\''+snapshotId+'\')" href="javascript:void(0);" class="manager-btn mr-10">删除</a>';
		//html+='<a onclick="restoreSnapshot(\''+snapshotId+'\')" href="javascript:void(0);" class="manager-btn mr-10">还原</a>';
	}else if(status=="Building"){  
		html+='<a href="javascript:void(0);" class="manager-btn mr-10 disable">删除</a>';
		//html+='<a href="javascript:void(0);" class="manager-btn mr-10 disable">还原</a>'; 
	}
	return html;
}

function restoreSnapshot(snapshotId){
	var contents=$('#addBox').get(0);
	var artBox=art.dialog({
		lock: true,
		artIcon:'add',
		opacity:0.4,
		width: 400,
		padding:'0px 0px',
		title:'还原快照',
		header:false,
		content: contents,
		ok: function () {
			var service = {};
	 		service.snapshotId=snapshotId;
	 		var fn="restoreSnapshot";
	 		service = Commonjs.jsonToString(service);
	 		var params = Commonjs.getParams(fn,service);//获取参数
	 		Commonjs.ajaxTrue(weburl,params,restoreSuccess,true,"正在还原中");
		},cancel: function(){
			$('#addBox').hide();
		}
	});
}

function restoreSuccess(data){
	if(data.data==null)
		return 
		
	var result=data.data; 
	if(result.code=="0")
		window.location.href="server.html";
	else if(result.code=="-1"){
		Commonjs.alert(result.message);
	}
}

//单个删除快照
function singleDelSnapshot(snapshotId){
	delSnapshot(snapshotId);
}

//批量删除快照
function batchDelSnapshot(){
	var snapshotIds = "";
	$("input[name='chkBox']:checked").each(function(){
		snapshotIds += $(this).attr("value")+',';;
	});
	if(!snapshotIds){
		$.tooltip("请先勾选要操作的快照",1000,true);
		return;
	}
	snapshotIds = snapshotIds.substring(0,snapshotIds.length-1);
	delSnapshot(snapshotIds);
}

//删除快照
function delSnapshot(snapshotIds){
	art.dialog({
 		id: 'testID',
 	    width: '245px',
 	    height: '109px',
 	    content: '您要删除吗？注意：删除后数据将不能恢复',
 	    lock: true,
 	    button: [{
 	      	name: '确定',
 	       	callback: function () {
 	       	 	var service = {};
				service.snapshotIds = snapshotIds;
				var fn="delSnapshot";
				service = Commonjs.jsonToString(service);
				var params = Commonjs.getParams(fn,service);//获取参数
				Commonjs.ajaxTrue(weburl,params,delSnapshotSuccess,true,"正在执行中");
 	       	}
 	 	},{
 	 		name: '取消'
 	 	}]
 	});
}

function delSnapshotSuccess(data){ 
	$.tooltip(data.msg,2000,true);
	queryUserSnapshot();
}

function checkAllSnapshot(checkall){
	if(checkall.checked){    
		$("input[name='chkBox']").prop("checked",true); 
		$("input[name='checkBoxAll']").prop("checked",true); 
		
	}else{    
		$("input[name='chkBox']").prop("checked",false);	
		$("input[name='checkBoxAll']").prop("checked",false);			
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
  			queryUserSnapshot();
  		}
  	});  	
}

