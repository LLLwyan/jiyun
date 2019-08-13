var tel;
var qq;
var fax;
var email;
var webicp;
var webicp2;
var addr;
var postCode;
var comname;
var webname;
var webtitle;
var weblogo;
var wechatlogo;
var introduce;
var supportCodeLogin;
var codeLoginWay;

function getParam(){
	var service = {};
	service.type = 1;
	var fn="getparam";
	service = Commonjs.jsonToString(service)
	var params = Commonjs.getParams(fn,service);//获取参数
	var data=Commonjs.ajax(sysurl,params,false);
	if(data==null)
		return false;
	if(data.result=="success"){
		//存到localstorage
		window.localStorage.setItem(configParam.common.configStorageKey, JSON.stringify(data.data));
		BaseForeach(data.data, function (i, item) {
			switch(item.paramName){
				case "comtel":
					tel=item.paramValue;
					break;
				case "comqq":
					qq=item.paramValue;
					break;
				case "comfax":
					fax=item.paramValue;
					break;
				case "comemail":
					email=item.paramValue;
					break;
				case "webicp":
					webicp=item.paramValue;
					break;
				case "webicp2":
					webicp2=item.paramValue;
					break;
				case "comaddress":
					addr=item.paramValue;
					break;
				case "compostcode":
					postCode=item.paramValue;
					break;
				case "comname":
					comname=item.paramValue;
					break;
				case "webname":
					webname=item.paramValue;
					break;
				case "webtitle":
					webtitle=item.paramValue;
					break;
				case "weblogo":
					weblogo=item.paramValue;
					break;
				case "wechatlogo":
					wechatlogo=item.paramValue;
					break;
				case "introduce":
					introduce=item.paramValue;
					break;
				case "codeLoginWay":
                    codeLoginWay = item.paramValue;
                    break;
				case "supportCodeLogin":
                    supportCodeLogin = item.paramValue;
                    break;
			}
		});
	}
}

$(function(){
	getParam();
    var heard="";

    heard+="       <div id='hul' class='wrapper'>";
    heard+="       </div>";

    if(document.getElementById('header')) document.getElementById('header').innerHTML=heard;

    $('#hul').tpl('/tpl/nav1', {}, function () {
    });




    if(document.getElementById('webtitle')) document.getElementById('webtitle').innerHTML=webtitle;

    $("#hul li").click(function () {
    	$.cookie("cur", "", { expires: -1 });
    	var this_id = $(this).attr("id");
    	$.cookie("cur", this_id,{path:"/"});
    });
    if ($.cookie("cur")!= null){
    	var num1=$.cookie("cur");
    	$("#"+num1).addClass('hover');
    }
    var service = {};
    var fn="logined";
    service = Commonjs.jsonToString(service)
    var params = Commonjs.getParams(fn,service);//获取参数
    $.ajax({
    	datatype:"json",
        type:"POST",
        url: weburl,
        data:params,
    	cache : false,
    	success:function(data){
    		var obj = jQuery.parseJSON(data);
    		if (obj.result == "success") {
    			$('#nologged').addClass('hide');
    			$('#yeslogged').addClass('show');
    			$.cookie(config.cookie.userName,obj.data.uname);
    			if($.cookie(config.cookie.userName)!=null){
    				$('#hluserName').html("您好,"+obj.data.uname);
    			}
    		}else{
    			$('#nologged').addClass('show');
    			$('#yeslogged').addClass('hide');
				if(obj.result=='S202'){
					$.cookie(config.cookie.userName, null,{expires:-1,path:"/"});
				}
    		}
    	},
    	error:function(){
    		$('#nologged').addClass('show');
    		$('#yeslogged').addClass('hide');
    	}
    });

    if ($.cookie(config.cookie.userName)==null || $.cookie(config.cookie.userName)=="undefined"){
    	$("#cartCount").text(0);
    }else{
    	queryUserCartCount();
    }
});

function queryUserCartCount(){
	var service = {};
	var fn="queryUserCartCount";
	service = Commonjs.jsonToString(service)
	var params = Commonjs.getParams(fn,service);//获取参数
	$.ajax({
		datatype:"json",
        type:"POST",
        url: weburl,
        data:params,
		cache : false,
		success: function(data){
			var data=jQuery.parseJSON(data);
			if(data.result == "success"){
				$("#cartCount").text("0");
				$("#cartCount").text(data.data.count);
			}
		}
	});
}

function unicplogin(){
	var service = {};
	var fn="unicplogin";
	service = Commonjs.jsonToString(service)
	var params = Commonjs.getParams(fn,service);//获取参数
	$.ajax({
		datatype:"json",
        type:"POST",
        url: weburl,
        data:params,
		cache : false,
		success: function(data){
			var data=jQuery.parseJSON(data);
			if(data.result=="success"){
				var url=data.msg;
				window.open(url);
			}else{
				Commonjs.alert(data.msg);
			}
		},
		error: function () {
			alertNew('服务器忙，请稍候再试！');
    	}
	});
}

function icplogin(){
	var service = {};
	var fn="icplogin";
	service = Commonjs.jsonToString(service)
	var params = Commonjs.getParams(fn,service);//获取参数
	$.ajax({
		datatype:"json",
        type:"POST",
        url: weburl,
        data:params,
		cache : false,
		success: function(data){
			var data=jQuery.parseJSON(data);
			if(data.result=="success"){
				var url=data.msg;
				window.open(url);
			}else{
				Commonjs.alert(data.msg);
			}
		},
		error: function () {
			alertNew('服务器忙，请稍候再试！');
    	}
	});
}
$(function(){
	var windowWidth = window.screen.width;
  if(windowWidth < 768){
   $("html").css("width","122%");
  }
   });