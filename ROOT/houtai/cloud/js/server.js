$(function(){
	var endDateType = request("endDateType");
	if(endDateType != ""){
		$("#endDateType").val(endDateType);
	}
	queryStatusList();
});

function queryStatusList(){
	var fn="getDataStatusList";
	var params = Commonjs.getParams(fn,"");//获取参数
	Commonjs.ajaxTrue(weburl,params,queryStatusListSuccess);
}

function queryStatusListSuccess(data){
	if(data.data==null)
		return;

	var html = "";
	html += '<option value="">全部</option>';
	if(data.data.length > 0){
		BaseForeach(data.data,function(i, item){
			html +='<option value="'+item.status+'">'+item.statusName+'</option>';
		});
	}
	$('#status').html(html);
	queryUserServiceList();
}

function queryUserServiceList(){
	var index = $("#pagenumber").val();
	var endDateType=$("#endDateType").val();
	var service = {};
	service.userName=$("#txtUserName").val();
	service.instanceName=$("#txtInstanceName").val();
	service.ip=$("#txtIp").val();
	service.endDateType =  endDateType;
	service.status=$("#status").val();
	service.page = index;
	service.pageSize = 10;
	service.hostType = $('#hostType').val();
	var fn="queryAdminServiceList";
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
			console.log(item, item.hostType);
			html+='<tr>';
			html+='<td><input id="chk_'+i+'" value="'+item.serviceId+'" iId="'+item.instanceId+'" iName="'+item.instanceName+'" iStatus="'+item.status+'" name=\'chkBox\' type="checkbox" style="display:none">';
			html+='<img id="img_'+i+'" src="../img/wait.gif"/></td>';
			html+='<td>'+item.userName+'</td>';
			html+='<td>'+item.instanceName+'</td>';
			html+='<td>'+item.productName+'</td>';
			html+='<td>'+item.regionName+'</td>';
			html+='<td id="pIP_'+i+'">'+item.publicIP+'</td>';
			html+='<td class="stn" id="status_'+i+'">'+getStatusColor(item.status,item.statusName)+'</td>';
			html+='<td>'+jsonDateTimeFormat(item.endTime)+'</td>';
			html+='<td id="opt_'+i+'">'+getOptItem(item.status,item.instanceId,item.serviceId,item.hostType)+'</td></tr>';

			getHostStatus(i,item.status,item.hostType,item.instanceId,item.serviceId);
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
		html+='<tr><td colspan="11" style="height:50px;text-align:center;line-height:50px;">找不到相关信息</td></tr>';
	}
	$("#userServiceList").html(html);
}

function getHostStatus(index,status,hostType,instanceId,serviceId){
	var service = {};
	service.hostType=hostType;
	service.serviceId=serviceId;
	var fn="queryHostStatus";
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
					if(status=="Building"){
						$("#pIP_"+index).html(result.data.publicIP);
					}
				}else if(result.data.code=="-1"){
					getHostStatus(index,status,hostType,instanceId,serviceId);
				}
				$("#opt_"+index).html(getOptItem(result.data.status,instanceId,serviceId,hostType));

				//颜色区分
				$("#status_"+index).html(getStatusColor(result.data.status,result.data.statusName));
			}
		}
	});
}

function getOptItem(status,instanceId,serviceId,hostType){
	var html='';
	var url="window.location.href='serverdetail.html?iId="+instanceId+"&hostType="+hostType+"'";

	//运行、停止、错误、到期
	if(status=="Running" || status=="Stopped" || status=="Error" || status=="Expire" || status=="Expire" ||
		status.toUpperCase() == 'ACTIVE' || status.toUpperCase() == 'PAUSED' || status.toUpperCase() == 'SHUTOFF' ||
		status.toUpperCase() == 'SUSPENDED'){
		html+='<a href="javascript:void(0)" class="btn btn-primary" onclick="'+url+'">详情</a>';
		html+='<a href="javascript:void(0)" class="btn btn-primary" onclick="singleDelServer(\''+serviceId+'\')">删除</a>';
	}
	else if(status=="Building"){//创建

	}else{
		html+='<a href="javascript:void(0)" class="btn btn-primary" onclick="'+url+'">详情</a>';
	}
	html+='<a href="javascript:void(0)" class="btn btn-primary" onclick="checkHostStatus(\''+instanceId+'\')">检测状态</a>';
	return html;
}

function getStatusColor(status,name){
	var html='';
	if(status=="Running")
		html='<span style="color:#090">'+name+'</span>';
	else
		html='<span style="color:#F90">'+name+'</span>';
	return html;
}

//单个删除主机
function singleDelServer(serviceId){
	delServer(serviceId);
}

//批量删除主机
function batchDelServer(){
	var serviceIds = "";
	$("input[name='chkBox']:checked").each(function(){
		serviceIds += $(this).attr("value")+',';
	});
	if(!serviceIds){
		$.tooltip("请先勾选要操作的主机",1000,true);
		return;
	}
	serviceIds = serviceIds.substring(0,serviceIds.length-1);
	delServer(serviceIds);
}

