var notInHostType = ServletUtils.get("noHostType");
var notInHostTypeArr = notInHostType ? notInHostType.split(",") : [];
var hostType = ServletUtils.get("hostType");

$(function(){
	queryhosttype();
});

function queryhosttype(){
	var service = {};
	service.paramEName = "hostType";
	var fn="getListParamItemByEName";
	service = Commonjs.jsonToString(service);
	var params = Commonjs.getParams(fn,service);//获取参数
	Commonjs.ajaxTrue(sysurl,params,queryhosttypeSuccess);
};

function queryhosttypeSuccess(data){
	if(data.data == null){
		return false;
	}
	var html='';
	if (data.data.length>0){
		BaseForeach(data.data,function(i,item){
			if ($.inArray(item.value, notInHostTypeArr) < 0) {
                html += '<option value="' + item.value + '">' + item.description + '</option>';
            }
		});
	}
	$('#hosttype2').html(html);
	$('#hosttypelist').html('<option value="">所有</option>'+html);
	queryDiskList();
}

//查询磁盘类型列表
function queryDiskList(){
	var index = $("#pagenumber").val();
	var service = {};
	service.hostType=hostType;
	service.page = index;
	service.pagesize = 10;
	var fn="queryDicDiskPage";
	service = Commonjs.jsonToString(service)
	var params = Commonjs.getParams(fn,service);//获取参数
	Commonjs.ajaxTrue(weburl,params,queryDiskListSuccess);
};

