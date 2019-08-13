var instanceId;
$(function(){
	instanceId=request("iId");
	queryUserService(instanceId);

	$('#btnBackList').on('click', function () {
        history.back();
    });

    $("body").click(function(e){
        if($(e.target).parents(".autosuo").length==0){
            $(".edit-ul").hide();
        }
    });
});

/**
 * 获取虚拟主机信息.
 * @param instanceId
 */
function queryUserService(instanceId){
	var service = {};
	service.id=instanceId;
	var fn="getDiy";
	service = Commonjs.jsonToString(service)
	var params = Commonjs.getParams(fn,service);//获取参数
	Commonjs.ajaxTrue(weburl,params,querySuccess);
}

/**
 * 页面渲染.
 * @param data
 */
function querySuccess(data){
	var html='';
	var info=data.data;
	if(info!=null){
	    console.log(info);
	    $('#productName').html(info.productName);
		html+='<tr><td width="10%" align="right"><span>产品分类：</span></td>';
		html+='<td width="40%">'+info.subClassName+'</td>';
		html+='<td width="10%" align="right"><span>产品名称：</span></td>';
		html+='<td width="40%">'+info.productName+'</td>';
		html+='</tr><tr>';
        html+='<td align="right"><span>产品信息：</span></td>';
        html+='<td colspan="3">'+(info.openInfo.order_describe ? info.openInfo.order_describe.replace(/\n/g, '<br />') : info.openInfo.productDetail.replace(/\n/g, '<br />'))+'</td>';
        html+='</tr><tr>';
		html+='<td align="right"><span>开通时间：</span></td>';
		html+='<td>'+jsonDateTimeFormat(info.startTime)+'</td>';
		html+='<td align="right"><span>到期时间：</span></td>';
		html+='<td>'+jsonDateTimeFormat(info.endTime)+'</td>';
		html+='</tr><tr>';
		html+='<td align="right"><span>产品状态：</span></td>';
		html+='<td><span id="statusname">'+info.statusName+'</span></td>';
		html+='<td align="right"><span>累计消费金额：</span></td>';
		html+='<td>' + info.price + '</td>';
        html+='</tr><tr>';
        html+='<td align="right"><span>配置信息：</span></td>';
        html+='<td colspan="3"><span id="statusname">'+info.instanceInfo.replace(/\n/g, '<br />')+'</span></td>';
        html+='</tr>';
		$("#view").html(html);

	}
}

/**
 * Web站点升级.
 * @param info
 */
function upWebFunc(info) {
}

/**
 * 目录权限管理
 * @param info
 */
function resetWebSiteDirRight(info) {
    var modalWin = wModal(window).add('webSiteDirRight', $('#_webSiteDirRight').html()).show();

    modalWin.find('.btn-primary').unbind('click').on('click', function () {
        var service = {};
        service.id=instanceId;
        service.dir = modalWin.find('#dir').val();
        service.NtfsFlag = modalWin.find('#NtfsFlag').val();
        var fn="resetWebSiteDirRight";
        service = Commonjs.jsonToString(service)
        var params = Commonjs.getParams(fn,service);
        parent.Commonjs.ajaxTrue(weburl,params,function () {
            topSuccess(window, '操作成功');
        });
    });

    modalWin.onHide(function () {
        location.reload();
    });
}

/**
 * 显示.net版本信息.
 * @param info
 */
function showWebSiteNetName(info) {
    //加载版本
    var service = {};
    var fn="getWebSiteNet";
    service = Commonjs.jsonToString(service)
    var params = Commonjs.getParams(fn,service);
    parent.Commonjs.ajaxTrue(weburl,params,function (data) {
        $.each(data.data, function (index, item) {
            if (info.extendInfo.WebAspNet == item.val) {
                $('#netVersion').html(item.name);
            }
        });
    });
}

/**
 * ftp状态设置.
 * @param info
 */
