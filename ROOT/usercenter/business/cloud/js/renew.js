var instanceId;
var hostType;
$(function(){
	instanceId=request("iId");
	queryUserService();
});

function queryUserService(){
	var service = {};
	service.instanceId=instanceId
	var fn="queryUserService";
	service = Commonjs.jsonToString(service)
	var params = Commonjs.getParams(fn,service);//获取参数
	Commonjs.ajaxTrue(weburl,params,querySuccess);
}

function querySuccess(data){
	if(data.data==null)
		return false;

	var view=data.data.view;
	vm.hostType = view.hostType;
	var info=data.data.info;
	var disklist=data.data.disklist;
	jointHtml(view,info,disklist);
	$("#productCode").val(view.productCode);

	getProductTime();
}

//续费
function renew(){
	var service = {};
	service.instanceId = instanceId;
	service.applyTime=$("#applyTime").val();
	service.priceType=$("#applyType").val();
	var fn="addUserCartRenew";
	service = Commonjs.jsonToString(service);
	var params = Commonjs.getParams(fn,service);//获取参数
	var result= Commonjs.ajax(weburl,params,false);
	if(result.result=="success"){
		window.parent.frames.location.href=realPath+"/usercenter/shopping/shoppinglist.html";
	}
}

//获取购买时长
function getProductTime(){
	var service = {};
	service.productCode = $("#productCode").val();
	service.chargeId = 2;
	var fn="getCloudProduct";
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
				var html='';
				var view=result.data.productView;
				var list=result.data.promotionList;

				if(list!="" && list.length>0){
					BaseForeach(list,function(i,item){
						var saleHtml='';
						var saleTitle='';
						var type='';
						if(isNotNull(item.saleValue)){
							saleHtml='<span class="badge salemsg">优惠</span>';
							if(item.applyType=="m")
								type='个月'
							else if(item.applyType=="y")
								type='年'

							if(item.saleType==1)
								saleTitle='购买'+item.applyTime+type+'赠送'+item.saleValue+'个月';
							if(item.saleType==2)
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
					$("#applyTime").val($(".time").eq(0).attr("time"));
					$("#applyType").val($(".time").eq(0).attr("type"));
					$("#discountInfo").html($(".config-time dt").eq(0).attr("title"));
					getRenewPrice(instanceId);
				}
				//选项
				$(".config-time dt").click(function(){
					$(this).addClass('active').siblings().removeClass('active');
					$("#applyTime").val($(this).attr("time"));
					$("#applyType").val($(this).attr("type"));
					$("#discountInfo").html($(this).attr("title"));
					getRenewPrice();
				});
			}
		}
	});
}

//获取续费价格
function getRenewPrice(){
	var service = {};
	service.instanceId = instanceId;
	service.applyTime=$("#applyTime").val();
	service.priceType=$("#applyType").val();
	var fn="getRenewPrice";
	service = Commonjs.jsonToString(service);
	var params = Commonjs.getParams(fn,service);//获取参数
	Commonjs.ajaxTrue(weburl,params,getRenewPriceSuccess,false);
}

function getRenewPriceSuccess(result){
	if(isNotNull(result.data)){
		$("#expiry").html("有效期"+result.data.expiry);
		$("#payPrice").html(result.data.payPrice+"元");
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
}

var vm = new Vue({
    el: '#MainContentDIV',
    data: function () {
        return {
        	form: {
                buyTime: '',
                moneyTotal: 0
			},
            hostType: 'hyperv',
            timeLine: [
                {
                    value: 1,
                    label: '1 个月'
                },
                {
                    value: 2,
                    label: '2 个月'
                },
                {
                    value: 3,
                    label: '3 个月'
                },
                {
                    value: 6,
                    label: '半年'
                },
                {
                    value: 12,
                    label: '1 年'
                },
                {
                    value: 24,
                    label: '2 年'
                },
                {
                    value: 36,
                    label: '3 年'
                },
                {
                    value: 48,
                    label: '4 年'
                },
                {
                    value: 60,
                    label: '5 年'
                }
            ],
            /**
			 * 华为续费可选时间线.
             */
            timeLineHuawei: [
                {
                    value: 1,
                    label: '1 个月'
                },
                {
                    value: 2,
                    label: '2 个月'
                },
                {
                    value: 3,
                    label: '3 个月'
                },
                {
                    value: 4,
                    label: '4 个月'
                },
                {
                    value: 5,
                    label: '3 个月'
                },
                {
                    value: 6,
                    label: '半年'
                },
                {
                    value: 7,
                    label: '7 个月'
                },
                {
                    value: 8,
                    label: '8 个月'
                },
                {
                    value: 9,
                    label: '9 个月'
                },
                {
                    value: 12,
                    label: '1 年'
                },
                {
                    value: 24,
                    label: '2 年'
                },
                {
                    value: 36,
                    label: '3 年'
                }
			],
            /**
             * 当前价格.
             */
            price:{
                discountPrice: 0.0,
                originalPrice: 0.0,
                tradePrice: 0.0
            }
		}
    },
    methods: {
        /**
		 * 提交续费操作.
         */
        submitRenew: function () {
			if (this.hostType == configParam.cloudType.hyperV) {
				renew();
			} else if (this.hostType == configParam.cloudType.aliyun || this.hostType == configParam.cloudType.huawei) {
                var self = this;
                if (self.form.moneyTotal <=0) {
                	vm.$message.error("请选择续费时长");
                	return;
				}
                var service = {};
                service.instanceId = instanceId;
                service.applyTime = self.form.buyTime;

                var fn = configParam.cloudType.huawei == this.hostType ? "huaweiRenewOrder" : "addUserCartRenewAliyun";
                service = Commonjs.jsonToString(service);
                var params = Commonjs.getParams(fn,service);//获取参数
                var result= Commonjs.ajax(weburl,params,false);
                if(result.result=="success"){
                    window.parent.frames.location.href=realPath+"/usercenter/shopping/shoppinglist.html";
                }
			}
        },
        /**
		 * 获取价格.
         */
        getPrice: function () {
            var self = this;
            self.form.moneyTotal = -1;
            var service = {};
            service.instanceId = instanceId;
            service.applyTime = self.form.buyTime;
            var fn= configParam.cloudType.aliyun == self.hostType ? "getRenewPriceAliyun" : "huaweiRenewPrice";
            service = Commonjs.jsonToString(service)
            var params = Commonjs.getParams(fn,service);
            Commonjs.ajaxSilence(weburl,params,true,function (data) {
                if (data.data.tradePrice) {
                    self.form.moneyTotal = data.data.tradePrice;
                    self.price = data.data;
                }
            }, null, true);
        }
	},
    mounted: function () {
    }
});
