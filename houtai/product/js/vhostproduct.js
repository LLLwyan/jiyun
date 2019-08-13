var productCode;
var levelList;
var dbTypeList;

var webPriceColumns = [
    {key : 'WebLinksBase', name : '最小链接数价格'},
    {key : 'WebLinksUnit', name : '单元链接数售价'},
    {key : 'WebWidthBase', name : '最小带宽价格'},
    {key : 'WebWidthUnit', name : '单元带宽售价'},
    {key : 'WebFlowBase', name : '	最小流量价格'},
    {key : 'WebFlowUnit', name : '单元流量售价'},
    {key : 'WebFtpDiskQuotaBase', name : '最小空间价格'},
    {key : 'WebFtpDiskQuotaUnit', name : '单元空间售价'}
];
var ftpPriceColumns = [
    {key : 'FtpDiskQuotaBase', name : '最小空间价格'},
    {key : 'FtpDiskQuotaUnit', name : '单元空间售价'}
];
var mysqlPriceColumns = [
    {key : 'MySQLSizeBase', name : '最小空间价格'},
    {key : 'MySQLSizeUnit', name : '单元空间售价'}
];
var mssqlPriceColumns = [
    {key : 'MSSQLSizeBase', name : '最小空间价格'},
    {key : 'MSSQLSizeUnit', name : '单元空间售价'},
    {key : 'MSSQLLogSizeBase', name : '最小空间价格'},
    {key : 'MSSQLLogSizeUnit', name : '单元空间售价'}
];

$(function(){
    productCode = request("productCode");
    getServiceType();
    getServerList();
    selectChangeWebOs();
    getScriptType();
    getControlSoft();
    queryDicVipgrade();
    getVhostProduct();
});

/**
 * 获取支持的服务类型列表.
 */
function getServiceType() {
    var service = {};
    service.paramEName = "serviceType";
    var fn="getListParamItemByEName";
    service = Commonjs.jsonToString(service);
    var params = Commonjs.getParams(fn,service);//获取参数
    var data=Commonjs.ajax(sysurl,params,false);
    if(data.result == "success"){
        var html='';
        if (data.data.length>0){
            dbTypeList = data.data;
            BaseForeach(data.data,function(i,item){
                html += (html=='' ? '' : '&nbsp;&nbsp;&nbsp;&nbsp;') + '<input type="checkbox" name="serviceType" value="' +
                    item.value + '" title="' + item.description + '" id="' + item.value + 'Checkbox" ' +
                    'onclick="configParam(this)"> ' + item.description;
            });
        }
        $('#serviceTypeList').html(html);
    }
}

/**
 * 获取脚本支持.
 */
function getScriptType() {
    var service = {};
    service.paramEName = "scriptType";
    var fn="getListParamItemByEName";
    service = Commonjs.jsonToString(service);
    var params = Commonjs.getParams(fn,service);//获取参数
    var data=Commonjs.ajax(sysurl,params,false);
    if(data.result == "success"){
        var html='';
        if (data.data.length>0){
            html += '<input type="checkbox" id="scriptTypeAll" onclick="selectChangeScriptType()"> 全选'
            dbTypeList = data.data;
            BaseForeach(data.data,function(i,item){
                html += (html=='' ? '' : '&nbsp;&nbsp;&nbsp;&nbsp;') + '<input type="checkbox" name="WebScriptType" value="' +
                    item.value + '" title="' + item.description + '" onclick="resetScriptChecked()"> ' + item.description;
            });
        }
        $('#scriptTypeArea').html(html);
    }
}

function getControlSoft() {
    var service = {};
    service.paramEName = "controlSoft";
    var fn="getListParamItemByEName";
    service = Commonjs.jsonToString(service);
    var params = Commonjs.getParams(fn,service);//获取参数
    var data=Commonjs.ajax(sysurl,params,false);
    if(data.result == "success"){
        var html='';
        if (data.data.length>0){
            html += '<input type="checkbox" id="WebSoftAll" onclick="selectChangeControlSoft()"> 全选'
            dbTypeList = data.data;
            BaseForeach(data.data,function(i,item){
                html += (html=='' ? '' : '&nbsp;&nbsp;&nbsp;&nbsp;') + '<input type="checkbox" name="WebSoft" value="' +
                    item.value + '" title="' + item.description + '" onclick="resetControlSoftChecked()"> ' + item.description;
            });
        }
        $('#controlSoftArea').html(html);
    }
}

/**
 * 配置参数显示.
 * @param obj
 */
function configParam(obj) {
    if ('web' == obj.value) {
        if (obj.checked) {
            $('#ftpCheckbox').get(0).checked = true;
            $('#ftpConfig').css('display', '');
            $('#ftpPrice').css('display', 'none');
        } else {
            $('#ftpPrice').css('display', '');
        }
    }
    if ('ftp' == obj.value) {
        if (!obj.checked && $('#webCheckbox').get(0).checked) {
            $('#ftpCheckbox').get(0).checked = true;
            return true;
        } else {
            $('#ftpPrice').css('display', '');
        }
    }
    $('#' + obj.value + 'Config').css('display', obj.checked ? '' : 'none');
    $('#' + obj.value + 'Price').css('display', obj.checked ? '' : 'none');
    $('#ftpServerListArea').css('display', $('#webCheckbox').get(0).checked ? 'none' : '');

}

