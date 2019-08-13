var inHostType = ServletUtils.get("hostType");
var notInHostType = ServletUtils.get("noHostType");
var notInHostTypeArr = notInHostType ? notInHostType.split(",") : [];

$(function(){
	queryhosttype();
	querRegion();
});

//地区查询
function querRegion(){
	var hosttype = $("#hosttype").val();
	var index = $("#pagenumber").val();
	var service = {};
	service.hostType=hosttype;
	service.notInHostType = notInHostType;
	service.page = index;
	service.pagesize = 10;
	var fn="queryHostlocation";
	service = Commonjs.jsonToString(service)
	var params = Commonjs.getParams(fn,service);//获取参数
	Commonjs.ajaxTrue(weburl,params,querRegionSuccess);
};

function querRegionSuccess(data){
	if(data.data == null){
		return false;
	}
	$("#locationlist").empty();
	var locationlist="";
	if (data.data.length>0){
		BaseForeach(data.data,function(i,item){
			locationlist+=' <tr><td>'+(i+1)+'</td>';
			locationlist+=' <td>'+item.hostTypeName+'</td>';
			locationlist+=' <td>'+item.regionId+'</td>';
			locationlist+='<td><input type="text" class="manager-input m-input width100" style="width:100px;" id="name'+item.id+'" value='+item.regionName+'></td>';
			locationlist+=' <td>'
			locationlist+='<a  onclick="delRegion(\''+item.id+'\');" href="javascript:void(0);" class="btn btn-primary ">删除</a> '
			locationlist+='<a onclick="uptregionName(\''+item.id+'\');" href="javascript:void(0);" class="btn btn-primary ">修改</a>'
			locationlist+='</td></tr>';
		});
	}else{
		$("#page").hide();
		locationlist+=' <tr><td colspan="5" style="height:50px;text-align:center;line-height:50px;">找不到相关信息</td></tr>';
	}
	$('#locationlist').append(locationlist);
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

//删除地区
function delRegion(Id){
	parent.art.dialog({
		lock : true,
		opacity : 0.4,
		width : 250,
		title : '提示',
		content : '您确定删除吗？',
		ok : function() {
			var service = {};
			service.HostlocationId = Id;
			var fn="delHostlocation";
			service = Commonjs.jsonToString(service);
			var params = Commonjs.getParams(fn,service);//获取参数
			parent.Commonjs.ajaxTrue(weburl,params,delRegionSuccess,false);
		},
		cancel: function(){
			$('#dialog').hide();
		}
	});
}

function delRegionSuccess(data){
	topSuccess(window, data.msg);
	querRegion();
}

//新增地域
function addRegion(){
	$('#localregionc').show();
	$('#localregionn').show();
	$('#aliregionc').hide();
	$('#regionfrom')[0].reset();
	var contents=$('#addBox').get(0);
	parent.art.dialog({
		lock: true,
		artIcon:'add',
		opacity:0.4,
		width: 400,
		padding:'0px 0px',
		title:'添加地域信息',
		header:false,
		content: contents,
		ok: function () {
			if($(parent.document).find('#hosttype2').val()!="alc"){
				var regionId = $(parent.document).find('#regionId');
				var regionName = $(parent.document).find('#regionName');

				if(Commonjs.isEmpty(regionId.val())){
					topError(window, '地域代码不能为空');
					regionId.focus();
					return false;
				}

				if(Commonjs.isEmpty(regionName.val())){
					topError(window, '地域名不能为空');
					regionName.focus();
					return false;
				}
			}
			var service = {};
			var fn;
			if($(parent.document).find('#hosttype2').val()!="alc"){
				fn="addHostlocation";
				service.regionId = regionId.val();
				service.regionName = regionName.val();
			}else{
				fn="syncRegion";
			}
			service.hostType = $(parent.document).find('#hosttype2').val();
			service = Commonjs.jsonToString(service);
			var params = Commonjs.getParams(fn,service);//获取参数
			Commonjs.ajaxTrue(weburl,params,addRegionSuccess,false);
		},cancel: function(){
			$('#addBox').hide();
		}
	});
}

function addRegionSuccess(data){
	topSuccess(window, data.msg);
	querRegion();
}

function hostChange(){
	var hosttyep = $('#hosttype2').val();
	if(hosttyep!="alc"){
		$('#localregionc').show();
		$('#localregionn').show();
		$('#aliregionn').hide();
	}else{
		$('#aliregionc').show();
		$('#localregionc').hide();
		$('#localregionn').hide();
	}
};


//获取地域 (公共方法,后期需调整)
function queryhosttype(){
	var service = {};
	service.paramEName = "hostType";
	var fn="getListParamItemByEName";
	service = Commonjs.jsonToString(service);
	var params = Commonjs.getParams(fn,service);//获取参数
	var data=Commonjs.ajax(sysurl,params,false);
	if(data.result == "success"){
		$("#hosttype").empty();
		$("#hosttype2").empty();
		var userlist= inHostType ? '' : '<option value="">所有</option>';
		var userlist2='';
		if (data.data.length>0){
			BaseForeach(data.data,function(i,item){
				if (inHostType) {
					if (inHostType == item.value) {
                        userlist+='<option value="'+item.value+'">'+item.description+'</option>';
                        userlist2+='<option value="'+item.value+'">'+item.description+'</option>';
					}
				} else {
					console.log(notInHostTypeArr);
					if ($.inArray(item.value, notInHostTypeArr) < 0) {
                        userlist += '<option value="' + item.value + '">' + item.description + '</option>';
                        userlist2 += '<option value="' + item.value + '">' + item.description + '</option>';
                    }
				}
			});
		}
		$('#hosttype2').append(userlist2);
		$('#hosttype').append(userlist);
	}
};

function Page(totalcounts,pagecount,pager) {
  	$("#"+pager).pager( {
  		totalcounts : totalcounts,
  		pagesize : 10,
  		pagenumber : $("#pagenumber").val(),
  		pagecount : parseInt(totalcounts/pagecount)+(totalcounts%pagecount >0?1:0),
  		buttonClickCallback : function(al) {
  			$("#pagenumber").val(al);
  			querRegion();
  		}
  	});

}

function uptregionName(id){
	if(Commonjs.isEmpty($("#name"+id).val())){
		topError(window, '地域名称不能为空');
		$("#name"+id).focus();
		return false;
	}
	var service = {};
	service.regionName = $("#name"+id).val();
	service.id = id;
	var fn="uptregionName";
	service = Commonjs.jsonToString(service)
	var params = Commonjs.getParams(fn,service);//获取参数
	parent.Commonjs.ajaxTrue(weburl,params,uptregionNameSuccess,false);
}

function uptregionNameSuccess(data){
	topSuccess(window, data.msg);
	querRegion();
}
//-----------------------------------以上为完成部分------------------------------
