$(function(){
	getListParamItemByEName();
	queryinvoicecontent();
	queryHistory();
	deliveryinvoice();
	getUserAccountAmount();
});

function addUserInvoice(){
	var invoiceName = $("#invoiceName").val();
	var type = $("input[name='invoice']:checked").val();
	var header = $("#headerInvoice").val();
	var identityId = $("#identityId").val();
	var bankName = $("#bankName").val();
	var openAccount = $("#openAccount").val();
	var registerAddress = $("#registerAddress").val();
	var contactNumber = $("#contactNumber").val();
	var price = $("#price").val();
	var amount = $("#amount").text();
	var content = $("input[name='invoiceContent']:checked").val();
	var recipientAddress = $("#recipientAddress").val();
	var companyName = $("#companyName").val();
	var postcode = $("#postcode").val();
	var addressee = $("#addressee").val();
	var telephone = $("#telephone").val();
	var remark = $("#remark").val();
	var getType = $("input[name='deliveryInvoice']:checked").val();
	var paramEName = $("input[name='deliveryInvoice']:checked").attr("name");
	var money = $("input[name='deliveryInvoice']:checked").attr("money");
	if(type==""){
		$.tooltip("发票类型不能为空",2000,false);
		return false;
	}
	if(Commonjs.isEmpty(header)){
		$.tooltip('发票抬头不能为空',2000,false);
		return false;
	}
	if(Commonjs.isEmpty(identityId)){
		$.tooltip("纳税人识别号不能为空",2000,false);
		return false;
	}
	if(type=="1" && Commonjs.isEmpty(bankName)){
		$.tooltip("开户行不能为空",2000,false);
		return false;
	}
	if(type=="1" && Commonjs.isEmpty(openAccount)){
		$.tooltip("开户账号不能为空",2000,false);
		return false;
	}
	if(type=="1" && Commonjs.isEmpty(registerAddress)){
		$.tooltip("注册地址不能为空",2000,false);
		return false;
	}
	if(type=="1" && price==""){
		$.tooltip('发票金额不能为空',2000,false);
		return false;
	}
	if(isNaN(price)){
		$.tooltip('发票金额只能为数字',2000,false);
		return false;
	}
	if(content==""){
		$.tooltip("发票内容不能为空",2000,false);
		return false;
		}
	if(Commonjs.isEmpty(recipientAddress)){
		$.tooltip('收件方地址不能为空',2000,false);
		return false;
	}
	if(Commonjs.isEmpty(companyName)){
		$.tooltip('收件公司名不能为空',2000,false);
		return false;
	}
	if(Commonjs.isEmpty(postcode)){
		$.tooltip('邮政编码不能为空',2000,false);
		return false;
	}
	if(isNaN(postcode)){
		$.tooltip('请输入正确的邮政编码格式',2000,false);
		return false;
	}
	if(Commonjs.isEmpty(addressee)){
		$.tooltip('收件人不能为空',2000,false);
		return false;
	}
	if(Commonjs.isEmpty(telephone)){
		$.tooltip('联系电话不能为空',2000,false);
		return false;
	}
	if(!CndnsValidate.checkTel1(telephone)){
		$.tooltip('请输入正确的联系电话格式',2000,false);
		return false;
	}
	if(getType==""){
		$.tooltip("发票获取途径不能为空",2000,false);
		return false;
	}

	var service = {};
	service.name = invoiceName;
	service.type = type;
	service.header = header;
	service.identityId = identityId;
	service.bankName = bankName;
	service.openAccount = cloudEncrypt.encodeSession(openAccount);
	service.registerAddress = registerAddress;
	service.contactNumber = cloudEncrypt.encodeSession(contactNumber);
	if($("#SmallImgV").attr("src") != "../../images/show.jpg"){
		service.materialUrl = $("#SmallImgV").attr("src");
	}else{
		service.materialUrl = "";
	}
	service.price = price;
	service.amount = amount;
	service.content = content;
	service.recipientAddress = recipientAddress;
	service.companyName = companyName;
	service.postcode = postcode;
	service.addressee = addressee;
	service.telephone = cloudEncrypt.encodeSession(telephone);
	service.remark = remark;
	service.getType = getType;
	service.getParamEName = paramEName;
	var fn = "addUserInvoice";
	service = Commonjs.jsonToString(service);
	var params = Commonjs.getParams(fn,service);//获取参数
	var content = null;
	money=parseInt(money);
	if(money>0){
		content = '您申请的发票快递费用'+money+'元,系统将自动扣取?';
		submit(content,weburl,params);
	}else{
		Commonjs.ajaxTrue(weburl,params,addInvoiceSuccess,false);
	}
}