function selectChangeWebOs() {
    $('#WebCPURow').css('display', 'windows' == $('#WebOs').val() ? '' : 'none');
}

function selectChangeScriptType() {
    $('input[name="WebScriptType"]').each(function () {
        this.checked = $('#scriptTypeAll').get(0).checked
    });
}

function selectChangeControlSoft() {
    $('input[name="WebSoft"]').each(function () {
        this.checked = $('#WebSoftAll').get(0).checked;
    });
}

function resetScriptChecked() {
    var allChecked = true;
    $("input[name=WebScriptType]").each(function(){
        if (!this.checked) {
            allChecked = false;
        }
    });
    $('#scriptTypeAll').get(0).checked = allChecked;
}

function resetControlSoftChecked() {
    var allChecked = true;
    $("input[name=WebSoft]").each(function(){
        if (!this.checked) {
            allChecked = false;
        }
    });
    $('#WebSoftAll').get(0).checked=allChecked;
}

function getServerList() {
    var service = {};
    service.hostType='vhost';
    service.page = 1;
    service.pagesize = 1000;
    var fn="queryService";
    service = Commonjs.jsonToString(service)
    var params = Commonjs.getParams(fn,service);//获取参数
    var data = Commonjs.ajax(weburl,params,false);

    if(data.result == "success"){
        var htmlWeb = '',
            htmlFtp = '',
            htmlMySQL = '',
            htmlSQLServer = '';
        if (data.data.length>0){
            BaseForeach(data.data,function(i,item){
                //html+='<option value="'+item.value+'">'+item.description+'</option>';
                var name = item.hostName + ' (' + item.extranetIP + ')';
                htmlWeb += (htmlWeb=='' ? '' : '&nbsp;&nbsp;&nbsp;&nbsp;') + '<input type="checkbox" ' +
                    'name="serverWeb" value="' + item.hostId + '" title="' + name + '"> ' + name;

                htmlFtp += (htmlFtp=='' ? '' : '&nbsp;&nbsp;&nbsp;&nbsp;') + '<input type="checkbox" ' +
                    'name="serverFtp" value="' + item.hostId + '" title="' + name + '"> ' + name;

                htmlMySQL += (htmlMySQL=='' ? '' : '&nbsp;&nbsp;&nbsp;&nbsp;') + '<input type="checkbox" ' +
                    'name="serverMySQL" value="' + item.hostId + '" title="' + name + '"> ' + name;

                htmlSQLServer += (htmlSQLServer=='' ? '' : '&nbsp;&nbsp;&nbsp;&nbsp;') + '<input type="checkbox" ' +
                    'name="serverSQLServer" value="' + item.hostId + '" title="' + name + '"> ' + name;
            });
        }

        $('#webServerListArea').html(htmlWeb);

        $('#ftpServerListArea').html(htmlFtp);

        $('#mysqlServerListArea').html(htmlMySQL);

        $('#mssqlServerListArea').html(htmlSQLServer);
    }
}

//获取域名上级注册商
function queryHostType(){
    var service = {};
    service.paramEName = "regType";
    var fn="getListParamItemByEName";
    service = Commonjs.jsonToString(service);
    var params = Commonjs.getParams(fn,service);//获取参数
    var data=Commonjs.ajax(sysurl,params,false);
    if(data.result == "success"){
        var html='';
        if (data.data.length>0){
            BaseForeach(data.data,function(i,item){
                html+='<option value="'+item.value+'">'+item.description+'</option>';
            });
        }
        $('#regtype').html(html);
        $('#queryInterface').html(html);
    }
}

