var diskId;
var instanceId;
var curDiskSize=0;//当前硬盘大小
var maxDiskSize=2000;//最大硬盘大小
var hostType;

$(function(){
	diskId=request("dId");
    hostType=request("hostType");
	queryUserDisk();
});

function queryUserDisk(){
	var service = {};
	service.diskId=diskId
	service.hostType=hostType;
	var fn="queryUserDisk";
	service = Commonjs.jsonToString(service)
	var params = Commonjs.getParams(fn,service);//获取参数
	Commonjs.ajaxTrue(weburl,params,querySuccess);
}

function querySuccess(data){
	if(data.data==null)
		return;

	var view=data.data.view;
	if(view==null)
		return;

	var html='';
	html+='<tr>';
	html+='<td>'+view.diskName+'</td>';
	html+='<td>'+getTypeName(view)+'</td>';
	if(view.isMount==1)
		html+='<td>支持</td>';
	else
		html+='<td>不支持</td>';
	html+='<td>'+view.instanceName+'</td>';
	if(view.payType==1)
		html+='<td>包年包月</td>';
	else if(view.payType==2)
		html+='<td>按流量计费</td>';
	html+='<td>'+view.diskSize+'GB</td>';
	html+='<td><input id="afterSize" type="number" title="" value="'+view.diskSize+'" onchange="changeDiskSize(this)" style="width:60px;height:30px;border:1px solid #ddd;text-align:center" />&nbsp;GB</td>';
    html+='<td><span id="price" class="red">-</span></td>';
	html+='</tr>';
	$("#datalist").html(html);

	curDiskSize=view.diskSize;
	instanceId=view.instanceId;
	queryDicDisk(view.diskType);
}

//查询磁盘类型
function queryDicDisk(typeId){
	var service = {};
	service.typeId=typeId
	var fn="getDicDiskInfo";
	service = Commonjs.jsonToString(service)
	var params = Commonjs.getParams(fn,service);//获取参数
	Commonjs.ajaxTrue(weburl,params,queryDicDiskSuccess);
}

function queryDicDiskSuccess(data){
	if(data.data==null) {
        return;
    }

	maxDiskSize=data.data.maxSize;
	$("#afterSize").attr("title","范围："+curDiskSize+"-"+maxDiskSize+"GB");
}

function changeDiskSize(obj){
	var size=$(obj).val();
	if(size==""){
		$(obj).val(curDiskSize);
		return false;
	}

	if(!CndnsValidate.checkNumber(size)){
        Commonjs.alert('数据盘必须是整数',false);
        $(obj).val(curDiskSize);
        return false;
    }

	if(size<curDiskSize){
		$(obj).val(curDiskSize);
		return false;
	}

	if(size>maxDiskSize){
		$(obj).val(maxDiskSize);
		return false;
	}
	getResizeDataDiskPrice();
}

function getResizeDataDiskPrice(){
	var service = {};
	service.instanceId = instanceId;
	service.diskId=diskId;
	service.afterSize=$("#afterSize").val();
	var fn = "";
	switch (hostType) {
		case configParam.cloudType.aliyun:
			fn = "getResizeDataDiskPriceAliyun";
			break;
		case configParam.cloudType.huawei:
			fn = "huaweiUpgradeDiskPrice";
			break;
		default:
			fn = "getResizeDataDiskPrice";
			break;
	}
	service = Commonjs.jsonToString(service);
	var params = Commonjs.getParams(fn,service);//获取参数
	Commonjs.ajaxTrue(weburl,params,getPriceSuccess,false);
}

function getPriceSuccess(data){
	$("#price").html("¥"+data.data+"元");
	var price=parseFloat(data.data);
	if(price>0){
		$("#upgrade").removeClass("disable");
		$("#upgrade").attr("onclick","confirmUpgrade()");
	}
	else{
		$("#upgrade").addClass("disable");
		$("#upgrade").removeAttr("onclick");
	}
}

//添加购物车
function confirmUpgrade(){
	var service = {};
	service.instanceId= instanceId;
	service.diskId=diskId;
	service.afterSize=$("#afterSize").val();
	var fn= "addUserCartResizeDataDisk";
	service = Commonjs.jsonToString(service);
	var params = Commonjs.getParams(fn,service);//获取参数
	Commonjs.ajaxTrue(weburl,params,UpgradeSuccess,false);
}

function UpgradeSuccess(data){
	window.parent.frames.location.href=realPath+"/usercenter/shopping/shoppinglist.html";
}

function gotoServerList(){
	window.location.href="./server.html?hostType="+hostType;
}
