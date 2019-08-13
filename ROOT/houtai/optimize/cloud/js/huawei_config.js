var vm = new Vue({
    el: '#main-block',
    data: function(){
        return {
            form : {
                productName: '华为云',
                premium: 5,
                statusFlag: false,
                resetLimit: 1,
                timeSet: [
                    {
                        type: 1,
                        name: '购买',
                        month1: true,
                        month2: true,
                        month3: true,
                        halfYear: true,
                        year1:true,
                        year2:true,
                        year3:true,
                        year4:true,
                        year5:true
                    }
                ],
                prjList: [],
                premiumRenew: 5,
                renewRightNow: false,
                premiumUpgrade: 5,
                upgradeRightNow: false
            },
            rules:{
                productName: [
                    { required: true, message: '请输入名称', trigger: 'blur' },
                    { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
                ],
                premium: [
                    { required: true, message: '请输入新购溢价率', trigger: 'blur' }
                ],
                statusFlag: [
                    { required: true, message: '请选择状态', trigger: 'blur' }
                ],
                resetLimit: [
                    { required: true, message: '请选择状态', trigger: 'blur' }
                ],
                premiumRenew: [
                    { required: true, message: '请选择续费是否立即开通选项', trigger: 'blur' }
                ],
                renewRightNow: [
                    { required: true, message: '请输入续费溢价率', trigger: 'blur' }
                ],
                premiumUpgrade: [
                    { required: true, message: '请选择升级是否立即开通选项', trigger: 'blur' }
                ],
                upgradeRightNow: [
                    { required: true, message: '请输入续费溢价率', trigger: 'blur' }
                ]
            },
            huaweiCostUrl: 'https://www.huaweicloud.com/pricing.html#/ecs',
            dialogFormVisible: false,
            apiForm: {
                huaweiAccount: '',
                huaweiPassword: '',
                huaweiAccountId: ''
            }
        }
    },
    methods: {
        saveConfig: function () {
            this.$refs['ruleForm'].validate(function(valid){
                if(valid) {
                    var service = {};
                    service.productName = vm.form.productName;
                    service.premium = vm.form.premium;
                    service.status = vm.form.statusFlag ? 1 : 2;
                    service.resetLimit = vm.form.resetLimit;
                    service.prjList = vm.form.prjList;
                    service.premiumRenew = vm.form.premiumRenew;
                    service.renewRightNow = vm.form.renewRightNow ? 1 : 2;
                    service.premiumUpgrade = vm.form.premiumUpgrade;
                    service.upgradeRightNow = vm.form.upgradeRightNow ? 1 : 2;
                    var fn="saveHuaweiConfig";
                    service = Commonjs.jsonToString(service)
                    var params = Commonjs.getParams(fn,service);//获取参数
                    Commonjs.ajaxTrue(weburl,params,function (data) {
                        vm.$message.success("修改成功");
                    });
                }
            });
        },
        seeCost: function () {
            window.open(this.huaweiCostUrl);
        },
        getConfig: function () {
            var service = {};
            var fn="getHuaweiConfig";
            service = Commonjs.jsonToString(service)
            var params = Commonjs.getParams(fn,service);//获取参数
            Commonjs.ajaxTrue(weburl,params,function (data) {
                if (data.data && data.data.productName) {
                    vm.form.productName = data.data.productName;
                    vm.form.premium = data.data.productParam.premium;
                    vm.form.statusFlag = data.data.status == 1;
                    vm.form.resetLimit = data.data.productParam.resetLimit;
                    vm.form.prjList = data.data.productParam.prjList;
                    vm.form.premiumRenew = data.data.productParam.premiumRenew;
                    vm.form.renewRightNow = data.data.productParam.renewRightNow == 1;
                    vm.form.premiumUpgrade = data.data.productParam.premiumUpgrade;
                    vm.form.upgradeRightNow = data.data.productParam.upgradeRightNow == 1;
                }
            });
        },
        /**
         * 新增.
         */
        addLine: function () {
            var row = {
                areaName: '',
                areaId: '',
                prjId:''
            };
            this.form.prjList.push(row);
        },
        /**
         * 删除行.
         * @param index
         */
        delLine: function (index) {
            var data = [];
            for (var i = 0; i < this.form.prjList.length; i++) {
                if (i != index) {
                    data.push(this.form.prjList[i]);
                }
            }
            this.form.prjList = data;
        },
        /**
         * 华为云接口设置窗口显示.
         */
        showApiEdit: function () {
            var self = this;
            var service = {
                startFrom: 'huawei'
            };
            var fn="getDicParamApi";
            service = Commonjs.jsonToString(service);
            var params = Commonjs.getParams(fn,service);//获取参数
            Commonjs.ajaxTrue(sysurl,params,function (data) {
                $.each(data.data, function (index, item) {
                    self.apiForm[item.paramName] = Commonjs.isEmpty(item.paramValue) ? "" : cloudEncrypt.decodeSession(item.paramValue);
                });
                self.dialogFormVisible = true;
            });
        },

        /**
         * 保存接口设置.
         */
        saveApiSet: function () {
            var self = this;
            var request = [
                {paramName: 'huaweiAccount', paramValue: cloudEncrypt.encodeSession(this.apiForm.huaweiAccount)},
                {paramName: 'huaweiPassword', paramValue: cloudEncrypt.encodeSession(this.apiForm.huaweiPassword)},
                {paramName: 'huaweiAccountId', paramValue: cloudEncrypt.encodeSession(this.apiForm.huaweiAccountId)}
            ];

            var fn="uptDicParamApi";
            var service = Commonjs.jsonToString(request);
            var params = Commonjs.getParams(fn, service);
            Commonjs.ajaxTrue(sysurl,params,function () {
                self.$message.success('保存接口设置成功');
                self.dialogFormVisible = false;
            });
        }
    },
    mounted:function () {
        this.getConfig();
    }
});