function submit(content,weburl,params){
	var dialog=	art.dialog({
		lock : true,
		opacity : 0.4,
		width : 250,
		title : '提示',
		content : content,
		ok : function() {
			Commonjs.ajaxTrue(weburl,params,addInvoiceSuccess,false);
		},
		cancel: function(){
			$('#dialog').hide();
		}
	});
}

function addInvoiceSuccess(data){
	if(data==null){
		return false;
	}
	$.tooltip(data.msg,2000,true);
	window.location.href="queryinvoice.html";
}

//查询发票类型
function getListParamItemByEName(){
	var service = {};
	service.paramEName = "invoice";
	var fn="getListParamItemByEName";
	service = Commonjs.jsonToString(service)
	var params = Commonjs.getParams(fn,service);//获取参数
	Commonjs.ajaxTrue(sysurl,params,getListItemSuccess);
}

function getListItemSuccess(data){
	 if(data==null){
		 return false;
	 }
	var getListParamItemByEName = "";
	BaseForeach(data.data,function(i,item2){
		if(item2.value=="0"){
			getListParamItemByEName += '<input type="radio" id="radio1" name="invoice" checked="checked" value="'+item2.value+'">'+item2.description+'&nbsp;&nbsp;&nbsp;&nbsp;';
		}else{
			getListParamItemByEName += '<input type="radio" id="radio1" name="invoice" value="'+item2.value+'">'+item2.description+'&nbsp;&nbsp;&nbsp;&nbsp;';
		}
	});
	$("#getListParamItemByEName").append(getListParamItemByEName);

    $('#getListParamItemByEName').find('input').on('click', function () {
        var val = $(this).val().toString();
        if ('0' == val) {
            $('.specialInvoice').css('display', 'none');
        } else if ('1' == val) {
            $('.specialInvoice').css('display', '');
        }
    });
    $('#getListParamItemByEName').find('input').get(0).click();
}

//查询发票内容
function queryinvoicecontent(){
	var service = {};
	service.paramEName = "invoiceContent";
	var fn="getListParamItemByEName";
	service = Commonjs.jsonToString(service)
	var params = Commonjs.getParams(fn,service);//获取参数
	Commonjs.ajaxTrue(sysurl,params,queryContentSuccess);
}

function queryContentSuccess(data){
	if(data==null)
		return false;

	var html = "";
	BaseForeach(data.data,function(i,item2){
		if(item2.value=="0"){
			html += '<input type="radio" id="radio1" checked="checked" name="invoiceContent" value="'+item2.value+'">'+item2.description+'&nbsp;&nbsp;&nbsp;&nbsp;';
		}else{
			html += '<input type="radio" id="radio1" name="invoiceContent" value="'+item2.value+'">'+item2.description+'&nbsp;&nbsp;&nbsp;&nbsp;';
		}
	});
	$("#queryinvoicecontent").html(html);
}

//查询发票发货类型
function deliveryinvoice(){
	var service = {};
	service.paramEName = "deliveryInvoice";
	var fn="getListParamItemByEName";
	service = Commonjs.jsonToString(service)
	var params = Commonjs.getParams(fn,service);//获取参数
	Commonjs.ajaxTrue(sysurl,params,deliverySuccess);
}

function deliverySuccess(data){
	 if(data==null){
		 return false;
	 }
	var html = "";
	BaseForeach(data.data,function(i,item){
		var ischecked="";
		if(i==0)
			ischecked='checked="checked"';
		html+='<input type="radio" id="radio_'+i+'" name="deliveryInvoice" '+ischecked+' value="'+item.value+'" money ="'+item.remark+'">'+item.description+'&nbsp;&nbsp;&nbsp;&nbsp;';
	});
	$("#deliveryinvoice").html(html);
}

function queryHistory(){
	var service = {};
	var fn="queryHistory";
	service = Commonjs.jsonToString(service)
	var params = Commonjs.getParams(fn,service);//获取参数
	Commonjs.ajaxTrue(weburl,params,queryHistorySuccess);
}

function queryHistorySuccess(data){
	if(data==null)
		 return false;

	var html = "";
	html += '<select class="manager-select m-select width200" id="u_certType">';
	if (data.data.length>0){
		html += '<option value="" >请选择</option>';
		BaseForeach(data.data,function(i,item2){
			html += '<option value="'+item2.id+'">'+item2.name+'</option>';
		});
	}else{
		html += '<option value="" >暂无记录</option>';
	}
	html +='</select>';
	$("#queryHistory").html(html);
}

