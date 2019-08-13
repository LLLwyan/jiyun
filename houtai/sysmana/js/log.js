var sysloginfo = request("sysloginfo");
$(function(){
	 var start2 = {
		 elem: '#startTime',
		 istime: false,
		 istoday: false,
	};
	 var end2 = {
		  elem: '#endTime',
		  istime: false,
		  istoday: false,
	};
	laydate(start2);
	laydate(end2);
	var start3 = {
		  elem: '#fromTime',
		  istime: false,
		  istoday: false,
	};
	var end3 = {
	  elem: '#toTime',
	  istime: false,
	  istoday: false,
	};
	laydate(start3);
	laydate(end3);
	var start4 = {
	  elem: '#userStartTime',
	  istime: false,
	  istoday: false,
	};
	var end4 = {
	  elem: '#userEndTime',
	  istime: false,
	  istoday: false,
	};
	laydate(start4);
	laydate(end4);
	if(sysloginfo != ""){	 
		 $("#fromTime").val(laydate.now(0,'YYYY-MM-DD'));
		 $("#toTime").val(laydate.now(+1,'YYYY-MM-DD'));
		 $("#syslog").show();
		 $("#editable").show();
		 $("#page").show();
		 $("#userlogquer").hide();
		 $("#userlogeditable").hide();
		 $("#pagelog").show();
		 $("#pagenumber").val(1)
		 queryerr();
	}else{
		 $("#close").removeClass("liactive");
		 $("#open").addClass("liactive");
		 $("#syslog").hide();
		 $("#editable").hide();
		 $("#userlogquer").show();
		 $("#userlogeditable").show();
		 $("#pagenumber").val(1);
		 $("#logTypeId").val(-1);
		 $("#startTime").val("");
		 $("#endTime").val("");
		 $("#module").val("");
		 $("#syslogdel").hide();
		 queryuserlog();
	 }
	$(".managertitle ul li").click(function(){
		 $(this).addClass("liactive").siblings().removeClass("liactive"); //切换选中的按钮高亮状态
		 var index=$(this).index(); //获取被按下按钮的索引值，需要注意index是从0开始的
		 if(index==0){ 
			 $("#syslog").hide();
			 $("#editable").hide();
			 $("#userlogquer").show();
			 $("#userlogeditable").show();
			 $("#pagenumber").val(1);
			 $("#logTypeId").val(-1);
			 $("#startTime").val("");
			 $("#endTime").val("");
			 $("#module").val("");
			 $("#syslogdel").hide();
			 queryuserlog();
		 }else if(index==1){ 
			 $("#syslog").show();
			 $("#editable").show();
			 $("#userlogquer").hide();
			 $("#userlogeditable").hide();
			 $("#syslogdel").hide();
			 $("#pagenumber").val(1);
			 queryerr();
		 }else if(index==2){
			 $("#syslog").hide();
			 $("#editable").hide();
			 $("#userlogquer").hide();
			 $("#userlogeditable").hide();
			 $("#pagenumber").val(1);
			 $("#page").hide();
			 $("#syslogdel").show();
		 }
	 });
});

function queryerr(){
	var fromTime=$("#fromTime").val();
	var toTime=$("#toTime").val();
	if(fromTime!=""&&toTime!=""){
		if(fromTime>toTime){
			$.tooltip('开始时间不能大于结束时间',2000,false); 
			return false;
		}
	}
	var service = {};
	var index = $("#pagenumber").val();
	service.fromTime=fromTime.replace(/-/g,"")+'000000';
	service.toTime=toTime.replace(/-/g,"")+'235959';
	service.page=index;
	service.pagesize=10
	var fn="queryerr";
	service = Commonjs.jsonToString(service)
	var params = Commonjs.getParams(fn,service);//获取参数
	Commonjs.ajaxTrue(sysurl,params,queryerrSuccess);
}

