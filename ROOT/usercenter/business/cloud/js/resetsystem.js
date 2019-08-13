var instanceId;
var maxSysDisk = 2000;

$(function(){
	instanceId=request("iId");
	queryUserService();

	//操作系统类型
    $("#sel .sel-inp").click(function(){
    	$("#sel .sel-m").toggle();
    });

    $("#syssize").change(function(){
    	var oldSize=$("#systemDiskSize").val();
    	if(parseInt($(this).val())<parseInt(oldSize))
			$(this).val(oldSize);

    	if(!CndnsValidate.checkNumber($(this).val())){
            Commonjs.alert('系统盘必须是整数',false);
            $(this).val(oldSize);
            return false;
        }
    });
});

function queryUserService(){
	var service = {};
	service.instanceId=instanceId;
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
	vm.hostType = view.hostType;
	var disklist=data.data.disklist;
	jointHtml(view,info,disklist);
	$.each(disklist,function(i,item) {
        if (item.diskAttribute == 1) {
        	vm.sysDiskSizeMin = item.diskSize;
        	vm.form.sysDiskSize = item.diskSize;
        }
    });
	$("#hostType").val(view.hostType);
	$("#productCode").val(view.productCode);
	$("#osType").val(info.osType);
	$("#osVersion").val(info.osVersion);

    if (vm.hostType != 'hyperv') {
        vm.loadInfo(view);
    } else {
        getProductInfo();
        getImageOsType(view.regionId);
	}
}

//获取产品信息
function getProductInfo(){
	var service = {};
	service.regType = $("#hostType").val();
	var fn="getCloudProduct";
	service = Commonjs.jsonToString(service);
	var params = Commonjs.getParams(fn,service);//获取参数
	var result=Commonjs.ajax(weburl,params,false);
	if(result.result == "success"){
		if(result.data!=null || result.data.length>0){
			var view=result.data.productView;
			if(view!=null && view!=""){
				$("#windowsMinSize").val(view.productParam.windowsMinSize);
				$("#otherMinSize").val(view.productParam.otherMinSize);
				maxSysDisk=view.productParam.sysDiskMaxSize;
				getLastReset(view.productCode,view.productParam.resetLimit);
			}
		}
	}
}

function getLastReset(productCode,resetLimit){
	if(resetLimit=="")
		return;

	var service = {};
	service.instanceId = instanceId;
	service.productCode = productCode;
	var fn="queryLastResetUsR";
	service = Commonjs.jsonToString(service);
	var params = Commonjs.getParams(fn,service);//获取参数
	var result=Commonjs.ajax(weburl,params,false);
	if(result.result == "success"){
		if(result.data==null || result.data.length<=0)
			return;
		var view=result.data.view;
		if(view==null || view==""){
			$("#resetLimit").html("提示：系统规定每隔"+resetLimit+"个小时只能重装一次");
			return;
		}

		$("#resetLimit").html("提示：系统规定每隔"+resetLimit+"个小时只能重装一次，最近一次重装时间："+jsonDateTimeFormat(view.operateTime));
		if(!result.data.sureReset){
			$("#btnConfirm").addClass("disable");
			$("#btnConfirm").removeAttr("onclick");
		}
	}
}

var allImages = [];

