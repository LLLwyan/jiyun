$(function(){
	getListParamItemByEName();
	queryinvoicecontent();
	getAllInvoice();
	$('#start').datepicker(
	{
		dateFormat:'yy-mm-dd',
		dayNamesMin:['日','一','二','三','四','五','六'],
		firstDay:'1',
		changeYear:true,
		yearRange:'1950:2020',
		changeMonth:true,
		monthNamesShort:['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'],
	});
	$('#end').datepicker(
	{
		dateFormat:'yy-mm-dd',
		dayNamesMin:['日','一','二','三','四','五','六'],
		firstDay:'1',
		changeYear:true,
		yearRange:'1950:2020',
		changeMonth:true,
		monthNamesShort:['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'],
	});
});

//查询发票
function getAllInvoice(){
    var index = $("#pagenumber").val();
	var service = {};
	service.page = index;
	service.pagesize = configParam.page.size;
	service.type = $("#invoicetype").val();
	service.content = $("#invoicecontent").val();
	service.start = $("#start").val();
	service.end = $("#end").val();
	var fn="getAllInvoice";
	service = Commonjs.jsonToString(service)
	var params = Commonjs.getParams(fn,service);//获取参数
	Commonjs.ajaxTrue(weburl,params,function (data) {
		getInvoiceSuccess(data, (parseInt(index) -1) * configParam.page.size)
    });
}

function getInvoiceSuccess(data, from){
	if(data.data==null)
		return false;

	$("#realNameMailAuthTbody").html("");
	var userlis="";
	if (data.rows>0){
		BaseForeach(data.data,function(i,item){
		userlis+='<tr class="gradeX">';
		userlis+='<td>'+(from+i+1)+'</td>';
		userlis+='<td>'+item.typeName+'</td>';
		userlis+='<td>'+item.contentName+'</td>';
		userlis+='<td>'+item.price+'</td>';
		userlis+='<td>'+item.addressee+'</td>';
		userlis+='<td>'+item.statusName+'</td>';
		userlis+='<td>'+jsonDateTimeFormat(item.createTime)+'</td>'
		userlis+='<td>';
		userlis+='<a href="javascript:void(0)" onclick="getInvoice('+item.id+',\''+item.status+'\')" class="manager-btn  mr-10">查看</a> '
		userlis+='</td>';
		userlis+='</tr>';
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

function getInvoice(id,status){
	if(status=="Y")
		window.location.href="./invoicedetail.html?invoiceId="+id;
	else
		window.location.href="./uptapply.html?invoiceId="+id;
}

//查询发票类型
function getListParamItemByEName(){
	var service = {};
	service.paramEName = "invoice";
	var fn="getListParamItemByEName";
	service = Commonjs.jsonToString(service)
	var params = Commonjs.getParams(fn,service);//获取参数
	$.ajax({
		datatype:"json",
        type:"POST",
        async: false,
        url: sysurl,
        data:params,
		cache : false,
		success: function(data){
			var data=jQuery.parseJSON(data);
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

		},
		error: function () {
        	alertNew('服务器忙，请稍候再试！');
    	}
	});
}

//查询发票内容
function queryinvoicecontent(){
	var service = {};
	service.paramEName = "invoiceContent";
	var fn="getListParamItemByEName";
	service = Commonjs.jsonToString(service)
	var params = Commonjs.getParams(fn,service);//获取参数
	$.ajax({
		datatype:"json",
        type:"POST",
        async: false,
        url: sysurl,
        data:params,
		cache : false,
		success: function(data){
			var data=jQuery.parseJSON(data);
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

		},
		error: function () {
        	alertNew('服务器忙，请稍候再试！');
    	}
	});
}
function delinvoiceSuccess(data){
	$.tooltip(data.msg,2000,true);
	getUserInvoice();
}

//修改默认模板
function setDefaultTemplate(id,templateName,isDefault){
 art.dialog({
 		id: 'testID',
 	    width: '245px',
	    height: '109px',
 	    content: '您要设置成默认模板吗？',
 	    lock: true,
 	    button: [{
 	      	name: '确定',
 	       	callback: function () {
				var service = {};
				service.id=id;
				service.templateName=templateName;
				service.isDefault=isDefault;
				var fn="setDefaultTemplate";
				service = Commonjs.jsonToString(service)
				var params = Commonjs.getParams(fn,service);//获取参数
				Commonjs.ajaxTrue(weburl,params,setDefaultSuccess,false);
 	       	}
 	 	},{
 	 		name: '取消'
 	 	}]
 	});
}

function setDefaultSuccess(data){
	topSuccess(window, data.msg);
    getAllInvoice();
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
            getAllInvoice();
		}
	});
}
