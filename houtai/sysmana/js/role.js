$(function(){
	queryrole();
})

//查询角色列表
function queryrole(){
	var service = {};
	var fn="queryrole";
	service = Commonjs.jsonToString(service)
	var params = Commonjs.getParams(fn,service);//获取参数
	Commonjs.ajaxTrue(sysurl,params,queryroleSuccess);
};

function queryroleSuccess(data){
	if(data.data == null){
		return false;
	}
	$("#userlist").empty();
	var userlist="";
	if (data.data.length>0){
		BaseForeach(data.data,function(i,item){
			userlist+=' <tr><td>'+(i+1)+'</td>';
			userlist+=' <td>'+item.roleName+'</td>';
			userlist+=' <td>'+item.remark+'</td>';
			userlist+=' <td>';
			userlist+='<a href="./permiss.html?setrolefnid='+item.id+'" class="btn btn-primary ">权限设置</a> '
			userlist+='<a  href="javascript:void(0);" class="btn btn-primary" onclick="roleupdate('+item.id+',\''+item.roleName+'\',\''+item.remark+'\');">修改</a> '
			userlist+='<a  onclick="delrole(\''+item.roleName+'\');" href="javascript:void(0);" class="btn btn-primary ">删除</a> '
			userlist+='</td></tr>';
		});
	}else{
	userlist+=' <tr><td colspan="10" style="height:50px;text-align:center;line-height:50px;">找不到相关信息</td></tr>';
	}
	$('#userlist').append(userlist);
}

//删除角色
function delrole(roleName){
	var dialog=	art.dialog({
		lock : true,
		opacity : 0.4,
		width : 250,
		title : '提示',
		content : '您确定删除吗？',
		ok : function() {
			var service = {};
			service.roleName = roleName;
			var fn="delrole";
			service = Commonjs.jsonToString(service);
			var params = Commonjs.getParams(fn,service);//获取参数
			Commonjs.ajaxTrue(sysurl,params,delroleSuccess,false);
		},cancel: function(){
			$('#dialog').hide();
		}
	});
}

function delroleSuccess(data){
	$.tooltip(data.msg,2000,true);
	queryrole();
}

//新增角色
function showroleadd(){
	$('#roleaccout').removeAttr('disabled');
	$('#itfrom')[0].reset();
	var contents=$('#addBox').get(0);
	var artBox=art.dialog({
		lock: true,
		artIcon:'add',
		opacity:0.4,
		width: 400,
		padding:'0px 0px',
		title:'新增角色',
		header:false,
		content: contents,
		ok: function () {
			var roleaccout = $('#roleaccout');
			var remark =$('#remark')
			if(Commonjs.isEmpty(roleaccout.val())){
				$.tooltip('角色名不能为空',2000,false);
				roleaccout.focus();
				return false;
			}
			var service = {};
			service.roleName = roleaccout.val();
			service.remark = remark.val();
			service.roleCName = "";
			var fn="newrole";
			service = Commonjs.jsonToString(service);
			var params = Commonjs.getParams(fn,service);//获取参数
			Commonjs.ajaxTrue(sysurl,params,showroleaddSuccess,false);
		},
		cancel: function(){
			$('#addBox').hide();
		}
	});
}

function showroleaddSuccess(data){
	$.tooltip(data.msg,2000,true);
	queryrole();
}

//修改角色
function roleupdate(id,cname,remark){
	$('#roleid').val(id);
	$('#roleaccout').val(cname);
	$('#remark').val(remark);
	$('#roleaccout').attr('disabled',true);
	var contents=$('#addBox').get(0);
	var artBox=art.dialog({
		lock: true,
		artIcon:'add',
		opacity:0.4,
		width: 400,
		padding:'0px 0px',
		title:'修改角色',
		header:false,
		content: contents,
		ok: function () {
			var roleaccout = $('#roleaccout');
			var remark =$('#remark')
			if(Commonjs.isEmpty(roleaccout.val())){
				$.tooltip('角色名不能为空',2000,false);
				roleaccout.focus();
				return false;
			}
			var service = {};
			var roleid = $('#roleid').val();
			service.id = parseInt(roleid);
			service.roleName = roleaccout.val();
			service.remark = remark.val();
			service.cname = roleaccout.val();
			var fn="modrole";
			service = Commonjs.jsonToString(service);
			var params = Commonjs.getParams(fn,service);//获取参数
			Commonjs.ajaxTrue(sysurl,params,roleupdateSuccess);
		},cancel: function(){
			$('#addBox').hide();
		}
	});
}

function roleupdateSuccess(data){
	$.tooltip(data.msg,2000,true);
	queryrole();
}