//获取镜像操作系统类型
function getImageOsType(regionId){
	var service = {};
	service.hostType = $("#hostType").val();
	if ('aliyun' == service.hostType) {

        service = {};
        service.regionId=regionId;
        var fn="aliyunImages";
        service = Commonjs.jsonToString(service)
        var params = Commonjs.getParams(fn,service);
        Commonjs.ajaxSilence(weburl,params,false,function (data) {
            if (data.data) {
            	var osType = [];
                allImages = data.data;
                data.data.forEach(function (item) {
                    if ($.inArray(item.oSType, osType) < 0) {
                        osType.push(item.oSType);
                    }
                });
                var html = "";
                osType.forEach(function (value) {
                    html+='<div class="sel-m-o">';
                    html+='<span></span>';
                    html+='<p>'+value+'</p>';
                    html+='<i></i>';
                    html+='<div class="clear"></div>';
                    html+='</div>';
				});
                $('#osTypeList').html(html);
                getImageOsName($("#defaultType").html(),$("#systemDiskSize").val(),regionId);
                //操作系统版本
                $("#osVersion .sel-inp").click(function(){
                    $("#osVersion .sel-m").toggle();
                });

                //选择系统类型
                $("#sel .sel-m .sel-m-o").click(function() {
                    var x = $(this).find("p").text();
                    $("#sel .sel-inp p").text(x);
                    $("#sel .sel-m").hide();
                });
            }
        }, null);

		return;
	}
	service.regionId = regionId;
	var fn="getImageOsTypeList";
	service = Commonjs.jsonToString(service);
	var params = Commonjs.getParams(fn,service);//获取参数

	var windowsMinSize = parseInt($("#windowsMinSize").val());
	var otherMinSize = parseInt($("#otherMinSize").val());
	$.ajax({
		datatype:"json",
        type:"POST",
        url: weburl,
        data:params,
		cache : false,
		success: function(data){
			var data=jQuery.parseJSON(data);
			var html='';
			if (data.data.length>0){
				BaseForeach(data.data,function(i,item){
					if(i==0){
						$("#defaultType").html($("#osType").val());
					}
					html+='<div class="sel-m-o">';
					html+='<span></span>';
					html+='<p>'+item.osType+'</p>';
					html+='<i></i>';
					html+='<div class="clear"></div>';
					html+='</div>';
				});
				getImageOsName($("#defaultType").html(),$("#systemDiskSize").val(),regionId);
			}
			$('#osTypeList').html(html);

			//操作系统版本
			$("#osVersion .sel-inp").click(function(){
				$("#osVersion .sel-m").toggle();
			});

			//选择系统类型
			$("#sel .sel-m .sel-m-o").click(function(){
				var x=$(this).find("p").text();
				$("#sel .sel-inp p").text(x);
				$("#sel .sel-m").hide();

				var wSize=parseInt($("#windowsMinSize").val());
		    	var lSize=parseInt($("#otherMinSize").val());
		    	var oldSize=parseInt($("#systemDiskSize").val());
		    	var curSize=0;
		    	if(x.toLowerCase()=="windows"){
		    		if(oldSize<wSize)
		    			curSize = wSize;
		    		else
		    			curSize = oldSize;
		    	}else{
		    		if(oldSize<lSize)
		    			curSize = lSize;
		    		else
		    			curSize = oldSize;
		    	}
		    	$("#syssize").val(curSize);
    			getResizeDiskPrice();
				getImageOsName(x, curSize, regionId);
			});
		}
	});
}

//获取镜像操作系统版本
function getImageOsName(osType, curSize, regionId){
	curSize=parseInt(curSize);
	new SlideBar({
		actionBlock : 'action-block1',
		actionBar : 'action-bar1',
		slideBar : 'scroll-bar1',
		barLength : 220,
		interval : (maxSysDisk-curSize),
		minNumber : curSize,
		maxNumber : maxSysDisk,
		showArea : 'syssize',
		curBandwidth : 'curSysDisk',
		unit : 'GB',
	    clickfn : systemSize
	});

	var service = {};
	service.hostType = $("#hostType").val();
	service.osType=osType;
	service.regionId = regionId;
	var fn="getImageOsNameList";
	service = Commonjs.jsonToString(service);
	var params = Commonjs.getParams(fn,service);//获取参数
	$.ajax({
		datatype:"json",
        type:"POST",
        url: weburl,
        data:params,
		cache : false,
		success: function(data){
			var data=jQuery.parseJSON(data);
			var html='';
			if (data.data.length>0){
				BaseForeach(data.data,function(i,item){
					if(i==0){
						$("#defaultVersion").html(item.osName);
					}
					html+='<div class="sel-m-o" onclick="selectVersion('+i+')">';
					html+='<p id="version_'+i+'" data-value="'+item.imageId+'">'+item.osName+'</p>';
					html+='<i></i>';
					html+='<div class="clear"></div>';
					html+='</div>';
				});
			}
			$('#osNameList').html(html);
			$("#imageId").val($("#version_0").attr("data-value"));
			getResizeDiskPrice();
		}
	});
}

