var modelId;
var hostType;
$(function(){
	modelId = request("modelId");
	hostType = request("hostType");
	$("#modelName").html(decodeURI(request("modelName")));
	queryModelDiskList();
	queryDiskList();
})

//获取磁盘类型
function queryDiskList(){
	var service = {};
	service.hostType = hostType;
	var fn="queryDicDiskList";
	service = Commonjs.jsonToString(service);
	var params = Commonjs.getParams(fn,service);
	Commonjs.ajaxTrue(weburl,params,queryDiskSuccess);
}

function queryDiskSuccess(data){
	if(data.data == null){
		return false;
	}
	var html='';
	if (data.data.length>0){
		BaseForeach(data.data,function(i,item){
			html+='<option value="'+item.typeId+'">'+item.typeName+'</option>';
		});
	}
	$('#disklist').html(html);
}

//查询系列可用区
function queryModelDiskList(){
	var index = $("#pagenumber").val();
	var service = {};
	service.modelId=modelId
	service.page = index;
	service.pagesize = 10;
	var fn="queryDicModelDiskPage";
	service = Commonjs.jsonToString(service)
	var params = Commonjs.getParams(fn,service);//获取参数
	Commonjs.ajaxTrue(weburl,params,queryModelDiskSuccess);
};

function queryModelDiskSuccess(data){
	if(data.data == null){
		return false;
	}
	var html="";
	if (data.data.length>0){
		BaseForeach(data.data,function(i,item){
			html+='<tr><td>'+(i+1)+'</td>';
			html+='<td>'+item.modelName+'</td>';
			html+='<td>'+item.typeName+'</td>';
			html+='<td><a onclick="delModelDisk(\''+item.modelId+'\',\''+item.typeId+'\');" href="javascript:void(0);" class="btn btn-primary ">删除</a>';
			html+='</td></tr>';
		});
	}else{
		$("#page").hide();
		html+='<tr><td colspan="4" style="height:50px;text-align:center;line-height:50px;">找不到相关信息</td></tr>';
	}
	$('#modeldisklist').html(html);
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

//删除关联
function delModelDisk(modelId,typeId){
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
				service.modelId = modelId;
				service.typeId = typeId;
				var fn="delDicModelDisk";
				service = Commonjs.jsonToString(service);
				var params = Commonjs.getParams(fn,service);//获取参数
				parent.Commonjs.ajaxTrue(weburl,params,delModelDiskSuccess,false);
 	       	}
 	 	},{
 	 		name: '取消'
 	 	}]
 	});
}

function delModelDiskSuccess(data){
	topSuccess(window, data.msg);
	queryModelDiskList();
}

//添加关联
function addModelDisk(){
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
			var service = {};
			service.modelId=modelId;
			service.typeId = $(parent.document).find("#disklist").val();
			var fn="addDicModelDisk";
			service = Commonjs.jsonToString(service);
			var params = Commonjs.getParams(fn,service);
			parent.Commonjs.ajaxTrue(weburl,params,addModelDiskSuccess,false);
		},cancel: function(){
			$('#addBox').hide();
		}
	});
}

function addModelDiskSuccess(data){
	topSuccess(window, data.msg);
	queryModelDiskList();
}

function Page(totalcounts,pagecount,pager) {
  	$("#"+pager).pager( {
  		totalcounts : totalcounts,
  		pagesize : 10,
  		pagenumber : $("#pagenumber").val(),
  		pagecount : parseInt(totalcounts/pagecount)+(totalcounts%pagecount >0?1:0),
  		buttonClickCallback : function(al) {
  			$("#pagenumber").val(al);
  			queryModelDiskList();
  		}
  	});
}
