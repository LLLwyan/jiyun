var vm = new Vue({
    el: '#main-block',
    data: function(){
        return {
            currentDate: new Date(),
            manufacturers : [
                {
                    logo: '../../img/yun_logo_winiis.png',
                    title: '慧林云控',
                    link: 'config1.html',
                    funCode: 'queryProCloud'
                },
                {
                    logo: '../../img/yun_logo_aliyun.png',
                    title: '阿里云',
                    link: 'aliyun_config.html',
                    funCode: 'saveAliyunConfig'
                },
                {
                    logo: '../../img/yun_logo_huawei.png',
                    title: '华为云',
                    link: 'huawei_config.html',
                    funCode: 'saveHuaweiConfig'
                }
            ]
        };
    },
    methods: {
        goClick: function (item) {
            window.location.href = item.link;
        }
    },
    mounted:function () {

    }
});
