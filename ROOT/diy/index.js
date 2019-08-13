var minSysDisk = 20;
var minDataDisk = 0;
var maxDataDisk = 2000;
var minBandwidth = 1;
var status;
var remark;
var productListParam = [];
var productIndex = 0;
var productView = [];

var subClass = "";

var clickfn = function(){
    getPrice();
};

$(document).ready(function(){
    subClass = request("subClass");
    if ('' == subClass) {
        Commonjs.alert('分类参数不正确',false);
        return;
    }

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
    service.productClass = 'diy';
    service.subClass = subClass;
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

//获取产品信息
function getProductInfo(){
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
				$("#productCode").val(view.productCode);
				$("#maxBandwidth").val(view.productParam.maxBandwidth);
				$("#windowsMinSize").val(view.productParam.windowsMinSize);
				$("#otherMinSize").val(view.productParam.otherMinSize);
				$('#proDesc').html(view.productDetail.replace(/\n/g, "<br />"));
				maxSysDisk=view.productParam.sysDiskMaxSize;

				if(view.status=="Y"){
					$("#btnBuy").removeClass("disable");
					$("#btnBuy").attr("onclick","addUserCart()");
				}else{
					$("#remark").html(view.remark);
				}
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
	service.productCode = $("#productCode").val();
	service.applyTime = $("#curApplyTime").attr("time");
	service.priceType = $("#curApplyTime").attr("type");
	service.num = $("#num-inp").val();

	var fn="getDiyPrice";
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
	service.applyTime=$("#curApplyTime").attr("time");
	service.priceType=$("#curApplyTime").attr("type");
	service.cartType="add";

	var instance={};
	service.productParam=Commonjs.jsonToString(instance);
	service.num=$("#num-inp").val();

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