//删除主机
function delServer(serviceIds){
	art.dialog({
 		id: 'testID',
 	    width: '245px',
 	    height: '109px',
 	    content: '您确定要删除吗？删除主机也将删除硬盘数据和快照数据，注意：删除后数据将不能恢复！',
 	    lock: true,
 	    button: [{
 	      	name: '确定',
 	       	callback: function () {
 	       	 	var service = {};
				service.serviceIds = serviceIds;
				var fn="createDeleteOrder";
				service = Commonjs.jsonToString(service);
				var params = Commonjs.getParams(fn,service);//获取参数
				Commonjs.ajaxTrue(weburl,params,delServerSuccess,true,"正在执行中");
 	       	}
 	 	},{
 	 		name: '取消'
 	 	}]
 	});
}

function delServerSuccess(data){
	if(data.data==null)
		return;
	document.cookie="orderIds="+data.data+";path=/";;
	window.location.href="../order/orderhanding.html";
}

//检测主机状态
function checkHostStatus(instanceId){
	var service = {};
	service.instanceId=instanceId;
	var fn="checkHostStatus";
	service = Commonjs.jsonToString(service)
	var params = Commonjs.getParams(fn,service);//获取参数
	Commonjs.ajaxTrue(weburl,params,checkSuccess,true,"正在检测...");
}

function checkSuccess(data){
	if(data.data==null)
		return false;

	var result=data.data;
	if(result.code==0){
		Commonjs.alert("当前主机状态是同步");
	}else if(result.code==-1){
		Commonjs.alert("当前主机正在执行任务");
	}else if(result.code==-2){
		var message="当前主机状态："+result.dataStatusName+"，实际主机状态："+result.ActualName+"。状态未同步，是否同步？"
		syncStatus(message,result.instanceId,result.Actual);
	}
}

//同步状态
function syncStatus(message,instanceId,Actual){
	var dialog=	art.dialog({
		lock : true,
		opacity : 0.4,
		width : 250,
		title : '提示',
		content : message,
		ok : function() {
 	 	  var service = {};
 	 	  service.status = Actual;
 	 	  service.instanceId = instanceId;
 	 	  service = Commonjs.jsonToString(service);
 	 	  var fn="uptHostStatus";
 	 	  var params = Commonjs.getParams(fn, service);
 	 	  Commonjs.ajaxTrue(weburl,params,syncStatusSuccess,true,"正在同步...");
	 	},cancel: function(){
			$('#dialog').hide();
		}
	});
}

function syncStatusSuccess(data){
	$.tooltip(data.msg, 2000, true);
	queryUserServiceList();
}

//批量到期提醒
function batchExpireRemind(){
	var instanceIds = "";
	$("input[name='chkBox']:checked").each(function(){
		instanceIds += $(this).attr("iId")+',';
	});
	if(!instanceIds){
		$.tooltip("请先勾选要操作的主机",1000,true);
		return;
	}
	instanceIds = instanceIds.substring(0,instanceIds.length-1);
	expireRemind(instanceIds);
}

//到期提醒
function expireRemind(instanceIds){
	art.dialog({
 		id: 'expire',
 	    width: '245px',
 	    height: '109px',
 	    content: '您确定要发到期邮件和短信提醒吗？',
 	    lock: true,
 	    button: [{
 	      	name: '确定',
 	       	callback: function () {
 	       	 	var service = {};
				service.instanceIds = instanceIds;
				var fn="ExpireUsRemind";
				service = Commonjs.jsonToString(service);
				var params = Commonjs.getParams(fn,service);//获取参数
				Commonjs.ajaxTrue(weburl,params,expireRemindSuccess,true,"正在发送中...");
 	       	}
 	 	},{
 	 		name: '取消'
 	 	}]
 	});
}

function expireRemindSuccess(data){
	if(data.data==null)
		return false;

	var result=data.data;
	if(result.code=="0"){
		if(result.mailSendFail=="" && result.smsSendFail=="")
			$.tooltip("操作成功", 2000, true);
		else if(result.mailSendFail!=""){
			Commonjs.alert("实例："+result.mailSendFail+",发送邮件提醒失败。");
		}else if(result.smsSendFail!=""){
			Commonjs.alert("实例："+result.smsSendFail+",发送短信提醒失败。");
		}
	}else if(result.code=="-1"){
		$.tooltip("操作失败", 2000, false);
	}
}

//批量到期停用
function batchExpireDisable(){
	var instanceIds = "";
	$("input[name='chkBox']:checked").each(function(){
		instanceIds += $(this).attr("iId")+',';
	});

	if(!instanceIds){
		$.tooltip("请先勾选要操作的主机",1000,true);
		return;
	}
	instanceIds = instanceIds.substring(0,instanceIds.length-1);
	expireDisable(instanceIds);
}

