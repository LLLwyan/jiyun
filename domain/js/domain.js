$(function (){
	queryproduct();
	jQuery(".layB").slide({ mainCell:".slide",effect:"leftLoop",autoPlay:true });
	$("#newActSlide").slide({
		mainCell: ".slide-wrapper ul",
		titCell: '.slide-pagination ul',
		autoPage: true,
		autoPlay: true,
		interTime: 4000,
		effect: "leftLoop",
		vis: 4,
		scroll: 4
	});
		
	var ie6 = !-[1,] && !window.XMLHttpRequest;
	$('.domext-wrapper').on('click', 'label',function () {
		if (event.target.type == 'checkbox' || event.target.type == '') {
	        return;
	    }
		
		if ($(this).hasClass('checked')) {
	        $(this).removeClass('checked');
	       ie6 && $(this).find('input').prop('checked', '');
	    }else {
	        $(this).addClass('checked');
	        ie6 && $(this).find('input').prop('checked', 'checked');
	    }
    });	
	querDicSuffix();//获取域名后缀
	getProDefaultPrice();	
})

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
		beforeSend: function(){
			divalertLoad("正在加载中..."); 
		},
		success: function(obj){ 
			divcloseLoad();
			data =jQuery.parseJSON(obj);
			$('#showsuffix').html("");
			var itemlist=data.data.getUserDomainByUserName;
			var suffix="";
			if(itemlist.length>0){ 
				BaseForeach(itemlist,function(i,item){
					suffix+='<div class="checkbox-inline iCheck-helper" >';
					suffix+='<label class="icheckbox_square-green checked"> ';
					suffix+='<input name="suffix" checked="checked" value="'+item.name+'" class="rcboxhide" type="checkbox" >'+item.name+'</label>';
					suffix+='<i class="icon promotion"></i>';
					suffix+='</div>';
				});
				$('#showsuffix').append(suffix);
			}
		}				
	});
}

//全选
function checkall()
{
	var obj=$("input[name='option']:checked")
	if (obj.val()=="option1"){
		$(".checkbox-inline input[name='suffix']").prop("checked",true)
		$(".icheckbox_square-green").addClass("checked")
	}
	$("#checkall").addClass("checked");
	$("#checkinverse").removeClass("checked");
	$("#checkchang").removeClass("checked");
}

//清空
function checkinverse()
{
	var obj=$("input[name='option']:checked")
	if (obj.val()=="option1"){
		$(".checkbox-inline input[name='suffix']").prop("checked",false)
		$(".icheckbox_square-green").removeClass("checked")
	}
	$("#checkinverse").addClass("checked");
	$("#checkchang").removeClass("checked");
	$("#checkall").removeClass("checked");
}

//常用
function checkchang()
{
	var obj=$("input[name='option']:checked")
	if (obj.val()=="option1"){
		$(".checkbox-inline input[name='suffix']").prop("checked",true);
		$(".icheckbox_square-green").addClass("checked");
	}
	$("#checkchang").addClass("checked");
	$("#checkall").removeClass("checked");
	$("#checkinverse").removeClass("checked");
}
function styr(str,cha,num){
    var x=str.indexOf(cha);
    for(var i=0;i<num;i++){
        x=str.indexOf(cha,x+1);
    }
    return x;
}
//域名查询
function domainsearch(){
	var domainName = $('#domainName').val();
	var n = domainName.split(".").length-1
	var a = domainName.indexOf("www")
	var inde= styr(domainName,".",1)
	$('#domainName').val("");
	if(n == 0){
		domainName = domainName.substring(0,domainName.length)
	}
	else if(n<=1 && a == -1){
		domainName = domainName.substring(0,domainName.indexOf("."));
	}
	else if(n>=2){
		domainName = domainName.substring(domainName.indexOf(".")+1,inde);
	}else if(n==1 && a!= -1){
		domainName = domainName.substring(domainName.indexOf(".")+1,domainName.length);
	}
	
	else if(Commonjs.isEmpty(domainName)){
		Commonjs.alert("请输入查询的域名");
		return false;
	}
	var func="";
	$("input[name='suffix']:checkbox").each(function(){
		if($(this).attr("id")!="checkid"){
			if(this.checked){ 
			func+=$(this).val()+",";
			}
		}
	});
	if(func.length<=0){
		Commonjs.alert("域名后缀至少选择一项！",2000,false);
		return false
	}			
	func = func.substr(0,func.length-1);//除去最后一个"，"	
	domainName = escape($.trim((domainName)));
	func = escape(func);
	location.href = "./domainlist.html?domain="+domainName+"&suffix="+func;
}

function getProDefaultPrice(){
	var service = {};		
	service.productclass = "domain";
	var fn="getProDefaultPrice";
	service = Commonjs.jsonToString(service)
	var params = Commonjs.getParams(fn,service);
	Commonjs.ajaxTrue(weburl,params,showdata);
}

function showdata(data){
	var doaminlist;
	$('#doaminlist').html("");
	if(data.result="success"){
		if(data.data.length>0){
			doaminlist = "";
			 BaseForeach(data.data, function (i, item) {
				 doaminlist+="<tr>";
				 doaminlist+="<td>"+item.productName+"</td>";
				 doaminlist+="<td>"+item.productDetail+"</td>";
				 doaminlist+="<td>"+item.buyPrice+"</td>";
				 doaminlist+="<td>"+item.renewPrice+"</td>";
				doaminlist+="</tr>";
			});
			$('#doaminlist').html(doaminlist);
		}		
	}	
}

function queryproduct(){
	var service = {};
	service.productclass = "domain";
	var fn="queryProductClass";
	service = Commonjs.jsonToString(service)
	var params = Commonjs.getParams(fn,service);
	$.ajax({
		datatype:"json",
        type:"POST",
        url: weburl,
        data:params,				
		async: false,
		timeout : 8000,
		cache : false,				
		beforeSend: function () {
			$('#showimg').show();
   		 },
		success: function(obj){ 
		$('#showimg').hide();
		data =jQuery.parseJSON(obj);
			showdata(data);
			if(data.data.length >0 ){
				var product = "";
					product+='<ul style="width: 6960px; position: relative; overflow: hidden; padding: 0px; margin: 0px; left: -4640px;" >';
				BaseForeach(data.data,function(i,item){
					product+='<li class="clone" style="float: left; width: 260px;">';
					product+='<a href="#" target="_blank" class="slide"> <i style="background-image:url(../images/com.jpg)"></i>'
					product+='<p class="activity-desc"><span>'+item.productDetail+'</span> <i></i> </p>';
					product+='</a> </li>';
				});
				product+=' </ul>'
			}
			$('#product').append(product);	
		}				
	});
}
	
		