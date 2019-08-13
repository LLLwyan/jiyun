var notInHostType = ServletUtils.get("noHostType");
var notInHostTypeArr = notInHostType ? notInHostType.split(",") : [];

$(function(){
	queryhosttype();
	querySeriesList();
});

function queryhosttype(){
	var service = {};
	service.paramEName = "hostType";
	var fn="getListParamItemByEName";
	service = Commonjs.jsonToString(service);
	var params = Commonjs.getParams(fn,service);//获取参数
	Commonjs.ajaxTrue(sysurl,params,queryhosttypeSuccess);
};

function queryhosttypeSuccess(data){
	if(data.data == null){
		return false;
	}
	var html='';
	if (data.data.length>0){
		BaseForeach(data.data,function(i,item){
            if ($.inArray(item.value, notInHostTypeArr) < 0) {
                html += '<option value="' + item.value + '">' + item.description + '</option>';
            }
		});
	}
	$('#hosttype2').html(html);
	$('#hosttypelist').html('<option value="">所有</option>'+html);
}

//查询实例系列
function querySeriesList(){
	var hosttype = $("#hosttypelist").val();
	if(hosttype==null) {
        hosttype = "";
    }
	var index = $("#pagenumber").val();
	var service = {};
	service.hostType=hosttype
	service.page = index;
	service.pagesize = 10;
	var fn="queryDicSeriesPage";
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
			html+='<td>'+item.hostTypeName+'</td>';
			html+='<td>'+item.seriesId+'</td>';
			html+='<td>'+item.seriesName+'</td>';
			var url="serieszone.html?hostType="+item.hostType+"&seriesId="+item.seriesId+"&seriesName="+encodeURI(item.seriesName);
			html+='<td><a href="'+url+'" class="btn btn-primary">查看可用区</a>';
			html+='<a onclick="delSeries(\''+item.seriesId+'\',\''+item.hostType+'\');" href="javascript:void(0);" class="btn btn-primary ">删除</a>';
			html+='</td></tr>';
		});
	}else{
		$("#page").hide();
		html+='<tr><td colspan="5" style="height:50px;text-align:center;line-height:50px;">找不到相关信息</td></tr>';
	}
	$('#serieslist').html(html);
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
function delSeries(seriesId,hostType){
		parent.art.dialog({
			lock : true,
			opacity : 0.4,
			width : 250,
			title : '提示',
			content : '您确定删除吗？',
			ok : function() {
 	       	 	var service = {};
				service.seriesId = seriesId;
				service.hostType = hostType;
				var fn="delDicSeries";
				service = Commonjs.jsonToString(service);
				var params = Commonjs.getParams(fn,service);//获取参数
				parent.Commonjs.ajaxTrue(weburl,params,delSeriesSuccess,false);
			},cancel: function(){
				$('#dialog').hide();
			}
		});
}

function delSeriesSuccess(data){
	topSuccess(window, data.msg);
	querySeriesList();
}

//新增实例系列
function addSeries(){
	$('#seriesfrom')[0].reset();
	var contents=$('#addBox').get(0);
	parent.art.dialog({
		lock: true,
		artIcon:'add',
		opacity:0.4,
		width: 400,
		padding:'0px 0px',
		title:'添加实例系列',
		header:false,
		content: contents,
		ok: function () {
			var seriesId=$(parent.document).find("#seriesId");
			var seriesName=$(parent.document).find("#seriesName");
			if(Commonjs.isEmpty(seriesId.val())){
				topError(window, '系列代码不能为空');
				seriesId.focus();
				return false;
			}

			if(Commonjs.isEmpty(seriesName.val())){
				topError(window, '系列名称不能为空');
				seriesName.focus();
				return false;
			}

			var service = {};
			service.hostType = $(parent.document).find('#hosttype2').val();
			service.seriesId = seriesId.val();
			service.seriesName=seriesName.val();
			var fn="addDicSeries";
			service = Commonjs.jsonToString(service);
			var params = Commonjs.getParams(fn,service);
			parent.Commonjs.ajaxTrue(weburl,params,addSeriesSuccess,false);
		},cancel: function(){
			$('#addBox').hide();
		}
	});
}

function addSeriesSuccess(data){
	topSuccess(window, data.msg);
	querySeriesList();
}

function Page(totalcounts,pagecount,pager) {
  	$("#"+pager).pager( {
  		totalcounts : totalcounts,
  		pagesize : 10,
  		pagenumber : $("#pagenumber").val(),
  		pagecount : parseInt(totalcounts/pagecount)+(totalcounts%pagecount >0?1:0),
  		buttonClickCallback : function(al) {
  			$("#pagenumber").val(al);
  			querySeriesList();
  		}
  	});
}
