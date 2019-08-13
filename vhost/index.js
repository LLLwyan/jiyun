var minSysDisk = 20;
var minDataDisk = 0;
var maxDataDisk = 2000;
var minBandwidth = 1;
var status;
var remark;
var productListParam = [];
var productIndex = 0;
var productView = [];

var clickfn = function(){
    getPrice();
};

$(document).ready(function(){
    getProductList();

	$('#szmm').click(function(){
		$('#cjsz').removeClass('bs');
		$(this).addClass('bs');
		$('#szpass').css('display','block');
		$('#cgsz').css('display','none');
	});
	$('#cjsz').click(function(){
		$('#szmm').removeClass('bs');
		$(this).addClass('bs');
		$('#szpass').css('display','none');
		$('#cgsz').css('display','block');

		$("#loginPwd").val("");
		$("#confirmPwd").val("");
		$("#errorMsg").html("");
	});

	var productCode = $("#productCode").val();
	var maxBandwidth = parseInt($("#maxBandwidth").val());
	var windowsMinSize = parseInt($("#windowsMinSize").val());
	var otherMinSize = parseInt($("#otherMinSize").val());
	$("#curSysDisk").html(minSysDisk+"GB");
	$("#curDataDisk").html("0GB");

    //购买数量
    $("#num-inp").change(function(){
        if(!CndnsValidate.checkNumber($(this).val())){
            Commonjs.alert('购买数必须是整数',false);
            $(this).val(1);
            return false;
        }
        if (parseInt($(this).val()) > productView[productIndex].productParam.buyMaxNum) {
            Commonjs.alert('已超过最大可购买数量',false);
            $(this).val(productView[productIndex].productParam.buyMaxNum);
            return false;
		}
   	 	getPrice();
    });

    $(".numAdd").click(function(){
    	var num=$("#num-inp").val();
    	num=parseInt(num)+1;
        if (num > productView[productIndex].productParam.buyMaxNum) {
            Commonjs.alert('已超过最大可购买数量',false);
            return false;
        }
    	$("#num-inp").val(num);
    	$("#curNum").html(num+"台");
    	 getPrice();
    });

    $(".numSubtract").click(function(){
    	var num=$("#num-inp").val();
    	num=parseInt(num)-1;
    	if(num>0){
    		$("#num-inp").val(num);
        	$("#curNum").html(num+"台");
        	 getPrice();
    	}
    });

	//点击其他地方收缩
	$("body").click(function(e){
		if($(e.target).parents(".sel").length==0){
			$(".sel-m").hide();
		}
		if($(e.target).parents(".sysdisk").length==0){
			$(".sysdisk-m").hide();
		}
		if($(e.target).parents(".datadisk").length==0){
			$(".datadisk-m").hide();
		}
	});
});

/**
 * 获取产品列表.
 */
function getProductList() {
    var service = {};
    service.productClass = 'vhost';
    var fn="getCustomerProductList";
    service = Commonjs.jsonToString(service);
    var params = Commonjs.getParams(fn,service);//获取参数

    $.ajax({
        datatype:"json",
        type:"POST",
        url: weburl,
        data:params,
        cache : false,
        success: function(data){
        	var proHtml = "";
        	var i = 0;
            productListParam = JSON.parse(data).data;
            console.log(productListParam);
            productListParam.forEach(function (item) {
				proHtml += '<li><a href="javascript:void(0);" data-target="J_txHostDom" ' +
					'onclick="changeProduct(' + (i++) + ')">' + item.productName + '</a></li>';
            });
            $('#productList').html(proHtml)
			changeProduct(0);
        }
    });
}

//产品切换
function changeProduct(index) {
    productIndex = index;
    $('#productList').find('a').removeClass('active');
    $($('#productList').find('a').get(productIndex)).addClass('active');

    getProductInfo();
}

function showServer() {
    //开通的服务：serverTypeListDiv
    var serverTypeHtml = "";
    var productParam = productView[productIndex].productParam;
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
            minNumber : productParam.webLinksMin,
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
            minNumber : productParam.webWidthMin,
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
            interval : (productParam.webFlowMax-productParam.webFlowMin),
            minNumber : productParam.webFlowMin,
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
            interval : (productParam.ftpDiskQuotaMax-productParam.ftpDiskQuotaMin),
            minNumber : productParam.ftpDiskQuotaMin,
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
            interval : (productParam.MSSQLSizeMax-productParam.MSSQLSizeMin),
            minNumber : productParam.MSSQLSizeMin,
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
            interval : (productParam.MSSQLLogSizeMax-productParam.MSSQLLogSizeMin),
            minNumber : productParam.MSSQLLogSizeMin,
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
            interval : (productParam.mySQLSizeMax-productParam.mySQLSizeMin),
            minNumber : productParam.mySQLSizeMin,
            maxNumber : productParam.mySQLSizeMax,
            showArea : 'mySQLSizeArea',
            curBandwidth : 'mySQLSizeShow',
            unit : 'Mb',
            clickfn : clickfn,
            block : 1
        });
	}
}

