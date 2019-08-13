var ue = UE.getEditor('content');
var total=0;
$(function(){
	getArticleType();  
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
				if(i==0)
					getArticleSubType(item.value,1);
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

//添加文章
function addSysArticle(){
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
	
	if(!Commonjs.isEmpty(flag.val())){
		var service = {};
		service.flag = flag.val();
		var fn = "querySysArticleFlag";
		service = Commonjs.jsonToString(service);
		var params = Commonjs.getParams(fn, service);//获取参数
		var data = Commonjs.ajax(weburl, params, false);
		if (data.result == "success") {
			$.tooltip('标记已存在，请重新定义标记。',2000,false); 
			flag.focus();
			return false;
		}   
	}
	
	var typeId="";  
	if(total>0)  
		typeId=$("#subType_"+total).val();
	
	var content=ue.getContent().replace (/[\r\n]/g, '<br>');
	content=content.replace(new RegExp('(["\"])', 'g'),"\\\"");
	
	var service = {};
	service.title = title.val(); 
	service.content = encodeURIComponent(content); 
	service.parentId = $("#artilceType").val();  
	service.typeId = typeId;
	service.flag = flag.val();
	var fn = "addSysArticle";
	service = Commonjs.jsonToString(service);
	var params = Commonjs.getParams(fn, service);//获取参数
	Commonjs.ajaxTrue(weburl,params,addArticleSuccess,true,"正在添加...");
}

function addArticleSuccess(data){
	$.tooltip(data.msg, 2000); 
	window.location.href="article.html"; 
}

function back(){
	window.history.back(-1); 
}
