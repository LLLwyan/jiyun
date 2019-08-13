var inHostType = ServletUtils.get("hostType");
var notInHostType = ServletUtils.get("noHostType");
var notInHostTypeArr = notInHostType ? notInHostType.split(",") : [];

$(function(){
	queryhosttype();
	queryZoneList();
});

function queryhosttype(){
	var service = {};
	service.paramEName = "hostType";
	var fn="getListParamItemByEName";
	service = Commonjs.jsonToString(service);
	var params = Commonjs.getParams(fn,service);//获取参数
	var data=Commonjs.ajax(sysurl,params,false);
	if(data.result == "success"){
		var html='';
		if (data.data.length>0){
			BaseForeach(data.data,function(i,item){
				if (inHostType) {
					if (inHostType == item.value) {
						html+='<option value="'+item.value+'">'+item.description+'</option>';
                    }
                } else {
                    if ($.inArray(item.value, notInHostTypeArr) < 0) {
                        html += '<option value="' + item.value + '">' + item.description + '</option>';
                    }
				}
			});
		}
		$('#hosttype2').html(html);
		$('#hosttypelist').html((inHostType ? '' : '<option value="">所有</option>') + html);
		queryRegionList();
	}
};

//获取地域
function queryRegionList(){
	var service = {};
	service.hostType = $("#hosttype2").val();
	var fn="queryHostlist";
	service = Commonjs.jsonToString(service);
	var params = Commonjs.getParams(fn,service);
	var data=Commonjs.ajax(weburl,params,false);
	if(data.result == "success"){
		var html='';
		if (data.data.length>0){
			BaseForeach(data.data,function(i,item){
				html+='<option value="'+item.regionId+'">'+item.regionName+'</option>';
			});
		}
		$('#regionlist').html(html);
	}
}

//查询可用区
function queryZoneList(){
	var hosttype = $("#hosttypelist").val();
	if(hosttype==null)
		hosttype="";
	var index = $("#pagenumber").val();
	var service = {};
	service.hostType=hosttype
	service.page = index;
	service.pagesize = 10;
	service.notInHostType = notInHostType;
	var fn="queryDicZonePage";
	service = Commonjs.jsonToString(service)
	var params = Commonjs.getParams(fn,service);//获取参数
	Commonjs.ajaxTrue(weburl,params,queryZoneSuccess);
};

function queryZoneSuccess(data){
	if(data.data == null){
		return false;
	}
	var html="";
	if (data.data.length>0){
		BaseForeach(data.data,function(i,item){
			html+='<tr><td>'+(i+1)+'</td>';
			html+='<td>'+item.hostTypeName+'</td>';
			html+='<td>'+item.regionName+'</td>';
			html+='<td><input type="text" class="manager-input m-input width100" style="width:100px;" id="name'+item.id+'" value='+item.zoneName+'></td>';
			html+='<td>'+item.zoneId+'</td>';
			html+='<td><a onclick="delZone(\''+item.zoneId+'\',\''+item.hostType+'\');" href="javascript:void(0);" class="btn btn-primary ">删除</a>';
			html+='<a onclick="uptZoneName(\''+item.id+'\');" href="javascript:void(0);" class="btn btn-primary ">修改</a>';
			if(item.hostType=="osc")  {
				html+='<a href="zoneinterface.html?hostType='+item.hostType+'&zoneId='+item.zoneId+'" class="btn btn-primary ">接口设置</a>';
            }
            if (item.hostType == "hyperv") {
				html+='<a href="zonehost.html?hostType=' + item.hostType + '&zoneId=' + item.zoneId + '" class="btn btn-primary ">服务器设置</a>';
			}
			html+='</td></tr>';
		});
	}else{
		$("#page").hide();
		html+='<tr><td colspan="6" style="height:50px;text-align:center;line-height:50px;">找不到相关信息</td></tr>';
	}
	$('#zonelist').html(html);
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
function delZone(zoneId,hostType){
	parent.art.dialog({
		lock : true,
		opacity : 0.4,
		width : 250,
		title : '提示',
		content : '您确定删除吗？',
		ok : function() {
       	 	var service = {};
			service.zoneId = zoneId;
			service.hostType = hostType;
			var fn="delDicZone";
			service = Commonjs.jsonToString(service);
			var params = Commonjs.getParams(fn,service);//获取参数
			Commonjs.ajaxTrue(weburl,params,delZoneSuccess,false);
		},cancel: function(){
			$('#dialog').hide();
		}
	});
}

function delZoneSuccess(data){
	topSuccess(window, data.msg);
	queryZoneList();
}

//新增可用区
function addZone(){
	queryRegionList();
	$('#zonefrom')[0].reset();
	var contents=$('#addBox').get(0);
	parent.art.dialog({
		lock: true,
		artIcon:'add',
		opacity:0.4,
		width: 400,
		padding:'0px 0px',
		title:'添加可用区',
		header:false,
		content: contents,
		ok: function () {
			var zoneId=$(parent.document).find("#zoneId");
			var zoneName=$(parent.document).find("#zoneName");
			var regionId=$(parent.document).find("#regionlist");
			if(Commonjs.isEmpty(regionId.val())){
				$.tooltip('地域不能为空',2000,false);
				zoneId.focus();
				return false;
			}
			if(Commonjs.isEmpty(zoneId.val())){
				$.tooltip('可用区代码不能为空',2000,false);
				zoneId.focus();
				return false;
			}
			if(Commonjs.isEmpty(zoneName.val())){
				$.tooltip('可用区名称不能为空',2000,false);
				zoneName.focus();
				return false;
			}
			var service = {};
			service.hostType = $(parent.document).find('#hosttype2').val();
			service.regionId = regionId.val();
			service.zoneId=zoneId.val();
			service.zoneName=zoneName.val();
			var fn="addDicZone";
			service = Commonjs.jsonToString(service);
			var params = Commonjs.getParams(fn,service);
			Commonjs.ajaxTrue(weburl,params,addZoneSuccess,false);
		},cancel: function(){
			$('#addBox').hide();
		}
	});
}

function addZoneSuccess(data){
	topSuccess(window, data.msg);
	queryZoneList();
}

function Page(totalcounts,pagecount,pager) {
  	$("#"+pager).pager( {
  		totalcounts : totalcounts,
  		pagesize : 10,
  		pagenumber : $("#pagenumber").val(),
  		pagecount : parseInt(totalcounts/pagecount)+(totalcounts%pagecount >0?1:0),
  		buttonClickCallback : function(al) {
  			$("#pagenumber").val(al);
  			queryZoneList();
  		}
  	});
}

function uptZoneName(id){
	if(Commonjs.isEmpty($("#name"+id).val())){
		topError(window, '可用区名称不能为空');
		$("#name"+id).focus();
		return false;
	}
	var service = {};
	service.zoneName = $("#name"+id).val();
	service.id = id;
	var fn="uptZoneName";
	service = Commonjs.jsonToString(service)
	var params = Commonjs.getParams(fn,service);//获取参数
	Commonjs.ajaxTrue(weburl,params,uptZoneNameSuccess,false);
}

function uptZoneNameSuccess(data){
	topSuccess(window, data.msg);
	queryZoneList();
}
