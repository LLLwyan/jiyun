$(function(){
	querDomainRegType();
})

function querDomainRegType(){
	var service = {};
	service.page = $("#pagenumber").val();
	service.pageSize = 20;
	var fn="qryDivDomainRegtype";
	service = Commonjs.jsonToString(service)
	var params = Commonjs.getParams(fn,service);//获取参数
	Commonjs.ajaxTrue(weburl,params,querDomainRegTypeSuccess);
};

function querDomainRegTypeSuccess(data){
	if(data.data == null){
		return false;
	}
	var div_regType="";
	//var typetype = "";
	$("#div_regType").empty();
	var userId = [];
	var userValue= [];
	if (data.data.length>0){
		BaseForeach(data.data,function(i,item){
            div_regType+='<tr class="gradeX" >';
            div_regType+=' <td>'+(i+1)+'</td>';
            div_regType+=' <td cellspacing="1" >'+item.regType+'</td>';
            div_regType+=' <td >'+item.regDesc+'</td>';
            div_regType+=' <td >'+item.url+'</td>';
            div_regType+=' <td >'+item.apiAccount+'</td>';
            div_regType+=' <td align="center">';
            if(item.isUse == 1){
                div_regType+='<font color="green">是<font/>';
			}else{
                div_regType+='<font color="red">否<font/>';
			}
            div_regType+=' </td>';
            div_regType+=' <td>';
            div_regType+='    <a  href="javascript:void(0);" class="btn btn-primary" onclick="uptDivDomainRegtype(\''+item.regType+'\',\''+item.regDesc+'\',\''+item.url+'\',\''+item.apiAccount+'\',\''+item.apiPass+'\',\''+item.dns1+'\',\''+item.dns2+'\',\''+item.extension+'\',\''+item.sn+'\',\''+item.isUse+'\',\''+item.id+'\');">修改</a> ';
            div_regType+='    <a  onclick="delDivDomainRegtype(\''+item.id+'\');" href="javascript:void(0);" class="btn btn-primary ">删除</a> ';
            div_regType+=' </td>';
            div_regType+='</tr>';
			//将ID赋值给数组
			userId.push(item.id);
		});
		if(data.rows!=undefined){
			if(data.rows!=0){
				$("#totalcount").val(data.rows);
			}else{
				if(data.page==0)$("#totalcount").val(0);
			}
		}else{
			$("#totalcount").val(0);
		}
		Page($("#totalcount").val(),data.pagesize,'pager');	
		$("#pages").show();
	}else{
        div_regType+=' <tr><td colspan="10" style="height:50px;text-align:center;line-height:50px;">找不到相关信息14</td></tr>';
		$("#pages").hide();
	}
	$('#div_regType').append(div_regType);
	for(var i = 0;i<userId.length; i++){
		$("#type"+userId[i]).val(userValue[i]);
	}
}

//更新域名信息
function uptDivDomainRegtype(regType, regDesc, url, apiAccount, apiPass, dns1, dns2, extension, sn, isUse, id){

    $("#id").val(id);
    $("#regType").val(regType);
    $('#regType').attr("disabled","disabled");
    $("#regDesc").val(regDesc);
    $("#url").val(url);
    $("#apiAccount").val(apiAccount);
    $("#apiPass").val(apiPass);
    $("#dns1").val(dns1);
    $("#dns2").val(dns2);
    $("#extension").val(extension);
    $("#sn").val(sn);
    if (isUse == 1){
        $("input:radio[value='1']").attr('checked','checked');
	} else {
        $("input:radio[value='2']").attr('checked','checked');
	}

    var contents=$('#addDomainRegType').get(0);
    var artBox=art.dialog({
        lock: true,
        opacity:0.4,
        width: 450,
        padding:'0px 0px',
        title:'编辑域名注册商',
        header:false,
        content: contents,
        ok: function () {
            var regDesc = $('#regDesc');
            if(Commonjs.isEmpty(regDesc.val())){
                $.tooltip('接口名称不能为空',2000,false);
                regDesc.focus();
                return false;
            }
            var url = $('#url');
            if(Commonjs.isEmpty(url.val())){
                $.tooltip('接口地址不能为空',2000,false);
                url.focus();
                return false;
            }
            var apiAccount = $('#apiAccount');
            if(Commonjs.isEmpty(apiAccount.val())){
                $.tooltip('接口账号不能为空',2000,false);
                apiAccount.focus();
                return false;
            }
            var apiPass = $('#apiPass');
            if(Commonjs.isEmpty(apiPass.val())){
                $.tooltip('接口密码不能为空',2000,false);
                apiPass.focus();
                return false;
            }

            // var dns1 = $('#dns1');
            // if(!Commonjs.isEmpty(dns1.val()) && !CndnsValidate.checkDns(dns1.val())){
            //     $.tooltip('DNS1格式错误',2000,false);
            //     dns1.focus();
            //     return false;
            // }
            //
            // var dns2 = $('#dns2');
            // if(!Commonjs.isEmpty(dns2.val()) && !CndnsValidate.checkDns(dns2.val())){
            //     $.tooltip('DNS2格式错误',2000,false);
            //     dns2.focus();
            //     return false;
            // }

            var service = {};
            service.id = $("#id").val();
            service.regType = $("#regType").val();
            service.regDesc = $("#regDesc").val();
            service.url = $("#url").val();
            service.apiAccount = $("#apiAccount").val();
            service.apiPass = $("#apiPass").val();
            service.dns1 = $("#dns1").val();
            service.dns2 = $("#dns2").val();
            service.extension = $("#extension").val();
            service.sn = $("#sn").val();
            service.isUse=$("input[name='isUse']:checked").val();
            var fn="uptDivDomainRegtype";
            service = Commonjs.jsonToString(service);
            var params = Commonjs.getParams(fn,service);//获取参数
            Commonjs.ajaxTrue(weburl,params,uptDivDomainRegtypeSuccess,false);
        },cancel: function(){
            $('#addDomainRegType').hide();
        }
    });
}

