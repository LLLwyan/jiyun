var invoiceId = request("invoiceId");
$(function(){
	getUserInvoice();
});

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
	var html="";
	html+='<tr>';
	html+='<th width="24%">发票类型：</th>'; 
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
	html+='<td align="left">'+view.openAccount+'</td>';
	html+='</tr>';
	html+='<tr>';
	html+='<th>注册地址：</th>';
	html+='<td align="left">'+view.registerAddress+'</td>';
	html+='</tr>';
	html+='<tr>';
	html+='<th>注册联系电话：</th>';
	html+='<td align="left">'+view.contactNumber+'</td>';
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
	html+='<th width="24%">发票内容：</th>';
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
	html+='<td align="left">'+view.telephone+'</td>';
	html+='</tr>';
	html+='<tr>';
	html+='<th>备注：</th>';
	html+='<td align="left">'+view.remark+'</td>';
	html+='</tr>';
	html+='<tr class="no-border">';
	html+='<th>发票获取途径：</th>';
	html+='<td align="left" id="deliveryinvoice">'+view.getTypeName+'</td>';
	html+='</tr>';
	if(view.courierNumber!=""){  
		html+='<tr>';
		html+='<th>快递单号：</th>';
		html+='<td align="left">'+view.courierNumber+'</td>';
		html+='</tr>';
	}
	if(view.attachment!=""){
		html+='<tr>';
		html+='<th>下载附件：</th>';
		html+='<td align="left">';
		html+='<a class="manager-btn mr-10" href="'+view.attachment+'" >下载</a>';
		html+='</td></tr>';
	}
	
	$("#tb").html(html);
}