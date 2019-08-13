var instanceId;
var instanceInfo;
$(function () {
    instanceId=request("iId");

    $('#btnBackList').on('click', function () {
        history.back();
    });

    var service = {};
    service.id=instanceId;
    var fn="queryUserDiyDetail";
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
    var openParam = info.openInfo;

    $("#productCode").val(info.productCode);
    $('#productDetail').html(openParam.productDetail.replace(/\n/g, '<br />'));

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

        getPrice();

    },false);
}

/**
 * 获取价格.
 */
function getPrice(){
    var service = {};
    service.applyTime = $("#curApplyTime").attr("time");
    service.priceType = $("#curApplyTime").attr("type");
    service.productCode = instanceInfo.productCode;

    var fn="getDiyRenewPrice";
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
    service.businessId = instanceInfo.id;
    service.applyTime = $("#curApplyTime").attr("time");
    service.priceType = $("#curApplyTime").attr("type");
    service.productParam = {id:instanceInfo.id, productCode:instanceInfo.productCode}

    var fn="addUserCartDiy";
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
