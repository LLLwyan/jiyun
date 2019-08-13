var instanceId;
var diskType;
var diskTypeName;
var curDiskNum;
var maxDiskNum;
var surDiskNum;
var cloudDiskProCode;
var status;

$(function(){
	instanceId=request("iId");
	queryUserService(); 
	
	//数据盘
    $("#datadisk .datadisk-inp").click(function(){
    	$(".datadisk-m").toggle();  
    });
    
    //点击其他地方收缩
	$("body").click(function(e){
		if($(e.target).parents(".datadisk").length==0){
			$(".datadisk-m").hide(); 
		}
	});
	
	//购买数量
    $("#num-inp").change(function(){
        if(!CndnsValidate.checkNumber($(this).val())){
            Commonjs.alert('购买数必须是整数',false);
            $(this).val(1);
            return false;
        }
        if($(this).val()>surDiskNum)
        	Commonjs.alert('当前主机还可挂载'+surDiskNum+"块云硬盘");
   	 	getPrice();
    })
    
    $(".numAdd").click(function(){
    	var num=$("#num-inp").val();
    	num=parseInt(num)+1; 
    	if(num>surDiskNum){ 
        	Commonjs.alert('当前主机还可挂载'+surDiskNum+"块云硬盘");
    	}
    	else
    		$("#num-inp").val(num);
    	getPrice();
    });
    
    $(".numSubtract").click(function(){
    	var num=$("#num-inp").val(); 
    	num=parseInt(num)-1;
    	if(num>0){
    		$("#num-inp").val(num);
        	getPrice();
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
	var disklist=data.data.disklist;
	jointHtml(view,info,disklist);
	$("#hostType").val(view.hostType);
	
	curDiskNum=disklist.length-1;
	getCloudProduct();
	getCloudDiskProduct();
	getModelDisk(info.modelId);
	
	if(surDiskNum==0){
		$("#btnConfirm").addClass("disable");
		$("#btnConfirm").removeAttr("onclick");
	}
}

//获取云产品信息
function getCloudProduct(){
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
				maxDiskNum=view.productParam.diskNum;
				surDiskNum=maxDiskNum-curDiskNum;
				$("#notes").html("提示：当前主机最多挂载"+maxDiskNum+"块数据盘，已挂载"+curDiskNum+"块");
			}
		}
	}
}

//获取云硬盘产品信息
function getCloudDiskProduct(){
	var service = {};
	service.regType = $("#hostType").val(); 
	var fn="queryCloudDiskProduct"; 
	service = Commonjs.jsonToString(service);
	var params = Commonjs.getParams(fn,service);//获取参数
	var result=Commonjs.ajax(weburl,params,false);
	if(result.result == "success"){
		if(result.data!=null || result.data.length>0){
			var view=result.data.productView;	
			if(view!=null && view!=""){
				cloudDiskProCode=view.productCode;
				if(view.status=="Y"){
					$("#btnConfirm").removeClass("disable");
					$("#btnConfirm").attr("onclick","addUserCart()");
				}else{
					$("#remark").html(view.remark);
				}
			}
		}
	}
}

//获取磁盘类型
function getModelDisk(modelId){
	var service = {};
	service.modelId = modelId;
	var fn="queryDicModelDiskList";
	service = Commonjs.jsonToString(service);
	var params = Commonjs.getParams(fn,service);//获取参数数
	Commonjs.ajaxTrue(weburl,params,getModelDiskSuccess);
}

function getModelDiskSuccess(data){
	if(data.data==null)
		return;
	
	var dataHtml=""; 
	$('#datadiskList').html(dataHtml);
	if(data.data.length>0){
		BaseForeach(data.data,function(i,item){
			if(i==0){   
				diskType=item.typeId;
				diskTypeName=item.typeName;
				$("#dataDiskType").html(item.typeName);
				var minSize=item.minSize;
				var maxSize=item.maxSize;
				//滑块  数据盘
				new SlideBar({
					actionBlock : 'action-block1',
					actionBar : 'action-bar1',
					slideBar : 'scroll-bar1',
					barLength : 350,
					interval : (maxSize-minSize),  
					minNumber : minSize,
					maxNumber : maxSize,
					showArea : 'datasize',
					unit : 'GB',
				    clickfn : clickfn
				});
			}
			dataHtml+='<div class="datadisk-m-o">';
			dataHtml+='<span></span>';
			dataHtml+='<p data-value="'+item.typeId+'" minsize="'+item.minSize+'" maxsize="'+item.maxSize+'">'+item.typeName+'</p>';
			dataHtml+='<i></i>';
			dataHtml+='<div class="clear"></div>';
			dataHtml+='</div>';  
		});
	}
	$('#datadiskList').html(dataHtml);
    
	//选择数据盘
    $("#datadisk .datadisk-m .datadisk-m-o").click(function(){
		var x=$(this).find("p").text();
		$("#datadisk .datadisk-inp p").text(x);
		$("#datadisk .datadisk-m").hide();	
		diskType = $(this).find("p").attr("data-value");
		var minSize=parseInt($(this).find("p").attr("minsize")); 
		var maxSize=parseInt($(this).find("p").attr("maxsize")); 

    	//滑块  数据盘
    	new SlideBar({
    		actionBlock : 'action-block1',
    		actionBar : 'action-bar1',
    		slideBar : 'scroll-bar1',
    		barLength : 350,
    		interval : (maxSize-minSize),   
			minNumber : minSize,
    		maxNumber : maxSize,
    		showArea : 'datasize',
    		unit : 'GB',
    	    clickfn : clickfn
    	});
    });
}

//获取价格
function getPrice(){
	var service = {};
	service.instanceId = instanceId;
	service.diskType=diskType;
	service.size=$("#datasize").val(); 
	var fn="getAddDiskPirce";
	service = Commonjs.jsonToString(service);
	var params = Commonjs.getParams(fn,service);//获取参数
	Commonjs.ajaxTrue(weburl,params,getPriceSuccess,false);
}

function getPriceSuccess(data){
	var num=parseInt($("#num-inp").val());
	var price=parseFloat(data.data)*num;
	$("#diskprice").html("¥"+price+"元"); 
}

//添加购物车 
function addUserCart(){
	var service = {};
	service.productCode=cloudDiskProCode;
	service.instanceId= instanceId; 
	service.diskType=diskType;
	service.diskTypeName=$("#dataDiskType").html();
	service.size=$("#datasize").val();
	service.num=$("#num-inp").val();
	var fn="addUserCartAddDisk";
	service = Commonjs.jsonToString(service);
	var params = Commonjs.getParams(fn,service);//获取参数
	Commonjs.ajaxTrue(weburl,params,addSuccess,false);
}

function addSuccess(data){
	window.parent.frames.location.href=realPath+"/usercenter/shopping/shoppinglist.html";
}

var clickfn = function(){
    getPrice();
};