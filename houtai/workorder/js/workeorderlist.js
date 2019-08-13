//后台工单查询
$(function(){
	var start = {
	  elem: '#startDate',
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
	queryWordOrderType();
	getIssueStatus(); 
	queryAdminIssue();
});

//后台查询工单
function queryAdminIssue(){
	var service = {};
	service.page = 	$("#pagenumber").val();
	service.pagesize = 10;
	service.userName = $("#userName").val();
	service.workId = $("#workOrderId").val(); 
	service.startDate = $("#startDate").val();
	if(service.startDate != '') service.startDate += ' 00:00:00';
	service.endDate = $("#endDate").val();
	if(service.endDate != '')service.endDate += ' 59:59:59';
	service.state = $("#workOrderState").val(); 
	service.issueCode = $("#issueType").val();
	var fn="queryAdminIssue";
	service = Commonjs.jsonToString(service)
	var params = Commonjs.getParams(fn,service);//获取参数
	Commonjs.ajaxTrue(weburl,params,queryIssueSuccess);
}

function queryIssueSuccess(data){
	if(data.data == null){
		return false;
	}
	var Issuelis="";
	$("#realNameMailAuthTbody").html("");
	if (data.data.length>0){
		BaseForeach(data.data,function(i,item){
			Issuelis+='<tr class="gradeX">';
			Issuelis+='<td>'+item.id+'</td>';
			Issuelis+='<td>'+item.userName+'</td>';
			Issuelis+='<td style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" title='+item.businessName+'>'+item.businessName+'</td>';
			Issuelis+='<td>'+item.issueName+'</td>';
			Issuelis+='<td>'+jsonDateTimeFormat(item.issueTime)+'</td>';
			if(item.state==1 || item.state==5){ 
				Issuelis+='<td><span style="color:red">'+item.statusName+'</span></td>';
			}else if(item.state==2){
				Issuelis+='<td><span style="color:red">'+item.statusName+'</span></td>';
			}else if(item.state==3){  
				Issuelis+='<td>'+item.statusName+'</td>';  
			}else if(item.state==4){
				Issuelis+='<td><span style="color:#090">'+item.statusName+'</span></td>';
			}
			Issuelis+='<td>';  
			Issuelis+='<a href="./completed.html?id='+item.id+'&userName='+item.userName+'" class="btn btn-primary">查看</a> ';
			Issuelis+='<a href="#" class="btn btn-primary" onclick="delIssue(\''+item.id+'\',\''+item.userName+'\')">删除</a>&nbsp;';
			if(item.state !=3) 
				Issuelis+='<a href="#" class="btn btn-primary" onclick="uptUserIssue(\''+item.id+'\',\'close\')">关闭工单</a>&nbsp;';
			Issuelis+='</td>';
			Issuelis+='</tr>';
		}); 
		if(data.rows!=undefined){
			if(data.rows!=0){
				$("#totalcount").val(data.rows);
			}else{
				if(data.page==0)$("#totalcount").val(0);
			}
		}else{
			$("#totalcount").val(0);
		}
		$("#page").show();
		Page($("#totalcount").val(),data.pagesize,'pager');	
	}else{
		$("#page").hide();
		Issuelis+=' <tr><td colspan="10" style="height:50px;text-align:center;line-height:50px;">找不到相关信息</td></tr>';	
	} 
	$("#realNameMailAuthTbody").append(Issuelis);
}

//查询工单类型
function queryWordOrderType(){
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

//删除工单
function delIssue(id,userName){
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
			service.userName = userName;
			var fn="delIssue";
			service = Commonjs.jsonToString(service)
			var params = Commonjs.getParams(fn,service);//获取参数
			Commonjs.ajaxTrue(weburl,params,delIssueSuccess);
 	       	}
 	    },{	
 	 		name: '取消'
 	 	}]
 	});
}

function delIssueSuccess(data){
	$.tooltip(data.msg,2000,true);
	queryAdminIssue();
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
				var fn="adminUptIssue";
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
	queryAdminIssue();
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
  			queryAdminIssue();
  		}
  	});  	
}