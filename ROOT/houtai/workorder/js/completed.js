var userName=null;
userName=request("userName");
var id = 0;
id = request("id");
$(function(){
	queryDetails();
	queryContent()
});

//工单头
function queryDetails(){
	var service = {}
	service.userName = userName;
	service.id = id;
	var fn="queryIssueDetails";
	service = Commonjs.jsonToString(service)
	var params = Commonjs.getParams(fn,service);//获取参数
	Commonjs.ajaxTrue(weburl,params,queryDetailsSuccess);
}

function queryDetailsSuccess(data){
	if(data.data == null){
		return false;
	}
	var details = "";
	var state = "";
	var showpic4="";
	var mobileAdmin="";
	$("#realNameMailAuthTbody").html("");
	BaseForeach(data.data,function(i,item){
		details +='<tr><th width="150"  align="right">工单编号：</th>';
		details +='<td align="left">'+item.id+'</td>';
		details +='<th width="150"  align="right">提交时间：</th>';
		details +='<td align="left">'+jsonDateTimeFormat(item.issueTime)+'</td></tr>';
		details +='<tr><th width="150"  align="right">状态：</th>';
		if(item.state==1){
			details +='<td align="left"><span style="color:red">'+item.statusName+'</span></td>';
		}else if(item.state==2){
			details +='<td align="left"><span style="color:red">'+item.statusName+'</span></td>';
		}else if(item.state==3){
			details +='<td align="left">'+item.statusName+'</td>';
		}else if(item.state==4){
			details +='<td align="left"><span style="color:#090">'+item.statusName+'</span></td>';
		}
		details +='<th width="150"  align="right">用户名：</th>';
		details +='<td align="left">'+item.userName+'</td></tr>';
		details +='<tr><th width="150"  align="right">邮箱：</th>';
		details +='<td align="left">'+item.email+'</td>';
		details +='<th width="150" align="right">手机：</th>';
		details +='<td align="left"><span id="mobileStar"><span>'+item.mobile+'</span>' +
			' <a href="javascript:void(0);"> 查看</a></span>' +
			'<span id="mobileNormal" style="display: none"><span></span> <a href="javascript:void(0)"> 隐藏</a></span>' +
			'</td></tr>';
		details +='<tr><th width="150"  align="right">工单类型：</th>';
        mobileAdmin = cloudEncrypt.decodeSession(item.mobileAdmin);

		var temp='';
		var url='';
		if(item.identName!="" && item.identName!=null){
			if(item.issueCode=="cloud"){
				temp='<span style="color:green;margin-left:10px;">(服务器IP：'+item.identName+')</span>';
				url='/houtai/cloud/serverdetail.html?iId='+item.identId;
				temp+='<input type="button" value="查看详情" class="btn btn-primary" onclick="window.location.href=\''+url+'\'">';
			}
			else if(item.issueCode=="domain"){
				temp='<span style="color:green;margin-left:10px;">(域名名称：'+item.identName+')</span>';
				url='/houtai/business/domainDetails.html?domainName='+item.identName;
				temp+='<input type="button" value="查看详情" class="btn btn-primary" onclick="window.location.href=\''+url+'\'">';
			}
		}

		details +='<td align="left" colspan="3">'+item.issueName+temp+'</td></tr>';
		details +='<tr><th width="150"  align="right">工单标题：</th>';
		details +='<td align="left" colspan="3">'+item.businessName+'</td></tr>';
		details +='<tr><th width="200"  align="right">工单描述：</th>';
		details +='<td align="left" colspan="3">'+item.issueDesc+'</td></tr>';
		details +='<tr><th width="200"  align="right">机密信息：</th>';
		details +='<td align="left" colspan="3">'+item.secretInfo+'</td></tr>';
		if(item.attachmentUrl !=""){
			var index = item.attachmentUrl.lastIndexOf('.');
			var type = item.attachmentUrl.substring(index+1,item.attachmentUrl.length);
			if(type.toLowerCase() == 'jpg' || type.toLowerCase() == 'gif'|| type.toLowerCase() == 'png'||type.toLowerCase() == 'jpeg'||type.toLowerCase() == 'bmp'){
				details+='<tr><th width="150" align="right">图文详情:</th><td align="left" colspan="3"><a href="#mengban_'+i+'"><img id="SmallImglogo_'+i+'"  src="'+item.attachmentUrl+'" width="50" height="50" onclick="showDiv('+i+')" style="display:block; cursor:pointer" /></a></td></tr>';
				showpic4='<div id="mengban_'+i+'" class="mengban4" style="display: none;"></div> <div id="tupian_'+i+'" class="tupian4" style="display: none;"><a href="#" onclick="closeDiv('+i+')" style="cursor:pointer;text-decoration: none;"><img src="'+item.attachmentUrl+'" id="ii_'+i+'" /></a></div>';
			}else{
				index =  item.attachmentUrl.lastIndexOf('/');
				type = item.attachmentUrl.substring(index+1,item.attachmentUrl.length);
				details+='<tr><th width="150" align="right">文件下载:</th><td align="left" colspan="3"><a class="btn btn-primary" href="'+item.attachmentUrl+'" >下载</a></td></tr>';
			}
		}
	});
	if(state==3){
		$("#replyhide").hide();
	}
	$("#realNameMailAuthTbody").append(details);
	$('body').append(showpic4);

    $('#mobileStar').find('a').on('click', function () {
        $('#mobileStar').css('display', 'none');
        $('#mobileNormal').find('span').html(mobileAdmin);
        $('#mobileNormal').css('display', '');
    });
    $('#mobileNormal').find('a').on('click', function () {
        $('#mobileStar').css('display', '');
        $('#mobileNormal').css('display', 'none');
    });
}

