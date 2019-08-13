var instanceId;
$(function(){
	instanceId=request("iId");
	vm.hostType=request("hostType");
	queryUserDisk();

	if(instanceId!=""){
		$("#instanceDetail").attr("href","serverdetail.html?iId="+instanceId + '&hostType=' + vm.hostType);
		$("#instanceDisk").attr("href","serverdisk.html?iId="+instanceId + '&hostType=' + vm.hostType);
		$("#instanceSnapshot").attr("href","serversnapshot.html?iId="+instanceId + '&hostType=' + vm.hostType);
		if (configParam.cloudType.huawei != vm.hostType) {
			$('li[tag="nopayorders"]').css('display', '');
		}
		$("#instanceId").html(instanceId);
	}

	//同步磁盘信息
    var service = {};
    service.instanceId=instanceId
    var fn="huaweiDiskSync";
    service = Commonjs.jsonToString(service)
    var params = Commonjs.getParams(fn,service);//获取参数

    $.ajax({
        datatype: "json",
        type: "POST",
        url: weburl,
        data: params,
        async: true,
        timeout: 8000,
        cache: false,
        beforeSend: function () {

        },
        success: function (obj) {
			console.log("sync success", obj);
        },
		error: function (obj) {
			console.log("sync fail", obj);
        }
    });
});

function queryUserDisk(){
	var service = {};
	service.instanceId=instanceId
	var fn="queryUserDiskList";
	service = Commonjs.jsonToString(service)
	var params = Commonjs.getParams(fn,service);//获取参数

	$.ajax({
		datatype:"json",
		type:"POST",
		url: weburl,
		data:params,
		async: true,
		timeout : 8000,
		cache : false,
		beforeSend: function () {
			divalertLoad('正在加载数据,请稍等');
		 },
		success: function(obj){
			divcloseLoad();
			result =jQuery.parseJSON(obj);
			var html='';
			if (result.data.length>0){
				BaseForeach(result.data,function(i,item){
					html+='<tr><td>'+item.diskName+'</td>';
					html+='<td>'+getTypeName(item)+'</td>';
					html+='<td class="stn" id="status_'+i+'">'+getStatusColor(item.status,item.statusName)+'</td>';
					html+='<td>'+item.diskSize+'G</td>';

					if(item.isMount==1)
						html+='<td>支持</td>';
					else
						html+='<td>不支持</td>';
					if(item.diskAttribute==1)
						html+='<td>系统盘</td>';
					else if(item.diskAttribute==2)
						html+='<td>数据盘</td>';
					if(item.payType==1)
						html+='<td>包年包月</td>';
					else if(item.payType==2)
						html+='<td>按流量计费</td>';

					html+=getOptItem(item.diskId,item.diskName,item.instanceId,item.status,item.diskAttribute,item.hostType,item.isMount);
					html+='</tr>';
				});
			}else{
				html+='<tr><td colspan="10" style="height:50px;text-align:center;line-height:50px;">找不到相关信息</td></tr>';
			}
			$("#diskList").html(html);

			$(".editsnap").click(function(){
				for(var i = 0;i < $(".edit-ul").length; i++){
					$(".edit-ul").eq(i).hide();
				}
				if($(".edit-ul").attr("flag") ==1){
					$(".edit-ul").attr("flag",0);
				}else{
					$(this).siblings(".edit-ul").show();
					$(".edit-ul").attr("flag",1);
				}
			});

			$("body").click(function(e){
				if($(e.target).parents("td > .btn-group").length==0){
					$(".edit-ul").hide();
				}
			});
		}
	});
}

