var vm = new Vue({
    el: '#MainContentDIV',
    data: function () {
        return {
            domainName: '',
            isEdition: false,
			loading: true,
            tableData: [],
            page: {
                total: 0,
                current: 1,
                size: 10
            },
            multipleSelection: [],
            /**
             * 建议输入值.
             */
            suggestion: {
                /**
                 * 主机记录
                 */
                rr: [
					{value: '@', realValue: '@'},
                    {value: 'www', realValue: 'www'},
                    {value: '*', realValue: '*'},
                ]
            },
            /**
             * 可选数据项.
             */
            options: {
                /**
                 * 记录类型
                 */
                type : [
                    {value: 'A', label: 'A'},
                    {value: 'NS', label: 'NS'},
                    {value: 'MX', label: 'MX'},
                    {value: 'TXT', label: 'TXT'},
                    {value: 'CNAME', label: 'CNAME'},
                    {value: 'SRV', label: 'SRV'},
                    {value: 'AAAA', label: 'AAAA'},
                    {value: 'CAA', label: 'CAA'},
                    {value: 'REDIRECT_URL', label: '显性URL转发'},
                    {value: 'FORWARD_URL', label: '隐性URL转发'}
                ],
                /**
                 * 线路.
                 */
                line: [
                     {value: 'default', label: '默认'},
                     {value: 'telecom', label: '中国电信'},
                     {value: 'unicom', label: '中国联通'},
                     {value: 'mobile', label: '中国移动'},
                     {value: 'edu', label: '中国教育网'},
                     {value: 'oversea', label: '境外'},
                     {value: 'baidu', label: '百度'},
                     {value: 'biying', label: '必应'},
                     {value: 'google', label: '谷歌'}
            	],
				/**
                 * 缓存时间.
                 */
                ttl: [
                     {value: 600, label: '10 分钟'},
                     {value: 1800, label: '30 分钟'},
                     {value: 3600, label: '1 小时'},
                     {value: 43200, label: '12 小时'},
                     {value: 86400, label: '1 天'}
            	]                     
			},
            /**
             * mx相关配置.
             */
            mx: {
                /**
                 * 最小值.
                 */
                min: 1,
                /**
                 * 最大值.
                 */
                mxMax: 10
            },
            /**
             * 新增数据模板.
             */
            addTmp: {
                recordId : '',
                _modify: true,
                rr: '',
                type: 'A',
                typeLabel: 'A',
                line: 'default',
                lineLabel: '默认',
                priority: 10,
                ttl: 600,
				ttlLabel: "10 分钟",
                updateTime: jsonDateTimeFormat({time: (new Date()).valueOf()}),
                status: 'ENABLE',
                statusName: '正常',
                locked: false
            },
            /**
             * 修改原数据缓存
             */
            editSource: {},
            testData: [
                {
                    recordId : '1',
                    _modify: false,
                    rr: 'www',
                    type: 'A',
                    typeLabel: 'A',
                    line: 'default',
                    lineLabel: '默认',
                    value: 'default',
                    priority: 10,
                    ttl: 600,
                    updateTime: jsonDateTimeFormat({time: (new Date()).valueOf() - 1*60*60*1000}),
                    status: 'ENABLE',
                    statusName: '正常',
                    locked: false
                },
                {
                    recordId : '1',
                    _modify: false,
                    rr: '*',
                    type: 'A',
                    typeLabel: 'A',
                    line: 'default',
                    lineLabel: '默认',
                    value: 'default',
                    priority: 10,
                    ttl: 600,
                    updateTime: jsonDateTimeFormat({time: (new Date()).valueOf() - 3*60*60*1000}),
                    status: 'DISABLE',
                    statusName: '暂停',
                    locked: true
                }
            ]
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
            service.domainName = self.domainName;
            service.page=this.page.current;
            service.pageSize=this.page.size;
            var fn="queryAliyunDomainSolutionRecord";
            service = Commonjs.jsonToString(service);
            var params = Commonjs.getParams(fn,service);
            Commonjs.ajaxSilence(weburl,params,false,function (data) {
                self.page.total = data.data.total;
                self.tableData = data.data.datas;
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
			self.tableData = "[]";
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
         * 匹配RR（主机记录）建议值.
         * @param val
         */
        querySearchRR: function(queryString, cb) {
            var restaurants = this.suggestion.rr;
            var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
            // 调用 callback 返回建议列表的数据
            cb(results);
        },

        /**
         * 选中建议.RR
         * @param val
         * @param index
         */
        handleSelectRR: function(val, index) {
            //console.log(val, index);
            this.tableData[index].rr = val.realValue;
        },

        /**
         * 过滤
         * @param queryString
         * @returns {function(*): boolean}
         */
        createFilter: function(queryString) {
            return function (restaurant) {
                return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
            };
        },

        /**
         * 选中类型.
         * @param val
         */
        selectedType: function(val, index) {
            var label = "";
            this.options.type.forEach(function (item) {
                if (item.value == val) {
                    label = item.label;
                }
            });
            this.tableData[index].typeLabel = label;
        },
        /**
         * 页面添加行.
         */
        addPageLine: function () {
            this.tableData.push(Object.assign({}, this.addTmp));
        },
        /**
         * 取消添加行.
         */
        deleteAddLine: function (index) {
            var data = [];
            var i=0;
            this.tableData.forEach(function (item) {
                if (i++!=index) {
                    data.push(item);
                }
            });
            this.tableData = data;
        },
        /**
         * 保存新增项.
         * @param row 新增记录数据.
         */
        saveAddLine: function (row) {
			var self = this;
            var service = {};
			service.rr = row.rr;
			service.type = row.type;
			service.line = row.line;
			service.priority = row.priority;
			service.ttl = row.ttl;
			service.value = row.value;
			service.domainName =  self.domainName;
            var fn="addAliyunDomainSolutionRecord";
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
			self.reLoadData();
            //console.log(row);
			
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
				service.recordId = row.recordId;
				service.domainName = self.domainName;
				var fn="deleteAliyunDomainSolutionRecord";
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
				self.multipleSelection.map(function (item) {  
					var service = {};
					service.recordId = item.recordId;
					service.domainName = self.domainName;
					var fn="deleteAliyunDomainSolutionRecord";
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
				});
               //console.log('选中的数据', self.multipleSelection);
			   self.reLoadData();

            }).catch(function(){
            });
			
        },
        /**
         * 开启行.
         * @param row
         */
        startLine: function (row) {
            var self = this;
            this.$confirm('确定需要开启该记录吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(function (){
				var status = "ENABLE";
				var service = {};
				
				service.status = status;
				service.recordId = row.recordId;
				service.domainName =  self.domainName;
				var fn="setAliyunDomainSolutionRecordStatus";
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
                //console.log('单行开启的数据', row);
				self.reLoadData();
            }).catch(function(){
            });
			
        },
        /**
         * 批量开启记录.
         */
        startChoose: function () {
            if (this.multipleSelection.length < 1) {
                this.$message.error('请先选择需要操作的记录');
                return;
            }
            var self = this;
            this.$confirm('确定需要批量开启所选中的记录吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(function (){
				self.multipleSelection.map(function (item) {  
					var service = {};
					var status = "ENABLE";
					
					service.status = status;
					service.recordId = item.recordId;
					service.domainName = self.domainName;
					var fn="setAliyunDomainSolutionRecordStatus";
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
				});
				self.reLoadData();
                //console.log('选中的数据', self.multipleSelection);

            }).catch(function(){
            });
        },
        /**
         * 暂停行.
         * @param row
         */
        stopLine: function (row) {
            var self = this;
            this.$confirm('确定需要暂停该记录吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(function (){
				var status = "DISABLE";
				var service = {};
				
				service.status = status;
				service.recordId = row.recordId;
				service.domainName =  self.domainName;
				var fn="setAliyunDomainSolutionRecordStatus";
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
                //console.log('单行暂停的数据', row);
				self.reLoadData();
            }).catch(function(){
            });
			
        },
        /**
         * 批量暂停记录.
         */
        stopChoose: function () {
            if (this.multipleSelection.length < 1) {
                this.$message.error('请先选择需要操作的记录');
                return;
            }
            var self = this;
            this.$confirm('确定需要批量暂停所选中的记录吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(function (){
				
				self.multipleSelection.map(function (item) {  
					//console.log('选中的数据', item);
					var service = {};
					var status = "DISABLE";
					
					service.status = status;
					service.recordId = item.recordId;
					service.domainName = self.domainName;
					var fn="setAliyunDomainSolutionRecordStatus";
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
				});
				self.reLoadData();
                //console.log('选中的数据', self.multipleSelection);

            }).catch(function(){
            });
        },
        /**
         * 显示修改行
         * @param index
         */
        showEditLine: function (index) {
            var self = this;
            var data = [];
            var i=0;
            this.tableData.forEach(function (item) {
                if (i++==index) {
                    self.editSource[item.recordId] = item;
                    item._modify = true;
                }
                data.push(item);
            });
            this.tableData = data;
        },
        /**
         * 行修改保存.
         * @param row
         */
        saveEditLine: function (row) {
            var self = this;
            this.$confirm('确定需要保存该记录的修改吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(function (){
				var service = {};
				service.rr = row.rr;
				service.type = row.type;
				service.line = row.line;
				service.priority = row.priority;
				service.ttl = row.ttl;
				service.value = row.value;
				service.recordId = row.recordId;
				service.domainName = self.domainName;
				var fn="uptAliyunDomainSolutionRecord";
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
				self.reLoadData();
                //console.log('单行修改的数据', row);

            }).catch(function(){
            });
        },
        /**
         * 取消修改.
         */
        cancelEditLine: function (index) {
            var self = this;
            this.$confirm('确定取消该记录的修改吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(function (){
                var data = [];
                var i=0;
                self.tableData.forEach(function (item) {
                    if (i++==index) {
                        item = self.editSource[item.recordId] ? self.editSource[item.recordId] : item;
                        item._modify = false;
                    }
                    data.push(item);
                });
                self.tableData = data;
            }).catch(function(){
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
		this.domainName = request("domainName");
		if(this.domainName == ''){
          	this.$message.error('域名不能为空');
			window.location.href= './domain.html';
		}
        this.loadInfo();
    }
});
