$(function(){
	queryDicVipgrade();
	queryUser();
})

//获取会员等级
function queryDicVipgrade(){
	var service = {};
	var fn="queryVipgradeList";
	service = Commonjs.jsonToString(service);
	var params = Commonjs.getParams(fn,service);//获取参数
	var data=Commonjs.ajax(weburl,params,false);
	if(data.result == "success"){
		if(data.data==null)
			return;

		var html='<option value="">所有</option>';
		if (data.data.length>0){
			BaseForeach(data.data,function(i,item){
				html+='<option value="'+item.levelCode+'">'+item.levelName+'</option>';
			});
		}
		$("#userLevel").html(html);
	}
}

//查询所有会员
function queryUser(){
	var service = {};
	var account = $("#account").val();
	var email = $("#email").val();
	var mobile = $("#mobile").val();
	var levelCode=$("#userLevel").val();
	var page = $("#pagenumber").val();
	var certify = $('#certify').val();
	var pagesize = 10;
	service.account = account;
	service.email = email;
	service.mobile = mobile;
	service.levelCode=levelCode;
	service.certify = certify;
	service.page = page;
	service.pagesize = pagesize;
	var fn="queryUser";
	service = Commonjs.jsonToString(service)
	var params = Commonjs.getParams(fn,service);//获取参数
	Commonjs.ajaxTrue(weburl,params,queryUseSuccess);
}

function queryUseSuccess(data){
	if(data.data==null){
		return false;
	}
	$("#userlist").html("");
	var userlis="";
	if (data.data.length>0){
		BaseForeach(data.data,function(i,item){
			userlis+='<tr class="gradeX">';
			userlis+='<td>'+(i+1)+'</td>';
			userlis+='<td id="userName_'+i+'">'+item.userName+'</td>';
			userlis+='<input id="userId_'+i+'" value='+item.userId+' type="hidden"/>';
			userlis+='<input id="Id_'+i+'" value='+item.id+' type="hidden"/>';
			userlis+='<td>'+item.levelName+'</td>';
			userlis+='<td>'+item.balance+'</td>';
			userlis+='<td>'+item.consumeAmount+'</td>';
			userlis+='<td>'+item.email+'</td>';
			userlis+='<td>'+ProtectionStartUtils.mobile(cloudEncrypt.decodeSession(item.mobile))+'</td>';
			userlis+='<td>'+item.statusName+'</td>';
			userlis+='<td>'+item.certifyName+'</td>';
			userlis+='<td>'+item.regTime+'</td>';
			userlis+='<td>';
			if (hasFun('adminResetPwd')) {
                userlis += '<a href="javascript:void(0);" class="btn btn-primary" onclick="resetPwd(\'' + item.userName + '\')">重置密码</a>&nbsp;';
            }
            if (hasFun('getUserDetail')) {
                userlis += '<a href="./userinfo.html?id=' + item.id + '"" class="btn btn-primary" >详情</a>&nbsp;';
            }
			if (hasFun('deleteAccount')) {
                userlis += '<a href="javascript:void(0);" class="btn btn-primary" onclick="deletByNameAndId(' + i + ')">删除</a>&nbsp;';
            }
            if (hasFun('uptAccountState')) {
                if (item.statusName == '正常') {
                    userlis += '<a href="javascript:void(0);" class="btn btn-primary" onclick="uptAccountState(' + i + ',\'E\')">冻结</a>&nbsp;';
                } else {
                    userlis += '<a href="javascript:void(0);" class="btn btn-primary" onclick="uptAccountState(' + i + ',\'Y\')">转正常</a>&nbsp;';
                }
            }
            if (hasFun('certifyCheck')) {
                userlis += '<a href="javascript:void(0);" class="btn btn-primary certifyBtn" item="' + i + '">实名审核</a>';
            }
			userlis+='</td>';
			userlis+='</tr>';
		});
	}
	else{
		userlis+=' <tr><td colspan="11" style="height:50px;text-align:center;line-height:50px;">找不到相关信息</td></tr>';
	}
	$("#userlist").append(userlis);
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

	$('.certifyBtn').on('click', function () {
		var dataNum = parseInt($(this).attr('item'));
		var info = data.data[dataNum];
		if (info.isCertified<1) {
			topError(window, "未提交认证");
			return;
		}

        var modalWin = wModal(window).add('certifyCheck', $('#_certifyCheck').html()).show();
		modalWin.find('#certifyStatus').html(info.certifyName);
		modalWin.find('#fullName').find('td').html(info.fullName);
		modalWin.find('#companyName').find('td').html(info.companyName);
		if (info.certType == 1) {
            modalWin.find('#fullName').css('display', '');
            modalWin.find('#certType').html('身份证');
		} else {
			modalWin.find('#companyName').css('display', '');
            modalWin.find('#certType').html('营业执照');
		}
		modalWin.find('#certCode').html(cloudEncrypt.decodeSession(info.certCode));
		if (info.certFile.length > 0) {
			$.each(info.certFile, function (index, item) {
				var img = '<a href="' + item.url + '" target="_blank"><img src="' + item.url + '" style="height: 120px" /></a> ';
				modalWin.find("#certFile").append(img);
            });
		}
		if (info.isCertified == 2) {
			modalWin.find('.checkBtnGroup').css('display', '');
		}

        modalWin.find('.btn-primary').unbind('click').on('click', function () {
        	var state = parseInt($(this).attr('state'));
        	var certifyDesc = modalWin.find('#certifyDesc').val();
        	if (0 == state && ''==certifyDesc) {
        		topError(window, "请填写不通过原因。");
        		return;
			}

            var service = {};
            service.uid = info.userId;
            service.state = state;
            service.certifyDesc = certifyDesc;
            var fn="updateUserCertCheck";
            service = Commonjs.jsonToString(service)
            var params = Commonjs.getParams(fn,service);
            parent.Commonjs.ajaxTrue(weburl,params,function () {
                topSuccess(window, '操作成功');
                modalWin.hide();
            });
        });

        modalWin.onHide(function () {
            location.reload();
        });
    });
}

