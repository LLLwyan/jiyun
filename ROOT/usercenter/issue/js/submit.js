var identId="";
$(function(){
	queryWorkOrderType();
	queryuser();

	$("#identName").blur(function () {
		var issueName = $("#issueType").val();
		if(issueName=="cloud")
			queryUsByIP();
		else if(issueName=="domain")
			queryDomainByName();
	});
});

//提交工单
function addUserIssue(){
	var issueName = $("#issueType").val();
	var identName = $("#identName ").val();
	var businessName=$("#businessName").val();
	var issueDesc = $('#issueDesc').val();
	var secretInfo=$('#secretInfo').val();
	var mobile = $('#mobile').val();
	var email = $('#email').val();
	var attachmentUrl="";
	if($("#filesrc").text() != ""){
		attachmentUrl = $("#filesrc").text();
	}else{
		attachmentUrl = "";
	}

	var notifyType="";
	if($('#chkemail').prop("checked")){
		notifyType="1";
	}
	if($('#chksms').prop("checked")){
		notifyType="2";
	}
	if($('#chkemail').prop("checked") && $('#chksms').prop("checked")){
		notifyType="3";
	}

	if(issueName=="cloud"){
		if(Commonjs.isEmpty(identName)){
			$.tooltip('请输入服务器IP',2000,false);
			return false;
		}
	}else if(issueName=="domain"){
		if(Commonjs.isEmpty(identName)){
			$.tooltip('请输入域名名称',2000,false);
			return false;
		}
	}

	if(Commonjs.isEmpty(businessName)){
		$.tooltip('请填写工单标题',2000,false);
		return false;
	}
	if(Commonjs.isEmpty(issueDesc)){
		$.tooltip('问题描述不能为空',2000,false);
		return false;
	}
	if(issueDesc.length>120){
		$.tooltip('问题描述不能超过120个字',2000,false);
		return false;
	}
	if(Commonjs.isEmpty(mobile)){
		$.tooltip('请填写手机号码',2000,false);
		return false;
	}
	if(Commonjs.isEmpty(email)){
		$.tooltip('请填写邮箱地址',2000,false);
		return false;
	}
	if(!CndnsValidate.checkMobile(mobile)){
		$.tooltip('请输入正确的手机',2000,false);
		return false;
	}
	if(!CndnsValidate.checkEmail(email)){
		$.tooltip('请输入正确的邮箱格式',2000,false);
		return false;
	}

	if(!$('#chkemail').prop("checked") && !$('#chksms').prop("checked")){
		$.tooltip('请至少选择一个通知方式',2000,false);
		return false;
	}

	issueDesc=issueDesc.replace (/[\r\n]/g, '<br>');
	issueDesc=issueDesc.replace(new RegExp('(["\"])', 'g'),"\\\"");
	secretInfo=secretInfo.replace (/[\r\n]/g, '<br>');
	secretInfo=secretInfo.replace(new RegExp('(["\"])', 'g'),"\\\"");

	var service = {};
	service.issueName = $("#issueType").find("option:selected").text();
	service.issueCode = $("#issueType").val();
	service.identId=identId;
	service.identName=identName;
	service.businessName=businessName;
	service.issueDesc = issueDesc;
	service.secretInfo=secretInfo;
	service.mobile = cloudEncrypt.encodeSession(mobile);
	service.email = email;
	service.attachmentUrl=attachmentUrl;
	service.notifyType=notifyType;
	var fn = 'addUserIssue';
	service = Commonjs.jsonToString(service);
	var params = Commonjs.getParams(fn,service);//获取参数
	Commonjs.ajaxTrue(weburl,params,addUserIssueSuccess,true,"正在提交...");
}

