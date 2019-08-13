var instanceId;
var instanceInfo;
$(function () {
    instanceId=request("iId");

    $('#btnBackList').on('click', function () {
        history.back();
    });

    var service = {};
    service.id=instanceId;
    var fn="queryUserVhost";
    service = Commonjs.jsonToString(service)
    var params = Commonjs.getParams(fn,service);//获取参数
    Commonjs.ajaxTrue(weburl,params,function (data) {
        var info=data.data;
        instanceInfo = info;
        showServer(info);
    });
});

var clickfn = function () {
    getPrice();
};

function showServer(info) {
    //开通的服务：serverTypeListDiv
    var serverTypeHtml = "";
    var openParam = info.extendInfo;
    var productParam = info.sysProductView.productParam;
    var serverTypeArr = info.vhostType.split(",");
    var webFlag = false, ftpFlag = false, mysqlFlag = false, mssqlFlag = false;
    serverTypeArr.forEach(function (value) {
        var name = "";
        switch (value) {
            case "web":
                name = "WEB服务";
                webFlag = true;
                break;
            case "ftp":
                name = "FTP服务";
                ftpFlag = true;
                break;
            case "mysql":
                name = "MySQL服务";
                mysqlFlag = true;
                break;
            case "mssql":
                name = "SQL Server服务";
                mssqlFlag = true;
                break;
        }
        serverTypeHtml += '<dt class="active">' + name + '</dt>';
    });
    $('#serverTypeListDiv').html(serverTypeHtml);
    $('.filter-web').css('display', 'none');
    $('.filter-web-ftp').css('display', 'none');
    $('.filter-ftp').css('display', 'none');
    $('.filter-mysql').css('display', 'none');
    $('.filter-mssql').css('display', 'none');

    $("#productCode").val(info.productCode);

    if (webFlag) {
        $('.filter-web').css('display', '');
        $('.filter-web-ftp').css('display', '');
        $('#webOsTd').html(productParam.webOs);
        $('#webHostNumTd').html(productParam.webHostNum);
        $('#webAloneIPTd').html(productParam.webAloneIP == 'Y' ? '支持' : '不支持');
        $('#webScriptTypeTd').html(productParam.webScriptType);
        $('#webSoftTd').html(productParam.webSoft);

        //滑块  链接数
        new SlideBar({
            actionBlock : 'action-block-webLinks',
            actionBar : 'action-bar-webLinks',
            slideBar : 'scroll-bar-webLinks',
            barLength : 550,
            interval : productParam.webLinksUnit,//(productParam.webLinksMax-productParam.webLinksMin),
            minNumber : openParam.WebLinks,
            maxNumber : productParam.webLinksMax,
            showArea : 'webLinksArea',
            curBandwidth : 'webLinksShow',
            unit : '个',
            clickfn : clickfn,
            block : productParam.webLinksUnit
        });

        //滑块  带宽
        new SlideBar({
            actionBlock : 'action-block-webWidth',
            actionBar : 'action-bar-webWidth',
            slideBar : 'scroll-bar-webWidth',
            barLength : 550,
            interval : productParam.webWidthUnit,//(productParam.webLinksMax-productParam.webLinksMin),
            minNumber : openParam.WebWidth,
            maxNumber : productParam.webWidthMax,
            showArea : 'webWidthArea',
            curBandwidth : 'webWidthShow',
            unit : 'Kbps',
            clickfn : clickfn,
            block : productParam.webWidth
        });

        //滑块  流量
        new SlideBar({
            actionBlock : 'action-block-webFlow',
            actionBar : 'action-bar-webFlow',
            slideBar : 'scroll-bar-webFlow',
            barLength : 550,
            interval : (productParam.webFlowMax-openParam.WebFlow),
            minNumber : openParam.WebFlow,
            maxNumber : productParam.webFlowMax,
            showArea : 'webFlowArea',
            curBandwidth : 'webFlowShow',
            unit : 'GB',
            clickfn : clickfn,
            block : 1
        });
    }

    if (ftpFlag) {
        $('.filter-web-ftp').css('display', '');
        if (!webFlag) {
            $('.filter-ftp').css('display', '');
        }
        //滑块  空间大小
        new SlideBar({
            actionBlock : 'action-block-ftpDiskQuota',
            actionBar : 'action-bar-ftpDiskQuota',
            slideBar : 'scroll-bar-ftpDiskQuota',
            barLength : 550,
            interval : (productParam.ftpDiskQuotaMax-openParam.FtpDiskQuota),
            minNumber : openParam.FtpDiskQuota,
            maxNumber : productParam.ftpDiskQuotaMax,
            showArea : 'ftpDiskQuotaArea',
            curBandwidth : 'ftpDiskQuotaShow',
            unit : 'MB',
            clickfn : clickfn,
            block : 1
        });
    }

    if (mssqlFlag) {
        $('.filter-mssql').css('display', '');
        //滑块  sql server空间大小
        new SlideBar({
            actionBlock : 'action-block-MSSQLSize',
            actionBar : 'action-bar-MSSQLSize',
            slideBar : 'scroll-bar-MSSQLSize',
            barLength : 550,
            interval : (productParam.MSSQLSizeMax-openParam.DbMaxSize),
            minNumber : openParam.DbMaxSize,
            maxNumber : productParam.MSSQLSizeMax,
            showArea : 'MSSQLSizeArea',
            curBandwidth : 'MSSQLSizeShow',
            unit : 'Mb',
            clickfn : clickfn,
            block : 1
        });

        //滑块  日志空间
        new SlideBar({
            actionBlock : 'action-block-MSSQLLogSize',
            actionBar : 'action-bar-MSSQLLogSize',
            slideBar : 'scroll-bar-MSSQLLogSize',
            barLength : 550,
            interval : (productParam.MSSQLLogSizeMax-openParam.DbLogMaxSize),
            minNumber : openParam.DbLogMaxSize,
            maxNumber : productParam.MSSQLLogSizeMax,
            showArea : 'MSSQLLogSizeArea',
            curBandwidth : 'MSSQLLogSizeShow',
            unit : 'Mb',
            clickfn : clickfn,
            block : 1
        });
    }

    if (mysqlFlag) {
        $('.filter-mysql').css('display', '');
        //滑块  mysql空间大小
        new SlideBar({
            actionBlock : 'action-block-mySQLSize',
            actionBar : 'action-bar-mySQLSize',
            slideBar : 'scroll-bar-mySQLSize',
            barLength : 550,
            interval : (productParam.mySQLSizeMax-openParam.MySQLMaxSize),
            minNumber : openParam.MySQLMaxSize,
            maxNumber : productParam.mySQLSizeMax,
            showArea : 'mySQLSizeArea',
            curBandwidth : 'mySQLSizeShow',
            unit : 'Mb',
            clickfn : clickfn,
            block : 1
        });
    }

    getPrice();
}