function uptDivDomainRegtypeSuccess(data){
	$.tooltip(data.msg,2000,true);
	querDomainRegType();
}

//删除域名
function delDivDomainRegtype(id,name){
	var dialog=	art.dialog({
		lock : true,
		opacity : 0.4,
		width : 250,
		title : '提示',
		content : '您确定删除吗？',
		ok : function() {
			var service = {}
			service.id = id;
			service = Commonjs.jsonToString(service);
			var fn  = "delDivDomainRegtype";
			var params = Commonjs.getParams(fn,service);//获取参数
			Commonjs.ajaxTrue(weburl,params,delDivDomainRegtypeSuccess,false);
		},
		cancel: function(){
			$('#dialog').hide();
		}
	});
}

function delDivDomainRegtypeSuccess(data){
	$.tooltip(data.msg,2000,true);
	querDomainRegType();
}

//添加域名
function addDomainRegType(){
	$("#regType").val("");
    $('#regType').attr("disabled",false);
	$("#regDesc").val("");
	$("#url").val("");
	$("#apiAccount").val("");
	$("#apiPass").val("");
	$("#dns1").val("");
	$("#dns2").val("");
	$("#extension").val("");
	$("#sn").val("");

	var contents=$('#addDomainRegType').get(0);
	var artBox=art.dialog({
		lock: true,
		artIcon:'add',
		opacity:0.4,
		width: 450,
		padding:'0px 0px',
		title:'添加域名注册商',
		header:false,
		content: contents,
		ok: function () {
			var regType = $('#regType');
			if(Commonjs.isEmpty(regType.val())){
				$.tooltip('接口标识不能为空',2000,false);
                regType.focus();
				return false;
			}
            if(!CndnsValidate.checkNumber(regType.val())){
                $.tooltip('接口标识只能为数字',2000,false);
                regType.focus();
                return false;
            }
            if(regType.val() < 20 || regType.val() > 199) {
                $.tooltip('20以下系统保留标识，请填写20-200作为接口标识',2000,false);
                regType.focus();
                return false;
            }
			var regDesc = $('#regDesc');
			if(Commonjs.isEmpty(regDesc.val())){
				$.tooltip('接口名称不能为空',2000,false);
                regDesc.focus();
				return false;
			}
			var url = $('#url');
			if(Commonjs.isEmpty(url.val())){
				$.tooltip('接口地址不能为空',2000,false);
                url.focus();
				return false;
			}
			var apiAccount = $('#apiAccount');
			if(Commonjs.isEmpty(apiAccount.val())){
				$.tooltip('接口账号不能为空',2000,false);
                apiAccount.focus();
				return false;
			}
			var apiPass = $('#apiPass');
			if(Commonjs.isEmpty(apiPass.val())){
				$.tooltip('接口密码不能为空',2000,false);
                apiPass.focus();
				return false;
			}

            // var dns1 = $('#dns1');
            // if(!Commonjs.isEmpty(dns1.val()) && !CndnsValidate.checkDns(dns1.val())){
            //     $.tooltip('DNS1格式错误',2000,false);
            //     dns1.focus();
            //     return false;
            // }
			//
            // var dns2 = $('#dns2');
            // if(!Commonjs.isEmpty(dns2.val()) && !CndnsValidate.checkDns(dns2.val())){
            //     $.tooltip('DNS2格式错误',2000,false);
            //     dns2.focus();
            //     return false;
            // }

			var service = {};
			service.regType = $("#regType").val();
			service.regDesc = $("#regDesc").val();
			service.url = $("#url").val();
			service.apiAccount = $("#apiAccount").val();
            service.apiPass = $("#apiPass").val();
            service.dns1 = $("#dns1").val();
			service.dns2 = $("#dns2").val();
			service.extension = $("#extension").val();
			service.sn = $("#sn").val();
			service.isUse=$("input[name='isUse']:checked").val();
			var fn="addDivDomainRegtype";
			service = Commonjs.jsonToString(service);
			var params = Commonjs.getParams(fn,service);//获取参数
			Commonjs.ajaxTrue(weburl,params,addDomainRegTypeSuccess,false);
		},cancel: function(){
			$('#addDomainRegType').hide();
		}
	});
}

function addDomainRegTypeSuccess(data){
	$.tooltip(data.msg,2000,true);
	querDomainRegType();
}

//分页	
function Page(totalcounts,pagecount,pager) {
  	$("#"+pager).pager( {
  		totalcounts : totalcounts,
  		pagesize : 30,
  		pagenumber : $("#pagenumber").val(),
  		pagecount : parseInt(totalcounts/pagecount)+(totalcounts%pagecount >0?1:0),
  		buttonClickCallback : function(al) {
  			$("#pagenumber").val(al);
  			querDomainRegType();
  		}
  	});  	
}