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

    loadSubClass();
    queryUserServiceList();

    //批量删除
    $('.btnDel').on('click', function () {
        var webIds = "";
        $("input[name='chkBox']:checked").each(function(){
            var val = $(this).val();
            webIds += ('' === webIds ? '' : ',') + val;
        });
        if ('' == webIds) {
            topError(window, "请选择至少一个业务！");
            return;
        }

        parent.art.dialog({
            lock : true,
            opacity : 0.4,
            width : 250,
            title : '提示',
            content : '警告：批量删除后，业务数据将不能恢复，确定需要现在进行删除操作吗？',
            ok : function() {
                var service = {};
                service.ids = webIds;
                var fn="deleteDiy";
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
            topError(window, "请选择至少一个业务！");
            return;
        }

        parent.art.dialog({
            lock : true,
            opacity : 0.4,
            width : 250,
            title : '提示',
            content : '警告：确认需要将所选业务设为这止吗？',
            ok : function() {
                var service = {};
                service.ids = webIds;
                var fn="pausedDiy";
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
            topError(window, "请选择至少一个业务！");
            return;
        }

        parent.art.dialog({
            lock : true,
            opacity : 0.4,
            width : 250,
            title : '提示',
            content : '警告：确定需要对先中的业务进行到期暂停操作吗？',
            ok : function() {
                var service = {};
                service.ids = webIds;
                var fn="diyExpireUsDisable";
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
            topError(window, "请选择至少一个业务！");
            return;
        }

        parent.art.dialog({
            lock : true,
            opacity : 0.4,
            width : 250,
            title : '提示',
            content : '警告：确定需要现在恢复选中的业务吗？',
            ok : function() {
                var service = {};
                service.ids = webIds;
                var fn="diyResume";
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
            topError(window, "请选择至少一个业务！");
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
            service.ids = webIds;
            service.alertWay = alertWay;
            var fn="diyExpireUsRemind";
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

    //开通配置
    $(document.body).bind('DOMNodeInserted', function () {
        $('*[_funCode="diyConfig"]').unbind('click').on('click', function () {
            var index = parseInt($(this).attr('data-id'));
            var modalWin = wModal(window).add('configAlert', $('#_configAlert').html()).show();

            modalWin.find('#configInfo').val(listData[index].instanceInfo);

            modalWin.find('.btn-primary').unbind('click').on('click', function () {
                var configInfo = modalWin.find('#configInfo').val();
                saveConfig(configInfo);
            });

            modalWin.onHide(function () {
                location.reload();
            });

            var saveConfig = function (configInfo) {
                console.log(configInfo);
                var service = {};
                service.id = listData[index].id;
                service.configInfo = configInfo;
                var fn = "diyConfig";
                service = JSON.stringify(service);
                var params = Commonjs.getParams(fn, service);
                parent.Commonjs.ajaxTrue(weburl, params, function () {
                    topSuccess(window, '操作成功');
                    modalWin.hide();
                });
            };
        });
    });
});

function loadSubClass() {
    var service = {};
    var fn="usableDiyProCat";
    service = Commonjs.jsonToString(service)
    var params = Commonjs.getParams(fn,service);//获取参数
    Commonjs.ajaxTrue(weburl,params,function (data) {
        if (data.result=='success' && data.data) {
            var html = '<option value="">全部</option>';
            for (var i=0; i<data.data.length; i++) {
                var item = data.data[i];
                html += '<option value="' + item.categoryCode + '">' + item.categoryName + '</option>';
            }
            $('#subClass').html(html);
        }
    });
}

function queryUserServiceList(){
    var index = $("#pagenumber").val();
    var endDateType=$("#endDateType").val();
    var service = {};
    service.subClass=$('#subClass').val();
    service.keyword=$("#keyword").val();
    service.endDateType =  endDateType;
    service.page = index;
    service.pageSize = 10;
    var fn="queryDiy";
    service = Commonjs.jsonToString(service)
    var params = Commonjs.getParams(fn,service);//获取参数
    Commonjs.ajaxTrue(weburl,params,querySuccess);
}

var listData = [];
function querySuccess(data){
    if(data.data==null)
        return false;

    var html='';
    if (data.data.length>0){
        listData = data.data;
        BaseForeach(data.data,function(i,item){
            html+='<tr>';
            html+='<td><input value="'+item.id+'" type="checkbox" style="margin-top:5px;" name="chkBox" ></td>';
            html+='<td>'+item.productName+'</td>';
            html+='<td>'+item.subClassName+'</td>';
            html+='<td>'+item.userName+'</td>';
            html+='<td>' + (item.openInfo.order_describe ? item.openInfo.order_describe.replace(/\n/g, '<br />') : item.openInfo.productDetail.replace(/\n/g, '<br />')) + '</td>';
            html+='<td>'+item.statusName+'</td>';
            html+='<td>'+item.instanceInfo.replace(/\n/g, '<br />')+'</td>';
            html+='<td>'+jsonDateTimeFormat(item.endTime)+'</td>';
            html+='<td><a id="details_'+i+'" href="detail.html?iId='+item.id+'" _funCode="getDiy" class="manager-btn mr-10">详情</a>';
            html += '&nbsp;&nbsp;<a data-id="' + i + '" href="javascript:void(0)" _funCode="diyConfig" class="manager-btn mr-10">开通配置</a>';
            html+='</td></tr>';
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
