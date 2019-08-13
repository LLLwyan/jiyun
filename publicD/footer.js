$(function(){
	getBottomHtml(); 
});

function getBottomHtml(){
	var footer;
	if(document.getElementById('footer')) document.getElementById('footer').innerHTML ='';
	footer="";
footer+='	<footer>';
footer+='  	<div class="service-footer container">';
footer+='  		<div class="row">';
footer+='  			<div class="col-md-3 col-sm-3">';
footer+='  				<img src="/img/service-footer1.png" alt="服务"/>';
footer+='  				<div class="service-footer-info">';
footer+='  					<p class="service-footer-title">服务</p>';
footer+='  					<p class="service-footer-contant">7*24小时服务支持</p>';
footer+='  				</div>';
footer+='  			</div>';
footer+='  			<div class="col-md-3 col-sm-3">';
footer+=' 				<img src="/img/service-footer2.png" alt="备案"/>';
footer+=' 				<div class="service-footer-info">';
footer+='  					<p class="service-footer-title">备案</p>';
footer+='  					<p class="service-footer-contant">0元快速备案</p>';
footer+='  				</div>';
footer+='  			</div>';
footer+=' 			<div class="col-md-3 col-sm-3">';
footer+='  				<img src="/img/service-footer3.png" alt="保障"/>';
footer+=' 				<div class="service-footer-info">';
footer+='  					<p class="service-footer-title">保障</p>';
footer+='  					<p class="service-footer-contant">100倍故障赔偿</p>';
footer+='  				</div>';
footer+='  			</div>';
footer+='  			<div class="col-md-3 col-sm-3">';
footer+=' 				<img src="/img/service-footer4.png" alt="退款"/>';
footer+='  				<div class="service-footer-info">';
footer+='  					<p class="service-footer-title">退款</p>';
footer+='  					<p class="service-footer-contant">5天无理由退款</p>';
footer+='  				</div>'; 				
footer+='  			</div>';
footer+='  		</div>';
footer+='  	</div>';
footer+='  	<div class="container-fluid pt-50 footer-intr">';
footer+='  		<div class="container">';
footer+='  			<div class="row">';
footer+='  				<div class="footer-info-link">';
footer+='  					<p class="footer-title">热门产品</p>';
footer+='  					<a class="footer-link" href="/domain/index.html">域名注册</a>';
footer+='  					<a class="footer-link" href="/cloud/thrid-two.html">云服务器</a>';
footer+='  					<a class="footer-link" href="/idc/wjzy.html">服务器租用</a>';
footer+='  					<a class="footer-link" href="/idc/HK.html">香港服务器</a>';
footer+='  					<a class="footer-link" href="/idc/USA.html">美国服务器</a>';
footer+='  				</div>';
footer+='  				<div class="footer-info-link">';
footer+='  					<p class="footer-title">帮助中心</p>';
footer+='  					<a class="footer-link" href="/support/domainHelp.html">域名备案</a>';
footer+='  					<a class="footer-link" href="/support/cloudHelp.html">云服务</a>';
footer+='  					<a class="footer-link" href="/support/IDCHelp.html">IDC服务</a>';
footer+='  					<a class="footer-link" href="/support/kfHelp.html">应用开发</a>';
footer+='  				</div>';
footer+='  				<div class="footer-info-link">';
footer+='  					<p class="footer-title">产品与支持</p>';
footer+='  					<a class="footer-link" href="/about/about.html?content=beian">备案流程</a>';
footer+='  					<a class="footer-link" href="/about/about.html?content=shengqing">测试机申请</a>';
footer+='  				</div>';
footer+='  				<div class="footer-info-link">';
footer+='  					<p class="footer-title">关于极云</p>';
footer+='  					<a class="footer-link" href="/about/index.html">关于我们</a>';
footer+='  					<a class="footer-link" href="/about/connect.html">联系方式</a>';
footer+='  					<a class="footer-link" href="/about/about.html?content=corporateculture">企业文化</a>';
footer+='  					<a class="footer-link" href="/about/about.html?content=zhizi">公司资质</a>';
footer+='  				</div>';
footer+='  				<div class="col-md-2 col-sm-2">';
footer+='  					<div class="footer-wx">';
footer+='					<img src="/img/footer-wx.png" alt="极云天下公众号">';
footer+='					<p>关注微信公众号</p>';
footer+='  				    </div>';
footer+='  			    </div>';
footer+='  				<div class="col-md-4 col-sm-4">';
footer+='  					<div class="mc-list-items1"> ';
footer+='	  	          <p></p> ';
footer+='		  	          <p style="font-size:24px">028-65773958</p> ';
footer+='		              <div> ';
footer+='		  	         <a class="footer-sale1" data-title="电话：18584883263" target="_blank" href="http://wpa.qq.com/msgrd?v=3&uin=167730759&site=qq&menu=yes" rel="nofollow">售前咨询</a>';
footer+='		  	         <a class="footer-sale2" data-title="电话：18512828895" target="_blank" href="http://wpa.qq.com/msgrd?v=3&uin=766686207&site=qq&menu=yes" rel="nofollow">售后服务</a>';
footer+='		              </div> ';
footer+='		  	          <p style="margin-top:10px">地址：中国（四川）自由贸易试验区成都高新区天府四街199号2栋11楼1110室</p> ';
footer+='		  	          </div> ';
footer+='  				</div>';
footer+='  			<div class="footer-line"><img style="width: 100%;height: 1px;" src="/img/footer-line.png" alt=""></div>';

footer+='  			<div class="beian-info pb-10">';
footer+='   				<p>版权所有 © 成都极云天下科技有限公司 保留一切权利  <a href="http://www.beian.miit.gov.cn" rel="nofollow">蜀ICP备17027862号-1</a></p>';
footer+='  				<p>《中华人民共和国增值电信业务经营许可证》经营许可证编号 川B1-20170453</p>';
footer+='   			</div>';
footer+='  		</div>';
footer+='  	</div>';
footer+='  </footer>';
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