//到期停用
function expireDisable(instanceIds){
	art.dialog({
 		id: 'expire',
 	    width: '245px',
 	    height: '109px',
 	    content: '您确定要停用当前已到期的服务器吗？',
 	    lock: true,
 	    button: [{
 	      	name: '确定',
 	       	callback: function () {
 	       	 	var service = {};
				service.instanceIds = instanceIds;
				var fn="ExpireUsDisable";
				service = Commonjs.jsonToString(service);
				var params = Commonjs.getParams(fn,service);//获取参数
				Commonjs.ajaxTrue(weburl,params,expireDisableSuccess,true,"正在停用中...");
 	       	}
 	 	},{
 	 		name: '取消'
 	 	}]
 	});
}

function expireDisableSuccess(data){
	if(data.data==null)
		return false;

	var result=data.data;
	if(result.code=="0"){
		if(result.failIds!="")
			Commonjs.alert("实例："+result.failIds+",到期停用失败。");
		else
			$.tooltip("操作成功", 2000, true);
	}else if(result.code=="-1"){
		$.tooltip("操作失败", 2000, false);
	}
	queryUserServiceList();
}

//批量恢复使用
function batchExpireResume(){
	var instanceIds = "";
	var instanceNames="";
	$("input[name='chkBox']:checked").each(function(){
		instanceIds += $(this).attr("iId")+',';
		var status=$(this).attr("iStatus")
		if(status!="Expire" && status!="Paused"){
			instanceNames+=$(this).attr("iName")+',';
		}
	});

	if(!instanceIds){
		$.tooltip("请先勾选要操作的主机",1000,true);
		return;
	}

	if(instanceNames){
		Commonjs.alert("实例："+instanceNames+"只有状态是到期或暂停才可使用恢复功能");
		return;
	}

	instanceIds = instanceIds.substring(0,instanceIds.length-1);
	expireResume(instanceIds);
}

//到期恢复
function expireResume(instanceIds){
	art.dialog({
 		id: 'expire',
 	    width: '245px',
 	    height: '109px',
 	    content: '您确定要恢复当前服务器吗？',
 	    lock: true,
 	    button: [{
 	      	name: '确定',
 	       	callback: function () {
 	       	 	var service = {};
				service.instanceIds = instanceIds;
				var fn="ExpireUsResume";
				service = Commonjs.jsonToString(service);
				var params = Commonjs.getParams(fn,service);//获取参数
				Commonjs.ajaxTrue(weburl,params,expireResumeSuccess,true,"正在恢复中...");
 	       	}
 	 	},{
 	 		name: '取消'
 	 	}]
 	});
}

function expireResumeSuccess(data){
	if(data.data==null)
		return false;

	var result=data.data;
	if(result.code=="0"){
		if(result.failIds!="")
			Commonjs.alert("实例："+result.failIds+",恢复失败。");
		else
			$.tooltip("操作成功", 2000, true);
	}else if(result.code=="-1"){
		$.tooltip("操作失败", 2000, false);
	}
	queryUserServiceList();
}

//批量暂停使用
function batchPausedInstance(){
	var instanceIds = "";
	$("input[name='chkBox']:checked").each(function(){
		instanceIds += $(this).attr("iId")+',';
	});

	if(!instanceIds){
		$.tooltip("请先勾选要操作的主机",1000,true);
		return;
	}
	instanceIds = instanceIds.substring(0,instanceIds.length-1);
	pausedInstance(instanceIds);
}

//暂停使用
function pausedInstance(instanceIds){
	art.dialog({
 		id: 'expire',
 	    width: '245px',
 	    height: '109px',
 	    content: '您确定要暂停当前服务器吗？',
 	    lock: true,
 	    button: [{
 	      	name: '确定',
 	       	callback: function () {
 	       	 	var service = {};
				service.instanceIds = instanceIds;
				var fn="pausedInstance";
				service = Commonjs.jsonToString(service);
				var params = Commonjs.getParams(fn,service);//获取参数
				Commonjs.ajaxTrue(weburl,params,pausedInstanceSuccess,true,"正在暂停中...");
 	       	}
 	 	},{
 	 		name: '取消'
 	 	}]
 	});
}

function pausedInstanceSuccess(data){
	if(data.data==null)
		return false;

	var result=data.data;
	if(result.code=="0"){
		if(result.failIds!="")
			Commonjs.alert("实例："+result.failIds+",暂停失败。");
		else
			$.tooltip("操作成功", 2000, true);
	}else if(result.code=="-1"){
		$.tooltip("操作失败", 2000, false);
	}
	queryUserServiceList();
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
  			queryUserServiceList();
  		}
  	});
}

function checkAllServer(checkall){
	if(checkall.checked){
		$("input[name='chkBox']").prop("checked",true);
		$("input[name='checkBoxAll']").prop("checked",true);

	}else{
		$("input[name='chkBox']").prop("checked",false);
		$("input[name='checkBoxAll']").prop("checked",false);
	}
}
