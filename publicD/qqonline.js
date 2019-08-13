

function getQq(){
	var service = {};
	var fn="getDicParam";
	service = Commonjs.jsonToString(service);
	var params = Commonjs.getParams(fn,service);//获取参数
	$.ajax({
		datatype:"json",
        type:"POST",
        url: sysurl,
        data:params,
		cache : false,
		success: function(data){
			var data=jQuery.parseJSON(data);

			if(data.result == "success"){
				var QqHtml="";
				var height = 130;
				if (data.data.dicParamList.length>0){
					for(var tt = 0; tt < data.data.dicParamList.length; tt++) {
                        if (data.data.dicParamList[tt].paramName == "comqq") {
                            var comqqText = data.data.dicParamList[tt].paramValue;
                            var strs = new Array();
                            strs = comqqText.split(",");
                            for (var i = 0; i < strs.length; i++) {
                                var subStrs = new Array();
                                var subQqlist = strs[i];
                                subStrs = subQqlist.split(":");
                                QqHtml += "<li><a target='_blank' style='color:#333;' href='http://wpa.qq.com/msgrd?v=3&uin=" + subStrs[0] + "&site=qq&menu=yes'><img border='0' src='" + realPath + "/images/qqol.gif' style='margin-right:10px;margin-left:10px' alt='点击这里给我发消息' title='点击这里给我发消息'/>" + subStrs[1] + "</a> </li>";
                                if (i >= 3) {
                                    break;
                                }
                            }
                        }
                    }
                    for(var tt = 0; tt < data.data.dicParamList.length; tt++) {
                        if (data.data.dicParamList[tt].paramName == "comtel") {
                            QqHtml += "<li style='border:none;'></li>";
                        }
                    }
                    i++;
				}
			}
			$("#qqinfo").html(QqHtml);
			height = height+38*i;
			$(".rides-cs").css("height", height+"px");
		},
		error: function () {
        	alertNew('服务器忙，请稍候再试！');
    	}
	});
}
$(function(){
	var qqonline="";
qqonline+="	<div id='floatTools' class='rides-cs' style='height:246px;'>";
qqonline+="<div class='floatL'>";
qqonline+="	<a id='aFloatTools_Show' class='btnOpen' title='查看在线客服' style='top:20px;display:block' href='javascript:void(0);'>展开</a>";
qqonline+="	<a id='aFloatTools_Hide' class='btnCtn' title='关闭在线客服' style='top:20px;display:none' href='javascript:void(0);'>收缩</a>";
qqonline+="</div>";
qqonline+="<div id='divFloatToolsView' class='floatR' style='display: none;height:237px;width: 140px;'>";
qqonline+="  <div class='cn'>";
qqonline+="    <h3 class='titZx'>在线客服</h3>";
qqonline+="    <ul id='qqinfo'>";
qqonline+="    </ul>";
qqonline+="  </div>";
qqonline+="</div>";
qqonline+="</div>";

$("html body").append(qqonline);
	getQq();
	$("#aFloatTools_Show").click(function(){
		$('#divFloatToolsView').animate({width:'show',opacity:'show'},100,function(){$('#divFloatToolsView').show();});
		$('#aFloatTools_Show').hide();
		$('#aFloatTools_Hide').show();
	});
	$("#aFloatTools_Hide").click(function(){
		$('#divFloatToolsView').animate({width:'hide', opacity:'hide'},100,function(){$('#divFloatToolsView').hide();});
		$('#aFloatTools_Show').show();
		$('#aFloatTools_Hide').hide();
	});
});
$(document).ready(function(){

	/* ----- 侧边悬浮 ---- */
	$(document).on("mouseenter", ".suspension .a", function(){
		var _this = $(this);
		var s = $(".suspension");
		var isService = _this.hasClass("a-service");
		var isServicePhone = _this.hasClass("a-service-phone");
		var isQrcode = _this.hasClass("a-qrcode");
		var isCart = _this.hasClass('a-cart');
		var isBaidu = _this.hasClass('a-baidu');
		if(isService){ s.find(".d-service").show().siblings(".d").hide();}
		if(isServicePhone){ s.find(".d-cart").show().siblings(".d").hide();}
		if(isQrcode){ s.find(".d-qrcode").show().siblings(".d").hide();}
		if(isCart){s.find('.d-cart').show().siblings('.d').hide();}
		if(isBaidu){s.find('.d-baidu').show().siblings('.d').hide();}
	});
	$(document).on("mouseleave", ".suspension, .suspension .a-top", function(){
		$(".suspension").find(".d").hide();
	});
	$(document).on("mouseenter", ".suspension .a-top", function(){
		$(".suspension").find(".d").hide(); 
	});
	$(document).on("click", ".suspension .a-top", function(){
		$("html,body").animate({scrollTop: 0});
	});
	$(window).scroll(function(){
		var st = $(document).scrollTop();
		var $top = $(".suspension .a-top");
		if(st > 400){
			$top.css({display: 'block'});
		}else{
			if ($top.is(":visible")) {
				$top.hide();
			}
		}
	});
	
	$(".baidu-content").click(function() {
	        	if ($('#nb_invite_ok').length > 0) {  
	                  $('#nb_invite_ok').click();  
	              }
	        });
	
});	
function clickthis(){
	if ($('#nb_invite_ok').length > 0) {  
          $('#nb_invite_ok').click();  
      }
}
//百度商桥
	  var _hmt = _hmt || [];
	 (function() {
	  var hm = document.createElement("script");
	  hm.src = "https://hm.baidu.com/hm.js?064d7ac8242a0eb4a17d8f12ea3ffb54";
	  var s = document.getElementsByTagName("script")[0]; 
	  s.parentNode.insertBefore(hm, s);
	})();