//根据会员名和会员ID删除用户
function deletByNameAndId(i){
	var dialog=	art.dialog({
		lock : true,
		opacity : 0.4,
		width : 250,
		title : '提示',
		content : '您确定删除吗？',
		ok : function() {
       	  var userName = $("#userName_"+i).html();
 	 	  var userId = $("#userId_"+i).val();
 	 	  var fn = 'deleteAccount';
 	 	  var service = {};
 	 	  service.userName = userName;
 	 	  service.userId = userId;
 	 	  service = Commonjs.jsonToString(service);
 	 	  var params = Commonjs.getParams(fn, service);
 	 	  Commonjs.ajaxTrue(weburl,params,deletUserSuccess,false);
	 	},cancel: function(){
			$('#dialog').hide();
		}
	});
}

function deletUserSuccess(data){
	topSuccess(window, data.msg);
    location.reload();
}

//冻结用户
function uptAccountState(i,status){
	var content = '';
	if(status == 'E') content = '注意：您要冻结此用户吗？';
	else  content = '注意：您要将此用户转正常吗？';
	art.dialog({
 		id: 'testID',
 	    width: '245px',
 	    height: '109px',
 	    content: content,
 	    lock: true,
 	    button: [{
      	name: '确定',
       	callback: function () {
			var userName = $("#userName_"+i).html();
			  var userId = $("#userId_"+i).val();
			  var fn = 'uptAccountState';
			  var service = {};
			  service.userName = userName;
			  service.userId = userId;
			  service.status = status;
			  service = Commonjs.jsonToString(service);
			  var params = Commonjs.getParams(fn, service);
		 	  Commonjs.ajaxTrue(weburl,params,uptStateSuccess,false);
 	       }
 	 	},{
 	 		name: '取消'
 	 	}]
 	});
}

function uptStateSuccess(data){
	topSuccess(window, data.msg);
	location.reload();
}

function resetPwd(userName){
	parent.art.dialog({
		lock : true,
		opacity : 0.4,
		width : 250,
		title : '提示',
		content : "您确定要重置密码？",
		ok : function() {
			var fn = "adminResetPwd";
			var service = {};
			service.username = userName;
			service = Commonjs.jsonToString(service);
			var params = Commonjs.getParams(fn, service);
			Commonjs.ajaxTrue(weburl,params,resetPwdSuccess);
		},cancel: function(){
			$('#dialog').hide();
			}
	});
}

function resetPwdSuccess(data){
	$("#pwdli").text(data.data.password);
    var content = $("#resetPassword").html();
    parent.art.dialog({
        lock : true,
        opacity : 0.4,
        width : 250,
        title : '重置成功',
        content : content,
        ok : function() {
            $('#dialog').hide();
        }
    });
}

//分页
function Page(totalcounts,pagecount,pager) {
  	$("#"+pager).pager( {
	totalcounts : totalcounts,
	pagesize : 10,
	pagenumber : $("#pagenumber").val(),
	pagecount : parseInt(totalcounts/pagecount)+(totalcounts%pagecount >0?1:0),
	buttonClickCallback : function(al) {
		$("#pagenumber").val(al);
			queryUser();
  		}
  	});
}
