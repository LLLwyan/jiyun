var inHostType = ServletUtils.get("hostType");
var notInHostType = ServletUtils.get("noHostType");
var notInHostTypeArr = notInHostType ? notInHostType.split(",") : [];

$(function(){
	queryCatList();
});

//查询可用区
function queryCatList(){
	var hosttype = $("#hosttypelist").val();
	if(hosttype==null)
		hosttype="";
	var index = $("#pagenumber").val();
	var service = {};
	service.hostType=hosttype
	service.page = index;
	service.pagesize = 10;
	service.notInHostType = notInHostType;
	var fn="queryDiyProCatList";
	service = Commonjs.jsonToString(service)
	var params = Commonjs.getParams(fn,service);//获取参数
	Commonjs.ajaxTrue(weburl,params,queryCatSuccess);
};

var nowData;
function queryCatSuccess(data){
	if(data.data == null){
		return false;
	}
	var html="";
	nowData = data.data;
	if (data.data.length>0){
		BaseForeach(data.data, function(i,item){
			var linkUrl = Commonjs.getCfgVal(configParam.common.cfgKey.template) + 'diy/index.html?subClass=' + item.categoryCode;
			html+='<tr><td>'+(i+1)+'</td>';
			html+='<td>'+item.categoryCode+'</td>';
			html+='<td>'+item.categoryName+'</td>';
			html+='<td>'+item.sortNum+'</td>';
			html+='<td>'+(item.status == 1 ? '启用' : '停用')+ '</td>';
			html+='<td><a href="' + linkUrl + '" target="_blank">'+(item.diyPage == '' ? '默认' : '自定义') + '</a></td>';
			html+='<td><a _data-id="' + item.diyId + '" href="javascript:void(0);" class="btn btn-primary delete" _funCode="deleteDiyProCat">删除</a>';
			html+='<a _data-id="' + i + '" href="javascript:void(0);" class="btn btn-primary edit" _funCode="editDiyProCat">修改</a>';
			if(item.status==1)  {
				html+='<a _data-id="' + item.diyId + '" class="btn btn-primary stop" _funCode="editDiyProCatStatus">停用</a>';
            } else {
                html+='<a _data-id="' + item.diyId + '" class="btn btn-primary start" _funCode="editDiyProCatStatus">启用</a>';
			}
			html+='</td></tr>';
		});
	}else{
		$("#page").hide();
		html+='<tr><td colspan="6" style="height:50px;text-align:center;line-height:50px;">找不到相关信息</td></tr>';
	}
	$('#diycatlist').html(html);
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

	//启用
	$('#diycatlist').find('.start').on('click', function () {
        var id = $(this).attr('_data-id');
        setStatus(id, 1);
    });

	//停用
    $('#diycatlist').find('.stop').on('click', function () {
        var id = $(this).attr('_data-id');
        setStatus(id, 0);
    });

    //修改
    $('#diycatlist').find('.edit').on('click', function () {
        var line = $(this).attr('_data-id');
        editCat(line);
    });

    //删除
    $('#diycatlist').find('.delete').on('click', function () {
        var id = $(this).attr('_data-id');
        delCat(id);
    });
}

//删除地区
function delCat(id){
	parent.art.dialog({
		lock : true,
		opacity : 0.4,
		width : 250,
		title : '提示',
		content : '您确定删除吗？',
		ok : function() {
       	 	var service = {};
			service.id = id;
			var fn="deleteDiyProCat";
			service = Commonjs.jsonToString(service);
			var params = Commonjs.getParams(fn,service);//获取参数
			Commonjs.ajaxTrue(weburl,params,function (data) {
                topSuccess(window, data.msg);
                queryCatList();
            },false);
		},cancel: function(){
			$('#dialog').hide();
		}
	});
}