var flag=0;
function showDiv(index) {
	document.getElementById('mengban_'+index).style.display = 'block';
	document.getElementById('tupian_'+index).style.display = 'block';
	var ii=document.getElementById('ii_'+index);
	var tp=document.getElementById('tupian_'+index);
	var iw=ii.width;
	var ih=ii.height;
	var clW=document.documentElement.clientWidth;
	var clH=document.documentElement.clientHeight;

	if((iw>clW||ih>clH)&&flag==0){
		if(iw>=clW&&ih<clH){
			ii.width=clW*0.7;
			ii.height=(clW*0.7)/iw*ih;
		}else if(ih>=clH&&iw<clW){
			ii.width=(clH*0.7)/ih*iw;
			ii.height=clH*0.7;
		}else{
			ii.width=clW*0.85;
			ii.height=clH*0.85;
		}
		var nowW=ii.width;
		var nowH=ii.height;
		tp.style.left=(clW-nowW)/2+'px';
		tp.style.top=(clH-nowH)/2+'px';
		flag=1;
	}else{
		tp.style.left=(clW-iw)/2+'px';
		tp.style.top=(clH-ih)/2+'px';
	}
}

function closeDiv(index) {
	document.getElementById('mengban_'+index).style.display = 'none';
	document.getElementById('tupian_'+index).style.display = 'none';
}

//查询内容
function queryContent(){
	var service = {}
	service.page = 	$("#pagenumber").val();
	service.pagesize = 5;
	service.userName = userName;
	service.id = id;
	var fn="queryContent";
	service = Commonjs.jsonToString(service)
	var params = Commonjs.getParams(fn,service);//获取参数
	Commonjs.ajaxTrue(weburl,params,queryContentSuccess);
}

function queryContentSuccess(data){
	if(data.data == null){
		return false;
	}
	if(data.data.list!=null){
		var content = "";
		var showpic3="";
		$("#queryContent").html("");
		var list=data.data.list;
		BaseForeach(list,function(i,item){
			i+=1;
			content+='<div style="padding:18px;border-top:1px dashed #bcbcbc;">';
			if(item.replyer == ""){
				content+='<div><b style="font-size:14px;">用户:</b>'+item.userName+'</div>';
				content+='<div style="margin-top:10px;">回复内容：'+item.issueDesc+'</div>';
			}else if(item.replyer != ""){
				content+='<div style="margin-top:10px;"><b style="font-size:14px;color: red">售后客服:</b>'+item.replyer+'</div>';
				content+='<div style="margin-top:10px;">回复内容：'+item.issueDesc+'</div>';
			}

			if(item.attachmentUrl !=""){
				var index = item.attachmentUrl.lastIndexOf('.');
				var type = item.attachmentUrl.substring(index+1,item.attachmentUrl.length);
				if(type.toLowerCase() == 'jpg' || type.toLowerCase() == 'gif'|| type.toLowerCase() == 'png'||type.toLowerCase() == 'jpeg'||type.toLowerCase() == 'bmp'){
					content+='<div style="margin-top:10px;"><a href="#mengban_'+i+'"><img id="SmallImglogo_'+i+'"  src="'+item.attachmentUrl+'" style="height:120px;width:120px; cursor:pointer" onclick="showDiv('+i+')"   /></a></div>';
					showpic3+='<div id="mengban_'+i+'" class="mengban3" style="display: none;"></div> <div id="tupian_'+i+'" class="tupian3" style="display: none;"><a href="#" onclick="closeDiv('+i+')" style="cursor:pointer;text-decoration: none;"><img src="'+item.attachmentUrl+'" id="ii_'+i+'" /></a></div>';
				}else{
					index =  item.attachmentUrl.lastIndexOf('/');
					type = item.attachmentUrl.substring(index+1,item.attachmentUrl.length);
					content+='<div style="margin-top:10px;">文件下载：<a class="btn btn-primary" href="'+item.attachmentUrl+'" >下载</a></div>';
				}
			}
			content+='<div style="color: #999;margin-top:10px;/*padding-left: 20px;*/">时间：'+jsonDateTimeFormat(item.issueTime)+'</div>';
			content+='</div>';
		});

		if(data.rows!=undefined){
			if(data.rows!=0){
				$("#totalcount").val(data.rows);
			}else{
				if(data.page==0)$("#totalcount").val(0);
			}
		}else{
			$("#totalcount").val(0);
		}
		Page($("#totalcount").val(),data.pagesize,'pager');
	}else{
		$("#queryContent").removeAttr("style");
		$("#page").hide();
	}
	$("#queryContent").append(content);
	$('body').append(showpic3);
}


