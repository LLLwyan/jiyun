var instanceId;
$(function(){
	instanceId=request("iId");
	//滑块
    new SlideBar({
        actionBlock : 'action-block',
        actionBar : 'action-bar',
        slideBar : 'scroll-bar',
        barLength : 300,
        interval : 50,
        maxNumber : 200,
        showArea : 'showArea',
        clickfn : clickfn
    });
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
	var info=data.data.info;
	var disklist=data.data.disklist;
    vm.hostType = view.hostType;
    vm.serviceInfo = data.data;
	jointHtml(view,info,disklist);
	$("#hostType").val(view.hostType);
	$("#productCode").val(view.productCode);

    if (configParam.cloudType.huawei == vm.hostType) {
        vm.loadHuawei();
    }
}

var clickfn = function(){
	var old=$("#old_bandWith").html();
	var new_bandWith=$("#showArea").val();
	if(parseInt(new_bandWith)<=parseInt(old)){
		$("#showArea").val(parseInt(old)+1);
	}
	getResizeBandwidthPrice();
};

function getResizeBandwidthPrice(){
	var service = {};
	service.hostType=$("#hostType").val();
	service.instanceId = instanceId;
	service.bandwidth=$("#showArea").val();
	var fn = configParam.cloudType.huawei == vm.hostType ? "huaweiReiszeBandwidthPrice" : "getResizeBandwidthPrice";
	service = Commonjs.jsonToString(service);
	var params = Commonjs.getParams(fn,service);//获取参数
	//Commonjs.ajaxTrue(weburl,params,getPriceSuccess,false);
    Commonjs.ajaxSilence(weburl,params,true,function (data) {
        if (configParam.cloudType.huawei == vm.hostType) {
			if (data.result == 'success') {
                $("#bandwidthprice").html(data.data.tradePrice+"元");
			}
        } else {
            getPriceSuccess();
		}
    }, null, true);
}

function getPriceSuccess(data){
	$("#bandwidthprice").html(data.data+"元");
}

//添加购物车
function confirmUpgrade(){
	var service = {};
	service.instanceId= instanceId;
	service.productCode=$("#productCode").val();
	service.bandwidth=$("#showArea").val();
	var fn = configParam.cloudType.huawei == vm.hostType ? "huaweiReiszeBandWidthOrder" : "addUserCartResizeBandwidth";
	service = Commonjs.jsonToString(service);
	var params = Commonjs.getParams(fn,service);//获取参数
	Commonjs.ajaxTrue(weburl,params,UpgradeSuccess,false);
}

function UpgradeSuccess(data){
	window.parent.frames.location.href=realPath+"/usercenter/shopping/shoppinglist.html";
}

var vm = new Vue({
    el: '#MainContentDIV',
    data: function() {
        return {
        	hostType: '',
			serviceInfo: {}
		}
    },
    methods: {
        loadHuawei: function () {
        	//滑快重新定义
            new SlideBar({
                actionBlock : 'action-block',
                actionBar : 'action-bar',
                slideBar : 'scroll-bar',
                barLength : 300,
                interval : 500,
                maxNumber : 2000,
                showArea : 'showArea',
                clickfn : clickfn
            });

            $('#bandwidth').html(this.serviceInfo.view.extendInfo.orderInfo.internetMaxBandwidthOut);
        }
    },
    mounted: function () {
    }
});
