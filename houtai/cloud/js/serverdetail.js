var instanceId=request("iId");
var hostType=request("hostType");
var publicIP;
var startTime;
var endTime;

$(function(){
	var end = {
		elem: '#endTime',
		istime: true,
		istoday: false,
	};
	laydate(end);
	queryUserService(instanceId);

	$("#instanceDetail").attr("href","serverdetail.html?iId="+instanceId+'&hostType='+hostType);
	$("#instanceDisk").attr("href","serverdisk.html?iId="+instanceId+'&hostType='+hostType);
	$("#instanceSnapshot").attr("href","serversnapshot.html?iId="+instanceId+'&hostType='+hostType);
    if (hostType != configParam.cloudType.huawei) {
        $('li[value="snapshot"]').css('display', '');
    }
	$("#instanceId").html(instanceId);
});

function queryUserService(instanceId){
	var service = {};
	service.instanceId=instanceId
	var fn="queryUserService";
	service = Commonjs.jsonToString(service)
	var params = Commonjs.getParams(fn,service);//获取参数
	Commonjs.ajaxTrue(weburl,params,querySuccess);
}

function querySuccess(data){
	if(data.data==null)
		return false;

	var html='';
	var infoHtml='';
	var view=data.data.view;
	var info=data.data.info;
	if(view!=null && info!=null){
		html+='<tr><td width="10%" align="right"><span>实例ID：</span></td>';
		html+='<td width="40%">'+info.instanceId+'</td>';
		html+='<td width="10%" align="right"><span>实例名：</span></td>';
		html+='<td width="40%">'+info.instanceName+'</td>';
		html+='</tr><tr>';
		html+='<td align="right"><span>开通时间：</span></td>';
		html+='<td>'+jsonDateTimeFormat(view.startTime)+'</td>';
		html+='<td align="right"><span>到期时间：</span></td>';
		html+='<td>'+jsonDateTimeFormat(view.endTime)+'</td>';
		html+='</tr><tr>';
		html+='<td align="right"><span>所在地域：</span></td>';
		html+='<td>'+view.regionName+'</td>';
		html+='<td align="right"><span>产品状态：</span></td>';
		html+='<td>'+view.statusName+'</td>';
		html+='</tr>';
		$("#view").html(html);

		html='';
		html+='<tr><td width="10%" align="right"><span>公网IP：</span></td>';
		html+='<td width="40%">'+info.publicIP+'</td>';
		html+='<td width="10%" align="right"><span>内网IP：</span></td>';
		html+='<td width="40%">'+info.privateIP+'</td>';
		html+='</tr><tr>';
		html+='<td align="right"><span>CPU：</span></td>';
		html+='<td>'+info.cpu+'核</td>';
		html+='<td align="right"><span>内存：</span></td>';
		html+='<td>'+info.memory+'G</td>';
		html+='</tr><tr>';
		html+='<td align="right"><span>操作系统：</span></td>';
		html+='<td>'+info.osVersion+'</td>';
		html+='<td align="right"><span>带宽：</span></td>';
		html+='<td>'+info.bandwidth+'Mbps</td>';
		html+='</tr>';
		$("#info").html(html);

		publicIP=info.publicIP;
		startTime=jsonDateFormat(view.startTime);
		endTime=jsonDateFormat(view.endTime);
		$("#hostType").val(view.hostType);
		$("#instanceId").val(view.instanceId);
	}
}

//获取浮动IP
function GetFloatingIP(){
	$('#iplist').html("<option value=\"\">加载IP中......</option>");
	var service = {};
	service.instanceId = instanceId;
	var fn="GetFloatingIP";
	service = Commonjs.jsonToString(service);
	var params = Commonjs.getParams(fn,service);
	Commonjs.ajaxTrue(weburl,params,getSuccess,true);
}