/**
 * 获取价格.
 */
function getPrice(){
    var service = {};
    service.hostType = $("#hostType").val();
    service.productCode = $("#productCode").val();
    service.webLinks = $("#webLinksArea").val();
    service.webWidth = $("#webWidthArea").val();
    service.webFlow = $("#webFlowArea").val();
    service.ftpDiskQuota = $("#ftpDiskQuotaArea").val();
    service.MSSQLSize = $("#MSSQLSizeArea").val();
    service.MSSQLLogSize = $("#MSSQLLogSizeArea").val();
    service.mySQLSize = $("#mySQLSizeArea").val();
    /*service.applyTime = 1;
    service.priceType = instanceInfo.priceType;
    service.num = 1;*/
    service.webId = instanceInfo.id;

    var fn="getVHostPriceUpgrade";
    service = Commonjs.jsonToString(service);
    var params = Commonjs.getParams(fn,service);//获取参数
    $.ajax({
        datatype:"json",
        type:"POST",
        url: weburl,
        data:params,
        cache : false,
        success: function(data){
            var result=jQuery.parseJSON(data);
            if(result.result=="success"){
                $("#btnBuy").removeClass("disable");
                $("#btnBuy").attr("onclick","addUserCart(0)");
                $("#btnBuyNow").removeClass("disable");
                $("#btnBuyNow").attr("onclick","addUserCart(1)");
                if(isNotNull(result.data)){
                    $("#price").html(result.data.payPrice);
                    $("#totalPrice").html(result.data.totalPrice);
                    $("#discountPrice").html(result.data.discountPrice);
                    $("#discountInfo").show();
                    if(result.data.discountPrice==0){
                        $("#discountMsg").hide();
                    }
                    else{
                        $("#discountMsg").show();
                    }
                }
            } else {
                $("#btnBuy").addClass("disable");
                $("#btnBuy").unbind('click');
            }
        }
    });
}

var buyNow = 0;
//添加购物车
function addUserCart(buyNowFlag){
    buyNow = buyNowFlag;

    var service = {};
    service.productCode=$("#productCode").val();
    service.cartType="update";
    service.webId = instanceInfo.id;

    var instance={};
    instance.webLinks = $("#webLinksArea").val();
    instance.webWidth = $("#webWidthArea").val();
    instance.webFlow = $("#webFlowArea").val();
    instance.ftpDiskQuota = $("#ftpDiskQuotaArea").val();
    instance.MSSQLSize = $("#MSSQLSizeArea").val();
    instance.MSSQLLogSize = $("#MSSQLLogSizeArea").val();
    instance.mySQLSize = $("#mySQLSizeArea").val();
    service.productParam=Commonjs.jsonToString(instance);

    var fn="addUserCartVHostUpdate";
    service = Commonjs.jsonToString(service);
    var params = Commonjs.getParams(fn,service);//获取参数
    Commonjs.ajaxTrue(weburl,params,addSuccess,true,"正在加入购物车中...");
}

function addSuccess(data){
    if(data.data==null)
        return;

    var result=data.data;
    if(result.code=="0") {
        if (buyNow == 1) {
            parent.window.location.href=realPath+"/usercenter/shopping/shoppinglist.html";
        } else {
            //$.tooltip("添加到购物车成功", 2000, true);
            Commonjs.tips("已添加到购物车", true);
            queryUserCartCount();
        }
    }else if(result.code=="-1"){
        Commonjs.alert(result.message);
    }
}

function isNull(str){
    if(str==null || str==undefined)
        return "";
    return str;
}
