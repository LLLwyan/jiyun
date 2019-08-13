var Itemid = request("paramId");
var number = request("number");
$(function(){
	getListDicParamItem();
});

//获取数据字典子设置
function getListDicParamItem(){
	var service = {};
	service.paramId = Itemid;
	var fn="getListDicParamItem";
	service = Commonjs.jsonToString(service);
	var params = Commonjs.getParams(fn,service);//获取参数
	Commonjs.ajaxTrue(sysurl,params,getItemSuccess);
}

function getItemSuccess(data){
	if(data.data == null)
		return false; 
	
	$("#paramItem").html("");
	var userlis="";
	BaseForeach(data.data,function(i,item){
		userlis+='<tr class="gradeX">';
		userlis+='<td>'+(i+1)+'</td>'; 
		userlis+='<td>'+item.value+'</td>';	 
		userlis+='<td><input id="id_'+item.id+'" class="manager-input m-input width200" style="width:300px;" value='+item.description+'></td>';
		userlis+='<td><input id="remark_'+i+'" class="manager-input m-input width200" style="width:100px;" value='+item.remark+'></td>';	
		userlis+='<td class="center">';
		userlis+='<a href="javascript:void(0);" class="btn btn-primary" onclick="uptDicParamItem(\''+item.id+'\','+i+');">修改</a>';
		userlis+='<a href="./dicItem.html?paramId='+Itemid+':'+item.value+'" class="btn btn-primary ">子列表设置</a> ';
		userlis+='<a href="javascript:void(0);" class="btn btn-primary" onclick="delDicParamItemById(\''+item.id+'\',\''+item.paramId+'\',\''+item.value+'\');">删除</a>';
		userlis+='</td>';
		userlis+='</tr>';
	});
	$("#paramItem").append(userlis);
}

//修改数据子字典
function uptDicParamItem(id,index){
	var paramId = Itemid;
	var service = {};
	service.id = id;
	service.description = $("#id_"+id).val();
	service.remark = $("#remark_"+index).val();
	service = Commonjs.jsonToString(service);
	var fn="uptDicParamItem";
	var params = Commonjs.getParams(fn,service);//获取参数
	Commonjs.ajaxTrue(sysurl,params,uptItemSuccess,false);
}

function uptItemSuccess(data){
	$.tooltip(data.msg,2000,true);
	getListDicParamItem(paramId);
}

//删除数据子字典
function delDicParamItemById(id,paramId,value){
	 art.dialog({
 		id: 'testID',
 	    width: '245px',
	    height: '109px',
 	    content: '您要删除吗？注意：删除后数据将不能恢复',
 	    lock: true,
 	    button: [{
 	      	name: '确定',
 	       	callback: function () {
 	       	 	var service = {};
				service.id = id;
				service.paramId = paramId;
				service.value = value;
				var fn="delDicParamItemById";
				service = Commonjs.jsonToString(service);
				var params = Commonjs.getParams(fn,service);//获取参数
				Commonjs.ajaxTrue(sysurl,params,delItemByIdSuccess,false);
 	       	}
 	 	},{
 	 		name: '取消'
 	 	}]
 	});	
}

function delItemByIdSuccess(data){
	$.tooltip(data.msg,2000,true);
	getListDicParamItem();
}

//新增字典
function addDicParamItem(){
	var service = {};
	service.paramId = Itemid;
	service.description = $("#description").val();  
	// if(number==1)
	// 	service.value = $("#value").val();
	// else
	// 	service.value = Itemid+":"+$("#value").val();
		service.value = $("#value").val();
	service.remark = $("#remark").val();
	var fn="addDicParamItem";
	service = Commonjs.jsonToString(service);
	var params = Commonjs.getParams(fn,service);//获取参数
	Commonjs.ajaxTrue(sysurl,params,addItemSuccess,false);
}

function addItemSuccess(data){
	$.tooltip(data.msg,2000,true);
	$("#value").val("");
	$("#description").val("");
	getListDicParamItem(Itemid);
}