var systemSize=function(){
	var wSize=$("#windowsMinSize").val();
   	var lSize=$("#otherMinSize").val();
   	if($("#defaultType").html().toLowerCase()=="windows"){
   		if(parseInt($("#syssize").val())<parseInt(wSize))
   			$($("#syssize")).val(wSize);
   	}
    else{
     	if(parseInt($("#syssize").val())<parseInt(lSize))
 			$("#syssize").val(lSize);
    }
   	getResizeDiskPrice();
};

//操作系统类型
$("#sel .sel-inp").click(function(){
	$("#sel .sel-m").toggle();
});

//选择系统版本
function selectVersion(i){
	$("#osVersion .sel-inp p").text($("#version_"+i).html());
	$("#curOs").html($("#version_"+i).html());
	$("#curOs").attr("data-value",$("#version_"+i).attr("data-value"));
	$("#osVersion .sel-m").hide();
	$("#imageId").val($("#version_"+i).attr("data-value"));
}

function getResizeDiskPrice(){
	if (vm.hostType=='aliyun') {
		return;
	}
	var service = {};
	service.hostType=$("#hostType").val();
	service.productCode=$("#productCode").val();
	service.instanceId = instanceId;
	service.osType=$("#defaultType").html();
	service.systemDiskSize=$("#syssize").val();
	var fn="getResizeSystemDiskPrice";
	service = Commonjs.jsonToString(service);
	var params = Commonjs.getParams(fn,service);//获取参数
	Commonjs.ajaxTrue(weburl,params,getDiskPriceSuccess,false);
}

function getDiskPriceSuccess(data){
	$("#diskprice").html(data.data+"元");
	$("#diskprice").attr("data-value",data.data);
}

//点击其他地方收缩
$("body").click(function(e){
	if($(e.target).parents(".sel").length==0){
		$(".sel-m").hide();
	}
	if($(e.target).parents(".sysdisk").length==0){
		$(".sysdisk-m").hide();
	}
	if($(e.target).parents(".datadisk").length==0){
		$(".datadisk-m").hide();
	}
});

function confirmReset(){
	var loginPwd=$("#loginPwd");
	var confirmPwd=$("#confirmPwd");
	var preg = /(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,30}/;
	if(Commonjs.isEmpty(loginPwd.val())){
		Commonjs.alert("登入密码不能为空");
		return false;
	}
	if(Commonjs.isEmpty(confirmPwd.val())){
		Commonjs.alert("确认密码不能为空");
		return false;
	}
	if(loginPwd.val() != confirmPwd.val()){
		Commonjs.alert("密码不一致");
		return false;
	}
	if(!preg.test(loginPwd.val())){
		Commonjs.alert("密码复杂度不够");
		return false;
	}

	art.dialog({
		id:'testID',
		width:'245px',
		height:'109px',
		content:'您确定要重装吗？',
		lock:true,
		button:[{
			name:'确定',
			callback:function(){
				var service = {};
				service.hostType=$("#hostType").val();
				service.productCode=$("#productCode").val();
				service.instanceId = instanceId;
				service.osType=$("#defaultType").html();
				service.systemDiskSize=$("#syssize").val();
				service.imageId=$("#imageId").val();
				service.loginPwd=$("#loginPwd").val();
				service.confirmPwd=$("#confirmPwd").val();
				var fn="resetUserService";
				service = Commonjs.jsonToString(service);
				var params = Commonjs.getParams(fn,service);//获取参数
				Commonjs.ajaxTrue(weburl,params,reSetSuccess,false);
			}
		}, {
			name:'取消'
		}]
	});
}

