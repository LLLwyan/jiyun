$(function(){
    var endDateType = request("endDateType");
    if(endDateType != ""){
        $("#endDateType").val(endDateType);
    }

    $("body").click(function(e){
        if($(e.target).parents(".autosuo").length==0){
            $(".edit-ul").hide();
        }
    });

    queryUserServiceList();

    //批量删除
    $('.btnDel').on('click', function () {
        var webIds = "";
        $("input[name='chkBox']:checked").each(function(){
            var val = $(this).val();
            webIds += ('' === webIds ? '' : ',') + val;
        });
        if ('' == webIds) {
            topError(window, "请选择至少一个实例！");
            return;
        }

        parent.art.dialog({
            lock : true,
            opacity : 0.4,
            width : 250,
            title : '提示',
            content : '警告：批量删除后，业务将无法使用，且不能恢复，确定需要现在进行删除操作吗？',
            ok : function() {
                var service = {};
                service.webIds = webIds;
                var fn="adminINTVhostDelete";
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
    });

    //批量同步状态
    $('.btnSync').on('click', function () {
        var webIds = "";
        $("input[name='chkBox']:checked").each(function(){
            var val = $(this).val();
            webIds += ('' === webIds ? '' : ',') + val;
        });
        if ('' == webIds) {
            topError(window, "请选择至少一个实例！");
            return;
        }

        parent.art.dialog({
            lock : true,
            opacity : 0.4,
            width : 250,
            title : '提示',
            content : '警告：批量同步，将会消耗一定的时间和资源，确定需要现在进行同步操作吗？',
            ok : function() {
                var service = {};
                service.webIds = webIds;
                var fn="adminINTSyncVhost";
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
    });

    //批量停止
    $('.btnStop').on('click', function () {
        var webIds = "";
        $("input[name='chkBox']:checked").each(function(){
            var val = $(this).val();
            webIds += ('' === webIds ? '' : ',') + val;
        });
        if ('' == webIds) {
            topError(window, "请选择至少一个实例！");
            return;
        }

        parent.art.dialog({
            lock : true,
            opacity : 0.4,
            width : 250,
            title : '提示',
            content : '警告：批量停止后，所选实例的相关业务将不能正常使用，并将会消耗一定的时间和资源，确定需要现在进行暂停操作吗？',
            ok : function() {
                var service = {};
                service.webIds = webIds;
                var fn="adminINTPauseVhost";
                service = Commonjs.jsonToString(service);
                var params = Commonjs.getParams(fn,service);
                parent.Commonjs.ajaxTrue(weburl,params,function () {
                    topSuccess(window, '操作成功');
                    window.location.reload();
                });
            },
            cancel: function(){
                $('#dialog').hide();
            }
        });
    });

    //批量到期停用.
    $('.btnExpireStop').on('click', function () {
        var webIds = "";
        $("input[name='chkBox']:checked").each(function(){
            var val = $(this).val();
            webIds += ('' === webIds ? '' : ',') + val;
        });
        if ('' == webIds) {
            topError(window, "请选择至少一个实例！");
            return;
        }

        parent.art.dialog({
            lock : true,
            opacity : 0.4,
            width : 250,
            title : '提示',
            content : '警告：批量到期停止后，所选实例的相关业务将不能正常使用，并将会消耗一定的时间和资源，确定需要现在进行暂停操作吗？',
            ok : function() {
                var service = {};
                service.webIds = webIds;
                var fn="adminINTVhostExpireUsDisable";
                service = Commonjs.jsonToString(service);
                var params = Commonjs.getParams(fn,service);
                parent.Commonjs.ajaxTrue(weburl,params,function () {
                    topSuccess(window, '操作成功');
                    window.location.reload();
                });
            },
            cancel: function(){
                $('#dialog').hide();
            }
        });
    });

    //批量恢复
    $('.btnResume').on('click', function () {
        var webIds = "";
        $("input[name='chkBox']:checked").each(function(){
            var val = $(this).val();
            webIds += ('' === webIds ? '' : ',') + val;
        });
        if ('' == webIds) {
            topError(window, "请选择至少一个实例！");
            return;
        }

        parent.art.dialog({
            lock : true,
            opacity : 0.4,
            width : 250,
            title : '提示',
            content : '警告：批量恢复，将会消耗一定的时间和资源，确定需要现在进行暂停操作吗？',
            ok : function() {
                var service = {};
                service.webIds = webIds;
                var fn="adminINTVhostExpireUsResume";
                service = Commonjs.jsonToString(service);
                var params = Commonjs.getParams(fn,service);
                parent.Commonjs.ajaxTrue(weburl,params,function () {
                    topSuccess(window, '操作成功');
                    window.location.reload();
                });
            },
            cancel: function(){
                $('#dialog').hide();
            }
        });
    });

    //到期提醒
    $('.btnExpireAlert').on('click', function () {
        var webIds = "";
        $("input[name='chkBox']:checked").each(function(){
            var val = $(this).val();
            webIds += ('' === webIds ? '' : ',') + val;
        });
        if ('' == webIds) {
            topError(window, "请选择至少一个实例！");
            return;
        }

        var modalWin = wModal(window).add('expireAlert', $('#_expireAlert').html()).show();

        modalWin.find('.btn-primary').unbind('click').on('click', function () {
            var alertWay = '';
            if (modalWin.find('#expire_mail_checkbox').get(0).checked) {
                alertWay += (alertWay == '' ? '' : ',') + 'mail';
            }
            if (modalWin.find('#expire_sms_checkbox').get(0).checked) {
                alertWay += (alertWay == '' ? '' : ',') + 'sms';
            }

            if ('' == alertWay) {
                topError(window, "请选择至少一种通知方式！");
                return;
            }

            var service = {};
            service.webIds = webIds;
            service.alertWay = alertWay;
            var fn="adminINTVhostAlert";
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
});

function queryUserServiceList(){
    var index = $("#pagenumber").val();
    var endDateType=$("#endDateType").val();
    var service = {};
    service.userName=$('#userName').val();
    service.webName=$("#webName").val();
    service.serverType=$("#serverType").val();
    service.endDateType =  endDateType;
    service.page = index;
    service.pageSize = 10;
    var fn="adminINTQueryUserVhostList";
    service = Commonjs.jsonToString(service)
    var params = Commonjs.getParams(fn,service);//获取参数
    Commonjs.ajaxTrue(weburl,params,querySuccess);
}

var currentData = [];
function querySuccess(data){
    if(data.data==null)
        return false;

    var html='';
    if (data.data.length>0){
        currentData = data.data;
        BaseForeach(data.data,function(i,item){
            html+='<tr>';
            html+='<td><input value="'+item.id+'" type="checkbox" style="margin-top:5px;" name="chkBox" ></td>';
            html+='<td>'+item.webName+'</td>';
            html+='<td>'+item.productName+'</td>';
            html+='<td>'+item.userName+'</td>';
            html+='<td>' + getVhostTypeName(item.vhostType) + '</td>';
            html+='<td class="stn" id="status_'+i+'">'+getStatusColor(item.status,item.statusName)+'</td>';
            html+='<td>'+jsonDateTimeFormat(item.endTime)+'</td>';
            html += '<td>';
            html += '<a id="details_' + i + '" href="detail.html?iId=' + item.id + '" class="manager-btn mr-10" _funCode="queryVhostDetail">详情</a>';
            html += '<a data-id="' + i + '" class="cpLink manager-btn mr-10" _funCode="vHostControlPanel">控制面板</a>';
            html += '</td>';
            html+='</tr>';
        });

        $("#page").show();
        if(data.rows!=undefined){
            if(data.rows!=0){
                $("#totalcount").val(data.rows);
            }else{
                if(result.page==0)$("#totalcount").val(0);
            }
        }else{
            $("#totalcount").val(0);
        }
        Page($("#totalcount").val(),data.pagesize,'pager');
    }else{
        $("#page").hide();
        html+='<tr><td colspan="10" style="height:50px;text-align:center;line-height:50px;">找不到相关信息</td></tr>';
    }
    $("#userServiceList").html(html);

    //控制面板事件处理
    $('.cpLink').on('click', function () {
        var linNumber = $(this).attr('data-id');
        var data = currentData[linNumber];

        var service = {};
        service.productClass = configParam.productClass.vHost;
        service.instance = data.webName;
        service.pwd = data.managePass;
        var fn="controlPanelCreateToken";
        service = Commonjs.jsonToString(service);
        var params = Commonjs.getParams(fn,service);
        parent.Commonjs.ajaxTrue(weburl,params,function (data) {
            var url = Commonjs.getHostUrl() + Commonjs.getCfgVal(configParam.common.cfgKey.template) + configParam.controlPanel.name;
            window.open(url + "?auto=1&token=" + data.data);
        });
    });
}

/**
 * get vhost type.
 * @param vhostType
 * @returns {string}
 */
function getVhostTypeName(vhostType) {
    console.log(vhostType);
    var server = '';
    if (vhostType.indexOf('web') > -1) {
        server += ('' === server ? "" : ",") + 'Web';
    }
    if (vhostType.indexOf('ftp') > -1) {
        server += ('' === server ? "" : ",") + 'Ftp';
    }
    if (vhostType.indexOf('mysql') > -1) {
        server += ('' === server ? "" : ",") + 'MySQL';
    }
    if (vhostType.indexOf('mssql') > -1) {
        server += ('' === server ? "" : ",") + 'SQL Server';
    }
    return server;
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
            queryUserServiceList();
        }
    });
}

/**
 * 全(不)选
 * @param checkall
 */
function checkAllVhost(checkall){
    if(checkall.checked){
        $("input[name='chkBox']").prop("checked",true);
        $("input[name='checkBoxAll']").prop("checked",true);

    }else{
        $("input[name='chkBox']").prop("checked",false);
        $("input[name='checkBoxAll']").prop("checked",false);
    }
}