function queryFtpState(info) {
    var html = '';
    console.log(info);
    if(0===parseInt(info.extendInfo.FtpState)) {
        html = '<span style="color:#090">正常</span>';
        //html += '&nbsp;&nbsp;<input type="button" class="manager-btn" value="停止" id="stopFtp" />';
    } else {
        html = '<span style="color:#F90">关闭</span>';
        //html += '&nbsp;&nbsp;<input type="button" class="manager-btn" value="开启" id="startFtp" />';
    }
    $('#ftpStateTd').html(html);
    //事件绑定
    $('#stopFtp').on('click', function () {
        setFtpState(1);
    });
    $('#startFtp').on('click', function () {
        setFtpState(0);
    });

    /**
     * ftp状态.
     * @param state
     */
    var setFtpState = function (state) {
        parent.art.dialog({
            lock : true,
            opacity : 0.4,
            width : 250,
            title : '提示',
            content : '您确定需要'+(state==0 ? '开启' : '关闭')+'FTP吗？',
            ok : function() {
                var service = {};
                service.id = instanceId;
                service.state = state;
                var fn="setFtpState";
                service = Commonjs.jsonToString(service)
                var params = Commonjs.getParams(fn,service);
                parent.Commonjs.ajaxTrue(weburl,params,function (data) {
                    location.reload();
                });
            }
        });
    };
}

/**
 * 获取Ftp用量信息.
 * @param info
 */
function queryFtpQuota(info) {
    var service = {};
    service.id = instanceId;
    var fn="getFtpQuota";
    service = Commonjs.jsonToString(service)
    var params = Commonjs.getParams(fn,service);
    parent.Commonjs.ajaxTrue(weburl,params,function (data) {
        $('#usedFtpSize').html(data.data.FtpDiskUse);
    });
}

/**
 * Ftp密码修改
 * @param info
 */
function modFtpPassFunc(info) {
    var modalWin = wModal(window).add('ftpPassEdit', $('#_ftpPassEdit').html()).show();

    //加载版本
    modalWin.find('#ftpAccount').html(info.extendInfo.FtpUser);

    //绑定事件
    modalWin.find('.btn-primary').unbind('click').on('click', function () {
        var oldPwd = $.trim(modalWin.find('#ftpOldPwd').val());
        var newPwd = $.trim(modalWin.find('#ftpNewPwd').val());
        var newPwdCheck = $.trim(modalWin.find('#ftpNewPwdCheck').val());
        if ('' === oldPwd) {
            topError(window, '请输入旧密码');
            return;
        }
        if ('' === newPwd) {
            topError(window, '请输入新密码');
            return;
        }
        if (newPwdCheck != newPwd) {
            topError(window, '新密码确认错误');
            return;
        }
        if (oldPwd === newPwd) {
            topError(window, '新密码不能与旧密码相同')
            return;
        }
        var service = {};
        service.id = instanceId;
        service.oldpwd = cloudEncrypt.encodeSession(oldPwd);
        service.newpwd = cloudEncrypt.encodeSession(newPwd);
        var fn="modFtpPass";
        service = Commonjs.jsonToString(service)
        var params = Commonjs.getParams(fn,service);
        parent.Commonjs.ajaxTrue(weburl,params,function () {
            topSuccess(window, '操作成功');
        });
    });

    modalWin.onHide(function () {
        location.reload();
    });
}

/**
 * 文件压缩.
 */
function tarFtpFunc() {
    var modalWin = wModal(window).add('ftpTarEdit', $('#_ftpTarEdit').html()).show();

    //绑定事件
    modalWin.find('.btn-primary').unbind('click').on('click', function () {
        var service = {};
        service.id = instanceId;
        service.ftpDir = modalWin.find('#ftpDir').val();
        service.ftpDirTar = $.trim(modalWin.find('#ftpDirTar').val());
        if ('' == service.ftpDirTar) {
            topError(window, '压缩后的文件名不能为空');
            return;
        }
        var fn="ftpTar";
        service = Commonjs.jsonToString(service);
        var params = Commonjs.getParams(fn,service);
        parent.Commonjs.ajaxTrue(weburl,params,function () {
            topSuccess(window, '操作成功');
        });
    });

    modalWin.onHide(function () {
        location.reload();
    });
}

/**
 * 文件解压.
 */
function unTarFtpFun() {
    var modalWin = wModal(window).add('ftpUnTarEdit', $('#_ftpUnTarEdit').html()).show();

    //绑定事件
    modalWin.find('.btn-primary').unbind('click').on('click', function () {
        var service = {};
        service.id = instanceId;
        service.ftpUnDir = modalWin.find('#ftpUnDir').val();
        service.ftpUnDirTar = modalWin.find('#ftpUnDirTar').val();
        if ('' == service.ftpUnDirTar) {
            topError(window, '压缩文件名不能为空');
            return;
        }
        var fn="ftpUnTar";
        service = Commonjs.jsonToString(service);
        var params = Commonjs.getParams(fn,service);
        parent.Commonjs.ajaxTrue(weburl,params,function () {
            topSuccess(window, '操作成功');
        });
    });

    modalWin.onHide(function () {
        location.reload();
    });
}

