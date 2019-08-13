var id = request("id");
var type = request("type");
$(function(){
	if(type==1){
		$("#close").show()
	}else{
		$("#open").show()
	}
	queryEmailConfig();
})

//查询邮件配置
function queryEmailConfig(){
	var service = {};
	service.id = id;
	var fn="querEmailById";
	service = Commonjs.jsonToString(service)
	var params = Commonjs.getParams(fn,service);//获取参数
	Commonjs.ajaxTrue(weburl,params,queryConfigSuccess);
}

function queryConfigSuccess(data){
	$("#emailconfig").html("");
	var emailconfig="";
	BaseForeach(data.data,function(i,item){
		emailconfig+=' <table class="table table-striped table-bordered table-hover " id="editable">';
		emailconfig+=' <caption style="padding-left:10px;background-color:#f3f3f2;">'+item.title+'</caption>';
		emailconfig+=' <tbody id="userlist">';
		emailconfig+=' <tr>';
		emailconfig+=' <td width="20%" class="text-center">标题:</td>';
		emailconfig+=' <td><input type="text" style="width:30%;" class="form-control" value="'+item.title+'" id="'+item.tempName+'title"/></td>';  
		emailconfig+=' </tr>';
		emailconfig+=' <tr>';
		emailconfig+=' <td width="20%" class="text-center" >内容:</td>';   
		emailconfig+=' <td><textarea cols="60" style="margin: 0px; height: 230px; width: 704px;" class="manager-input"  id="'+item.tempName+'content">'+getContent(item.content)+'</textarea></td>';
		emailconfig+=' </tr>';
		emailconfig+=' <tr>';
		emailconfig+=' <td colspan="2" align="center">';
		emailconfig+=' <input type="button" class="btn btn-primary" value="保 存"  onclick="uptemailconfig(\''+item.tempName+'\');">';
		emailconfig+=' <input type="button" class="btn btn-primary" value="返回"  onclick="history.go(-1)">';
		emailconfig+=' </td>';
		emailconfig+=' </tr>';
		emailconfig+=' </tbody>';
		emailconfig+=' </table>';
	});
	$("#emailconfig").append(emailconfig);
}

function getContent(content){
	var reg=new RegExp("<br>","g"); //创建正则RegExp对象      
	return content.replace(reg,"\n"); 
}

//更新邮件配置
function  uptemailconfig(tempName){    
	var content=$("#"+tempName+"content").val().replace (/[\r\n]/g, '<br>');
	content=content.replace(new RegExp('(["\"])', 'g'),"\\\"");
	
	var service = {};
	var countValue = $("#"+tempName+"content").val();  
	service.tempName = tempName;  
	service.title=$("#"+tempName+"title").val(); 
	service.content=encodeURIComponent(content); 
	var fn="uptemailconfig";
	service = Commonjs.jsonToString(service);
	var params = Commonjs.getParams(fn,service);//获取参数
	Commonjs.ajaxTrue(weburl,params,uptconfigSuccess);
}

function uptconfigSuccess(data){
	$.tooltip(data.msg,2000,true);
	queryEmailConfig();
} 