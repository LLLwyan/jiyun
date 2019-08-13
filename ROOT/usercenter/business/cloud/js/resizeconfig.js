var instanceId;
$(function(){
	instanceId=request("iId");
	queryUserService();
});

function queryUserService(){
	var service = {};
	service.instanceId=instanceId
	var fn="queryUserService";
	service = Commonjs.jsonToString(service)
	var params = Commonjs.getParams(fn,service);//获取参数
	Commonjs.ajaxTrue(weburl,params,querySuccess);
}

function querySuccess(data){
	if(data.data==null)
		return false;

	var view=data.data.view;
	var info=data.data.info;
	var disklist=data.data.disklist;
	vm.hostType = view.hostType;
	jointHtml(view,info,disklist);
	$("#productCode").val(view.productCode);
	$("#hostType").val(view.hostType);
	$("#modelId").val(info.modelId);
	$("#curSpec").html(info.cpu+'核'+info.memory+'G');

	if ('hyperv' == view.hostType) {
        getSpecCPU();
    } else {
        vm.loadInfo(view);
    }
}

//获取实例规格-CPU
function getSpecCPU(){
	var modelId=$("#modelId").val();
	var service = {};
	service.hostType = $("#hostType").val();
	service.modelId = modelId;
	var fn="getDicSpecCPU";
	service = Commonjs.jsonToString(service);
	var params = Commonjs.getParams(fn,service);//获取参数数

	$.ajax({
		datatype:"json",
		type:"POST",
      	url: weburl,
      	data:params,
		cache : false,
		success: function(data){
			var result=jQuery.parseJSON(data);

			if(result.result=="success"){
				var html='';
				if (result.data.length>0){
					BaseForeach(result.data,function(i,item){
						html+='<dt data-value="'+item.cpu+'">'+item.cpu+'核</dt>';
					});
				}
				$('#cpulist').html(html);
				var cpu=$(".cpu dl dt").eq(0);
				if(cpu.length!=0){
					$("#cpu_new").val(cpu.attr("data-value"));
					cpu.addClass('active').siblings().removeClass('active');
				}
				getSpecMemory(modelId,isNull(cpu.attr("data-value")));

				//选择CPU
				$(".cpu dl dt").click(function(){
					$(this).addClass('active').siblings().removeClass('active');
					$("#cpu_new").val($(this).attr("data-value"));
					getSpecMemory(modelId,$(this).attr("data-value"));
				});
			}
		}
	});
}

//获取实例规格-内存
function getSpecMemory(modelId,cpu){
	var service = {};
	service.hostType = $("#hostType").val();
	service.modelId = modelId;
	service.cpu=cpu;
	var fn="getDicSpecMemory";
	service = Commonjs.jsonToString(service);
	var params = Commonjs.getParams(fn,service);//获取参数

	$.ajax({
		datatype:"json",
		type:"POST",
		url: weburl,
		data:params,
		cache : false,
		success: function(data){
			var result=jQuery.parseJSON(data);
			if(result.result=="success"){
				var html='';
				if (result.data.length>0){
					BaseForeach(result.data,function(i,item){
						html+='<dt data-value="'+item.memory+'">'+item.memory+'G</dt>';
					});
				}
				$('#memorylist').html(html);
				var memory=$(".memory dl dt").eq(0);
				if(memory.length!=0){
					$("#memory_new").val(memory.attr("data-value"));
					memory.addClass('active').siblings().removeClass('active');;
				}

				//选择内存
				$(".memory dl dt").click(function(){
					$(this).addClass('active').siblings().removeClass('active');
					$("#memory_new").val($(this).attr("data-value"));
					getResizeSpecPrice()
				});
				getResizeSpecPrice()
			}
		}
	});
}

