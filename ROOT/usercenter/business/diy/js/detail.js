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
	var fn="queryUserVhost";
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
            html += '<td><span id="bindDomain">' + info.extendInfo.WebHostName + '</span>&nbsp;&nbsp;<a class="_status_item status_hide" href="javascript:void(0);" id="editDomainBtn">修改</a></td>';
            html += '</tr><tr>';
            html += '<td align="right"><span>默认文档：</span></td>';
            html += '<td>' + info.extendInfo.WebDefaultDoc + '&nbsp;&nbsp;<a class="_status_item status_hide" href="javascript:void(0);" id="editDefBtn">修改</a></td>';
            html += '<td align="right"><span>允许绑定域名数：</span></td>';
            html += '<td>' + info.sysProductView.productParam.webHostNum + '个</td>';
            html += '</tr><tr>';
            html += '<td align="right"><span>支持脚本：</span></td>';
            html += '<td>' + info.extendInfo.WebScriptType + '</td>';
            html += '<td align="right"><span>NET版本：</span></td>';
            html += '<td><span id="netVersion"></span> <a class="_status_item status_hide" href="javascript:void(0)" id="netVersionChg">切换</a></td>';
            html += '</tr><tr>';
            html += '<td align="right"><span>PHP版本：</span></td>';
            if (info.extendInfo.WebScriptPhp) {
                html += '<td><span id="phpVersion">' + info.extendInfo.WebScriptPhp + '</span> <a class="_status_item status_hide" href="javascript:void(0)" id="phpVersionChg">切换</a></td>';
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
            html += '</tr><tr class="_status_item status_hide">';
            html += '<td align="right"><span>更多操作：</span></td>';
            html += '<td id="webServerInfo" colspan="3">';
            html += '<span id="resetRight" style="cursor: pointer"><svg class="icon" aria-hidden="true"><use xlink:href="#icon-xinxi"></use></svg>重置网站权限</span>';
            html += '&nbsp;&nbsp;<span id="dirRight" style="cursor: pointer"><svg class="icon" aria-hidden="true"><use xlink:href="#icon-ts-lock"></use></svg>目录读写权限</span>';
            html += '&nbsp;&nbsp;<span id="icpClick" style="cursor: pointer"><svg class="icon" aria-hidden="true"><use xlink:href="#icon--dunpai"></use></svg>网站备案</span>';
            //html += '&nbsp;&nbsp;<span id="upWebBtn" style="cursor: pointer"><svg class="icon" aria-hidden="true"><use xlink:href="#icon-xiangshangjiantou"></use></svg>升级</span>';
            html += '</td>';
            html += '</tr>';
            $("#info").html(html);
            $('#webInfoArea').css('display', '');

            //默认首页修改事件
            $('#editDefBtn').on('click', function () {
                editWebSiteDefPage(info);
            });

            //域名绑定修改事件
            $('#editDomainBtn').on('click', function () {
                editWebSiteDomainBind(info);
            });

            //站点权限重置
            $('#resetRight').on('click', function () {
                resetWebSteRight(info);
            });

            //目录权限管理
            $('#dirRight').on('click', function () {
                resetWebSiteDirRight(info);
            });

            //网站备案
            $('#icpClick').on('click', function () {
                goToIcpSys();
            });

            //PHP版本切换
            $('#phpVersionChg').on('click', function () {
                chgWebSitePHP(info);
            });

            //.NET版本切换
            $('#netVersionChg').on('click', function () {
                chgWebSiteNET(info);
            });
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
            html += '<td align="right"><span>密码：</span></td>';
            html += '<td><a href="javascript:void(0);" class="getPassBtn _status_item status_hide" _type="ftp">获取</a></td>';
            html += '</tr><tr>';
            html += '<td align="right"><span>空间大小：</span></td>';
            html += '<td>' + info.extendInfo.FtpDiskQuota + 'M</td>';
            html += '<td align="right"><span>已用空间大小：</span></td>';
            html += '<td><span id="usedFtpSize"></span>M';
            html += '&nbsp;&nbsp;<span class="_status_item status_hide" id="reQueryFtp" style="cursor: pointer"><svg class="icon" aria-hidden="true"><use xlink:href="#icon-zidongshibie-copy"></use></svg>重新计算</span>';
            html += '</td>';
            html += '</tr>';
            html += '<tr class="_status_item status_hide">';
            html += '<td>更多操作</td>';
            html += '<td colspan="3">';
            html += '<span id="modFtpPass" style="cursor: pointer"><svg class="icon" aria-hidden="true"><use xlink:href="#icon-ts-lock"></use></svg>密码修改</span>';
            html += '&nbsp;&nbsp;<span id="ftpTarBtn" style="cursor: pointer"><svg class="icon" aria-hidden="true"><use xlink:href="#icon-yasuobao"></use></svg>文件压缩</span>';
            html += '&nbsp;&nbsp;<span id="ftpUnTarBtn" style="cursor: pointer"><svg class="icon" aria-hidden="true"><use xlink:href="#icon-shanchuyasuobao"></use></svg>文件解压</span>';
            html += '</td>';
            html += '</tr>';
            $('#ftpInfo').html(html);
            $('#ftpInfoArea').css('display', '');

            queryFtpState(info);
            queryFtpQuota(info);

            //重新计算.
            $('#reQueryFtp').on("click", function () {
                queryFtpQuota(info);
            });

            //Ftp密码修改
            $('#modFtpPass').on('click', function () {
                modFtpPassFunc(info);
            });

            //Ftp压缩
            $('#ftpTarBtn').on('click', function () {
                tarFtpFunc();
            });

            //Ftp解压
            $('#ftpUnTarBtn').on('click', function () {
                unTarFtpFun();
            });
		}

		if (info.vhostType.indexOf('mssql') > -1) {
            html = '';
            html += '<tr><td width="10%" align="right"><span>服务器IP：</span></td>';
            html += '<td width="40%">' + info.extendInfo.openMssqlIp + '</td>';
            html += '<td width="10%" align="right"><span>数据库名：</span></td>';
            html += '<td width="40%" id="ftpStateTd">' + info.extendInfo.DbName + '</td>';
            html += '</tr><tr>';
            html += '<td align="right"><span>数据库用户名：</span></td>';
            html += '<td>' + info.extendInfo.DbUserName + '</td>';
            html += '<td align="right"><span>密码：</span></td>';
            html += '<td><a href="javascript:void(0);" class="getPassBtn _status_item status_hide" _type="mssql">获取</a></td>';
            html += '</tr><tr>';
            html += '<td align="right"><span>数据空间大小：</span></td>';
            html += '<td>' + info.extendInfo.DbLogMaxSize + '</td>';
            html += '<td align="right"><span>已用空数据空间：</span></td>';
            html += '<td><span id="usedMssqlSize">' + info.extendInfo.DbSize +
                '</span> M &nbsp;&nbsp;<a href="javascript:void(0);" class="mssql-reload _status_item status_hide">重新计算</a></td>';
            html += '</tr><tr>';
            html += '<td align="right"><span>日志空间大小：</span></td>';
            html += '<td>' + info.extendInfo.DbMaxSize + '</td>';
            html += '<td align="right"><span>已用日志空间：</span></td>';
            html += '<td><span id="usedMssqlLogSize">' + info.extendInfo.DbLogSize +
                '</span> M &nbsp;&nbsp;<a href="javascript:void(0);" class="mssql-reload _status_item status_hide">重新计算</a></td>';
            html += '</tr><tr class="_status_item status_hide">';
            html += '<td align="right"><span>更多操作：</span></td>';
            html += '<td colspan="3">';
            html += '<span id="modMssqlPass" style="cursor: pointer"><svg class="icon" aria-hidden="true"><use xlink:href="#icon-ts-lock"></use></svg>密码修改</span>';
            html += '&nbsp;&nbsp;<span id="backMssql" style="cursor: pointer"><svg class="icon" aria-hidden="true"><use xlink:href="#icon-anquanguizeyong"></use></svg>备份</span>';
            html += '&nbsp;&nbsp;<span id="restoreMssql" style="cursor: pointer"><svg class="icon" aria-hidden="true"><use xlink:href="#icon-shuaxin-copy"></use></svg>还原</span>';
            html += '&nbsp;&nbsp;<span id="clearMssql" style="cursor: pointer"><svg class="icon" aria-hidden="true"><use xlink:href="#icon-qinglihuancun1"></use></svg>日志清理</span>';
            html += '</td>';
            html += '</tr>';
            $('#mssqlInfo').html(html);
            $('#mssqlInfoArea').css('display', '');

            //mysql信息同步
            $('.mssql-reload').on('click', function () {
                queryMssqlInfo();
            });

            //修改密码
            $('#modMssqlPass').on('click', function () {
                modMssqlPassFunc();
            });

            //备份数据库
            $('#backMssql').on('click', function () {
                backMssqlFunc(info);
            });

            //还原数据库
            $('#restoreMssql').on('click', function () {
                restoreMssqlFunc(info);
            });

            //清理日志
            $('#clearMssql').on('click', function () {
                clearMssqlFunc(info);
            });
		}

        if (info.vhostType.indexOf('mysql') > -1) {
            html = '';
            html += '<tr><td width="10%" align="right"><span>服务器IP：</span></td>';
            html += '<td width="40%">' + info.extendInfo.openMysqlIp + '</td>';
            html += '<td width="10%" align="right"><span>数据库名：</span></td>';
            html += '<td width="40%" id="ftpState">' + info.extendInfo.MySQLName + '</td>';
            html += '</tr><tr>';
            html += '<td align="right"><span>数据库用户名：</span></td>';
            html += '<td>' + info.extendInfo.MySQLUserName + '</td>';
            html += '<td align="right"><span>密码：</span></td>';
            html += '<td><a href="javascript:void(0);" class="getPassBtn _status_item status_hide" _type="mysql">获取</a></td>';
            html += '</tr><tr>';
            html += '<td align="right"><span>数据空间大小：</span></td>';
            html += '<td>' + info.extendInfo.MySQLMaxSize + '</td>';
            html += '<td align="right"><span>已用空数据空间：</span></td>';
            html += '<td><span id="usedMysqlSize">' + info.extendInfo.MySQLDiskUse +
                '</span> M&nbsp;&nbsp;<a href="javascript:void(0);" class="mysql-reload _status_item status_hide">重新计算</a></td>';
            html += '</tr><tr class="_status_item status_hide">';
            html += '<td align="right"><span>更多操作：</span></td>';
            html += '<td colspan="3">';
            html += '<span id="modMysqlPass" style="cursor: pointer"><svg class="icon" aria-hidden="true"><use xlink:href="#icon-ts-lock"></use></svg>密码修改</span>';
            html += '&nbsp;&nbsp;<span id="backMysql" style="cursor: pointer"><svg class="icon" aria-hidden="true"><use xlink:href="#icon-anquanguizeyong"></use></svg>备份</span>';
            html += '&nbsp;&nbsp;<span id="restoreMysql" style="cursor: pointer"><svg class="icon" aria-hidden="true"><use xlink:href="#icon-shuaxin-copy"></use></svg>还原</span>';
            html += '</td>';
            html += '</tr>';
            $('#mysqlInfo').html(html);
            $('#mysqlInfoArea').css('display', '');

            //mysql信息同步
            $('.mysql-reload').on('click', function () {
                queryMysqlInfo();
            });

            //密码修改
            $('#modMysqlPass').on('click', function () {
                modMysqlPassFunc(info);
            });

            //备份
            $('#backMysql').on('click', function () {
                backMysqlFunc(info);
            });

            //还原
            $('#restoreMysql').on('click', function () {
                restoreMysqlFun(info);
            });
        }

        //如果已过期，功能不能操作，未过期才开放
        if (info.status < 3) {
		    $('._status_item').removeClass('status_hide');
        }

		$("#hostType").val(view.hostType);
		$("#instanceId").val(info.webName);
		$("#rerenewInstanceName").html(info.instanceName);
		$("#resizeInstanceName").html(info.instanceName);
		$("#widthInstanceName").html(info.instanceName);
		getOptItem();
		getHostStatus(info, view.status,view.hostType,instanceId,view.serviceId);

		//获取密码
        $('.getPassBtn').on('click', function () {
            var type = $(this).attr('_type');
            getPwd(type);
        });

        //刷新验证码
        refreshVcode();
	}
}

