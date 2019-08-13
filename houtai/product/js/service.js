var inHostType = ServletUtils.get("hostType");
var notInHostType = ServletUtils.get("noHostType");
var notInHostTypeArr = notInHostType ? notInHostType.split(",") : [];

$(function(){
	queryhosttype();
	querService();
	if (inHostType == "vhost") {
		$('#vhostBindDomain').css('display', '');
		$('#vhostBindDomainAdd').css('display', '');
	}
});

//服务器查询
function querService(){
	var hosttype = $("#hosttype").val();
	var index = $("#pagenumber").val();
	var service = {};
	service.hostType=hosttype;
	service.notInHostType=notInHostType;
	service.page = index;
	service.pagesize = 10;
	var fn="queryService";
	service = Commonjs.jsonToString(service)
	var params = Commonjs.getParams(fn,service);//获取参数
	Commonjs.ajaxTrue(weburl,params,querServiceSuccess);
};

function querServiceSuccess(data){
	if(data.data == null){
		return false;
	}
	$("#servicelist").empty();
	var servicelist="";
	if (data.data.length>0){
		BaseForeach(data.data,function(i,item){
			servicelist+=' <tr><td>'+(i+1)+'</td>';
			servicelist+=' <td>'+item.hostTypeName+'</td>';
			servicelist+=' <td>'+item.regionName+'</td>';
			servicelist+=' <td>'+item.hostId+'</td>';
			servicelist+=' <td>'+item.hostName+'</td>';
			servicelist+=' <td>'+item.comIP+'</td>';
			servicelist+=' <td>'+item.listId+'</td>';
			servicelist+=' <td>';
			if (inHostType == 'hyperv' || inHostType == 'vhost') {
                servicelist+='<a  href="ipset.html?hostId='+item.hostId+'" class="btn btn-primary ">可用IP设置</a> ';
			}
			servicelist+='<a  href="javascript:void(0);" class="btn btn-primary" onclick="modService(\''+
				item.hostId+'\',\''+item.hostType+'\',\''+item.regionId+'\',\''+item.hostName+'\',\''+item.comIP
				+'\',\''+item.comPort+'\',\''+item.comUserName+'\',\''+item.comPassWord+'\',\''+item.extranetIP
				+'\','+item.listId+',\''+item.description+'\',\'' + item.bindDomain + '\');">修改</a> ';
			servicelist+='<a  onclick="delService(\''+item.hostId+'\','+item.id+');" href="javascript:void(0);" class="btn btn-primary ">删除</a> ';
			servicelist+='</td></tr>';
		});
		$("#pages").show();
	}else{
		servicelist+=' <tr><td colspan="8" style="height:50px;text-align:center;line-height:50px;">找不到相关信息</td></tr>';
		$("#pages").hide();
	}
	$('#servicelist').append(servicelist);
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

//删除地区
function delService(hostId,ID){
	parent.art.dialog({
		lock : true,
		opacity : 0.4,
		width : 250,
		title : '提示',
		content : '您确定删除吗？',
		ok : function() {
       	 	var service = {};
			service.hostId = hostId;
			service.id = ID;
			var fn="delService";
			service = Commonjs.jsonToString(service);
			var params = Commonjs.getParams(fn,service);//获取参数
			parent.Commonjs.ajaxTrue(weburl,params,delServiceSuccess,false);
		},cancel: function(){
			$('#dialog').hide();
		}
	});
}

function delServiceSuccess(data){
	topSuccess(window, data.msg);
	querService();
}

//新增服务器
function addService(){
	queryRegion("2");
	$('#servicefrom')[0].reset();
	var contents=$('#addBox').get(0);
	parent.art.dialog({
		lock: true,
		artIcon:'add',
		opacity:0.4,
		width: 600,
		padding:'0px 0px',
		title:'添加服务器',
		header:false,
		content: contents,
		ok: function () {
			var hostId = $(parent.document).find('#hostId2');
			if(Commonjs.isEmpty(hostId.val())){
				topError(window, '服务器编号不能为空');
				hostId.focus();
				return false;
			}
			if(CndnsValidate.checkChinese(hostId.val())){
				topError(window, '服务器编号不能有中文');
				hostId.focus();
				return false;
			}
			var hostName = $(parent.document).find('#hostName2');
			if(Commonjs.isEmpty(hostName.val())){
				topError(window, '服务器名称不能为空');
				hostName.focus();
				return false;
			}
			if(CndnsValidate.checkChinese(hostName.val())){
				topError(window, '服务器名称不能有中文');
				hostName.focus();
				return false;
			}
			var comIP = $(parent.document).find('#comIP2');
			if(Commonjs.isEmpty(comIP.val())){
				topError(window, '通讯IP不能为空');
				comIP.focus();
				return false;
			}
			if(!CndnsValidate.checkIp(comIP.val())){
				topError(window, '通讯IP只能输入IP格式');
				comIP.focus();
				return false;
			}
			var comPort = $(parent.document).find('#comPort2');
			if(Commonjs.isEmpty(comPort.val())){
				topError(window, '通讯端口不能为空');
				comPort.focus();
				return false;
			}
			if(!CndnsValidate.checkNumber(comPort.val())){
				topError(window, '通讯端口只能输入数字');
				comPort.focus();
				return false;
			}
			var comUserName = $(parent.document).find('#comUserName2');
			if(Commonjs.isEmpty(comUserName.val())){
				topError(window, '通讯用户名不能为空');
				comUserName.focus();
				return false;
			}
			var comPassWord = $(parent.document).find('#comPassWord2');
			if(Commonjs.isEmpty(comPassWord.val())){
				topError(window, '通讯密码不能为空');
				comPassWord.focus();
				return false;
			}
			if(!CndnsValidate.checkNumberAndLetter(comPassWord.val())){
				topError(window, '通讯密码只能为数字与英文');
				comPassWord.focus();
				return false;
			}
			var extranetIP = $(parent.document).find('#extranetIP2');
			if(Commonjs.isEmpty(extranetIP.val())){
                topError(window, '外网IP不能为空');
				extranetIP.focus();
				return false;
			}
			if(!CndnsValidate.checkIp(extranetIP.val())){
				topError(window, '外网IP只能输入IP格式');
				extranetIP.focus();
				return false;
			}
			if (inHostType == "vhost") {
				if ($(parent.document).find('#bindDomainAdd').val() == '') {
					topError(window, '开通Web默认域名不能为空');
					$(parent.document).find('#bindDomainAdd').focus();
					return false;
				}
			}
			var service = {};
			service.hostType = $(parent.document).find('#hosttype2').val();
			service.regionId = $(parent.document).find('#regionId2').val();
			service.hostId = hostId.val();
			service.hostName = hostName.val();
			service.comIP = comIP.val();
			service.comPort = comPort.val();
			service.comUserName = cloudEncrypt.encodeSession(comUserName.val());
			service.comPassWord = cloudEncrypt.encodeSession(comPassWord.val());
			service.extranetIP = extranetIP.val();
			service.description = $(parent.document).find('#description2').val();
			service.bindDomain = $(parent.document).find('#bindDomainAdd').val();
			var fn="addService";
			service = Commonjs.jsonToString(service);
			var params = Commonjs.getParams(fn,service);//获取参数
			parent.Commonjs.ajaxTrue(weburl,params,addServiceSuccess,false);
		},cancel: function(){
			$('#addBox').hide();
		}
	});
}

function addServiceSuccess(data){
	topSuccess(window, data.msg,2000,true);
	querService();
}

//修改服务器
function modService(hostId,hostType,regionId,hostName,comIP,comPort,comUserName,comPassWord,extranetIP,listId,description,bindDomain){
	queryRegion("3");
	$('#hostId').val(hostId);
    queryRegion("3", function () {
        $('#hostName').val(hostName);
    });
	$('#hosttype3').val(hostType);
	$('#regionId3').val(regionId);
	$('#comIP').val(comIP);
	$('#comPort').val(comPort);
	$('#comUserName').val(cloudEncrypt.decodeSession(comUserName));
	$('#comPassWord').val(cloudEncrypt.decodeSession(comPassWord));
	$('#extranetIP').val(extranetIP);
	$('#listId').val(listId);
	$('#description').val(description);
	$('#bindDomain').val(bindDomain);
	var contents=$('#modBox').get(0);
	parent.art.dialog({
		lock: true,
		artIcon:'add',
		opacity:0.4,
		width: 600,
		padding:'0px 0px',
		title:'修改服务器信息',
		header:false,
		content: contents,
		ok: function () {
			var hostName = $(parent.document).find('#hostName');
			if(Commonjs.isEmpty(hostName.val())){
				topError(window, '服务器名称不能为空');
				hostName.focus();
				return false;
			}
			if(CndnsValidate.checkChinese(hostName.val())){
				topError(window, '服务器名称不能有中文');
				hostName.focus();
				return false;
			}
			var comIP = $(parent.document).find('#comIP');
			if(Commonjs.isEmpty(comIP.val())){
				topError(window, '通讯IP不能为空');
				comIP.focus();
				return false;
			}
			if(!CndnsValidate.checkIp(comIP.val())){
				topError(window, '通讯IP只能输入IP格式');
				comIP.focus();
				return false;
			}

			var comPort = $(parent.document).find('#comPort');
			if(Commonjs.isEmpty(comPort.val())){
				topError(window, '通讯端口不能为空');
				comPort.focus();
				return false;
			}
			if(!CndnsValidate.checkNumber(comPort.val())){
				topError(window, '通讯端口只能输入数字');
				comPort.focus();
				return false;
			}
			var comUserName = $(parent.document).find('#comUserName');
			if(Commonjs.isEmpty(comUserName.val())){
				topError(window, '通讯用户名不能为空');
				comUserName.focus();
				return false;
			}
			var comPassWord = $(parent.document).find('#comPassWord');
			if(Commonjs.isEmpty(comPassWord.val())){
				topError(window, '通讯密码不能为空');
				comPassWord.focus();
				return false;
			}
			if(!CndnsValidate.checkNumberAndLetter(comPassWord.val())){
				topError(window, '通讯密码只能为数字与英文');
				comPassWord.focus();
				return false;
			}
			var extranetIP = $(parent.document).find('#extranetIP');
			if(Commonjs.isEmpty(extranetIP.val())){
				topError(window, '外网IP不能为空');
				extranetIP.focus();
				return false;
			}
			if(!CndnsValidate.checkIp(extranetIP.val())){
				topError(window, '外网IP只能输入IP格式');
				extranetIP.focus();
				return false;
			}
			var listId = $(parent.document).find('#listId');
			if(Commonjs.isEmpty(listId.val())){
				topError(window, '排序不能为空');
				listId.focus();
				return false;
			}
			if(!CndnsValidate.checkNumber(listId.val())){
				topError(window, '排序只能为数字');
				listId.focus();
				return false;
			}
            if (inHostType == "vhost") {
                if ($(parent.document).find('#bindDomain').val() == '') {
                    topError(window, '开通Web默认域名不能为空');
                    $('#bindDomain').focus();
                    return false;
				}
            }

			var service = {};
			service.hostType = $(parent.document).find('#hosttype3').val();
			service.regionId = $(parent.document).find('#regionId3').val();
			service.hostId = hostId;
			service.hostName = hostName.val();
			service.comIP = comIP.val();
			service.comPort = comPort.val();
			service.comUserName = cloudEncrypt.encodeSession(comUserName.val());
			service.comPassWord = cloudEncrypt.encodeSession(comPassWord.val());
			service.extranetIP = extranetIP.val();
			service.listId = listId.val();
			service.description = $(parent.document).find('#description').val();
            service.bindDomain = $(parent.document).find('#bindDomain').val();
			var fn="uptService";
			service = Commonjs.jsonToString(service);
			var params = Commonjs.getParams(fn,service);//获取参数
			parent.Commonjs.ajaxTrue(weburl,params,modServiceSuccess,false);
		},
		cancel: function(){
			$('#addBox').hide();
		}
	});
}

function modServiceSuccess(data){
	topSuccess(window, data.msg);
	querService();
}

//获取地域 (公共方法,后期需调整)
function queryRegion(i, func){
	var hosttype = $("#hosttype"+i).val();
	var service = {};
	service.hostType = hosttype;
	var fn="queryHostlist";
	service = Commonjs.jsonToString(service);
	var params = Commonjs.getParams(fn,service);//获取参数
	var data=Commonjs.ajax(weburl,params,false);
	if(data.result == "success"){
		$("#regionId"+i).empty();
		var userlist='';
		if (data.data.length>0){
			BaseForeach(data.data,function(i,item){
				userlist+='<option value="'+item.regionId+'">'+item.regionName+'</option>';
			});
		}else{
			userlist='<option value="">未设置地区</option>';
		}
		$('#regionId'+i).append(userlist);
		if (func && $.isFunction(func)) {
			func();
		}
	}
};


//获取上级 (公共方法,后期需调整)
function queryhosttype(){
	var service = {};
	service.paramEName = "hostType";
	var fn="getListParamItemByEName";
	service = Commonjs.jsonToString(service);
	var params = Commonjs.getParams(fn,service);//获取参数
	var data=Commonjs.ajax(sysurl,params,false);
	if(data.result == "success"){
		$("#hosttype").empty();
		$("#hosttype2").empty();
		$("#hosttype3").empty();
		var userlist=inHostType ? '' : '<option value="">所有</option>';
		var userlist2='';
		if (data.data.length>0){
			BaseForeach(data.data,function(i,item){
				if (inHostType) {
					if (inHostType == item.value) {
                        userlist+='<option value="'+item.value+'">'+item.description+'</option>';
                        userlist2+='<option value="'+item.value+'">'+item.description+'</option>';
					}
				} else {
                    if ($.inArray(item.value, notInHostTypeArr) < 0) {
                        userlist += '<option value="' + item.value + '">' + item.description + '</option>';
                        userlist2 += '<option value="' + item.value + '">' + item.description + '</option>';
                    }
				}
			});
		}
		$('#hosttype2').append(userlist2);
		$('#hosttype3').append(userlist2);
		$('#hosttype').append(userlist);
	}
};

//分页
function Page(totalcounts,pagecount,pager) {
	  	$("#"+pager).pager( {
	  		totalcounts : totalcounts,
	  		pagesize : 10,
	  		pagenumber : $("#pagenumber").val(),
	  		pagecount : parseInt(totalcounts/pagecount)+(totalcounts%pagecount >0?1:0),
	  		buttonClickCallback : function(al) {
	  			$("#pagenumber").val(al);
	  			querService();
	  		}
	  	});

}
//-----------------------------------以上为完成部分------------------------------
