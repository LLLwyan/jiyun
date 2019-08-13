var notInHostType = ServletUtils.get("noHostType");
var notInHostTypeArr = notInHostType ? notInHostType.split(",") : [];

$(function(){
	queryHostType();
	queryDicModelList();
	getDicSpecList();
});

//获取云主机上级注册商
function queryHostType(){
	var service = {};
	service.paramEName = "hostType";
	var fn="getListParamItemByEName";
	service = Commonjs.jsonToString(service);
	var params = Commonjs.getParams(fn,service);//获取参数
	var data=Commonjs.ajax(sysurl,params,false);
	if(data.result == "success"){
		var html='';
		if (data.data.length>0){
			BaseForeach(data.data,function(i,item){
                if ($.inArray(item.value, notInHostTypeArr) < 0) {
                    html += '<option value="' + item.value + '">' + item.description + '</option>';
                }
			});
		}
		$('#hosttype').html('<option value="">所有</option>'+html);
		$('#hosttype2').html(html);
		queryDicModelList();
	}
}

//获取实例机型
function queryDicModelList(){
	var service = {};
	service.hostType = $("#hosttype2").val();
	var fn="queryDicModelList";
	service = Commonjs.jsonToString(service);
	var params = Commonjs.getParams(fn,service);//获取参数
	var data=Commonjs.ajax(weburl,params,false);
	if(data.result == "success"){
		var html='';
		if (data.data.length>0){
			BaseForeach(data.data,function(i,item){
				html+='<option value="'+item.modelId+'">'+item.modelName+'</option>';
			});
		}
		$('#modellist').html('<option value="">所有</option>'+html);
		$('#modellist2').html(html);
	}
}

//获取实例规格列表
function getDicSpecList(){
	var index = $("#pagenumber").val();
	var service={};
	service.hostType=$("#hosttype").val();
	service.modelId=$("#modellist").val();
	service.page = index;
	service.pageSize = 10;
	var fn="queryDicSpecList";
	service = Commonjs.jsonToString(service)
	var params = Commonjs.getParams(fn,service);//获取参数
	Commonjs.ajaxTrue(weburl,params,getDicSpecSuccess);
}

function getDicSpecSuccess(data){
	if(data.data == null){
		return false;
	}
	var html='';
	if (data.rows!=0){
		BaseForeach(data.data,function(i,item){
			html+='<tr><td>'+(i+1)+'</td>';
			html+='<td>'+item.hostTypeName+'</td>';
			html+='<td>'+item.modelName+'</td>';
			html+='<td>'+item.specCode+'</td>'
			html+='<td>'+item.cpu+'核</td>';
			html+='<td>'+item.memory+'GB</td>';
			html+="<td><a onclick=\"delDicSpec('"+item.id+"')\" href=\"javascript:void(0);\" class=\"btn btn-primary\">删除</a></td>";
		});

		$("#page").show();
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
	}else{
		$("#page").hide();
		html+='<tr><td colspan="9" style="height:50px;text-align:center;line-height:50px;">找不到相关信息</td></tr>';
	}
	$('#speclist').html(html);
}

//删除实例规格
function delDicSpec(id){
	parent.art.dialog({
		lock : true,
		opacity : 0.4,
		width : 250,
		title : '提示',
		content : '您确定删除吗？',
		ok : function() {
       	 	var service = {};
       	 	service.id=id;
			var fn="delDicSpec";
			service = Commonjs.jsonToString(service);
			var params = Commonjs.getParams(fn,service);//获取参数
			parent.Commonjs.ajaxTrue(weburl,params,delDicSpecSuccess,false);
		},cancel: function(){
			$('#dialog').hide();
		}
	});
}

function delDicSpecSuccess(data){
	topSuccess(window, data.msg);
	getDicSpecList();
}

//添加实例规格
function addSpec(){
	$("#specCode").val("");
	$("#cpu").val("");
	$("#memory").val("");
	var contents=$('#addBox').get(0);
	parent.art.dialog({
		lock: true,
		artIcon:'add',
		opacity:0.4,
		width: 400,
		padding:'0px 0px',
		title:'添加实例规格',
		header:false,
		content: contents,
		ok: function () {
			var hostType=$(parent.document).find("#hosttype2").val();
			if(hostType==""){
				topError(window, '请选择上级注册商');
				$("#hosttype2").focus();
				return false;
			}

			var modelId = $(parent.document).find('#modellist2');
			if(Commonjs.isEmpty(modelId.val())){
				topError(window, '实例机型不能为空');
				modelId.focus();
				return false;
			}

			var specCode=$(parent.document).find("#specCode")
			if(Commonjs.isEmpty(specCode.val())){
				topError(window, '规格代码不能为空');
				specCode.focus();
				return false;
			}
			if(CndnsValidate.checkChinese(specCode.val())){
				topError(window, 'ID不能带有中文');
				specCode.focus();
				return false;
			}
			var cpu = $(parent.document).find('#cpu');
			if(Commonjs.isEmpty(cpu.val())){
				topError(window, 'CPU核数不能为空');
				cpu.focus();
				return false;
			}
			if(!CndnsValidate.checkNumber(cpu.val())){
				topError(window, 'CPU核数只能为数字');
				cpu.focus();
				return false;
			}

			var memory = $(parent.document).find('#memory');
			if(Commonjs.isEmpty(memory.val())){
				topError(window, '内存不能为空');
				memory.focus();
				return false;
			}
			if(!CndnsValidate.checkNumber(memory.val())){
				topError(window, '内存只能为数字');
				memory.focus();
				return false;
			}
			var service = {};
			service.hostType=hostType;
			service.modelId = modelId.val();
			service.specCode = specCode.val();
			service.cpu = cpu.val();
			service.memory=memory.val();
			var fn="addDicSpec";
			service = Commonjs.jsonToString(service);
			var params = Commonjs.getParams(fn,service);//获取参数
			parent.Commonjs.ajaxTrue(weburl,params,addSpecSuccess,false);
		},cancel: function(){
			$('#addBox').hide();
		}
	});
}

function addSpecSuccess(data){
		topSuccess(window, data.msg);
		getDicSpecList();
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
  			getDicSpecList();
  		}
  	});
}