function getResizeSpecPrice(){
	var service = {};
	service.hostType=$("#hostType").val();
	service.instanceId = instanceId;
	service.cpu=$("#cpu_new").val();
	service.memory=$("#memory_new").val();
	var fn="getResizeSpecPrice";
	service = Commonjs.jsonToString(service);
	var params = Commonjs.getParams(fn,service);//获取参数
	Commonjs.ajaxTrue(weburl,params,getSpecPriceSuccess,false);
}

function getSpecPriceSuccess(data){
	$("#resizeprice").html(data.data+"元");
}

//添加购物车
function confirmUpgrade(){
	var service = {};
	service.instanceId= instanceId;
	service.productCode=$("#productCode").val();
	service.cpu=$("#cpu_new").val();
	service.memory=$("#memory_new").val();
	var fn="addUserCartResizeSpec";
	service = Commonjs.jsonToString(service);
	var params = Commonjs.getParams(fn,service);//获取参数
	Commonjs.ajaxTrue(weburl,params,UpgradeSuccess,false);
}

function UpgradeSuccess(data){
	window.parent.frames.location.href=realPath+"/usercenter/shopping/shoppinglist.html";
}


var vm = new Vue({
    el: '#MainContentDIV',
    data: function(){
   		return {
   			form: {
   				regionId:'',
				zoneId:'',
                cpu: '',
                memory: '',
                bandWith: 1,
                currentTypeRow: {},
                instanceType: '',
                moneyTotal: 0,
                typeIndex: -1,
                ipv6: ''
			},
            /**
			 * 当前云注册商.
             */
   			hostType: '',
            /**
			 * 最小可选择带宽.
             */
			bandWithMin: 1,
            /**
			 * 当前最小可选cpu.
             */
			cpuMin: 1,
            /**
			 * 当彰最小可选内存.
             */
			memoryMin: 1,
            /**
			 * cpu查询建议值.
             */
            cpuList: [
                {value: '1 vCPU', real: '1'},
                {value: '2 vCPU', real: '2'},
                {value: '4 vCPU', real: '4'},
                {value: '8 vCPU', real: '8'},
                {value: '12 vCPU', real: '12'},
                {value: '16 vCPU', real: '16'},
                {value: '24 vCPU', real: '24'},
                {value: '32 vCPU', real: '32'},
                {value: '56 vCPU', real: '56'},
                {value: '64 vCPU', real: '64'}
            ],
            /**
			 * 内存查询建议值.
             */
            memoryList: [
                {value: '0.5 GiB', real: '0.5'},
                {value: '1 GiB', real: '1'},
                {value: '2 GiB', real: '2'},
                {value: '4 GiB', real: '4'},
                {value: '8 GiB', real: '8'},
                {value: '12 GiB', real: '12'},
                {value: '16 GiB', real: '16'},
                {value: '24 GiB', real: '24'},
                {value: '32 GiB', real: '32'},
                {value: '48 GiB', real: '48'},
                {value: '64 GiB', real: '64'},
                {value: '96 GiB', real: '96'},
                {value: '128 GiB', real: '128'},
                {value: '160 GiB', real: '160'},
                {value: '192 GiB', real: '192'},
                {value: '224 GiB', real: '224'},
                {value: '256 GiB', real: '256'},
                {value: '512 GiB', real: '512'}
            ],
            /**
			 * 停售实例.
             */
            stoppedInstance:[],
            /**
			 * 可用实例列表.
             */
            instanceTypeList: [],
            /**
			 * 实例源数据.
             */
            typeMap:{},
            /**
			 * 实例可选列表.
             */
            instanceTableData: [],
            /**
             * 当前价格.
             */
            price:{
                discountPrice: 0.0,
                originalPrice: 0.0,
                tradePrice: 0.0
            }
   		};
    },
    methods: {
        /**
         * 查询禁售的实例规格.
         */
        queryStopInstance: function () {
            //默认阿里云
            var service = {};
            service.paramId='aliyun:stoppedInstance';
            var fn="getListDicParamItem";
            service = Commonjs.jsonToString(service)
            var params = Commonjs.getParams(fn,service);
            var data = Commonjs.ajax(sysurl,params,false);
            var stop = [];
            if (data.data) {
                data.data.forEach(function (item) {
                    stop.push(item.value);
                });
            }
            this.stoppedInstance = stop;
        },

        /**
		 * 加载当前配置信息.
         * @param view
         */
        loadInfo: function(view) {
        	this.form.regionId = view.regionId;
        	this.form.zoneId = view.zoneId;
        	this.cpuMin = view.extendInfo.cpu;
        	this.memoryMin = view.extendInfo.memory;
        	this.bandWithMin = view.extendInfo.internetMaxBandwidthOut;

        	if ('aliyun' == this.hostType) {
                this.getInstanceType();
            } else if ('huawei' == this.hostType) {
        	    this.getInstanceTypeHuawei();
            }
		},

        /**
         * 获取实例规格.
         */
        getInstanceType: function () {
            var self = this;
            var service = {};
            service.regionId = this.form.regionId;
            var fn="aliyunInstanceType";
            service = Commonjs.jsonToString(service);
            var params = Commonjs.getParams(fn,service);//获取参数
            Commonjs.ajaxSilence(weburl,params,false, function (data) {
                if (data.data) {
                	//清洗低于当前配置实例规格
                    var typeList = [];
                    data.data.instanceTypeList.forEach(function (value) {
                    	if (value.cpuCoreCount < self.cpuMin || value.memorySize < self.memoryMin ||
							(value.cpuCoreCount == self.cpuMin && value.memorySize == self.memoryMin) ) {
                    		return;
						}
						typeList.push(value);
					});
                    self.instanceTypeList = typeList;
                    self.typeMap = data.data;
                    self.washedNoUse();
                    self.queryTableData();
                }
            }, null);
        },

        /**
         * 获取实例规格（华为）
         */
        getInstanceTypeHuawei: function() {
            var self = this;
            var service = {};
            service.serverId = instanceId;
            var fn="huaweiGetCanChangeFlavors";
            service = Commonjs.jsonToString(service);
            var params = Commonjs.getParams(fn,service);//获取参数
            Commonjs.ajaxSilence(weburl,params,false, function (data) {
                if (data.data) {
                    //清洗低于当前配置实例规格
                    var typeList = [];
                    data.data.forEach(function (value) {
                        value.cpuCoreCount = value.vcpus;
                        value.memorySize = value.ram / 1024;
                        if (value.cpuCoreCount < self.cpuMin || value.memorySize < self.memoryMin ||
                            (value.cpuCoreCount == self.cpuMin && value.memorySize == self.memoryMin) ) {
                            return;
                        }
                        value.instanceTypeId = value.id;
                        if (undefined == value.extra_specs && value.os_extra_specs) {
                            value.extra_specs = os_extra_specs;
                        }
                        typeList.push(value);
                    });
                    self.instanceTypeList = typeList;
                    self.typeMap = data.data;
                    self.queryTableData();
                }
            }, null);
        },

        /**
         * 清洗禁售实例.
         */
        washedNoUse: function () {
            this.getIoOptimized();
            var self = this;
            var sourceList = this.instanceTypeList;
            var newList = [];
            sourceList.forEach(function (value) {
                if ($.inArray(value.instanceTypeId, self.stoppedInstance) < 0 && $.inArray(value.instanceTypeId, self.ioOptimized) > -1 ) {
                    value.ioOptimized = 1;
                    newList.push(value);
                }
            });
            this.instanceTypeList = newList;
        },
        /**
         * IO优化数据清洗
         */
        getIoOptimized: function() {
            var self = this;
            var service = {};
            service.regionId = this.form.regionId;
            service.zoneId = this.form.zoneId;
            var fn="aliyunIoOptimized";
            service = Commonjs.jsonToString(service);
            var params = Commonjs.getParams(fn,service);
            Commonjs.ajaxSilence(weburl, params, false, function (data) {
                if (data.data) {
                    var optimized = [];
                    data.data.forEach(function (item) {
                        if (item.status == "available") {
                            optimized.push(item.value);
                        }
                    });
                    self.ioOptimized = optimized;
                }
            }, null);
        },

        /**
         * 查询过滤
         */
        queryTableData: function() {
            var self = this;
            var filterData = this.instanceTypeList;
            //过滤CPU
            var cpuNumber = this.form.cpu.replace("vCPU", "").replace(/ /g, "");
            if (Commonjs.isNumber(cpuNumber)) {
                var newFilterData = [];
                filterData.forEach(function (item) {
                    if (item.cpuCoreCount == cpuNumber) {
                        newFilterData.push(item);
                    }
                });
                filterData = newFilterData;
            }

            //过滤内存
            var memorySize = this.form.memory.replace("GiB", "").replace(/ /g, "");
            if (Commonjs.isNumber(memorySize)) {
                var newFilterData = [];
                filterData.forEach(function (item) {
                    if (item.memorySize == memorySize) {
                        newFilterData.push(item);
                    }
                });
                filterData = newFilterData;
            }

            //过滤IPV6
            if (this.form.ipv6 == 'Y' && 'aliyun' == this.hostType) {
                var newFilterData = [];
                filterData.forEach(function (item) {
                    if (item.eniIpv6AddressQuantity == 1) {
                        newFilterData.push(item);
                    }
                });
                filterData = newFilterData;
            }

            //显示规格族、处理型号、处理器主频
            if ('aliyun' == this.hostType) {
                var typeFamilies = this.getTypeFamilies();
                var familyNameMap = {};
                typeFamilies.forEach(function (familyCode) {
                    familyNameMap[familyCode] = self.getFamilyName(familyCode);
                });
                var newFilterData = [];
                filterData.forEach(function (item) {
                    if (item.instanceTypeFamily && $.inArray(item.instanceTypeFamily, typeFamilies) > -1) {
                        item.familyName = familyNameMap[item.instanceTypeFamily];
                        item = self.washForCoreInfo(item);
                        newFilterData.push(item);
                    }
                });
                filterData = newFilterData;
            }

            var index = 0;
            filterData.forEach(function (item) {
                item.index = index++;
            });

            this.instanceTableData = filterData;
            //this.selectType();
        },
        /**
		 * 获取实例规格数组.
         * @returns {Array}
         */
		getTypeFamilies: function() {
        	var families = [];
        	$.each(this.typeMap.typeAndFamily, function (key, arr) {
                families = families.concat(arr);
            });
            return families;
		},
        /**
         * 获取族显示名称.
         * @param familyCode
         * @returns {*}
         */
        getFamilyName: function(familyCode) {
            var name = familyCode;
            this.typeMap.instanceTypeFamilyList.forEach(function (item) {
                if (item.text != '' && familyCode == item.value) {
                    name = item.text;
                }
            });
            return name;
        },
        /**
         * 处理器数据清洗.
         * @param row
         * @returns {*}
         */
        washForCoreInfo: function(row) {
            var clockSpeed = "";
            var physicalProcessor = "";
            if (this.typeMap.core.instanceTypeMap[row.instanceTypeId]) {
                var coreInfo = this.typeMap.core.instanceTypeMap[row.instanceTypeId];
                clockSpeed = coreInfo.clockSpeed;
                physicalProcessor = coreInfo.physicalProcessor;
            } else if (this.typeMap.core.instanceTypeFamilyMap[row.instanceTypeFamily]) {
                var coreInfo = this.typeMap.core.instanceTypeFamilyMap[row.instanceTypeFamily];
                clockSpeed = coreInfo.clockSpeed;
                physicalProcessor = coreInfo.physicalProcessor;
            }
            row.clockSpeed = clockSpeed;
            row.physicalProcessor = physicalProcessor;
            return row;
        },
        /**
         * 实例选择.
         * @param row
         * @param event
         * @param column
         */
        instanceTableRowClick: function (row, event, column) {
            this.form.typeIndex = row.index;
            this.selectType();
        },
        /**
         * 选中实例规格.
         */
        selectType: function () {
            if (this.instanceTableData.length > 0) {
                this.form.currentTypeRow = this.instanceTableData[this.form.typeIndex];
                this.form.instanceType = this.form.currentTypeRow.instanceTypeId;
                this.getPrice();
            } else {
                this.form.currentTypeRow = {};
                this.form.instanceType = '';
                this.form.moneyTotal = 0.0;
                this.price = {
                    discountPrice: 0.0,
                    originalPrice: 0.0,
                    tradePrice: 0.0
                };
            }
        },
        /**
         * 输入建议过滤
         * @param queryString
         * @returns {function(*): boolean}
         */
        createFilter: function(queryString) {
            return function (restaurant) {
                return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
            };
        },
        /**
         * CPU匹配建议.
         */
        querySearchCpu: function (queryString, cb) {
            var restaurants = this.cpuList;
            var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
            // 调用 callback 返回建议列表的数据
            cb(results);
        },
        /**
         * 选中CPU建议.
         */
        handleSelectCpu: function (item) {
            setTimeout(function () {
                vm.queryTableData();
            }, 20);
        },
        /**
         * 内存匹配建议.
         * @param queryString
         * @param cb
         */
        querySearchMemory: function (queryString, cb) {
            var restaurants = this.memoryList;
            var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
            // 调用 callback 返回建议列表的数据
            cb(results);
        },
        /**
         * 选中内存建议.
         * @param item
         */
        handleSelectMemory: function (item) {
            setTimeout(function () {
                vm.queryTableData();
            }, 20);
        },
        /**
         * 格式化显示带宽滑块显示。
         * @param val
         * @returns {string}
         */
        formatBandWidthTooltip: function (val) {
            return val + " Mbps";
        },
        /**
		 * 获取价格.
         */
        getPrice: function () {
            var self = this;
            self.form.moneyTotal = -1;
            var service = {};
            service.instanceId = instanceId;
            service.instanceTypeId = self.form.currentTypeRow.instanceTypeId ? self.form.currentTypeRow.instanceTypeId : '';
            service.internetMaxBandwidthOut = self.form.bandWith;
            service.ioOptimized = self.form.currentTypeRow.ioOptimized ? self.form.currentTypeRow.ioOptimized : 0;
            var fn = configParam.cloudType.aliyun == self.hostType ? "getUpgradePrice" : "huaweiUpgradeFlavorsPrice";
            service = Commonjs.jsonToString(service);
            var params = Commonjs.getParams(fn,service);
            Commonjs.ajaxSilence(weburl,params,true,function (data) {
                if (undefined != data.data.tradePrice) {
                    self.form.moneyTotal = data.data.tradePrice;
                    self.price = data.data;
                }
            }, null, true);
        },
        /**
		 * 提交升级订单.
         */
        clickUpgrade: function () {
            var self = this;
            var service = {};
            service.instanceId = instanceId;
            service.instanceTypeId = self.form.currentTypeRow.instanceTypeId ? self.form.currentTypeRow.instanceTypeId : '';
            service.internetMaxBandwidthOut = self.form.bandWith;
            service.ioOptimized = self.form.currentTypeRow.ioOptimized ? self.form.currentTypeRow.ioOptimized : 0;
            service.currentRow = self.form.currentTypeRow;
            var fn = configParam.cloudType.aliyun == self.hostType ? "addUserCartAliyunUpgrade" : "huaweiUpgradeFlavor";
            service = JSON.stringify(service);
            var params = Commonjs.getParams(fn,service);//获取参数
            Commonjs.ajaxTrue(weburl,params,function () {
                window.parent.frames.location.href=realPath+"/usercenter/shopping/shoppinglist.html";
            },false);
        }
	},
    mounted:function () {
    	this.queryStopInstance();
    }
});
