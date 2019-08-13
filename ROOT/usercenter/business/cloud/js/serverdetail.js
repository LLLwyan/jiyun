var instanceId;
var regType;
var hostType;
$(function(){
	instanceId=request("iId");
	hostType=request("hostType");
	queryUserService(instanceId);

	$("#instanceDetail").attr("href","serverdetail.html?iId="+instanceId + '&hostType=' + hostType);
	$("#instanceDisk").attr("href","serverdisk.html?iId="+instanceId + '&hostType=' + hostType);
	$("#instanceSnapshot").attr("href","serversnapshot.html?iId="+instanceId + '&hostType=' + hostType);
	$("#instanceResource").attr("href","serverresource.html?iId="+instanceId + '&hostType=' + hostType);
    if (configParam.cloudType.huawei != hostType) {
        $('li[tag="nopayorders"]').css('display', '');
    }
	$("#instanceId").html(instanceId);
	$('#btnBackList').on('click', function() {
		window.location.href = "server.html?regType=" + regType + '&hostType=' + hostType;
	});
});

$("body").click(function(e){
	if($(e.target).parents(".autosuo").length==0){
		$(".edit-ul").hide();
	}
});

function menuClick(){
	for(var i = 0;i < $(".edit-ul").length; i++){
		$(".edit-ul").eq(i).hide();
	}
	if($(".edit-ul").attr("flag") =="1"){
		$(".edit-ul").attr("flag",0);
	}else{
		$("#opt").siblings(".edit-ul").show();
		$(".edit-ul").attr("flag",1);
	}
}

function queryUserService(instanceId){
	var service = {};
	service.instanceId=instanceId
	var fn="queryUserService";
	service = Commonjs.jsonToString(service)
	var params = Commonjs.getParams(fn,service);//获取参数
	Commonjs.ajaxTrue(weburl,params,querySuccess);
}

function querySuccess(data){
	var html='';
	var infoHtml='';
	var view=data.data.view;
	var info=data.data.info;
	if(view!=null && info!=null){
		regType = view.hostType;
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
		html+='<td><img id="statusimg" src="../../../images/wait.gif"/>&nbsp;<span id="statusname" style="color:#F90">'+view.statusName+'</span></td>';
		html+='</tr>';
		$("#view").html(html);

		html='';
		if (view.hostType == configParam.cloudType.hyperV) {
            html += '<tr><td width="10%" align="right"><span>公网IP：</span></td>';
            html += '<td width="40%" colspan="3">' + info.publicIP + '</td>';
		} else {
            html += '<tr><td width="10%" align="right"><span>公网IP：</span></td>';
            html += '<td width="40%">' + info.publicIP + '</td>';
            html += '<td width="10%" align="right"><span>内网IP：</span></td>';
            html += '<td width="40%">' + info.privateIP + '</td>';
        }
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

		$("#hostType").val(view.hostType);
		$("#instanceId").val(info.instanceId);
		$("#rerenewInstanceName").html(info.instanceName);
		$("#resizeInstanceName").html(info.instanceName);
		$("#widthInstanceName").html(info.instanceName);
		getOptItem(view.status,view.instanceId);
		getHostStatus(view.status,view.hostType,view.instanceId,view.serviceId);
	}
}

function getOptItem(status,instanceId){
	var html='';
	if(status=="Paused" || status.toUpperCase() == "PAUSED" || status.toUpperCase() == "SUSPENDED"){
		html+='<li><a href="javascript:void(0)" class="edit-a-disable">开机</a></li>';
		html+='<li><a href="javascript:void(0)" class="edit-a-disable">关机</a></li>';
		html+='<li><a href="javascript:void(0)" class="edit-a-disable">重启</a></li>';
		html+='<li><a href="javascript:void(0)" class="edit-a-disable">续费</a></li>';
		html+='<li><a href="javascript:void(0)" class="edit-a-disable">升级配置</a></li>';
		html+='<li><a href="javascript:void(0)" class="edit-a-disable">升级带宽</a></li>';
		html+='<li><a href="javascript:void(0)" class="edit-a-disable">重装系统</a></li>';
        if (hostType == configParam.cloudType.openStack) {
            html += '<li><a href="javascript:void(0)" class="edit-a-disable">添加云盘</a></li>';
        }
	}
	else if(status=="Running" || status.toUpperCase() == "ACTIVE"){
		html+='<li><a href="javascript:void(0)" class="edit-a-disable">开机</a></li>';
		html+='<li><a href="javascript:void(0)" data-name="shutdown" onclick="optAction(this,\'关机\')">关机</a></li>';
		html+='<li><a href="javascript:void(0)" data-name="restart" onclick="optAction(this,\'重启\')">重启</a></li>';
	}else if(status=="Stopped" || status.toUpperCase() == 'SHUTOFF'){
		html+='<li><a href="javascript:void(0)" data-name="start" onclick="optAction(this,\'开机\')">开机</a></li>';
		html+='<li><a href="javascript:void(0)" class="edit-a-disable">关机</a></li>';
		html+='<li><a href="javascript:void(0)" class="edit-a-disable">重启</a></li>';
	}
	if(status=="Running" || status=="Stopped" || status.toUpperCase() == 'SHUTOFF' || status.toUpperCase() == 'ACTIVE'){
		html+='<li><a href="../cloud/renew.html?iId='+instanceId+'">续费</a></li>';
		html+='<li><a href="../cloud/resizeconfig.html?iId='+instanceId+'">升级配置</a></li>';
		html+='<li><a href="../cloud/resizenetwork.html?iId='+instanceId+'">升级带宽</a></li>';
		html+='<li><a href="../cloud/resetsystem.html?iId='+instanceId+'">重装系统</a></li>';
        if (hostType == configParam.cloudType.openStack) {
            html += '<li><a href="../cloud/addclouddisk.html?iId=' + instanceId + '">添加云盘</a></li>';
        }
        if (hostType == configParam.cloudType.hyperV) {
            html += '<li><a href="../cloud/vpsdomain.html?iId=' + instanceId + '">域名管理</a></li>';
            html += '<li><a href="../cloud/vpsportmap.html?iId=' + instanceId + '">端口映射</a></li>';
        }
	}
    if(status=="Error" || status.toUpperCase() == 'ERROR'){
        html+='<li><a href="javascript:void(0)" data-name="shutdown" iId="'+instanceId+'" hostType="'+hostType+'" onclick="optAction(this,\'关机\')">关机</a></li>';
    }
	if(status=="Expire"){
		html+='<li><a href="../cloud/renew.html?iId='+instanceId+'">续费</a></li>';
	}
	$("#optItem").html(html);

	$(".edit-ul li a").click(function(){
		$(".edit-ul").hide();
	})
}

