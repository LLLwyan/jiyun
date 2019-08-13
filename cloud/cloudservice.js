var minSysDisk = 20;
var minDataDisk = 0;
var maxDataDisk = 2000;
var minBandwidth = 1;
var status;
var remark;
var netty = "PRI";
var allShareIp = "N";
var ipType = "PRI";

var clickfn = function(){
    getPrice();
};

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
	getPrice();
};

$(document).ready(function(){
	getProductInfo();
	getRegion();
	getNetworkType();

	$('#szmm').click(function(){
		$('#cjsz').removeClass('bs');
		$(this).addClass('bs');
		$('#szpass').css('display','block');
		$('#cgsz').css('display','none');
	});
	$('#cjsz').click(function(){
		$('#szmm').removeClass('bs');
		$(this).addClass('bs');
		$('#szpass').css('display','none');
		$('#cgsz').css('display','block');

		$("#loginPwd").val("");
		$("#confirmPwd").val("");
		$("#errorMsg").html("");
	});

	var productCode = $("#productCode").val();
	var maxBandwidth = parseInt($("#maxBandwidth").val());
	var windowsMinSize = parseInt($("#windowsMinSize").val());
	var otherMinSize = parseInt($("#otherMinSize").val());
	$("#curSysDisk").html(minSysDisk+"GB");
	$("#curDataDisk").html("0GB");

	//滑块  带宽
	new SlideBar({
		actionBlock : 'action-block3',
		actionBar : 'action-bar3',
		slideBar : 'scroll-bar3',
		barLength : 550,
		interval : (maxBandwidth-minBandwidth),
		minNumber : minBandwidth,
		maxNumber : maxBandwidth,
		showArea : 'showArea',
		curBandwidth : 'curBandwidth',
		unit : 'Mbps',
	    clickfn : clickfn
	});

	//网络类型
	$(".nettype dl dt").click(function(){
		$(this).addClass('active').siblings().removeClass('active');
		$("#curNettype").html($(this).html());
		$("#curNettype").attr("data-value",$(this).attr("data-value"));
	});

    //操作系统类型
    $("#sel .sel-inp").click(function(){
    	$("#sel .sel-m").toggle();
    });

	//系统盘
    $("#sysdisk .sysdisk-inp").click(function(){
    	$(".sysdisk-m").toggle();
    });

	//数据盘
    $("#datadisk .datadisk-inp").click(function(){
    	$(".datadisk-m").toggle();
    });

    $("#syssize").change(function(){
    	var wSize=$("#windowsMinSize").val();
    	var lSize=$("#otherMinSize").val();
    	var defSize = 0;
    	if($("#defaultType").html().toLowerCase()=="windows"){
    		defSize = wSize;
    		if(parseInt($(this).val())<parseInt(wSize))
    			$(this).val(wSize);
    	}
        else{
        	defSize = lSize;
        	if(parseInt($(this).val())<parseInt(lSize))
    			$(this).val(lSize);
        }

    	if(!CndnsValidate.checkNumber($(this).val())){
            Commonjs.alert('系统盘必须是整数',false);
            $(this).val(defSize);
            return false;
        }

        $("#curSysDisk").html($(this).val()+"GB");
    })

    $("#datasize").change(function(){
        if(!CndnsValidate.checkNumber($(this).val())){
            Commonjs.alert('数据盘必须是整数',false);
            $(this).val(1);
            return false;
        }

        if($(this).val()=="0"){
        	$(this).val(1);
        }
    	$("#curDataDisk").html($(this).val()+"GB");
    })

    $("#showArea").change(function(){
        if(!CndnsValidate.checkNumber($(this).val())){
            Commonjs.alert('带宽必须是整数',false);
            $(this).val(1);
        }
        if($(this).val()=="0"){
        	$(this).val(1);
        }
   	 	getPrice();
    })

    //购买数量
    $("#num-inp").change(function(){
        if(!CndnsValidate.checkNumber($(this).val())){
            Commonjs.alert('购买数必须是整数',false);
            $(this).val(1);
            return false;
        }
   	 	getPrice();
    })

    $(".numAdd").click(function(){
    	var num=$("#num-inp").val();
    	num=parseInt(num)+1;
    	$("#num-inp").val(num);
    	$("#curNum").html(num+"台");
    	 getPrice();
    });

    $(".numSubtract").click(function(){
    	var num=$("#num-inp").val();
    	num=parseInt(num)-1;
    	if(num>0){
    		$("#num-inp").val(num);
        	$("#curNum").html(num+"台");
        	 getPrice();
    	}
    });

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
});

