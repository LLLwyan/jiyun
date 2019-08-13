$(function (){
	$("#usertip").hide();
	var service = {};
	var fn="getAccountDetail";
	service = Commonjs.jsonToString(service)
	var params = Commonjs.getParams(fn,service);//获取参数
	Commonjs.ajaxTrue(weburl,params,getAccountDetail);
	queryNews();
});

function getAccountDetail(data){
	var data=data.data;
	if(isNotNull(data)){
		if(data.fullName!=""&&data.email!=""&&data.certCode!=""&&data.certType!=""&&data.mobile!=""&&data.QQ!=""&&data.industry!=""&&data.provinceCode!=""&&data.cityCode!=""&&data.address!=""){
			$("#hideuser").hide();
		}
		$('#hluserId').html(data.userId);
		$('#userName').html(data.userName);
		$('#levelName').html(data.levelName);
		$('#regIP').html(data.regIP);
		$('#regTime').html(data.loginTime);
		$('#balance').html("￥"+data.balance);
		$('#integral').html(data.integral);
		$('#userCountDomain').html("<a href='../business/domain/domain.html'>"+data.userCountDomain+"</a>");
		$('#userCountDomainExpire').html("<a href='../business/domain/domain.html?endDateType=1'>"+data.userCountDomainExpire+"</a>");
		$('#userCountDomainExpiring').html("<a href='../business/domain/domain.html?endDateType=7'>"+data.userCountDomainExpiring+"</a>");
		$('#userCountService').html("<a href='../business/cloud/server.html'>"+data.userCountService+"</a>");
		$('#userCountServiceExpire').html("<a href='../business/cloud/server.html?endDateType=1'>"+data.userCountServiceExpire+"</a>");
		$('#userCountServiceExpiring').html("<a href='../business/cloud/server.html?endDateType=7'>"+data.userCountServiceExpiring+"</a>");
        $('#userCountVhost').html("<a href='../business/vhost/index.html'>"+data.userCountVhost+"</a>");
        $('#userCountVhostExpire').html("<a href='../business/vhost/index.html?endDateType=1'>"+data.userCountVhostExpire+"</a>");
        $('#userCountVhostExpiring').html("<a href='../business/vhost/index.html?endDateType=7'>"+data.userCountVhostExpiring+"</a>");
        $('#userCountDiy').html("<a href='../business/diy/index.html'>"+data.userCountDiy+"</a>");
        $('#userCountDiyExpire').html("<a href='../business/diy/index.html?endDateType=1'>"+data.userCountDiyExpire+"</a>");
        $('#userCountDiyExpiring').html("<a href='../business/diy/index.html?endDateType=7'>"+data.userCountDiyExpiring+"</a>");
        if (!Commonjs.isEmpty(data.crmName)) {
        	$('#crmName').html(data.crmName);
        	$('#crmDiv').css('display', '');
		}
        if (!Commonjs.isEmpty(data.csstName)) {
            $('#csstName').html(data.csstName);
            $('#csstDiv').css('display', '');
        }
    }
}

//获取公告
function queryNews(){
	var service = {};
	service.parentId = "news";
	var fn="querySysArticleList";
	service = Commonjs.jsonToString(service);
	var params = Commonjs.getParams(fn,service);//获取参数
	Commonjs.ajaxTrue(weburl,params,queryNewsSuccess,false);
}

function queryNewsSuccess(data){
	if(data.data == null){
		return false;
	}
	$("#news").empty();
	var news='';
	if (data.data.length>0){
		BaseForeach(data.data,function(i,item){
			if(i<5){
				if(i<3){
					news+='<li onclick="notice_clicka(this,"Noticeliststb",0)"><em style="background-color: rgb(255, 128, 65);">&nbsp;</em><a href="../../news/newsinfo.html?id='+item.id+'" target="_blank">'+item.title+'</a><span>'+jsonDateFormat(item.publishTime)+'</span></li>';
				}else{
					news+='<li><em>&nbsp;</em><a href="../../news/newsinfo.html?id='+item.id+'" target="_blank">'+item.title+'</a><span>'+jsonDateFormat(item.publishTime)+'</span></li>';
				}
			}
		});
	}
	$('#news').append(news);
}
