var itemHtml='';
var left=10;

$(function(){
	getArticleType(); 
	//菜单
	$('.inactive').click(function(){
		if($(this).siblings('ul').css('display')=='none'){
			$(this).parent('li').siblings('li').removeClass('inactives');
			$(this).addClass('inactives');
			$(this).siblings('ul').slideDown(100).children('li');
			if($(this).parents('li').siblings('li').children('ul').css('display')=='block'){
				$(this).parents('li').siblings('li').children('ul').parent('li').children('a').removeClass('inactives');
				$(this).parents('li').siblings('li').children('ul').slideUp(100);
			}
		}else{
			//控制自身变成+号
			$(this).removeClass('inactives');
			//控制自身菜单下子菜单隐藏
			$(this).siblings('ul').slideUp(100);
			//控制自身子菜单变成+号
			$(this).siblings('ul').children('li').children('ul').parent('li').children('a').addClass('inactives');
			//控制自身菜单下子菜单隐藏
			$(this).siblings('ul').children('li').children('ul').slideUp(100);
			//控制同级菜单只保持一个是展开的（-号显示）
			$(this).siblings('ul').children('li').children('a').removeClass('inactives');
		}
	})
	
	$("#menu a").each(function(){
		var isStype=$(this).hasClass("inactive");
		if(!isStype){
			var pleft=$(this).parent().parent().prev().children().children().css("padding-left");
			$(this).css("padding-left",pleft);
		}
	}); 
	$('#menu').children('li').children('a').css({'font-size':'15px','height':'50px','line-height':'50px'});
});

//获取帮助中心类型
function getArticleType(){ 
	var service = {};
	service.paramId = "onlineHelp";  
	var fn = "getListDicParamItem"; 
	service = Commonjs.jsonToString(service);
	var params = Commonjs.getParams(fn,service);//获取参数
	var data = Commonjs.ajax(sysurl,params,false);
	if(data.result == "success"){
		if (data.data.length>0){
			BaseForeach(data.data,function(i,item){
				var temp=getArticleSubType(item.value,item.description);
				if(temp!="")  
					itemHtml+='<li><a href="javascript:void(0)" class="inactive">'+item.description+'</a>';
				else	
					itemHtml+='<li><a href="javascript:getArticle(\''+item.value+'\')">'+item.description+'</a>';  			
				itemHtml+=temp; 
				itemHtml+='</li>'; 
			});
			$("#menu").html(itemHtml);
		}
	}
};

//获取帮助中心子类型
function getArticleSubType(value,info){
	var subItemHtml='';
	var service = {};
	service.paramId = value;
	var fn="getListDicParamItem";
	service = Commonjs.jsonToString(service);
	var params = Commonjs.getParams(fn,service);//获取参数
	var data=Commonjs.ajax(sysurl,params,false);
	if(data.result == "success"){
		if (data.data.length>0){
			BaseForeach(data.data,function(i,item){  
				left+=5; 
				var style="background-color:#6196bb;padding-left:"+left+"%;"
				subItemHtml+='<ul style="display: none;">'; 
				
				var temp=getArticleSubType(item.value,item.description);   
				if(temp!="") 
					subItemHtml+='<li><a href="javascript:void(0)" class="inactive active" style="'+style+'">'+item.description+'</a>';
				else
					subItemHtml+='<li><a href="javascript:getArticle(\''+item.value+'\')" style="'+style+'">'+item.description+'</a>';
				subItemHtml+=temp;  
				subItemHtml+='</li>';
				subItemHtml+='</ul>';
			});
		}
	}
	return subItemHtml;
}

function getArticle(value){
	getHelpInfo(value);
}

