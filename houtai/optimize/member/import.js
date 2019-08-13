var vm = new Vue({
    el: '#main-block',
    data: function(){
        return {
            member: {
                error: '请上传文件',
                scanTable: [],
                scanFlag: false,
                selected: []
            },
            detail: {
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
        memberUploadSuccess: function (response, file, fileList) {
            if (response.result == 'success') {
                this.member.scanFlag = true;
                this.member.scanTable = response.data;
            } else {
                this.member.scanFlag = false;
                this.member.error = response.msg;
            }
        },
        /**
         * 域名行是否可选.
         * @param row
         * @param index
         * @returns {*}
         */
        selectAble: function (row, index) {
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
        importMember: function () {
            if (this.member.selected.length < 1) {
                this.$message.error('没有选中项');
                return;
            }

            var self = this;
            var request = {members: this.member.selected};

            var fn="memberImportUser";
            var service = Commonjs.jsonToString(request);
            var params = Commonjs.getParams(fn, service);
            Commonjs.ajaxSilence(weburl, params, true, function (response) {
                self.$message.success('导入已完成');
                var newData = [];
                for (var i=0; i<self.member.scanTable.length; i++) {
                    var item = self.member.scanTable[i];
                    for (var j=0; j<response.data.length; j++) {
                        var itemSaved = response.data[j];
                        if (item.member == itemSaved.domain) {
                            item = itemSaved;
                        }
                    }
                    newData.push(item);
                }
                self.member.scanTable = newData;
            }, function () {
                self.$message.error("导入异常");
            });
        },
        /**
         * 删除域名.
         */
        deleteMember: function () {
            if (this.member.selected.length < 1) {
                this.$message.error('没有选中项');
                return;
            }
            var selectedDomain = [];
            for (var i=0; i < this.member.selected.length; i++) {
                selectedDomain.push(this.member.selected[i].domain);
            }

            var newTable = [];
            for (var j=0; j < this.member.scanTable.length; j++) {
                if ($.inArray(this.member.scanTable[j].domain, selectedDomain) < 0) {
                    newTable.push(this.member.scanTable[j]);
                }
            }
            this.member.scanTable = newTable;
        },
        /**
         * 清除不可导入.
         */
        clearMember: function () {
            var newTable = [];
            for (var j=0; j < this.member.scanTable.length; j++) {
                if (this.member.scanTable[j].refer == 1) {
                    newTable.push(this.member.scanTable[j]);
                }
            }
            this.member.scanTable = newTable;
        },
        /**
         * 选中.
         */
        handleSelectionChangeMember: function (rows) {
            this.member.selected = rows;
        },


        /**
         * 云主机上传成功.
         * @param response
         * @param file
         * @param fileList
         */
        detailUploadSuccess: function (response, file, fileList) {
            if (response.result == 'success') {
                this.detail.scanFlag = true;
                this.detail.scanTable = response.data;
            } else {
                this.detail.scanFlag = false;
                this.detail.error = response.msg;
            }
        },

        /**
         * 选中云主机.
         * @param rows
         */
        handleSelectionChangeDetail: function (rows) {
            this.detail.selected = rows;
        },

        /**
         * 删除选中云主机.
         */
        deleteDetail: function () {
            if (this.detail.selected.length < 1) {
                this.$message.error('没有选中项');
                return;
            }
            var selectedCloud = [];
            for (var i=0; i < this.detail.selected.length; i++) {
                selectedCloud.push(this.detail.selected[i].instance);
            }

            var newTable = [];
            for (var j=0; j < this.detail.scanTable.length; j++) {
                if ($.inArray(this.detail.scanTable[j].instance, selectedCloud) < 0) {
                    newTable.push(this.detail.scanTable[j]);
                }
            }
            this.detail.scanTable = newTable;
        },

        /**
         * 清除不能导入的云主机.
         */
        clearDetail: function () {
            var newTable = [];
            for (var j=0; j < this.detail.scanTable.length; j++) {
                if (this.detail.scanTable[j].refer == 1) {
                    newTable.push(this.detail.scanTable[j]);
                }
            }
            this.detail.scanTable = newTable;
        },

        /**
         * 导入选中的云主机.
         */
        importDetail: function () {
            if (this.detail.selected.length < 1) {
                this.$message.error('没有选中项');
                return;
            }

            var self = this;
            var request = {details: this.detail.selected};

            var fn="memberImportDetail";
            var service = Commonjs.jsonToString(request);
            var params = Commonjs.getParams(fn, service);
            Commonjs.ajaxSilence(weburl, params, true, function (response) {
                self.$message.success('导入已完成');
                var newData = [];
                for (var i=0; i<self.detail.scanTable.length; i++) {
                    var item = self.detail.scanTable[i];
                    for (var j=0; j<response.data.length; j++) {
                        var itemSaved = response.data[j];
                        if (item.instance == itemSaved.instance) {
                            item = itemSaved;
                        }
                    }
                    newData.push(item);
                }
                self.detail.scanTable = newData;
            }, function () {
                self.$message.error("导入异常");
            });
        }
    },
    mounted:function () {

    }
});