//选择系统版本
function selectVersion(i){
	$("#osVersion .sel-inp p").text($("#version_"+i).html());
	$("#curOs").html($("#version_"+i).html());
	$("#curOs").attr("data-value",$("#version_"+i).attr("data-value"));
	$("#osVersion .sel-m").hide();
}

//获取地域
function getRegion(){
	var service = {};
	service.hostType = $("#hostType").val();
	var fn="queryHostlist";
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
						html+='<dt data-value="'+item.regionId+'">'+item.regionName+'</dt>';
					});
				}
				$('#regionlist').html(html);
				var region=$(".region dl dt").eq(0);
				region.addClass('active');
				$("#curRegion").html(region.html());
				$("#curRegion").attr("data-value",region.attr("data-value"));

			    //选择地域
			    $(".region dl dt").click(function(){
					$(this).addClass('active').siblings().removeClass('active');
					$("#curRegion").html($(this).html());
					$("#curRegion").attr("data-value",$(this).attr("data-value"));

					getZone($(this).attr("data-value"));
					getImageOsType($(this).attr("data-value"));
				});
				getZone(region.attr("data-value"));
				getImageOsType(region.attr("data-value"));
			}
		}
	});
}

//获取可用区
function getZone(regionId){
	var service = {};
	service.regionId = regionId;
	var fn="queryDicZoneList";
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
						html+='<dt data-value="'+item.zoneId+'">'+item.zoneName+'</dt>';
					});
				}
				$('#arealist').html(html);
				var area=$(".area dl dt").eq(0);
				if(area.length!=0){
					area.addClass('active');
					$("#curArea").html(area.html());
					$("#curArea").attr("data-value",area.attr("data-value"));
				}else{
					$("#curArea").html("");
					$("#curArea").attr("data-value","");
				}
				getSeries(isNull(area.attr("data-value")));

				//选择可用区
			    $(".area dl dt").click(function(){
					$(this).addClass('active').siblings().removeClass('active');
					$("#curArea").html($(this).html());
					$("#curArea").attr("data-value",$(this).attr("data-value"));

					getSeries($(this).attr("data-value"));
				});
			}
		}
	});
}

//获取系列
function getSeries(zoneId){
	var service = {};
	service.zoneId = zoneId;
	var fn="queryZoneInSeriesList";
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
						html+='<dt data-value="'+item.seriesId+'">'+item.seriesName+'</dt>';
					});
				}
				$('#serieslist').html(html);
				var series=$(".series dl dt").eq(0);
				series.addClass('active');
				getModel(isNull(series.attr("data-value")))

				//选择系列
			    $(".series dl dt").click(function(){
					$(this).addClass('active').siblings().removeClass('active');
					getModel($(this).attr("data-value"))
				});
			}
			$('#jiazaikuang').hide();
		}
	});
}

//获取机型
function getModel(seriesId){
	var service = {};
	service.hostType = $("#hostType").val();
	service.seriesId = seriesId;
	var fn="getDicModelInSeries";
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
						html+='<dt data-value="'+item.modelId+'">'+item.modelName+'</dt>';
					});
				}
				$('#modelslist').html(html);
				var models=$(".models dl dt").eq(0)
				if(models.length!=0){
					models.addClass('active');
					$("#curModel").html(models.html());
					$("#curModel").attr("data-value",models.attr("data-value"));
				}else{
					$("#curModel").html("");
					$("#curModel").attr("data-value","");
				}
			    getSpecCPU(isNull(models.attr("data-value")));
			    getModelDisk(isNull(models.attr("data-value")))

				//选择机型
			    $(".models dl dt").click(function(){
					$(this).addClass('active').siblings().removeClass('active');
					$("#curModel").html($(this).html());
					$("#curModel").attr("data-value",$(this).attr("data-value"));

					getSpecCPU($(this).attr("data-value"));
					getModelDisk($(this).attr("data-value"));
				});
			}
		}
	});
}