function getOptItem(diskId,diskName,instanceId,status,diskAttribute, hostType, isMount){
	var html='';
	var isDisable="";
	var fn="snapshotDialog('"+diskId+"','"+diskName+"','"+instanceId+"')";
	html+='<td>';
	// hyper-v 暂不支持分盘快照
	/*if(status=="Expire"){
		isDisable="disable";
		html+='<a href="javascript:void(0)" class="manager-btn mr-10 disable">创建快照</a>';
	} else {
        html += '<a href="javascript:void(0)" class="manager-btn mr-10" onclick="' + fn + '">创建快照</a>';
    }*/


	html+='<div class="btn-group autosuo">';
	html+='<a href="javascript:void(0)" class="manager-btn editsnap '+isDisable+'">更多操作<span class="btn-caret"></span></a>';
	html+='<ul class="edit-ul" flag="0" >';
	/*if(diskAttribute==2){
		if(status=="Expire") {
            html += '<li><a href="javascript:void(0)" class="edit-a-disable">扩容</a></li>';
        } else {
			html+='<li><a href="../cloud/capacityconfig.html?dId='+diskId+'">扩容</a></li>';
        }
	} else {
		html+='<li><a href="javascript:void(0)" class="edit-a-disable" title="系统盘扩容，请选择重装系统扩容">扩容</a></li>';
    }*/
	// 暂时只支持hyper-v、阿里云数据盘，可直接扩容.
	if (hostType==configParam.cloudType.hyperV || (hostType==configParam.cloudType.aliyun && diskAttribute==2) || hostType==configParam.cloudType.huawei) {
        html += '<li><a href="../cloud/capacityconfig.html?dId=' + diskId + '&hostType=' + hostType + '">扩容</a></li>';
    } else {
        html += '<li><a href="javascript:void(0)" class="edit-a-disable">扩容</a></li>';
	}
	if (hostType == configParam.cloudType.aliyun && isMount == 1) {
		if (status == 'Available') {
            html += '<li><a href="javascript:void(0);" data-disk-id="' + diskId + '" onclick="vm.attachDisk(this)">挂载</a></li>';
		} else if (status == 'In_use') {
			html += '<li><a href="javascript:void(0);" data-disk-id="' + diskId + '" onclick="vm.detachDisk(this)">卸载</a></li>';
            html += '<li><a href="javascript:void(0);" data-disk-id="' + diskId + '" onclick="vm.createSnapshot(this)">创建快照</a></li>';
		}
	}
	if (hostType == configParam.cloudType.huawei) {
		if (status == 'in-use') {
            html += '<li><a href="javascript:void(0);" data-disk-id="' + diskId + '" onclick="vm.detachDisk(this)">卸载</a></li>';
            html += '<li><a href="javascript:void(0);" data-disk-id="' + diskId + '" onclick="vm.createSnapshot(this)">创建快照</a></li>';
		} else if (status == 'available') {
            html += '<li><a href="javascript:void(0);" data-disk-id="' + diskId + '" onclick="vm.attachDisk(this)">挂载</a></li>';
		}

        html += '<li><a href="../cloud/snapshothuawei.html?dId=' + instanceId + '&diskId=' + diskId + '&hostType=' + hostType + '">快照管理</a></li>';
	}
	html+='</ul></div>';
	html+='</td>';
	return html;
}

function getStatusColor(status,name){
	var html='';
	if(status=="InUse" || status == "Available" || status == "In_use" || status == "in-use")
		html='<span style="color:#090">'+name+'</span>';
	else
		html='<span style="color:#F90">'+name+'</span>';
	return html;
}

function snapshotDialog(diskId,diskName,instanceId){
	$("#diskName").html(diskName);
	$("#instanceId2").html(instanceId);
	getSysProductInfo(instanceId);
	$("#snapshotName").val("");
	var contents=$('#addBox').get(0);
	var artBox=art.dialog({
		lock: true,
		artIcon:'add',
		opacity:0.4,
		width: 400,
		padding:'0px 0px',
		title:"创建云硬盘快照",
		header:false,
		content: contents,
		button: [{
 	      	name: '创 建',
 	       	callback: function () {
			    var snapshotName=$('#snapshotName');
				if(Commonjs.isEmpty(snapshotName.val())){
					$.tooltip('请输入快照名称',2000,false);
					snapshotName.focus();
					return false;
				}

				var service = {};
				service.instanceId=instanceId;
				service.diskId = diskId;
				service.snapshotName=snapshotName.val();
				var fn="createSnapshot";
				service = Commonjs.jsonToString(service);
				var params = Commonjs.getParams(fn,service);//获取参数
				Commonjs.ajaxTrue(weburl,params,createSuccess,true,"正在进行中");
 	       	}
		}]
	});
}

function createSuccess(data){
	window.location.href="snapshot.html";
}

function getSysProductInfo(instanceId){
	var service = {};
	var fn="querySysProductByiId";
	service.instanceId=instanceId;
	service = Commonjs.jsonToString(service)
	var params = Commonjs.getParams(fn,service);//获取参数
	Commonjs.ajaxTrue(weburl,params,getSuccess);

	var service = {};
	var fn="queryUserSnapshotCount";
	service.instanceId=instanceId;
	service = Commonjs.jsonToString(service)
	var params = Commonjs.getParams(fn,service);//获取参数
	var data=Commonjs.ajax(weburl,params,false);
	if(data==null)
		return false;
	if(data.result=="success"){
		if(data.data!=null)
			$("#aSnapshot").html(data.data.count);
	}
}

function getSuccess(data){
	if(data.data==null)
		return false;

	if(data.data.productParam==null)
		return false;
	$("#snapshotCount").html(data.data.productParam.snapshotNum);
}

