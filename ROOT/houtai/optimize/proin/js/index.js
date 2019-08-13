var vm = new Vue({
    el: '#main-block',
    data: function(){
        return {
            domain: {
                error: '请上传文件',
                scanTable: [],
                scanFlag: false,
                selected: []
            },
            cloud: {
                error: '请上传文件',
                scanTable: [],
                scanFlag: false,
                selected: []
            },
            vHost: {
                error: '请上传文件',
                scanTable: [],
                scanFlag: false,
                selected: []
            }
        };
    },
    methods: {
        /**
         * 上传成功.
         * @param response
         * @param file
         * @param fileList
         */
        domainUploadSuccess: function (response, file, fileList) {
            if (response.result == 'success') {
                this.domain.scanFlag = true;
                this.domain.scanTable = response.data;
            } else {
                this.domain.scanFlag = false;
                this.domain.error = response.msg;
            }
        },
        /**
         * 域名行是否可选.
         * @param row
         * @param index
         * @returns {*}
         */
        domainSelectAble: function (row, index) {
            return row.refer == 1;
        },
        /**
         * 时间格式化.
         * @param time
         * @returns {*|string}
         */
        formatTime: function (time) {
            return jsonDateFormat({time: time});
        },
        /**
         * 域名导入.
         */
        importDomain: function () {
            if (this.domain.selected.length < 1) {
                this.$message.error('没有选中项');
                return;
            }

            var self = this;
            var request = {domains: this.domain.selected};

            var fn="proInDomainSave";
            var service = Commonjs.jsonToString(request);
            var params = Commonjs.getParams(fn, service);
            Commonjs.ajaxSilence(weburl, params, true, function (response) {
                self.$message.success('导入已完成');
                var newData = [];
                for (var i=0; i<self.domain.scanTable.length; i++) {
                    var item = self.domain.scanTable[i];
                    for (var j=0; j<response.data.length; j++) {
                        var itemSaved = response.data[j];
                        if (item.domain == itemSaved.domain) {
                            item = itemSaved;
                        }
                    }
                    newData.push(item);
                }
                self.domain.scanTable = newData;
            }, function () {
                self.$message.error("导入异常");
            });
        },
        /**
         * 删除域名.
         */
        deleteDomain: function () {
            if (this.domain.selected.length < 1) {
                this.$message.error('没有选中项');
                return;
            }
            var selectedDomain = [];
            for (var i=0; i < this.domain.selected.length; i++) {
                selectedDomain.push(this.domain.selected[i].domain);
            }

            var newTable = [];
            for (var j=0; j < this.domain.scanTable.length; j++) {
                if ($.inArray(this.domain.scanTable[j].domain, selectedDomain) < 0) {
                    newTable.push(this.domain.scanTable[j]);
                }
            }
            this.domain.scanTable = newTable;
        },
        /**
         * 清除不可导入.
         */
        clearDomain: function () {
            var newTable = [];
            for (var j=0; j < this.domain.scanTable.length; j++) {
                if (this.domain.scanTable[j].refer == 1) {
                    newTable.push(this.domain.scanTable[j]);
                }
            }
            this.domain.scanTable = newTable;
        },
        /**
         * 选中.
         */
        handleSelectionChangeDomain: function (rows) {
            this.domain.selected = rows;
        },


        /**
         * 云主机上传成功.
         * @param response
         * @param file
         * @param fileList
         */
        cloudUploadSuccess: function (response, file, fileList) {
            if (response.result == 'success') {
                this.cloud.scanFlag = true;
                this.cloud.scanTable = response.data;
            } else {
                this.cloud.scanFlag = false;
                this.cloud.error = response.msg;
            }
        },

        /**
         * 选中云主机.
         * @param rows
         */
        handleSelectionChangeCloud: function (rows) {
            this.cloud.selected = rows;
        },

        /**
         * 删除选中云主机.
         */
        deleteCloud: function () {
            if (this.cloud.selected.length < 1) {
                this.$message.error('没有选中项');
                return;
            }
            var selectedCloud = [];
            for (var i=0; i < this.cloud.selected.length; i++) {
                selectedCloud.push(this.cloud.selected[i].instance);
            }

            var newTable = [];
            for (var j=0; j < this.cloud.scanTable.length; j++) {
                if ($.inArray(this.cloud.scanTable[j].instance, selectedCloud) < 0) {
                    newTable.push(this.cloud.scanTable[j]);
                }
            }
            this.cloud.scanTable = newTable;
        },

        /**
         * 清除不能导入的云主机.
         */
        clearCloud: function () {
            var newTable = [];
            for (var j=0; j < this.cloud.scanTable.length; j++) {
                if (this.cloud.scanTable[j].refer == 1) {
                    newTable.push(this.cloud.scanTable[j]);
                }
            }
            this.cloud.scanTable = newTable;
        },

        /**
         * 导入选中的云主机.
         */
        importCloud: function () {
            if (this.cloud.selected.length < 1) {
                this.$message.error('没有选中项');
                return;
            }

            var self = this;
            var request = {clouds: this.cloud.selected};

            var fn="proInCloudSave";
            var service = Commonjs.jsonToString(request);
            var params = Commonjs.getParams(fn, service);
            Commonjs.ajaxSilence(weburl, params, true, function (response) {
                self.$message.success('导入已完成');
                var newData = [];
                for (var i=0; i<self.cloud.scanTable.length; i++) {
                    var item = self.cloud.scanTable[i];
                    for (var j=0; j<response.data.length; j++) {
                        var itemSaved = response.data[j];
                        if (item.instance == itemSaved.instance) {
                            item = itemSaved;
                        }
                    }
                    newData.push(item);
                }
                self.cloud.scanTable = newData;
            }, function () {
                self.$message.error("导入异常");
            });
        },

        /**
         * 上传虚拟主机导入成功.
         * @param response
         * @param file
         * @param fileList
         */
        vHostUploadSuccess: function (response, file, fileList) {
            if (response.result == 'success') {
                this.vHost.scanFlag = true;
                this.vHost.scanTable = response.data;
            } else {
                this.vHost.scanFlag = false;
                this.vHost.error = response.msg;
            }
        },

        /**
         * 选中虚拟主机.
         * @param rows
         */
        handleSelectionChangeVhost: function (rows) {
            this.vHost.selected = rows;
        },

        /**
         * 虚拟主机删除选中项.
         */
        deleteVHost: function () {
            if (this.vHost.selected.length < 1) {
                this.$message.error('没有选中项');
                return;
            }
            var selectedCloud = [];
            for (var i=0; i < this.vHost.selected.length; i++) {
                selectedCloud.push(this.vHost.selected[i].instance);
            }

            var newTable = [];
            for (var j=0; j < this.vHost.scanTable.length; j++) {
                if ($.inArray(this.vHost.scanTable[j].instance, selectedCloud) < 0) {
                    newTable.push(this.vHost.scanTable[j]);
                }
            }
            this.vHost.scanTable = newTable;
        },

        /**
         * 虚拟主机清除不能导入项.
         */
        clearVHost: function () {
            var newTable = [];
            for (var j=0; j < this.vHost.scanTable.length; j++) {
                if (this.vHost.scanTable[j].refer == 1) {
                    newTable.push(this.vHost.scanTable[j]);
                }
            }
            this.vHost.scanTable = newTable;
        },

        /**
         * 虚拟主机导入.
         */
        importVHost: function () {
            if (this.vHost.selected.length < 1) {
                this.$message.error('没有选中项');
                return;
            }

            var self = this;
            var request = {vHosts: this.vHost.selected};

            var fn="proInVHostSave";
            var service = Commonjs.jsonToString(request);
            var params = Commonjs.getParams(fn, service);
            Commonjs.ajaxSilence(weburl, params, true, function (response) {
                self.$message.success('导入已完成');
                var newData = [];
                for (var i=0; i<self.vHost.scanTable.length; i++) {
                    var item = self.vHost.scanTable[i];
                    for (var j=0; j<response.data.length; j++) {
                        var itemSaved = response.data[j];
                        if (item.instance == itemSaved.instance) {
                            item = itemSaved;
                        }
                    }
                    newData.push(item);
                }
                self.vHost.scanTable = newData;
            }, function () {
                self.$message.error("导入异常");
            });
        }
    },
    mounted:function () {

    }
});
