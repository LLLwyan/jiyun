var invoiceId = request("invoiceId");
var id =0;
var state = "";
$(function(){
	getListParamItemByEName();
	queryinvoicecontent();
	deliveryinvoice();
	getUserInvoice();
});

//单选框改变
$('#getListParamItemByEName').change(function(){
	var value = $("input[name='invoice']:checked").val();
    if(value == "1"){
    	$("#invoicehide").show();
    }else{
    	$("#invoicehide").hide();
    }
});

//发票审核
function invoiceAudit(status){
	var auditingResult=$("#auditingResult");
	if(status=="NA"){
		if(Commonjs.isEmpty(auditingResult.val())){
			$.tooltip("请输入审核未通过原因",2000,false);
			return false;
		}
	}

	var content=$("#auditingResult").val().replace(/[\r\n]/g, '<br>');
	content=content.replace(new RegExp('(["\"])', 'g'),"\\\"");

	var service = {};
	service.id = id;
	service.status = status;
	service.courierNumber = $("#courierNumber").val();
	service.auditingResult = encodeURIComponent(content);
	if($("#filesrc").text() != ""){
		service.attachment = $("#filesrc").text();
	}else{
		service.attachment = "";
	}
	var fn="invoiceAudit";
	service = Commonjs.jsonToString(service)
	var params = Commonjs.getParams(fn,service);//获取参数
	Commonjs.ajaxTrue(weburl,params,optSuccess);
}

function optSuccess(data){
	window.location.href="invoicelist.html";
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
        url: sysurl,
        data:params,
		cache : false,
		success: function(data){
			var data=jQuery.parseJSON(data);
			if(data.result=="success"){
				var getListParamItemByEName = "";
				if (data.data.length>0){
					BaseForeach(data.data,function(i,item2){
						if(item2.value=="0"){
							getListParamItemByEName += '<input type="radio" id="radio1" name="invoice" checked="checked" value="'+item2.value+'">'+item2.description+'&nbsp;&nbsp;&nbsp;&nbsp;';
						}else{
						getListParamItemByEName += '<input type="radio" id="radio1" name="invoice" value="'+item2.value+'">'+item2.description+'&nbsp;&nbsp;&nbsp;&nbsp;';
						}
					});
				}
				$("#getListParamItemByEName").append(getListParamItemByEName);
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
        url: sysurl,
        data:params,
		cache : false,
		success: function(data){
			var data=jQuery.parseJSON(data);
			if(data.result=="success"){
				var getListParamItemByEName = "";
				if (data.data.length>0){
					BaseForeach(data.data,function(i,item2){
						if(item2.value=="0"){
							getListParamItemByEName += '<input type="radio" id="radio1" checked="checked" name="invoiceContent" value="'+item2.value+'">'+item2.description+'&nbsp;&nbsp;&nbsp;&nbsp;';
						}else{
							getListParamItemByEName += '<input type="radio" id="radio1" name="invoiceContent" value="'+item2.value+'">'+item2.description+'&nbsp;&nbsp;&nbsp;&nbsp;';
						}

					});
				}
				$("#queryinvoicecontent").append(getListParamItemByEName);
			}
		},
		error: function () {
        	alertNew('服务器忙，请稍候再试！');
    	}
	});
}

//查询发票发货类型
function deliveryinvoice(){
	var service = {};
	service.paramEName = "deliveryInvoice";
	var fn="getListParamItemByEName";
	service = Commonjs.jsonToString(service)
	var params = Commonjs.getParams(fn,service);//获取参数
	$.ajax({
		datatype:"json",
        type:"POST",
        url: sysurl,
        data:params,
		cache : false,
		success: function(data){
			var data=jQuery.parseJSON(data);
			if(data.result=="success"){
				var html = "";
				BaseForeach(data.data,function(i,item){
					var ischecked="";
					if(i==0)
						ischecked='checked="checked"';
					html+='<input type="radio" id="radio_'+i+'" name="deliveryInvoice" '+ischecked+' value="'+item.value+'" disabled=true>'+item.description+'&nbsp;&nbsp;&nbsp;&nbsp;';
				});
				$("#deliveryinvoice").html(html);
			}

		},
		error: function () {
        	alertNew('服务器忙，请稍候再试！');
    	}
	});
}

