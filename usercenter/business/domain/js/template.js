//域名模板
$(function(){
	getTemplateListPage();	
	$("#userNameCn").on("keyup keydown change blur",function (){
		$("#userNameEn").val($(this).toPinyin());
	});
	$("#linkManLnCn").on("keyup keydown change blur",function (){
		$("#linkManLnEn").val($(this).toPinyin());
	});
    $("#linkManFnCn").on("keyup keydown change blur",function (){
        $("#linkManFnEn").val($(this).toPinyin());
    });
	// 地区
	$("#countryCn").on("keyup keydown change blur",function (){
		$("#countryEn").html("");
		$("#countryEn").append("<option value='"+$(this).toPinyin()+"'>"+$(this).toPinyin()+"</option>");
	});
	$("#countryEn").append("<option value='"+$("#countryCn").toPinyin()+"'>"+$("#countryCn").toPinyin()+"</option>");
	
	// 省份
	$("#cho_Province").on("keyup keydown change blur",function (){
		$("#cho_ProvinceEN").html("");
		$("#cho_ProvinceEN").append("<option value='"+$(this).toPinyin()+"'>"+$(this).toPinyin()+"</option>");
	});
	$("#cho_ProvinceEN").append("<option value='"+$("#cho_Province").toPinyin()+"'>"+$("#cho_Province").toPinyin()+"</option>");
	// 城市
	$("#cho_City").on("keyup keydown change blur",function (){
		$("#cho_CityEN").html("");
		$("#cho_CityEN").append("<option value='"+$(this).toPinyin()+"'>"+$(this).toPinyin()+"</option>");
	});
	$("#cho_CityEN").append("<option value='"+$("#cho_City").toPinyin()+"'>"+$("#cho_City").toPinyin()+"</option>");
	// 通讯地址
	$("#addrCn").on("keyup keydown change blur",function (){
		$("#addrEn").val($(this).toPinyin());
	});
})

// 查询模板
function getTemplateListPage(){
	var service = {};
	service.page = $("#pagenumber").val();
	service.pageSize = 10;
	service.templateName=$("#templateName1").val();
	service.userNameCn=$("#userNameCn2").val();
	var fn="getTemplateListPage";
	service = Commonjs.jsonToString(service)
	var params = Commonjs.getParams(fn,service);// 获取参数
	Commonjs.ajaxTrue(weburl,params,getTemplatePageSuccess);
}

function getTemplatePageSuccess(data){
	$("#realNameMailAuthTbody").html("");
	var userlis="";
	if (data.rows >0){
		BaseForeach(data.data,function(i,item){
			userlis+='<tr class="gradeX">';
			userlis+='<td>'+(i+1)+'</td>';
			if(item.isDefault ==1){
				userlis+='<td>'+item.templateName+' (默认)</td>';	
				}else{
					userlis+='<td>'+item.templateName+'</td>';	
				}
				var userTypename = "";
				if(item.userType == "1"){
					userTypename = "个人";
				}else if(item.userType == "2"){
					userTypename = "企业";
				}
				userlis+='<td>'+userTypename+'</td>';
				userlis+='<td>'+item.userNameCn+'</td>';
				userlis+='<td>'+item.email+'</td>';
				userlis+='<td>'
				if(item.isDefault ==0){
					userlis+='<a href="javascript:void(0);" class="manager-btn  mr-10" onclick="setDefaultTemplate(\''+item.id+'\',\''+item.isDefault+'\');">设置为默认</a>'
				}else if(item.isDefault ==1){
					userlis+='<a href="javascript:void(0);" class="manager-btn  mr-10" onclick="setDefaultTemplate(\''+item.id+'\',\''+item.isDefault+'\');">取消默认</a>'
				}
				if (Commonjs.isEmpty(item.certPath)){
                    userlis+='<a href="./uploadcert.html?id='+item.id+'" class="manager-btn  mr-10">上传证件</a> '
				} else {
                    userlis+='<a href="./uploadcert.html?id='+item.id+'" class="manager-btn  mr-10">查看证件</a> '
				}

				
				userlis+='<a href="./upttemplate.html?id='+item.id+'" class="manager-btn  mr-10">查看</a> '
				
				//if (Commonjs.isEmpty(item.status)){
					userlis+='<a href="javascript:void(0);" class="manager-btn  mr-10" onclick="delTemplate(\''+item.id+'\');">删除</a>'
				//}
				
				userlis+='</td>'
				userlis+='</tr>'
			});
			$("#realNameMailAuthTbody").append(userlis);		
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
				$("#page").show();
			}else{
				$("#realNameMailAuthTbody").html("");
				var userlis=' <tr><td colspan="10" style="height:50px;text-align:center;line-height:50px;">找不到相关信息</td></tr>';	
				$("#realNameMailAuthTbody").append(userlis);
				$("#page").hide();
			}
}