/**
 * Web站点升级.
 * @param info
 */
function upWebFunc(info) {
}

/**
 * 默认首页设置.
 * @param info
 */
function editWebSiteDefPage(info) {
    var modalWin = wModal(window).add('webSiteDefPage', $('#_webSiteDefPage').html()).show();
    var defPages = info.extendInfo.WebDefaultDoc;
    var loadData = function () {
        var arrOld = defPages.split(",");
        var lineHtml = "";
        for(var i=0; i<arrOld.length; i++) {
            lineHtml += "<tr><td>" +(i+1)+"</td><td>"+arrOld[i]+"</td>";
            lineHtml += '<td><button type="button" class="btn-delete manager-btn" _id="' + i + '">删除</button></td></tr>';
        }
        modalWin.find('#defOldArea').html(lineHtml);

        modalWin.find('.btn-delete').unbind('click').on('click', function () {
            var number = parseInt($(this).attr('_id'));
            var arrOld = defPages.split(",");
            var newPages = "";
            if (arrOld.length < 2) {
                topError(window, '至少需要保留一个默认文档');
                return false;
            }
            for(var i=0; i<arrOld.length; i++) {
                if (number != i) {
                    newPages += ("" == newPages ? "" : ",") + arrOld[i];
                }
            }
            defPages = newPages;
            reset();
        });
        modalWin.find('.btn-primary').unbind('click').on('click', function () {
            var addPage = $.trim(modalWin.find('#addPage').val());
            if ('' != addPage) {
                var arrOld = defPages.split(",");
                for(var i=0; i<arrOld.length; i++) {
                    if (addPage == arrOld[i]) {
                        topError(window, '新增的默认文档重复');
                        return false;
                    }
                }
                defPages += "," + addPage;
            } else {
                topError(window, '请填写默认文档');
                return false;
            }
            reset(function () {
                modalWin.find('#addPage').val("");
            });
        });
    };
    loadData();
    var reset = function(func) {
        var service = {};
        service.id=instanceId;
        service.page = defPages;
        var fn="setWebSiteDefault";
        service = Commonjs.jsonToString(service)
        var params = Commonjs.getParams(fn,service);//获取参数
        parent.Commonjs.ajaxTrue(weburl,params,function (data) {
            topSuccess(window, '操作成功');
            loadData();
            if (func) {
                func();
			}
        },false);
	};

    modalWin.onHide(function () {
		location.reload();
    });
}

