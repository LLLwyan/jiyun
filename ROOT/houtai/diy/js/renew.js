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
    var serverTypeArr = productParam.serviceType.split(",");
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

    var service = {};
    service.productCode = info.productCode;
    var fn="getVHostPriceRenewPromotionList";
    service = Commonjs.jsonToString(service);
    var params = Commonjs.getParams(fn,service);//获取参数
    parent.Commonjs.ajaxTrue(weburl,params,function (data) {
        var list = data.data;
        var html='';
        $.each(list,function(i,item){
            var saleHtml='';
            var saleTitle='';
            var type='';
            if(isNotNull(item.saleValue)){
                saleHtml='<span class="badge salemsg">优惠</span>';
                if(item.applyType=="y") {
                    type = '年';
                } else if(item.applyType=="m") {
                    type = '个月';
                }

                if(item.saleType==1) {
                    saleTitle = '购买' + item.applyTime + type + '赠送' + item.saleValue + '个月';
                } else if(item.saleType==2) {
                    saleTitle = '购买' + item.applyTime + type + '享' + item.saleValue + '折';
                } else if(item.saleType==3) {
                    saleTitle = '购买' + item.applyTime + type + '赠送' + item.saleValue + '天';
                }
            }

            if(item.applyType=="m") {
                html += '<dt class="time" time=' + item.applyTime + ' type=' + item.applyType + ' data-toggle="tooltip" data-placement="top" title="' + saleTitle + '">' + item.applyTime + '个月' + saleHtml + '</dt>';
            } else if(item.applyType=="y") {
                html += '<dt class="time pos-r" time=' + item.applyTime + ' type=' + item.applyType + ' data-toggle="tooltip" data-placement="top" title="' + saleTitle + '">' + item.applyTime + '年' + saleHtml + '</dt>';
            }
        });
        $("#timelist").html(html);
        $(".time").eq(0).addClass("active");
        $("#curApplyTime").attr("time",$(".time").eq(0).attr("time"));
        $("#curApplyTime").attr("type",$(".time").eq(0).attr("type"));
        $("#discountInfo").html($(".config-box dl dt").eq(0).attr("title"));

        $(".config-box dl dt").click(function(){
            $(this).addClass('active').siblings().removeClass('active');
            if($(this).attr("type")=="y") {
                $("#curApplyTime").html($(this).attr("time") + "年");
            }
            if($(this).attr("type")=="m") {
                $("#curApplyTime").html($(this).attr("time") + "个月");
            }
            $("#curApplyTime").attr("time",$(this).attr("time"));
            $("#curApplyTime").attr("type",$(this).attr("type"));
            $("#discountInfo").html($(this).attr("title"));
            getPrice();
        });

        if (webFlag) {
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

    },false);
}

/**
 * 获取价格.
 */
function getPrice(){
    var service = {};
    service.applyTime = $("#curApplyTime").attr("time");
    service.priceType = $("#curApplyTime").attr("type");
    service.webId = instanceInfo.id;

    var fn="getVHostPriceRenew";
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
    service.cartType="renew";
    service.webId = instanceInfo.id;
    service.applyTime = $("#curApplyTime").attr("time");
    service.priceType = $("#curApplyTime").attr("type");

    var fn="addUserCartVHostRenew";
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
            parent.window.location.href=realPath+"/default/usercenter/shopping/shoppinglist.html";
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