//获取实例规格-CPU
function getSpecCPU(modelId){
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
					cpu.addClass('active');
					$("#curCPU").html(cpu.html());
					$("#curCPU").attr("data-value",cpu.attr("data-value"));
				}else{
					$("#curCPU").html("");
					$("#curCPU").attr("data-value","");
				}
				getSpecMemory(modelId,isNull(cpu.attr("data-value")));

				//选择CPU
				$(".cpu dl dt").click(function(){
					$(this).addClass('active').siblings().removeClass('active');
					$("#curCPU").html($(this).html());
					$("#curCPU").attr("data-value",$(this).attr("data-value"));
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
	service.cpu = cpu;
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
					memory.addClass('active');
					$("#curMemory").html(memory.html());
					$("#curMemory").attr("data-value",memory.attr("data-value"));
				}else{
					$("#curMemory").html("");
					$("#curMemory").attr("data-value","");
				}

				//选择内存
				$(".memory dl dt").click(function(){
					$(this).addClass('active').siblings().removeClass('active');
					$("#curMemory").html($(this).html());
					$("#curMemory").attr("data-value",$(this).attr("data-value"));
					getPrice();
				});
				getPrice();
			}
		}
	});
}

//获取磁盘类型
function getModelDisk(modelId){
	var service = {};
	service.modelId = modelId;
	var fn="queryDicModelDiskList";
	service = Commonjs.jsonToString(service);
	var params = Commonjs.getParams(fn,service);

	$.ajax({
		datatype:"json",
        type:"POST",
        url: weburl,
        data:params,
		cache : false,
		success: function(data){
			var result=jQuery.parseJSON(data);
			if(result.result=="success"){
				var sysHtml='';
				var dataHtml=''
				if (result.data.length>0){
					maxDataDisk = result.data[0].maxSize;
					BaseForeach(result.data,function(i,item){
						if(i==0){
							$("#sysDiskType").html(item.typeName);
							$("#dataDiskType").html(item.typeName);
						}
						sysHtml+='<div class="sysdisk-m-o">';
						sysHtml+='<span></span>';
						sysHtml+='<input type="hidden" id="max'+item.typeId+'" value="'+item.maxSize+'">';

						sysHtml+='<p data-value="'+item.typeId+'">'+item.typeName+'</p>';
						sysHtml+='<i></i>';
						sysHtml+='<div class="clear"></div>';
						sysHtml+='</div>';

						dataHtml+='<div class="datadisk-m-o">';
						dataHtml+='<span></span>';
						dataHtml+='<p data-value="'+item.typeId+'">'+item.typeName+'</p>';
						dataHtml+='<i></i>';
						dataHtml+='<div class="clear"></div>';
						dataHtml+='</div>';
					});
				}else{
					$("#sysDiskType").html("");
					$("#dataDiskType").html("");
				}
				$('#sysdiskList').html(sysHtml);
				$('#datadiskList').html(dataHtml);
				$("#curSysDisk").attr("data-value",$("#sysdisk .sysdisk-m .sysdisk-m-o p").eq(0).attr("data-value"));
				$("#curDataDisk").attr("data-value",$("#datadisk .datadisk-m .datadisk-m-o p").eq(0).attr("data-value"));

				//滑块  系统盘
				new SlideBar({
					actionBlock : 'action-block1',
					actionBar : 'action-bar1',
					slideBar : 'scroll-bar1',
					barLength : 350,
					interval : (maxSysDisk-minSysDisk),
					minNumber : minSysDisk,
					maxNumber : maxSysDisk,
					showArea : 'syssize',
					curBandwidth : 'curSysDisk',
					unit : 'GB',
				    clickfn : systemSize
				});

				//滑块  数据盘
				new SlideBar({
					actionBlock : 'action-block2',
					actionBar : 'action-bar2',
					slideBar : 'scroll-bar2',
					barLength : 350,
					interval : (maxDataDisk-minDataDisk),
					minNumber : minDataDisk,
					maxNumber : maxDataDisk,
					showArea : 'datasize',
					curBandwidth : 'curDataDisk',
					unit : 'GB',
				    clickfn : clickfn
				});

				//选择系统盘
			    $("#sysdisk .sysdisk-m .sysdisk-m-o").click(function(){
					var x=$(this).find("p").text();
					var diskID = $(this).find("p").attr("data-value");
					$("#sysdisk .sysdisk-inp p").text(x);
					$("#sysdisk .sysdisk-m").hide();

					new SlideBar({
						actionBlock : 'action-block1',
						actionBar : 'action-bar1',
						slideBar : 'scroll-bar1',
						barLength : 350,
						interval : (maxSysDisk-minSysDisk),
						minNumber : minSysDisk,
						maxNumber : maxSysDisk,
						showArea : 'syssize',
						curBandwidth : 'curSysDisk',
						unit : 'GB',
					    clickfn : systemSize
					});
					getPrice();

					$("#curSysDisk").attr("data-value",$(this).find("p").attr("data-value"));
			    });

				//选择数据盘
			    $("#datadisk .datadisk-m .datadisk-m-o").click(function(){
					var x=$(this).find("p").text();
					var diskID = $(this).find("p").attr("data-value");
					$("#datadisk .datadisk-inp p").text(x);
					$("#datadisk .datadisk-m").hide();

			    	//滑块  数据盘
			    	new SlideBar({
			    		actionBlock : 'action-block2',
			    		actionBar : 'action-bar2',
			    		slideBar : 'scroll-bar2',
			    		barLength : 350,
			    		interval : (maxDataDisk-minDataDisk),
						minNumber : minDataDisk,
			    		maxNumber : maxDataDisk,
			    		showArea : 'datasize',
			    		curBandwidth : 'curDataDisk',
			    		unit : 'GB',
			    	    clickfn : clickfn
			    	});
			    	getPrice();
					$("#curDataDisk").attr("data-value",$(this).find("p").attr("data-value"));
			    });
			}
		}
	});
}