/**
 * 域名绑定.
 * @param info
 */
function editWebSiteDomainBind(info) {
    var modalWin = wModal(window).add('webSiteDomainBind', $('#_webSiteDomainBind').html()).show();
    modalWin.find('#domainServerIp').html(info.extendInfo.openWebIp);
    modalWin.find('#hostNumShow').html(info.sysProductView.productParam.webHostNum);

    /**
     * 获取备案状态.
     * @param item
     * @returns {string}
     */
    var getIcpName = function (item) {
        if (parseInt(item.isSys) === 1) {
            return '系统赠送域名';
        } else {
            if (parseInt(item.isIcp) === 1) {
                return '已备案';
            } else if(parseInt(item.isIcp) === 2){
                return '<span style="color: #ffd128">未验证</span>';
            } else {
                return '<span style="color: #FF0000">未备案</span>';
            }
        }
    };

    /**
     * 获取状态名称.
     * @param item
     * @returns {string}
     */
    var getStatusName = function (item) {
        if (parseInt(item.bindStatus) === 1) {
            return '<svg class="icon" aria-hidden="true"><use xlink:href="#icon-ok"></use></svg>';
        } else {
            return '<svg class="icon" aria-hidden="true"><use xlink:href="#icon-cancel"></use></svg>';
        }
    };

    /**
     * 加载绑定数据.
     */
    var loadData = function () {
        var service = {};
        service.id=instanceId;
        var fn="queryWebSiteDomains";
        service = Commonjs.jsonToString(service)
        var params = Commonjs.getParams(fn,service);//获取参数
        parent.Commonjs.ajaxTrue(weburl,params,function (data) {
            var domains = data.data;
            var domainString = "";
            var html = "";
            var existsDomain = [];
            $.each(domains, function (i, item) {
                domainString += ('' === domainString ? '' : ',') + item.domain;
                existsDomain.push(item.domain);
                html += '<tr><td>' + (i+1) + '</td><td>' + item.domain + '</td>';
                html += '<td>' + getIcpName(item) + '</td>';
                html += '<td>' + getStatusName(item) + '</td>';
                if (parseInt(item.isSys) === 1) {
                    html += '<td>&nbsp;</td>';
                } else {
                    html += '<td><button type="button" class="btn-delete manager-btn" _id="' + item.id + '">删除</button></td>';
                }
                html += '</tr>';
            });
            modalWin.find('#domainOldArea').html(html);
            if (parseInt(info.sysProductView.productParam.webHostNum) > domains.length) {
                modalWin.find('#domainAddArea').css('display', '');
            } else {
                modalWin.find('#domainAddArea').css('display', 'none');
            }
            modalWin.find('#addDomain').val('');

            //添加.
            modalWin.find('.btn-primary').unbind('click').on('click', function () {
                var addDomain = $.trim(modalWin.find('#addDomain').val());
                if ('' == addDomain) {
                    topError(window, '请填写域名');
                    return false;
                }
                var addDomainArr = addDomain.split("\n");
                var okDomainArr = [];
                var domainStringAdd = "";
                for (var m=0; m<addDomainArr.length; m++) {
                    var dom = addDomainArr[m];
                    if (''!==dom) {
                        if (CndnsValidate.checkDomain(dom)) {
                            if ($.inArray(dom, existsDomain) > -1 || $.inArray(dom, okDomainArr) > -1) {
                                topError(window, '域名' + dom + '重复');
                                return false;
                            } else {
                                okDomainArr.push(dom);
                                domainStringAdd += (domainStringAdd==='' ? '' : ',') + dom;
                            }
                        } else {
                            topError(window, dom + '不是正确的域名');
                            return false;
                        }
                    }
                }
                if ((okDomainArr.length + domains.length) > parseInt(info.sysProductView.productParam.webHostNum)) {
                    topError(window, '绑定域名个数超出了最大限制' + info.sysProductView.productParam.webHostNum);
                    return false;
                }

                if (okDomainArr.length<1) {
                    topError(window, '请填写域名');
                    return false;
                }

                addDomainFunc(domainStringAdd);
            });

            //删除
            modalWin.find('.btn-delete').unbind('click').on('click', function () {
                var id = parseInt($(this).attr('_id'));
                parent.art.dialog({
                    lock : true,
                    opacity : 0.4,
                    width : 250,
                    title : '提示',
                    content : '您确定需要删除该域名记录吗？',
                    ok : function() {
                        delDomainFunc(id);
                    },
                    cancel: function(){
                        $('#dialog').hide();
                    }
                });
            });
        },false);
    };
    loadData();

    //重新自动审核
    modalWin.find('#selfCheckIpc').unbind('click').on('click', function () {
        var service = {};
        service.id=instanceId;
        var fn="reCheckWebSiteDomains";
        service = Commonjs.jsonToString(service)
        var params = Commonjs.getParams(fn,service);
        parent.Commonjs.ajaxTrue(weburl,params,function (data) {
            topSuccess(window, '自助审核完成');
            loadData();
        });
    });

    /**
     * 添加域名
     * @param domain
     */
    var addDomainFunc = function (domain) {
        var service = {};
        service.id=instanceId;
        service.domain = domain;
        var fn="addWebSiteDomains";
        service = Commonjs.jsonToString(service)
        var params = Commonjs.getParams(fn,service);
        parent.Commonjs.ajaxTrue(weburl,params,function (data) {
            topSuccess(window, '添加成功');
            loadData();
        });
    };

    /**
     * 删除域名记录.
     * @param domainId
     */
    var delDomainFunc = function(domainId) {
        var service = {};
        service.id=instanceId;
        service.domainId = domainId;
        var fn="delWebSiteDomains";
        service = Commonjs.jsonToString(service)
        var params = Commonjs.getParams(fn,service);
        parent.Commonjs.ajaxTrue(weburl,params,function (data) {
            topSuccess(window, '删除成功');
            loadData();
        });
    };

    modalWin.onHide(function () {
        location.reload();
    });
}

