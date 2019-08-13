var vmUserTransferList = new Vue({
    el: '#main-block',
    data: function(){
        return {
            activeName: 'first',
            dataForm: {
                id: -1,
                status: '全部',
                onlineStatus: '全部',
                serviceType: '全部',
                serviceEncryptionMethod: '全部',
                tableData: [],
                page: {
                    total: 0,
                    size: 10,
                    current: 1
                }
            },
            statusValue: {
                '全部': '',
                '停用': 0,
                '启用': 1
            },
            onlineStatusValue: {
                '全部': '',
                '离线': 'off',
                '在线': 'on',
                '未检测': 'noCheck',
                '不支持检测': 'notSupport'
            },
            serviceTypeValue: {
                '全部': '',
                '产品服务': 1,
                '工具服务': 2
            },
            methodValue: {
                '全部': '',
                'MD5': 'md5'
            },
            dialogFormVisibleDetail: false,
            info: {},
            form: {},
            rules: {
                serviceType: [
                    { required: true, message: '请选择服务类型', trigger: 'blur' }
                ],
                serviceCode: [
                    { required: true, message: '请输入服务编码', trigger: 'blur' },
                    { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
                ],
                serviceName: [
                    { required: true, message: '请输入服务名称', trigger: 'blur' },
                    { min: 1, max: 20, message: '长度在 1 到 10 个字符', trigger: 'blur' }
                ],
                serviceApiSecretKey: [
                    { required: true, message: '请输入接口密钥', trigger: 'blur' },
                    { min: 1, max: 255, message: '长度在 1 到 255 个字符', trigger: 'blur' }
                ],
                serviceApiUrl: [
                    { required: true, message: '请输入接口地址', trigger: 'blur' },
                    { min: 1, max: 255, message: '长度在 1 到 255 个字符', trigger: 'blur' }
                ],
                status: [
                    { required: true, message: '请选择可用状态', trigger: 'blur' }
                ]
            },
            tmpNew: {
                serviceType: '产品服务',
                serviceCode: '',
                serviceName: '',
                serviceApiUrl: '',
                serviceEncryptionMethod: 'MD5',
                serviceManageUrl: '',
                metadata: '',
                status: '停用'
            },
            dialogTitle: '新增服务',
            isNew: true
        };
    },
    methods: {
        /**
         * 格式化时间.
         * @param time
         * @returns {*|string}
         */
        formatTime: function(time) {
            return jsonDateTimeFormat(time);
        },
        /**
         * 我转让的：分页变化.
         * @param page
         */
        changePage: function (page) {
            var self = this;
            self.dataForm.tableData = [];
            this.dataForm.page.current = page;
            this.dataLoad();
        },

        /**
         * 加载数据.
         */
        dataLoad: function() {
            /*if (!hasFun('miniServiceQuery')) {
                return;
            }*/
            var self = this;
            var service = {
                size: self.dataForm.page.size,
                page: self.dataForm.page.current,
                status: self.statusValue[self.dataForm.status],
                serviceType: self.serviceTypeValue[self.dataForm.serviceType],
                serviceEncryptionMethod: self.methodValue[self.dataForm.serviceEncryptionMethod]
            };
            var fn="miniServiceQuery";
            service = Commonjs.jsonToString(service)
            var params = Commonjs.getParams(fn,service);
            Commonjs.ajaxSilence(weburl,params,true,function (data) {
                self.dataForm.tableData = data.data;
                self.dataForm.page.total = data.rows;
            }, function (data) {
                self.$message.error(data.msg);
            });
        },

        /**
         * 获取类型名称.
         * @param serviceType 服务类型.
         * @returns {string}
         */
        getServiceTypeName: function(serviceType) {
            var name = "";
            $.each(this.serviceTypeValue, function (key, value) {
                if (value == serviceType) {
                    name = key;
                }
            });
            return name;
        },

        /**
         * 获取状态名称.
         * @param status
         * @returns {string}
         */
        getStatusName: function(status) {
            var name = "";
            $.each(this.statusValue, function (key, value) {
                if (value == status) {
                    name = key;
                }
            });
            return name;
        },

        /**
         * 获取加密和方法名.
         * @param serviceEncryptionMethod
         * @returns {string}
         */
        getMethodName: function(serviceEncryptionMethod) {
            var name = "";
            $.each(this.methodValue, function (key, value) {
                if (value == serviceEncryptionMethod) {
                    name = key;
                }
            });
            return name;
        },

        /**
         * 新增服务.
         */
        newService: function () {
            this.form = $.extend({}, this.tmpNew);
            this.isNew = true;
            this.dialogFormVisibleDetail = true;
        },
        /**
         * 修改.
         */
        editService: function(row) {
            this.form = $.extend({}, row);
            this.form.serviceApiSecretKey = cloudEncrypt.decodeSession(this.form.serviceApiSecretKey);
            this.form.status = this.getStatusName(this.form.status);
            this.form.serviceType = this.getServiceTypeName(this.form.serviceType);
            this.form.serviceEncryptionMethod = this.getMethodName(this.form.serviceEncryptionMethod);
            this.isNew = false;
            this.dialogFormVisibleDetail = true;
        },
        /**
         * 保存.
         */
        save: function () {
            var self = this;
            this.$refs['ruleForm'].validate(function (valid){
                if (valid) {
                    var service = self.form;
                    service.serviceType = self.serviceTypeValue[service.serviceType];
                    service.status = self.statusValue[service.status];
                    service.serviceEncryptionMethod = self.methodValue[service.serviceEncryptionMethod];
                    service.serviceApiSecretKey = cloudEncrypt.encodeSession(service.serviceApiSecretKey);
                    var fn = self.isNew ? "miniServiceAdd" : "miniServiceEdit";
                    service = Commonjs.jsonToString(service);
                    var params = Commonjs.getParams(fn,service);
                    Commonjs.ajaxSilence(weburl,params,true,function (data) {
                        self.dataLoad();
                        self.$message.success('添加成功');
                        self.dialogFormVisibleDetail = false;
                    }, function (data) {
                        self.$message.error(data.msg);
                    });
                } else {
                    return false;
                }
            });
        },
        deleteService: function (row) {
            var self = this;

            this.$confirm('确定需要删除该记录吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(function (){
                var service = {
                    id: row.id
                };
                var fn = "mimiServiceDelete";
                service = Commonjs.jsonToString(service);
                var params = Commonjs.getParams(fn,service);
                Commonjs.ajaxSilence(weburl,params,true,function (data) {
                    self.dataLoad();
                    self.$message.success('删除成功');
                }, function (data) {
                    self.$message.error(data.msg);
                });

            }).catch(function(){
            });
        },
        /**
         * 进入第三方服务管理
         */
        goToMinServer: function (row) {
            var self = this;
            var service = {
                serviceCode: row.serviceCode
            };
            var fn = "mimiServicePublicManageToken";
            service = Commonjs.jsonToString(service);
            var params = Commonjs.getParams(fn,service);
            Commonjs.ajaxSilence(weburl,params,true,function (data) {
                window.open(row.serviceManageUrl + "?token=" + data.data.token);
            }, function (data) {
                self.$message.error(data.msg);
            });
        }
    },
    mounted: function () {
        this.dataLoad();
    }
});
