var notInHostType = ServletUtils.get("noHostType");
var notInHostTypeArr = notInHostType ? notInHostType.split(",") : [];

$(function(){
	queryhosttype();
	queryDicModelList();
})

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
	querySeriesList();
}

//获取实例系列
function querySeriesList(){
	var service = {};
	service.hostType = $("#hosttype2").val();
	var fn="queryDicSeriesList";
	service = Commonjs.jsonToString(service);
	var params = Commonjs.getParams(fn,service);
	Commonjs.ajaxTrue(weburl,params,querySeriesSuccess);
}

function querySeriesSuccess(data){
	if(data.data == null){
		return false;
	}
	var html='';
	if (data.data.length>0){
		BaseForeach(data.data,function(i,item){
			html+='<option value="'+item.seriesId+'">'+item.seriesName+'</option>';
		});
	}
	$('#serieslist').html(html);
}

//查询实例机型
function queryDicModelList(){
	var hosttype = $("#hosttypelist").val();
	if(hosttype==null)
		hosttype="";
	var index = $("#pagenumber").val();
	var service = {};
	service.hostType=hosttype
	service.page = index;
	service.pagesize = 10;
	var fn="queryDicModelPage";
	service = Commonjs.jsonToString(service)
	var params = Commonjs.getParams(fn,service);//获取参数
	Commonjs.ajaxTrue(weburl,params,queryDicModelSuccess);
};

function queryDicModelSuccess(data){
	if(data.data == null){
		return false;
	}
	var html="";
	if (data.data.length>0){
		BaseForeach(data.data,function(i,item){
			html+='<tr><td>'+(i+1)+'</td>';
			html+='<td>'+item.hostTypeName+'</td>';
			html+='<td>'+item.modelId+'</td>';
			html+='<td><input type="text" class="manager-input m-input width100" style="width:100px;" id="name'+item.id+'" value='+item.modelName+'></td>';
			html+='<td>'+item.seriesName+'</td>';
			if(item.isIO==1)
				html+='<td>是</td>';
			else
				html+='<td>否</td>';
			var url="modeldisk.html?modelId="+item.modelId+"&hostType="+item.hostType+"&modelName="+encodeURI(item.modelName);
			html+='<td><a href="'+url+'" class="btn btn-primary ">查询磁盘类型</a>';
			html+='<a onclick="delModel(\''+item.modelId+'\',\''+item.hostType+'\');" href="javascript:void(0);" class="btn btn-primary ">删除</a>';
			html+='<a onclick="uptmodelName(\''+item.id+'\');" href="javascript:void(0);" class="btn btn-primary ">修改</a>'
			html+='</td></tr>';
		});
	}else{
		$("#page").hide();
		html+='<tr><td colspan="7" style="height:50px;text-align:center;line-height:50px;">找不到相关信息</td></tr>';
	}
	$('#modellist').html(html);
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

//删除实例机型
function delModel(modelId,hostType){
	parent.art.dialog({
		lock : true,
		opacity : 0.4,
		width : 250,
		title : '提示',
		content : '您确定删除吗？',
		ok : function() {
       	 	var service = {};
			service.modelId = modelId;
			service.hostType = hostType;
			var fn="delDicModel";
			service = Commonjs.jsonToString(service);
			var params = Commonjs.getParams(fn,service);//获取参数
			parent.Commonjs.ajaxTrue(weburl,params,delModelSuccess,false);
		},cancel: function(){
			$('#dialog').hide();
		}
	});
}

function delModelSuccess(data){
	topSuccess(window, data.msg);
	queryDicModelList();
}

//新增实例机型
function addModel(){
	$('#modelfrom')[0].reset();
	var contents=$('#addBox').get(0);
	parent.art.dialog({
		lock: true,
		artIcon:'add',
		opacity:0.4,
		width: 400,
		padding:'0px 0px',
		title:'添加实例机型',
		header:false,
		content: contents,
		ok: function () {
			var modelId=$(parent.document).find("#modelId");
			var modelName=$(parent.document).find("#modelName");
			var serieslist=$(parent.document).find("#serieslist");
			if(Commonjs.isEmpty(serieslist.val())){
				topError(window, '请选择所属实例系列');
				serieslist.focus();
				return false;
			}

			if(Commonjs.isEmpty(modelId.val())){
				topError(window, '机型代码不能为空');
				modelId.focus();
				return false;
			}

			if(Commonjs.isEmpty(modelName.val())){
				topError(window, '机型名称不能为空');
				modelName.focus();
				return false;
			}

			var service = {};
			service.hostType = $(parent.document).find('#hosttype2').val();
			service.seriesId = serieslist.val();
			service.modelId=modelId.val();
			service.modelName=modelName.val();
			service.isIO=$(parent.document).find("#isIO").val();
			var fn="addDicModel";
			service = Commonjs.jsonToString(service);
			var params = Commonjs.getParams(fn,service);
			parent.Commonjs.ajaxTrue(weburl,params,addModelSuccess,false);
		},cancel: function(){
			$('#addBox').hide();
		}
	});
}

function addModelSuccess(data){
	topSuccess(window, data.msg);
	queryDicModelList();
}

function Page(totalcounts,pagecount,pager) {
  	$("#"+pager).pager( {
  		totalcounts : totalcounts,
  		pagesize : 10,
  		pagenumber : $("#pagenumber").val(),
  		pagecount : parseInt(totalcounts/pagecount)+(totalcounts%pagecount >0?1:0),
  		buttonClickCallback : function(al) {
  			$("#pagenumber").val(al);
  			queryDicModelList();
  		}
  	});
}

function uptmodelName(id){
	if(Commonjs.isEmpty($("#name"+id).val())){
		topError(window, '机型名称不能为空');
		$("#name"+id).focus();
		return false;
	}
	var service = {};
	service.modelName = $("#name"+id).val();
	service.id = id;
	var fn="uptModelName";
	service = Commonjs.jsonToString(service)
	var params = Commonjs.getParams(fn,service);//获取参数
	parent.Commonjs.ajaxTrue(weburl,params,uptmodelNameSuccess,false);
}

function uptmodelNameSuccess(data){
	topSuccess(window, data.msg);
	queryDicModelList();
}