//获取镜像操作系统类型
function getImageOsType(regionId){
	var service = {};
	service.hostType = $("#hostType").val();
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
						$("#defaultType").html(item.osType);
						if(item.osType.toLowerCase()=="windows"){
							$("#syssize").val($("#windowsMinSize").val());
						}else{
							$("#syssize").val($("#otherMinSize").val());
						}
					}
					html+='<div class="sel-m-o">';
					html+='<span></span>';
					html+='<p>'+item.osType+'</p>';
					html+='<i></i>';
					html+='<div class="clear"></div>';
					html+='</div>';
				});
				getImageOsName($("#defaultType").html());
			}else{
				$("#defaultType").html("");
				$("#defaultVersion").html("");
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
				getImageOsName(x);

				var wSize=$("#windowsMinSize").val();
		    	var lSize=$("#otherMinSize").val();
		    	if(x.toLowerCase()=="windows")
		    		$("#syssize").val(wSize);
		        else
		    		$("#syssize").val(lSize);
			});
		}
	});
}

//获取镜像操作系统版本
function getImageOsName(osType){
	var service = {};
	service.hostType = $("#hostType").val();
	if(osType == 'Windows')
		minSysDisk = parseInt($("#windowsMinSize").val());
	else
		minSysDisk = parseInt($("#otherMinSize").val());

	new SlideBar({
		actionBlock : 'action-block1',
		actionBar : 'action-bar1',
		slideBar : 'scroll-bar1',
		barLength : 350,
		interval : (maxSysDisk-minSysDisk),
		minNumber : minSysDisk,
		maxNumber : maxSysDisk,
		showArea : 'syssize',
		curBandwidth : 'curSysDisk',
		unit : 'GB',
	    clickfn : systemSize
	});

	service.regionId=$("#curRegion").attr("data-value");
	service.osType=osType;
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
			$("#curOs").html($("#defaultVersion").html());
			$("#curOs").attr("data-value",$("#version_0").attr("data-value"));
		}
	});
}

