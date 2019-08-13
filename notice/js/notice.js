$(function () {
	getNoticeInfo();
});
function getNoticeInfo(){
	var index = $("#pagenumber").val();
	var service = {};
	service.parentId = "notice";
	service.page = index;
	service.pagesize = 10;
	var fn="querySysArticle";
	service = Commonjs.jsonToString(service);
	var params = Commonjs.getParams(fn, service);//获取参数
	$.ajax({
		datatype:"json",
        type:"POST",
        url: weburl,
        data:params,
		cache : false,	
		beforeSend: function() {
			divalertLoad('正在加载数据,请稍等');
		},
		success: function(data){
			var data=jQuery.parseJSON(data);
			if (data.result == "success") {
				$("#noticetitle").empty();
				var notice='';
				if (data.data.length>0){
					BaseForeach(data.data,function(i,item){
						if(i%2==0){
							notice+='<li><span>'+jsonDateFormat(item.publishTime)+'</span>&nbsp;<div>&nbsp;&nbsp;<a href="noticeinfo.html?id='+item.id+'">'+item.title+'</a></div></li>';	
						}else{
							notice+='<li class="bgcolor" ><span>'+jsonDateFormat(item.publishTime)+'</span>&nbsp;<div>&nbsp;&nbsp;<a href="noticeinfo.html?id='+item.id+'">'+item.title+'</a></div></li>';
						}
					});
					$("#page").show();
				}else{
					$("#page").hide();
					notice+=' <div  style="height:50px;text-align:center;line-height:50px;">找不到相关信息</div>';	
				}
				$('#noticetitle').append(notice);
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
		},
		complete: function(){
			divcloseLoad();
		},
		error: function () {
        	alertNew('服务器忙，请稍候再试！');
    	}
	});

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
	  			getNoticeInfo();
	  		}
	  	}); 	
}