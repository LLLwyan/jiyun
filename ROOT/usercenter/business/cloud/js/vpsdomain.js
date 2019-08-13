var vm = new Vue({
    el: '#MainContentDIV',
    data: function () {
        return {
            instanceId: '',
            isEdition: false,
            loading: true,
            tableData: [],
            page: {
                total: 0,
                current: 1,
                size: 10
            },
            multipleSelection: [],
            publicIp:'',
            /**
             * 新增数据模板.
             */
            addTmp: {
                id : '',
                domainName: '',
                icpNo: ''
            },
            /**
             * 修改原数据缓存
             */
            editSource: {},
            testData: []
        }
    },
    methods: {
        /**
         * 加载查询记录.
         */
        loadInfo: function() {
            var self = this;
            self.loading = true;
            var service = {};
            service.vpsId = self.instanceId;
            service.page=this.page.current;
            service.pageSize=this.page.size;
            var fn="vpsDomainList";
            service = Commonjs.jsonToString(service);
            var params = Commonjs.getParams(fn,service);
            Commonjs.ajaxSilence(weburl,params,false,function (data) {
                console.log(data.pu)
                self.page.total = data.total;
                self.tableData = data.data;
                self.publicIp = data.publicIp;
                self.loading = false;
            }, null, true);
        },
        /**
         * 分页触发.
         * @param page
         */
        changePage: function (page) {
            var self = this;
            self.tableData = "[]";
            this.page.current = page;
            this.loadInfo();
        },
        /**
         * 重新加载数据
         *
         */
        reLoadData: function(){
            var self = this;
            self.tableData = [];
            self.loadInfo();
        },
        /**
         * 行选中.
         * @param val
         */
        handleSelectionChange: function (val) {
            this.multipleSelection = val;
        },

        /**
         * 页面添加行.
         */
        addPageLine: function () {
            this.tableData.push(Object.assign({}, this.addTmp));
        },
        /**
         * 删除行.
         * @param row
         */
        deleteLine: function(row) {
            var self = this;
            this.$confirm('确定需要该记录吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(function (){
                var service = {};
                service.vpsId = self.instanceId;
                service.domainNameList = [row.domainName];
                var fn="vpsDomainDel";
                service = Commonjs.jsonToString(service);
                var params = Commonjs.getParams(fn,service);
                Commonjs.ajaxSilence(weburl,params,false,function (data) {
                    if(data.result != "success"){
                        this.$notify.error({
                            title: '错误',
                            message: data.msg
                        });
                    }
                }, null, true);
                //console.log('单行删除的数据', row);
                self.reLoadData();

            }).catch(function(){
            });

        },
        /**
         * 批量删除选中项.
         */
        deleteChoose: function () {
            if (this.multipleSelection.length < 1) {
                this.$message.error('请先选择需要删除的记录');
                return;
            }
            var self = this;
            this.$confirm('确定需要删除所选中的记录吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(function (){
                console.log('选中的数据', self.multipleSelection);
                var domainList = [];
                self.multipleSelection.forEach(function (item) {
                    domainList.push(item.domainName);
                });

                var service = {};
                service.vpsId = self.instanceId;
                service.domainNameList = domainList;
                var fn="vpsDomainDel";
                service = Commonjs.jsonToString(service);
                var params = Commonjs.getParams(fn,service);
                Commonjs.ajaxSilence(weburl,params,false,function (data) {
                    if (data.result == 'success') {
                        self.$message.success('操作成功');
                    } else {
                        self.$message.error(data.msg);
                    }
                }, function (data) {
                    console.log(data);
                }, true);

                self.reLoadData();

            }).catch(function(){
            });

        },
        /**
         * 保存新增.
         * @param row
         */
        saveEditLine: function (row) {
            var self = this;
            this.$confirm('确定需要保存该记录吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(function (){
                var service = {};
                service.vpsId = self.instanceId;
                service.domainName = row.domainName;;
                var fn="vpsDomainAdd";
                service = Commonjs.jsonToString(service);
                var params = Commonjs.getParams(fn,service);
                Commonjs.ajaxSilence(weburl,params,false,function (data) {
                    if (data.result == 'success') {
                        self.$message.success('操作成功');
                        self.reLoadData();
                    } else {
                        self.$message.error(data.msg);
                    }
                }, function (data) {
                    self.$message.error(data.msg);
                }, true);

            }).catch(function(e){
                console.log(e)
            });
        },
        /**
         * 返回域名管理页
         */
        resReturn: function (index) {
            window.location.href= './resolution.html?domainName=' + this.domainName;
        }
    },
    mounted: function () {
        this.instanceId = request("iId");
        this.loadInfo();
        $('#btnBackList').on('click', function () {
            history.back(-1);
        })
    }
});
