var seriesId;
$(function(){
	seriesId = request("seriesId");
	querySeriesZoneList();
	queryRegionList(request("hostType"))
	$("#seriesName").html(decodeURI(request("seriesName")));
})

//获取地域
function queryRegionList(hostType){
	var service = {};
	service.hostType = hostType;
	var fn="queryHostlist";
	service = Commonjs.jsonToString(service);
	var params = Commonjs.getParams(fn,service);
	Commonjs.ajaxTrue(weburl,params,queryRegionSuccess);
}

function queryRegionSuccess(data){
	if(data.data == null){
		return false;
	}
	var html='';
	if (data.data.length>0){
		BaseForeach(data.data,function(i,item){
			html+='<option value="'+item.regionId+'">'+item.regionName+'</option>';
		});
	}
	$('#regionlist').html(html);
	queryZoneList();
}

//查询可用区
function queryZoneList(){
	var service = {};
	service.regionId = $("#regionlist").val();
	var fn="queryDicZoneList";
	service = Commonjs.jsonToString(service);
	var params = Commonjs.getParams(fn,service);
	Commonjs.ajaxTrue(weburl,params,queryZoneSuccess);
}

function queryZoneSuccess(data){
	if(data.data == null){
		return false;
	}
	var html='';
	if (data.data.length>0){
		BaseForeach(data.data,function(i,item){
			html+='<option value="'+item.zoneId+'">'+item.zoneName+'</option>';
		});
	}
	$('#zonelist').html(html);
}

//查询系列可用区
function querySeriesZoneList(){
	var index = $("#pagenumber").val();
	var service = {};
	service.seriesId=seriesId
	service.page = index;
	service.pagesize = 10;
	var fn="queryDicSeriesZonePage";
	service = Commonjs.jsonToString(service)
	var params = Commonjs.getParams(fn,service);//获取参数
	Commonjs.ajaxTrue(weburl,params,querySeriesSuccess);
};

function querySeriesSuccess(data){
	if(data.data == null){
		return false;
	}
	var html="";
	if (data.data.length>0){
		BaseForeach(data.data,function(i,item){
			html+='<tr><td>'+(i+1)+'</td>';
			html+='<td>'+item.regionName+'</td>';
			html+='<td>'+item.zoneName+'</td>';
			html+='<td><a onclick="delDicSeriesZone(\''+item.seriesId+'\',\''+item.zoneId+'\');" href="javascript:void(0);" class="btn btn-primary ">删除</a>';
			html+='</td></tr>';
		});
	}else{
		$("#page").hide();
		html+='<tr><td colspan="4" style="height:50px;text-align:center;line-height:50px;">找不到相关信息</td></tr>';
	}
	$('#serieszonelist').html(html);
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
function delDicSeriesZone(seriesId,zoneId){
	 parent.art.dialog({
 		id: 'testID',
 	    width: '245px',
 	    height: '109px',
 	    content: '您要删除吗？注意：删除后数据将不能恢复',
 	    lock: true,
 	    button: [{
 	      	name: '确定',
 	       	callback: function () {
 	       	 	var service = {};
				service.seriesId = seriesId;
				service.zoneId = zoneId;
				var fn="delDicSeriesZone";
				service = Commonjs.jsonToString(service);
				var params = Commonjs.getParams(fn,service);//获取参数
				parent.Commonjs.ajaxTrue(weburl,params,delDicSeriesZoneSuccess,false);
 	       	}
 	 	},{
 	 		name: '取消'
 	 	}]
 	});
}

function delDicSeriesZoneSuccess(data){
	topSuccess(window, data.msg);
	querySeriesZoneList();
}

//添加系列可用区
function addDicSeriesZone(){
	$('#seriesZonefrom')[0].reset();
	var contents=$('#addBox').get(0);
	parent.art.dialog({
		lock: true,
		artIcon:'add',
		opacity:0.4,
		width: 400,
		padding:'0px 0px',
		title:'添加系列可用区',
		header:false,
		content: contents,
		ok: function () {
			var regionId=$(parent.document).find("#regionlist");
			var zoneId=$(parent.document).find("#zonelist");
			if(Commonjs.isEmpty(regionId.val())){
				topError(window, '地域不能为空');
				regionId.focus();
				return false;
			}
			if(Commonjs.isEmpty(zoneId.val())){
				topError(window, '可用区不能为空');
				zoneId.focus();
				return false;
			}
			var service = {};
			service.seriesId=seriesId;
			service.regionId = regionId.val();
			service.zoneId = zoneId.val();
			var fn="addDicSeriesZone";
			service = Commonjs.jsonToString(service);
			var params = Commonjs.getParams(fn,service);
			parent.Commonjs.ajaxTrue(weburl,params,addDicSeriesZoneSuccess,false);
		},cancel: function(){
			$('#addBox').hide();
		}
	});
}

function addDicSeriesZoneSuccess(data){
		topSuccess(window, data.msg);
		querySeriesZoneList();
}

function Page(totalcounts,pagecount,pager) {
  	$("#"+pager).pager( {
  		totalcounts : totalcounts,
  		pagesize : 10,
  		pagenumber : $("#pagenumber").val(),
  		pagecount : parseInt(totalcounts/pagecount)+(totalcounts%pagecount >0?1:0),
  		buttonClickCallback : function(al) {
  			$("#pagenumber").val(al);
  			querySeriesZoneList();
  		}
  	});
}
