var instanceId;
var listData;
$(function(){
    instanceId=request("iId");
    vm.loadInfo();
    if (vm.hostType == 'hyperv') {
        queryUserSnapshot();
    }

    if (instanceId != "") {
        $("#instanceDetail").attr("href", "serverdetail.html?iId=" + instanceId);
        $("#instanceDisk").attr("href", "serverdisk.html?iId=" + instanceId);
        $("#instanceSnapshot").attr("href", "serversnapshot.html?iId=" + instanceId);
        $("#instanceId").html(instanceId);
    }
});

function queryUserSnapshot(){
	var index = $("#pagenumber").val();
	var service = {};
	service.page = index;
	service.pageSize = 10;
	service.instanceId=instanceId
	var fn="queryUserSnapshotListHyperV";
	service = Commonjs.jsonToString(service)
	var params = Commonjs.getParams(fn,service);//获取参数
	Commonjs.ajaxTrue(weburl,params,querySuccess);
}

function querySuccess(data){
	var html='';
	if (data.data.length>0){
		listData = data.data;
		BaseForeach(data.data,function(i,item){
			html+='<tr>';
			html+='<td><input id="chk_'+i+'" value="'+item.uuid+'" name="chkBox" type="checkbox">';
			html+='</td>';
			html+='<td>'+item.name+'</td>';
			/*html+='<td>'+item.diskSize+'G</td>';
			if(item.snapshotType==1)
				html+='<td>系统盘</td>';
			else if(item.snapshotType==2)
				html+='<td>数据盘</td>';
			else
				html+='<td>未知</td>';
			html+='<td>'+item.diskName+'</td>';
			html+='<td class="stn" id="status_'+i+'">'+getStatusColor(item.status,item.statusName)+'</td>';*/
			html+='<td>'+item.createTime+'</td>';
			html+='<td id="btn_'+i+'">'+getOptItem(item.uuid)+'</td>';
			html+='</td></tr>';

			//getSnapshotStatus(i,item.status,item.hostType,item.snapshotId,item.id);
		});
	}else{
		html+='<tr><td colspan="10" style="height:50px;text-align:center;line-height:50px;">找不到相关信息</td></tr>';
	}
	$("#snapshotList").html(html);
}

function getStatusColor(status,name){
	var html='';
	if(status=="InUse")
		html='<span style="color:#090">'+name+'</span>';
	else
		html='<span style="color:#F90">'+name+'</span>';
	return html;
}

function getSnapshotStatus(index,status,hostType,snapshotId,id){
	return;
	var service = {};
	service.hostType=hostType;
	service.id=id;
	var fn="querySnapshotStatus";
	service = Commonjs.jsonToString(service)
	var params = Commonjs.getParams(fn,service);//获取参数
	$.ajax({
		datatype:"json",
        type:"POST",
        url: weburl,
        data:params,
		cache : false,
		success: function(data){
			var result=jQuery.parseJSON(data);
			if(result.result == "success"){
				if(result.data.code=="0"){
					$("#chk_"+index).show();
					$("#img_"+index).hide();
					$("#btn_"+index).html(getOptItem(result.data.status,snapshotId));
				}else if(result.data.code=="-1"){
					getSnapshotStatus(index,status,hostType,snapshotId,id);
				}

				//颜色区分
				$("#status_"+index).html(getStatusColor(result.data.status,result.data.statusName));
			}
		}
	});
}

function getOptItem(VPSSnapshotName){
	var html='<a href="javascript:void(0);" onclick="singleDelSnapshot(\''+ VPSSnapshotName +
		'\')" class="manager-btn mr-10 ">删除</a>';
	html += '<a href="javascript:void(0);" onclick="restoreSnapshot(\''+ VPSSnapshotName +
        '\')" class="manager-btn mr-10">还原</a>';
	/*if(status=="InUse"){
		//html+='<a onclick="" href="javascript:void(0);" class="manager-btn mr-10">回滚</a>';
		html+='<a onclick="singleDelSnapshot(\''+snapshotId+'\')" href="javascript:void(0);" class="manager-btn mr-10">删除</a>';
	}else if(status=="Building"){
		//html+='<a href="javascript:void(0);" class="manager-btn mr-10 disable">回滚</a>';
		html+='<a href="javascript:void(0);" class="manager-btn mr-10 disable">删除</a>';
	}*/
	return html;
}

//单个删除快照
function singleDelSnapshot(VPSSnapshotName){
	delSnapshot(VPSSnapshotName);
}

//批量删除快照
function batchDelSnapshot(){
	var snapshotIds = "";
	$("input[name='chkBox']:checked").each(function(){
		snapshotIds += $(this).attr("value")+',';
	});
	if(!snapshotIds){
		$.tooltip("请先勾选要操作的快照",1000,true);
		return;
	}
	snapshotIds = snapshotIds.substring(0,snapshotIds.length-1);
	delSnapshot(snapshotIds);
}

