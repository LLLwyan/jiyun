var vmVHostOpen = new Vue({
    el: '#content',
    data: function(){
    	return {
            /**
			 * 产品列表.
             */
            productListParam: [],
            /**
			 * 当前产品索引.
             */
			index: 0,
            /**
			 * 当前产品。
             */
			product: {
                productParam: {
                    allowChooseType: 2,
                    webOs: 'windows',
                    webHostNum: 0,
                    webLinksMin: 0,
                    webLinksMax: 0,
                    webWidthMin: 0,
                    webWidthMax: 0,
                    webFlowMin: 0,
                    webFlowMax: 0,
                    ftpDiskQuotaMin: 0,
                    ftpDiskQuotaMax: 0,
                    MSSQLSizeMin: 0,
                    MSSQLSizeMax: 0,
                    MSSQLLogSizeMin: 0,
                    MSSQLLogSizeUnit: 0,
                    mySQLSizeMin: 0,
                    mySQLSizeMax: 0,
                    buyMaxNum: 5
                }
            },
            /**
			 * 可用地域.
             */
            regionList: [],
            /**
			 * 服务器列表.
             */
			serverList: [],
            /**
             * 服务项列表.
             */
            serviceTypeList: [],
            serverNames: {
                web: 'WEB服务',
                ftp: 'FTP服务',
                mysql: 'MySQL服务',
                mssql: 'SQL Server服务'
            },
            /**
             * 可选服务器信息.
             */
            enableServer: {
                web: [],
                ftp: [],
                mysql: [],
                mssql: []
            },
            osTypeList: [],
            /**
			 * 表单数据.
             */
            form: {
                regionId: '',
				regionName: '',
                openServerList: [],
                webLinks: 0,
                webWidth: 0,
                webFlow: 0,
                ftpDiskQuota: 0,
                MSSQLSize: 0,
                MSSQLLogSize: 0,
                mySQLSize: 0,
                num: 1
			}
    	}
    },
    methods: {
        /**
		 * 加载产品.
         */
    	loadProductList: function () {
    		var self = this;
            var service = {};
            service.productClass = 'vhost';
            var fn="getCustomerProductList";
            service = Commonjs.jsonToString(service);
            var params = Commonjs.getParams(fn,service);//获取参数
            Commonjs.ajaxSilence(weburl,params,true, function (data) {
                self.productListParam = data.data;
                //渲染没有时间差，会导致问题.
                setTimeout(function() {
                    self.changeProduct(0);
                }, 500);
            }, null);
        },
        /**
		 * 选择产品.
         */
        changeProduct: function (index) {
			this.index = index;
			this.product = this.productListParam[index];
            this.loadOpenOption();
            this.loadApplyTime();
        },

        /**
         * 加载可用地域.
         */
        loadRegions: function() {
            var self = this;
            var service = {};
            service.hostType = 'vhost';
            var fn="queryHostlist";
            service = Commonjs.jsonToString(service);
            var params = Commonjs.getParams(fn,service);//获取参数
            Commonjs.ajaxSilence(weburl,params,true, function (data) {
                self.regionList = data.data;
                if (data.data.length > 0) {
                    self.form.regionId = data.data[0].regionId;
                    self.form.regionName = data.data[0].regionName;
                } else {
                    self.form.regionId = '';
                    self.form.regionName = '';
				}
            }, null);
        },
        /**
		 * 可用区选择.
         */
        regionChange: function () {
            var self = this;
            if ('随机分配' == self.form.regionName) {
                self.form.regionId = 'random';
            } else {
                self.regionList.forEach(function (item) {
                    if (item.regionName == self.form.regionName) {
                        self.form.regionId = item.regionId;
                    }
                })
            }

            self.loadOpenOption();
        },

		loadOpenOption: function () {
        	var self = this;
			if (self.form.regionId == '' || self.productListParam.length < 1) {
				return;
			}

			//获取可用区的服务器列表
            var self = this;
            var service = {};
            service.hostType = 'vhost';
            service.regionId = self.form.regionId;
            service.page = 1;
            service.pagesize = 500;
            var fn="queryServicePublic";
            service = Commonjs.jsonToString(service);
            var params = Commonjs.getParams(fn,service);//获取参数
            Commonjs.ajaxSilence(weburl,params,true, function (data) {
                var serverMap = {};
                for (var i=0; i<data.data.length; i++) {
                    self.serverList.push(data.data[i].hostId);
                    serverMap[data.data[i].hostId] = data.data[i];
				}

				var keyNames = {
                    web: 'serverWeb',
                    ftp: 'serverFtp',
                    mysql: 'serverMySQL',
                    mssql: 'serverSQLServer'
                };
                var hasWeb = false;

				var serviceType = self.product.productParam.serviceType;
                var serviceTypeArr = serviceType.split(",");
                var defaultOpenServiceType = [];
                var serviceTypeList = [];
                var enableService = {};
                var serviceTypeHas = [];
                for (var j=0; j<serviceTypeArr.length; j++) {
                    var service = serviceTypeArr[j];
                    if ('web' == service) {
                        hasWeb = true;
                    }
                    var paramsKey = keyNames[service];
                    if ('ftp' == service && hasWeb) {
                        paramsKey = keyNames['web'];
                    }
                    var supportHostsString = self.product.productParam[paramsKey];
                    var supportHostArr = supportHostsString.split(",");

                    enableService[service] = []
                    for (var m=0; m<supportHostArr.length; m++) {
                        if ($.inArray(supportHostArr[m], self.serverList) > -1) {
                            if ($.inArray(service, serviceTypeHas) < 0) {
                                serviceTypeList.push({
                                    type: service,
                                    name: self.serverNames[service]
                                });
                                serviceTypeHas.push(service);
                            }
                            defaultOpenServiceType.push(self.serverNames[service]);

                            enableService[service].push(serverMap[supportHostArr[m]]);
                        }
                    }
                }
                self.form.openServerList = defaultOpenServiceType;
                self.serviceTypeList = serviceTypeList;
                self.enableServer = enableService;
                self.getPrice();
            }, null);
        },
        /**
         * 是否有申请web服务.
         * @returns {boolean}
         */
        hasWeb: function () {
            var self = this;
            for (var i=0; i<self.form.openServerList.length; i++) {
                if (self.form.openServerList[i] == self.serverNames.web) {
                    return true;
                }
            }
            return false;
        },

        /**
         * 是否有申请ftp服务.
         * @returns {boolean}
         */
        hasFtp: function () {
            var self = this;
            for (var i=0; i<self.form.openServerList.length; i++) {
                if (self.form.openServerList[i] == self.serverNames.ftp) {
                    return true;
                }
            }
            return false;
        },

        /**
         * 是否有申请SQL Server服务.
         * @returns {boolean}
         */
        hasSqlServer: function() {
            var self = this;
            for (var i=0; i<self.form.openServerList.length; i++) {
                if (self.form.openServerList[i] == self.serverNames.mssql) {
                    return true;
                }
            }
            return false;
        },

        /**
         * 是否有申请mysql服务.
         * @returns {boolean}
         */
        hasMySQL: function() {
            var self = this;
            for (var i=0; i<self.form.openServerList.length; i++) {
                if (self.form.openServerList[i] == self.serverNames.mysql) {
                    return true;
                }
            }
            return false;
        },

        /**
         * 可选购买时长
         */
        loadApplyTime: function () {
            var self = this;
            var service = {};
            service.productClass = self.product.productClass;
            service.productCode = self.product.productCode;
            service.chargeId = 1;
            var fn="getCloudProduct";
            service = Commonjs.jsonToString(service);
            var params = Commonjs.getParams(fn,service);//获取参数
            var result=Commonjs.ajax(weburl,params,false);
            if(result.result == "success"){
                if(result.data!=null || result.data.length>0){
                    var list=result.data.promotionList;
                    if(list!=null && list.length>0){
                        var html='';
                        BaseForeach(list,function(i,item){
                            var saleHtml='';
                            var saleTitle='';
                            var type='';
                            if(isNotNull(item.saleValue)){
                                saleHtml='<span class="badge salemsg">优惠</span>';
                                if(item.applyType=="y")
                                    type='年';
                                else if(item.applyType=="m")
                                    type='个月';

                                if(item.saleType==1)
                                    saleTitle='购买'+item.applyTime+type+'赠送'+item.saleValue+'个月';
                                else if(item.saleType==2)
                                    saleTitle='购买'+item.applyTime+type+'享'+item.saleValue+'折';
                                else if(item.saleType==3)
                                    saleTitle='购买'+item.applyTime+type+'赠送'+item.saleValue+'天';
                            }

                            if(item.applyType=="m")
                                html+='<dt class="time" time='+item.applyTime+' type='+item.applyType+' data-toggle="tooltip" data-placement="top" title="'+saleTitle+'">'+item.applyTime+'个月'+saleHtml+'</dt>';
                            else if(item.applyType=="y")
                                html+='<dt class="time pos-r" time='+item.applyTime+' type='+item.applyType+' data-toggle="tooltip" data-placement="top" title="'+saleTitle+'">'+item.applyTime+'年'+saleHtml+'</dt>';
                        });
                        $("#timelist").html(html);
                        $(".time").eq(0).addClass("active");
                        $("#curApplyTime").attr("time",$(".time").eq(0).attr("time"));
                        $("#curApplyTime").attr("type",$(".time").eq(0).attr("type"));
                        $("#discountInfo").html($(".config-box dl dt").eq(0).attr("title"));
                    }
                    $(".config-box dl dt").click(function(){
                        $(this).addClass('active').siblings().removeClass('active');
                        if($(this).attr("type")=="y")
                            $("#curApplyTime").html($(this).attr("time")+"年");
                        if($(this).attr("type")=="m")
                            $("#curApplyTime").html($(this).attr("time")+"个月");
                        $("#curApplyTime").attr("time",$(this).attr("time"));
                        $("#curApplyTime").attr("type",$(this).attr("type"));
                        $("#discountInfo").html($(this).attr("title"));
                        self.getPrice();
                    });

                    setTimeout(function () {
                        self.getPrice();
                    }, 2000)

                }
            }
        },

        /**
         * 获取价格.
         */
        getPrice: function () {
            var self = this;
            var service = {};
            service.hostType = self.product.regType;
            service.productCode = self.product.productCode;
            service.webLinks = self.form.webLinks;
            service.webWidth = self.form.webWidth;
            service.webFlow = self.form.webFlow;
            service.ftpDiskQuota = self.form.ftpDiskQuota;
            service.MSSQLSize = self.form.MSSQLSize;
            service.MSSQLLogSize = self.form.MSSQLLogSize;
            service.mySQLSize = self.form.mySQLSize;
            service.applyTime = $("#curApplyTime").attr("time");
            service.priceType = $("#curApplyTime").attr("type");
            service.num = self.form.num;
            service.regionId = self.form.regionId;
            var openServiceType = "";
            if (self.hasWeb()) {
                openServiceType += ("" == openServiceType ? "": ",") + "web,ftp";
            }
            if (!self.hasWeb() && self.hasFtp()) {
                openServiceType += ("" == openServiceType ? "": ",") + "ftp";
            }
            if (self.hasSqlServer()) {
                openServiceType += ("" == openServiceType ? "": ",") + "mssql";
            }
            if (self.hasMySQL()) {
                openServiceType += ("" == openServiceType ? "": ",") + "mysql";
            }
            service.openServiceType = openServiceType;

            var fn="getVHostPrice";
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
                        if (isNotNull(result.data)) {
                            $("#price").html(result.data.payPrice);
                            $("#totalPrice").html(result.data.totalPrice);
                            $("#discountPrice").html(result.data.discountPrice);
                            $("#discountInfo").show();
                            if (result.data.discountPrice == 0) {
                                $("#discountMsg").hide();
                            }
                            else {
                                $("#discountMsg").show();
                            }
                        }

                        if ((self.hasWeb() || self.hasFtp() || self.hasSqlServer() || self.hasMySQL())) {
                            $("#btnBuy").removeClass("disable");
                            $("#btnBuy").attr("onclick", "vmVHostOpen.addUserCart(0)");
                            $("#btnBuyNow").removeClass("disable");
                            $("#btnBuyNow").attr("onclick", "vmVHostOpen.addUserCart(1)");
                        } else {
                            $("#btnBuy").addClass("disable");
                            $("#btnBuy").unbind('click');
                            $("#btnBuyNow").addClass("disable");
                            $("#btnBuyNow").unbind("click");
                        }
                    } else {
                        $("#btnBuy").addClass("disable");
                        $("#btnBuy").unbind('click');
                        $("#btnBuyNow").addClass("disable");
                        $("#btnBuyNow").unbind("click");
                    }
                }
            });
        },

        /**
         * 购买.
         */
        addUserCart: function (buyNowFlag) {
            var self = this;
            var service = {};
            service.productCode=self.product.productCode;
            service.applyTime=$("#curApplyTime").attr("time");
            service.priceType=$("#curApplyTime").attr("type");
            service.cartType="add";

            var instance={};
            instance.webLinks = self.form.webLinks;
            instance.webWidth = self.form.webWidth;
            instance.webFlow = self.form.webFlow;
            instance.ftpDiskQuota = self.form.ftpDiskQuota;
            instance.MSSQLSize = self.form.MSSQLSize;
            instance.MSSQLLogSize = self.form.MSSQLLogSize;
            instance.mySQLSize = self.form.mySQLSize;
            instance.regionId = self.form.regionId;
            var openServiceType = "";
            if (self.hasWeb()) {
                openServiceType += ("" == openServiceType ? "": ",") + "web,ftp";
            }
            if (!self.hasWeb() && self.hasFtp()) {
                openServiceType += ("" == openServiceType ? "": ",") + "ftp";
            }
            if (self.hasSqlServer()) {
                openServiceType += ("" == openServiceType ? "": ",") + "mssql";
            }
            if (self.hasMySQL()) {
                openServiceType += ("" == openServiceType ? "": ",") + "mysql";
            }
            instance.openServiceType = openServiceType;
            instance.openServiceType
            service.productParam=Commonjs.jsonToString(instance);
            service.num=self.form.num;

            var fn="addUserCartVHost";
            service = Commonjs.jsonToString(service);
            var params = Commonjs.getParams(fn,service);//获取参数
            Commonjs.ajaxTrue(weburl,params,function (data) {
                if(data.data==null)
                    return;

                var result=data.data;
                if(result.code=="0") {
                    if (buyNowFlag == 1) {
                        window.location.href=Commonjs.getCfgVal(configParam.common.cfgKey.template)+"/usercenter/shopping/shoppinglist.html";
                    } else {
                        //$.tooltip("添加到购物车成功", 2000, true);
                        Commonjs.tips("已添加到购物车", true);
                        queryUserCartCount();
                    }
                }else if(result.code=="-1"){
                    Commonjs.alert(result.message);
                }
            },true,"正在加入购物车中...");
        }
	},
    mounted: function () {
    	this.loadProductList();
    	this.loadRegions();
    }
});