//获取发票详情
function getUserInvoice(){
	var service = {};
	service.id = invoiceId;
	var fn="queryUserInvoice";
	service = Commonjs.jsonToString(service)
	var params = Commonjs.getParams(fn,service);//获取参数
	Commonjs.ajaxTrue(weburl,params,getUserInvoiceSuccess);
}

function getUserInvoiceSuccess(data){
	if(data.data==null)
		return false;

	var view=data.data;
	state = view.status;
	id = view.id;
	var html='<tr><td colspan="2">发票信息</td></tr>';
	html+='<tr>';
	html+='<th width="20%">发票类型：</th>';
	html+='<td align="left">'+view.typeName+'</td>';
	html+='</tr>';
	html+='<tr>';
	html+='<th>发票抬头：</th>';
	html+='<td align="left">'+view.header+'</td>';
	html+='</tr>';
	html+='<tr>';
	html+='<th>纳税人识别号：</th>';
	html+='<td align="left">'+view.identityId+'</td>';
	html+='</tr>';
	html+='<tr>';
	html+='<th>开户行：</th>';
	html+='<td align="left">'+view.bankName+'</td>';
	html+='</tr>';
	html+='<tr>';
	html+='<th>开户账号：</th>';
	html+='<td align="left">'+cloudEncrypt.decodeSession(view.openAccount)+'</td>';
	html+='</tr>';
	html+='<tr>';
	html+='<th>注册地址：</th>';
	html+='<td align="left">'+view.registerAddress+'</td>';
	html+='</tr>';
	html+='<tr>';
	html+='<th>注册银行联系电话：</th>';
	html+='<td align="left">'+cloudEncrypt.decodeSession(view.contactNumber)+'</td>';
	html+='</tr>';
	html+='<tr>';
	html+='<th>一般纳税证明：</th>';
	html+='<td colspan="1" align="left"><img id="SmallImgV"  src="'+view.materialUrl+'" style="height:120px;width:120px;"  /></td>';
	html+='</tr>';
	html+='<tr>';
	html+='<th>发票金额：</th>';
	html+='<td align="left">¥'+view.price+'</td>';
	html+='</tr>';
	html+='<tr>';
	html+='<th>发票内容：</th>';
	html+='<td align="left">'+view.contentName+'</td>';
	html+='</tr>';
	html+='<tr>';
	html+='<th>收件方地址：</th>';
	html+='<td align="left">'+view.recipientAddress+'</td>';
	html+='</tr>';
	html+='<tr>';
	html+='<th>收件公司名：</th>';
	html+='<td align="left">'+view.companyName+'</td>';
	html+='</tr>';
	html+='<tr>';
	html+='<th>邮政编码：</th>';
	html+='<td align="left">'+view.postcode+'</td>';
	html+='</tr>';
	html+='<tr>';
	html+='<th>收件人：</th>';
	html+='<td align="left">'+view.addressee+'</td>';
	html+='</tr>';
	html+='<tr>';
	html+='<th>联系电话：</th>';
	html+='<td align="left">'+cloudEncrypt.decodeSession(view.telephone)+'</td>';
	html+='</tr>';
	html+='<tr>';
	html+='<th>备注：</th>';
	html+='<td align="left">'+view.remark+'</td>';
	html+='</tr>';
	html+='<tr class="no-border">';
	html+='<th>发票获取途径：</th>';
	html+='<td align="left" >'+view.getTypeName+'</td>';
	html+='</tr>';
	$("#tb").html(html);

	var html="";
	html+='<tr class="no-border">';
	html+='<th width="20%">审核状态：</th>';
	html+='<td align="left" >'+view.statusName+'</td>';
	html+='</tr>';
	if(state!="N"){
		html+='<tr class="no-border">';
		html+='<th>审核人：</th>';
		html+='<td align="left" >'+view.auditor+'</td>';
		html+='</tr>';
		html+='<tr class="no-border">';
		html+='<th>审核时间：</th>';
		html+='<td align="left" >'+jsonDateTimeFormat(view.auditTime)+'</td>';
		html+='</tr>';
	}
	if(state!="Y"){
		html+='<tr>';
		html+='<th>上传附件：</th>';
		html+='<td align="left">';
		html+='<div id="updateSmallImg" class="doctor-info-img" >'
		html+='<input style="width: 66px; padding: 5px 0 0px 0px" type="file" title="点击上传文件" value="点击上传文件" id="SmallImg" onChange="upload(\'SmallImg\',\'SmallImgV\');" onpaste="return false" name="0" />'
		html+='<div id="filediv" style="display: none;">'
		html+='<span  id="fileup"></span>'
		html+='<button type="button" onclick="delloadwork()">删除</button>'
		html+='<span style="display: none;" id="filesrc"></span>'
		html+='</div>'
		html+='<br />'
		html+='<span style="font-size: 12px;">可上传<i style=" font-style:normal;color: red;">1个附件</i>每个附件不得超过1M,附件支持的格式有zip,rar</span>'
		html+='</div>'
		html+='</td>';
		html+='</tr>';
	}else{
		if(view.attachment!=""){
			html+='<tr>';
			html+='<th>下载附件：</th>';
			html+='<td align="left"><a class="manager-btn mr-10" href="'+view.attachment+'" >下载</a></td>';
			html+='</tr>';
			html+='<tr>';
		}
	}
	html+='<tr>';
	html+='<th>快递单号：</th>';
	html+='<td align="left"><input type="text" class="manager-input m-input width288" size="20" style="float:left;" value="'+view.courierNumber+'" id="courierNumber"><label class="redColor f-l10">如是寄件请输入快递单号</label></td>';
	html+='</tr>';
	html+='<tr>';
	html+='<th>审核结果：</th>';
	var result=view.auditingResult.replace('<br>', '\n');
	html+='<td align="left"><textarea id="auditingResult" class="text-box" style="height: 100px;width:500px" class="manager-input m-input width288" maxlength="100" placeholder="请输入审核结果，并且字数不能超过100个字" >'+result+'</textarea>';
	html+='<label class="redColor f-l10">审核不通过必须输入原因</label></td>';
	html+='</tr>';
	html+='<tr class="no-border">';
	html+='<td></td>';
	html+='<td align="center">';
	html+='<div class="searchbtn" style="text-align:left;" >';
	if(state=="Y"){
		html+='<input type="button" id="auditPass" class="manager-btn mr-10" value="编辑" onclick="invoiceAudit(\'Y\')">';
	}else{
		html+='<input type="button" id="auditPass" class="manager-btn mr-10" value="审核通过" onclick="invoiceAudit(\'Y\')">';
		html+='<input type="button" id="auditNoPass" class="manager-btn mr-10" value="审核不通过" onclick="invoiceAudit(\'NA\')">';
	}
	html+='<input type="button" class="manager-btn mr-10" onclick="history.go(-1)" value="返回">';
	html+='</div>';
	html+='</td>';
	html+='</tr>';
	$("#sztb").html(html);


}