//下拉框改变
$('#queryHistory').change(function(){
	var value = $("#u_certType").val();
	if(value != ""){
		var service = {};
		service.id = value;
		var fn="queryUserInvoice";
		service = Commonjs.jsonToString(service)
		var params = Commonjs.getParams(fn,service);//获取参数
		Commonjs.ajaxTrue(weburl,params,selectHistorySuccess);
	}
});

function selectHistorySuccess(data){
	if(data.data==null)
		 return false;

	state = data.data.status;
	if(state=="Y"){
		$("#historybutton").hide();
	}else{
		$("#historybutton").show();
	}
	$("input[name='invoice']:checked").removeAttr("checked");
	var tdid=document.getElementById('getListParamItemByEName');
	var allInput=tdid.getElementsByTagName('input');
	for(var i=0;i<allInput.length;i++){
		if(allInput[i].value==data.data.type){
			allInput[i].checked="true";
			break;
		}
	}
	$("#headerInvoice").val(data.data.header);
	$("#identityId").val(data.data.identityId);
	$("#bankName").val(data.data.bankName);
	$("#openAccount").val(data.data.openAccount);
	$("#registerAddress").val(data.data.registerAddress);
	$("#contactNumber").val(data.data.contactNumber);
	if(data.data.materialUrl!= ""){
		$("#SmallImgV").attr('src',data.data.materialUrl);
	}
	$("#price").val(data.data.price);
	$("input[name='invoiceContent']:checked").removeAttr("checked");
	tdid="";
	allInput={};
	tdid=document.getElementById('queryinvoicecontent');
	allInput=tdid.getElementsByTagName('input');
	for(var i=0;i<allInput.length;i++){
		if(allInput[i].value==data.data.content){
			allInput[i].checked="true";
			break;
		}
	}
	$("#recipientAddress").val(data.data.recipientAddress);
	$("#companyName").val(data.data.companyName);
	$("#postcode").val(data.data.postcode);
	$("#addressee").val(data.data.addressee);
	$("#telephone").val(data.data.telephone);
	$("#remark").val(data.data.remark);
	$("input[name='deliveryInvoice']:checked").removeAttr("checked");
	tdid="";
	allInput={};
	tdid=document.getElementById('deliveryinvoice');
	allInput=tdid.getElementsByTagName('input');
	for(var i=0;i<allInput.length;i++){
		if(allInput[i].value==data.data.getType){
			allInput[i].checked="true";
			break;
		}
	}
}
function getUserAccountAmount(){
	var service={};
	fn="getAllSureInvoice";
	service = Commonjs.jsonToString(service)
	var params = Commonjs.getParams(fn,service);//获取参数
	$.ajax({
		datatype:"json",
        type:"POST",
        url: weburl,
        data:params,
		cache : false,
		success: function(data){
			var data=jQuery.parseJSON(data);
			if(data.result == "success"){
				$("#amount").text(data.data.total);
			}else{
				Commonjs.alert(data.msg);
				$("#amount").text("0.00");
			}
		}
	});
}

//文件上传
function upload(id,image) {
	var filename = $("#"+id).val();
	var index = filename.lastIndexOf('.');
	var type = filename.substring(index+1,filename.length);
	if(type.toLowerCase() != 'jpg' && type.toLowerCase() != 'gif'
		&& type.toLowerCase() != 'png'&&type.toLowerCase() != 'jpeg'){
		$.tooltip('注意喔：图片格式必须为.jpeg|.gif|.jpg|.png',2000,false);
		return ;
	}
	var arrID = [ id ];
	$.yihuUpload.ajaxFileUpload( {
		url : realPath+'/upload.do',	 // 用于文件上传的服务器端请求地址
		secureuri : false,				 // 一般设置为false
		type:"POST",
		fileElementId : arrID,// 文件上传空间的id属性 <input type="file" id="file" name="file" />
		dataType : 'json',// 返回值类型 一般设置为json
		success : function(data, status) {
			var uri = data.url;
			uri=uri.replace('fullsize','small');
			var name = data.NewFileName;
			var fname = data.FileName;
			var size = data.Size;
			var old = $("#" + id + "_f");
			if (image=='SmallImgV') {
				$("#SmallImgV").attr("src", uri);
				$("#weblogo").val(uri);
			}
		},
		error : function(data, status, e) {
			$.tooltip('图片上传失败：建议您选择不超过1M的图片且在良好的网络环境下继续上传',2000,false);
		}
	});
}