/**
 * SQL Server信息同步.
 */
function queryMssqlInfo() {
    var service = {};
    service.id = instanceId;
    var fn="queryMssql";
    service = Commonjs.jsonToString(service)
    var params = Commonjs.getParams(fn,service);
    parent.Commonjs.ajaxTrue(weburl,params,function (data) {
        $('#usedMssqlSize').html(data.data.DbSize);
        $('#usedMssqlLogSize').html(data.data.DbLogSize)
    });
}

/**
 * SQL Server修改密码.
 */
function modMssqlPassFunc() {
    var modalWin = wModal(window).add('mssqlEditPass', $('#_mssqlEditPass').html()).show();

    //绑定事件
    modalWin.find('.btn-primary').unbind('click').on('click', function () {
        var oldPwd = $.trim(modalWin.find('#mssqlOldPwd').val());
        var newPwd = $.trim(modalWin.find('#mssqlNewPwd').val());
        var newPwdCheck = $.trim(modalWin.find('#mssqlNewPwdCheck').val());
        if ('' === oldPwd) {
            topError(window, '请输入旧密码');
            return;
        }
        if ('' === newPwd) {
            topError(window, '请输入新密码');
            return;
        }
        if (newPwdCheck != newPwd) {
            topError(window, '新密码确认错误');
            return;
        }
        if (oldPwd === newPwd) {
            topError(window, '新密码不能与旧密码相同');
            return;
        }

        var service = {};
        service.id = instanceId;
        service.oldpwd = cloudEncrypt.encodeSession(oldPwd);
        service.newpwd = cloudEncrypt.encodeSession(newPwd);
        var fn="editMssqlPass";
        service = Commonjs.jsonToString(service);
        var params = Commonjs.getParams(fn,service);
        parent.Commonjs.ajaxTrue(weburl,params,function () {
            topSuccess(window, '操作成功');
        });
    });

    modalWin.onHide(function () {
        location.reload();
    });
}

/**
 * SQL Server备份.
 * @param info
 */
function backMssqlFunc(info) {
    var modalWin = wModal(window).add('mssqlBackup', $('#_mssqlBackup').html()).show();

    modalWin.find('#mssqlServerDialog').html(info.extendInfo.openMssqlIp);
    modalWin.find('#mssqlNameDialog').html(info.extendInfo.DbName);

    //绑定事件
    modalWin.find('.btn-primary').unbind('click').on('click', function () {
        var mssqlBackTo = $.trim(modalWin.find('#mssqlBackTo').val());
        if ('' === mysqlBackTo) {
            topError(window, '请填写备份文件名');
            return;
        }

        var service = {};
        service.id = instanceId;
        service.mssqlBackTo = mssqlBackTo;
        var fn="backMssql";
        service = Commonjs.jsonToString(service);
        var params = Commonjs.getParams(fn,service);
        parent.Commonjs.ajaxTrue(weburl,params,function () {
            topSuccess(window, '操作成功');
        });
    });

    modalWin.onHide(function () {
        location.reload();
    });
}

/**
 * SQL Server 还原.
 * @param info
 */
function restoreMssqlFunc(info) {
    var modalWin = wModal(window).add('mssqlRestore', $('#_mssqlRestore').html()).show();

    modalWin.find('#mssqlServerDialogRestore').html(info.extendInfo.openMssqlIp);
    modalWin.find('#mssqlNameDialogRestore').html(info.extendInfo.DbName);

    //绑定事件
    modalWin.find('.btn-primary').unbind('click').on('click', function () {
        var mssqlBackFile = $.trim(modalWin.find('#mssqlBackFile').val());
        if ('' === mssqlBackFile) {
            topError(window, '请填写备份文件名');
            return;
        }

        parent.art.dialog({
            lock : true,
            opacity : 0.4,
            width : 250,
            title : '提示',
            content : '警告：该操作将还原整个数据，原有数据的数据将丢失，且不能恢复，请勿必先备份好原有的数据库。确定需要继续执行此操作吗？',
            ok : function() {
                var service = {};
                service.id = instanceId;
                service.mssqlBackFile = mssqlBackFile;
                var fn="restoreMssql";
                service = Commonjs.jsonToString(service);
                var params = Commonjs.getParams(fn,service);
                parent.Commonjs.ajaxTrue(weburl,params,function () {
                    topSuccess(window, '操作成功');
                });
            },
            cancel: function(){
                $('#dialog').hide();
            }
        });
    });

    modalWin.onHide(function () {
        location.reload();
    });
}

