//工单查询
$(function(){
	$('#startDate').datepicker(
	{
		dateFormat:'yy-mm-dd',	
		dayNamesMin:['日','一','二','三','四','五','六'],
		firstDay:'1',			
		changeYear:true,		
		yearRange:'1950:2020',  
		changeMonth:true,		
		monthNamesShort:['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'],
	});
	$('#endDate').datepicker(
	{
		dateFormat:'yy-mm-dd',	
		dayNamesMin:['日','一','二','三','四','五','六'],
		firstDay:'1',			
		changeYear:true,		
		yearRange:'1950:2020',  
		changeMonth:true,		
		monthNamesShort:['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'],
	});
	
	queryWorkOrderType();
	getIssueStatus();
	queryIssueList();
});

function queryIssueList(){
	var service = {};
	service.page = 	$("#pagenumber").val(); 
	service.pagesize = 10;
	service.workId = $("#workOrderId").val();
	service.startDate = $("#startDate").val();
	service.endDate = $("#endDate").val();
	service.state = $("#workOrderState").val(); 
	service.issueCode = $("#issueType").val();
	var fn="queryIssue";
	service = Commonjs.jsonToString(service)
	var params = Commonjs.getParams(fn,service);//获取参数
	Commonjs.ajaxTrue(weburl,params,queryIssueCountSuccess);
}

function queryIssueCountSuccess(data){
	if(!isNotNull(data.data))
		return false;
	
	var userlis="";
	$("#realNameMailAuthTbody").html("");
	if (data.data.queryIssue.length>0){
		BaseForeach(data.data.queryIssue,function(i,item){
			userlis+='<tr>';
			userlis+='<td>'+item.id+'</td>';
			userlis+='<td style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" title='+item.businessName+'>'+item.businessName+'</td>';
			userlis+='<td>'+item.issueName+'</td>';
			userlis+='<td>'+jsonDateTimeFormat(item.issueTime)+'</td>';
			if(item.state==1 || item.state==5){
				userlis+='<td><span style="color:#090">'+item.statusName+'</span></td>';
			}else if(item.state==2){
				userlis+='<td><span style="color:#090">'+item.statusName+'</span></td>';
			}else if(item.state==3){
				userlis+='<td>'+item.statusName+'</td>';  
			}else if(item.state==4){
				userlis+='<td><span style="color:red">'+item.statusName+'</span></td>';
			}
				
			userlis+='<td>';
			userlis+='<a href="./completed.html?id='+item.id+'&userName='+item.userName+'" class="manager-btn  mr-10">查看</a> '
			if(item.state != 3){  
				userlis+='<a href="#" class="manager-btn  mr-10" onclick="uptUserIssue(\''+item.id+'\',\'close\')">关闭工单</a>&nbsp;'
			}
			userlis+='</td>'
			userlis+='</tr>'
		}); 
		$("#realNameMailAuthTbody").append(userlis);
		$("#page").show();
	}else{
		$("#page").hide();
		userlis+=' <tr><td colspan="10" style="height:50px;text-align:center;line-height:50px;">找不到相关信息</td></tr>';	
		$("#realNameMailAuthTbody").html(userlis);
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

//修改工单
function uptUserIssue(id,opt){
	 art.dialog({
 		id: 'testID',
 	    width: '245px',
 	    height: '109px',
 	    content: '您要关闭工单吗？', 
 	    lock: true,
 	    button: [{
 	      	name: '确定',
 	       	callback: function () {
				var service = {};
				service.id = id;
				service.opt = opt;
				var fn="uptUserIssue";
				service = Commonjs.jsonToString(service)
				var params = Commonjs.getParams(fn,service);//获取参数
				Commonjs.ajaxTrue(weburl,params,uptdateIssueSuccess);
 	       	}
 	    		},{name: '取消'
	 	 }]
	});
}

function uptdateIssueSuccess(data){
	$.tooltip(data.msg,2000,true);
	queryIssueList();
}

//删除工单
function delIssue(id){
	var dialog=	art.dialog({
		lock : true,
		opacity : 0.4,
		width : 250,
		title : '提示',
		content : '您确定删除吗？',
		ok : function() {
			var service = {};
			service.id = id;
			var fn="delIssue";
			service = Commonjs.jsonToString(service)
			var params = Commonjs.getParams(fn,service);//获取参数
			Commonjs.ajaxTrue(weburl,params,delIssueSuccess);						
		},
		cancel: function(){
			$('#dialog').hide();
		}
	});
}

function delIssueSuccess(data){
	$.tooltip(data.msg,2000,true);
	queryIssueList();
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
  			queryIssueList();
  		}
  	});  	
}

//查询工单类型
function queryWorkOrderType(){
	var service = {};
	service.paramEName = "workOrderType";
	var fn="getListParamItemByEName";
	service = Commonjs.jsonToString(service)
	var params = Commonjs.getParams(fn,service);//获取参数
	var data=Commonjs.ajax(sysurl,params,false);
	if(data.result == "success"){
		if(data.data==null) 
			return;
		
		var html = "";	 
		html += '<option value="">请选择</option>';
		if(data.data.length > 0){
			BaseForeach(data.data,function(i, item){
				html +='<option value="'+item.value+'">'+item.description+'</option>'
			});
		}
		$('#issueType').html(html);
	}
}

//获取工单状态
function getIssueStatus(){
	var paramEName="workOrderStatus";
	var service = {};
	var fn = "getListParamItemByEName";
	service.paramEName = paramEName;
	service = Commonjs.jsonToString(service);
	var params = Commonjs.getParams(fn, service);//获取参数
	var data=Commonjs.ajax(sysurl,params,false);
	if(data.result == "success"){
		if(data.data==null) 
			return;
		
		var html = "";	 
		html += '<option value="">请选择</option>';
		if(data.data.length > 0){
			BaseForeach(data.data,function(i, item){
				html +='<option value="'+item.value+'">'+item.description+'</option>'
			});
		}
		$('#workOrderState').html(html);
	}
}