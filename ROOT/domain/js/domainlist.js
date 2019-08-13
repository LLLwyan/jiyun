var domain="";
var fnlist="";

$(function (){
	domain = unescape($.trim((request("domain"))));
	fnlist =unescape($.trim((request("suffix")))); 
	if(Commonjs.isEmpty(domain) || Commonjs.isEmpty(fnlist)){
		Commonjs.alerturl("请输入查询的域名","./index.html");
		return false;
	}
	
	$(".moreext").click(function(){
		$('.showext_box').slideToggle(300);
		var txt = $.trim($(this).text());
		if (txt == '显示更多后缀') {
			$(this).text('收起更多后缀')
		} else {
			$(this).text('显示更多后缀')
		}
	});
	querDicSuffix();//获取后缀
	
	$("#domainall").click(function(){    
		if(this.checked){    
			$("input[name='domainlist']").prop("checked",true); 
		}else{    
			$("input[name='domainlist']").prop("checked",false);			
		}   
	});
	domainSearch();
});	

//全选
function selectall(){
	var obj=$("input[name='option']:checked")
	if (obj.val()=="option1"){
		$(".ulext li input[name='suffix']").prop("checked",true)
	}
}

//清空  
function selectinverse()
{
  var obj=$("input[name='option']:checked")
  if (obj.val()=="option1"){
	  $(".ulext li input[name='suffix']").prop("checked",false)
  }
}

//获取域名后缀
function querDicSuffix(){
	var service = {};
	service.page=1;
	service.pageSize=200;
	var fn="querDicSuffix";
	service = Commonjs.jsonToString(service)
	var params = Commonjs.getParams(fn,service);//获取参数
	
	$.ajax({
		datatype:"json",
		type:"POST",
		url: weburl,
		data:params,				
		async: true,
		timeout : 8000,
		cache : false,				
		success: function(obj){ 
			data =jQuery.parseJSON(obj);
			$('#ulext').html("");
			var suffix="";
			var itemlist=data.data.getUserDomainByUserName;
			if(itemlist.length>0){ 
				BaseForeach(itemlist,function(i,item){
					suffix+='<li><input type="checkbox" index="1" name="suffix" value="'+item.name+'" checked="checked"><label>'+item.name+'</label></li>';
				});
				$('#ulext').append(suffix);
			}
		}				
	});
	
}

//域名查询
function domainSearch(){
	$("#domainName").val(domain);
	fnlist=fnlist.split(","); //字符分割
	var nottitle=0;
	var yestitle=0;
	for (i=0;i<fnlist.length;i++ ) 
	{
		showdomain(i,domain+fnlist[i]) 	
	}
}
function styr(str,cha,num){
    var x=str.indexOf(cha);
    for(var i=0;i<num;i++){
        x=str.indexOf(cha,x+1);
    }
    return x;
}
//检测域名
function doSearch(){
	var domainName = $('#domainName').val();
	var n = domainName.split(".").length-1
	var a = domainName.indexOf("www")
	var inde= styr(domainName,".",1)
	$('#domainName').val("");
	if(n == 0){
		domainName = domainName.substring(0,domainName.length);
		$('#domainName').val(domainName);
	}
	else if(n<=1 && a == -1){
		domainName = domainName.substring(0,domainName.indexOf("."));
		$('#domainName').val(domainName);
	}
	else if(n>=2){
		domainName = domainName.substring(domainName.indexOf(".")+1,inde);
		$('#domainName').val(domainName);
	}else if(n==1 && a!= -1){
		domainName = domainName.substring(domainName.indexOf(".")+1,domainName.length);
		$('#domainName').val(domainName);
	}
	
	else if(Commonjs.isEmpty(domainName)){
		Commonjs.alert("请输入查询的域名");
		return false;
	}
	var func=0;
	$('#notdomain').html("");
	$('#yesdomain').html("");
	$("input[name='suffix']:checkbox").each(function(){
		if($(this).attr("id")!="checkid"){
			if(this.checked){ 
				func++;
				showdomain(func,domainName+$(this).val());
				
			}
		}
	});
	if(func<=0){
		Commonjs.alert("域名后缀至少选择一项！");
		return false
	}	
}

