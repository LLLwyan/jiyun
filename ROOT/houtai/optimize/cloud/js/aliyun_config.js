var vm = new Vue({
    el: '#main-block',
    data: function(){
        return {
            form : {
                productName: '阿里云',
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
                ]
            },
            rules:{
                productName: [
                    { required: true, message: '请输入名称', trigger: 'blur' },
                    { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
                ],
                premium: [
                    { required: true, message: '请输入溢价率', trigger: 'blur' }
                ],
                statusFlag: [
                    { required: true, message: '请选择状态', trigger: 'blur' }
                ],
                resetLimit: [
                    { required: true, message: '请选择状态', trigger: 'blur' }
                ]
            },
            apiForm: {
                aliyunAccessKeyId: '',
                aliyunAccessKeySecret: ''
            },
            aliyunCostUrl: 'https://tco.aliyun.com/tco/ecs/calculator?spm=5176.2017081514.0.0.7aad1c57ewzZmP',
            dialogFormVisible: false
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
                    var fn="saveAliyunConfig";
                    service = Commonjs.jsonToString(service)
                    var params = Commonjs.getParams(fn,service);//获取参数
                    Commonjs.ajaxTrue(weburl,params,function (data) {
                        vm.$message.success("修改成功");
                    });
                }
            });
        },
        seeCost: function () {
            window.open(this.aliyunCostUrl);
        },
        getConfig: function () {
            var service = {};
            var fn="getAliyunConfig";
            service = Commonjs.jsonToString(service)
            var params = Commonjs.getParams(fn,service);//获取参数
            Commonjs.ajaxTrue(weburl,params,function (data) {
                if (data.data && data.data.productName) {
                    vm.form.productName = data.data.productName;
                    vm.form.premium = data.data.productParam.premium;
                    vm.form.statusFlag = data.data.status == 1;
                    vm.form.resetLimit = data.data.productParam.resetLimit;
                }
            });
        },
        /**
         * 显示接口设置窗口.
         */
        showApiEdit: function () {
            var self = this;
            var service = {
                startFrom: 'aliyun'
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
                {paramName: 'aliyunAccessKeyId', paramValue: cloudEncrypt.encodeSession(this.apiForm.aliyunAccessKeyId)},
                {paramName: 'aliyunAccessKeySecret', paramValue: cloudEncrypt.encodeSession(this.apiForm.aliyunAccessKeySecret)}
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
