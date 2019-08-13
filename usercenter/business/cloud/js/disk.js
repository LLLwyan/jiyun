$(function(){
	queryUserDisk();
});

function queryUserDisk(){
	var index = $("#pagenumber").val(); 
	var service = {};
	var fn="queryUserDiskList";
	service.page = index;
	service.pageSize = 10;
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
			html+='<tr><td>'+item.diskName+'</td>';
			html+='<td>'+item.diskTypeName+'</td>';
			html+='<td class="stn" id="status_'+i+'">'+getStatusColor(item.status,item.statusName)+'</td>';
			html+='<td>'+item.diskSize+'G</td>';
			
			if(item.isMount==1)
				html+='<td>支持</td>';
			else
				html+='<td>不支持</td>';		
			if(item.diskAttribute==1)
				html+='<td>系统盘</td>';
			else if(item.diskAttribute==2)
				html+='<td>数据盘</td>';	
			html+='<td>'+item.instanceName+'</td>';	
			html+=getOptItem(item.diskId,item.diskName,item.instanceId,item.status,item.diskAttribute);
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
	
	$(".editsnap").click(function(){			
		for(var i = 0;i < $(".edit-ul").length; i++){
			$(".edit-ul").eq(i).hide();
		}
		if($(".edit-ul").attr("flag") ==1){
			$(".edit-ul").attr("flag",0);
		}else{
			$(this).siblings(".edit-ul").show();
			$(".edit-ul").attr("flag",1);
		}	
	});
	
	$("body").click(function(e){
		if($(e.target).parents("td > .btn-group").length==0){
			$(".edit-ul").hide();
		}
	});
}

function getOptItem(diskId,diskName,instanceId,status,diskAttribute){
	var html=''; 
	var isDisable="";
	var fn="snapshotDialog('"+diskId+"','"+diskName+"','"+instanceId+"')";
	html+='<td>'; 
	if(status=="Expire"){
		isDisable="disable";
		html+='<a href="javascript:void(0)" class="manager-btn mr-10 disable">创建快照</a>';
	}
	else
		html+='<a href="javascript:void(0)" class="manager-btn mr-10" onclick="'+fn+'">创建快照</a>';
	
	html+='<div class="btn-group autosuo">'; 
	html+='<a href="javascript:void(0)" class="manager-btn editsnap '+isDisable+'">更多操作<span class="btn-caret"></span></a>';
	html+='<ul class="edit-ul" flag="0" >';
	if(diskAttribute==2){ 
		if(status=="Expire")
			html+='<li><a href="javascript:void(0)" class="edit-a-disable">扩容</a></li>';
		else
			html+='<li><a href="../cloud/capacityconfig.html?dId='+diskId+'">扩容</a></li>';	
	}
	else 
		html+='<li><a href="javascript:void(0)" class="edit-a-disable" title="系统盘扩容，请选择重装系统扩容">扩容</a></li>';
	html+='</ul></div>'; 
	html+='</td>';
	return html;
}

function getStatusColor(status,name){
	var html=''; 
	if(status=="InUse")  
		html='<span style="color:#090">'+name+'</span>';
	else
		html='<span style="color:#F90">'+name+'</span>';
	return html;
}

function snapshotDialog(diskId,diskName,instanceId){ 
	$("#diskName").html(diskName);   
	$("#instanceId").html(instanceId);       
	getSysProductInfo(instanceId);
	$("#snapshotName").val(""); 
	var contents=$('#addBox').get(0);
	var artBox=art.dialog({
		lock: true,
		artIcon:'add',
		opacity:0.4,
		width: 400,
		padding:'0px 0px',
		title:"创建云硬盘快照",
		header:false,
		content: contents,
		button: [{
 	      	name: '创 建',
 	       	callback: function () { 
			    var snapshotName=$('#snapshotName'); 
				if(Commonjs.isEmpty(snapshotName.val())){
					$.tooltip('请输入快照名称',2000,false); 
					snapshotName.focus();  
					return false;
				}
			
				var service = {};
				service.instanceId=instanceId;
				service.diskId = diskId;
				service.snapshotName=snapshotName.val();
				var fn="createSnapshot";
				service = Commonjs.jsonToString(service);
				var params = Commonjs.getParams(fn,service);//获取参数
				Commonjs.ajaxTrue(weburl,params,createSuccess,true,"正在进行中");
 	       	} 
		}]
	});
}

function createSuccess(data){
	window.location.href="snapshot.html";
}

function getSysProductInfo(instanceId){
	var service = {};
	var fn="querySysProductByiId";
	service.instanceId=instanceId;
	service = Commonjs.jsonToString(service)
	var params = Commonjs.getParams(fn,service);//获取参数
	Commonjs.ajaxTrue(weburl,params,getSuccess);
	
	var service = {};
	var fn="queryUserSnapshotCount";
	service.instanceId=instanceId;
	service = Commonjs.jsonToString(service)
	var params = Commonjs.getParams(fn,service);//获取参数
	var data=Commonjs.ajax(weburl,params,false);
	if(data==null)
		return false;
	if(data.result=="success"){
		if(data.data!=null)
			$("#aSnapshot").html(data.data.count); 
	}
}

function getSuccess(data){
	if(data.data==null)
		return false; 
	
	if(data.data.productParam==null)
		return false;
	$("#snapshotCount").html(data.data.productParam.snapshotNum); 
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
  			queryUserDisk();
  		}
  	});  	
}