var hostId = request("hostId");
$(function(){
	 if(hostId=="")
	 {
		Commonjs.alerturl('服务器ID不能为空','service.html');
		return;
	 }
	 $("#hostId").text(hostId);
	 querServiceIP();
})

//地区查询
function querServiceIP(){
	var service = {};
	service.hostId=hostId
	service.page = 1;
	service.pagesize = 10;
	var fn="queryServiceIp";
	service = Commonjs.jsonToString(service)
	var params = Commonjs.getParams(fn,service);//获取参数
	Commonjs.ajaxTrue(weburl,params,querServiceIPSuccess);
};

function querServiceIPSuccess(data){
	if(data.data == null){
		return false;
	}
	$("#iplist").empty();
	var iplist="";
	if (data.data.length>0){
		BaseForeach(data.data,function(i,item){
			iplist+=' <tr><td>'+(i+1)+'</td>';
			iplist+=' <td>'+item.ip+'</td>';
			if(item.alone=="Y"){
				iplist+=' <td>独立</td>';
			}else if(item.alone=="N"){
				iplist+=' <td>共享</td>';
			}else{
				iplist+=' <td>未设置</td>';
			}
			if(item.state==1){
				iplist+=' <td>可用</td>';
			}else if(item.state==2){
				iplist+=' <td>已用</td>';
			}else{
				iplist+=' <td>未知</td>';
			}
			iplist+=' <td>'
			iplist+='<a  onclick="delServiceIP(\''+item.hostId+'\','+item.id+');" href="javascript:void(0);" class="btn btn-primary ">删除</a> '
			iplist+='</td></tr>';
		});
	}else{
			iplist+=' <tr><td colspan="8" style="height:50px;text-align:center;line-height:50px;">找不到相关信息</td></tr>';
	}
	$('#iplist').append(iplist);
}

//删除地区
function delServiceIP(hostId,id){
	 parent.art.dialog({
		 		id: 'testID',
		 	    width: '245px',
		 	    height: '109px',
		 	    content: '您要删除吗？注意：删除后数据将不能恢复',
		 	    lock: true,
		 	    button: [{
		 	      	name: '确定',
		 	       	callback: function () {
		 	       	 	var service = {};
						service.hostId = hostId;
						service.id = id;
						var fn="delServiceIp";
						service = Commonjs.jsonToString(service);
						var params = Commonjs.getParams(fn,service);//获取参数
						Commonjs.ajaxTrue(weburl,params,delServiceIPSuccess,false);
		 	       	}
		 	 	},{
		 	 		name: '取消'
		 	 	}]
		 	});
}

function delServiceIPSuccess(data){
	topSuccess(window, data.msg);
	querServiceIP();
}

//删除地区
function delServiceIPAll(){
	var hostId = $("#hostId").text();
	 parent.art.dialog({
 		id: 'testID',
 	    width: '245px',
 	    height: '109px',
 	    content: '您要删除吗？注意：删除后数据将不能恢复',
 	    lock: true,
 	    button: [{
 	      	name: '确定',
 	       	callback: function () {
 	       	 	var service = {};
				service.hostId = hostId;
				var fn="delServiceIpAll";
				service = Commonjs.jsonToString(service);
				var params = Commonjs.getParams(fn,service);//获取参数
				Commonjs.ajaxTrue(weburl,params,delAllSuccess,false);
 	       	}
 	 	},{
 	 		name: '取消'
 	 	}]
 	});
}

function delAllSuccess(data){
	topSuccess(window, data.msg);
	querServiceIP();
}

//新增服务器
function addServiceIP(){
	$('#ipfrom')[0].reset();
	var contents=$('#addBox').get(0);
	parent.art.dialog({
		lock: true,
		artIcon:'add',
		opacity:0.4,
		width: 600,
		padding:'0px 0px',
		title:'添加IP',
		header:false,
		content: contents,
		ok: function () {
			var minIp = $(parent.document).find('#minIp');
			if(Commonjs.isEmpty(minIp.val())){
				topError(window, 'IP起点不能为空');
				minIp.focus();
				return false;
			}
			if(!CndnsValidate.checkIp(minIp.val())){
				topError(window, 'IP起点只能输入IP格式');
				minIp.focus();
				return false;
			}
			var maxIp = $(parent.document).find('#maxIp');
			if(Commonjs.isEmpty(maxIp.val())){
				topError(window, '最大IP不能为空');
				maxIp.focus();
				return false;
			}
			var mask = $(parent.document).find('#mask');
			if(Commonjs.isEmpty(mask.val())){
				topError(window, '子网掩码不能为空');
				mask.focus();
				return false;
			}
			if(!CndnsValidate.checkIp(mask.val())){
				topError(window, '子网掩码只能输入IP格式');
				mask.focus();
				return false;
			}
			var gateway = $(parent.document).find('#gateway');
			if(Commonjs.isEmpty(gateway.val())){
				topError(window, '网关不能为空');
				gateway.focus();
				return false;
			}
			if(!CndnsValidate.checkIp(gateway.val())){
				topError(window, '网关只能输入IP格式');
				gateway.focus();
				return false;
			}
			var dns1 = $(parent.document).find('#dns1');
			if(Commonjs.isEmpty(dns1.val())){
				topError(window, '主DNS不能为空');
				dns1.focus();
				return false;
			}
			if(!CndnsValidate.checkIp(dns1.val())){
				topError(window, '主DNS只能为IP格式');
				dns1.focus();
				return false;
			}
			var dns2 = $(parent.document).find('#dns2');
			if(Commonjs.isEmpty(dns2.val())){
				topError(window, '辅DNS不能为空');
				dns2.focus();
				return false;
			}
			if(!CndnsValidate.checkIp(dns2.val())){
				topError(window, '辅DNS只能为IP格式');
				dns2.focus();
				return false;
			}
			var service = {};
			service.hostId = hostId;
			service.minIp = minIp.val();
			service.maxIp = maxIp.val();
			service.mask = mask.val();
			service.gateway = gateway.val();
			service.dns1 = dns1.val();
			service.dns2 = dns2.val();
			service.alone = $(parent.document).find('#alone').val();
			var fn="addServiceIp";
			service = Commonjs.jsonToString(service);
			var params = Commonjs.getParams(fn,service);//获取参数
			Commonjs.ajaxTrue(weburl,params,addServiceIPSuccess,false);
		},
		cancel: function(){
			$('#addBox').hide();
		}
	});
}

function addServiceIPSuccess(data){
		topSuccess(window, data.msg);
		querServiceIP();
}

/**
 * window history back.
 */
function backLast() {
	window.history.back();
}

//-----------------------------------以上为完成部分------------------------------