/**
 * 重置网站权限.
 * @param info
 */
function resetWebSteRight(info) {
    var modalWin = wModal(window).add('webSiteRight', $('#_webSiteRight').html()).show();

    modalWin.find('.btn-primary').unbind('click').on('click', function () {
        var service = {};
        service.id=instanceId;
        var fn="resetWebSiteRight";
        service = Commonjs.jsonToString(service)
        var params = Commonjs.getParams(fn,service);
        parent.Commonjs.ajaxTrue(weburl,params,function () {
            topSuccess(window, '自助审核完成');
        });
    });

    modalWin.onHide(function () {
        location.reload();
    });
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
 * 进入备案系统.
 */
function goToIcpSys() {
    var service = {};
    service.id=instanceId;
    var fn="icplogin";
    service = Commonjs.jsonToString(service)
    var params = Commonjs.getParams(fn,service);
    parent.Commonjs.ajaxTrue(weburl,params,function (data) {
        parent.window.open(data.msg);
    });
}

/**
 * php版本切换.
 * @param info
 */
function chgWebSitePHP(info) {
    var modalWin = wModal(window).add('webSitePhp', $('#_webSitePhp').html()).show();

    //加载版本
    var service = {};
    service.paramId='phpversion';
    var fn="getListDicParamItem";
    service = Commonjs.jsonToString(service)
    var params = Commonjs.getParams(fn,service);
    parent.Commonjs.ajaxTrue(sysurl,params,function (data) {
        var optionHtml = '';
        $.each(data.data, function (index, item) {
            var selected = info.extendInfo.WebScriptPhp == item.value ? ' selected="selected" ' : '';
            optionHtml += '<option value="' + item.value + '"' + selected + '>' + item.description + '</option>';
        });
        modalWin.find('#webphp').html(optionHtml);
    });

    //绑定事件
    modalWin.find('.btn-primary').unbind('click').on('click', function () {
        var service = {};
        service.id = instanceId;
        service.webphp = modalWin.find('#webphp').val();
        var fn="resetWebSitePhp";
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
 * .net版本切换.
 * @param info
 */
function chgWebSiteNET(info) {
    var modalWin = wModal(window).add('webSiteNet', $('#_webSiteNet').html()).show();

    //加载版本
    var service = {};
    var fn="getWebSiteNet";
    service = Commonjs.jsonToString(service)
    var params = Commonjs.getParams(fn,service);
    parent.Commonjs.ajaxTrue(weburl,params,function (data) {
        var optionHtml = '';
        $.each(data.data, function (index, item) {
            var selected = info.extendInfo.WebAspNet == item.val ? ' selected="selected" ' : '';
            optionHtml += '<option value="' + item.val + '"' + selected + '>' + item.name + '</option>';
        });
        modalWin.find('#webnet').html(optionHtml);
    });

    //绑定事件
    modalWin.find('.btn-primary').unbind('click').on('click', function () {
        var service = {};
        service.id = instanceId;
        service.webnet = modalWin.find('#webnet').val();
        var fn="resetWebSiteNet";
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
        if (info.status < 3) {
            html += '&nbsp;&nbsp;<input type="button" class="manager-btn" value="停止" id="stopFtp" />';
        }
    } else {
        html = '<span style="color:#F90">关闭</span>';
        if (info.status < 3) {
            html += '&nbsp;&nbsp;<input type="button" class="manager-btn" value="开启" id="startFtp" />';
        }
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
	/*if(status=="Paused"){
		html+='<li><a href="javascript:void(0)" class="edit-a-disable">开机</a></li>';
		html+='<li><a href="javascript:void(0)" class="edit-a-disable">关机</a></li>';
		html+='<li><a href="javascript:void(0)" class="edit-a-disable">重启</a></li>';
		html+='<li><a href="javascript:void(0)" class="edit-a-disable">续费</a></li>';
		html+='<li><a href="javascript:void(0)" class="edit-a-disable">升级配置</a></li>';
		html+='<li><a href="javascript:void(0)" class="edit-a-disable">升级带宽</a></li>';
		html+='<li><a href="javascript:void(0)" class="edit-a-disable">重装系统</a></li>';
        if (hostType == configParam.cloudType.openStack) {
            html += '<li><a href="javascript:void(0)" class="edit-a-disable">添加云盘</a></li>';
        }
	}
	else if(status=="Running"){
		html+='<li><a href="javascript:void(0)" class="edit-a-disable">开机</a></li>';
		html+='<li><a href="javascript:void(0)" data-name="shutdown" onclick="optAction(this,\'关机\')">关机</a></li>';
		html+='<li><a href="javascript:void(0)" data-name="restart" onclick="optAction(this,\'重启\')">重启</a></li>';
	}else if(status=="Stopped"){
		html+='<li><a href="javascript:void(0)" data-name="start" onclick="optAction(this,\'开机\')">开机</a></li>';
		html+='<li><a href="javascript:void(0)" class="edit-a-disable">关机</a></li>';
		html+='<li><a href="javascript:void(0)" class="edit-a-disable">重启</a></li>';
	}
	if(status=="Running" || status=="Stopped"){
		html+='<li><a href="../cloud/renew.html?iId='+instanceId+'">续费</a></li>';
		html+='<li><a href="../cloud/resizeconfig.html?iId='+instanceId+'">升级配置</a></li>';
		html+='<li><a href="../cloud/resizenetwork.html?iId='+instanceId+'">升级带宽</a></li>';
		html+='<li><a href="../cloud/resetsystem.html?iId='+instanceId+'">重装系统</a></li>';
        if (hostType == configParam.cloudType.openStack) {
            html += '<li><a href="../cloud/addclouddisk.html?iId=' + instanceId + '">添加云盘</a></li>';
        }
	}
	if(status=="Expire"){
		html+='<li><a href="../cloud/renew.html?iId='+instanceId+'">续费</a></li>';
	}*/
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
function getHostStatus(info, status,hostType,instanceId,serviceId){
	var service = {};
    service.id=instanceId;
	var fn="queryTimeWebInfo";
	service = Commonjs.jsonToString(service)
	var params = Commonjs.getParams(fn,service);//获取参数
	$.ajax({
		datatype:"json",
        type:"POST",
        url: weburl,
        data:params,
		cache : false,
		success: function(data){
			var result=jQuery.parseJSON(data);
			console.log(result);
			bindStatusWebsite(info, result);
		}
	});
}

/**
 * Web站点状态.
 * @param result
 */
function bindStatusWebsite(info, result) {
    var html = '';
    if(0===parseInt(result.data.WebState)) {
        html = '<span style="color:#090">正常</span>';
        if (info.status < 3) {
            html += '&nbsp;&nbsp;<input type="button" class="manager-btn" value="停止" id="stopWebSite" />';
        }
    } else {
        html = '<span style="color:#F90">关闭</span>';
        if (info.status < 3) {
            html += '&nbsp;&nbsp;<input type="button" class="manager-btn" value="开启" id="startWebSite" />';
        }
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