// 删除默认模板
function delTemplate(id){
	var dialog=	art.dialog({
		lock : true,
		opacity : 0.4,
		width : 250,
		title : '提示',
		content : '您确定删除吗？',
		ok : function() {
				var service = {};
				service.id=id;
				var fn="delTemplate";
				service = Commonjs.jsonToString(service)
				var params = Commonjs.getParams(fn,service);// 获取参数
				Commonjs.ajaxTrue(weburl,params,delTemplateSuccess);
		},
		cancel: function(){
			$('#dialog').hide();
		}
	});
 }

function delTemplateSuccess(data){
	$.tooltip(data.msg,2000,true);
	getTemplateListPage();
}

// 修改默认模板
function setDefaultTemplate(id, isDefault){
 art.dialog({
 		id: 'testID',
 	    width: '245px',
	    height: '109px',
 	    content: '您要设置成默认模板吗？',
 	    lock: true,
 	    button: [{
 	      	name: '确定',
 	       	callback: function () {
				var service = {};
				service.id = id;
				service.isDefault = isDefault;
				var fn="setDefaultTemplate";
				service = Commonjs.jsonToString(service)
				var params = Commonjs.getParams(fn,service);// 获取参数
				Commonjs.ajaxTrue(weburl,params,setTemplateSuccess,false);
 	       	}
 	 	},{
 	 		name: '取消'
 	 	}]
 	});	
}
function setTemplateSuccess(data){
	$.tooltip(data.msg,2000,true);
	getTemplateListPage();
}



// 分页
function Page(totalcounts,pagecount,pager) {
  	$("#"+pager).pager( {
  		totalcounts : totalcounts,
  		pagesize : 10,
  		pagenumber : $("#pagenumber").val(),
  		pagecount : parseInt(totalcounts/pagecount)+(totalcounts%pagecount >0?1:0),
  		buttonClickCallback : function(al) {
  			$("#pagenumber").val(al);
  			getTemplateListPage();
  		}
  	});
  	
}


//提交模板到上级
function submitTemplate(id, regType){
	var service = {};
	service.id = id;
	service.regType = regType;
	service = Commonjs.jsonToString(service);
	var fn = "submitTemplate";
	var params = Commonjs.getParams(fn, service);//获取参数
	Commonjs.ajaxTrue(weburl, params, submitTemplateSuccess);		
}

function submitTemplateSuccess(data){
	$.tooltip(data.msg,2000,true);
	getTemplateListPage();
}


//提交模板到上级
function queryTemplateStatus(id, regType){
	var service = {};
	service.id = id;
	service.regType = regType;
	service = Commonjs.jsonToString(service);
	var fn = "qryTemplateStatus";
	var params = Commonjs.getParams(fn, service);//获取参数
	Commonjs.ajaxTrue(weburl, params, queryTemplateStatusSuccess);		
}

function queryTemplateStatusSuccess(data){
	$.tooltip(data.msg,2000,true);
	getTemplateListPage();
}