function getSuccess(data){
	var iplist=data.data;
	var html='';
	if(iplist!=""){
		var ips= new Array();
		ips=iplist.split("|");
		for (i=0;i<ips.length;i++){
			html+='<option value="'+ips[i]+'">'+ips[i]+'</option>';
		}
	}else{
		html+='<option value="">没有可用的IP</option>';
	}
	$('#iplist').html(html);
}

//绑定公网IP
function BindingFloatingIP(){
	GetFloatingIP();
	$('#ipfrom')[0].reset();
	var contents=$('#addBox').get(0);
	var artBox=art.dialog({
		lock: true,
		artIcon:'add',
		opacity:0.4,
		width: 400,
		padding:'0px 0px',
		title:'绑定公网IP',
		header:false,
		content: contents,
		ok: function () {
			if(!Commonjs.isEmpty(publicIP)){
				$.tooltip('当前主机已绑定公网IP，若要换请先移除',2000,false);
				return false;
			}

			var service = {};
			service.instanceId = instanceId;
			service.floatingIP = $("#iplist").val();
			var fn="BindingFloatingIP";
			service = Commonjs.jsonToString(service);
			var params = Commonjs.getParams(fn,service);
			Commonjs.ajaxTrue(weburl,params,BindingSuccess,true,"正在绑定中...");
		},cancel: function(){
			$('#addBox').hide();
		}
	});
}

function BindingSuccess(data){
	$.tooltip(data.msg,2000,true);
	queryUserService(instanceId);
}

//移除公网IP
function RemoveFloatingIP(){
	var dialog=	art.dialog({
		lock : true,
		opacity : 0.4,
		width : 250,
		title : '提示',
		content : '您确定移除公网IP吗？',
		ok : function() {
			if(Commonjs.isEmpty(publicIP)){
				$.tooltip('当前主机未分配公网IP，无法移除',2000,false);
				return false;
			}

       	 	var service = {};
       	 	service.instanceId = instanceId;
       	 	service.floatingIP = publicIP;
			var fn="RemoveFloatingIP";
			service = Commonjs.jsonToString(service);
			var params = Commonjs.getParams(fn,service);//获取参数
			Commonjs.ajaxTrue(weburl,params,removeSuccess,true,"正在移除中...");
		},cancel: function(){
			$('#dialog').hide();
		}
	});
}

function removeSuccess(data){
	$.tooltip(data.msg,2000,true);
	queryUserService(instanceId);
}

//编辑云主机
function EditUserService(){
	$('#edit')[0].reset();
	$("#endTime").val(endTime);
	var contents=$('#editBox').get(0);
	var artBox=art.dialog({
		lock: true,
		artIcon:'add',
		opacity:0.4,
		width: 450,
		padding:'0px 0px',
		title:'编辑',
		header:false,
		content: contents,
		ok: function () {
			var endTime=$("#endTime").val();
			var remark=$("#remark").val();
			if(Commonjs.isEmpty(endTime)){
				$.tooltip('请输入到期时间',2000,false);
				return false;
			}
			if(Commonjs.isEmpty(remark)){
				$.tooltip('请输入备注',2000,false);
				return false;
			}

			var beginDate =  new Date(startTime.replace(/^(\d{4})(\d{2})(\d{2})$/,"$1/$2/$3"));
			var endDate = new Date(endTime.replace(/^(\d{4})(\d{2})(\d{2})$/,"$1/$2/$3"));
			if(beginDate >= endDate){
				$.tooltip('到期时间必须大于开通时间',2000,false);
				return false;
			}

			var service = {};
			service.instanceId = instanceId;
			service.endTime = endTime;
			service.remark = remark;
			var fn="uptUserService";
			service = Commonjs.jsonToString(service);
			var params = Commonjs.getParams(fn,service);
			Commonjs.ajaxTrue(weburl,params,EditSuccess,true,"正在保存中...");
		},cancel: function(){
			$('#addBox').hide();
		}
	});
}

function EditSuccess(data){
	$.tooltip(data.msg,2000,true);
	queryUserService(instanceId);
}

function backService() {
	window.location.href = "server.html";
}