function showdomain(index,domainName){
	var productCode = null;
	var service = {};		
	service.domainName = domainName;
	var fn="checkDomainIsReg";
	service = Commonjs.jsonToString(service)
	var params = Commonjs.getParams(fn,service);
	$.ajax({
		datatype:"json",
        type:"POST",
        url: weburl,
        data:params,				
		async: true,
		timeout : 8000,
		cache : false,				
		beforeSend: function () {
			$('#showimg').show();
   		 },
		success: function(obj){ 
   			$('#showimg').hide();
			data =jQuery.parseJSON(obj);
			if(data.result=="success"){
				var yesdomain=""
				var info=data.data.info;  
				if(info.status=="Y"){
					var price=data.data.price;
					var productCode=data.data.productCode;
					if(price>0){
						yesdomain+='<li class="cl">';
						yesdomain+='<h1 class="f-l">';
						yesdomain+='<label class="checkbox">';
						yesdomain+='<input type="checkbox" name="domainlist" dmtype="domtop" id="ch_'+index+'" value="'+domainName+'" sort="0" index="'+index+'" productcode="'+productCode+'">';
						yesdomain+='<span class="domain-name">'+domainName+'</span></label>';
						yesdomain+='</h1>';
						yesdomain+=' <h2 class="f-r" style="margin-top:5px;">';
						yesdomain+='<span class="linkclass"><a href="javascript:;" onClick="addUsercart(\''+index+'\',\''+productCode+'\',\''+domainName+'\')" class="column-btn" id="btnBuy_'+index+'">加入购物车</a><span id="addcart_'+index+'" class="hide" style="color: #ff6b26;">已加入购物车</span></span>';
						yesdomain+='<span class="priceclass">';
						yesdomain+='<span class="price-color">'+price+'</span>元/首年</span>';
						yesdomain+='<span class="tipclass"></span></h2>';
						yesdomain+='</li>';
					}
					else{
						yesdomain+='<li class="cl">';
						yesdomain+='<h1 class="f-l">';
						yesdomain+='<label class="checkbox">';
						yesdomain+='<span class="price-color">'+domainName+'</span></label>';
						yesdomain+='</h1>';
						yesdomain+=' <h2 class="f-r">';
						yesdomain+='<span class="priceclass">';
						yesdomain+='<span class="price-color"></span>价格未设置</span>';
						yesdomain+='<span class="tipclass"></span></h2>';
						yesdomain+='</li>';
					}
					$('#showimg').hide();
					$('#yesdomain').append(yesdomain);
				}else{
					var notdomain="";
					if(info.message=="已注册"){
						notdomain+='<li class="cl"><a class="domain-name" style="overflow:hidden;display:block;height:22px;float:left;" href="#">';
					}else{
						notdomain+='<li class="cl"><a class="domain-name" style="width:100%;overflow:hidden;display:block;height:22px;float:left;" href="#">';
					}
					notdomain+='<h1 class="f-l">&nbsp;<span class="domain-name">'+domainName+'</span></h1>';
					notdomain+=' <h2 class="f-r font12"></h2>';
					if(info.message=="已注册"){
						notdomain+='<a style="float:right;font-size:14px" target="_blank"><span class="ljyd-wrapper">已注册</span></a>';
					}else{
						notdomain+='<span class="ljyd-wrapper">'+info.message+'</span>';
					}
					notdomain+=' </li>'; 
					$('#notdomain').append(notdomain);
				}
			}
		},
		error: function () {}
	});
}

//加入购物车
function addUsercart(indexs,productcode,domainName){
	var service = {};
	var fn = "addUserCart";
	service.productCode = productcode;
	service.applyTime =1;
	service.priceType = "Y";
	service.cartType = "add";
	service.productParam = domainName;
	service = Commonjs.jsonToString(service);
	var params = Commonjs.getParams(fn, service);//获取参数
	Commonjs.ajaxTrue(weburl,params,addSuccess,true,"正在加入购物车中...");
}

function addSuccess(data){
	$("#btnBuy_"+indexs).hide();
	$("#addcart_"+indexs).show();
	$("#ch_"+indexs).remove();
	queryUserCartCount();
}

//全选
function selAddCart(){
	var indexs=0;
	$("[name=domainlist]:checked").each(function(){
		indexs++;
		var index=$(this).attr("index");
		var productcode=$(this).attr("productcode");
		var domainName=$(this).val();
			if(index!=undefined && $(this).attr("productcode")!=undefined &&$(this).val()!=undefined){
				addUsercart(index,productcode,domainName);
			}
	});
	if(indexs<=0){
		Commonjs.alert("未勾选域名选项");
		return false
	}else{
		Commonjs.alert("加入购物车成功,请到购物车结算");
	}
}
		