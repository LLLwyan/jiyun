var notInHostType = ServletUtils.get("noHostType");
var notInHostTypeArr = notInHostType ? notInHostType.split(",") : [];

$(function(){
	queryhostType();
	queryOsImage();
})

//获取上级注册商
function queryhostType(){
	var service = {};
	service.paramEName = "hostType";
	var fn="getListParamItemByEName";
	service = Commonjs.jsonToString(service);
	var params = Commonjs.getParams(fn,service);//获取参数
	Commonjs.ajaxTrue(sysurl,params,queryhostTypeSuccess);
};

function queryhostTypeSuccess(data){
	if(data.data == null)
		return false;

	var html='';
	if (data.data.length>0){
		BaseForeach(data.data,function(i,item){
            if ($.inArray(item.value, notInHostTypeArr) < 0) {
                html += '<option value="' + item.value + '">' + item.description + '</option>'
            }
		});
	}
	$('#hosttype').html('<option value="">所有</option>'+html);
	$('#hosttype2').html(html);
	queryRegionList();
}

//获取地域
function queryRegionList(func){
	var service = {};
	service.hostType = $("#hosttype2").val();
	var fn="queryHostlist";
	service = Commonjs.jsonToString(service);
	var params = Commonjs.getParams(fn,service);

	$.ajax({
		datatype:"json",
        type:"POST",
        url: weburl,
        data:params,
		cache : false,
		success: function(data){
			var result=jQuery.parseJSON(data);
			if(result.result=="success"){
				var html='';
				if (result.data.length>0){
					BaseForeach(result.data,function(i,item){
						html+='<option value="'+item.regionId+'">'+item.regionName+'</option>';
					});
				}
				$('#region').html(html);
				if (func && $.isFunction(func)) {
					func();
				}
			}
		}
	});
}

function queryOsImage(){
	var hosttype = $("#hosttype").val();
	var index = $("#pagenumber").val();
	var service = {};
	service.hostType=hosttype
	service.page = index;
	service.pagesize = 10;
	var fn="queryOsImage";
	service = Commonjs.jsonToString(service)
	var params = Commonjs.getParams(fn,service);//获取参数
	Commonjs.ajaxTrue(weburl,params,queryOsImageSuccess);
};

