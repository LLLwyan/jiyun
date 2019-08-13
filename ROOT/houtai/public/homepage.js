$(function(){
    queryAccountIncome();
    AccountAmount();
    getNewUserCount();
    NoIssueCount();
    noorder();
    productCount();
    var acountName = $.cookie('uat');
    $("#acountName").html("Hi，"+acountName);
    /*if( acountName == "admin" ){
        $("#gaiyao1").hide();
        $("#gaiyao2").show();
    }else{
        $("#gaiyao1").show();
        $("#gaiyao2").hide();
    }*/
});

//今日充值金额
function queryAccountIncome(){
    var fn="queryAccountIncome";
    var service = {};
    service.day='0';
    service = Commonjs.jsonToString(service)
    var params = Commonjs.getParams(fn,service);//获取参数
    Commonjs.ajaxTrue(weburl, params, function (data) {
        if(data.result=="success"){
            var Count=data.data.total;
            $('#rechargeCount').html(Count+"元");
            var Counts = '<span>'+ Count+'</span>元';
            $('#accountAmount').html(Counts);
        }
    });
    /*var data=Commonjs.ajax(weburl,params,false);
    if(data.result=="success"){
        var Count=data.data.total;
        $('#rechargeCount').html(Count+"元");
        var Counts = '<span>'+ Count+'</span>元';
        $('#accountAmount').html(Counts);
    }*/
}

//成交金额
function AccountAmount(){
    return;
    var fn="queryAccountAmount";
    var service = {};
    service.day='0';
    service.itemId='';//财务类型
    service = Commonjs.jsonToString(service)
    var params = Commonjs.getParams(fn,service);//获取参数
    var data=Commonjs.ajax(weburl,params,false);
    if(data.result=="success"){
    }
}
//今日新增会员
function getNewUserCount(){
    var fn="getAccountCount";
    var service = {};
    service.day='0';
    service = Commonjs.jsonToString(service)
    var params = Commonjs.getParams(fn,service);//获取参数
    Commonjs.ajaxTrue(weburl, params, function (data) {
        if(data.result=="success"){
            var Count="";
            $('#newuser').html("");
            Count +=  data.data + '个';
            $('#newuser').append(Count);
        }
    });
    /*var data=Commonjs.ajax(weburl,params,false);
    if(data.result=="success"){
        var Count="";
        $('#newuser').html("");
        Count +=  data.data + '个';
        $('#newuser').append(Count);
    }*/
}

//未处理工单
function NoIssueCount(){
    var fn="queryIssueCount";
    var service = {};
    service.state='1';
    service = Commonjs.jsonToString(service)
    var params = Commonjs.getParams(fn,service);//获取参数
    Commonjs.ajaxTrue(weburl, params, function (data) {
        if(data.result=="success"){
            var Count="";
            $('#noIssue').html("");
            Count = data.data;
            $('#noIssue').append(Count);
        }
    });
    /*var data=Commonjs.ajax(weburl,params,false);
    if(data.result=="success"){
        var Count="";
        $('#noIssue').html("");
        Count = data.data;
        $('#noIssue').append(Count);
    }*/
}

//未处理订单
function noorder(){
    var fn="queryOrderCount";
    var service = {};
    service.handleStatus='N';
    service = Commonjs.jsonToString(service)
    var params = Commonjs.getParams(fn,service);//获取参数
    Commonjs.ajaxTrue(weburl, params, function (data) {
        if(data.result=="success"){
            var Count="";
            $('#noorder').html("");
            Count =  data.data;
            $('#noorder').append(Count);
        }
    });
    /*var data=Commonjs.ajax(weburl,params,false);
    if(data.result=="success"){
        var Count="";
        $('#noorder').html("");
        Count =  data.data;
        $('#noorder').append(Count);
    }*/
}