//文件上传
function upload(id,image) {
	var filename = $("#"+id).val();
	var index = filename.lastIndexOf('.');
	var type = filename.substring(index+1,filename.length);
	if(type.toLowerCase() != 'zip'&&type.toLowerCase() != 'rar'){
		$.tooltip('注意喔：文件格式必须为.zip|.rar',2000,false);
		return ;
	}
	var arrID = [ id ];
	$.yihuUpload.ajaxFileUpload( {
		url : realPath+'/upload.do',  	// 用于文件上传的服务器端请求地址
		secureuri : false,				// 一般设置为false
		type:"POST",
		fileElementId : arrID,			// 文件上传空间的id属性 <input type="file" id="file" name="file" />
		dataType : 'json',				// 返回值类型 一般设置为json
		success : function(data, status) {
			var uri = data.url;
			uri=uri.replace('fullsize','small');
			var name = data.NewFileName;
			var fname = data.FileName;
			var size = data.Size;
			var old = $("#" + id + "_f");
			$("#filesrc").text(uri);
			$("#fileup").text(filename);
			$("#filediv").show()
		},
		error : function(data, status, e) {
			$.tooltip('图片上传失败：建议您选择不超过1M的图片且在良好的网络环境下继续上传',2000,false);
		}
	});
}

//删除上传的文件
function delloadwork(){
	var service = {};
	var file = $("#filesrc").text();
	service.file = file;
	var fn="delloadwork";
	service = Commonjs.jsonToString(service)
	var params = Commonjs.getParams(fn,service);//获取参数
	Commonjs.ajaxTrue(weburl,params,delloadworkSuccess,false);
}

function delloadworkSuccess(data){
	$.tooltip('操作成功',2000,true);
	$("#filesrc").text("");
	$("#filediv").hide();
}