//回复保存
function replyIssue(){
	if($("#issueDesc").val()==""){
		$.tooltip("请输入描述内容",2000,true);
		return;
	}
	var content=$("#issueDesc").val().replace (/[\r\n]/g, '<br>');
	var content=content.replace(new RegExp('(["\"])', 'g'),"\\\"");

	var attachmentUrl = $('#u_attachmentUrl').val();
	var service = {};
	service.id = id;
	service.userName = userName;
	service.issueDesc = encodeURIComponent(content);
	if($("#filesrc").text() != ""){
		service.attachmentUrl = $("#filesrc").text();
	}else{
		service.attachmentUrl = "";
	}
	var fn="replyIssue";
	service = Commonjs.jsonToString(service)
	var params = Commonjs.getParams(fn,service);//获取参数
	Commonjs.ajaxTrue(weburl,params,replyIssueSuccess,true,"正在回复...");
}

function replyIssueSuccess(data){
	$("#issueDesc").val("");
	$.tooltip(data.msg,2000,true);
	queryDetails();
	queryContent();
}

//文件上传
function upload(id,image) {
	var filename = $("#"+id).val();
	var index = filename.lastIndexOf('.');
	var type = filename.substring(index+1,filename.length);
	if(type.toLowerCase() != 'jpg' && type.toLowerCase() != 'gif'
		&& type.toLowerCase() != 'png'&&type.toLowerCase() != 'jpeg' &&type.toLowerCase() != 'zip'&&type.toLowerCase() != 'rar'&&type.toLowerCase() != 'bmp'){
		$.tooltip('注意喔：文件格式必须为.jpeg|.gif|.jpg|.png|.zip|.rar|.bmp',2000,false);
		return ;
	}
	var arrID = [ id ];
	$.yihuUpload.ajaxFileUpload( {
		url : realPath+'/upload.do',  	// 用于文件上传的服务器端请求地址
		secureuri : false,				// 一般设置为false
		type:"POST",
		fileElementId : arrID,			// 文件上传空间的id属性 <input type="file" id="file" name="file" />
		dataType : 'json',				// 返回值类型 一般设置为json
		success : function(data, status) {
			var uri = data.url;
			uri=uri.replace('fullsize','small');
			var name = data.NewFileName;
			var fname = data.FileName;
			var size = data.Size;
			var old = $("#" + id + "_f");
			$("#filesrc").text(uri);
			$("#fileup").text(filename);
			$("#filediv").show()
		},
		error : function(data, status, e) {
			$.tooltip('图片上传失败：建议您选择不超过1M的图片且在良好的网络环境下继续上传',2000,false);
		}
	});
}

//删除上传的文件
function delloadwork(){
	var service = {};
	var file = $("#filesrc").text();
	service.file = file;
	var fn="delloadwork";
	service = Commonjs.jsonToString(service)
	var params = Commonjs.getParams(fn,service);//获取参数
	Commonjs.ajaxTrue(weburl,params,delloadworkSuccess,false);
}

function delloadworkSuccess(data){
	$.tooltip('操作成功',2000,true);
	$("#filesrc").text("");
	$("#filediv").hide();
}

//分页
function Page(totalcounts,pagecount,pager) {
  	$("#"+pager).pager( {
  		totalcounts : totalcounts,
  		pagesize : 10,
  		pagenumber : $("#pagenumber").val(),
  		pagecount : parseInt(totalcounts/pagecount)+(totalcounts%pagecount >0?1:0),
  		buttonClickCallback : function(al) {
  			$("#pagenumber").val(al);
  			queryContent();
  		}
  	});
}
