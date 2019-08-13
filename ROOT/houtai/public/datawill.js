$(function(){
    rechargeCount();
    orderCount();
    serverCount();
});

//新增订单统计
function orderCount(){
    var fn="queryOrderCountByDatetime";
    var service = {};
    service.timeType='M';
    service = Commonjs.jsonToString(service)
    var params = Commonjs.getParams(fn,service);//获取参数
    var data=Commonjs.ajax(weburl,params,false);

    var countData = ['1','2','3','4','5','6','7'];
    var countValue = "[0, 0, 0, 0, 0, 0, 0]";
    if(data.result == "success"){
        countData = data.data.data;
        countValue = data.data.value;
    }
    <!-- 订单统计图 -->
    //var order = $('#orderCount');
    var order = document.getElementById("orderCountByDay");
    var orderChart = echarts.init(order);
    orderOption = null;
    orderOption = {
        title: {
            text: '订 单 统 计',
            left: 'center',
            top: '5%'
        },
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data:['新 增 订 单']
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            nameLocation: 'center',
            data: countData
        },
        yAxis: {
            type: 'value',
            axisLabel:{
                formatter: '{value}'
            },
            minInterval: 1,
            boundaryGap: [ 0, 0.1 ],
        },
        series: [
            {
                name:'数 量',
                type:'line',
                stack: '数 量',
                color: '#EF1C25',
                data: countValue
            }
        ]
    };
    orderChart.setOption(orderOption, true);
}

//充值金额统计
function rechargeCount(){
    var fn="queryRechargeCountByDatetime";
    var service = {};
    service.timeType='M';
    service = Commonjs.jsonToString(service)
    var params = Commonjs.getParams(fn,service);//获取参数
    var data=Commonjs.ajax(weburl,params,false);

    var countData = ['1','2','3','4','5','6','7'];
    var countValue = "[0, 0, 0, 0, 0, 0, 0]";
    if(data.result == "success"){
        countData = data.data.data;
        countValue = data.data.value;
    }
    <!-- 充值统计图 -->
    var recharge = document.getElementById("rechargeCountByDay");
    var rechargeChart = echarts.init(recharge);
    rechargeOption = null;
    rechargeOption = {
        title: {
            text: '充 值 统 计',
            left: 'center',
            top: '5%'
        },
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data:['充 值 统 计']
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            nameLocation: 'center',
            data: countData
        },
        yAxis: {
            type: 'value',
            axisLabel:{
                formatter: '{value}(元)'
            },
            minInterval: 1,
            boundaryGap: [ 0, 0.1 ],
        },
        series: [
            {
                name:'金 额',
                type:'line',
                stack: '金 额',
                color: 'green',
                data: countValue
            }
        ]
    };
    rechargeChart.setOption(rechargeOption, true);
}

//新开实例统计
function serverCount(){
    var countData = ['1','2','3','4','5','6','7'];
    var countValue = "[0, 0, 0, 0, 0, 0, 0]";


    var cdt = {};
    cdt.timeType = 'M';
    cdt = Commonjs.jsonToString(cdt)

    var fn = "queryServiceCountByDatetime";
    var serverParams = Commonjs.getParams(fn, cdt);//获取参数
    var serverData = Commonjs.ajax(weburl, serverParams, false);

    fn = "queryDomainCountByDatetime";
    var domainParams = Commonjs.getParams(fn, cdt);//获取参数
    var domainData = Commonjs.ajax(weburl, domainParams, false);

    fn = "queryWebCountByDatetime";
    var hostParams = Commonjs.getParams(fn, cdt);//获取参数
    var hostData = Commonjs.ajax(weburl, hostParams, false);

    var serverValue = countValue;
    if(serverData.result == "success"){
        countData = serverData.data.data;
        serverValue = serverData.data.value;
    }

    var domainValue = countValue;
    if(domainData.result == "success"){
        domainValue = domainData.data.value;
    }

    var hostValue = countValue;
    if(hostData.result == "success"){
        hostValue = hostData.data.value;
    }
    <!-- 实例统计图 -->
    var server = document.getElementById("serverCountByDay");
    var serverChart = echarts.init(server);
    serverOption = null;
    serverOption = {
        title: {
            text: '新 开 业 务 统 计',
            left: 'center',
            top: '5%'
        },
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data:['云主机','域&nbsp;名','空&nbsp;间']
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        /*toolbox: { //下载图片
            feature: {
                saveAsImage: {}
            }
        },*/
        xAxis: {
            type: 'category',
            boundaryGap: false,
            nameLocation: 'center',
            data: countData
        },
        yAxis: {
            type: 'value',
            axisLabel:{
                formatter: '{value}'
            },
            minInterval: 1,
            boundaryGap: [ 0, 0.1 ],
        },
        series: [
            {
                name:'云主机',
                type:'line',
                //stack: '个',
                //color: '#4571CA',
                data:serverValue
            },
            {
                name:'域  名',
                type:'line',
                //stack: '个',
                //color: '#4571CA',
                data:domainValue
            },
            {
                name:'空  间',
                type:'line',
                //stack: '个',
                //color: '#4571CA',
                data:hostValue
            }
        ]
    };
    serverChart.setOption(serverOption, true);
}
