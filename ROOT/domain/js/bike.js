// JavaScript Document
$(function (){
	
	querDicSuffix();
	getProDefaultPrice();
	jQuery("#slideBox").slide({
		mainCell : ".bd ul",
		effect : "fold",
		autoPlay : true,
		delayTime : 1000
	});	
	
});

function getProDefaultPrice(){
	var service = {};		
	service.productclass = "domain";
	var fn="getProDefaultPrice";
	service = Commonjs.jsonToString(service)
	var params = Commonjs.getParams(fn,service);
	Commonjs.ajaxTrue(weburl,params,showdata);
}

function showdata(data){
	var doaminlist='';
	$('#doaminlist').html("");
	if(data.result="success"){
		if(data.data.length>0){
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


//查询域名
function subQuery(){
	var domainName = $('#domainName').val();
	$('#domainName').val("");
	if(domainName.indexOf(".")>=0){
		domainName = domainName.substring(domainName.indexOf(".")+1,domainName.length);
	}
	
	if(Commonjs.isEmpty(domainName)){
		Commonjs.alert("请输入查询的域名");
		return false;
	}
	func=$("#current_ext").html();
	domainName = escape($.trim((domainName)));
	func = escape(func);
	location.href = "domainlist.html?domain="+domainName+"&suffix="+func;
}

//获取域名后缀
function querDicSuffix(){
	var service = {};
	service.page=1;
	service.pageSize=200;
	var fn="querDicSuffix";
	service = Commonjs.jsonToString(service)
	var params = Commonjs.getParams(fn,service);//获取参数
	var suffix="";
	
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
			$('#domainext').html("");
			var itemlist=data.data.getUserDomainByUserName;
			suffix+='<ul style="width:100px;overflow-y:scroll;overflow-x:hidden;">'
			if(itemlist.length>0){ 
				BaseForeach(itemlist,function(i,item){
					suffix+='<li>'+item.name+'</li>';
				});	
			}
			suffix+='</ul>';
			$('#domainext').html(suffix);
			$("#domainext li").on('click',function(){ 
				var ext=$(this).html();
				$("#current_ext").html("");
				$("#current_ext").html(ext);
			});
		}				
	});
}
