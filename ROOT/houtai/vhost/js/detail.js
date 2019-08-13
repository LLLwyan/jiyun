var instanceId;
$(function(){
	instanceId=request("iId");
    vmVHostAdminInfo.id = instanceId;
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
	var fn="adminINTQueryUserVhost";
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
	if(view!=null && info!=null){
	    vmVHostAdminInfo.info = info;
        vmVHostAdminInfo.resetFormValue();
	    $('#instanceIdShow').html(info.webName);
		html+='<tr><td width="10%" align="right"><span>实例ID：</span></td>';
		html+='<td width="40%">'+info.webName+'</td>';
		html+='<td width="10%" align="right"><span>实例名：</span></td>';
		html+='<td width="40%">'+info.webName+'</td>';
		html+='</tr><tr>';
		html+='<td align="right"><span>开通时间：</span></td>';
		html+='<td>'+jsonDateTimeFormat(info.startTime)+'</td>';
		html+='<td align="right"><span>到期时间：</span></td>';
		html+='<td>'+jsonDateTimeFormat(info.endTime)+'</td>';
		html+='</tr><tr>';
		html+='<td align="right"><span>产品状态：</span></td>';
		html+='<td colspan="3"><span id="statusname" style="color:#F90">'+getStatusColor(info.status, info.statusName)+'</span></td>';
        html+='</tr>';
		$("#view").html(html);

		if (info.vhostType.indexOf('web') > -1) {
            html = '';
            html += '<tr><td width="10%" align="right"><span>服务器IP：</span></td>';
            html += '<td width="40%">' + info.extendInfo.openWebIp + '</td>';
            html += '<td width="10%" align="right"><span>站点名称：</span></td>';
            html += '<td width="40%">' + info.extendInfo.WebSiteName + '</td>';
            html += '</tr><tr>';
            html += '<td align="right"><span>状态：</span></td>';
            html += '<td id="webSiteState"></td>';
            html += '<td align="right"><span>绑定域名：</span></td>';
            html += '<td><span id="bindDomain">' + info.extendInfo.WebHostName + '</span></td>';
            html += '</tr><tr>';
            html += '<td align="right"><span>默认文档：</span></td>';
            html += '<td>' + info.extendInfo.WebDefaultDoc + '</td>';
            html += '<td align="right"><span>允许绑定域名数：</span></td>';
            html += '<td>' + info.sysProductView.productParam.webHostNum + '个</td>';
            html += '</tr><tr>';
            html += '<td align="right"><span>支持脚本：</span></td>';
            html += '<td>' + info.extendInfo.WebScriptType + '</td>';
            html += '<td align="right"><span>NET版本：</span></td>';
            html += '<td><span id="netVersion"></span></td>';
            html += '</tr><tr>';
            html += '<td align="right"><span>PHP版本：</span></td>';
            if (info.extendInfo.WebScriptPhp) {
                html += '<td><span id="phpVersion">' + info.extendInfo.WebScriptPhp + '</span></td>';
            } else {
                html += '<td>不支持</td>';
            }
            html += '<td align="right"><span>CPU使用率：</span></td>';
            html += '<td>' + info.extendInfo.WebCPU + '%</td>';
            html += '</tr><tr>';
            html += '<td align="right"><span>IIS链接数：</span></td>';
            html += '<td>' + info.extendInfo.WebLinks + '</td>';
            html += '<td align="right"><span>站点即时带宽：</span></td>';
            html += '<td>' + info.extendInfo.WebWidth + 'Kbps</td>';
            html += '</tr><tr>';
            html += '<td align="right"><span>流量限额：</span></td>';
            html += '<td>' + info.extendInfo.WebFlow + 'G/月</td>';
            html += '<td align="right"><span>本月已用流量：</span></td>';
            html += '<td id="usedWebFlow"></td>';
            html += '</tr><tr>';
            html += '<td align="right"><span>操作系统：</span></td>';
            html += '<td colspan="3">' + info.sysProductView.productParam.webOs + '</td>';
            html += '</tr>';
            $("#info").html(html);
            $('#webInfoArea').css('display', '');

            getHostStatus(info);

            //.NET名称显示处理
            showWebSiteNetName(info);

            //Web升级
            $('#upWebBtn').on('click', function () {
                upWebFunc(info);
            });
        }

        if (info.vhostType.indexOf('ftp') > -1) {
            html = '';
            html += '<tr><td width="10%" align="right"><span>服务器IP：</span></td>';
            html += '<td width="40%">' + info.extendInfo.openFtpIp + '</td>';
            html += '<td width="10%" align="right"><span>状态：</span></td>';
            html += '<td width="40%" id="ftpStateTd"></td>';
            html += '</tr><tr>';
            html += '<td align="right"><span>用户名：</span></td>';
            html += '<td>' + info.extendInfo.FtpUser + '</td>';
            html += '<td align="right"><span>空间大小：</span></td>';
            html += '<td>' + info.extendInfo.FtpDiskQuota + 'M</td>';
            html += '</tr><tr>';
            html += '<td align="right"><span>已用空间大小：</span></td>';
            html += '<td colspan="3"><span id="usedFtpSize">' +info.extendInfo.FtpDiskUse+ '</span>M';
            //html += '&nbsp;&nbsp;<span id="reQueryFtp" style="cursor: pointer"><svg class="icon" aria-hidden="true"><use xlink:href="#icon-zidongshibie-copy"></use></svg>重新计算</span>';
            html += '</td>';
            html += '</tr>';
            html += '<tr>';
            $('#ftpInfo').html(html);
            $('#ftpInfoArea').css('display', '');

            //ftp状态显示
            queryFtpState(info);
		}

		if (info.vhostType.indexOf('mssql') > -1) {
            html = '';
            html += '<tr><td width="10%" align="right"><span>服务器IP：</span></td>';
            html += '<td width="40%">' + info.extendInfo.openMssqlIp + '</td>';
            html += '<td width="10%" align="right"><span>数据库名：</span></td>';
            html += '<td width="40%" id="ftpStateTd">' + info.extendInfo.DbName + '</td>';
            html += '</tr><tr>';
            html += '<td align="right"><span>数据库用户名：</span></td>';
            html += '<td colspan="3">' + info.extendInfo.DbUserName + '</td>';
            html += '</tr><tr>';
            html += '<td align="right"><span>数据空间大小：</span></td>';
            html += '<td>' + info.extendInfo.DbLogMaxSize + '</td>';
            html += '<td align="right"><span>已用空数据空间：</span></td>';
            html += '<td><span id="usedMssqlSize">' + info.extendInfo.DbSize +
                '</span> M &nbsp;&nbsp;</td>';
            html += '</tr><tr>';
            html += '<td align="right"><span>日志空间大小：</span></td>';
            html += '<td>' + info.extendInfo.DbMaxSize + '</td>';
            html += '<td align="right"><span>已用日志空间：</span></td>';
            html += '<td><span id="usedMssqlLogSize">' + info.extendInfo.DbLogSize +
                '</span> M </td>';
            html += '</tr>';
            $('#mssqlInfo').html(html);
            $('#mssqlInfoArea').css('display', '');
		}

        if (info.vhostType.indexOf('mysql') > -1) {
            html = '';
            html += '<tr><td width="10%" align="right"><span>服务器IP：</span></td>';
            html += '<td width="40%">' + info.extendInfo.openMysqlIp + '</td>';
            html += '<td width="10%" align="right"><span>数据库名：</span></td>';
            html += '<td width="40%" id="ftpState">' + info.extendInfo.MySQLName + '</td>';
            html += '</tr><tr>';
            html += '<td align="right"><span>数据库用户名：</span></td>';
            html += '<td colspan="3">' + info.extendInfo.MySQLUserName + '</td>';
            html += '</tr><tr>';
            html += '<td align="right"><span>数据空间大小：</span></td>';
            html += '<td>' + info.extendInfo.MySQLMaxSize + '</td>';
            html += '<td align="right"><span>已用空数据空间：</span></td>';
            html += '<td><span id="usedMysqlSize">' + info.extendInfo.MySQLDiskUse +
                '</span> M</td>';
            html += '</tr>';
            $('#mysqlInfo').html(html);
            $('#mysqlInfoArea').css('display', '');
        }

		$("#hostType").val(view.hostType);
		$("#instanceId").val(info.webName);
		$("#rerenewInstanceName").html(info.instanceName);
		$("#resizeInstanceName").html(info.instanceName);
		$("#widthInstanceName").html(info.instanceName);
		getOptItem();

		//获取密码
        $('.getPassBtn').on('click', function () {
            var type = $(this).attr('_type');
            getPwd(type);
        });

        //刷新验证码
        refreshVcode();

        //控制面板登录
        $('#controlPanelButton').on('click', function () {
            var service = {};
            service.productClass = configParam.productClass.vHost;
            service.instance = info.webName;
            service.pwd = info.managePass;
            var fn="controlPanelCreateToken";
            service = Commonjs.jsonToString(service);
            var params = Commonjs.getParams(fn,service);
            parent.Commonjs.ajaxTrue(weburl,params,function (data) {
                var url = Commonjs.getHostUrl() + Commonjs.getCfgVal(configParam.common.cfgKey.template) + configParam.controlPanel.name;
                window.open(url + "?auto=1&token=" + data.data);
            });
        });
	}
}

/**
 * Web站点升级.
 * @param info
 */
function upWebFunc(info) {
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

var vmVHostAdminInfo = new Vue({
    el: '#main-block',
    data: function(){
        return {
            /**
             * id.
             */
            id: 0,
            dialogFormVisible: false,
            form: {
                webLinks: 0,
                webWidth: 0,
                webFlow: 0,
                ftpDiskQuota: 0,
                mySQLSize: 0,
                MSSQLSize: 0,
                MSSQLLogSize: 0
            },
            info: {
                vhostType: '',
                sysProductView: {
                    webLinksMin: 0,
                    webLinksMax: 1,
                    webWidthMin: 0,
                    webWidthMax: 1,
                    webFlowMin: 0,
                    webFlowMax: 1,
                    ftpDiskQuotaMin: 0,
                    ftpDiskQuotaMax: 0,
                    mySQLSizeMin: 0,
                    mySQLSizeMax: 1,
                    MSSQLSizeMin: 0,
                    MSSQLSizeMax: 1,
                    MSSQLLogSizeMin: 0,
                    MSSQLLogSizeMax: 1
                }
            }
        };
    },
    methods: {
        /**
         * 修复.
         */
        checkRepair: function () {
            var self = this;
            this.$confirm('确定需要进行检测修复操作吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(function (){
                var service = {};
                service.id = self.id;
                var fn="vHostRepair";
                service = Commonjs.jsonToString(service)
                var params = Commonjs.getParams(fn,service);
                parent.Commonjs.ajaxTrue(weburl,params,function (data) {
                    self.$message.success("修复成功");
                });
            }).catch(function(){
            });
        },
        /**
         * 显示配置.
         */
        showConfig: function () {
            this.dialogFormVisible = true;
            //this.$refs['formConfig'].resetFields();
        },
        /**
         * 保存配置调整.
         */
        saveConfigEdit: function () {
            var self = this;
            var service = Object.assign({}, self.form);
            service.id = self.id;
            var fn="vHostConfigEdit";
            service = Commonjs.jsonToString(service)
            var params = Commonjs.getParams(fn,service);
            parent.Commonjs.ajaxTrue(weburl,params,function (data) {
                self.$message.success("调整成功");
                location.reload();
            });
        },
        /**
         * 重新设置最小参数.
         */
        resetFormValue: function () {
            var self = this;
            self.form.webLinks = self.info.extendInfo.WebLinks;
            self.form.webWidth = self.info.extendInfo.WebWidth;
            self.form.webFlow = self.info.extendInfo.WebFlow;
            self.form.ftpDiskQuota = self.info.extendInfo.FtpDiskQuota;
            self.form.mySQLSize = self.info.extendInfo.MySQLMaxSize;
            self.form.MSSQLSize = self.info.extendInfo.DbMaxSize;
            self.form.MSSQLLogSize = self.info.extendInfo.DbLogMaxSize;
        }
    },
    mounted: function () {

    }
});
