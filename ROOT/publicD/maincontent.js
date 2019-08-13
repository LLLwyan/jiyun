$(function(){
var maincontent  = " <!-- 左边菜单 -->";
maincontent  +="					<div class='leftmenutitle'>会员中心</div>";
maincontent  +="			<div class='leftmenu_main' id='leftmenu_main'>";
maincontent  +="				<div class='leftmenulist '>";
maincontent  +="					<h1>";
maincontent  +="					<i class='fa fa-user fa-lg lmenu-ywgl'></i>用户管理<i class='expand-icon '></i>";
maincontent  +="					</h1>";
maincontent  +="					<ul id='leftmenulist1'>";
maincontent  +="						<li>";
maincontent  +="						<a class='Z_menuItem' href='manager/manager.html'>会员中心</a>";
maincontent  +="						</li>";
maincontent  +="						<li>";
maincontent  +="						<a class='Z_menuItem' href='personal/personal.html'>个人信息</a>";
maincontent  +="						</li>";
maincontent  +="						<li>";
maincontent  +="						<a class='Z_menuItem' href='personal/certify.html'>实名认证</a>";
maincontent  +="						</li>";
maincontent  +="						<li>";
maincontent  +="						<a class='Z_menuItem' href='personal/userpasswd.html'>密码修改</a>";
maincontent  +="						</li>";
maincontent  +="					</ul>";
maincontent  +="				</div>";
maincontent  +="				<div class='leftmenulist '>";
maincontent  +="					<h1>";
maincontent  +="					<i class='fa fa-bar-chart fa-lg lmenu-ymjy'></i>业务管理<i class='expand-icon '></i>";
maincontent  +="					</h1>";
maincontent  +="					<ul id='leftmenulist2'>";
maincontent  +="						<li>";
maincontent  +="						<a class='Z_menuItem' href='business/domain/domain.html'>我的域名</a>";
maincontent  +="						</li>";
maincontent  +="						<li>";
maincontent  +="						<a class='Z_menuItem' href='business/domain/template.html'>域名模版</a>";
maincontent  +="						</li>";
maincontent  +="						<li><a class='Z_menuItem' href='business/cloud/server.html'>我的服务器</a></li>";
maincontent  +="						<li><a class='Z_menuItem' href='business/vhost/index.html'>虚拟主机</a></li>";
maincontent  +="						<li><a class='Z_menuItem' href='business/diy/index.html'>其他服务</a></li>";
maincontent  +="						<li><a class='Z_menuItem' href='business/transfer/index.html'>业务转让</a></li>";
maincontent  +="					</ul>";
maincontent  +="				</div>";
maincontent  +="				<div class='leftmenulist '>";
maincontent  +="					<h1>";
maincontent  +="					<i class='fa fa-money fa-lg lmenu-cwgl'></i>财务管理<i class='expand-icon '></i>";
maincontent  +="					</h1>";
maincontent  +="					<ul id='leftmenulist3'>";
maincontent  +="						<li>";
maincontent  +="						<a class='Z_menuItem' href='finance/consume.html'>消费列表</a>";
maincontent  +="						</li>";
maincontent  +="						<li>";
maincontent  +="						<a class='Z_menuItem' href='finance/financelist.html'>入款列表</a>";
maincontent  +="						</li>";
maincontent  +="						<li>";
maincontent  +="						<a class='Z_menuItem' href='finance/queryaccount.html'>流水查询</a>";
maincontent  +="						</li>";
maincontent  +="						<li>";
maincontent  +="						<a class='Z_menuItem' href='finance/recharge.html'>充值</a>";
maincontent  +="						</li>";
maincontent  +="					</ul>";
maincontent  +="				</div>";
maincontent  +="				<div class='leftmenulist '>";
maincontent  +="					<h1>";
maincontent  +="					<i class='fa fa-indent fa-lg lmenu-zhgl'></i>订单管理<i class='expand-icon '></i>";
maincontent  +="					</h1>";
maincontent  +="					<ul id='leftmenulist4'>";
maincontent  +="						<li>";
maincontent  +="						<a class='Z_menuItem' href='order/orderlist.html'>订单列表</a>";
maincontent  +="						</li>";
maincontent  +="					</ul>";
maincontent  +="				</div>";
maincontent  +="				<div class='leftmenulist '>";
maincontent  +="					<h1>";
maincontent  +="					<i class='fa fa-file-text-o fa-lg lmenu-zhgl'></i>工单管理<i class='expand-icon '></i>";
maincontent  +="					</h1>";
maincontent  +="					<ul id='leftmenulist6'>";
maincontent  +="						<li>";
maincontent  +="						<a class='Z_menuItem' href='issue/processing.html'>我的工单</a>";
maincontent  +="						</li>";
maincontent  +="						<li>";
maincontent  +="						<a class='Z_menuItem' href='issue/submit.html'>提交工单</a>";
maincontent  +="						</li>";
maincontent  +="					</ul>";
maincontent  +="				</div>";
maincontent  +="				<div class='leftmenulist '>";
maincontent  +="					<h1>";
maincontent  +="					<i class='fa fa-sticky-note-o fa-lg lmenu-zhgl'></i>发票管理<i class='expand-icon '></i>";
maincontent  +="					</h1>";
maincontent  +="					<ul id='leftmenulist6'>";
maincontent  +="						<li>";
maincontent  +="						<a class='Z_menuItem' href='invoice/queryinvoice.html'>我的发票</a>";
maincontent  +="						</li>";
maincontent  +="						<li>";
maincontent  +="						<a class='Z_menuItem' href='invoice/apply.html'>申请发票</a>";
maincontent  +="						</li>";
maincontent  +="					</ul>";
maincontent  +="				</div>";
maincontent  +="				<div class='leftmenulist '>";
maincontent  +="					<h1>";
maincontent  +="					<i class='fa fa-align-justify fa-lg lmenu-zhgl'></i><a class='Z_menuItem' href='icp/index.html' >备案管理</a><i class='expand-icon '></i>";
maincontent  +="					</h1>";
maincontent  +="				</div>";
$("#MainContentmenu").append(maincontent);
	var currentLeftMenuList = null;
	$(".leftmenulist h1").click(function () {
		$.cookie("cur", "", { expires: -1 });
		var this_id = $(this).siblings("ul").attr("id");
		$.cookie("cur", this_id,{path:"/"});
		var me = this;
		var _this = $(this);
		if (currentLeftMenuList && currentLeftMenuList != this) {
			$(currentLeftMenuList).siblings("ul").slideToggle(200);
			$(currentLeftMenuList).removeClass('current');
		}
		 _this.siblings("ul").slideToggle(200, function () {
			if (!$(this).is(":hidden")) {
				_this.addClass("current");
				currentLeftMenuList = me;
			} else {
				_this.removeClass("current");
				currentLeftMenuList = null;
			}
		});
	});
	$("#leftmenu_main").find("a").click(function(){
		var index = $("#leftmenu_main").find("a").index(this);
		$.cookie("current", "", { expires: -1 });
		$.cookie("current", index, { path:"/"});
		var num2 = $.cookie("current");
		$("#leftmenu_main").find("a").removeClass("linkcur");
		$("#leftmenu_main").find("a").eq(num2).addClass("linkcur");
		});

	if ($.cookie("cur")!= null){
		var num1=$.cookie("cur");
		$("#"+num1).siblings("h1").addClass('current');
		$("#"+num1).css('display', 'block');
		currentLeftMenuList=$("#"+num1).siblings("h1");
	}

	$('a.Z_menuItem').on('click', function () {
        setIframeHeight($('#mainIframe').get(0));
    })
});