//产品统计
function productCount(){
    var todayNewDomain=0;
    var todayNewServer=0;
    var todayNewVhost=0;
    var todayNewDiy=0;

    var countDomain=0;
    var countServer=0;
    var countVhost=0;
    var countDiy=0;

    var sevenNewDomain=0;
    var sevenNewServer=0;
    var sevenNewVhost=0;
    var sevenNewDiy=0;

    var sevenExpiredDomain=0;
    var sevenExpiredServer=0;
    var sevenExpiredVhost=0;
    var sevenExpiredDiy=0;


    var asyncCount = function() {
        var countproduct = parseInt(countDomain) + parseInt(countServer) + parseInt(countVhost) + parseInt(countDiy);
        var todaynewproduct = parseInt(todayNewDomain) + parseInt(todayNewServer) + parseInt(todayNewVhost) + parseInt(todayNewDiy);
        $('#today_new_product_count').html("");
        $('#today_new_product_count').append(parseInt(todayNewDomain) + parseInt(todayNewServer) + parseInt(todayNewVhost) + parseInt(todayNewDiy));
        $('#seven_new_product_count').html("");
        $('#seven_new_product_count').append(parseInt(sevenNewDomain) + parseInt(sevenNewServer) + parseInt(sevenNewVhost) + parseInt(sevenNewDiy));
        $('#seven_expired_product_count').html("");
        $('#seven_expired_product_count').append(parseInt(sevenExpiredDomain) + parseInt(sevenExpiredServer) + parseInt(sevenExpiredVhost) + parseInt(sevenExpiredDiy));

        $('#product_count').html("");
        $('#product_count').append(countproduct);
        $('#newproduct').html("");
        $('#newproduct').append('<span>' + todaynewproduct + '</span>个');
    };


    //域名产品
    //查询今天新开域名数量
    var fn="queryNewDomainCount";
    var service = {};
    service.day='0';
    service = Commonjs.jsonToString(service)
    var params = Commonjs.getParams(fn,service);//获取参数
    Commonjs.ajaxTrue(weburl, params, function (data) {
        if(data.result=="success"){
            todayNewDomain = data.data;
            $('#today_new_domain').html("");
            var todayDoamain =  data.data;
            $('#today_new_domain').append(todayDoamain);
        }
        asyncCount();
    });

    //查询7天内注册域名
    fn = "queryNewDomainCount";
    service = {};
    service.day = '7';
    service = Commonjs.jsonToString(service)
    params = Commonjs.getParams(fn,service);//获取参数
    Commonjs.ajaxTrue(weburl, params, function (data) {
        if(data.result=="success"){
            sevenExpiredDomain = data.data;
            $('#seven_expired_domain').html("");
            var sevenDoamain =  data.data;
            $('#seven_expired_domain').append(sevenDoamain);
        }
        asyncCount();
    });


    //查询7天过期域名
    fn="queryExpiryDomainCount";
    service = {};
    service.day='7';
    service = Commonjs.jsonToString(service)
    params = Commonjs.getParams(fn,service);//获取参数
    Commonjs.ajaxTrue(weburl, params, function (data) {
        if(data.result=="success"){
            sevenNewDomain = data.data;
            $('#seven_new_domain').html("");
            var sevenEDoamain =  data.data;
            $('#seven_new_domain').append(sevenEDoamain);
        }
        asyncCount();
    });


    //查询所有域名产品数量
    fn="queryNewDomainCount";
    service = {};
    service.day='-1';
    service = Commonjs.jsonToString(service)
    params = Commonjs.getParams(fn,service);//获取参数
    Commonjs.ajaxTrue(weburl, params, function (data) {
        if(data.result=="success"){
            countDomain = data.data;
            $('#domain_count').html("");
            var countDoamain =  data.data;
            $('#domain_count').append(countDoamain);
        }
        asyncCount();
    });


    //主机产品
    //查询今天新开主机数量
    fn="queryNewServiceCount";
    service = {};
    service.day='0';
    service = Commonjs.jsonToString(service)
    params = Commonjs.getParams(fn,service);//获取参数
    Commonjs.ajaxTrue(weburl, params, function (data) {
        if(data.result=="success"){
            todayNewServer = data.data;
            $('#today_new_server').html("");
            var todayService =  data.data;
            $('#today_new_server').append(todayService);
        }
        asyncCount();
    });


    //查询7天内开通主机数量
    fn="queryNewServiceCount";
    service = {};
    service.day='7';
    service = Commonjs.jsonToString(service)
    params = Commonjs.getParams(fn,service);//获取参数
    Commonjs.ajaxTrue(weburl, params, function (data) {
        if(data.result=="success"){
            sevenNewServer = data.data;
            $('#seven_new_server').html("");
            var sevenService =  data.data;
            $('#seven_new_server').append(sevenService);
        }
        asyncCount();
    });


    //查询7天内过期主机数量
    fn="queryNewServiceCount";
    service = {};
    service.day='7';
    service = Commonjs.jsonToString(service)
    params = Commonjs.getParams(fn,service);//获取参数
    Commonjs.ajaxTrue(weburl, params, function (data) {
        if(data.result=="success"){
            sevenExpiredServer = data.data;
            $('#seven_expired_server').html("");
            var ExpiredsevenService =  data.data;
            $('#seven_expired_server').append(ExpiredsevenService);
        }
        asyncCount();
    });

    //查询7天内过期主机数量
    fn="queryExpiryServiceCount";
    service = {};
    service.day='-1';
    service = Commonjs.jsonToString(service)
    params = Commonjs.getParams(fn,service);//获取参数
    Commonjs.ajaxTrue(weburl, params, function (data) {
        if(data.result=="success"){
            sevenExpiredServer = data.data;
            $('#seven_expired_server').html("");
            var ExpiredsevenService =  data.data;
            $('#seven_expired_server').append(ExpiredsevenService);
        }
        asyncCount();
    });


    //查询主机数量
    fn="queryNewServiceCount";
    service = {};
    service.day='-1';
    service = Commonjs.jsonToString(service)
    params = Commonjs.getParams(fn,service);//获取参数
    Commonjs.ajaxTrue(weburl, params, function (data) {
        if(data.result=="success"){
            countServer = data.data;
            var ExpiredsevenService="";
            $('#server_count').html("");
            ExpiredsevenService =  data.data;
            $('#server_count').append(ExpiredsevenService);
        }
        asyncCount();
    });


    //查询虚拟主机数量
    fn="queryNewVhostState";
    service = {};
    service = Commonjs.jsonToString(service)
    params = Commonjs.getParams(fn,service);//获取参数
    Commonjs.ajaxTrue(weburl, params, function (data) {
        if(data.result=="success"){
            countVhost = data.data.all;
            todayNewVhost = data.data.openToday;
            sevenNewVhost = data.data.openSevenDay;
            sevenExpiredVhost = data.data.expireSevenDay;
            $('#today_new_vhost').html(todayNewVhost);
            $('#seven_new_vhost').html(sevenNewVhost);
            $('#seven_expired_vhost').html(sevenExpiredVhost);
            $('#server_vhost').html(countVhost);
        }
        asyncCount();
    });


    //查询自定义产品数量
    fn="queryNewDiyState";
    service = {};
    service = Commonjs.jsonToString(service)
    params = Commonjs.getParams(fn,service);//获取参数
    Commonjs.ajaxTrue(weburl, params, function (data) {
        if(data.result=="success"){
            countDiy = data.data.all;
            todayNewDiy = data.data.openToday;
            sevenNewDiy = data.data.openSevenDay;
            sevenExpiredDiy = data.data.expireSevenDay;
            $('#today_new_diy').html(countDiy);
            $('#seven_new_diy').html(todayNewDiy);
            $('#seven_expired_diy').html(sevenNewDiy);
            $('#server_diy').html(sevenExpiredDiy);
        }
    });
}