function getHostStatus(status,hostType,instanceId,serviceId){
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
					var newStatus=result.data.status;
					$("#statusimg").hide();
					if(newStatus=="Running" || newStatus=="Stopped"){
						$("#btnResetpwd").attr("onclick","resetPwd()");
						$("#btnResetpwd").removeClass("disable");
					}

					//错误，暂停不能操作
					if(newStatus=="Error" || newStatus=="Paused"){
						$("#opt").removeAttr("onclick");
					}else{
						$("#opt").removeClass("disable");
						$("#opt").attr("onclick","menuClick()");
					}
					$("#optbtn").html(getOptItem(result.data.status,instanceId));
				}else if(result.data.code=="-1"){
					$("#btnResetpwd").addClass("disable");
					$("#opt").addClass("disable");
					getHostStatus(status,hostType,instanceId,serviceId);
				}

				$("#statusname").html(result.data.statusName);
				//颜色区分
				if(result.data.status=="Running")
					$("#statusname").css("color","#090");
			}
		}
	});
}

//操作动作
function optAction(obj,text){
	var dialog=	art.dialog({
		lock : true,
		opacity : 0.4,
		width : 250,
		title : '提示',
		content : '您确定'+text+'吗？',
		ok : function() {
			var name=$(obj).attr("data-name");
			if(name=="start")
				serverAction("startInstance");
			if(name=="restart")
				serverAction("rebootInstance");
			if(name=="shutdown")
				serverAction("stopInstance");
		},
		cancel: function(){
			$('#dialog').hide();
		}
	});
}

function serverAction(method){
	var service = {};
	service.instanceId = $("#instanceId").val();
	var fn=method;
	service = Commonjs.jsonToString(service);
	var params = Commonjs.getParams(fn,service);//获取参数
	Commonjs.ajaxTrue(weburl,params,serverActionSuccess,false);
	queryUserService($("#instanceId").val());
}

function serverActionSuccess(data){}

//重置密码
function resetPwd(){
	$("#uptPwdForm")[0].reset();
	refreshVcode();
	var contents=$('#detaliBoxa').get(0);
	var artBox=art.dialog({
		lock: true,
		artIcon:'add',
		opacity:0.4,
		width: 500,
		padding:'0px 0px',
		title:'重置密码',
		header:false,
		content: contents,
		ok: function (){
			var password=$("#password");
			var confirmPassword=$("#confirmPassword");
			var checkcode=$("#checkcode");
			var preg = /(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,30}/;
			if(Commonjs.isEmpty(password.val())){
				$.tooltip('登入密码不能为空',2000,false);
				return false;
			}
			if(Commonjs.isEmpty(confirmPassword.val())){
				$.tooltip('确认密码不能为空',2000,false);
				return false;
			}
			if(password.val() != confirmPassword.val()){
				$.tooltip('密码不一致',2000,false);
				return false;
			}
			if(!preg.test(password.val())){
				$.tooltip('密码复杂度不够',2000,false);
				return false;
			}
			var service = {};
			service.password = encodeURIComponent(password.val());
			service.confirmPassword = encodeURIComponent(confirmPassword.val());
			service.checkcode = checkcode.val();
			service.instanceIds = instanceId;
			var fn="uptPassWordUserService";
			service = Commonjs.jsonToString(service);
			var params = Commonjs.getParams(fn,service);
			Commonjs.ajaxTrue(weburl,params,resetPwdSuccess,true,"正在重置中...");
		},
		ca: function(){
		}
	});
}

function resetPwdSuccess(data){
	Commonjs.alert("重置密码成功，请稍等1-2分钟再尝试登录。");
}
