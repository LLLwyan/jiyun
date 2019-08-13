//查询账号
$(function(){
	s_userlist();
	queryrole();//显示角色名
})

function s_userlist(){
	var service = {};
	var index = $("#pagenumber").val();
	service.page = index;
	service.pagesize = 10;
	var fn="queryuser";
	service = Commonjs.jsonToString(service)
	var params = Commonjs.getParams(fn,service);//获取参数
	Commonjs.ajaxTrue(sysurl,params,s_userlistSuccess);
}

function s_userlistSuccess(data){
	if(data.data == null){
		return false;
	}
	$("#userlist").html("");
	var userlis="";
	if (data.rows!=0){
		BaseForeach(data.data,function(i,item){
			if(item.account != $.cookie('uat')){
				userlis+='<tr class="center">';
				userlis+='<td>'+(i+1)+'</td>';
				userlis+='<td>'+item.account+'</td>';
				userlis+='<td>'+item.nick+'</td>';
				userlis+='<td>'+item.roles[0].id+'</td>'
				userlis+='<td>'+getGroupName(item)+'</td>';
				userlis+='<td>'+item.stateName+'</td>'
				userlis+='<td class="center">'
				var moduser="'"+item.account+"','"+item.id+"','"+item.mobile+"','"+item.officeTel+"','"+item.roles[0].id+"','"+item.nick+"', '"+item.groupCode+"'";
				userlis+='<a href="javascript:;" class="btn btn-primary" onclick="moduser('+moduser+');">修改</a>'
				userlis+='<a href="#" class="btn btn-primary" onclick="deluser(\''+item.account+'\',\''+item.id+'\');">删除</a>&nbsp;'
					switch(item.state){
						case 0:
							//userlis+='<a onclick="setuserStatus('+item.id+',2);" href="javascript:void(0);" class="btn btn-primary ">冻结</a>&nbsp;'
							userlis+='<a onclick="setuserStatus('+item.id+',1);" href="javascript:void(0);" class="btn btn-primary ">停用</a>&nbsp;'
							break;
						case 1:
							userlis+='<a onclick="setuserStatus('+item.id+',0);" href="javascript:void(0);" class="btn btn-primary ">正常</a>&nbsp;'
							//userlis+='<a onclick="setuserStatus('+item.id+',2);" href="javascript:void(0);" class="btn btn-primary ">冻结</a>&nbsp;'
							break;
						case 2:
							userlis+='<a onclick="setuserStatus('+item.id+',0);" href="javascript:void(0);" class="btn btn-primary ">正常</a>&nbsp;'
							userlis+='<a onclick="setuserStatus('+item.id+',1);" href="javascript:void(0);" class="btn btn-primary ">停用</a>&nbsp;'
							break;
					}
				userlis+='</td>'
				userlis+='</tr>'
			}else{
				userlis+='<tr class="center">';
				userlis+='<td>'+(i+1)+'</td>';
				userlis+='<td>'+item.account+'</td>';
				userlis+='<td>'+item.nick+'</td>';
				userlis+='<td>'+item.roles[0].id+'</td>'
				userlis+='<td>'+item.stateName+'</td>'
				userlis+='<td class="center">'
				var moduser="'"+item.account+"','"+item.id+"','"+item.mobile+"','"+item.officeTel+"','"+item.roles[0].id+"','"+item.nick+"', '"+item.groupCode+"'";
				userlis+='<a class="btn btn-primary " href="javascript:;" class="btn btn-primary" onclick="moduser('+moduser+');">修改</a>'
				userlis+='</td>'
				userlis+='</tr>'
			}
		});
	$("#userlist").append(userlis);
	}
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
}

/**
 * get group name.
 * @param item
 * @returns {string}
 */
function getGroupName(item) {
    var name = '无';
    if (1 == item.groupCode) {
        name = '全局';
    } else if (2 == item.groupCode) {
        name = '客服';
    } else if (3 == item.groupCode) {
        name = '技术';
    }
    return name;
}

//新增账号
function adduser(){
	$('#itfrom')[0].reset();
	$("#account").removeAttr('disabled');
	$("#t_pass").show();
	var contents=$('#addBox').get(0);
	var artBox=art.dialog({
		lock: true,
		artIcon:'add',
		opacity:0.4,
		width: 400,
		padding:'0px 0px',
		title:'新增账号',
		header:false,
		content: contents,
		ok: function () {
		var account = $('#account');
		var password = $('#password');
		var phone = $('#phone');
		var nick = $('#nick');
			if(Commonjs.isEmpty(account.val())){
				$.tooltip('账号不能为空',2000,false);
				account.focus();
				return false;
			}
			if(CndnsValidate.checkChinese(account.val())){
				$.tooltip('账号不能带有中文',2000,false);
				account.focus();
				return false;
			}
			if(Commonjs.isEmpty(password.val())){
				$.tooltip('密码不能为空',2000,false);
				password.focus();
				return false;
			}
			if(CndnsValidate.checkChinese(password.val())){
				$.tooltip('密码不能带有中文',2000,false);
				password.focus();
				return false;
			}
			if(Commonjs.isEmpty(phone.val())){
				$.tooltip('手机号码不能为空',2000,false);
				phone.focus();
				return false;
			}
			if(!CndnsValidate.checkTel1(phone.val())){
				$.tooltip('请输入正确的手机号码',2000,false);
				phone.focus();
				return false;
			}
			if(Commonjs.isEmpty(nick.val())){
				$.tooltip('昵称不能为空',2000,false);
				phone.focus();
				return false;
			}
			if($('#fixedphone').val() != ""){
				if(!CndnsValidate.checkTel1($('#fixedphone').val())){
					$.tooltip('请输入正确的固定电话',2000,false);
					$('#fixedphone').focus();
					return false;
				}
			}

			var service = {};
			service.account = account.val();
			service.password = password.val();
			service.roles = $("#role").val();
			service.mobile = phone.val();
			service.nick = nick.val();
			service.officeTel = $('#fixedphone').val();
			service.groupCode = $('#groupCode').val();
			service.utype = 0;
			var fn="adduser";
			service = Commonjs.jsonToString(service);
			var params = Commonjs.getParams(fn,service);//获取参数
			Commonjs.ajaxTrue(sysurl,params,adduserSuccess,false);
		},cancel: function(){
			$('#addBox').hide();
		}
	});
}

