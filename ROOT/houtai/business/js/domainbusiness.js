$(function(){
	var start = {
		elem: '#startTime',
		istime: true,
		istoday: false,
	};
	var end = {
		elem: '#endDate',
		istime: true,
		istoday: false,
	};
	laydate(start);
	laydate(end);
	queryUserDomainList();
	getListParamItemByEName();
});

function queryUserDomainList(){
	var domainName=$("#domainName").val();
	var startTime=$("#startTime").val();
	var endDate=$("#endDate").val();
	var domstate=$("#domstate").val();
	var index = $("#pagenumber").val();
	var service = {};
	var fn = "queryAdminDomainList";
	service.domainName = domainName;
	service.startTime = startTime;
	service.endDate =  endDate;
	service.domstate = domstate;
	service.page =index;
	service.pageSize = 10;
	service = Commonjs.jsonToString(service);
	var params = Commonjs.getParams(fn, service);//获取参数
	Commonjs.ajaxTrue(weburl,params,querySuccess);
}

function querySuccess(data){
	if(data.data==null)
		return;
	

	if(data.rows > 0){
		var list=data.data; 
		if(list!=null && list.dataList.length>0){ 
			var domainlist = "";
			BaseForeach(list.dataList,function(i, item){
				domainlist += '<tr><td>'+item.userName+'</td>';
				domainlist += '<td><a href="domainDetails.html?domainName='+item.domainName+'">'+item.domainName+'</a></td>';
				domainlist += '<td>'+item.productName+'</td>';
				domainlist += '<td>'+jsonDateTimeFormat(item.startTime)+'</td>';
				domainlist += '<td>'+jsonDateTimeFormat(item.endTime)+'</td>';
				BaseForeach(data.data.ItemList,function(i, jtem){
					if(item.status==jtem.value){
						domainlist += '<td>'+jtem.description+'</td>';
					}
				});
				domainlist += '<td>';
				domainlist += '<a href="javascript:;" class="btn btn-primary" onclick="delUserDomain(\''+item.domainName+'\',\''+item.id+'\');">删除</a>'
				domainlist += '<a href="javascript:;" onclick="openurl(\''+item.domainName+'\');" class="btn btn-primary">管理</a>'
                domainlist += '<a href="javascript:;" onclick="donmainControl(\''+item.domainName+'\');" class="btn btn-primary">控制面板</a>';
				domainlist += '</td>';
				domainlist+='</tr>';
			});
		} else {
			domainlist+=' <tr><td colspan="8" style="height:50px;text-align:center;line-height:50px;">找不到相关信息</td></tr>';
		}
		$('#domainlist').html(domainlist);
	}
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

//获取域名状态
function getListParamItemByEName(){
	var paramEName="domainStatus";
	var service = {};
	var fn = "getListParamItemByEName";
	service.paramEName = paramEName;
	service = Commonjs.jsonToString(service);
	var params = Commonjs.getParams(fn, service);//获取参数
	Commonjs.ajaxTrue(sysurl,params,getItemByENameSuccess,false);
}

function getItemByENameSuccess(data){
	if(!isNotNull(data.data))
		return false;
	
	var domstate = "";
	domstate += '<option value="">全部</option>';		
	if(data.data.length > 0){
		BaseForeach(data.data,function(i, item){
			domstate +='<option value="'+item.value+'">'+item.description+'</option>'
		});
	}
	$('#domstate').html(domstate);		 	
}

//删除域名
function delUserDomain(domainName,ID){
	var dialog=	art.dialog({
		lock : true,
		opacity : 0.4,
		width : 250,
		title : '提示',
		content : '您确定删除吗？',
		ok : function() {
			var service = {};
			service.id = ID;
			service.domainName = domainName;
			var fn = "delUserDomain";
			service = Commonjs.jsonToString(service);
			var params = Commonjs.getParams(fn, service);//获取参数
			Commonjs.ajaxTrue(weburl,params,delSuccess);
		},
		cancel: function(){
			$('#dialog').hide();
		}
	});
}

function delSuccess(data){
	$.tooltip(data.msg,2000,true);
	queryUserDomainList();
	getListParamItemByEName();
}

//跳转
function openurl(domainName){
	window.location.href='domainmanagement.html?domainName='+domainName;
}

function donmainControl(domainName) {
    window.open("./domainlogin.html?domainName="+domainName);
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
  			queryUserDomainList();
  		}
  	});  	
}