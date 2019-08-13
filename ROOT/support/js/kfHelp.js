$(function () {
	getHelpInfo("");  
});

function keySearch(){
  if (event.keyCode==13) 
	  getHelpInfo("");
}

function getHelpInfo(typeId){
	var keyword = $("#keyword").val(); 
	var index = $("#pagenumber").val();
	var service = {};
	service.content = keyword; 
	service.typeId = typeId;
	service.parentId = "kfHelp";
	service.page = index;
	service.pagesize = 10;
	var fn="querySysArticle";
	service = Commonjs.jsonToString(service);
	var params = Commonjs.getParams(fn, service);//获取参数
	Commonjs.ajaxTrue(weburl,params,getHelpInfoSuccess,true,"正在加载数据...");
}

function getHelpInfoSuccess(data){
	var notice='';
	if (data.data.length>0){
		BaseForeach(data.data,function(i,item){
			if(i%2==0){
				notice+='<li><span>'+jsonDateFormat(item.publishTime)+'</span>&nbsp;<div>&nbsp;&nbsp;<a target="_blank" href="detail.html?id='+item.id+'">'+item.title+'</a></div></li>';	
			}else{
				notice+='<li class="bgcolor" ><span>'+jsonDateFormat(item.publishTime)+'</span>&nbsp;<div>&nbsp;&nbsp;<a target="_blank" href="detail.html?id='+item.id+'">'+item.title+'</a></div></li>';
			}
		});
		
		if(data.rows>10)
			$("#page").show(); 
		else 
			$("#page").hide();
	}else{
		$("#page").hide();
		notice+='<div style="height:50px;text-align:center;line-height:50px;font-size:16px;width:100%;">未找到相关信息</div>';	
	}
	$('#kfHelptitle').html(notice);
	if(data.rows!=undefined){
		if(data.rows!=0){
			$("#totalcount").val(data.rows);
			console.log(data.rows)
		}else{
			if(data.page==0)$("#totalcount").val(0);
		}
	}else{
		$("#totalcount").val(0);
	}
	Page($("#totalcount").val(),data.pagesize,'pager');	
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
  			getHelpInfo(""); 
  		}
  	}); 	
}