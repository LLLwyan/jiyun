// JavaScript Document
var webtitle;
$(function(){
	//检查是否登录
	if ($.cookie("hlhtName") == null || $.cookie("hlhtName") == '') {
		location.href='./login.html';
	}
	getmenu();//获取菜单
	getParam();
});

//获取菜单
function getmenu(){
	var fn="getmenu";
	var params = Commonjs.getParams(fn,"");//获取参数
	var data=Commonjs.ajax(sysurl,params,false);
	var funCodeList = {};
	var topMenum="";
	if(data.result=="success"){
        var menllist="";
        BaseForeach(data.data,function(i,item) {
            if(item.parentId=="1"){
            	topMenum+="<li funId=\"" + item.funId + "\"><a href=\"javascript:void (0)\">" + item.title + "</a></li>";

                menllist+=' <li class="nav-header" pFunId="' + item.funId + '" style="display: none">';
                menllist+=' <div class="dropdown profile-element center">';
                menllist+=' <svg class="icon" aria-hidden="true" style="height: 50px; width: 50px"><use xlink:href="#' + item.resource + '"></use></svg>';
                menllist+=' <span class="clear">';
                menllist+=' <span class="block m-t-xs center" id="acount_name">'+item.caption+'</span>';
                menllist+=' </span>';
                menllist+=' </a>';
                menllist+=' </div>';
                menllist+=' </li>';

            }
        });

        BaseForeach(data.data,function(k,prtitem){
            if(prtitem.parentId=="2" && prtitem.isMenu==1){
                menllist += '<li pFunId="' + prtitem.funId.substring(0,1) + '" style="display: none"><a href="' +
					prtitem.moduleUrl + '" class="J_menuItem">' +
					'<svg class="icon" aria-hidden="true" style="height: 15px; width: 15px;"><use xlink:href="#' +
					prtitem.resource + '" style="color: #fff"></use></svg>' + ' ' +
					' <span class="nav-label">' + prtitem.title + '</span></a></li>';

                $.each(prtitem.funcs, function(index, subItem) {
                    funCodeList[subItem.id] = subItem.title;
                });
            }
        });

		$('#topBar').html(topMenum);
		$('#side-menu').html(menllist);

		//菜单选中
        $('#side-menu').find('a').on('click', function () {
        	$('#side-menu').find('li').removeClass('active');
            $(this).parent().addClass('active');
        });

		//导航切换
		$('#topBar').find('li').unbind('click').on('click', function () {
			$('#topBar').find('li').removeClass('selected');
            $(this).addClass('selected');

			var funId = $(this).attr('funId');
			$('#side-menu').find('li').css('display', 'none');
            $('#side-menu').find('li[pFunId="' + funId + '"]').css('display', '');

            $($('#side-menu').find('li[pFunId="' + funId + '"]').get(1)).find('a').trigger('click');
        });
		$($('#topBar').find('li').get(0)).trigger('click');
	}
	window.localStorage.setItem(configParam.session.funCode, Commonjs.jsonToString(funCodeList));
}

function getParam(){
	var service = {};
	service.type = 1;
	var fn="getparam";
	service = Commonjs.jsonToString(service)
	var params = Commonjs.getParams(fn,service);//获取参数
	var data=Commonjs.ajax(sysurl,params,false);
	if(data==null)
		return false;
	if(data.result=="success"){
		BaseForeach(data.data, function (i, item) {
			switch(item.paramName){
				case "webtitle":
					webtitle=item.paramValue;
					break;
			}
		});
	}
}

function logout(){
		var dialog=	art.dialog({
			lock : true,
			opacity : 0.4,
			width : 250,
			title : '提示',
			content : '确定退出？',
			ok : function() {
			var fn="logout";
			var params = Commonjs.getParams(fn,"");//获取参数
			$.ajax({
				datatype: "json",
				type: "POST",
				url: sysurl,
				data: params,
				timeout: 8000,
				cache: false,
				success: function(obj) {
					var data = jQuery.parseJSON(obj);
					if(data.result=="success" || data.code=="S302"){
						$.cookie("hlhtName", null,{expires:-1,path:"/"});
						window.location.href='login.html';
						//Commonjs.alerturl(data.msg,realPath+"/houtai/login.html");
					}
					else
					{
						$.cookie("hlhtName", null,{expires:-1,path:"/"});
					}
				},
			error: function() {
				closeload();
				alertNew('服务器忙，请稍候再试！');
			}
				})
		},
		cancel: function(){
			$('#dialog').hide();
		}
		});
		 $(".aui_close").hide();//隐藏关闭
}

function uptadminpas(){
	var content=$('#addBox').html();
	var dialog=	art.dialog({
		lock : true,
		opacity : 0.5,
		width : 450,
		title : "管理员修改密码",
		content : content,
		ok : function() {
			if(Commonjs.isEmpty($("#oldPassword").val())){
				$.tooltip('原密码不能为空',2000,false);
				$("#oldPassword").focus();
				return false;
			}
			if(Commonjs.isEmpty($("#newPassword").val())){
				$.tooltip('新密码不能为空',2000,false);
				$("#newPassword").focus();
				return false;
			}
			 if ($.trim($("#repeatPassword").val()) == "" || $("#newPassword").val() != $("#repeatPassword").val()) {
			     	$.tooltip('两次密码输入不一致，请重新输入', 2000, false);
			    	$('#repeatPassword').focus();
					return false;
			     }
			 var service = {};
				service.oldPassword = cloudEncrypt.encodeSession($("#oldPassword").val());
				service.newPassword = cloudEncrypt.encodeSession($("#newPassword").val());
				var fn="uptadminpas";
				service = Commonjs.jsonToString(service);
				var params = Commonjs.getParams(fn,service);//获取参数
				$.ajax({
					datatype: "json",
					type: "POST",
					url: weburl,
					data: params,
					timeout: 8000,
					cache: false,
					beforeSend: function() {
						divalertLoad('正在加载数据,请稍等');
					},
					success: function(obj) {
						var data = jQuery.parseJSON(obj);
						if(data.result == "success"){
							$.tooltip(data.msg, 2000, true);
							location.reload();
                            closeload();
						}else{
							$.tooltip(data.msg, 2000, false);
						}
						if (data.result == "failure") {
							if (data.result == "S202") {
								if (url == weburl) {
									$.cookie("hluserName", null, {
										expires: -1,
										path: "/"
									});
									top.location.href = realPath + '/default/login.html';
								} else {
									$.cookie("hlhtName", null, {
										expires: -1,
										path: "/"
									});
									Commonjs.alerturl(data.msg, realPath + '/houtai/login.html');
								}
								return false;
							} else {
								$.tooltip(data.msg, 2000, false);
								return false;
							}
						}
					},
					error: function() {
						closeload();
						alertNew('服务器忙，请稍候再试！');
					}
				});
		},
		cancel: function(){
			$('#dialog').hide();
		}
	});
}

function _topError(message) {
    $.tooltip(message,2000,false);
}

function _topSuccess(message) {
    $.tooltip(message,2000,true);
}
