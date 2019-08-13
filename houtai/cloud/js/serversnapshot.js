var instanceId;
$(function(){
    instanceId=request("iId");
    var hostTyp=request("hostType")
    vm.loadInfo();
    if (vm.hostType == 'hyperv') {
        queryUserSnapshot(instanceId);
    }

	if(instanceId!=""){
		$("#instanceDetail").attr("href","serverdetail.html?iId="+instanceId+"&hostType="+hostTyp);
		$("#instanceDisk").attr("href","serverdisk.html?iId="+instanceId+"&hostType="+hostTyp);
		$("#instanceSnapshot").attr("href","serversnapshot.html?iId="+instanceId+"&hostType="+hostTyp);
		$("#instanceId").html(instanceId);
	}
});

function queryUserSnapshot(instanceId){
	var service = {};
	service.instanceId=instanceId
	var fn="queryUserSnapshotListHyperV";
	service = Commonjs.jsonToString(service)
	var params = Commonjs.getParams(fn,service);//获取参数
	Commonjs.ajaxTrue(weburl,params,querySuccess);
}

function querySuccess(data){
	if(data.data==null)
		return false;

	var html='';
	if (data.data.length>0){
		BaseForeach(data.data,function(i,item){
			html+='<tr><td>'+item.name+'</td>';
			html+='<td>'+item.createTime+'</td>';
		});
	}else{
		html+='<tr><td colspan="10" style="height:50px;text-align:center;line-height:50px;">找不到相关信息</td></tr>';
	}
	$("#snapshotList").html(html);
}

var vm = new Vue({
    el: '#MainContentDIV',
    data: function () {
        return {
            hostType: '',
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