//获取网络类型
function getNetworkType(){
	var service = {};
	service.paramEName = "networkType";
	var fn="getListParamItemByEName";
	service = Commonjs.jsonToString(service);
	var params = Commonjs.getParams(fn,service);//获取参数

	$.ajax({
		datatype:"json",
        type:"POST",
        url: sysurl,
        data:params,
		cache : false,
		success: function(data){
			var data=jQuery.parseJSON(data);
			var html='';
			var selectOne = 0;
			if (data.data.length>0){
				BaseForeach(data.data,function(i,item){
					if (item.value.toUpperCase() == 'PRI') {
						selectOne = i;
						netty == item.value;
					}
					html+='<dt data-value="'+item.value+'">'+item.description+'</dt>';
				});
			}
			$('#networklist').html(html);
			$(".nettype dl dt").eq(selectOne).addClass('active');
			$("#curNettype").attr("data-value",$(".nettype dl dt").eq(0).attr("data-value"));

            //选择网络类型
            $(".nettype dl dt").click(function(){
                $(this).addClass('active').siblings().removeClass('active');

                //设置值.
                netty = $(this).attr('data-value');
                $("#curNettype").attr("data-value", netty);
                if (netty.toUpperCase() == 'PRI') {
                    $('#bandwidthSelector').css('display', '');
				} else {
                	$('#bandwidthSelector').css('display', 'none');
				}

                getPrice();

            });
		}
	});
}

//获取产品信息
function getProductInfo(){
	var service = {};
	service.regType = $("#hostType").val();
	service.chargeId = 1;
	var fn="getCloudProduct";
	service = Commonjs.jsonToString(service);
	var params = Commonjs.getParams(fn,service);//获取参数
	var result=Commonjs.ajax(weburl,params,false);
	if(result.result == "success"){
		if(result.data!=null || result.data.length>0){
			var view=result.data.productView;
			var list=result.data.promotionList;

			if(view!=null && view!=""){
				$("#productCode").val(view.productCode);
				$("#maxBandwidth").val(view.productParam.maxBandwidth);
				$("#windowsMinSize").val(view.productParam.windowsMinSize);
				$("#otherMinSize").val(view.productParam.otherMinSize);
				maxSysDisk=view.productParam.sysDiskMaxSize;

				if(view.status=="1"){
                    $("#btnBuy").removeClass("disable");
                    $("#btnBuy").attr("onclick","addUserCart(0)");
                    $("#btnBuyNow").removeClass("disable");
                    $("#btnBuyNow").attr("onclick","addUserCart(1)");
				}else{
					$("#remark").html(view.remark);
				}

				if (view.productParam.shareIp == 1) {
					$('#ipChoose').css('display', '');

                    //选择网络类型
                    $(".iptype dl dt").click(function(){
                        $(this).addClass('active').siblings().removeClass('active');

                        //设置值.
                        ipType = $(this).attr('data-value');
                        $("#curIptype").attr("data-value", netty);

                        getPrice();
                    });
				}
			}

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
				getPrice();
			});
		}
	}
}