function addUserIssueSuccess(data){
	if(data.data==null)
		return;

	var result=data.data;
	if(result.code=="0")
		window.location.href="processing.html";
	else if(result.code=="-1")
		switch(result.issueCode){
			case "cloud":
				if(result.result=="noFindIP")
					Commonjs.alert("未找到该IP，请重新输入！");
				else if(result.result=="noEndWO")
					Commonjs.alert("当前服务器有未完成的工单，请勿重复提交，若有疑问您可在未完成工单上继续提问！");
				break;
			case "domain":
				if(result.result=="noFindDomain")
					Commonjs.alert("未找到该域名，请重新输入！");
				else if(result.result=="noEndWO")
					Commonjs.alert("当前域名有未完成的工单，请勿重复提交，若有疑问您可在未完成工单上继续提问！");
				break;
			case "finance":
				if(result.result=="noEndWO")
					Commonjs.alert("财务有未完成的工单，请勿重复提交，若有疑问您可在未完成工单上继续提问！");
				break;
		}
}

//根据IP查询服务器
function queryUsByIP(){
	var service = {};
	service.publicIP = $("#identName").val();
	var fn="queryUsByIP";
	service = Commonjs.jsonToString(service)
	var params = Commonjs.getParams(fn,service);//获取参数
	Commonjs.ajaxTrue(weburl,params,queryUsSuccess,true,"正在验证中...");
}

function queryUsSuccess(data){
	if(data.data==null)
		return;

	var view=data.data.view;
	if(view==null)
		Commonjs.alert("未找到该IP，请重新输入");
	else
		identId=view.instanceId;
}

//根据域名查询域名详情
function queryDomainByName(){
	var service = {};
	service.domainName = $("#identName").val();
	var fn="getDomainDetail";
	service = Commonjs.jsonToString(service)
	var params = Commonjs.getParams(fn,service);//获取参数
	Commonjs.ajaxTrue(weburl,params,queryDomainSuccess,true,"正在验证中...");
}

function queryDomainSuccess(data){
	if(data.data==null)
		return;

	var view=data.data.domainDetail;
	if(view==null)
		Commonjs.alert("未找到该域名，请重新输入");
	else
		identId=view.domainId;
}

function queryuser(){
	var service = {};
	var fn="getAccountDetail";
	service = Commonjs.jsonToString(service)
	var params = Commonjs.getParams(fn,service);//获取参数
	Commonjs.ajaxTrue(weburl,params,getAccountDetail);
}

function getAccountDetail(data){
	if(data.data == null){
		return false;
	}
	if(data.data.email !=""){
		$("#email").val(data.data.email);
	}
	if(data.data.mobile !=""){
		$("#mobile").val(data.data.mobile);
	}
}

//查询工单类型
function queryWorkOrderType(){
	var service = {};
	service.paramEName = "workOrderType";
	var fn="getListParamItemByEName";
	service = Commonjs.jsonToString(service)
	var params = Commonjs.getParams(fn,service);//获取参数
	Commonjs.ajaxTrue(sysurl,params,querySuccess,false);
}

function querySuccess(data){
	if(data.data==null)
		return;

	var html = "";
	if(data.data.length > 0){
		BaseForeach(data.data,function(i, item){
			html +='<option value="'+item.value+'">'+item.description+'</option>';
		});
	}
	$('#issueType').html(html);
	selectIssueType();
}

function selectIssueType(){
	var typeValue=$('#issueType').val();
	if(typeValue=="cloud"){
		$("#identTr").show();
		$("#identTitle").html("服务器IP：");
		$("#identName").attr("placeholder","请输入服务器IP地址");
	}else if(typeValue=="domain"){
		$("#identTr").show();
		$("#identTitle").html("域名名称：");
		$("#identName").attr("placeholder","请输入域名名称");
	}else{
		$("#identTr").hide();
		$("#identTitle").html("");
		$("#identName").attr("placeholder","");
	}
	$("#identName").val("");
}

//文件上传
function upload(id,image) {
	var filename = $("#"+id).val();
	var index = filename.lastIndexOf('.');
	var type = filename.substring(index+1,filename.length);
	if(type.toLowerCase() != 'jpg' && type.toLowerCase() != 'gif'
		&& type.toLowerCase() != 'png'&&type.toLowerCase() != 'jpeg' &&type.toLowerCase() != 'zip'&&type.toLowerCase() != 'rar'&&type.toLowerCase() != 'bmp'){
		$.tooltip('注意喔：文件格式必须为.jpeg|.gif|.jpg|.png|.zip|.rar|.bmp',2000,false);
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
	$("#filediv").hide();
}
