//数据字典
$(function(){
	getListDicParamIndex();	
});

function getListDicParamIndex(){
	var service = {};
	service.page = 1;
	service.pagesize = 10;
	var fn="getListDicParamIndex";
	service = Commonjs.jsonToString(service);
	var params = Commonjs.getParams(fn,service);//获取参数
	Commonjs.ajaxTrue(sysurl,params,getIndexSuccess);
}

function getIndexSuccess(data){
	if(data.data == null){
		return false;
	}
	$("#userlist").html("");
	var userlis="";
	BaseForeach(data.data,function(i,item){
		userlis+='<tr class="gradeX">';
		userlis+='<td>'+(i+1)+'</td>';
		userlis+='<td>'+item.paramEName+'</td>';	
		userlis+='<td><input id="'+item.paramEName+'" class="manager-input m-input width200" style="width:300px;" value='+item.paramCName+'></td>';
		userlis+='<td class="center">';
		userlis+='<a href="javascript:void(0);" class="btn btn-primary" onclick="uptDicParamIndex(\''+item.id+'\',\''+item.paramEName+'\');">修改</a>';
		userlis+='<a href="./dicItem.html?paramId='+item.paramEName+'&number=1" class="btn btn-primary ">子列表设置</a> ';
		userlis+='<a href="javascript:void(0);" class="btn btn-primary" onclick="deletDicParamIndex(\''+item.id+'\',\''+item.paramEName+'\');">删除</a>';
		userlis+='</td>';
		userlis+='</tr>';
	});
	$("#userlist").append(userlis);
}

//新增字典
function addDicParamIndex(){
	var service = {};
	service.paramEName = $("#addParamEName").val();
	service.paramCName = $("#addParamCName").val();
	var fn="addDicParamIndex";
	service = Commonjs.jsonToString(service);
	var params = Commonjs.getParams(fn,service);//获取参数
	Commonjs.ajaxTrue(sysurl,params,addIndexSuccess,false);
}

function addIndexSuccess(data){
	$.tooltip(data.msg,2000,true);
	$("#addParamCName").val("");
	$("#addParamEName").val("");
	getListDicParamIndex();
}
	
//删除数据字典
function deletDicParamIndex(id,paramEName){
	var dialog=	art.dialog({
		lock : true,
		opacity : 0.4,
		width : 250,
		title : '提示',
		content : '您确定删除吗？',
		ok : function() {
      	 	var service = {};
			service.id = id;
			service.paramEName = paramEName;
			var fn="deletDicParamIndex";
			service = Commonjs.jsonToString(service);
			var params = Commonjs.getParams(fn,service);//获取参数
			Commonjs.ajaxTrue(sysurl,params,deleteIndexSuccess,false);
		},cancel: function(){
			$('#dialog').hide();
		}
	});
}

function deleteIndexSuccess(data){
	$.tooltip(data.msg,2000,true);
	getListDicParamIndex();
}

//修改数据字典
function uptDicParamIndex(id,paramEName){
	var service = {};
	service.id = id;
	service.paramCName = $("input#"+paramEName+"").val();
	service.paramEName = paramEName;
	service = Commonjs.jsonToString(service);
	var fn="uptDicParamIndex";
	var params = Commonjs.getParams(fn,service);//获取参数
	Commonjs.ajaxTrue(sysurl,params,uptIndexSuccess,false);
}	

function uptIndexSuccess(data){
	$.tooltip(data.msg,2000,true);
	getListDicParamIndex();
}