//删除快照
function delSnapshot(snapshotIds){
	var idList = snapshotIds.split(",");
	var realIds = "";
	for(var i=0; i<idList.length; i++) {
		var id = idList[i];
		for (var j=0; j<listData.length; j++) {
			var item = listData[j];
			if (item.uuid == id) {
				realIds += ("" == realIds ? "" : ",") + item.name;
			}
		}
	}
	art.dialog({
 		id: 'testID',
 	    width: '245px',
 	    height: '109px',
 	    content: '您要删除吗？注意：删除后数据将不能恢复',
 	    lock: true,
 	    button: [{
 	      	name: '确定',
 	       	callback: function () {
 	       	 	var service = {};
				service.snapshotIds = realIds;
				service.instanceId = instanceId;
				var fn="delSnapshotHyperV";
				service = Commonjs.jsonToString(service);
				var params = Commonjs.getParams(fn,service);//获取参数
				Commonjs.ajaxTrue(weburl,params,delSnapshotSuccess,true,"正在执行中");
 	       	}
 	 	},{
 	 		name: '取消'
 	 	}]
 	});
}

function delSnapshotSuccess(data){
	$.tooltip(data.msg,2000,true);
	queryUserSnapshot();
}

function checkAllSnapshot(checkall){
	if(checkall.checked){
		$("input[name='chkBox']").prop("checked",true);
		$("input[name='checkBoxAll']").prop("checked",true);

	}else{
		$("input[name='chkBox']").prop("checked",false);
		$("input[name='checkBoxAll']").prop("checked",false);
	}
}

function snapshotDialog(){
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
                /*var snapshotName=$('#snapshotName');
                if(Commonjs.isEmpty(snapshotName.val())){
                    $.tooltip('请输入快照名称',2000,false);
                    snapshotName.focus();
                    return false;
                }*/

                var service = {};
                service.instanceId=instanceId;
                service.diskId = $('#diskId').val();
                service.snapshotName=instanceId;//snapshotName.val();
                var fn="createSnapshot";
                service = Commonjs.jsonToString(service);
                var params = Commonjs.getParams(fn,service);//获取参数
                Commonjs.ajaxTrue(weburl,params,createSuccess,true,"正在进行中");
            }
        }]
    });
}

function createSuccess(data){
    $.tooltip('创建成功',2000,false);
    window.location.reload();
}

function getSysProductInfo(instanceId){
    var service = {};
    var fn="querySysProductByiId";
    service.instanceId=instanceId;
    service = Commonjs.jsonToString(service)
    var params = Commonjs.getParams(fn,service);//获取参数
    Commonjs.ajaxTrue(weburl,params,getSuccess);

    var service = {};
    var fn="queryUserSnapshotCountHyperV";
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
	$('#diskId').val(data.data.disk_info.diskId);
}

function restoreSnapshot(snapshotId){
	var snapshotName = "";
    for (var j=0; j<listData.length; j++) {
        var item = listData[j];
        if (item.uuid == snapshotId) {
            snapshotName = item.name;
            break;
        }
    }
    var contents=$('#restoreBox').get(0);
    var artBox=art.dialog({
        lock: true,
        artIcon:'add',
        opacity:0.4,
        width: 400,
        padding:'0px 0px',
        title:'还原快照',
        header:false,
        content: contents,
        ok: function () {
            var service = {};
            service.instanceId = instanceId;
            service.snapshotId = snapshotName;
            var fn="restoreSnapshotHyperV";
            service = Commonjs.jsonToString(service);
            var params = Commonjs.getParams(fn,service);//获取参数
            Commonjs.ajaxTrue(weburl,params,restoreSuccess,true,"正在还原中");
        },cancel: function(){
            $('#addBox').hide();
        }
    });
}

function restoreSuccess() {
	window.location.reload();
}


var vm = new Vue({
    el: '#MainContentDIV',
    data: function () {
        return {
            hostType: 'hyperv',
            tableData: [],
            page: {
                total: 0,
                current: 1,
                size: 10
            },
            multipleSelection: []
        }
    },
    methods: {
        loadInfo: function () {
            var self = this;
            var service = {};
            service.instanceId=instanceId;
            var fn="queryUserService";
            service = Commonjs.jsonToString(service);
            var params = Commonjs.getParams(fn,service);
            Commonjs.ajaxSilence(weburl,params,false,function (data) {
                self.hostType = data.data.view.hostType;
                if (self.hostType=='aliyun') {
                    self.queryData();
                }
            }, null, true);
        },
        queryData: function() {
            var self = this;
            var service = {};
            service.instanceId=instanceId;
            service.page=this.page.current;
            service.size=this.page.size;
            var fn="querySnapshotAliyun";
            service = Commonjs.jsonToString(service);
            var params = Commonjs.getParams(fn,service);
            Commonjs.ajaxSilence(weburl,params,false,function (data) {
                self.page.total = data.data.total;
                self.tableData = data.data.item;
            }, null, true);
        },
        changePage: function (page) {
            this.page.current = page;
            this.queryData();
        },
        deleteSnapshot: function () {
            if (this.multipleSelection.length < 1) {
                this.$message.error('请选择需要删除的实例');
                return;
            }
            var self = this;
            this.$confirm('确定需要删除所选快照吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(function (){
                var id = "";
                self.multipleSelection.forEach(function (item) {
                    id += ("" == id ? "" : ",") + item.snapshotId;
                });
                var service = {};
                service.instanceId=instanceId;
                service.id = id;
                var fn="deleteSnapshotAliyun";
                service = Commonjs.jsonToString(service);
                var params = Commonjs.getParams(fn,service);
                Commonjs.ajaxSilence(weburl,params,true,function (data) {
                    self.$message.success('操作成功');
                    window.location.reload();
                }, null, true);
            }).catch(function(){
            });
        },
        handleSelectionChange: function (val) {
            this.multipleSelection = val;
        }
    },
    mounted: function () {
    }
});
