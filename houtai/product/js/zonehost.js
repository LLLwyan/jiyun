var hostType="";
var zoneId="";

//获取已选服务器
function queryZoneHostList(){
    var index = $("#pagenumber").val();
    var service = {};
    service.zoneId = zoneId;
    service.page = index;
    service.pagesize = 10;
    var fn="queryZoneHostList";
    service = Commonjs.jsonToString(service)
    var params = Commonjs.getParams(fn,service);//获取参数
    Commonjs.ajaxTrue(weburl,params,queryZoneSuccess);
}

$(function(){
    hostType=request("hostType");
    zoneId = request("zoneId");

	queryZoneHostList();
});

function queryZoneSuccess(data){
    console.log(data);
	if(undefined == data.data || null == data.data){
		data.data = [];
	}
	var html="";
	if (data.data.length>0){
		BaseForeach(data.data,function(i,item){
			html+='<tr><td>'+(i+1)+'</td>';
			html+='<td>'+item.hostName+'</td>';
			html+='<td>'+item.comIp+'</td>';
			html+='<td><a onclick="delZoneHost('+item.id+');" href="javascript:void(0);" class="btn btn-primary ">删除</a>';
			html+='</td></tr>';
		});
	}else{
	    console.log("dddddddddddddddddddddddddddddddddd");
		$("#page").hide();
		html+='<tr><td colspan="4" style="height:50px;text-align:center;line-height:50px;">找不到相关信息</td></tr>';
	}
	$('#zonehostlist').html(html);
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
function delZoneHost(id){
	parent.art.dialog({
		lock : true,
		opacity : 0.4,
		width : 250,
		title : '提示',
		content : '您确定删除吗？',
		ok : function() {
       	 	var service = {};
			service.id = id;
			var fn="delDicZoneHost";
			service = Commonjs.jsonToString(service);
			var params = Commonjs.getParams(fn,service);//获取参数
			parent.Commonjs.ajaxTrue(weburl,params,delZoneSuccess,false);
		},cancel: function(){
			$('#dialog').hide();
		}
	});
}

function delZoneSuccess(data){
	topSuccess(window, data.msg);
    queryZoneHostList();
}

function queryZoneHostSelect(){
    var service = {};
    service.hostType = hostType;
    service.zoneId = zoneId;
    var fn="queryZoneHostSelect";
    service = Commonjs.jsonToString(service);
    var params = Commonjs.getParams(fn,service);
    var data=Commonjs.ajax(weburl,params,false);
    if(data.result == "success"){
        var html='';
        if (data.data.length>0){
            BaseForeach(data.data,function(i,item){
                html+='<option value="'+item.hostId+'">'+item.hostName + " - " + item.comIP +'</option>';
            });
        }
        $('#hostId').html(html);
    }
}

//新增可用区
function addZoneHost(){
    queryZoneHostSelect();
	$('#zonehostfrom')[0].reset();
	var contents=$('#addBox').get(0);
	parent.art.dialog({
		lock: true,
		artIcon:'add',
		opacity:0.4,
		width: 400,
		padding:'0px 0px',
		title:'添加可用区',
		header:false,
		content: contents,
		ok: function () {
			var hostId=$(parent.document).find("#hostId").val();
			if(Commonjs.isEmpty(hostId)){
				$.tooltip('请选择服务器',2000,false);
				zoneId.focus();
				return false;
			}
			var service = {};
			service.zoneId = zoneId;
			service.hostId = hostId;
			var fn="addDicZoneHost";
			service = Commonjs.jsonToString(service);
			var params = Commonjs.getParams(fn,service);
			parent.Commonjs.ajaxTrue(weburl,params,addZoneSuccess,false);
		},cancel: function(){
			$('#addBox').hide();
		}
	});
}

function addZoneSuccess(data){
	topSuccess(window, data.msg);
    queryZoneHostList();
}

function Page(totalcounts,pagecount,pager) {
  	$("#"+pager).pager( {
  		totalcounts : totalcounts,
  		pagesize : 10,
  		pagenumber : $("#pagenumber").val(),
  		pagecount : parseInt(totalcounts/pagecount)+(totalcounts%pagecount >0?1:0),
  		buttonClickCallback : function(al) {
  			$("#pagenumber").val(al);
            queryZoneHostList();
  		}
  	});
}

function uptZoneName(id){
	if(Commonjs.isEmpty($("#name"+id).val())){
		topError(window, '可用区名称不能为空');
		$("#name"+id).focus();
		return false;
	}
	var service = {};
	service.zoneName = $("#name"+id).val();
	service.id = id;
	var fn="uptZoneName";
	service = Commonjs.jsonToString(service)
	var params = Commonjs.getParams(fn,service);//获取参数
	Commonjs.ajaxTrue(weburl,params,uptZoneNameSuccess,false);
}

function uptZoneNameSuccess(data){
	topSuccess(window, data.msg);
    queryZoneHostList();
}

function backLast() {
	window.history.back();
}
