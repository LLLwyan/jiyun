//获取文章类型
function queryarticle(paramEName,w_parentId,NowSelectId){
	var service = {};
	service.paramEName = paramEName;
	var fn="getListParamItemByEName";
	service = Commonjs.jsonToString(service);
	var params = Commonjs.getParams(fn,service);//获取参数
	var data=Commonjs.ajax(sysurl,params,false);
	if(data.result == "success"){
		$('#'+w_parentId).empty();
		var parentId='<option value="" paramid="">请选择</option>';
		if (data.data.length>0){
			nextSelectShow(NowSelectId);
			BaseForeach(data.data,function(i,item){				
				parentId+='<option value="'+item.value+'" paramid="">'+item.description+'</option>';
			});
		}else{
			parentId="";
			nextSelectHide(NowSelectId);
		}
		$('#'+w_parentId).append(parentId);
		if (data.data.length>0){
			getparentListN(w_parentId,"");
		}
	}else{
		$.tooltip(data.msg,2000,false);
	}
};


//获取文章类型(下拉框调用) 
function getparentList(obj){
		var NowSelectId = obj.id;//当前下拉框的ID
		var paramId = $('#'+NowSelectId).find("option:selected").attr("paramid");//选中选项的ID
		var nextobj=$('#'+NowSelectId).val();//选中的值
		
		w_typeId=nextSelectId(NowSelectId);
		paramIds=checkParamId(paramId,nextobj);
		
		var service = {};
		service.paramId = paramIds;
		var fn="getListDicParamItem";
		service = Commonjs.jsonToString(service);
		var params = Commonjs.getParams(fn,service);//获取参数
		var data=Commonjs.ajax(sysurl,params,false);
		if(data.result == "success" ){
			$('#'+w_typeId).empty();
			var typeId='<option value="" paramid="">请选择</option>';
			if (data.data.length>0){
				nextSelectShow(NowSelectId);
				BaseForeach(data.data,function(i,item){
					typeId+='<option value="'+item.value+'" paramid="'+item.paramId+'">'+item.description+'</option>';
				});
			}else{
				typeId='';
				nextSelectHide(NowSelectId);
			}
			$('#'+w_typeId).append(typeId);
			if (data.data.length>0){
				getparentListN(w_typeId,"");
			}
		}
		else{
			$.tooltip(data.msg,2000,false);
		}
};

//获取文章类型(内部调用) 
function getparentListN(NowSelectId,value){
		var paramId = $('#'+NowSelectId).find("option:selected").attr("paramid");//选中选项的ID
		var nextobj=$('#'+NowSelectId).val();//选中的值
		
		w_typeId=nextSelectId(NowSelectId);
		paramIds=checkParamId(paramId,nextobj);
		
		var service = {};
		service.paramId = paramIds;
		var fn="getListDicParamItem";
		service = Commonjs.jsonToString(service);
		var params = Commonjs.getParams(fn,service);//获取参数
		var data=Commonjs.ajax(sysurl,params,false);
		if(data.result == "success" ){
			$('#'+w_typeId).empty();
			var typeId='<option value="" paramid="">请选择</option>';
			if (data.data.length>0){
				nextSelectShow(NowSelectId);
				BaseForeach(data.data,function(i,item){
					typeId+='<option value="'+item.value+'" paramid="'+item.paramId+'">'+item.description+'</option>';
				});
			}else{
				typeId='';
				nextSelectHide(NowSelectId);
			}
			$('#'+w_typeId).append(typeId);
			if(value!=""){
				$('#'+w_typeId).val(value);
			}
			if (data.data.length>0){
				getparentListN(w_typeId,"");
			}
		}
		else{
			$.tooltip(data.msg,2000,false);
		}
};

var allDivId=new Array("","parentListone","parentListtwo","parentListthree");
var allSelectId=new Array("w_parentId","w_typeIdone","w_typeIdtwo","w_typeIdthree");

//获取下一个下拉框的ID
function nextSelectId(NowSelectId){
	for(var i=0;i<allDivId.length;i++){
		if(i<allDivId.length-1){
			if(NowSelectId==allSelectId[i]){
				return allSelectId[i+1];
			}
		}else{
			return "";
		}
	}
	return "";
}

//获取上一个下拉框的ID
function topSelectId(NowSelectId){
	for(var i=1;i<allDivId.length;i++){
		if(i<allDivId.length1){
			if(NowSelectId==allSelectId[i]){
				return allSelectId[i-1];
			}
		}else{
			return "";
		}
	}
	return "";
}

//显示下一个下拉框
function nextSelectShow(NowSelectId){
	for(var i=0;i<allDivId.length;i++){
		if(i<allDivId.length-1 ){
			if(NowSelectId==allSelectId[i]){
				$('#'+allDivId[i+1]).show();
				$('#w_typeId').val(allSelectId[i]);
			}
		}
	}
}

//隐藏下拉框
function nextSelectHide(NowSelectId){
	$('#w_typeId').val(NowSelectId);
	for(var i=0;i<allDivId.length;i++){
		if(NowSelectId==allSelectId[i]){
			$('#w_typeId').val(allSelectId[i-1]);
			for(j=i+1;j<allDivId.length;j++){
				$('#'+allDivId[j]).hide();
			}
		}
	}
}

//得到子类ID
function checkParamId(paramId,nextobj){
	if(paramId=="" && nextobj==""){
		return "";
	}
	var str=paramId+":"+nextobj;
	if(str.indexOf(":")==0){
		str=str.substring(1,str.length)
	}
	if(str.indexOf(":")==str.length-1){
		str=str.substring(0,str.length-1)
	}
	return str;
}

//文章修改时显示分类
function showAllOption(typeId){
	if(typeId.indexOf(":")>0){
		typeIdArr=typeId.split(":");
		for(var i=1;i<typeIdArr.length;i++){
			if($('#'+allSelectId[i-1]).val()!=null){	
				getparentListN(allSelectId[i-1],typeIdArr[i]);
			}
		}
	}
}