//获取会员等级
function queryDicVipgrade(){
    var service = {};
    var fn="queryVipgradeList";
    service = Commonjs.jsonToString(service);
    var params = Commonjs.getParams(fn,service);//获取参数
    var data=Commonjs.ajax(weburl,params,false);
    if(data.result == "success"){
        if(data.data==null)
            return;

        var htmlWeb = '',
            htmlFtp = '',
            htmlMysql = '',
            htmlMssql = '';
        if (data.data.length>0) {
            levelList = data.data;
        }
            /*    BaseForeach(data.data,function(i,item){*/
                htmlWeb+='<tr>';
                htmlWeb+='<td><input type="text" class="manager-input m-input width100" name="WebLinksBase_Price" id="WebLinksBase_Price" /></td>';
                htmlWeb+='<td><input type="text" class="manager-input m-input width100" name="WebLinksUnit_Price" id="WebLinksUnit_Price" /></td>';
                htmlWeb+='<td><input type="text" class="manager-input m-input width100" name="WebWidthBase_Price" id="WebWidthBase_Price" /></td>';
                htmlWeb+='<td><input type="text" class="manager-input m-input width100" name="WebWidthUnit_Price" id="WebWidthUnit_Price" /></td>';
                htmlWeb+='<td><input type="text" class="manager-input m-input width100" name="WebFlowBase_Price" id="WebFlowBase_Price" /></td>';
                htmlWeb+='<td><input type="text" class="manager-input m-input width100" name="WebFlowUnit_Price" id="WebFlowUnit_Price" /></td>';
                htmlWeb+='<td><input type="text" class="manager-input m-input width100" name="WebFtpDiskQuotaBase_Price" id="WebFtpDiskQuotaBase_Price" /></td>';
                htmlWeb+='<td><input type="text" class="manager-input m-input width100" name="WebFtpDiskQuotaUnit_Price" id="WebFtpDiskQuotaUnit_Price" /></td>';
                htmlWeb+='</tr>';

                htmlFtp+='<tr>';
                htmlFtp+='<td><input type="text" class="manager-input m-input width100" name="FtpDiskQuotaBase_Price" id="FtpDiskQuotaBase_Price" /></td>';
                htmlFtp+='<td><input type="text" class="manager-input m-input width100" name="FtpDiskQuotaUnit_Price" id="FtpDiskQuotaUnit_Price" /></td>';
                htmlFtp+='</tr>';

                htmlMysql+='<tr>';
                htmlMysql+='<td><input type="text" class="manager-input m-input width100" name="MySQLSizeBase_Price" id="MySQLSizeBase_Price" /></td>';
                htmlMysql+='<td><input type="text" class="manager-input m-input width100" name="MySQLSizeUnit_Price" id="MySQLSizeUnit_Price" /></td>';
                htmlMysql+='</tr>';

                htmlMssql+='<tr>';
                htmlMssql+='<td><input type="text" class="manager-input m-input width100" name="MSSQLSizeBase_Price" id="MSSQLSizeBase_Price" /></td>';
                htmlMssql+='<td><input type="text" class="manager-input m-input width100" name="MSSQLSizeUnit_Price" id="MSSQLSizeUnit_Price" /></td>';
                htmlMssql+='<td><input type="text" class="manager-input m-input width100" name="MSSQLLogSizeBase_Price" id="MSSQLLogSizeBase_Price" /></td>';
                htmlMssql+='<td><input type="text" class="manager-input m-input width100" name="MSSQLLogSizeUnit_Price" id="MSSQLLogSizeUnit_Price" /></td>';
                htmlMssql+='</tr>';
            //});

            $('#webPriceList').html(htmlWeb);
            $('#ftpPriceList').html(htmlFtp);
            $('#mysqlPriceList').html(htmlMysql);
            $('#mssqlPriceList').html(htmlMssql);
        //}
    }
}