function queryDiskListSuccess(data){
	if(data.data == null){
		return false;
	}
	var html="";
	if (data.data.length>0){
		BaseForeach(data.data,function(i,item){
			html+='<tr><td>'+(i+1)+'</td>';
			html+='<td>'+item.hostTypeName+'</td>';
			html+='<td>'+item.typeId+'</td>';
			html+='<td><input type="text" class="manager-input m-input width100" style="width:100px;" id="'+item.id+item.hostTypeName+'" value='+item.typeName+'></td>';
			html+='<td><input type="text" class="manager-input m-input width100" style="width:100px;" id="'+item.id+'_minSize" value='+item.minSize+'></td>';
			html+='<td><input type="text" class="manager-input m-input width100" style="width:100px;" id="'+item.id+'_maxSize" value='+item.maxSize+'></td>';
			html+='<td><a onclick="delDisk(\''+item.typeId+'\',\''+item.hostType+'\');" href="javascript:void(0);" class="btn btn-primary ">删除</a>';
			html+='<a onclick="uptDisk(\''+item.id+'\',\''+item.hostTypeName+'\',\'_minSize\',\'_maxSize\');" href="javascript:void(0);" class="btn btn-primary ">修改</a>'
			html+='</td></tr>';
		});
	}else{
		$("#page").hide();
		html+='<tr><td colspan="5" style="height:50px;text-align:center;line-height:50px;">找不到相关信息</td></tr>';
	}
	$('#disklist').html(html);
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

//删除磁盘类型
function delDisk(typeId, hostType){
	var dialog=	parent.art.dialog({
		lock : true,
		opacity : 0.4,
		width : 250,
		title : '提示',
		content : '您确定删除吗？',
		ok : function() {
       	 	var service = {};
			service.typeId = typeId;
			service.hostType = hostType;
			var fn="delDicDisk";
			service = Commonjs.jsonToString(service);
			var params = Commonjs.getParams(fn,service);//获取参数
			parent.Commonjs.ajaxTrue(weburl,params,delDiskSuccess,false);
		},cancel: function(){
			$('#dialog').hide();
		}
	});
}

function delDiskSuccess(data){
	topSuccess(window, data.msg);
	queryDiskList();
}

//新增磁盘类型
function addDisk(){
	$('#diskfrom')[0].reset();
	var contents=$('#addBox').get(0);
	parent.art.dialog({
		lock: true,
		artIcon:'add',
		opacity:0.4,
		width: 400,
		padding:'0px 0px',
		title:'添加磁盘类型',
		header:false,
		content: contents,
		ok: function () {
			var typeId=$(parent.document).find("#typeId");
			var typeName=$(parent.document).find("#typeName");
			var minSize=$(parent.document).find("#minSize");
			var maxSize=$(parent.document).find("#maxSize");
			if(Commonjs.isEmpty(typeId.val())){
				topError(window, '类型代码不能为空');
				typeId.focus();
				return false;
			}
			if(Commonjs.isEmpty(typeName.val())){
				topError(window, '类型名称不能为空');
				typeName.focus();
				return false;
			}
			if(Commonjs.isEmpty(minSize.val())){
				topError(window, '最小容量不能为空');
				minSize.focus();
				return false;
			}
			if(!CndnsValidate.checkNumber(minSize.val())){
				topError(window, '最小容量只能为数字');
				minSize.focus();
				return false;
			}
			if(parseInt(minSize.val())<=0){
				topError(window, '最小容量最少1G');
				minSize.focus();
				return false;
			}
			if(Commonjs.isEmpty(maxSize.val())){
				topError(window, '最大容量不能为空');
				maxSize.focus();
				return false;
			}
			if(!CndnsValidate.checkNumber(maxSize.val())){
				topError(window, '最大容量只能为数字');
				maxSize.focus();
				return false;
			}
			var service = {};
			service.hostType = $(parent.document).find('#hosttype2').val();
			service.typeId = typeId.val();
			service.typeName=typeName.val();
			service.minSize=minSize.val();
			service.maxSize=maxSize.val();
			var fn="addDicDisk";
			service = parent.Commonjs.jsonToString(service);
			var params = parent.Commonjs.getParams(fn,service);
            parent.Commonjs.ajaxTrue(weburl,params,addDiskSuccess,false);
		},cancel: function(){
			$('#addBox').hide();
		}
	});
}

function addDiskSuccess(data){
	topSuccess(window, data.msg);
	queryDiskList();
}

function uptDisk(id,hostTypeName,minSize,maxSize){
	var name = $("#"+id+hostTypeName);
	var minSize = $("#"+id+minSize);
	var maxSize = $("#"+id+maxSize);
	if(Commonjs.isEmpty(name.val())){
		topError(window, '类型名称不能为空');
		name.focus();
		return false;
	}
	if(Commonjs.isEmpty(minSize.val())){
		topError(window, '最小容量不能为空');
		minSize.focus();
		return false;
	}
	if(!CndnsValidate.checkNumber(minSize.val())){
		topError(window, '最小容量只能为数字');
		minSize.focus();
		return false;
	}
	if(parseInt(minSize.val())<=0){
		topError(window, '最小容量最少1G');
		minSize.focus();
		return false;
	}
	if(Commonjs.isEmpty(maxSize.val())){
		topError(window, '最大容量不能为空');
		maxSize.focus();
		return false;
	}
	if(!CndnsValidate.checkNumber(maxSize.val())){
		topError(window, '最大容量只能为数字');
		maxSize.focus();
		return false;
	}
	var service = {};
	service.id = id;
	service.typeName = name.val();
	service.minSize = minSize.val();
	service.maxSize = maxSize.val();
	var fn="uptDicDisk";
	service = Commonjs.jsonToString(service)
	var params = Commonjs.getParams(fn,service);//获取参数
	parent.Commonjs.ajaxTrue(weburl,params,uptDiskSuccess,false);
}

function uptDiskSuccess(data){
	topSuccess(window, data.msg);
	queryDiskList();
}

function Page(totalcounts,pagecount,pager) {
  	$("#"+pager).pager( {
  		totalcounts : totalcounts,
  		pagesize : 10,
  		pagenumber : $("#pagenumber").val(),
  		pagecount : parseInt(totalcounts/pagecount)+(totalcounts%pagecount >0?1:0),
  		buttonClickCallback : function(al) {
  			$("#pagenumber").val(al);
  			queryDiskList();
  		}
  	});
}