function getPrice(){
	var service = {};
	service.hostType=$("#hostType").val();
	service.productCode=$("#productCode").val();
	service.regionId = $("#curRegion").attr("data-value");
	service.modelId=$("#curModel").attr("data-value");
	service.cpu=$("#curCPU").attr("data-value");
	service.memory=$("#curMemory").attr("data-value");
	service.bandwidth=$("#showArea").val();
	service.osType=$("#defaultType").html();
	service.systemDiskSize=$("#syssize").val();
	service.systemDiskType=$("#curSysDisk").attr("data-value");
	service.netty = netty;
	service.ipType=ipType;

	var dataDisklist="";
	var dataDisk={};
	dataDisk.dataDiskType=$("#curDataDisk").attr("data-value");
	dataDisk.dataDiskSize=$("#datasize").val();
	dataDisklist+=Commonjs.jsonToString(dataDisk);

	service.dataDisklist='['+dataDisklist+']';
	service.applyTime=$("#curApplyTime").attr("time");
	service.priceType=$("#curApplyTime").attr("type");
	service.num=$("#num-inp").val();

	var fn="getPrice";
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
				if(isNotNull(result.data)){
					$("#price").html(result.data.payPrice);
					$("#totalPrice").html(result.data.totalPrice);
					$("#discountPrice").html(result.data.discountPrice);
					$("#discountInfo").show();
					if(result.data.discountPrice==0){
						$("#discountMsg").hide();
					}
					else{
						$("#discountMsg").show();
					}
				}
			}
		}
	});
}

var buyNow = 0;
//添加购物车
function addUserCart(buyNowFlag){
    buyNow = buyNowFlag;
	var loginPwd=$("#loginPwd");
	var confirmPwd=$("#confirmPwd");
	if($("#szmm").hasClass("bs")){
		var preg = /(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,30}/;
		if(Commonjs.isEmpty(loginPwd.val())){
			$("#errorMsg").html("登录密码不能为空");
			loginPwd.focus();
			return false;
		}
		if(Commonjs.isEmpty(confirmPwd.val())){
			$("#errorMsg").html("确认密码不能为空");
			confirmPwd.focus();
			return false;
		}
		if(loginPwd.val() != confirmPwd.val()){
			$("#errorMsg").html("密码不一致");
			confirmPwd.focus();
			return false;
		}
		if(!preg.test(loginPwd.val())){
			$("#errorMsg").html("密码复杂度不够");
			loginPwd.focus();
			return false;
		}
	}

	var service = {};
	service.productCode=$("#productCode").val();
	service.applyTime=$("#curApplyTime").attr("time");
	service.priceType=$("#curApplyTime").attr("type");
	service.cartType="add";

	var instance={};
	instance.regionId = $("#curRegion").attr("data-value");
	instance.regionName=$("#curRegion").html();
	instance.zoneId=$("#curArea").attr("data-value");
	instance.zoneName=$("#curArea").html();
	instance.modelId=$("#curModel").attr("data-value");
	instance.modelName=$("#curModel").html();
	instance.cpu=$("#curCPU").attr("data-value");
	instance.memory=$("#curMemory").attr("data-value");
	instance.bandwidth=$("#showArea").val();
	instance.osType=$("#defaultType").html();
	instance.systemDiskSize=$("#syssize").val();
	instance.systemDiskType=$("#curSysDisk").attr("data-value");
	instance.num=$("#num-inp").val();
	instance.loginPwd=loginPwd.val();
	instance.netty=netty;
	instance.ipType=ipType;

	var dataDisklist="";
	var dataDisk={};
	dataDisk.dataDiskType=$("#curDataDisk").attr("data-value");
	dataDisk.dataDiskSize=$("#datasize").val();
	dataDisklist+=Commonjs.jsonToString(dataDisk);

	instance.dataDisklist='['+dataDisklist+']';
	instance.imageId=$("#curOs").attr("data-value");
	instance.networkId=$("#curNettype").attr("data-value");
	service.productParam=Commonjs.jsonToString(instance);
	service.num=$("#num-inp").val();

	var fn="addUserCartCloud";
	service = Commonjs.jsonToString(service);
	var params = Commonjs.getParams(fn,service);//获取参数
	Commonjs.ajaxTrue(weburl,params,addSuccess,true,"正在加入购物车中...");
}

function addSuccess(data){
	if(data.data==null)
		return;

	var result=data.data;
	if(result.code=="0") {
        if (buyNow == 1) {
            window.location.href = realPath + "/usercenter/shopping/shoppinglist.html";
        } else {
            Commonjs.tips("已添加到购物车", true);
            queryUserCartCount();
		}
    } else if(result.code=="-1"){
		Commonjs.alert(result.message);
	}
}

function isNull(str){
	if(str==null || str==undefined)
		return "";
	return str;
}