//获取产品信息
function getVhostProduct(){
    var service = {};
    service.productCode = productCode;
    service.productClass = "vhost";
    var fn="getCloudProduct";
    service = Commonjs.jsonToString(service);
    var params = Commonjs.getParams(fn,service);//获取参数
    var result=Commonjs.ajax(weburl,params,false);
    if(result.result == "success"){
        var obj=result.data.productView;
        $("#hidProductClass").val(obj.productClass);
        $("#productClassName").html(obj.productClassName);
        $("#hidProductCode").val(obj.productCode);
        $("#productCode").html(obj.productCode);
        $("#productName").val(obj.productName);
        $("#productDetail").val(obj.productDetail);
        //设置选中
        $("#status").find("option[value='"+obj.status+"']").attr("selected",true);

        //产品参数
        var productParam = obj.productParam;

        //服务列表选中
        var serviceTypeStr = productParam.serviceType;
        var serviceTypeArr = serviceTypeStr.split(",");
        $.each(serviceTypeArr, function (index, serviceType) {
            $('#' + serviceType + 'Checkbox').trigger('click');
        });

        //是否允许服务项开通
        $('#allowChooseType').val(productParam.allowChooseType);

        //数量
        $('#buyMaxNum').val(productParam.buyMaxNum);

        //WEB产品参数填充
        //允许绑定域名数量
        $('#WebHostNum').val(productParam.webHostNum ? productParam.webHostNum : 10);
        //默认文档
        $('#WebDefaultDoc').val(productParam.webDefaultDoc ? productParam.webDefaultDoc :
            'Default.htm, Default.html, Default.asp, Index.htm, Index.html, Index.asp');
        //是否支持独立IP
        var webAloneIP = productParam.webAloneIP ? productParam.webAloneIP : 'N';
        $('input[name="WebAloneIP"][value="' + webAloneIP + '"]').get(0).checked = true;
        //端口
        $('#WebPort').val(productParam.webPort ? productParam.webPort : 80);
        //目录权限
        $('input[name="WebAccessS"]').get(0).checked = $('input[name="WebAccessS"]').val() ===
            (productParam.webAccessS ? productParam.webAccessS : '');
        $('input[name="WebAccessR"]').get(0).checked = $('input[name="WebAccessR"]').val() ===
            (productParam.webAccessR ? productParam.webAccessR : '');
        $('input[name="WebAccessW"]').get(0).checked = $('input[name="WebAccessW"]').val() ===
            (productParam.webAccessW ? productParam.webAccessW : '');
        $('input[name="WebAccessD"]').get(0).checked = $('input[name="WebAccessD"]').val() ===
            (productParam.webAccessD ? productParam.webAccessD : '');
        //最小链接数
        $('input[name="WebLinksMin"]').val(productParam.webLinksMin ? productParam.webLinksMin : 100);
        //最大可选链接数
        $('input[name="WebLinksMax"]').val(productParam.webLinksMax ? productParam.webLinksMax : 200);
        //链接数可选起售单元
        $('input[name="WebLinksUnit"]').val(productParam.webLinksUnit ? productParam.webLinksUnit : 10);
        //最小带宽
        $('input[name="WebWidthMin"]').val(productParam.webWidthMin ? productParam.webWidthMin : 100);
        //最大可选带宽
        $('input[name="WebWidthMax"]').val(productParam.webWidthMax ? productParam.webWidthMax : 200);
        //带宽可选起售单元
        $('input[name="WebWidthUnit"]').val(productParam.webWidthUnit ? productParam.webWidthUnit : 10);
        //最小流量
        $('input[name="WebFlowMin"]').val(productParam.webFlowMin ? productParam.webFlowMin : 10);
        //最大流量
        $('input[name="WebFlowMax"]').val(productParam.webFlowMax ? productParam.webFlowMax : 100);
        //最大流量
        $('#WebOs').val(productParam.webOs ? productParam.webOs : 'windows');
        //可用服务器
        var serverWebString = productParam.serverWeb ? productParam.serverWeb : '';
        var serverWebArr = serverWebString.split(",");
        $.each(serverWebArr, function (index, serverWeb) {
            $('input[name="serverWeb"][value="' + serverWeb + '"]').trigger('click');
        });
        //CPU
        $('input[name="WebCPU"]').val(productParam.webCPU ? productParam.webCPU : 10);
        //脚本类型
        var webScriptTypeString = productParam.webScriptType ? productParam.webScriptType : '';
        var webScriptTypeArr = webScriptTypeString.split(",");
        $.each(webScriptTypeArr, function (index, webScriptType) {
            $('input[name="WebScriptType"][value="' + webScriptType + '"]').trigger('click');
        });
        //允许预装的软件
        var webSoftString = productParam.webSoft ? productParam.webSoft : '';
        var webSoftArr = webSoftString.split(",");
        $.each(webSoftArr, function (index, webSoft) {
            $('input[name="WebSoft"]').each(function () {
                if (this.value == webSoft) {
                    $(this).trigger('click');
                }
            })
        });

        //Ftp参数获取填充.
        //可选最大空间值
        $('#FtpDiskQuotaMax').val(productParam.ftpDiskQuotaMax ? productParam.ftpDiskQuotaMax : 2000);
        //允许申请最小空间值
        $('#FtpDiskQuotaMin').val(productParam.ftpDiskQuotaMin ? productParam.ftpDiskQuotaMin : 500);
        //可选起售单元
        $('#FtpDiskQuotaUnit').val(productParam.ftpDiskQuotaUnit ? productParam.ftpDiskQuotaUnit : 50);
        //可用服务器
        var serverFtpString = productParam.serverFtp ? productParam.serverFtp : '';
        var serverFtpArr = serverFtpString.split(",");
        $.each(serverFtpArr, function (index, serverFtp) {
            $('input[name="serverFtp"][value="' + serverFtp + '"]').trigger('click');
        });

        //MySQL参数
        //MySQL允许申请最大空间值
        $('#MySQLSizeMax').val(productParam.mySQLSizeMax ? productParam.mySQLSizeMax : 2000);
        //MySQL允许申请最小空间值
        $('#MySQLSizeMin').val(productParam.mySQLSizeMin ? productParam.mySQLSizeMin : 500);
        //可选起售单元
        $('#MySQLSizeUnit').val(productParam.mySQLSizeUnit ? productParam.mySQLSizeUnit : 50);
        $('#MySQLOnlineUrl').val(productParam.MySQLOnlineUrl);
        //可用服务器
        var serverMySQLString = productParam.serverMySQL ? productParam.serverMySQL : '';
        var serverMySQLArr = serverMySQLString.split(",");
        $.each(serverMySQLArr, function (index, serverMySQL) {
            $('input[name="serverMySQL"][value="' + serverMySQL + '"]').trigger('click');
        });

        //MSSQL参数
        //SQL Server最大空间值
        $('#MSSQLSizeMax').val(productParam.MSSQLSizeMax ? productParam.MSSQLSizeMax : 2000);
        //SQL Server最小空间值
        $('#MSSQLSizeMin').val(productParam.MSSQLSizeMin ? productParam.MSSQLSizeMin : 500);
        //SQL Server空间可选起售单元
        $('#MSSQLSizeUnit').val(productParam.MSSQLSizeUnit ? productParam.MSSQLSizeUnit : 50);
        //SQL Server最大日志空间值
        $('#MSSQLLogSizeMax').val(productParam.MSSQLLogSizeMax ? productParam.MSSQLLogSizeMax : 2000);
        //SQL Server最小日志空间值
        $('#MSSQLLogSizeMin').val(productParam.MSSQLLogSizeMin ? productParam.MSSQLLogSizeMin : 500);
        //SQL Server日志空间可选起售单元
        $('#MSSQLLogSizeUnit').val(productParam.MSSQLLogSizeUnit ? productParam.MSSQLLogSizeUnit : 50);
        $('#MSSQLOnlineUrl').val(productParam.MSSQLOnlineUrl);

        //可用服务器
        var serverSQLServerString = productParam.serverSQLServer ? productParam.serverSQLServer : '';
        var serverSQLServerArr = serverSQLServerString.split(",");
        $.each(serverSQLServerArr, function (index, serverSQLServer) {
            $('input[name="serverSQLServer"][value="' + serverSQLServer + '"]').trigger('click');
        });

        //价格配置
        for (var j = 0; j<levelList.length; j++) {
            var item = levelList[j];

            //Web价格配置
            for (var h = 0; h < webPriceColumns.length; h++) {
                var column = webPriceColumns[h];
                var priceItem = productParam.webPrice ? productParam.webPrice : {};
                $('#' + column.key + '_Price').val(priceItem[column.key] ? priceItem[column.key] : '');
            }

            //Ftp价格配置
            for (var m = 0; m < ftpPriceColumns.length; m++) {
                var column = ftpPriceColumns[m];
                var priceItem = productParam.ftpPrice ? productParam.ftpPrice : {};
                $('#' + column.key + '_Price').val(priceItem[column.key] ? priceItem[column.key]: '');
            }

            //MySQL价格配置
            for (var n = 0; n < mysqlPriceColumns.length; n++) {
                var column = mysqlPriceColumns[n];
                var priceItem = productParam.mysqlPrice ? productParam.mysqlPrice : {};
                $('#' + column.key + '_Price').val(priceItem[column.key] ? priceItem[column.key] : '');
            }

            //SQL Server 价格配置
            for (var g = 0; g < mssqlPriceColumns.length; g++) {
                var column = mssqlPriceColumns[g];
                var priceItem = productParam.mssqlPrice ? productParam.mssqlPrice : {};
                $('#' + column.key + '_Price').val(priceItem[column.key] ? priceItem[column.key] : '');
            }
        }

        //产品促销
        var priceItem=result.data.promotionList;
        if(priceItem!="" || priceItem.length>0){
            BaseForeach(priceItem,function(i,item){
                var type='';
                if(item.chargeId==1)
                    type="buy";
                else if(item.chargeId==2)
                    type="renew";

                $("#chk_"+type+'_'+item.applyType+"_"+item.applyTime).attr("checked","checked");
                $("#st_"+type+'_'+item.applyType+"_"+item.applyTime).val(item.saleType);
                $("#txt_"+type+'_'+item.applyType+"_"+item.applyTime).val(item.saleValue);
            })
        }

    }
}

