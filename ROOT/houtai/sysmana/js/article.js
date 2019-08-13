$(function(){
	getArticleType();
	querySysArticleList();  
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
			html+='<option value="">请选择</option>'; 
			BaseForeach(data.data,function(i,item){
				html+='<option value="'+item.value+'">'+item.description+'</option>';
			});
			$("#artilceType").html(html);
		}
	}
};

//查文章管理列表
function querySysArticleList(){
	var service = {};
	var fn = "querySysArticle";
	var index = $("#pagenumber").val();	
	service.page = index;
	service.pagesize = 10;
	service.title =  $("#title").val();
	service.content =  $("#content").val();
	service.parentId = $("#artilceType").val();
	service = Commonjs.jsonToString(service);
	var params = Commonjs.getParams(fn, service);//获取参数
	Commonjs.ajaxTrue(weburl,params,queryArticleSuccess);
};

function queryArticleSuccess(data){	
	if(data.data == null){
		return false;
	}
	$('#artlist').empty();
	var artlist = "";
	if (data.data.length > 0) {
		BaseForeach(data.data,function(i, item){	
			artlist += '<tr><td>'+(i+1)+'</td>';
			artlist += '<td>'+item.typeName+'</td>';
			artlist += '<td>'+item.title+'</td>';
			var content=delHtmlTag(item.content);
			if(content.length  <= 8){
				artlist += '<td>'+content+'</td>';
			}else{
				artlist += '<td>'+content.substring(0,10)+'...</td>';
			}
			artlist += '<td>'+jsonDateTimeFormat(item.publishTime)+'</td>';
			artlist += '<td>'+item.authorName+'</td>';
			artlist += '<td><a href="articleedit.html?id='+$.trim(item.id)+'" class="btn btn-primary" >修改</a>';
			artlist += '<a href="javascript:void(0);" class="btn btn-primary" onclick="delSysArticle(\''+$.trim(item.id)+'\')">删除</a></td>';
			artlist += '</tr>';
		});
	$('#artlist').append(artlist);
	if (data.rows != undefined) {
		if (data.rows != 0) {
			$("#totalcount").val(data.rows);
		} else {
			if(data.page==0)$("#totalcount").val(0);
		}
	} else {
		$("#totalcount").val(0);
	}
	Page($("#totalcount").val(),data.pagesize,'pager');
	$("#page").show();
	}else{
		$("#page").hide();
		artlist+=' <tr><td colspan="8" style="height:50px;text-align:center;line-height:50px;">找不到相关信息</td></tr>';	
		$('#artlist').append(artlist);
	}
}

//删除文章
function delSysArticle(id){
	var dialog=	art.dialog({
		lock : true,
		opacity : 0.4,
		width : 250,
		title : '提示',
		content : '您确定删除吗？',
		ok : function() {
      	 	var service = {};
			service.id = id;
			var fn="delSysArticle";
			service = Commonjs.jsonToString(service);
			var params = Commonjs.getParams(fn,service);//获取参数
			Commonjs.ajaxTrue(weburl,params,delArticleSuccess,false);
		},cancel: function(){
			$('#dialog').hide();
		}
	});
}

function delArticleSuccess(data){
	$.tooltip(data.msg,2000,true);
	querySysArticleList();
}

//去除html标签
function delHtmlTag(str)
{
	return str.replace(/<[^>]+>/g,"");//去掉所有的html标记
}

//分页	
function Page(totalcounts,pagecount,pager) {
	$("#"+pager).pager( {
		totalcounts : totalcounts,
	  	pagesize : 10,
	  	pagenumber : $("#pagenumber").val(),
	  	pagecount : parseInt(totalcounts/pagecount)+(totalcounts%pagecount >0?1:0),
	  	buttonClickCallback : function(al) {
	  		$("#pagenumber").val(al);
	  		querySysArticleList();
	  	}
	});
}