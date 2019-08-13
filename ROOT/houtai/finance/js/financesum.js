var itemHtml="";
var realIncome=0;
var businessRefund=0; 

$(function(){
	queryfinanceItem();
})

//流水统计
function AccountDetailCount(){
	var service = {};
	service.paramEName = "financeItem";
	var fn="getListParamItemByEName";
	service = Commonjs.jsonToString(service);
	var params = Commonjs.getParams(fn,service);//获取参数
	Commonjs.ajaxTrue(sysurl,params,querySuccess,true,"正在查询...");
}

function querySuccess(data){
	if(data.data==null)
		return;
	
	$("#divReuslt").show();
	var html='';
	var list=data.data;
	if(list!=null && list.length>0){
		html+='<tr>';
		BaseForeach(list,function(i,item){
			var service = {}; 
			service.userName = $("#userName").val();
			service.itemId = item.value;
			service.startTime = $("#start").val();
			service.endTime = $("#end").val();
			var fn="AdminAccountDetailCount";
			service = Commonjs.jsonToString(service)
			var params = Commonjs.getParams(fn,service);//获取参数
			var data=Commonjs.ajax(weburl,params,false);
			if(data.result == "success"){
				var info=data.data;
				html+='<td style="color:#0000CD;">¥'+info.total+'</td>';		
				if(item.value==100)
					realIncome=info.total; 
				else if(item.value==600)
					businessRefund=info.total;
			}
		});
		html+='</tr>';
	}
	
	$("#resultlist").html(itemHtml+html); 
	grossIncome=(parseFloat(realIncome)-parseFloat(businessRefund)).toFixed(2);
	$("#grossIncome").html("¥"+grossIncome);
}

function queryfinanceItem(){
	var service = {};
	service.paramEName = "financeItem";
	var fn="getListParamItemByEName";
	service = Commonjs.jsonToString(service);
	var params = Commonjs.getParams(fn,service);//获取参数
	var data=Commonjs.ajax(sysurl,params,false);
	if(data.result == "success"){
		$("#itemId").empty();
		var itemId='';
		if (data.data.length>0){
			itemHtml="<tr>";
			itemId+='<option value="">全部</option>';
			BaseForeach(data.data,function(i,item){
				itemId+='<option value="'+item.value+'">'+item.description+'</option>';
				itemHtml+='<td style="color:#228B22;">'+item.description+'</td>';
			});
			itemHtml+="</tr>";
		}
		$('#itemId').append(itemId);
	}
}