//保存产品数据
function saveProductData(){
    var allParam = {
        productCode : productCode
    };
    var webFlag = false,
        ftpFlag = false,
        mysqlFlag = false,
        mssqlFlag = false;

    var serviceType = "";
    $("input[name=serviceType]:checked").each(function(){
        serviceType+= ("" == serviceType ? "" : ",") + $(this).val();

        switch ($(this).val()) {
            case 'web':
                webFlag = true;
                break;
            case 'ftp':
                ftpFlag = true;
                break;
            case 'mysql':
                mysqlFlag = true;
                break;
            case 'mssql':
                mssqlFlag = true;
                break;
        }

    });
    if ("" == serviceType) {
        //topError('请选择至少一种开通服务',2000000,false);
        topError(window, '请选择至少一种开通服务');
        return false;
    }
    allParam.serviceType = serviceType;

    var productName = $('#productName').val().trim();
    if ('' == productName) {
        topError(window, '请填写产品名称');
        return false;
    }
    allParam.productName = productName;

    //主参数值获取.
    allParam.productDetail = $('#productDetail').val();
    allParam.status = $('#status').val();
    allParam.buyMaxNum = $('#buyMaxNum').val();
    allParam.allowChooseType = $('#allowChooseType').val();
    if (!IntegerUtils.isPositive(allParam.buyMaxNum)) {
        topError(window, '购买数量不正确，必须为大于0的整数');
        return false;
    }

    //Web 参数
    if (webFlag) {
        //允许绑定域名数量
        var webHostNum = $('#WebHostNum').val();
        if (!IntegerUtils.isPositive(webHostNum)) {
            topError(window, '允许绑定域名数量不正确，必须为大于0的整数');
            return false;
        }
        allParam.webHostNum = webHostNum;

        //默认文档
        var webDefaultDoc = $('#WebDefaultDoc').val().trim();
        if (StringUtils.isBlank(webDefaultDoc)) {
            topError(window, '默认文档不能为空');
            return false;
        }
        allParam.webDefaultDoc = webDefaultDoc;

        //是否支持独立IP
        if ($('input[name="WebAloneIP"]:checked').length < 1) {
            topError(window, '请选择是否支持独立IP')
            return false;
        }
        allParam.webAloneIP = $('input[name="WebAloneIP"]:checked').get(0).value;

        //端口
        var webPort = $('#WebPort').val();
        if (!IntegerUtils.isPositive(webPort)) {
            topError(window, '端口值不正确，请输入正确的数字');
            return false;
        }
        allParam.webPort = webPort;

        //目录权限
        allParam.webAccessS = $('input[name="WebAccessS"]:checked').length > 0 ? 'S' : '';
        allParam.webAccessR = $('input[name="WebAccessR"]:checked').length > 0 ? 'R' : '';
        allParam.webAccessW = $('input[name="WebAccessW"]:checked').length > 0 ? 'W' : '';
        allParam.webAccessS = $('input[name="WebAccessD"]:checked').length > 0 ? 'D' : '';
        allParam.webAccess = allParam.webAccessS + allParam.webAccessR + allParam.webAccessW + allParam.webAccessS;
        if (StringUtils.isBlank(allParam.webAccess)) {
            topError(window, '请选择目录权限');
            return false;
        }

        //最小链接数
        var webLinksMin = parseInt($('input[name="WebLinksMin"]').val());
        if (!IntegerUtils.isPositive(webLinksMin)) {
            topError(window, '最小链接数不正确，请填写大于0的数字');
            return false;
        }
        allParam.webLinksMin = webLinksMin;

        //最大可选链接数
        var webLinksMax = parseInt($('input[name="WebLinksMax"]').val());
        if (!IntegerUtils.isPositive(webLinksMax)) {
            topError(window, '最大链接数不正确，请填写大于0的数字');
            return false;
        }
        allParam.webLinksMax = webLinksMax;

        if (webLinksMax < webLinksMin) {
            topError(window, '最大可选链接数不能小于最小链接数');
            return false;
        }

        //链接数可选起售单元
        var webLinksUnit = parseInt($('input[name="WebLinksUnit"]').val());
        if (!IntegerUtils.isPositive(webLinksUnit)) {
            topError(window, '链接数可选起售单元不正确，请填写大于0的数字');
            return false;
        }
        allParam.webLinksUnit = webLinksUnit;

        //最小带宽
        var webWidthMin = parseInt($('input[name="WebWidthMin"]').val());
        if (!IntegerUtils.isPositive(webWidthMin)) {
            topError(window, '最小带宽不正确，请填写大于0的数字');
            return false;
        }
        allParam.webWidthMin = webWidthMin;

        //最大可选带宽
        var webWidthMax = parseInt($('input[name="WebWidthMax"]').val());
        if (!IntegerUtils.isPositive(webWidthMax)) {
            topError(window, '最大可选带宽不正确，请填写大于0的数字');
            return false;
        }
        allParam.webWidthMax = webWidthMax;

        if (webWidthMax < webWidthMin) {
            topError(window, '最大可选带宽不能小于最小带宽');
            return false;
        }

        //带宽可选起售单元
        var webWidthUnit = parseInt($('input[name="WebWidthUnit"]').val());
        if (!IntegerUtils.isPositive(webWidthUnit)) {
            topError(window, '最大可选带宽不正确，请填写大于0的数字');
            return false;
        }
        allParam.webWidthUnit = webWidthUnit;

        //最小流量
        var webFlowMin = parseInt($('input[name="WebFlowMin"]').val());
        if (!IntegerUtils.isPositive(webFlowMin)) {
            topError(window, '最小流量不正确，请填写大于0的数字');
            return false;
        }
        allParam.webFlowMin = webFlowMin;

        //最大可选流量
        var webFlowMax = parseInt($('input[name="WebFlowMax"]').val());
        if (!IntegerUtils.isPositive(webFlowMax)) {
            topError(window, '最大可选流量不正确，请填写大于0的数字');
            return false;
        }
        allParam.webFlowMax = webFlowMax;

        if (webFlowMax < webFlowMin) {
            topError(window, '最大可选流量不能小于最小流量');
            return false;
        }

        //系统类型
        var webOs = $('#WebOs').val();
        if (StringUtils.isBlank(webOs)) {
            topError(window, '最选择系统类型');
            return false;
        }
        allParam.webOs = webOs;

        //可用服务器
        var serverWeb = "";
        $('input[name="serverWeb"]:checked').each(function () {
            serverWeb += (serverWeb == "" ? "" : ",") + $(this).val();
        });
        if (StringUtils.isBlank(serverWeb)) {
            topError(window, '请至少选择一个Web可用服务器');
            return false;
        }
        allParam.serverWeb = serverWeb;

        //CPU
        if ("windows" == webOs) {
            var webCPU = $('input[name="WebCPU"]').val();
            if (!IntegerUtils.isPositive(webCPU)) {
                topError(window, 'CPU不正确，请填写大于0的数字');
                return false;
            }
            allParam.webCPU = webCPU;
        }

        //脚本类型
        var webScriptType = "";
        $('input[name="WebScriptType"]:checked').each(function () {
            webScriptType += (webScriptType == "" ? "" : ",") + $(this).val();
        });
        if (StringUtils.isBlank(webScriptType)) {
            topError(window, '请至少选择一个脚本类型');
            return false;
        }
        allParam.webScriptType = webScriptType;

        //允许预装的软件
        var webSoft = "";
        $('input[name="WebSoft"]:checked').each(function () {
            webSoft += (webSoft == "" ? "" : ",") + $(this).val();
        });
        allParam.webSoft = webSoft;
    }

    //Ftp参数检查
    if (ftpFlag) {
        //最大空间值
        var ftpDiskQuotaMax = parseInt($('#FtpDiskQuotaMax').val());
        if (!IntegerUtils.isPositive(ftpDiskQuotaMax)) {
            topError(window, 'FTP最大空间值不正确，请填写大于0的数字');
            return false;
        }
        allParam.ftpDiskQuotaMax = ftpDiskQuotaMax;

        //允许申请最小空间值
        var ftpDiskQuotaMin = parseInt($('#FtpDiskQuotaMin').val());
        if (!IntegerUtils.isPositive(ftpDiskQuotaMin)) {
            topError(window, 'FTP最小空间值不正确，请填写大于0的数字');
            return false;
        }
        allParam.ftpDiskQuotaMin = ftpDiskQuotaMin;

        if (ftpDiskQuotaMax < ftpDiskQuotaMin) {
            topError(window, 'FTP最大空间值不能小于最小空间值');
            return false;
        }

        //起售单元
        var ftpDiskQuotaUnit = $('#FtpDiskQuotaUnit').val();
        if (!IntegerUtils.isPositive(ftpDiskQuotaUnit)) {
            topError(window, '可选起售单元值不正确，请填写大于0的数字');
            return false;
        }
        allParam.ftpDiskQuotaUnit = ftpDiskQuotaUnit;

        //可用服务器
        if (!webFlag) {
            var serverFtp = "";
            $('input[name="serverFtp"]:checked').each(function () {
                serverFtp += (serverFtp == "" ? "" : ",") + $(this).val();
            });
            if (StringUtils.isBlank(serverFtp)) {
                topError(window, '请至少选择一个Ftp可用服务器');
                return false;
            }
            allParam.serverFtp = serverFtp;
        }
    }

    //mysql参数检查
    if (mysqlFlag) {
        //最大空间值
        var mySQLSizeMax = parseInt($('#MySQLSizeMax').val());
        if (!IntegerUtils.isPositive(mySQLSizeMax)) {
            topError(window, 'MySQL允许申请最大空间值不正确，请填写大于0的数字');
            return false;
        }
        allParam.mySQLSizeMax = mySQLSizeMax;

        //MySQL允许申请最小空间值
        var mySQLSizeMin = parseInt($('#MySQLSizeMin').val());
        if (!IntegerUtils.isPositive(mySQLSizeMin)) {
            topError(window, 'MySQL允许申请最小空间值不正确，请填写大于0的数字');
            return false;
        }
        allParam.mySQLSizeMin = mySQLSizeMin;

        if (mySQLSizeMax < mySQLSizeMin) {
            topError(window, 'MySQL允许申请最大空间值不能小于最小值');
            return false;
        }

        //起售单元
        var mySQLSizeUnit = parseInt($('#MySQLSizeUnit').val());
        if (!IntegerUtils.isPositive(mySQLSizeUnit)) {
            topError(window, 'MySQL空间可选起售单元值不正确，请填写大于0的数字');
            return false;
        }
        allParam.mySQLSizeUnit = mySQLSizeUnit;

        //在线管理工具
        allParam.MySQLOnlineUrl = $('#MySQLOnlineUrl').val();

        //可用服务器
        var serverMySQL = "";
        $('input[name="serverMySQL"]:checked').each(function () {
            serverMySQL += (serverMySQL == "" ? "" : ",") + $(this).val();
        });
        if (StringUtils.isBlank(serverMySQL)) {
            topError(window, '请至少选择一个MySQL可用服务器');
            return false;
        }
        allParam.serverMySQL = serverMySQL;
    }

    //SQL Server参数检查.
    if (mssqlFlag) {
        //SQL Server最大空间值
        var MSSQLSizeMax = parseInt($('#MSSQLSizeMax').val());
        if (!IntegerUtils.isPositive(MSSQLSizeMax)) {
            topError(window, 'SQL Server允许申请最大空间值不正确，请填写大于0的数字');
            return false;
        }
        allParam.MSSQLSizeMax = MSSQLSizeMax;

        //SQL Server最小空间值
        var MSSQLSizeMin = parseInt($('#MSSQLSizeMin').val());
        if (!IntegerUtils.isPositive(MSSQLSizeMin)) {
            topError(window, 'SQL Server允许申请最大空间值不正确，请填写大于0的数字');
            return false;
        }
        allParam.MSSQLSizeMin = MSSQLSizeMin;

        if (MSSQLSizeMax < MSSQLSizeMin) {
            topError(window, 'SQL Server允许申请最大空间值不能小于最小值');
            return false;
        }

        //可选起售单元
        var MSSQLSizeUnit = parseInt($('#MSSQLSizeUnit').val());
        if (!IntegerUtils.isPositive(MSSQLSizeUnit)) {
            topError(window, 'SQL Server空间可选起售单元值不正确，请填写大于0的数字');
            return false;
        }
        allParam.MSSQLSizeUnit = MSSQLSizeUnit;

        //SQL Server最大日志空间值
        var MSSQLLogSizeMax = parseInt($('#MSSQLLogSizeMax').val());
        if (!IntegerUtils.isPositive(MSSQLLogSizeMax)) {
            topError(window, 'SQL Server允许申请最大日志空间值不正确，请填写大于0的数字');
            return false;
        }
        allParam.MSSQLLogSizeMax = MSSQLLogSizeMax;

        //SQL Server最小日志空间值
        var MSSQLLogSizeMin = parseInt($('#MSSQLLogSizeMin').val());
        if (!IntegerUtils.isPositive(MSSQLLogSizeMin)) {
            topError(window, 'SQL Server允许申请最大日志空间值不正确，请填写大于0的数字');
            return false;
        }
        allParam.MSSQLLogSizeMin = MSSQLLogSizeMin;

        if (MSSQLLogSizeMax < MSSQLLogSizeMin) {
            topError(window, 'SQL Server允许申请最大日志空间值不能小于最小值');
            return false;
        }

        //可选日志起售单元
        var MSSQLLogSizeUnit = parseInt($('#MSSQLLogSizeUnit').val());
        if (!IntegerUtils.isPositive(MSSQLLogSizeUnit)) {
            topError(window, 'SQL Server日志空间可选起售单元值不正确，请填写大于0的数字');
            return false;
        }
        allParam.MSSQLLogSizeUnit = MSSQLLogSizeUnit;

        //在线管理工具
        allParam.MSSQLOnlineUrl = $('#MSSQLOnlineUrl').val();

        //可用服务器
        var serverSQLServer = "";
        $('input[name="serverSQLServer"]:checked').each(function () {
            serverSQLServer += (serverSQLServer == "" ? "" : ",") + $(this).val();
        });
        if (StringUtils.isBlank(serverSQLServer)) {
            topError(window, '请至少选择一个SQL Server可用服务器');
            return false;
        }
        allParam.serverSQLServer = serverSQLServer;
    }

    //web价格检查
    if (webFlag) {
        var thisPrice = {};
        var columns = webPriceColumns;
        for (var h = 0; h < columns.length; h++) {
            var column = columns[h];
            thisPrice[column.key] = $('#' + column.key + '_Price').val();
            if (!IntegerUtils.isUnsigned(thisPrice[column.key])) {
                topError(window, 'Web产品' + column.name + '的价格设置不正确');
                return false;
            }
        }

        allParam.webPrice = thisPrice;
    }

    //ftp价格设置
    if (!webFlag && ftpFlag) {
        var thisPrice = {};
        var columns = ftpPriceColumns;
        for (var h = 0; h < columns.length; h++) {
            var column = columns[h];
            thisPrice[column.key] = $('#' + column.key + '_Price').val();
            if (!IntegerUtils.isUnsigned(thisPrice[column.key])) {
                topError(window, 'Web产品' + column.name + '的价格设置不正确');
                return false;
            }
        }

        allParam.ftpPrice = thisPrice;
    }

    //mysql产品价格
    if (mysqlFlag) {
        var thisPrice = {};
        var columns = mysqlPriceColumns;
        for (var h = 0; h < columns.length; h++) {
            var column = columns[h];
            thisPrice[column.key] = $('#' + column.key + '_Price').val();
            if (!IntegerUtils.isUnsigned(thisPrice[column.key])) {
                topError(window, 'Web产品' + column.name + '的价格设置不正确');
                return false;
            }
        }

        allParam.mysqlPrice = thisPrice;
    }

    //SQL Server
    if (mssqlFlag) {
        var thisPrice = {};
        var columns = mssqlPriceColumns;
        for (var h = 0; h < columns.length; h++) {
            var column = columns[h];
            thisPrice[column.key] = $('#' + column.key + '_Price').val();
            if (!IntegerUtils.isUnsigned(thisPrice[column.key])) {
                topError(window, 'Web产品' + column.name + '的价格设置不正确');
                return false;
            }
        }

        allParam.mssqlPrice = thisPrice;
    }

    var productStr = Commonjs.jsonToString(allParam);

    //价格优惠
    var priceItemStr='';
    $("input[name=buyTime]:checked").each(function(){
        var priceItem={};
        priceItem.productCode=$("#hidProductCode").val();
        priceItem.chargeId=1;
        priceItem.applyTime=$(this).val();
        priceItem.applyType=$(this).attr("time");
        priceItem.saleType=$("#st_buy_"+$(this).attr("time")+"_"+$(this).val()).val();
        priceItem.saleValue=$("#txt_buy_"+$(this).attr("time")+"_"+$(this).val()).val();
        priceItemStr+=Commonjs.jsonToString(priceItem)+',';
    });

    $("input[name=renewTime]:checked").each(function(){
        var priceItem={};
        priceItem.productCode=$("#hidProductCode").val();
        priceItem.chargeId=2;
        priceItem.applyTime=$(this).val();
        priceItem.applyType=$(this).attr("time");
        priceItem.saleType=$("#st_renew_"+$(this).attr("time")+"_"+$(this).val()).val();
        priceItem.saleValue=$("#txt_renew_"+$(this).attr("time")+"_"+$(this).val()).val();
        priceItemStr+=Commonjs.jsonToString(priceItem)+',';
    });
    priceItemStr=priceItemStr.substring(0, priceItemStr.length-1);

    var fn="saveVhostProductSet";
    var jsonStr='{"product":['+productStr+'],"priceItem":['+priceItemStr+']}';
    var params = Commonjs.getParams(fn,jsonStr);
    Commonjs.ajaxTrue(weburl,params,saveDataSuccess,false);
}

