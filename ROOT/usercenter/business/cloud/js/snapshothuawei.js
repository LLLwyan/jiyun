var vm = new Vue({
    el: '#MainContentDIV',
    data: function () {
        return {
            instanceId: '',
            diskId: '',
            hostType: 'hyperv',
            tableData: []
        }
    },
    methods: {
        /**
         * 快照列表：华为.
         */
        snapshotList: function (object) {
            var diskId = $(object).attr('data-disk-id');
            var self = this;
            self.tableData = [];
            var service = {};
            service.instanceId = self.instanceId;
            service.diskId=self.diskId;
            var fn = 'huaweiListSnapshot';
            service = Commonjs.jsonToString(service);
            var params = Commonjs.getParams(fn,service);//获取参数
            Commonjs.ajaxTrue(weburl,params,function (data) {
                self.tableData = data.data;
            },false);
        },
        /**
         * 删除快照.
         * @param row
         */
        deleteSnapshot: function (row) {
            var self = this;
            self.$confirm('确定需要删除快照吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(function (){
                var service = {};
                service.instanceId = self.instanceId;
                service.diskId=self.diskId;
                service.id = row.id;
                var fn = 'huaweiDeleteSnapshot';
                service = Commonjs.jsonToString(service);
                var params = Commonjs.getParams(fn,service);//获取参数
                Commonjs.ajaxTrue(weburl,params,function () {
                    vm.$message.success('删除成功');
                    location.reload();
                },false);
            }).catch(function(){
            });
        },
        /**
         * 回滚快照.
         * @param row
         */
        rollbackSnapshot: function (row) {
            var self = this;
            self.$confirm('确定需要将数据回滚到此快照吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(function (){
                var service = {};
                service.instanceId = vm.instanceId;
                service.diskId=self.diskId;
                service.id = row.id;
                var fn = 'huaweiRollbackSnapshot';
                service = Commonjs.jsonToString(service);
                var params = Commonjs.getParams(fn,service);//获取参数
                Commonjs.ajaxTrue(weburl,params,function () {
                    vm.$message.success('回滚成功');
                    location.reload();
                },false);
            }).catch(function(){
            });
        }
    },
    mounted: function () {
        this.instanceId=request("dId");
        this.diskId=request("diskId");
        this.hostType=request("hostType");
        this.snapshotList();
    }
});
