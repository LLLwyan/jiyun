$(function(){
	var endDateType = request("endDateType");
	if(endDateType != ""){
		$("#endDateType").val(endDateType);
	}

	$("#checkedAll").click(function(){
		if(this.checked){
			$("input[name='domabox']").prop("checked",true);
		}else{
			$("input[name='domabox']").prop("checked",false);
		}
	});

	$('#startTime').datepicker(
	{
		dateFormat:'yy-mm-dd',
		dayNamesMin:['日','一','二','三','四','五','六'],
		firstDay:'1',
		changeYear:true,
		yearRange:'1950:2020',
		changeMonth:true,
		monthNamesShort:['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'],
	});
	queryUserDomainList();
	getListParamItemByEName();
});

function queryUserDomainList(){
	var domainName=$("#domainName").val();
	var startTime=$("#startTime").val();
	var endDateType=$("#endDateType").val();
	var domstate=$("#domstate").val();
	var index = $("#pagenumber").val();
	var service = {};
	var fn = "queryUserDomainList";
	service.domainName = domainName;
	service.startTime = startTime;
	service.endDateType =  endDateType;
	service.domstate = domstate;
	service.page =index;
	service.pageSize = 10;
	service = Commonjs.jsonToString(service);
	var params = Commonjs.getParams(fn, service);//获取参数
	Commonjs.ajaxTrue(weburl,params,querySuccess);
}

function querySuccess(data){
	$('#domainlist').empty();
	var domainlist = "";
	if(data.rows > 0){
        vmUserDomainList.rows = data.data.dataList;
		BaseForeach(data.data.dataList,function(i, item){
			domainlist += '<tr>';
			domainlist +='<td><input productcode="'+item.productCode+'" domainname="'+item.domainName+'" type="checkbox" name="domabox" value="'+item.orderId+'"></td>'
			domainlist += '<td><a href="domaindetails.html?domain='+item.domainName+'" class="blue" >'+item.domainName+'</a></td>';
			domainlist += '<td>'+item.productName+'</td>';
			domainlist += '<td>'+jsonDateTimeFormat(item.startTime)+'</td>';
			domainlist += '<td>'+jsonDateTimeFormat(item.endTime)+'</td>';
			//BaseForeach(data.data.ItemList,function(i, jtem){
			//	if(item.status==jtem.value){
			//		domainlist += '<td>'+getStatusColor(item.status,jtem.description)+'</td>';
			//	}
			//});
			domainlist += '<td>' + getStatusColor(item.status, item.domainStatusName) + '</td>';
			domainlist += '<td>';
			if(item.status=="Expire") {
                domainlist += '<a href="javascript:;" class="manager-btn mr-10 disable">管理</a>';
                domainlist += '<a href="javascript:;" class="manager-btn mr-10 disable">过户</a>';
            } else {
                domainlist += '<a href="javascript:;" onclick="openurl(\'' + item.domainName + '\');" class="manager-btn mr-10">管理</a>';
                domainlist += '<a href="javascript:;" onclick="vmUserDomainList.transfer('+i+')" class="manager-btn mr-10">过户</a>';
            }

			//if(item.regType == "3"){
				domainlist += '<a href="javascript:;" onclick="donmainControl(\''+item.domainName+'\');" class="manager-btn mr-10">控制面板</a>';
			//}

			domainlist += '</td>';
			domainlist += '</tr>';
			$("#button_domain").show();
		});
	} else {
		$("#button_domain").hide();
		domainlist+=' <tr><td colspan="8" style="height:50px;text-align:center;line-height:50px;">找不到相关信息</td></tr>';
	}
	$('#domainlist').append(domainlist);

	if(data.rows!=undefined){
		if(data.rows!=0){
			$("#totalcount").val(data.rows);
		}else{
			if(data.page==0)$("#totalcount").val(0);
		}
	}else{
		$("#totalcount").val(0);
	}
	Page($("#totalcount").val(),data.pagesize,'pager');
}

function getStatusColor(status,name){
	var html='';
	if(status=="Y")
		html='<span style="color:#090">'+name+'</span>';
	else
		html='<span style="color:#F90">'+name+'</span>';
	return html;
}

//获取域名状态
function getListParamItemByEName(){
	var paramEName="domainStatus";
	var service = {};
	var fn = "getListParamItemByEName";
	service.paramEName = paramEName;
	service = Commonjs.jsonToString(service);
	var params = Commonjs.getParams(fn, service);//获取参数
	Commonjs.ajaxTrue(sysurl,params,getItemByENameSuccess,false);
}

function getItemByENameSuccess(data){
	if(!isNotNull(data.data))
		return false;
	$('#domstate').empty();
	var domstate = "";
	domstate += '<option value="">全部</option>';
	if(data.data.length > 0){
		BaseForeach(data.data,function(i, item){
			domstate +='<option value="'+item.value+'">'+item.description+'</option>'
		});
	}
	$('#domstate').append(domstate);
}

