//新增会员
function u_add(){
	var userName = $('#u_accout').val();
	var password = $('#u_pass').val();
	var npasswoed = $('#u_newpass').val();
	var email = $('#u_email').val();
	var moblie = $('#u_moblie').val();
	//验证数据
	if(Commonjs.isEmpty(userName)){
		$.tooltip('用户名不能为空', 2000, false);
		$('#u_accout').focus();
		return false;
	}
	if(!CndnsValidate.checkUserName(userName)){
    	$.tooltip('用户名格式不对', 2000, false);
    	$('#u_accout').focus();
    	return false;
    }
	if(Commonjs.isEmpty(password)){
		$.tooltip('密码不能为空', 2000, false);
		$('#u_pass').focus();
		return false;
	}
	if(!CndnsValidate.checkPassWord(password)){
    	$.tooltip('密码格式不对', 2000, false);
		$('#u_pass').focus();
		return false;
    }
	if(Commonjs.isEmpty(npasswoed)){
		$.tooltip('确认密码不能为空', 2000, false);
		$('#u_newpass').focus();
		return false;
	}
	 if ($.trim(npasswoed) == "" || password != npasswoed) {
     	$.tooltip('两次密码输入不一致，请重新输入', 2000, false);
    	$('#u_newpass').focus();
		return false;
     }
	if(Commonjs.isEmpty(email)){
		$.tooltip('邮箱不能为空', 2000, false);
		$('#u_email').focus();
		return false;
	}
	  if(!CndnsValidate.checkEmail(email)){
      	$.tooltip('邮箱格式不对', 2000, false);
    	$('#u_email').focus();
		return false;
      }
	if(Commonjs.isEmpty(moblie)){
		$.tooltip('手机号不能为空', 2000, false);
		$('#u_moblie').focus();
		return false;
	}
	 if(!CndnsValidate.checkMobile(moblie)){
     	$.tooltip('手机号格式不对', 2000, false);
    	$('#u_moblie').focus();
		return false;
     }
	//验证数据
	var service = {};
	var fn = 'addUserAccount';
	service.userName = userName;
	service.password = password;
	service.email = email;
	service.moblie = moblie;
	service = Commonjs.jsonToString(service);
	var params = Commonjs.getParams(fn, service);//获取参数
	Commonjs.ajaxTrue(weburl,params,addUserSuccess,false);
}

function addUserSuccess(data){
	$.tooltip(data.msg, 2000, true);
	$('#uAddForm')[0].reset();
}