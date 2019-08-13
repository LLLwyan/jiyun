$(function(){
	getListParamItemByEName();
	queryinvoicecontent();
	getAllInvoice();	
});

//查询发票
function getAllInvoice(){
	var service = {};
	service.page = $("#pagenumber").val();
	service.pageSize = 10;
	service.type = $("#invoicetype").val();
	service.header=$("#txtHeader").val();
	service.content = $("#invoicecontent").val();
	service.start = $("#start").val();
	service.end = $("#end").val();
	var fn="getAllInvoice";
	service = Commonjs.jsonToString(service)
	var params = Commonjs.getParams(fn,service);//获取参数
	Commonjs.ajaxTrue(weburl,params,getInvoiceSucess);
}

function getInvoiceSucess(data){	
	if(data.data == null)
		return false;

	$("#realNameMailAuthTbody").html("");
	var userlis="";
	if (data.rows>0){
		BaseForeach(data.data,function(i,item){
		userlis+='<tr class="gradeX">';
		userlis+='<tr><td><input value="'+item.id+'" type="checkbox" style="margin-top:5px;" name="chkBox" ></td>';
		userlis+='<td>'+item.userName+'</td>'
		userlis+='<td>'+item.typeName+'</td>';   
		userlis+='<td>'+item.contentName+'</td>';
		userlis+='<td>'+item.price+'</td>';
		userlis+='<td>'+jsonDateTimeFormat(item.createTime)+'</td>'
		if(item.status=="Y")
			userlis+='<td><span style="color:#090">'+item.statusName+'</span></td>';
		else
			userlis+='<td><span style="color:#F90">'+item.statusName+'</span></td>';	
		userlis+='<td>'+item.auditor+'</td>';
		userlis+='<td>'+jsonDateTimeFormat(item.auditTime)+'</td>'
		userlis+='<td>';
		if(item.status=="Y"){ 
			userlis+='<a href="./uptapply.html?invoiceId='+item.id+'" class="btn btn-primary">查看</a>';
		}else{
			userlis+='<a href="./uptapply.html?invoiceId='+item.id+'" class="btn btn-primary">审核</a>';
		}
		userlis+='</td>'
		userlis+='</tr>'	
	});
	$("#realNameMailAuthTbody").append(userlis);		
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
		$("#page").show();
	}else{
		$("#realNameMailAuthTbody").html("");
		var userlis=' <tr><td colspan="10" style="height:50px;text-align:center;line-height:50px;">找不到相关信息</td></tr>';	
		$("#realNameMailAuthTbody").append(userlis);
		$("#page").hide();	
	}				
}

//查询发票类型
function getListParamItemByEName(){
	var service = {};
	service.paramEName = "invoice";
	var fn="getListParamItemByEName";
	service = Commonjs.jsonToString(service)
	var params = Commonjs.getParams(fn,service);//获取参数
	var data=Commonjs.ajax(sysurl,params,false);
	if(data.result=="success"){
		var getListParamItemByEName = "";
		if (data.data.length>0){
			getListParamItemByEName += '<option value="">请选择</option>'    
			BaseForeach(data.data,function(i,item2){
				getListParamItemByEName += '<option value="'+item2.value+'">'+item2.description+'</option>'
			});
		}
		$("#invoicetype").append(getListParamItemByEName);
	}
}

//查询发票内容
function queryinvoicecontent(){
	var service = {};
	service.paramEName = "invoiceContent";
	var fn="getListParamItemByEName";
	service = Commonjs.jsonToString(service)
	var params = Commonjs.getParams(fn,service);//获取参数
	var data=Commonjs.ajax(sysurl,params,false);
	if(data.result=="success"){
		var getListParamItemByEName = "";
		if (data.data.length>0){
			getListParamItemByEName += '<option value="">请选择</option>'    
				BaseForeach(data.data,function(i,item2){
					getListParamItemByEName += '<option value="'+item2.value+'">'+item2.description+'</option>'
				});
		}
		$("#invoicecontent").append(getListParamItemByEName);
	}
}

//删除发票
function delinvoice(id,userName){
	var dialog=	art.dialog({
		lock : true,
		opacity : 0.4,
		width : 250,
		title : '提示',
		content : '您确定删除吗？',
		ok : function() {
			var service = {};
			service.id=id;
			service.userName = userName;
			var fn="delinvoice";
			service = Commonjs.jsonToString(service)
			var params = Commonjs.getParams(fn,service);//获取参数
			Commonjs.ajaxTrue(weburl,params,delinvoiceSuccess,false);
	},cancel: function(){
			$('#dialog').hide();
		}
	});
}

function delinvoiceSuccess(data){
	$.tooltip(data.msg,2000,true);
	getAllInvoice();
}

function uptStauts(id,userName){
	var dialog=	art.dialog({
		lock : true,
		opacity : 0.4,
		width : 250,
		title : '提示',
		content : '您确定要转换成已处理吗？',
		ok : function() {
				var service = {};
				service.id=id;
				service.userName = userName;
				var fn="uptStauts";
				service = Commonjs.jsonToString(service)
				var params = Commonjs.getParams(fn,service);//获取参数	
				Commonjs.ajaxTrue(weburl,params,uptStautsSuccess,false);
		},cancel: function(){
			$('#dialog').hide();
		}
	});
}

function uptStautsSuccess(data){
	$.tooltip(data.msg,2000,true);
	getAllInvoice();
}

function checkAllOrder(checkall){
	if(checkall.checked){    
		$("input[name='chkBox']").prop("checked",true); 
		$("input[name='checkBoxAll']").prop("checked",true); 
		
	}else{    
		$("input[name='chkBox']").prop("checked",false);	
		$("input[name='checkBoxAll']").prop("checked",false);			
	}
}

function exportExcel(){
	var json = "";
	json += '{"id":"';
	$("input:checkbox:checked").each(function(i,item){
		if($(this).val()!="on"){
			json +=$(this).val()+',';
		}
	});
	json = json.substring(0,json.length-1);
	json += '"}';
	var fn="exportExcel";
	var params = Commonjs.getParams(fn,json);//获取参数
	Commonjs.ajaxTrue(weburl,params,exportExcelSUccess);
}

function exportExcelSUccess(data){
	window.location.href=data.data;
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
  			getTemplateListPage();
  		}
  	});
}