var ue = UE.getEditor('content');
$(function(){
	$('input:radio').click(function () { 
		var object=$(this).val();
		if(object=="userName") {
			$("#listTitle").html("会员列表："); 
			$("#listName").attr("placeholder","每个会员一行");
			$("#userlistTr").show();
		}else if(object=="email"){
			$("#listTitle").html("邮箱列表："); 
			$("#listName").attr("placeholder","每个邮箱一行");
			$("#userlistTr").show();
		}else
			$("#userlistTr").hide();
		$("#listName").val('');    
	});
});

//发送邮件
function sendemail(){
	var object='';
	$("input[name='object']:checked").each(function(){
		object=$(this).val();
	});
	
	var s_title = $('#title');
	var message=ue.getContent().replace (/[\r\n]/g, '<br>');
	message=message.replace(new RegExp('(["\"])', 'g'),"\\\""); 
	
	if(Commonjs.isEmpty(s_title.val())){
		$.tooltip('邮件标题不能为空',2000,false); 
		s_title.focus();
		return false;
	}
	if(Commonjs.isEmpty(message)){ 
		$.tooltip('邮件内容不能为空',2000,false); 
		content.focus();
		return false; 
	}
	
	var listName=$("#listName").val().replace (/[\r\n]/g, '<br>');
	listName=listName.replace(new RegExp('(["\"])', 'g'),"\\\"");
	
	var service = {};
	service.object=object;  
    service.listName=encodeURIComponent(listName); 
	service.title = s_title.val();
	service.message = encodeURIComponent(message); 
	var fn = "bathSendEmail";
	service = Commonjs.jsonToString(service);
	var params = Commonjs.getParams(fn, service);//获取参数
	$.ajax({
		datatype:"json",
		type:"POST",
		url: weburl,
		data:params,
		cache : false,				
		beforeSend: function () {
			divalertLoad('正在发送邮件中...');
		},
		success:function(obj){
			var data = jQuery.parseJSON(obj);
			if(data.result=="success"){
				$.tooltip("操作完成", 3000, true);
				window.location.href="sysnotifymanager.html";
			}
		}
	});	
}

function back(){
	window.history.back(-1); 
}
