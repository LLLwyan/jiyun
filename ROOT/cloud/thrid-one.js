var vm = new Vue({
    el: '#main-block',
    data: function(){
        return {
            form : {
                regionId: '',
                regionName: '',
                zoneId:'',
                zoneName: '',
                cpu: '',
                memory: '',
                ipv6: '',
                typeFamily: '',
                instanceType: '',
                architecture: '',
                family: '',
                typeIndex: 0,
                currentTypeRow: {},
                buyTypeNumber: 1,
                sysDiskCategory: 'cloud_efficiency',
                sysDiskSize: 40,
                dataDisk: [],
                bandWith: 1,
                imageOsType: '',
                imageId: '',
                imageName: '',
                isSafe: false,
                userPassword: '',
                userPasswordSure: '',
                buyTime: 1,
                buyTimeName: '1 个月',
                moneyTotal: 0.0
            },
            title: '阿里云',
            /**
             * 地域列表.
             */
            regionList: [],
            /**
             * 可用区列表.
             */
            zoneList: [],
            /**
             * 分类.
             */
            architectureList: [],
            typeMap: {},
            /**
             * 实例分类.
             */
            instanceTypeFamilyList: [],
            /**
             * 可用实例列表.
             */
            instanceTypeList: [],
            /**
             * 实例可选列表.
             */
            instanceTableData: [],
            /**
             * 磁盘类型.
             */
            allowDiskType: [],
            instancePage: {
                current: 1,
                size: 10
            },
            /**
             * cpu输入建议值.
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
             * 内存输入建议值.
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
             * ipv6类型.
             */
            ipv6List: [
                {value: 'all', label: '全部'},
                {value: 'Y', label: '支持 IPv6'}
            ],
            /**
             * 校验规则.
             */
            rules:{
                regionId: [
                    { required: true, message: '选择地区', trigger: 'blur' }
                ],
                premium: [
                    { required: true, message: '请输入溢价率', trigger: 'blur' }
                ],
                statusFlag: [
                    { required: true, message: '请选择状态', trigger: 'blur' }
                ]
            },
            /**
             * 停售实例列表.
             */
            stoppedInstance: [],
            /**
             * 数据盘模板数据.
             */
            dataDiskTemplate: {
                diskCategory: 'cloud_efficiency',
                diskSize: 20
            },
            /**
             * 镜像源数据.
             */
            imageSource: [],
            /**
             * 镜像系统分类.
             */
            osType: [],
            /**
             * 可选镜像列表.
             */
            imageList: [],
            /**
             * 可注册期限.
             */
            timeLine:[
                {
                    value: 1,
                    label: '1 个月'
                },
                {
                    value: 2,
                    label: '2 个月'
                },
                {
                    value: 3,
                    label: '3 个月'
                },
                {
                    value: 6,
                    label: '半年'
                },
                {
                    value: 12,
                    label: '1 年'
                },
                {
                    value: 24,
                    label: '2 年'
                },
                {
                    value: 36,
                    label: '3 年'
                },
                {
                    value: 48,
                    label: '4 年'
                },
                {
                    value: 60,
                    label: '5 年'
                }
            ],
            /**
             * 当前价格.
             */
            price:{
                discountPrice: 0.0,
                originalPrice: 0.0,
                tradePrice: 0.0
            },
            /**
             * IO优化列表.
             */
            ioOptimized: []
        }
    },
    methods: {
        /**
         * 获取地域.
         */
        getRegions: function() {
            var self = this;
            var service = {};
            var fn="aliyunRegions";
            service = Commonjs.jsonToString(service);
            var params = Commonjs.getParams(fn,service);//获取参数
            Commonjs.ajaxSilence(weburl,params,true, function (data) {
                if (data.data) {
                    self.regionList = data.data;
                    self.form.regionId = self.regionList[0].regionId;
                    self.getZones();
                }
            }, null);
        },
        /**
         * 设置当前选中地域名称.
         */
        setRegionName: function() {
            var self = this;
            self.regionList.forEach(function (item) {
                if (self.form.regionId == item.regionId) {
                    self.form.regionName = item.localName;
                }
            });
        },
        /**
         * 可用区.
         */
        getZones: function () {
            this.setRegionName();
            var self = this;
            var service = {};
            service.regionId = this.form.regionId;
            var fn="aliyunZones";
            service = Commonjs.jsonToString(service);
            var params = Commonjs.getParams(fn,service);//获取参数
            Commonjs.ajaxSilence(weburl,params,true, function (data) {
                if (data.data) {
                    self.zoneList = data.data;
                    self.form.zoneId = self.zoneList[0].zoneId;
                    self.form.zoneName = self.zoneList[0].localName;
                }
                self.queryImages();
            }, null);
        },
        /**
         * 可用区选中.
         */
        zoneChange: function () {
            var self = this;
            if ('随机分配' == self.form.zoneName) {
                self.form.zoneId = 'random';
            } else {
                self.zoneList.forEach(function (item) {
                    if (item.localName == self.form.zoneName) {
                        self.form.zoneId = item.zoneId;
                    }
                })
            }

            //数据需要重新清洗.
            this.getIoOptimized();
            this.washedNoUse();
            this.queryTableData();
        },
        /**
         * 实例规格.
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
                    self.instanceTypeList = data.data.instanceTypeList;
                    self.typeMap = data.data;
                    self.washedNoUse();
                    self.architectureList = data.data.architecture;
                    self.form.architecture = self.architectureList[0].text;
                    self.queryFamily();
                    self.instancePage.current = 1;
                }
            }, null);
        },
        /**
         * 渲染分类.
         */
        queryFamily: function() {
            var self = this;
            $.each(self.architectureList, function (index, item) {
                if (item.text == self.form.architecture) {
                    var familyArr = self.typeMap.familyAndArchitecture[item.value];
                    var familyList = [];
                    $.each(self.typeMap.families, function (i, subItem) {
                        if ($.inArray(subItem.value, familyArr) > -1) {
                            familyList.push(subItem);
                        }
                    });
                    self.instanceTypeFamilyList = familyList;
                    self.form.family = familyList[0].text;
                }
            });
            self.queryTableData();
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
            if (this.form.ipv6 == 'Y') {
                var newFilterData = [];
                filterData.forEach(function (item) {
                    if (item.eniIpv6AddressQuantity == 1) {
                        newFilterData.push(item);
                    }
                });
                filterData = newFilterData;
            }

            //过滤分类
            var typeFamilies = this.typeMap.typeAndFamily[this.getFamilyCode()];
            var familyNameMap = {};
            typeFamilies.forEach(function (familyCode) {
                familyNameMap[familyCode] = self.getFamilyName(familyCode);
            });
            var newFilterData = [];
            var index=0;
            filterData.forEach(function (item) {
                if (item.instanceTypeFamily && $.inArray(item.instanceTypeFamily, typeFamilies) > -1) {
                    item.index=index++;
                    item.familyName = familyNameMap[item.instanceTypeFamily];
                    item = self.washForCoreInfo(item);
                    newFilterData.push(item);
                }
            });
            filterData = newFilterData;
            this.instanceTableData = filterData;
            this.form.typeIndex = 0;
            this.selectType();
        },
        /**
         * 获取当前分类编码.
         * @returns {string}
         */
        getFamilyCode: function() {
            var code = "";
            for (var i=0; i< this.typeMap.families.length; i++) {
                var item = this.typeMap.families[i];
                if (item.text == this.form.family) {
                    code = item.value;
                }
            }
            return code;
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
                this.form.instanceType = {};
                this.form.moneyTotal = 0.0;
                this.price = {
                    discountPrice: 0.0,
                    originalPrice: 0.0,
                    tradePrice: 0.0
                };
            }
        },
        /**
         * 查询禁售的实例规格.
         */
        queryStopInstance: function () {
            var service = {};
            var self = this;
            service.paramId='aliyun:stoppedInstance';
            var fn="getListDicParamItem";
            service = Commonjs.jsonToString(service)
            var params = Commonjs.getParams(fn,service);
            Commonjs.ajaxTrue(sysurl,params,function (data) {
                var stop = [];
                if (data.data) {
                    data.data.forEach(function (item) {
                        stop.push(item.value);
                    });
                }
                self.stoppedInstance = stop;
                self.getRegions();
            });
        },
        /**
         * 清洗禁售实例.
         */
        washedNoUse: function () {
            this.getIoOptimized();
            var self = this;
            var sourceList = this.typeMap.instanceTypeList;
            var newList = [];
            sourceList.forEach(function (value) {
                if ($.inArray(value.instanceTypeId, self.stoppedInstance) < 0 && $.inArray(value.instanceTypeId, self.ioOptimized) > -1 ) {
                    /*if ($.inArray(value.instanceTypeId, self.ioOptimized) > -1 ) {
                        value.ioOptimized = 1;
                    } else {
                        value.ioOptimized = 0;
                    }*/
                    value.ioOptimized = 1;
                    newList.push(value);
                }
            });
            //this.typeMap.instanceTypeList = newList;
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
         * 获取磁盘类型
         */
        queryDiskType: function () {
            var self = this;
            var service = {};
            service.paramId='aliyun:allowDiskType';
            var fn="getListDicParamItem";
            service = Commonjs.jsonToString(service)
            var params = Commonjs.getParams(fn,service);
            Commonjs.ajaxTrue(sysurl,params,function (data) {
                if (data.data) {
                    self.allowDiskType = data.data;
                    if (data.data.length > 0) {
                        self.form.sysDiskCategory = data.data[0].value;
                    }
                }
            });
        },
        /**
         * 添加数据盘行.
         */
        addDiskLine: function () {
            if (this.form.dataDisk.length < 16) {
                var newDisk = Object.assign({}, this.dataDiskTemplate);
                this.form.dataDisk.push(newDisk);
                this.getPrice();
            }
        },
        /**
         * 删除数据盘行.
         * @param index
         */
        deleteDiskLine: function (index) {
            var newDataDisk = [];
            for (var i=0; i < this.form.dataDisk.length; i++) {
                if (i != index) {
                    newDataDisk.push(this.form.dataDisk[i]);
                }
            }
            this.form.dataDisk = newDataDisk;
            this.getPrice();
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
         * 获取镜像.
         */
        queryImages: function () {
            var self = this;
            var service = {};
            service.regionId=self.form.regionId;
            var fn="aliyunImages";
            service = Commonjs.jsonToString(service)
            var params = Commonjs.getParams(fn,service);
            Commonjs.ajaxSilence(weburl,params,true,function (data) {
                if (data.data) {
                    self.imageSource = data.data;
                    data.data.forEach(function (item) {
                        if ($.inArray(item.oSType, self.osType) < 0) {
                            self.osType.push(item.oSType);
                        }
                    });
                    //console.log(self.osType);
                    if (data.data.length > 0) {
                        self.form.imageOsType = self.osType[0];
                        self.selectImage();
                    }
                }
                self.getInstanceType();
            }, null);
        },
        /**
         * 通过分列出镜像.
         */
        selectImage: function () {
            var self = this;
            var imageList = [];
            self.imageSource.forEach(function (item) {
                if (item.oSType == self.form.imageOsType) {
                    imageList.push(item);
                }
            });
            self.imageList = imageList;
        },
        /**
         * 设置选中的镜像名称.
         * @param row
         */
        setImageName: function (row) {
            for (var i=0; i<this.imageList.length; i++) {
                if (this.imageList[i].imageId == row) {
                    this.form.imageName = this.imageList[i].oSName;
                    break;
                }
            }
            this.getPrice();
        },
        /**
         * 设置购买时间名称.
         */
        setBuyTimeName: function (row) {
            for (var i=0; i<this.timeLine.length; i++) {
                if (this.timeLine[i].value == row) {
                    this.form.buyTimeName = this.timeLine[i].label;
                    break;
                }
            }
            this.getPrice();
        },
        /**
         * 加载价格.
         */
        getPrice: function () {
            var self = this;
            if (!self.form.currentTypeRow) {
                return;
            }
            if (self.form.sysDiskCategory == '') {
                return;
            }
            var service = {};
            service.regionId = self.form.regionId;
            service.instanceTypeId = self.form.currentTypeRow.instanceTypeId;
            service.sysDiskCategory = self.form.sysDiskCategory;
            service.sysDiskSize = self.form.sysDiskSize;
            service.internetMaxBandwidthOut = self.form.bandWith;
            service.period = self.form.buyTime;
            service.dataDisk = self.form.dataDisk;
            service.amount = self.form.buyTypeNumber;
            service.imageId = self.form.imageId;
            service.ioOptimized = self.form.currentTypeRow.ioOptimized;
            var fn="aliyunEcsBuyPrice";
            service = Commonjs.jsonToString(service)
            var params = Commonjs.getParams(fn,service);
            Commonjs.ajaxSilence(weburl,params,true,function (data) {
                if (data.data.tradePrice) {
                    self.form.moneyTotal = data.data.tradePrice;
                    self.price = data.data;
                }
            }, null, true);
        },
        /**
         *
         */
        doBuy: function (type) {
            var self = this;
            if (!self.form.currentTypeRow.instanceTypeId) {
                self.$message.error("请选择一个可用实例.");
                return false;
            }
            if (this.form.imageId == '') {
                self.$message.error("请选择镜像");
                return false;
            }
            if (this.form.isSafe) {
                if (!CndnsValidate.checkPassWord(this.form.userPassword)) {
                    self.$message.error("密码复杂度不符合要求");
                    return false;
                }
                if(this.form.userPassword != this.form.userPasswordSure) {
                    self.$message.error("两次输入的密码不一致");
                    return false;
                }
            }

            var service = {};
            service.regionId = self.form.regionId;
            service.regionName = self.form.regionName;
            if (self.form.zoneId == '' || self.form.zoneId == 'random') {
                var rand = Math.floor(Math.random() * self.zoneList.length);
                service.zoneId = self.zoneList[rand].zoneId;
            } else {
                service.zoneId = self.form.zoneId;
            }
            service.zoneName = self.form.zoneName;
            service.instanceTypeId = self.form.currentTypeRow.instanceTypeId;
            service.instanceDetail = self.form.currentTypeRow;
            service.sysDiskCategory = self.form.sysDiskCategory;
            service.sysDiskSize = self.form.sysDiskSize;
            service.internetMaxBandwidthOut = self.form.bandWith;
            service.period = self.form.buyTime;
            service.dataDisk = self.form.dataDisk;
            service.amount = self.form.buyTypeNumber;
            service.imageId = self.form.imageId;
            service.imageName = self.form.imageName;
            service.imageOsType = self.form.imageOsType;
            service.ioOptimized = self.form.currentTypeRow.ioOptimized;
            service.isSafe = self.form.isSafe ? 1 : 0;
            service.initPass = self.form.userPassword;

            var fn="aliyunAddCat";
            service = Commonjs.jsonToString(service);
            var params = Commonjs.getParams(fn, service);
            Commonjs.ajaxTrue(weburl,params,function (data) {
                if (type == 1) {
                    window.location.href=realPath+"/usercenter/shopping/shoppinglist.html";
                } else {
                    self.$message.success('已加到购物车');
                    queryUserCartCount();
                }
            }, true, '正在为您添加到购物车');
        }
    },
    mounted:function () {

    }
});

$(function () {
    vm.queryStopInstance();
    //vm.getInstanceType();
    vm.queryDiskType();


  var priceDiv = $('#priceScroll');
  var priceTop = priceDiv.offset().top;

  $(window).scroll(function() {
      var top = $(window).scrollTop() + $(window).height();
      if (top < priceTop) {
          priceDiv.css('position', 'fixed');
          priceDiv.css('bottom', '0');
          priceDiv.css('z-index', '2000');
      } else {
          priceDiv.css('position', 'relative');
          priceDiv.css('bottom', '');
          priceDiv.css('z-index', '');
      }
    });
});
