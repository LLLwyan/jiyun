$(function(){
	getBottomHtml(); 
});

function getBottomHtml(){
	var footer;
	if(document.getElementById('footer')) document.getElementById('footer').innerHTML ='';
	footer="";
	footer+="<div class='footer' style='background: #f9f9f9;border-top: 1px solid #ccc;'>";
	footer+="<div class='foot' data-speed='25' style='transition: background-position 0.4s linear;'>";
	footer+="<div class='foot-content'>";
	footer+="<div class='container'>";
	footer+="<div class='row'>";
	footer+="<div class='col-md-4'>";
	footer+="<div class='foot-intro'>";
	footer+="<h3 class='foot-header'>"+webname+"介绍</h3>";
	if(introduce==""){
		introduce = "暂无介绍";
	}
	footer+='<p class="foot-text">'+introduce+'</p>'
	footer+="</div>";
	footer+="</div>";
	footer+="<div class='col-md-4'>";
	footer+="<div class='foot-contact'>";
	footer+="<h3 class='foot-header'>联系方式</h3>";
	footer+="<p class='foot-text'>电话咨询："+ tel +"</p>";
	footer+="<p class='foot-text'>邮箱："+ email +"</p>";
	footer+="<p class='foot-text'>传真：" + fax +"</p>";
	footer+="<p class='foot-text'>地址：" + addr +"</p>";
	footer+="</div>";
	footer+="</div>";
		
	footer+="<div class='col-md-4' style='padding-left:100px;'>"
	footer+="<div class='foot-wechat'>";
	footer+="<h3 class='foot-header'>微信公众号</h3>";
	footer+="<p>";
	if(wechatlogo==""){
		wechatlogo = "../images/show.jpg";
	} 
	footer+='<img id="SmallImglogo"  src="'+wechatlogo+'" style="height:100px;width:100px;"  />';
	footer+="</p>";
	footer+="</div>";
	footer+="<div class='foot-logo'>";
	footer+="<div class='foot-logo-1'>&nbsp;</div>";
	footer+="<div class='foot-logo-split'>&nbsp;</div>";
	footer+="<div class='foot-logo-2'>&nbsp;</div>";
	footer+="</div>";
	footer+="</div>";
	footer+="</div>"
	footer+="</div>"
	footer+="<div class='dibu' style='background-color:#dedede;width:100%;'>";
	
	var about = "";
	about+="<p class='friendlink pt-15' style='text-align:center;margin-bottom:-5px;'>";
	about+='<span>&nbsp;·&nbsp;</span><a href="/about/about.html?content=about">关于我们</a>'; 
	about+='<span>&nbsp;·&nbsp;</span><a href="/about/about.html?content=contactnumber">联系方式</a>';
	about+='<span>&nbsp;·&nbsp;</span><a href="/about/about.html?content=corporateculture">企业文化</a>';
	about+='<span>&nbsp;·&nbsp;</span><a href="/support/support.html">帮助中心</a>';
	about+='<span>&nbsp;·&nbsp;</span><a href="/domain/domain.html">域名注册</a>';
	about+="</p>";
	about+="<br />";  
	about+="<p class='grey' style='text-align:center;color:#6d6d6d;'>Copyright©&nbsp;2010-2017&nbsp;" + comname + " 版权所有</p>"; 
	about+="<p class='grey' style='margin:10px;text-align:center;color:#6d6d6d;'>《中华人民共和国增值电信业务经营许可证》经营许可证编号 " + webicp2 + "</p>";
	about+="<p class='grey' style='margin:10px;text-align:center;color:#6d6d6d;'>《中华人民共和国电信与信息服务业务》信息产业部备案号  <a href=\"http://www.miitbeian.gov.cn\" target=\"_blank\">" + webicp + "</a></p>";
	about+="<div style=\"float:right;padding-right:27%;margin-top:-6%\"><a target=\"_blank\"><img src=\""+realPath+"/public/img/license.jpg\"/></a></div>";                    
	about+="</div>"; 
	footer = footer + about; 
	footer+="</div>";
	footer+="     </div>";
	footer+=" </div>";
	footer+="</div>"; 
	if(document.getElementById('footer')){document.getElementById('footer').innerHTML =footer;} 
	if(document.getElementById('loginfooter')){document.getElementById('loginfooter').innerHTML =about;}
	memberfooter="";
	memberfooter+="<div class='memberfoot tc of'>";
	memberfooter+="     <div class='of'>";
	memberfooter+="       <div class='off'>";
	memberfooter+="           <p>Copyright&copy; " + comname + " 版权所有</p>";
	memberfooter+="       </div>";
	memberfooter+="     </div>";
	memberfooter+=" </div>";
	if(document.getElementById('memberfooter')){document.getElementById('memberfooter').innerHTML =memberfooter;}
}