//新增可用区
function addCat(){
	$('#zonefrom')[0].reset();
    $("#categoryCode").get(0).disabled=false;
	var contents=$('#addBox').get(0);
	parent.art.dialog({
		lock: true,
		artIcon:'add',
		opacity:0.4,
		width: 600,
		padding:'0px 0px',
		title:'添加分类',
		header:false,
		content: contents,
		ok: function () {
			var categoryCode=$(parent.document).find("#categoryCode");
			var categoryName=$(parent.document).find("#categoryName");
			var sortNum=$(parent.document).find("#sortNum");
			if(Commonjs.isEmpty(categoryCode.val())){
				topError(window, '分类编码不能为空');
                categoryCode.focus();
				return false;
			}
			if(Commonjs.isEmpty(categoryName.val())){
				topError(window, '分类名称不能为空');
                categoryName.focus();
				return false;
			}
			if(!Commonjs.isNonnInt(sortNum.val())){
				topError(window, '排序编号只能为大于0的整数');
                sortNum.focus();
				return false;
			}
			var service = {};
			service.categoryCode = categoryCode.val();
			service.categoryName = categoryName.val();
			service.sortNum = sortNum.val();
			service.diyPage = $.trim($(parent.document).find('#diyPage').val());
			service.diyHeight = $.trim($(parent.document).find('#diyHeight').val());
			var fn="newDiyProCat";
			service = Commonjs.jsonToString(service);
			var params = Commonjs.getParams(fn,service);
			Commonjs.ajaxTrue(weburl,params,function (data) {
                topSuccess(window, data.msg);
                queryCatList();
            },false);
		},cancel: function(){
			$('#addBox').hide();
		}
	});
}

function Page(totalcounts,pagecount,pager) {
  	$("#"+pager).pager( {
  		totalcounts : totalcounts,
  		pagesize : 10,
  		pagenumber : $("#pagenumber").val(),
  		pagecount : parseInt(totalcounts/pagecount)+(totalcounts%pagecount >0?1:0),
  		buttonClickCallback : function(al) {
  			$("#pagenumber").val(al);
  			queryZoneList();
  		}
  	});
}

/**
 * 设置状态.
 * @param id
 * @param status
 */
function setStatus(id, status) {
    parent.art.dialog({
        lock : true,
        opacity : 0.4,
        width : 250,
        title : '提示',
        content : '您确定要' + (status==1 ? '启用' : '停止') + '该分类吗？',
        ok : function() {
            var service = {};
            service.id = id;
            service.status = status;
            var fn = "editDiyProCatStatus";
            service = Commonjs.jsonToString(service)
            var params = Commonjs.getParams(fn, service);//获取参数
            Commonjs.ajaxTrue(weburl, params, function (data) {
                topSuccess(window, data.msg);
                queryCatList();
            }, false);
        },cancel: function(){
            $('#dialog').hide();
        }
    });
}

function editCat(line){
    $('#zonefrom')[0].reset();
    var data = nowData[line];
    $("#categoryCode").get(0).disabled=true;
    $("#categoryCode").val(data.categoryCode);
    $("#categoryName").val(data.categoryName);
    $("#sortNum").val(data.sortNum);
    $('#diyPage').val(data.diyPage);
    $('#diyHeight').val(data.diyHeight);
    var contents=$('#addBox').get(0);
    parent.art.dialog({
        lock: true,
        artIcon:'add',
        opacity:0.4,
        width: 600,
        padding:'0px 0px',
        title:'修改分类',
        header:false,
        content: contents,
        ok: function () {
            var categoryCode=$(parent.document).find("#categoryCode");
            var categoryName=$(parent.document).find("#categoryName");
            var sortNum=$(parent.document).find("#sortNum");
            if(Commonjs.isEmpty(categoryCode.val())){
                topError(window, '分类编码不能为空');
                categoryCode.focus();
                return false;
            }
            if(Commonjs.isEmpty(categoryName.val())){
                topError(window, '分类名称不能为空');
                categoryName.focus();
                return false;
            }
            if(!Commonjs.isNonnInt(sortNum.val())){
                topError(window, '排序编号只能为大于0的整数');
                sortNum.focus();
                return false;
            }
            var service = {};
            service.id=data.diyId;
            service.categoryName = categoryName.val();
            service.sortNum = sortNum.val();
            service.diyPage = Commonjs.trim($(parent.document).find('#diyPage').val());
            service.diyHeight = $.trim($(parent.document).find('#diyHeight').val());
            var fn="editDiyProCat";
            service = Commonjs.jsonToString(service);
            var params = Commonjs.getParams(fn,service);
            Commonjs.ajaxTrue(weburl,params,function (result) {
                topSuccess(window, result.msg);
                queryCatList();
            },false);
        },cancel: function(){
            $('#addBox').hide();
        }
    });
}
