var type="domain"
var showTag = ServletUtils.get("proclass");
if (showTag) {
    type = showTag;
}


$(function(){
	 queryProductClass();
	 getProductList();
    if (type == 'diy') {
        getUsableSubClass();
    }
});

//获取产品类型
function queryProductClass(){
	var service = {};
	service.paramEName = "productclass";
	var fn="getListParamItemByEName";
	service = Commonjs.jsonToString(service);
	var params = Commonjs.getParams(fn,service);//获取参数
	Commonjs.ajaxTrue(sysurl,params,queryProductSuccess);
}

function queryProductSuccess(data){
	if(data.data == null){
		return false;
	}
	var html='';
	if (data.data.length>0){
		BaseForeach(data.data,function(i,item){
			if (showTag) {
				if (showTag == item.value) {
                    html+='<li onclick="changeTab(this)" value='+item.value+'><a href="javascript:;">'+item.description+'</a></li>';
				}
			} else {
                html+='<li onclick="changeTab(this)" value='+item.value+'><a href="javascript:;">'+item.description+'</a></li>';
			}
		});
	}
	$('#ulTab').html(html);
	$('#ulTab li:first').addClass("liactive");
	$("#proclass").html($('#ulTab li:first').find("a").html());
}

function getUsableSubClass() {
    var service = {};
    var fn="usableDiyProCat";
    service = Commonjs.jsonToString(service);
    var params = Commonjs.getParams(fn,service);//获取参数
    Commonjs.ajaxTrue(weburl,params,function (data) {
		$('.subClassElement').css('display', '');
		var html = '';
		$.each(data.data, function (index, item) {
			html += '<option value="' + item.categoryCode + '">' + item.categoryName + '</option>';
        });
		$('#subclass').html(html);
    });
}

//获取产品列表
function getProductList(){
	var index = $("#pagenumber").val();
	var service={};
	service.productClass=type;
	service.page = index;
	service.pageSize = 10;
	var fn="getProductList";
	service = Commonjs.jsonToString(service)
	var params = Commonjs.getParams(fn,service);//获取参数
	Commonjs.ajaxTrue(weburl,params,getProductSuccess);
}

function getProductSuccess(data){
	if(data.data == null){
		return false;
	}
	var html='';
	if (data.rows!=0){
		BaseForeach(data.data,function(i,item){
			html+='<tr><td>'+(i+1)+'</td>';
			html+='<td>'+item.productClassName+'</td>';
			if (type == 'diy') {
                html+='<td>'+item.subClassName+'</td>';
			}
			html+='<td id="productCode_'+i+'">'+item.productCode+'</td>';
			html+='<td><input type="text"  class="manager-input m-input width200" placeholder="产品名称" id="productName_'+i+'" chknonull="yes" chkmsg="产品名称" value="'+item.productName+'"></td>';
			html+='<td><input type="text"  class="manager-input m-input width50" id="listId_'+i+'" value="'+item.listId+'"></td>';
			html+='<td><a onclick="uptSysProduct('+i+')" href="javascript:void(0);" class="btn btn-primary ">修改</a>';
			html+='<a onclick="productDetail('+i+')" href="javascript:void(0);" class="btn btn-primary ">详细设置</a>';
			html+='<a onclick="delSysProduct('+i+')" href="javascript:void(0);" class="btn btn-primary ">删除</a></td>'
		});
		$("#page").show();
	}else{
		$("#page").hide();
		html+=' <tr><td colspan="10" style="height:50px;text-align:center;line-height:50px;">找不到相关信息</td></tr>';
	}
	$('#prolist').html(html);
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

//修改产品信息
function uptSysProduct(i){
	var service = {};
	service.productCode=$("#productCode_"+i).html();
	service.productName = $("#productName_"+i).val();
	service.listId=$("#listId_"+i).val();
	var fn="uptSysProduct";
	service = Commonjs.jsonToString(service);
	var params = Commonjs.getParams(fn,service);
	Commonjs.ajaxTrue(weburl,params,uptSysProductSuccess,false);
}

function uptSysProductSuccess(data){
	topSuccess(window, data.msg);
	getProductList();
}

function delSysProduct(i){
	parent.art.dialog({
		lock : true,
		opacity : 0.4,
		width : 250,
		title : '提示',
		content : '您确定删除吗？',
		ok : function() {
       	 	var service = {};
       	 	service.productCode=$("#productCode_"+i).html();
			var fn="delSysProduct";
			service = Commonjs.jsonToString(service);
			var params = Commonjs.getParams(fn,service);//获取参数
			Commonjs.ajaxTrue(weburl,params,delSysProductSuccess,false);
		},cancel: function(){
			$('#dialog').hide();
		}
	});
}

function delSysProductSuccess(data){
	topSuccess(window, data.msg);
	getProductList();
}

//添加产品
function addProduct(){
	var productCode=$("#productCode").val();
	var productName=$("#productName").val();

	if(Commonjs.isEmpty(productCode)){
		topError(window, '产品编号不能为空');
        productCode.focus();
		return false;
	}
	if(Commonjs.isEmpty(productName)){
		topError(window, '产品名称不能为空');
        productName.focus();
		return false;
	}

	var service = {};
	service.productClass=type;
	service.productCode = productCode;
	service.productName = productName;
	if (type == 'diy') {
		service.subClass = $('#subclass').val();
	}
	var fn="addSysProduct";
	service = Commonjs.jsonToString(service);
	var params = Commonjs.getParams(fn,service);
	Commonjs.ajaxTrue(weburl,params,addProductSuccess,false);
}

function addProductSuccess(data){
	topSuccess(window, data.msg);
	$("#productCode").val("");
	$("#productName").val("");
	getProductList();
}

//产品详细设置
function productDetail(i){
	if(type=="domain") {
        window.location.href = "domainproduct.html?productCode=" + $("#productCode_" + i).html();
    } else if(type=="cloud") {
        window.location.href = "cloudproduct.html?productCode=" + $("#productCode_" + i).html();
    } else if(type=="cloudDisk") {
        window.location.href = "clouddiskproduct.html?productCode=" + $("#productCode_" + i).html();
    } else if (type == 'db') {
        window.location.href = "dbproduct.html?productCode=" + $("#productCode_" + i).html();
	} else if (type == 'vhost') {
        window.location.href = "vhostproduct.html?productCode=" + $("#productCode_" + i).html();
    } else if (type == 'diy') {
        window.location.href = "diyproduct.html?productCode=" + $("#productCode_" + i).html();
	}
}

//tab切换
function changeTab(obj){
	$(obj).addClass("liactive").siblings().removeClass("liactive"); //切换选中的按钮高亮状态
	 var index=$(obj).index(); //获取被按下按钮的索引值，需要注意index是从0开始的
	 $(".tab_box > div").eq(index).show().siblings().hide(); //在按钮选中时在下面显示相应的内容，同时隐藏不需要的框架内容
	 $("#proclass").html($(obj).find("a").html());
	 type=$(obj).attr("value");
	 $("#totalcount").val(1);
	 $("#pagenumber").val(1);
	 getProductList();
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
  			getProductList();
  		}
  	});
}