//获取产品信息
function getProductInfo(){
	console.log(productIndex);
	var service = {};
	service.productClass = productListParam[productIndex].productClass;
    service.productCode = productListParam[productIndex].productCode;
	service.chargeId = 1;
	var fn="getCloudProduct";
	service = Commonjs.jsonToString(service);
	var params = Commonjs.getParams(fn,service);//获取参数
	var result=Commonjs.ajax(weburl,params,false);
	if(result.result == "success"){
		if(result.data!=null || result.data.length>0){

			var view=result.data.productView;
			var list=result.data.promotionList;
			productView[productIndex] = view;

			if(view!=null && view!=""){
				console.log("+++++++++++++++++++++++++++++++++++++++++");
				$("#productCode").val(view.productCode);
				$("#maxBandwidth").val(view.productParam.maxBandwidth);
				$("#windowsMinSize").val(view.productParam.windowsMinSize);
				$("#otherMinSize").val(view.productParam.otherMinSize);
				maxSysDisk=view.productParam.sysDiskMaxSize;

				if(view.status=="Y"){
					$("#btnBuy").removeClass("disable");
					$("#btnBuy").attr("onclick","addUserCart()");
				}else{
					$("#remark").html(view.remark);
				}
                showServer();
			}

			if(list!=null && list.length>0){
				var html='';
				BaseForeach(list,function(i,item){
					var saleHtml='';
					var saleTitle='';
					var type='';
					if(isNotNull(item.saleValue)){
						saleHtml='<span class="badge salemsg">优惠</span>';
						if(item.applyType=="y")
							type='年';
						else if(item.applyType=="m")
							type='个月';

						if(item.saleType==1)
							saleTitle='购买'+item.applyTime+type+'赠送'+item.saleValue+'个月';
						else if(item.saleType==2)
							saleTitle='购买'+item.applyTime+type+'享'+item.saleValue+'折';
						else if(item.saleType==3)
							saleTitle='购买'+item.applyTime+type+'赠送'+item.saleValue+'天';
					}

					if(item.applyType=="m")
						html+='<dt class="time" time='+item.applyTime+' type='+item.applyType+' data-toggle="tooltip" data-placement="top" title="'+saleTitle+'">'+item.applyTime+'个月'+saleHtml+'</dt>';
					else if(item.applyType=="y")
						html+='<dt class="time pos-r" time='+item.applyTime+' type='+item.applyType+' data-toggle="tooltip" data-placement="top" title="'+saleTitle+'">'+item.applyTime+'年'+saleHtml+'</dt>';
				});
				$("#timelist").html(html);
				$(".time").eq(0).addClass("active");
				$("#curApplyTime").attr("time",$(".time").eq(0).attr("time"));
				$("#curApplyTime").attr("type",$(".time").eq(0).attr("type"));
				$("#discountInfo").html($(".config-box dl dt").eq(0).attr("title"));
			}
			$(".config-box dl dt").click(function(){
				$(this).addClass('active').siblings().removeClass('active');
				if($(this).attr("type")=="y")
					$("#curApplyTime").html($(this).attr("time")+"年");
				if($(this).attr("type")=="m")
					$("#curApplyTime").html($(this).attr("time")+"个月");
				$("#curApplyTime").attr("time",$(this).attr("time"));
				$("#curApplyTime").attr("type",$(this).attr("type"));
				$("#discountInfo").html($(this).attr("title"));
                getPrice();
			});

            getPrice();
		}
	}
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
	service.applyTime = $("#curApplyTime").attr("time");
	service.priceType = $("#curApplyTime").attr("type");
	service.num = $("#num-inp").val();

	var fn="getVHostPrice";
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
	var loginPwd=$("#loginPwd");
	var confirmPwd=$("#confirmPwd");
	if($("#szmm").hasClass("bs")){
		var preg = /(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,30}/;
		if(Commonjs.isEmpty(loginPwd.val())){
			$("#errorMsg").html("登录密码不能为空");
			loginPwd.focus();
			return false;
		}
		if(Commonjs.isEmpty(confirmPwd.val())){
			$("#errorMsg").html("确认密码不能为空");
			confirmPwd.focus();
			return false;
		}
		if(loginPwd.val() != confirmPwd.val()){
			$("#errorMsg").html("密码不一致");
			confirmPwd.focus();
			return false;
		}
		if(!preg.test(loginPwd.val())){
			$("#errorMsg").html("密码复杂度不够");
			loginPwd.focus();
			return false;
		}
	}

	var service = {};
	service.productCode=$("#productCode").val();
	service.applyTime=$("#curApplyTime").attr("time");
	service.priceType=$("#curApplyTime").attr("type");
	service.cartType="add";

	var instance={};
    instance.webLinks = $("#webLinksArea").val();
    instance.webWidth = $("#webWidthArea").val();
    instance.webFlow = $("#webFlowArea").val();
    instance.ftpDiskQuota = $("#ftpDiskQuotaArea").val();
    instance.MSSQLSize = $("#MSSQLSizeArea").val();
    instance.MSSQLLogSize = $("#MSSQLLogSizeArea").val();
    instance.mySQLSize = $("#mySQLSizeArea").val();
	service.productParam=Commonjs.jsonToString(instance);
	service.num=$("#num-inp").val();

	var fn="addUserCartVHost";
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
			window.location.href=realPath+"/usercenter/shopping/shoppinglist.html";
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