//挂载卸载
function  mountUninstall(isMount,type){
	if(isMount==0){
		Commonjs.alert("当前磁盘不支持该操作");
	}
}


var vm = new Vue({
    el: '#MainContentDIV',
    data: function () {
        return {
            hostType: 'hyperv',
            tableData: [],
            dialogTableVisible: false
        }
    },
    methods: {
        /**
		 * 添加挂载.
         * @param object
         */
        attachDisk: function(object) {
        	var self = this;
        	var diskId = $(object).attr('data-disk-id');
            this.$confirm('确定需要挂载此盘吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(function (){
                var service = {};
                service.instanceId = instanceId;
                service.diskId=diskId;
                var fn= configParam.cloudType.aliyun == self.hostType ? "attachDiskAliyun" : 'huaweiDiskAttach';
                service = Commonjs.jsonToString(service);
                var params = Commonjs.getParams(fn,service);//获取参数
                Commonjs.ajaxTrue(weburl,params,function () {
                    vm.$message.success('添加挂载成功');
                    window.location.reload();
                },false);
            }).catch(function(){
            });
		},
        /**
		 * 卸载.
         * @param object
         */
        detachDisk: function(object) {
            var diskId = $(object).attr('data-disk-id');
            this.$confirm('确定需要卸载此盘吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(function (){
                var service = {};
                service.instanceId = instanceId;
                service.diskId=diskId;
                var fn = configParam.cloudType.aliyun == self.hostType ? "detachDiskAliyun" : 'huaweiDiskDetach';
                service = Commonjs.jsonToString(service);
                var params = Commonjs.getParams(fn,service);//获取参数
                Commonjs.ajaxTrue(weburl,params,function () {
                    vm.$message.success('卸载成功');
                    window.location.reload();
                },false);
            }).catch(function(){
            });
		},
        /**
		 * 创建快照.
         * @param object
         */
        createSnapshot: function (object) {
            var diskId = $(object).attr('data-disk-id');
            this.$confirm('确定需要创建快照吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(function (){
                var service = {};
                service.instanceId = instanceId;
                service.diskId=diskId;
                var fn = configParam.cloudType.aliyun == self.hostType ? "createSnapshotAliyun" : 'huaweiCreateSnapshot';
                service = Commonjs.jsonToString(service);
                var params = Commonjs.getParams(fn,service);//获取参数
                Commonjs.ajaxTrue(weburl,params,function () {
                    vm.$message.success('创建成功');
                    window.location.href = "serversnapshot.html?iId="+instanceId;
                },false);
            }).catch(function(){
            });
        },
        /**
		 * 快照列表：华为.
         */
        snapshotList: function (object) {
            var diskId = $(object).attr('data-disk-id');
            var self = this;
            self.tableData = [];
            if (configParam.cloudType.huawei == self.hostType) {
                var service = {};
                service.instanceId = instanceId;
                service.diskId=diskId;
                var fn = 'huaweiListSnapshot';
                service = Commonjs.jsonToString(service);
                var params = Commonjs.getParams(fn,service);//获取参数
                Commonjs.ajaxTrue(weburl,params,function (data) {
                    self.tableData = data.data;
					self.dialogTableVisible = true;
                },false);
			}
        },
        /**
		 * 删除快照.
         * @param row
         */
        deleteSnapshot: function (row) {
        	var vm = this;
            vm.$confirm('确定需要删除快照吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(function (){
                self.dialogTableVisible = false;
                var service = {};
                service.instanceId = instanceId;
                service.diskId=diskId;
                service.id = row.id;
                var fn = 'huaweiDeleteSnapshot';
                service = Commonjs.jsonToString(service);
                var params = Commonjs.getParams(fn,service);//获取参数
                Commonjs.ajaxTrue(weburl,params,function () {
                    vm.$message.success('删除成功');
                    location.reload();
                },false);
            }).catch(function(){
            });
        },
        /**
		 * 回滚快照.
         * @param row
         */
        rollbackSnapshot: function (row) {
            vm.$confirm('确定需要将数据回滚到此快照吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(function (){
                vm.dialogTableVisible = false;
                var service = {};
                service.instanceId = instanceId;
                service.diskId=diskId;
                service.id = row.id;
                var fn = 'huaweiRollbackSnapshot';
                service = Commonjs.jsonToString(service);
                var params = Commonjs.getParams(fn,service);//获取参数
                Commonjs.ajaxTrue(weburl,params,function () {
                    vm.$message.success('删除成功');
                    location.reload();
                },false);
            }).catch(function(){
            });
        }
    },
    mounted: function () {
    }
});
