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
                sysDiskCategory: 'SATA',
                sysDiskSize: 40,
                dataDisk: [],
                bandWith: 1,
                imageOsType: '',
                osType:'',
                imageId: '',
                imageName: '',
                isSafe: false,
                userPassword: '',
                userPasswordSure: '',
                buyTime: 1,
                buyTimeName: '1 个月',
                moneyTotal: 0.0,
                queryInstanceName: '',
                bandwidthRuleName: '全动态BGP',
                bandwidthTypeName: '独享带宽'
            },
            title: '华为云',
            /**
             * 地域列表.
             */
            regionList: [],
            /**
             * 所有可用区列表.
             */
            zoneConfigList: [],
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
            allowDiskType: [
                {value: "SATA", description: "普通IO"},
                {value: "SAS", description: "高IO"},
                {value: "SSD", description: "超高IO"}
            ],
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
                diskCategory: 'SATA',
                diskSize: 40
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
                    value: 4,
                    label: '4 个月'
                },
                {
                    value: 5,
                    label: '5 个月'
                },
                {
                    value: 6,
                    label: '半年'
                },
                {
                    value: 7,
                    label: '7 个月'
                },
                {
                    value: 8,
                    label: '8 个月'
                },
                {
                    value: 9,
                    label: '9 个月'
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
            ioOptimized: [],
            instanceCategory: [
                {"name" : "所有", "value": ""},
                {"name" : "通用计算型", "value": "s1"},
                {"name" : "通用计算增强型", "value": "s2"},
                {"name" : "内存优化型", "value": "m1"},
                {"name" : "内存优化超大型", "value": "m1"},
                {"name" : "高性能计算型", "value": "m1"},
                {"name" : "高性能计算增加型", "value": "m2"},
                {"name" : "高性能计算型", "value": "m1"}
            ],
            eipList: {
                'cn-north-1': ['全动态BGP', '静态BGP'],
                'cn-north-4': ['全动态BGP'],
                'cn-southwest-2': ['静态BGP'],
                'cn-east-2': ['全动态BGP', '静态BGP'],
                'cn-south-1': ['全动态BGP', '静态BGP'],
                'ap-southeast-1': ['全动态BGP'],
                'ap-southeast-2': ['全动态BGP'],
                'ap-southeast-3': ['全动态BGP'],
                'af-south-1': ['全动态BGP']

            },
            currentEipList: ['全动态BGP', '静态BGP']
        }
    },
    methods: {
        /**
         * 获取地域.
         */
        getRegions: function() {
            var self = this;
            var service = {};
            var fn="huaweiRegions";
            service = Commonjs.jsonToString(service);
            var params = Commonjs.getParams(fn,service);//获取参数
            Commonjs.ajaxSilence(weburl,params,true, function (data) {
                if (data.data) {
                    self.regionList = data.data.productParam.prjList;
                    self.form.regionId = self.regionList[0].regionId;
                    self.getZoneConfig();
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
                    self.form.regionName = item.regionName;
                }
            });
        },
        /**
         * 获取可用区配置.
         */
        getZoneConfig: function() {
            var service = {};
            var self = this;
            if (self.zoneConfigList.length < 1) {
                service.paramId = 'huawei:huaweiZones';
                var fn = "getListDicParamItem";
                service = Commonjs.jsonToString(service)
                var params = Commonjs.getParams(fn, service);
                Commonjs.ajaxTrue(sysurl, params, function (data) {
                    self.zoneConfigList = data.data;
                    self.getZones();
                });
            } else {
                self.getZones();
            }
        },
        /**
         * 可用区.
         */
        getZones: function () {
            this.setRegionName();
            var self = this;
            var service = {};
            service.regionId = this.form.regionId;
            var fn="huaweiZones";
            service = Commonjs.jsonToString(service);
            var params = Commonjs.getParams(fn,service);//获取参数
            Commonjs.ajaxSilence(weburl,params,true, function (data) {
                var zones = [];
                if (data.data) {
                    //数据清洗.
                    for (var i = 0; i < data.data.length; i++) {
                        var item = data.data[i];
                        if (item.zoneState.available) {
                            for (var j = 0; j < self.zoneConfigList.length; j++) {
                                var zoneConfig = self.zoneConfigList[j];
                                if (item.zoneName == zoneConfig.value) {
                                    zones.push({
                                        zoneId : item.zoneName,
                                        localName: zoneConfig.description
                                    });
                                    break;
                                }
                            }
                        }
                    }
                    self.zoneList = zones;
                    self.form.zoneId = self.zoneList[0].zoneId;
                    self.form.zoneName = self.zoneList[0].localName;
                    self.getInstanceType();
                }
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
            //重新获取实例规格.
            self.getInstanceType();
        },
        /**
         * 实例规格.
         */
        getInstanceType: function () {
            var self = this;
            var service = {};
            service.regionId = this.form.regionId;
            service.zoneId = this.form.zoneId;
            var fn="huaweiInstanceType";
            service = Commonjs.jsonToString(service);
            var params = Commonjs.getParams(fn,service);//获取参数
            Commonjs.ajaxSilence(weburl,params,false, function (data) {
                if (data.data) {
                    var instanceList = [];

                    //格式化内存.
                    for (var i = 0; i < data.data.length; i++) {
                        var instance = data.data[i];
                        /*if (undefined == instance.disabled || instance.disabled == true) {
                            continue;
                        }*/
                        //console.log(instance['OS-FLV-DISABLED:disabled'], instance.os_extra_specs['cond:operation:status']);
                        if (instance['OS-FLV-DISABLED:disabled'] == true) {
                            continue;
                        }
                        var instanceSplit = instance.id.split('.');
                        if (instanceSplit.length != 3) {
                            continue;
                        }
                        if (undefined != instance.os_extra_specs['cond:operation:az'] && instance.os_extra_specs['cond:operation:az'].indexOf(self.form.zoneId + '(normal)') < 0) {
                            continue;
                        }

                        instance.instanceTypeId = instance.id;
                        instance.cpuCoreCount = instance.vcpus;
                        instance.memorySize = instance.ram / 1024;
                        instanceList.push(instance);
                    }

                    self.instanceTypeList = instanceList;
                    self.queryTableData();
                    self.queryImages();
                }
            }, null);
        },

        /**
         * 实例名称查询.
         */
        instanceNameQuery: function() {
            this.form.cpu = "";
            this.form.memory = "";
            this.queryTableData();
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

            //实例名称查找
            var queryInstanceName = this.form.queryInstanceName;
            if ("" != queryInstanceName) {
                console.log(queryInstanceName);
                var newFilterData = [];
                filterData.forEach(function (item) {
                    if (item.id == queryInstanceName) {
                        newFilterData.push(item);
                    }
                });
                filterData = newFilterData;
            }

            //添加索引
            var index=0;
            filterData.forEach(function (item) {
                item.index=index++;
            });

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
         * 添加数据盘行.
         */
        addDiskLine: function () {
            if (this.form.dataDisk.length < 23) {
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
            var fn="huaweiImages";
            service = Commonjs.jsonToString(service)
            var params = Commonjs.getParams(fn,service);
            Commonjs.ajaxSilence(weburl,params,true,function (data) {
                if (data.data) {
                    self.imageSource = data.data;
                    data.data.forEach(function (item) {
                        if ($.inArray(item.platForm, self.osType) < 0) {
                            self.osType.push(item.platForm);
                        }
                    });
                    //console.log(self.osType);
                    if (data.data.length > 0) {
                        self.form.imageOsType = self.osType[0];
                        self.selectImage();
                    }
                }
            }, null);
        },
        /**
         * 通过分列出镜像.
         */
        selectImage: function () {
            var self = this;
            var imageList = [];
            self.imageSource.forEach(function (item) {
                if (item.platForm == self.form.imageOsType && "ACTIVE" == item.status.toUpperCase()) {
                    item.imageId = item.id;
                    item.oSName = item.name;
                    imageList.push(item);
                }
            });
            self.imageList = imageList;
            self.form.imageId = imageList[0].imageId;
            self.setImageName(self.form.imageId);
        },
        /**
         * 设置选中的镜像名称.
         * @param row
         */
        setImageName: function (row) {
            for (var i=0; i<this.imageList.length; i++) {
                if (this.imageList[i].imageId == row) {
                    this.form.imageName = this.imageList[i].oSName;
                    this.form.osType = this.imageList[i].osType.toLocaleLowerCase();
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
         * 带宽规格.
         */
        setEip: function() {
            this.currentEipList = this.eipList[this.form.regionId];
            this.form.bandwidthRuleName = this.currentEipList[0];
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
            if (!self.form.imageId || self.form.imageId == '') {
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
            service.zoneId = self.form.zoneId;
            service.osType = self.form.osType;
            service.bandwidthType = self.form.bandwidthRuleName;
            var fn="huaweiEcsBuyPrice";
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
            service.instanceDetail = Object.assign({}, self.form.currentTypeRow);
            service.sysDiskCategory = self.form.sysDiskCategory;
            service.sysDiskSize = self.form.sysDiskSize;
            service.internetMaxBandwidthOut = self.form.bandWith;
            service.period = self.form.buyTime;
            service.dataDisk = self.form.dataDisk;
            service.amount = self.form.buyTypeNumber;
            service.imageId = self.form.imageId;
            service.imageName = self.form.imageName;
            service.imageOsType = self.form.imageOsType;
            service.isSafe = self.form.isSafe ? 1 : 0;
            service.initPass = self.form.userPassword;
            service.osType = self.form.osType;
            service.bandwidthType = self.form.bandwidthRuleName;

            var fn="huaweiAddCat";
            service = JSON.stringify(service);
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
    vm.getRegions();

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