/**
 * SQL Server 清理日志
 */
function clearMssqlFunc() {
    parent.art.dialog({
        lock : true,
        opacity : 0.4,
        width : 250,
        title : '提示',
        content : '警告：该操作将删除数据库日志，该操作将不能恢复，请勿必先备份好原有的数据库。你确实要执行该操作吗？',
        ok : function() {
            var service = {};
            service.id = instanceId;
            var fn="deleteMssqlLog";
            service = Commonjs.jsonToString(service);
            var params = Commonjs.getParams(fn,service);
            parent.Commonjs.ajaxTrue(weburl,params,function () {
                topSuccess(window, '操作成功');
                location.reload();
            });
        },
        cancel: function(){
            $('#dialog').hide();
        }
    });
}

/**
 * MySQL信息查询同步.
 */
function queryMysqlInfo() {
    var service = {};
    service.id = instanceId;
    var fn="queryMysql";
    service = Commonjs.jsonToString(service)
    var params = Commonjs.getParams(fn,service);
    parent.Commonjs.ajaxTrue(weburl,params,function (data) {
        $('#usedMysqlSize').html(data.data.MySQLDiskUse);
    });
}

/**
 * 密码修改
 * @param info
 */
function modMysqlPassFunc(info) {
    var modalWin = wModal(window).add('mysqlEditPass', $('#_mysqlEditPass').html()).show();

    //绑定事件
    modalWin.find('.btn-primary').unbind('click').on('click', function () {
        var oldPwd = $.trim(modalWin.find('#mysqlOldPwd').val());
        var newPwd = $.trim(modalWin.find('#mysqlNewPwd').val());
        var newPwdCheck = $.trim(modalWin.find('#mysqlNewPwdCheck').val());
        if ('' === oldPwd) {
            topError(window, '请输入旧密码');
            return;
        }
        if ('' === newPwd) {
            topError(window, '请输入新密码');
            return;
        }
        if (newPwdCheck != newPwd) {
            topError(window, '新密码确认错误');
            return;
        }
        if (oldPwd === newPwd) {
            topError(window, '新密码不能与旧密码相同');
            return;
        }

        var service = {};
        service.id = instanceId;
        service.oldpwd = cloudEncrypt.encodeSession(oldPwd);
        service.newpwd = cloudEncrypt.encodeSession(newPwd);
        var fn="editMysqlPass";
        service = Commonjs.jsonToString(service);
        var params = Commonjs.getParams(fn,service);
        parent.Commonjs.ajaxTrue(weburl,params,function () {
            topSuccess(window, '操作成功');
        });
    });

    modalWin.onHide(function () {
        location.reload();
    });
}

/**
 * MySQL备份.
 * @param info
 */
function backMysqlFunc(info) {
    var modalWin = wModal(window).add('mysqlBackup', $('#_mysqlBackup').html()).show();

    modalWin.find('#mysqlServerDialog').html(info.extendInfo.openMysqlIp);
    modalWin.find('#mysqlNameDialog').html(info.extendInfo.MySQLName);

    //绑定事件
    modalWin.find('.btn-primary').unbind('click').on('click', function () {
        var mysqlBackTo = $.trim(modalWin.find('#mysqlBackTo').val());
        if ('' === mysqlBackTo) {
            topError(window, '请填写备份文件名');
            return;
        }

        var service = {};
        service.id = instanceId;
        service.mysqlBackTo = mysqlBackTo;
        var fn="backMysql";
        service = Commonjs.jsonToString(service);
        var params = Commonjs.getParams(fn,service);
        parent.Commonjs.ajaxTrue(weburl,params,function () {
            topSuccess(window, '操作成功');
        });
    });

    modalWin.onHide(function () {
        location.reload();
    });
}

/**
 * MySQL还原.
 * @param info
 */
