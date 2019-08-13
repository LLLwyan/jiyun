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
});

function queryUserServiceList(){
    var index = $("#pagenumber").val();
    var endDateType=$("#endDateType").val();
    var service = {};
    service.webName=$("#webName").val();
    service.serverType=$("#serverType").val();
    service.endDateType =  endDateType;
    service.page = index;
    service.pageSize = 10;
    var fn="queryUserVhostList";
    service = Commonjs.jsonToString(service)
    var params = Commonjs.getParams(fn,service);//获取参数
    Commonjs.ajaxTrue(weburl,params,querySuccess);
}

function querySuccess(data){
    if(data.data==null)
        return false;

    var html='';
    if (data.data.length>0){
        vmUserVHostList.rows = data.data;
        BaseForeach(data.data,function(i,item){
            html+='<tr>';
            html+='<td>'+item.webName+'</td>';
            html+='<td>'+item.productName+'</td>';
            html+='<td>' + getVhostTypeName(item.vhostType) + '</td>';
            html+='<td class="stn" id="status_'+i+'">'+getStatusColor(item.status,item.statusName)+'</td>';
            html+='<td>'+jsonDateTimeFormat(item.startTime)+'</td>';
            html+='<td>'+jsonDateTimeFormat(item.endTime)+'</td>';
            html+='<td><a id="details_'+i+'" href="detail.html?iId='+item.id+'" class="manager-btn mr-10">详情</a>';
            html+='<a onclick="vmUserVHostList.transfer(' + i + ')" class="manager-btn mr-10">过户</a>';
            //html+='<div class="btn-group autosuo"><a id="opt_'+i+'" href="javascript:void(0)" class="manager-btn editsnap disable">更多操作&nbsp;<span class="btn-caret"></span></a>';
            //html+='<ul class="edit-ul" flag="0" id="optbtn_'+i+'">';
            //html+=getOptItem(item.status,item.instanceId,item.hostType);
            //html+='</ul></div>';
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

function getHostStatus(index,status,hostType,instanceId,serviceId){
    $("#img_"+index).hide();
}

function getOptItem(status,instanceId,hostType){
    var html='';
    if(status=="Paused"){
        html+='<li><a href="javascript:void(0)" class="edit-a-disable">开机</a></li>';
        html+='<li><a href="javascript:void(0)" class="edit-a-disable">关机</a></li>';
        html+='<li><a href="javascript:void(0)" class="edit-a-disable">重启</a></li>';
        html+='<li><a href="javascript:void(0)" class="edit-a-disable">续费</a></li>';
        html+='<li><a href="javascript:void(0)" class="edit-a-disable">升级配置</a></li>';
        html+='<li><a href="javascript:void(0)" class="edit-a-disable">升级带宽</a></li>';
        html+='<li><a href="javascript:void(0)" class="edit-a-disable">重装系统</a></li>';
        if (hostType == configParam.cloudType.openStack) {
            html+='<li><a href="javascript:void(0)" class="edit-a-disable">添加云盘</a></li>';
        }
        //html+='<li><a href="javascript:void(0)" class="edit-a-disable">远程连接</a></li>';
    }else if(status=="Running"){
        html+='<li><a href="javascript:void(0)" class="edit-a-disable">开机</a></li>';
        html+='<li><a href="javascript:void(0)" data-name="shutdown" iId="'+instanceId+'" hostType="'+hostType+'" onclick="optAction(this,\'关机\')">关机</a></li>';
        html+='<li><a href="javascript:void(0)" data-name="restart" iId="'+instanceId+'" hostType="'+hostType+'" onclick="optAction(this,\'重启\')">重启</a></li>';
        //html+='<li><a href="javascript:void(0)" onclick="getVNCConsole(\''+instanceId+'\')">远程连接</a></li>';
    }else if(status=="Stopped"){
        html+='<li><a href="javascript:void(0)" data-name="start" iId="'+instanceId+'" hostType="'+hostType+'" onclick="optAction(this,\'开机\')">开机</a></li>';
        html+='<li><a href="javascript:void(0)" class="edit-a-disable">关机</a></li>';
        html+='<li><a href="javascript:void(0)" class="edit-a-disable">重启</a></li>';
    }
    if(status=="Running" || status=="Stopped"){
        html+='<li><a href="../cloud/renew.html?iId='+instanceId+'">续费</a></li>';
        html+='<li><a href="javascript:void(0)" onclick="upgradeConfigure(\''+status+'\',\''+instanceId+'\')">升级配置</a></li>';
        html+='<li><a href="javascript:void(0)" onclick="upgradeBandwidth(\''+status+'\',\''+instanceId+'\')">升级带宽</a></li>';
        html+='<li><a href="../cloud/resetsystem.html?iId='+instanceId+'">重装系统</a></li>';
        if (hostType == configParam.cloudType.openStack) {
            html += '<li><a href="../cloud/addclouddisk.html?iId=' + instanceId + '">添加云盘</a></li>';
        }
    }
    if(status=="Error"){
        html+='<li><a href="javascript:void(0)" data-name="shutdown" iId="'+instanceId+'" hostType="'+hostType+'" onclick="optAction(this,\'关机\')">关机</a></li>';
    }
    if(status=="Expire"){
        html+='<li><a href="../cloud/renew.html?iId='+instanceId+'">续费</a></li>';
    }
    return html;
}

function optAction(obj,text){
    var dialog=	art.dialog({
        lock : true,
        opacity : 0.4,
        width : 250,
        title : '提示',
        content : '您确定'+text+'吗？',
        ok : function() {
            var name=$(obj).attr("data-name");
            var instanceId=$(obj).attr("iId");
            if(name=="start")
                serverAction("startInstance",instanceId);
            if(name=="restart")
                serverAction("rebootInstance",instanceId);
            if(name=="shutdown")
                serverAction("stopInstance",instanceId);
        },
        cancel: function(){
            $('#dialog').hide();
        }
    });
}

function serverAction(method,instanceId){
    var service = {};
    service.instanceId = instanceId;
    var fn=method;
    service = Commonjs.jsonToString(service);
    var params = Commonjs.getParams(fn,service);//获取参数
    $.ajax({
        datatype:"json",
        type:"POST",
        url: weburl,
        data:params,
        cache : false,
        success: function(data){}
    });
    queryUserServiceList();
}

//升级配置
function upgradeConfigure(status,instanceId){
    if(status!="Stopped"){
        Commonjs.alert("升级前请先关闭云主机");
    }else{
        window.location.href="../cloud/resizeconfig.html?iId="+instanceId;
    }
}

//升级带宽
function upgradeBandwidth(status,instanceId){
    if(status!="Stopped"){
        Commonjs.alert("升级前请先关闭云主机");
    }else{
        window.location.href="../cloud/resizenetwork.html?iId="+instanceId;
    }
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

/*修改云主机密码*/
var instanceIds="";
function resetPassword(){
    var contents=$('#detaliBoxa').get(0);
    $("input[name='chkBox']:checked").each(function(){
        instanceIds += $(this).attr("value")+',';
    });
    if(!instanceIds){
        $.tooltip("请先勾选要操作的服务器",1000,true);
        return;
    }
    var str = instanceIds.substring(0,instanceIds.length-1);
    $("#uptPwdForm")[0].reset();
    refreshVcode();
    var artBox=art.dialog({
        lock: true,
        artIcon:'add',
        opacity:0.4,
        width: 500,
        padding:'0px 0px',
        title:'重置密码',
        header:false,
        content: contents,
        ok: function (){
            var password=$("#password");
            var confirmPassword=$("#confirmPassword");
            var checkcode=$("#checkcode");
            var preg = /(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,30}/;
            if(Commonjs.isEmpty(password.val())){
                $.tooltip('登入密码不能为空',2000,false);
                return false;
            }
            if(Commonjs.isEmpty(confirmPassword.val())){
                $.tooltip('确认密码不能为空',2000,false);
                return false;
            }
            if(password.val() != confirmPassword.val()){
                $.tooltip('密码不一致',2000,false);
                return false;
            }
            if(!preg.test(password.val())){
                $.tooltip('密码复杂度不够',2000,false);
                return false;
            }
            var service = {};
            var fn="uptPassWordUserService";
            service.password = encodeURIComponent(password.val());
            service.confirmPassword = encodeURIComponent(confirmPassword.val());
            service.checkcode = checkcode.val();
            service.instanceIds = instanceIds;
            service = Commonjs.jsonToString(service);
            var params = Commonjs.getParams(fn,service);
            Commonjs.ajaxTrue(weburl,params,resetPwdSuccess,true,"正在重置中...");
        },
        cancel: function(){}
    });
}

function resetPwdSuccess(data){
    if(data.data==null)
        return;

    $("input[name='checkBoxAll']").prop("checked",false);
    if(data.data=="")
        Commonjs.alert("重置密码成功，请稍等1-2分钟再尝试登录。");
    else
        Commonjs.alert("重置密码失败的实例名称："+data.data);
    queryUserServiceList();
}

function getServiceInfo(serviceId){
    var service = {};
    var info;
    service.instanceId=serviceId;
    var fn="queryUserService";
    service = Commonjs.jsonToString(service)
    var params = Commonjs.getParams(fn,service);//获取参数
    $.ajax({
        datatype:"json",
        type:"POST",
        url: weburl,
        data:params,
        async: false,
        timeout : 8000,
        cache : false,
        success: function(obj){
            result =jQuery.parseJSON(obj);
            info=result.data.info;
        }
    });
    if(info){
        return info;
    }else{
        return null;
    }
}

//获取VNC控制台
function getVNCConsole(instanceId){
    var service = {};
    service.instanceId=instanceId;
    var fn="getVNCConsole";
    service = Commonjs.jsonToString(service)
    var params = Commonjs.getParams(fn,service);//获取参数
    Commonjs.ajaxTrue(weburl,params,getVNCSuccess,true,"正在连接...");
}

function getVNCSuccess(data){
    if(data.data==null)
        return false;

    var result=data.data;
    if(result.code=="0")
        window.open(realPath+"/vnc/vnc_auto.html?token="+result.token);
    else if(result.code=="-1"){
        Commonjs.alert(result.message);
    }
}

function checkAllServer(checkall){
    if(checkall.checked){
        $("input[name='chkBox']").prop("checked",true);
        $("input[name='checkBoxAll']").prop("checked",true);

    }else{
        $("input[name='chkBox']").prop("checked",false);
        $("input[name='checkBoxAll']").prop("checked",false);
    }
}


var vmUserVHostList = new Vue({
    el: '#MainContentDIV',
    data: function(){
        return {
            rows: [],
            currentRow: {},
            data: {
                toUserName: '',
                createTime: 0,
                safeCode: ''
            },
            isNew: true,
            showSafeCodeFlag: false,
            dialogFormVisible: false,
            form: {
                toUserName: ''
            },
            rules: {
                toUserName: [
                    { required: true, message: '请输入对方的用户账号', trigger: 'blur' },
                ]
            }
        };
    },
    methods: {
        /**
         * 过户触发.
         * @param i
         */
        transfer: function (i) {
            this.currentRow = this.rows[i];
            this.showTransfer();
        },

        /**
         * 显示过户信息框.
         */
        showTransfer: function() {
            var self = this;
            var row = self.currentRow;
            var service = {
                productType: configParam.productClass.vHost,
                hostType: configParam.common.vHost.register.winiis,
                bizName: row.webName
            };
            var fn="bizTransferDealingInfo";
            service = Commonjs.jsonToString(service)
            var params = Commonjs.getParams(fn,service);
            Commonjs.ajaxTrue(weburl,params, function (data) {
                self.isNew = true;
                self.data.safeCode = '';
                self.data.toUserName = '';
                self.data.createTime = 0;
                if (data.data.length > 0) {
                    self.data = Object.assign({}, data.data[0]);
                    self.isNew = false;
                }
                self.showSafeCodeFlag = false;
                self.form.toUserName = '';
                self.dialogFormVisible = true;
            });
        },

        /**
         * 发起交易.
         */
        makeDeal: function () {
            var self = this;
            this.$refs['pushForm'].validate(function(valid){
                if (valid) {
                    var service = {
                        productType: configParam.productClass.vHost,
                        hostType: configParam.common.vHost.register.winiis,
                        bizName: self.currentRow.webName,
                        toUserName: self.form.toUserName
                    };
                    var fn="bizTransferMakeDeal";
                    service = Commonjs.jsonToString(service)
                    var params = Commonjs.getParams(fn,service);
                    Commonjs.ajaxSilence(weburl,params,true,function (data) {
                        self.$message.success("发起交易成功");
                        self.showTransfer();
                    }, function (data) {
                        self.$message.error(data.msg);
                    });
                }
            });
        },

        /**
         * 取消交易.
         */
        cancelDeal: function () {
            var self = this;
            this.$confirm('确定需要取消当前业务的转让交易吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(function (){
                var service = {};
                service.id = self.data.id;
                var fn="bizTransferCancelDeal";
                service = Commonjs.jsonToString(service)
                var params = Commonjs.getParams(fn,service);
                parent.Commonjs.ajaxSilence(weburl,params,true,function (data) {
                    self.$message.success("取消成功");
                    self.dialogFormVisible = false;
                }, function (data) {
                    self.$message.error(data.msg);
                });
            }).catch(function(){
            });
        },

        /**
         * 显示安全码.
         */
        showSafeCode: function () {
            var self = this;
            self.data.safeCode = cloudEncrypt.decodeSession(self.data.safeCode);
            self.showSafeCodeFlag = true;
        },

        /**
         * 时间格式化.
         */
        formatTime: function (time) {
            return jsonDateTimeFormat({time: time})
        }
    },
    mounted: function () {

    }
});
