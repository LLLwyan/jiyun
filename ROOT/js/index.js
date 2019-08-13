// JavaScript Document
$(function (){
	queryNotice();
	getProDefaultPrice();
	querDicSuffix();
	$("#current_ext").click(function(){
		$("#domainext").show();
	});
	
	document.onclick = function (event)  
    {     
        var e = event || window.event;  
        var elem = e.srcElement||e.target;     
        while(elem)  
        {   
            if(elem.id == "current_ext")  
            {  
                    return;  
            }  
            elem = elem.parentNode;       
        }  
        //隐藏div的方法  
        $("#domainext").hide(); 
    } 
	
	jQuery("#lanmu-menu").slide( {
		type : "menu",
		titCell : ".yzj-box", //鼠标触发对象
		targetCell : ".sub",
		effect : "slideDown",
		delayTime : 150, //效果时间
		triggerTime : 0, //鼠标延迟触发时间（默认150）
		returnDefault : true//鼠标移走后返回默认状态，
	});
	
	jQuery("#slideBox").slide({
		mainCell : ".bd ul",
		effect : "fold",
		autoPlay : true,
		delayTime : 1000
	});	
	jQuery(".txtMarquee-left").slide({mainCell:".bd ul",autoPlay:true,effect:"leftMarquee",vis:5,interTime:50});
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

//获取公告
function queryNotice(){
	var service = {};
	service.parentId = "notice";
	var fn="querySysArticleList";
	service = Commonjs.jsonToString(service);
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
			$("#notice").empty();
			var notice='';
			if (data.data.length>0){
				BaseForeach(data.data,function(i,item){
					if(i<3){
						notice+='<li>['+jsonDateFormat(item.publishTime)+']<a href="notice/noticeinfo.html?id='+item.id+'">'+item.title+'</a></li>';
					}
				});
			}
			$('#notice').html(notice);
		}				
	});
};
function styr(str,cha,num){
    var x=str.indexOf(cha);
    for(var i=0;i<num;i++){
        x=str.indexOf(cha,x+1);
    }
    return x;
}
//查询域名
function subQuery(){
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
	func=$("#current_ext").html();
	domainName = escape($.trim((domainName)));
	func = escape(func);
	location.href = "domain/domainlist.html?domain="+domainName+"&suffix="+func;
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
			suffix+='<ul style="width:151px;overflow-y:scroll;overflow-x:hidden;">'
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