function restoreMysqlFun(info) {
    var modalWin = wModal(window).add('mysqlRestore', $('#_mysqlRestore').html()).show();

    modalWin.find('#mysqlServerDialogRestore').html(info.extendInfo.openMysqlIp);
    modalWin.find('#mysqlNameDialogRestore').html(info.extendInfo.MySQLName);

    //绑定事件
    modalWin.find('.btn-primary').unbind('click').on('click', function () {
        var mysqlBackFile = $.trim(modalWin.find('#mysqlBackFile').val());
        if ('' === mysqlBackFile) {
            topError(window, '请填写备份文件名');
            return;
        }

        parent.art.dialog({
            lock : true,
            opacity : 0.4,
            width : 250,
            title : '提示',
            content : '警告：该操作将还原整个数据，原有数据的数据将丢失，且不能恢复，请勿必先备份好原有的数据库。确定需要继续执行此操作吗？',
            ok : function() {
                var service = {};
                service.id = instanceId;
                service.mysqlBackFile = mysqlBackFile;
                var fn="restoreMysql";
                service = Commonjs.jsonToString(service);
                var params = Commonjs.getParams(fn,service);
                parent.Commonjs.ajaxTrue(weburl,params,function () {
                    topSuccess(window, '操作成功');
                });
            },
            cancel: function(){
                $('#dialog').hide();
            }
        });
    });

    modalWin.onHide(function () {
        location.reload();
    });
}

/**
 *
 * @param type
 */
function getPwd(type) {
    var modalWin = wModal(window).add('findPassWord', $('#_findPassWord').html()).show();

    //绑定事件
    modalWin.find('.btn-primary').unbind('click').on('click', function () {
        var checkRandCode = $.trim(modalWin.find('#checkRandCode').val());
        modalWin.find('#checkRandCode').val('');
        if ('' === checkRandCode) {
            topError(window, '请填写验证码');
            modalWin.find('#imgcode').trigger('click');
            return;
        }

        var service = {};
        service.id = instanceId;
        service.checkRandCode = checkRandCode;
        service.type = type;
        var fn="getControlPass";
        service = Commonjs.jsonToString(service);
        var params = Commonjs.getParams(fn,service);
        parent.Commonjs.ajaxTrue(weburl,params,function () {
            topSuccess(window, '操作成功，密码已发送到您的邮箱，请注意妥善保管！');
            modalWin.find('#imgcode').trigger('click');
            modalWin.hide();
            location.reload();
        });
    });

    modalWin.onHide(function () {
        location.reload();
    });
}

//更多操作
function getOptItem(){
	var html='';
    html+='<li><a href="./upgrade.html?iId='+instanceId+'">升级</a></li>';
    html+='<li><a href="./renew.html?iId='+instanceId+'">续费</a></li>';
	$("#optItem").html(html);
	$('#opt').removeClass("disable");
	$('#opt').on('click', function () {
        for(var i = 0;i < $(".edit-ul").length; i++){
            $(".edit-ul").eq(i).hide();
        }
        if($(".edit-ul").attr("flag") =="1"){
            $(".edit-ul").attr("flag",0);
        }else{
            $("#opt").siblings(".edit-ul").show();
            $(".edit-ul").attr("flag",1);
        }
    });

	$(".edit-ul li a").click(function(){
		$(".edit-ul").hide();
	});
}

/**
 * 获取网站状态.
 * @param status
 * @param hostType
 * @param instanceId
 * @param serviceId
 */
function getHostStatus(info){
	bindStatusWebsite(info.extendInfo);
}

/**
 * Web站点状态.
 * @param result
 */
function bindStatusWebsite(result) {
    var html = '';
    if(0===parseInt(result.WebState)) {
        html = '<span style="color:#090">正常</span>';
        //html += '&nbsp;&nbsp;<input type="button" class="manager-btn" value="停止" id="stopWebSite" />';
    } else {
        html = '<span style="color:#F90">关闭</span>';
        //html += '&nbsp;&nbsp;<input type="button" class="manager-btn" value="开启" id="startWebSite" />';
    }
    $('#webSiteState').html(html);
    //事件绑定
	$('#stopWebSite').on('click', function () {
        setWebSiteState(1);
    });
	$('#startWebSite').on('click', function () {
		setWebSiteState(0);
    });
}

/**
 * 修改网站状态.
 * @param state
 */
function setWebSiteState(state) {
    var service = {};
    service.id=instanceId;
    service.state = state;
    var fn="setWebSiteState";
    service = Commonjs.jsonToString(service)
    var params = Commonjs.getParams(fn,service);//获取参数
    $.ajax({
        datatype:"json",
        type:"POST",
        url: weburl,
        data:params,
        cache : false,
        success: function(data){
            location.reload();
            $.tooltip('操作成功',2000,true);
        },
        error : function (errr) {
            $.tooltip('操作失败',2000,false);
        }
    });
}
