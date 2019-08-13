var vmUserTransferList = new Vue({
    el: '#MainContentDIV',
    data: function(){
        return {
            activeName: 'first',
            fromMe: {
                status: '全部',
                tableData: [],
                page: {
                    total: 0,
                    size: 10,
                    current: 1
                }
            },
            toMe: {
                status: '全部',
                tableData: [],
                page: {
                    total: 0,
                    size: 10,
                    current: 1
                }
            },
            statusValue: {
                '全部': '',
                '交易中': 0,
                '已完成': 1,
                '已取消': 2,
                '已过期': 3
            },
            dialogFormVisible: false,
            form: {
                safeCode: ''
            },
            data: {
                fromUserName: '',
                createTime: ''
            },
            rules: {
                safeCode: [
                    { required: true, message: '请输入交易安全码', trigger: 'blur' },
                ]
            },
            dialogFormVisibleDetail: false,
            info: {
                fromUserName: '',
                toUserName: '',
                createTime: '',
                productTypeName: '',
                bizName: '',
                detail: [],
                fromUserId: 0,
                toUserId: 0
            }
        };
    },
    methods: {
        /**
         * tab切换.
         * @param tab
         * @param event
         */
        handleClick: function (tab, event) {
            if (this.activeName == 'first') {
                this.fromMeDataLoad();
            } else if (this.activeName == 'second') {
                this.toMeDataLoad();
            }
        },
        /**
         * 格式化时间.
         * @param time
         * @returns {*|string}
         */
        formatTime: function(time) {
            return jsonDateTimeFormat(time);
        },
        /**
         * 取消交易.
         * @param row
         */
        cancelDeal: function(row, type) {
            var self = this;
            this.$confirm('确定需要取消当前业务转让交易吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(function (){
                var service = {};
                service.id = row.id;
                var fn="bizTransferCancelDeal";
                service = Commonjs.jsonToString(service)
                var params = Commonjs.getParams(fn,service);
                Commonjs.ajaxSilence(weburl,params,true,function (data) {
                    self.$message.success("取消成功");
                    if (type == 1) {
                        self.fromMeDataLoad();
                    } else {
                        self.toMeDataLoad();
                    }
                }, function (data) {
                    self.$message.error(data.msg);
                });
            }).catch(function(){
            });
        },
        /**
         * 我转让的：分页变化.
         * @param page
         */
        fromMeChangePage: function (page) {
            var self = this;
            self.fromMe.tableData = [];
            this.fromMe.page.current = page;
            this.fromMeDataLoad();
        },

        /**
         * 我转让的：数据加载.
         */
        fromMeDataLoad: function () {
            var self = this;
            var service = {
                size: self.fromMe.page.size,
                page: self.fromMe.page.current,
                status: self.statusValue[self.fromMe.status],
                direct: 1
            };
            var fn="bizTransferUserList";
            service = Commonjs.jsonToString(service)
            var params = Commonjs.getParams(fn,service);
            Commonjs.ajaxSilence(weburl,params,true,function (data) {
                self.fromMe.tableData = data.data;
                self.fromMe.page.total = data.rows;
            }, function (data) {
                self.$message.error(data.msg);
            });
        },

        /**
         * 转让给我的：分页变化.
         */
        toMeChangePage: function(page) {
            var self = this;
            self.toMe.tableData = [];
            this.toMe.page.current = page;
            this.toMeDataLoad();
        },

        /**
         * 转让给我的：数据加载.
         */
        toMeDataLoad: function () {
            var self = this;
            var service = {
                size: self.toMe.page.size,
                page: self.toMe.page.current,
                status: self.statusValue[self.toMe.status],
                direct: 2
            };
            var fn="bizTransferUserList";
            service = Commonjs.jsonToString(service)
            var params = Commonjs.getParams(fn,service);
            Commonjs.ajaxSilence(weburl,params,true,function (data) {
                self.toMe.tableData = data.data;
                self.toMe.page.total = data.rows;
            }, function (data) {
                self.$message.error(data.msg);
            });
        },
        /**
         * 接收触发.
         * @param row
         */
        acceptDeal: function (row) {
            this.data = Object.assign({}, row);
            this.dialogFormVisible = true;
        },
        /**
         * 接收确认.
         */
        acceptDealSure: function () {
            var self = this;
            this.$refs['pushForm'].validate(function(valid){
                if (valid) {
                    var service = {
                        id: self.data.id,
                        safeCode: self.form.safeCode
                    };
                    var fn="bizTransferAcceptDeal";
                    service = Commonjs.jsonToString(service)
                    var params = Commonjs.getParams(fn,service);
                    Commonjs.ajaxSilence(weburl,params,true,function (data) {
                        self.$message.success("接收成功");
                        self.dialogFormVisible = false;
                        self.toMeDataLoad();
                    }, function (data) {
                        self.$message.error(data.msg);
                    });
                }
            });
        },

        /**
         * 显示详情.
         * @param row
         */
        showInfo: function (row) {
            this.info = Object.assign({}, row);
            this.dialogFormVisibleDetail = true;
        }
    },
    mounted: function () {
        this.fromMeDataLoad();
    }
});
