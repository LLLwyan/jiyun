var vmUserTransferList = new Vue({
    el: '#main-block',
    data: function(){
        return {
            activeName: 'first',
            dataForm: {
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
            var self = this;
            var service = {
                size: self.dataForm.page.size,
                page: self.dataForm.page.current,
                status: self.statusValue[self.dataForm.status]
            };
            var fn="bizTransferAdminList";
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
         * 显示详情.
         * @param row
         */
        showInfo: function (row) {
            this.info = Object.assign({}, row);
            this.dialogFormVisibleDetail = true;
        }
    },
    mounted: function () {
        this.dataLoad();
    }
});
