$(function(){
	queryVipgrade();
})

function queryVipgrade(){
	var service = {};
	var userlevel=null;
	service.page = 0;
	service.pageSize = 20;
	var fn="queryVipgrade";
	service = Commonjs.jsonToString(service)
	var params = Commonjs.getParams(fn,service);//获取参数
	Commonjs.ajaxTrue(weburl,params,vipgradeSuccess);
};

function vipgradeSuccess(data){
	if(data.data==null){
		return false;
	}
	var userlevel = "";
	$("#userlevel").empty();
	var userId = [];
	var userValue= [];
	if (data.data.length>0){
		BaseForeach(data.data,function(i,item){
			userlevel+=' <tr class="gradeX" ><td>'+(i+1)+'<input type="hidden" id="id'+i+'" value='+item.id+'></td>';
			userlevel+=' <td cellspacing="1" id="levelCode'+i+'">'+item.levelCode+'</td>';
			userlevel+='<td><input id="levelName'+i+'"  class="manager-input m-input width100" value='+item.levelName+'></td>'
			userlevel+='<td><input id="minCharge'+i+'" class="manager-input m-input width100"  value='+item.minCharge+'>'
			userlevel+='~<input id="maxCharge'+i+'" class="manager-input m-input width100" value='+item.maxCharge+'></td>'
			userlevel+='<td><input id="rebate'+i+'" class="manager-input m-input width100" value='+item.rebate+'></td>'
			userlevel+=' <td>'
			userlevel+='<a  href="javascript:void(0);" class="btn btn-primary" onclick="updateVipgrade('+i+');">修改</a> '
			userlevel+='<a  onclick="delVipgrade('+i+');" href="javascript:void(0);" class="btn btn-primary ">删除</a> '
			userlevel+='</td></tr>';
		});
	}
	$('#userlevel').append(userlevel);
}

function addVipgrade(){
	var levelCode = $("#levelCode");
	var levelName = $("#levelName");
	var minCharge = $("#minCharge");
	var maxCharge = $("#maxCharge");
	var rebate = $("#rebate");
	if(Commonjs.isEmpty(levelCode.val())){
		$.tooltip("会员等级不能为空", 2000, false);
		levelCode.focus();
		return false;
	}
	if(Commonjs.isEmpty(levelName.val())){
		$.tooltip("会员等级不能为空", 2000, false);
		levelName.focus();
		return false;
	}
	if(!CndnsValidate.checkNumber(minCharge.val())){
		$.tooltip("最小充值请输入数字", 2000, false);
		minCharge.focus();
		return false;
	}
	if(!CndnsValidate.checkNumber(maxCharge.val())){
		$.tooltip("最大充值请输入数字", 2000, false);
		maxCharge.focus();
		return false;
	}
	if(!CndnsValidate.checkNumber(rebate.val())){
		$.tooltip("折扣请输入数字", 2000, false);
		rebate.focus();
		return false;
	}
	var service = {};
	service.levelCode = levelCode.val();
	service.levelName = levelName.val();
	service.minCharge = minCharge.val();
	service.maxCharge = maxCharge.val();
	service.rebate = rebate.val();
	var fn = "addVipgrade";
	service = Commonjs.jsonToString(service);
	var params = Commonjs.getParams(fn,service);
	Commonjs.ajaxTrue(weburl,params,addVipgradeSuccess,false);
}

function addVipgradeSuccess(data){
	$("#levelCode").val("");
	$("#levelName").val("");
	$("#minCharge").val("");
	$("#maxCharge").val("");
	$("#rebate").val("");
	$.tooltip(data.msg, 2000, true);
	queryVipgrade();
}

function updateVipgrade(indexs){
	var id = $("#id"+indexs);
	var levelCode = $("#levelCode"+indexs);
	var levelName = $("#levelName"+indexs);
	var minCharge = $("#minCharge"+indexs);
	var maxCharge = $("#maxCharge"+indexs);
	var rebate = $("#rebate"+indexs);
	if(Commonjs.isEmpty(levelName.val())){
		$.tooltip("会员等级不能为空", 2000, false);
		levelName.focus();
		return false;
	}
	if(!CndnsValidate.checkNumber(minCharge.val())){
		$.tooltip("最小充值请输入数字", 2000, false);
		minCharge.focus();
		return false;
	}
	if(!CndnsValidate.checkNumber(maxCharge.val())){
		$.tooltip("最大充值请输入数字", 2000, false);
		maxCharge.focus();         
		return false;
	}
	var service = {};
	service.id = id.val();
	service.levelCode = levelCode.html();
	service.levelName = levelName.val();
	service.minCharge = minCharge.val();
	service.maxCharge = maxCharge.val();    
	service.rebate = rebate.val();
	var fn = "updateVipgrade";
	service = Commonjs.jsonToString(service);
	var params = Commonjs.getParams(fn,service);
	Commonjs.ajaxTrue(weburl,params,updateVipSuccess,false);
}

function updateVipSuccess(data){
	$.tooltip(data.msg, 2000, true);
	queryVipgrade();		
}

function delVipgrade(indexs){
	var dialog=	art.dialog({
		lock : true,
		opacity : 0.4,
		width : 250,
		title : '提示',
		content : '您确定删除吗？',
		ok : function() {
	   	 	var service = {};
	   	 	service.id=$("#id"+indexs).val();
			var fn="delVipgrade";
			service = Commonjs.jsonToString(service);
			var params = Commonjs.getParams(fn,service);//获取参数
			Commonjs.ajaxTrue(weburl,params,delVipgradeSuccess,false);
	},cancel: function(){
			$('#dialog').hide();
		}
	});
}

function delVipgradeSuccess(data){
	$.tooltip(data.msg,2000,true);
	queryVipgrade();
}

