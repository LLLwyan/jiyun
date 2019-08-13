var id = request("id");

//短信配置
$(function(){
	querSmsConfig();	
});

//查询短信配置
function querSmsConfig(){
	var service = {};
	service.id = id;
	var fn="querEmailById";
	service = Commonjs.jsonToString(service);
	var params = Commonjs.getParams(fn,service);//获取参数
	Commonjs.ajaxTrue(weburl,params,querySmsSuccess);
}

function querySmsSuccess(data){
	$("#smsconfig").html("");
	var Smsconfig="";
	BaseForeach(data.data,function(i,item){
		Smsconfig+=' <table class="table table-striped table-bordered table-hover " id="editable">';
		Smsconfig+=' <caption style="padding-left:10px;background-color:#f3f3f2;">'+item.title+'</caption>';
		Smsconfig+=' <tbody id="userlist">';
		Smsconfig+=' <tr>';
		Smsconfig+=' <td width="20%" class="text-center">短信标题:</td>';
		Smsconfig+=' <td><input type="text" style="width:30%;" class="form-control" value="'+item.title+'" id="'+item.tempName+'title"/></td>';  
		Smsconfig+=' </tr>';
		Smsconfig+=' <tr>';
		Smsconfig+=' <td width="20%" class="text-center" >短信内容:</td>';
		Smsconfig+=' <td><textarea cols="60" style="margin: 0px; height: 230px; width: 704px;" class="manager-input m-input width288"  id="'+item.tempName+'content">'+item.content+'</textarea></td>';
		Smsconfig+=' </tr>';
		Smsconfig+=' <tr>';
		Smsconfig+=' <td colspan="2" align="center">';
		Smsconfig+=' <input type="button" class="btn btn-primary" value="保 存"  onclick="uptSmsconfig(\''+item.tempName+'\');">';
		Smsconfig+=' </td>';
		Smsconfig+=' </tr>';
		Smsconfig+=' </tbody>';
		Smsconfig+=' </table>';
	});
	$("#smsconfig").append(Smsconfig);
}

//更新短信配置
function  uptSmsconfig(tempName){
	var service = {};
	var countArray = {};
	var cpimyArray2 = {};
	var countValue = $("#"+tempName+"content").val().replace(/[\r\n]/g,"");
	var content = "";
	var content2= "";
	countArray = countValue.split("%");
	//先转换%
	for(var i = 0;i<countArray.length;i++){
		content+=countArray[i]+"仝仝";
	}
	content=content.substring(0,content.length-2);
	//再转换&
	cpimyArray2 = content.split("&");
	for(var i = 0;i<cpimyArray2.length;i++){
		content2+=cpimyArray2[i]+"%26";
	}
	content2=content2.substring(0,content2.length-3);
	service.tempName = tempName;
	service.title=$("#"+tempName+"title").val();
	service.content=content2;
	var fn="uptemailconfig";
	service = Commonjs.jsonToString(service);
	var params = Commonjs.getParams(fn,service);//获取参数
	Commonjs.ajaxTrue(weburl,params,uptSmsconfigSuccess,false);
}

function uptSmsconfigSuccess(data){
	$.tooltip(data.msg,2000,true);
	querSmsConfig();
}