function reSetSuccess(data){
	var result=data.data;
	if(result==null)
		return false;

	if(result.code==0){
		if(result.resetType=="extend")
			window.parent.frames.location.href=realPath+"/usercenter/shopping/shoppinglist.html";
		else
			window.location.href="server.html";
	}else if(result.code==-1){
		if(result.time=="Y")
			Commonjs.alert("未到再次重装时间，请稍后再试");
		else
			Commonjs.alert(result.message,false);
		return false;
	}
}


var vm = new Vue({
    el: '#MainContentDIV',
    data: function () {
        return {
            form: {
            	regionId: '',
                imageOsType:'',
                imageId:'',
				imageName:'',
                sysDiskSize: 40,
                moneyTotal: 0,
                isSafe: false,
                userPassword: '',
                userPasswordSure: '',
				osType:''
            },
            sysDiskSizeMin: 40,
            productCode:'',
            hostType: 'hyperv',
            /**
             * 当前价格.
             */
            price:{
                discountPrice: 0.0,
                originalPrice: 0.0,
                tradePrice: 0.0
            },
            /**
             * 镜像源数据.
             */
            imageSource: [],
            /**
			 * 系统分类.
             */
            osType: [],
            /**
			 * 镜像列表.
             */
            imageList: []
        }
    },
    methods: {
    	loadInfo: function(view) {
            this.productCode = view.productCode;
            this.form.regionId = view.regionId;
            if (this.hostType == 'aliyun') {
                this.queryImages();
			} else if (this.hostType == 'huawei') {
            	this.queryHuaweiImage();
            } else {
            	this.currencyQueryImages();
			}
		},
        submitClick: function () {
            if (this.hostType == 'hyperv') {
                confirmReset();
            } else if (this.hostType == 'aliyun') {
				this.aliyunSubmit();
            } else if (this.hostType == 'huawei') {
            	this.huaweiSubmit();
			}
        },
		aliyunSubmit: function() {
    		if (!this.form.isSafe) {
                this.form.userPassword = random.getCloudPass();
                this.form.userPasswordSure = this.form.userPassword;
			}
            var loginPwd=this.form.userPassword;
            var confirmPwd=this.form.userPasswordSure;
            var preg = /(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,30}/;
            if (Commonjs.isEmpty(this.form.imageId)) {
            	this.$message.error('请选择操作系统');
            	return false;
			}
            if(Commonjs.isEmpty(loginPwd)){
                this.$message.error("登入密码不能为空");
                return false;
            }
            if(Commonjs.isEmpty(confirmPwd)){
                this.$message.error("确认密码不能为空");
                return false;
            }
            if(loginPwd != confirmPwd){
                this.$message.error("密码不一致");
                return false;
            }
            if(!preg.test(loginPwd)){
                this.$message.error("密码复杂度不够");
                return false;
            }

            var self = this;

            this.$confirm('您确定要重装吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(function (){
                var service = {};
                service.instanceId = instanceId;
                service.systemDiskSize=self.form.sysDiskSize;
                service.imageId=self.form.imageId;
                service.imageName=self.form.imageName;
                service.loginPwd=cloudEncrypt.encodeSession(self.form.userPassword);
                var fn="resetUserServiceAliyun";
                service = Commonjs.jsonToString(service);
                var params = Commonjs.getParams(fn,service);//获取参数
                Commonjs.ajaxTrue(weburl,params,function () {
                    window.parent.frames.location.href=realPath+"/usercenter/shopping/shoppinglist.html";
                },false);
			}).catch(function(){
			});
		},
        /**
		 * 华为重装系统提交.
         */
        huaweiSubmit: function() {
            if (!this.form.isSafe) {
                this.form.userPassword = random.getCloudPass();
                this.form.userPasswordSure = this.form.userPassword;
            }
            var loginPwd=this.form.userPassword;
            var confirmPwd=this.form.userPasswordSure;
            var preg = /(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,30}/;
            if (Commonjs.isEmpty(this.form.imageId)) {
                this.$message.error('请选择操作系统');
                return false;
            }
            if(Commonjs.isEmpty(loginPwd)){
                this.$message.error("登入密码不能为空");
                return false;
            }
            if(Commonjs.isEmpty(confirmPwd)){
                this.$message.error("确认密码不能为空");
                return false;
            }
            if(loginPwd != confirmPwd){
                this.$message.error("密码不一致");
                return false;
            }
            if(!preg.test(loginPwd)){
                this.$message.error("密码复杂度不够");
                return false;
            }

            var self = this;

            this.$confirm('您确定要重装吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(function (){
                var service = {};
                service.instanceId = instanceId;
                service.imageId=self.form.imageId;
                service.imageName=self.form.imageName;
                service.loginPwd=cloudEncrypt.encodeSession(self.form.userPassword);
                service.imageOsType = self.form.imageOsType;
                service.osType = self.form.osType;
                var fn="resetUserServiceHuawei";
                service = Commonjs.jsonToString(service);
                var params = Commonjs.getParams(fn,service);//获取参数
                Commonjs.ajaxTrue(weburl,params,function () {
                    this.$message.success("操作成功，系统正在重装中，请稍后...");
                    location.reload();
                },false);
            }).catch(function(){
            });
		},
        getPrice: function () {
            var self = this;
            if (self.form.imageId == '') {
            	return;
			}
            self.form.moneyTotal = -1;
            var service = {};
            service.instanceId = instanceId;
            service.imageId = self.form.imageId;
            service.sysDiskSize = self.form.sysDiskSize;
            var fn="getReplaceSystemPriceAliyun";
            service = Commonjs.jsonToString(service)
            var params = Commonjs.getParams(fn,service);
            Commonjs.ajaxSilence(weburl,params,true,function (data) {
                if (data.data.tradePrice) {
                    self.form.moneyTotal = data.data.tradePrice;
                    self.price = data.data;
                } else {
                    self.form.moneyTotal = 0;
                    self.price = {
                        discountPrice: 0.0,
                        originalPrice: 0.0,
                        tradePrice: 0.0
                    };
				}
            }, null, true);
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
            Commonjs.ajaxSilence(weburl,params,false,function (data) {
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
            }, null);
        },

        /**
		 * 查询华为镜像.
         */
        queryHuaweiImage: function() {
            var self = this;
            var service = {};
            service.regionId=self.form.regionId;
            var fn="huaweiImages";
            service = Commonjs.jsonToString(service)
            var params = Commonjs.getParams(fn,service);
            Commonjs.ajaxSilence(weburl,params,false,function (data) {
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
                        self.selectHuaweiImage();
                    }
                }
            }, null);
		},

        /**
		 * 通用产品式获取镜像.
         */
        currencyQueryImages: function() {
            var self = this;
            var service = {};
            service.regionId=self.form.regionId;
            var fn="currencyEcsImages";
            service = Commonjs.jsonToString(service)
            var params = Commonjs.getParams(fn,service);
            Commonjs.ajaxSilence(weburl,params,false,function (data) {
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
		 * 分离华为镜像
         */
        selectHuaweiImage: function () {
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
            self.setHuaweiImageName(self.form.imageId);
        },

        /**
		 * 置选中的镜像名称.
         * @param row
         */
        setHuaweiImageName: function (row) {
            for (var i=0; i<this.imageList.length; i++) {
                if (this.imageList[i].imageId == row) {
                    this.form.imageName = this.imageList[i].oSName;
                    this.form.osType = this.imageList[i].osType.toLocaleLowerCase();
                    break;
                }
            }
            //this.getPrice();
        }
    },
    mounted: function () {
    }
});
