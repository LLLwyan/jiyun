var ue = UE.getEditor('content'); 
var id = request("id"); 
var typeList='';
var total=0;

$(function(){
	getArticleType();
	getSysArticleinfo();
});

//获取文章类型  
function getArticleType(){ 
	var service = {};
	service.paramEName = "article";
	var fn = "getListParamItemByEName"; 
	service = Commonjs.jsonToString(service);
	var params = Commonjs.getParams(fn,service);//获取参数
	var data = Commonjs.ajax(sysurl,params,false); 
	if(data.result == "success"){
		var html='';
		if (data.data.length>0){
			BaseForeach(data.data,function(i,item){
				html+='<option value="'+item.value+'">'+item.description+'</option>';
			});
			$("#artilceType").html(html);
		}
	}
};

//获取文章子类型
function getArticleSubType(paramId,n){
	var service = {};
	service.paramId = paramId;
	var fn="getListDicParamItem";
	service = Commonjs.jsonToString(service);
	var params = Commonjs.getParams(fn,service);//获取参数
	var data=Commonjs.ajax(sysurl,params,false);
	if(data.result == "success"){
		if (data.data.length>0){
			var firstValue; 
			var html='<select style="width:15%;" class="form-control pull-left" onchange="selArticleSubType('+n+')" id="subType_'+n+'">';  
			BaseForeach(data.data,function(i,item){	
				if(i==0) 
					firstValue=item.value;
				html+='<option value="'+item.value+'">'+item.description+'</option>';
			});
			html+='</select>';
			$("#subType").append(html);   
		
			getArticleSubType(firstValue,n+1);   
		}else{
			total=n-1;    
			if(n==1){
				$("#subType").html(""); 
			}
		}
	}
}

//选择文章父类型  
function selArticleType(){
	var paramId=$("#artilceType").val();
	getArticleSubType(paramId,1);
}

//选择文章子类型 
function selArticleSubType(n){
	if(n<total){
		for(var i=n+1;i<=total;i++){
			$("#subType_"+i).remove();
		}
	}
	var paramId=$("#subType_"+n).val();  
	getArticleSubType(paramId,n+1);  
}

//获取文章详情
function getSysArticleinfo(){
	var service = {};
	service.id = id;
	var fn = "getSysArticle";
	service = Commonjs.jsonToString(service);
	var params = Commonjs.getParams(fn, service);//获取参数
	Commonjs.ajaxTrue(weburl,params,getArticleinfoSuccess);
}

function getArticleinfoSuccess(data){
	if(data.data == null){
		return false;
	}
	
	/**设置百度编辑器内容*/ 
	//1.判断ueditor 编辑器是否创建成功
    ue.addListener("ready", function () {
    	//2.editor准备好之后才可以使用
    	ue.setContent(data.data.content.toString());
    });
    
	$('#title').val(data.data.title);
	$('#artilceType').val(data.data.parentId); 
	$('#flag').val(data.data.flag);
	pushGetArticleType(data.data.typeId);
	createSelect();
	
	//赋值选中下拉框
	var str=data.data.typeId+","+typeList; 
	var index=str.lastIndexOf(","); 
	str=str.substring(0, index); 
	var list=str.split(",");
	for(var i=1;i<=total;i++){
		$("#subType_"+i).val(list[list.length-i]); 
	}
}

//倒推获取文章类型列表
function pushGetArticleType(typeId){ 
	var service = {};
	service.value = typeId;
	var fn = "getSysParamItemByValue"; 
	service = Commonjs.jsonToString(service);
	var params = Commonjs.getParams(fn,service);//获取参数
	var data = Commonjs.ajax(sysurl,params,false);
	if(data.result == "success"){
		var view=data.data;
		if (view!=null){
			typeList+=view.paramId+','; 
			pushGetArticleType(view.paramId); 
		}
	}
};

//创建选择框
function createSelect(){
	if(typeList=="")
		return;
	
	//去掉第一级类型
	typeList=typeList.substring(0, typeList.length-1);
	var index=typeList.lastIndexOf(",");
	typeList=typeList.substring(0, index); 
	
	var list=typeList.split(",");  
	var n=1;
	for(i=list.length;i>0;i--){ 
		subArticleSubType(list[i-1],n);   
		n++;
		total=n; 
	}
}

//获取文章子类型
function subArticleSubType(paramId,n){
	var service = {};
	service.paramId = paramId;
	var fn="getListDicParamItem";
	service = Commonjs.jsonToString(service);
	var params = Commonjs.getParams(fn,service);//获取参数
	var data=Commonjs.ajax(sysurl,params,false);
	if(data.result == "success"){
		if (data.data.length>0){ 
			var html='<select style="width:15%;" class="form-control pull-left" onchange="selArticleSubType('+n+')" id="subType_'+n+'">';  
			BaseForeach(data.data,function(i,item){	
				html+='<option value="'+item.value+'">'+item.description+'</option>';
			});
			html+='</select>';
			$("#subType").append(html);   
		}
	}
}

//修改
function modSysArticle(){
	var title = $('#title');
	var parentId = $('#artilceType'); 
	var flag = $('#flag');
	if(Commonjs.isEmpty(title.val())){
		$.tooltip('文章标题不能为空',2000,false); 
		title.focus();
		return false;
	}
	if(Commonjs.isEmpty(ue.getContent())){
		$.tooltip('文章内容不能为空',2000,false); 
		content.focus();
		return false;
	}
	
	var typeId="";  
	if(total>0)  
		typeId=$("#subType_"+total).val()
	
	var content=ue.getContent().replace (/[\r\n]/g, '<br>');
	content=content.replace(new RegExp('(["\"])', 'g'),"\\\"");
	
	var service = {};
	service.id = id;
	service.title = title.val();
	service.content = encodeURIComponent(content);
	service.parentId = parentId.val();
	service.typeId = typeId;
	service.flag = flag.val();
	var fn = "modSysArticle";
	service = Commonjs.jsonToString(service);
	var params = Commonjs.getParams(fn, service);//获取参数 
	Commonjs.ajaxTrue(weburl,params,modSysArticleSuccess,true,"正在保存中...");
}

function modSysArticleSuccess(data){
	$.tooltip(data.msg, 2000, true);
	window.location.href="article.html"; 
}

function back(){
	window.history.back(-1); 
}