function adduserSuccess(data){
	$.tooltip(data.msg,2000,true);
	s_userlist();
}

//删除账号
function deluser(account,id){
	var dialog=	art.dialog({
		lock : true,
		opacity : 0.4,
		width : 250,
		title : '提示',
		content : '您确定删除吗？',
		ok : function() {
	       	 	var service = {};
				service.id = id;
				service.account = account;
				var fn="deluser";
				service = Commonjs.jsonToString(service);
				var params = Commonjs.getParams(fn,service);//获取参数
				Commonjs.ajaxTrue(sysurl,params,deluserSuccess,false);
		},cancel: function(){
			$('#dialog').hide();
		}
	});
}

function deluserSuccess(data){
	$.tooltip(data.msg,2000,true);
	s_userlist();
}

//修改账号
function moduser(account,id,mobile,officeTel,roleid,nick,groupCode){
	$("#account").val(account);
	$("#phone").val(mobile);
	$("#fixedphone").val(officeTel);
	$("#ID").val(id);
	$("#t_pass").hide();
	$("#account").attr("disabled", true);
	$("#role").val(roleid);
	$("#nick").val(nick);
	$('#groupCode').val(parseInt(groupCode));
	var contents=$('#addBox').get(0);
	var artBox=art.dialog({
		lock: true,
		artIcon:'add',
		opacity:0.4,
		width: 400,
		padding:'0px 0px',
		title:'修改账号',
		header:false,
		content: contents,
		ok: function () {
		var phone = $('#phone');
		var nick = $('#nick');

		if(Commonjs.isEmpty(phone.val())){
				$.tooltip('手机号码不能为空',2000,false);
				phone.focus();
				return false;
		}
		if(!CndnsValidate.checkTel1(phone.val())){
			$.tooltip('请输入正确的手机号码',2000,false);
			phone.focus();
			return false;
		}
		if(Commonjs.isEmpty(nick.val())){
				$.tooltip('昵称不能为空',2000,false);
				phone.focus();
				return false;
		}
		if($('#fixedphone').val() != ""){
			if(!CndnsValidate.checkTel1($('#fixedphone').val())){
				$.tooltip('请输入正确的固定电话',2000,false);
				$('#fixedphone').focus();
				return false;
			}
		}
			var service = {};
			service.id = parseInt($("#ID").val());
			service.roles = $("#role").val();
			service.mobile = phone.val();
			service.officeTel =$('#fixedphone').val();
			service.nick =nick.val();
			service.groupCode=$('#groupCode').val();
			var fn="moduser";
			service = Commonjs.jsonToString(service);
			var params = Commonjs.getParams(fn,service);//获取参数
			Commonjs.ajaxTrue(sysurl,params,moduserSuccess,false);
		},cancel: function(){
			$('#addBox').hide();
		}
	});
}

function moduserSuccess(data){
	$.tooltip(data.msg,2000,true);
	s_userlist();
}

//修改状态
function setuserStatus(id,state){
	var service = {};
	service.id = id;
	service.state = state;
	var fn="setstatus";
	service = Commonjs.jsonToString(service)
	var params = Commonjs.getParams(fn,service);//获取参数
	Commonjs.ajaxTrue(sysurl,params,StatusSuccess,false);
}

function StatusSuccess(data){
	$.tooltip(data.msg,2000,true);
	s_userlist();
}

//获取角色名
function queryrole(){
	var service = {};
	service.page = 1;
	service.pagesize = 100;
	var fn="queryrole";
	service = Commonjs.jsonToString(service)
	var params = Commonjs.getParams(fn,service);//获取参数
	Commonjs.ajaxTrue(sysurl,params,queryroleSuccess,false);
}

function queryroleSuccess(data){
	$("#role").empty();
	var userlist="";
	if (data.data.length>0){
		BaseForeach(data.data,function(i,item){
			userlist+='<option value="'+item.roleName+'">'+item.roleName+'</option>';
		});
	}
	$('#role').append(userlist);
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
			s_userlist();
  		}
  	});
}