function saveDataSuccess(data){
    topSuccess(window, data.msg);
    $('html,body').scrollTop(0);
    window.location.reload();
    getDomainProduct();
}

function calcPrice(type){
    var year=parseInt($("#sel_"+type).val());
    for(var i=1;i<=year;i++){
        BaseForeach(levelList,function(j,item){
            var firstYear=$("#txt_"+type+"_1_"+item.levelCode).val();
            if(firstYear!=""){
                firstYear=parseFloat(firstYear);
                $("#txt_"+type+"_"+i+"_"+item.levelCode).val(firstYear*i);
            }
        });
    }
}

function clearPrice(type){
    var dialog=	art.dialog({
        lock : true,
        opacity : 0.4,
        width : 250,
        title : '提示',
        content : '您确定清空吗？',
        ok : function() {
            for(var i=1;i<=10;i++){
                BaseForeach(levelList,function(j,item){
                    $("#txt_"+type+"_"+i+"_"+item.levelCode).val("");
                });
            }
        },cancel: function(){
            $('#dialog').hide();
        }
    });
}

function getRegPrice(){
    for(var i=1;i<=10;i++){
        BaseForeach(levelList,function(j,item){
            var regPrice=$("#txt_reg_"+i+"_"+item.levelCode).val()
            $("#txt_renew_"+i+"_"+item.levelCode).val(regPrice);
        });
    }
}
