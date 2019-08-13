//充值记录
$(function(){
	$(".managertitle ul li").click(function(){
		 $(this).addClass("liactive").siblings().removeClass("liactive"); //切换选中的按钮高亮状态
	});
	queryfinanceItem();
})

function tab(pid){
  	var tabs=["tab1","tab2"];
  	for(var i=0;i<2;i++){
	   	if(tabs[i]==pid){
	   		$("#RechargeCount").html("");
	   		$("#AccountDetailCount").html("");
	    	document.getElementById(tabs[i]).style.display="block";
	  	}else{
	   		$("#RechargeCount").html("");
	   		$("#AccountDetailCount").html("");
	    	document.getElementById(tabs[i]).style.display="none";
	  	}
	}
}

//充值统计
function getRechargeCount(){
	var startTime=$("#startTime").val();
	var endDate=$("#endDate").val();
	if(Commonjs.isEmpty(startTime)){
		$.tooltip('请选择起始时间',2000,false); 
		return false;
	}
	
	if(Commonjs.isEmpty(endDate)){
		$.tooltip('请选择截止时间',2000,false); 
		return false;
	}
	
	var service = {};
	service.startTime = startTime; 
	service.endTime = endDate;
	var fn="UserRechargeCount";
	service = Commonjs.jsonToString(service)
	var params = Commonjs.getParams(fn,service);//获取参数
	Commonjs.ajaxTrue(weburl,params,getRechargeCountSuccess);
}

function getRechargeCountSuccess(data){
	if(data.data==null)
		return false;
	
	$("#cResult").show();
	$("#cStartTime").html($("#startTime").val());
	$("#cEndTime").html($("#endDate").val());
	$("#cTotal").html("¥"+data.data.total);
}

//消费统计
function AccountDetailCount(){
	var startTime=$("#astartTime").val();
	var endDate=$("#aendDate").val();
	if(Commonjs.isEmpty(startTime)){
		$.tooltip('请选择起始时间',2000,false); 
		return false;
	}
	
	if(Commonjs.isEmpty(endDate)){
		$.tooltip('请选择截止时间',2000,false); 
		return false;
	}
	
	var service = {};
	service.itemId = $("#itemId").val();
	service.startTime = $("#astartTime").val();
	service.endTime = $("#aendDate").val();
	var fn="UserAccountDetailCount";
	service = Commonjs.jsonToString(service)
	var params = Commonjs.getParams(fn,service);//获取参数
	Commonjs.ajaxTrue(weburl,params,AccountDetailCountSuccess); 
}

function AccountDetailCountSuccess(data){
	if(data.data==null)
		return false;
	
	$("#aResult").show();
	$("#aStartTime").html($("#astartTime").val());
	$("#aEndTime").html($("#aendDate").val());
	$("#aType").html($("#itemId").find("option:selected").text());
	$("#aTotal").html("¥"+data.data.total);
}

function queryfinanceItem(){
	var service = {};
	service.paramEName = "financeItem";
	var fn="getListParamItemByEName";
	service = Commonjs.jsonToString(service);
	var params = Commonjs.getParams(fn,service);//获取参数
	var data=Commonjs.ajax(sysurl,params,false);
	if(data.result == "success"){
		var itemId='';
		if (data.data.length>0){
			BaseForeach(data.data,function(i,item){
				itemId+='<option value="'+item.value+'">'+item.description+'</option>';
			});
		}
		$('#itemId').html(itemId);
	}
}