function openurl(domainName){
	window.location.href='resolution.html?domainName='+domainName
}

//加入购物车
function addUsercart(){
	var indexs=0;
	$("[name=domabox]:checked").each(function(){
		indexs++;
		var domainName=$(this).attr("domainname");
		var productcode=$(this).attr("productcode");
		if(domainName!=undefined && productcode!=undefined){
			var service = {};
			var fn = "addUserCart";
			service.productCode = productcode;
			service.applyTime =1;
			service.priceType = "Y";
			service.cartType = "renew";
			service.productParam = domainName;
			service = Commonjs.jsonToString(service);
			var params = Commonjs.getParams(fn, service);//获取参数
			var data = Commonjs.ajax(weburl,params,false);
		}
	});
	if(indexs<=0){
		Commonjs.alert("未勾选域名选项");
		return false
	}else{
		window.parent.frames.location.href='../../shopping/shoppinglist.html'
	}
}

function donmainControl(domainName) {
    window.open("./domainlogin.html?domainName="+domainName);
}

//分页
function Page(totalcounts,pagecount,pager) {
  	$("#"+pager).pager( {
  		totalcounts : totalcounts,
  		pagesize : 10,
  		pagenumber : $("#pagenumber").val(),
  		pagecount : parseInt(totalcounts/pagecount)+(totalcounts%pagecount >0?1:0),
  		buttonClickCallback : function(al) {
  			$("#pagenumber").val(al);
  			queryUserDomainList();
  		}
  	});
}


var vmUserDomainList = new Vue({
    el: '#MainContentDIV',
    data: function(){
        return {
        	rows: [],
			currentRow: {},
			data: {
                toUserName: '',
                createTime: 0,
                safeCode: ''
			},
			isNew: true,
            showSafeCodeFlag: false,
            dialogFormVisible: false,
			form: {
        		toUserName: ''
			},
            rules: {
                toUserName: [
                    { required: true, message: '请输入对方的用户账号', trigger: 'blur' },
				]
			}
        };
    },
    methods: {
        /**
		 * 过户触发.
         * @param i
         */
        transfer: function (i) {
			this.currentRow = this.rows[i];
			this.showTransfer();
        },

        /**
		 * 显示过户信息框.
         */
		showTransfer: function() {
            var self = this;
            var row = self.currentRow;
            var service = {
                productType: configParam.productClass.domain,
                hostType: row.regType,
                bizName: row.domainName
            };
            var fn="bizTransferDealingInfo";
            service = Commonjs.jsonToString(service)
            var params = Commonjs.getParams(fn,service);
            Commonjs.ajaxTrue(weburl,params, function (data) {
                self.isNew = true;
                self.data.safeCode = '';
                self.data.toUserName = '';
                self.data.createTime = 0;
                if (data.data.length > 0) {
                    self.data = Object.assign({}, data.data[0]);
                    self.isNew = false;
                }
                self.showSafeCodeFlag = false;
                self.form.toUserName = '';
                self.dialogFormVisible = true;
            });
		},

        /**
		 * 发起交易.
         */
        makeDeal: function () {
        	var self = this;
            this.$refs['pushForm'].validate(function(valid){
            	if (valid) {
                    var service = {
                        productType: configParam.productClass.domain,
                        hostType: self.currentRow.regType,
                        bizName: self.currentRow.domainName,
						toUserName: self.form.toUserName
                    };
                    var fn="bizTransferMakeDeal";
                    service = Commonjs.jsonToString(service)
                    var params = Commonjs.getParams(fn,service);
                    Commonjs.ajaxSilence(weburl,params,true,function (data) {
                        self.$message.success("发起交易成功");
                        self.showTransfer();
                    }, function (data) {
						self.$message.error(data.msg);
                    });
				}
            });
        },

        /**
		 * 取消交易.
         */
        cancelDeal: function () {
            var self = this;
            this.$confirm('确定需要取消当前业务的转让交易吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(function (){
                var service = {};
                service.id = self.data.id;
                var fn="bizTransferCancelDeal";
                service = Commonjs.jsonToString(service)
                var params = Commonjs.getParams(fn,service);
                parent.Commonjs.ajaxSilence(weburl,params,true,function (data) {
                    self.$message.success("取消成功");
                    self.dialogFormVisible = false;
                }, function (data) {
                    self.$message.error(data.msg);
                });
            }).catch(function(){
            });
        },

        /**
		 * 显示安全码.
         */
        showSafeCode: function () {
        	var self = this;
            self.data.safeCode = cloudEncrypt.decodeSession(self.data.safeCode);
            self.showSafeCodeFlag = true;
        },

        /**
		 * 时间格式化.
         */
		formatTime: function (time) {
            return jsonDateTimeFormat({time: time})
        }
    },
    mounted: function () {

    }
});