function queryOsImageSuccess(data){
	if(data.data == null)
		return false;

	$("#osimglist").empty();
	var osimglist="";
	if (data.data.length>0){
		BaseForeach(data.data,function(i,item){
			osimglist+='<tr><td>'+(i+1)+'</td>';
			osimglist+='<td>'+item.hostTypeName+'</td>';
			osimglist+='<td>'+item.regionName+'</td>';
			if(item.imageType==1){
				osimglist+='<td>公共镜像</td>';
			}else if(item.imageType==2){
				osimglist+='<td>市场镜像</td>';
			}else{
				osimglist+='<td>未定义镜像</td>';
			}
			osimglist+='<td>'+item.osType+'</td>';
			osimglist+='<td>'+item.osName+'</td>';
			osimglist+='<td>'+item.imageIdent+'</td>';
			osimglist+='<td>'+(item.supportVnc == 0 ? '否' : '是') + '</td>';
			osimglist+='<td>'+item.listId+'</td>';
			osimglist+='<td>'
			osimglist+='<a href="javascript:void(0);" class="btn btn-primary" onclick="modOsImage(\''+item.imageId+'\',\''+item.hostType+'\','+item.imageType+',\''+item.osType+'\',\''+item.osName+'\',\''+item.imageIdent.replace(/\\/g, "\\\\")+'\','+item.listId+', ' + item.supportVnc + ');">修改</a> '
			osimglist+='<a onclick="delOsImage(\''+item.imageId+'\');" href="javascript:void(0);" class="btn btn-primary ">删除</a> '
			osimglist+='</td></tr>';
		});
		$("#page").show();
	}else{
		$("#page").hide();
		osimglist+=' <tr><td colspan="7" style="height:50px;text-align:center;line-height:50px;">找不到相关信息</td></tr>';
	}

	$('#osimglist').append(osimglist);
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

//删除镜像
function delOsImage(imageId){
	parent.art.dialog({
		lock : true,
		opacity : 0.4,
		width : 250,
		title : '提示',
		content : '您确定删除吗？',
		ok : function() {
       	 	var service = {};
			service.imageId = imageId;
			var fn="delOsImage";
			service = Commonjs.jsonToString(service);
			var params = Commonjs.getParams(fn,service);//获取参数
			parent.Commonjs.ajaxTrue(weburl,params,delOsImageSuccess,false);
		},cancel: function(){
			$('#dialog').hide();
		}
	});
}

function delOsImageSuccess(data){
	topSuccess(data.msg,2000,true);
	queryOsImage();
}

//新增镜像
function addOsImage(){
	$('#imagefrom')[0].reset();
	var contents=$('#addBox').get(0);
	parent.art.dialog({
		lock: true,
		artIcon:'add',
		opacity:0.4,
		width: 400,
		padding:'0px 0px',
		title:'添加镜像',
		header:false,
		content: contents,
		ok: function () {
			var osType = $(parent.document).find('#osType');
			if(Commonjs.isEmpty(osType.val())){
				topError(window, '操作系统类型不能为空');
				osType.focus();
				return false;
			}
			var osName = $(parent.document).find('#osName');
			if(Commonjs.isEmpty(osName.val())){
				topError(window, '操作系统名称不能为空');
				osName.focus();
				return false;
			}
			var imageIdent = $(parent.document).find('#imageIdent');
			if(Commonjs.isEmpty(imageIdent.val())){
				topError(window, '模板路径不能为空');
				imageIdent.focus();
				return false;
			}
			var service = {};
			var fn="addOsImage";
			service.imageType = $(parent.document).find('#imageType').val();
			service.osType = osType.val();
			service.osName = osName.val();
			service.imageIdent = imageIdent.val();
			service.regionId=$(parent.document).find("#region").val();
			service.regionName=$(parent.document).find("#region").find("option:selected").text();
			service.hostType = $(parent.document).find('#hosttype2').val();
			service.listId=$(parent.document).find('#listId').val();
			service.supportVnc=$(parent.document).find('#supportVnc').val();
			service = Commonjs.jsonToString(service);
			var params = Commonjs.getParams(fn,service);//获取参数
			parent.Commonjs.ajaxTrue(weburl,params,addOsImageSuccess,false);
		},cancel: function(){
			$('#addBox').hide();
		}
	});
}

function addOsImageSuccess(data){
	topSuccess(window, data.msg);
	queryOsImage();
}

//更新镜像
function modOsImage(imageId,hosttype,imageType,osType,osName,imageIdent,listId,supportVnc){
	$('#ID').val(imageId);
	$('#hosttype2').val(hosttype);
    queryRegionList(function () {
        $('#imageType2').val(imageType);
    });
	$('#osType').val(osType);
	$('#osName').val(osName);
	$('#imageIdent').val(imageIdent);
	$('#listId').val(listId);
	$('#supportVnc').val(supportVnc)
	var contents=$('#addBox').get(0);
	parent.art.dialog({
		lock: true,
		artIcon:'add',
		opacity:0.4,
		width: 400,
		padding:'0px 0px',
		title:'修改镜像信息',
		header:false,
		content: contents,
		ok: function () {
			var osType = $(parent.document).find('#osType');
			if(Commonjs.isEmpty(osType.val())){
				topError(window, '操作系统类型不能为空');
				osType.focus();
				return false;
			}
			var osName = $(parent.document).find('#osName');
			if(Commonjs.isEmpty(osName.val())){
				topError(window, '操作系统名称不能为空');
				osName.focus();
				return false;
			}
			var imageIdent = $(parent.document).find('#imageIdent');
			if(Commonjs.isEmpty(imageIdent.val())){
				topError(window, '模板路径不能为空');
				imageIdent.focus();
				return false;
			}
			var service = {};
			service.imageId = $(parent.document).find('#ID').val();
			service.hostType = $(parent.document).find('#hosttype2').val();
			service.regionId=$(parent.document).find("#region").val();
			service.regionName=$(parent.document).find("#region").find("option:selected").text();
			service.imageType = $(parent.document).find('#imageType').val();
			service.osType = osType.val();
			service.osName = osName.val();
			service.imageIdent = imageIdent.val();
			service.listId=$(parent.document).find('#listId').val();
            service.supportVnc=$(parent.document).find('#supportVnc').val();
			var fn="uptOsImage";
			service = Commonjs.jsonToString(service);
			var params = Commonjs.getParams(fn,service);//获取参数
			parent.Commonjs.ajaxTrue(weburl,params,modOsImageSuccess,false);
		},
		cancel: function(){
			$('#addBox').hide();
		}
	});
}

function modOsImageSuccess(data){
	topSuccess(window, data.msg);
	queryOsImage();
}

function Page(totalcounts,pagecount,pager) {
  	$("#"+pager).pager( {
  		totalcounts : totalcounts,
  		pagesize : 10,
  		pagenumber : $("#pagenumber").val(),
  		pagecount : parseInt(totalcounts/pagecount)+(totalcounts%pagecount >0?1:0),
  		buttonClickCallback : function(al) {
  			$("#pagenumber").val(al);
  			queryOsImage();
  		}
  	});
}