function queryerrSuccess(data){
	if(data.data==null)
		return;
	
	var userlog=""; 
	if (data.data.length>0){ 
			BaseForeach(data.data,function(i,item){
				userlog+='<tr>';
				userlog+='<td>'+item.id+'</td>';
				userlog+='<td>'+item.userName+'</td>'
				userlog+='<td><div style="width:300px;overflow:hidden; white-space:nowrap; text-overflow:ellipsis">'+item.logDesc+'</div></td>';
				userlog+='<td>'+item.module+'</td>';
				userlog+='<td>'+item.logTypeName+'</td>';
				userlog+='<td>'+item.logTime+'</td>'; 
				userlog+='<td><a class="btn btn-primary" href="sysloginfo.html?id='+item.id+'&type=syslog">详 情</a></td>';
				userlog+='</tr>'; 
			}); 
		$("#page").show();
	}else{
		$("#page").hide();  
		userlog+=' <tr><td colspan="10" style="height:50px;text-align:center;line-height:50px;">找不到相关信息</td></tr>';
	}
	$("#userlist").html(userlog);
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

//操作日志
function queryuserlog(){
	var module =$("#module").val();
	var startTime=$("#startTime").val();
	var endTime=$("#endTime").val();
	var userName = $("#username").val();
	var content = $("#content").val();
	if(startTime!=""&&endTime!=""){
		if(fromTime>toTime){
			$.tooltip('开始时间不能大于结束时间',2000,false); 
			return false;
		}
	}
	var service = {};
	service.startTime = startTime;
	service.endTime = endTime;
	service.page=$("#pagenumber").val();
	service.pagesize=10;
	service.userName = userName;
	service.content = content;
	var fn="querylog";
	service = Commonjs.jsonToString(service);
	var params = Commonjs.getParams(fn,service);//获取参数
	Commonjs.ajaxTrue(sysurl,params,queryuserlogSuccess);
}

function queryuserlogSuccess(data){
	if(data.data == null){
		return false;
	}
	$("#userlog").html("");
	var userlog="";
	if (data.rows >0){
			BaseForeach(data.data,function(i,item){
				userlog+='<tr>';
				userlog+='<td>'+item.id+'</td>';   
				userlog+='<td>'+item.userName+'</td>'; 
				userlog+='<td><div style="width:300px;overflow:hidden; white-space:nowrap; text-overflow:ellipsis">'+item.logDesc+'</div></td>';
				userlog+='<td>'+item.module+'</td>';
				userlog+='<td>'+item.logTypeName+'</td>';
				userlog+='<td>'+jsonDateTimeFormat(item.logTime)+'</td>';
				userlog+='<td><a class="btn btn-primary" href="sysloginfo.html?id='+item.id+'&type=userlog">详 情</a></td>';
				userlog+='</tr>';
			});
		$("#page").show(); 
	}else{
		$("#page").hide();
		userlog+=' <tr><td colspan="10" style="height:50px;text-align:center;line-height:50px;">找不到相关信息</td></tr>';
	}
	$("#userlog").append(userlog);
	if(data.rows!=undefined){
		if(data.rows!=0){
			$("#totalcount").val(data.rows);
		}else{
			if(data.page==0)$("#totalcount").val(0);
		}
	}else{
		$("#totalcount").val(0);
	}
	Pagelog($("#totalcount").val(),data.pagesize,'pager');
}

function delUserLog(){
	var logTypeId = $("#logType").val();
	var module =$("#usermodule").val();
	var startTime=$("#userStartTime").val();
	var endTime=$("#userEndTime").val();
	var username = $("#username").val();
	if(startTime!=""&&endTime!=""){
		if(fromTime>toTime){
			$.tooltip('开始时间不能大于结束时间',2000,false); 
			return false;
		}
	}
	if(startTime == ""){
		$.tooltip('开始日期不能为空',2000,false); 
		return false;
	}

	if(endTime == ""){
		$.tooltip('结束日期不能为空',2000,false); 
		return false;
	}
	var service = {};
	service.startTime = startTime;
	service.endTime = endTime;
	service.userName = username;
	service.module = module;
	service.logTypeId = logTypeId;
	var fn="deluserLog";
	service = Commonjs.jsonToString(service);
	var params = Commonjs.getParams(fn,service);//获取参数
	Commonjs.ajaxTrue(sysurl,params,delUserLogSuccess,false);
}

function delUserLogSuccess(data){
	$.tooltip(data.msg,2000,true);
	console.log(data);
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
			queryerr();
  		}
  	});
}

//管理日志分页	
function Pagelog(totalcounts,pagecount,pager) {
	$("#"+pager).pager( {
		totalcounts : totalcounts,
		pagesize : 10,
		pagenumber : $("#pagenumber").val(),
		pagecount : parseInt(totalcounts/pagecount)+(totalcounts%pagecount >0?1:0),
		buttonClickCallback : function(al) {
			$("#pagenumber").val(al);
			queryuserlog();
		}
	});
}
 