// JavaScript Document
//查询系统参数
$(function(){
	getDicParam();
});

function getDicParam(){
	var service = {};
	var fn="getDicParam";
	service = Commonjs.jsonToString(service)
	var params = Commonjs.getParams(fn,service);//获取参数template
	Commonjs.ajaxTrue(sysurl,params,getDicParamSuccess);
};

function getDicParamSuccess(data){
	if(data.data == null)
		return false;

	var html='';
	if (data.data.querySysVipgrade.length>0){
		BaseForeach(data.data.querySysVipgrade,function(i,item){
			html+='<option value='+item.levelCode+'>'+item.levelName+'</option>';
		});
		$("#userLevel").html(html);
	}
	if(data.data.dicParamItemListTemplate.length>0){
		html='';
		BaseForeach(data.data.dicParamItemListTemplate,function(i,item){
			html+='<option value="'+ item.value +'">'+item.description+'</option>';
		});
		$("#template").html(html);
	}
	getDicVipgrade();

	//从后端获取json
	if (data.data.dicParamList.length>0){
		//获取所有input
		$("input:text").each(function(){
			//将input中获取的id赋值
			var paramName = $(this).attr("id");
			//循环json
			BaseForeach(data.data.dicParamList,function(i,item){
				//如果input的id跟json中的name活相等
				if(paramName == item.paramName){
					//赋值
					$("#"+paramName).val(item.paramValue)
				}
				//公司图标赋值
				if(item.paramName == "weblogo"){
					$("#SmallImgV").attr('src',item.paramValue);
				}
				//微信图标赋值
				if(item.paramName == "wechatlogo"){
					$("#SmallImglogo").attr('src',item.paramValue);
				}
				//日志下拉框赋值
				if(item.paramName == "logOpen"){
					$("#logOpen").val(item.paramValue);
				}
				//公司介绍
				if(item.paramName == "introduce"){
					$("#introduce").val(item.paramValue);
				}
				//到期自动关闭云主机
				if(item.paramName == "autoCloseCloud"){
					if(item.paramValue == 2){
						$("#autoCloseCloud").val(2);
					}
				}
				if (item.paramName == "delBackCloud") {
					if (item.paramValue == 'Y') {
						$('#delBackCloud').val("Y");
					}
				}
				//新会员级别
				if(item.paramName=="userLevel"){
					$("#userLevel").val(item.paramValue);
				}
				//网站默认模板
				if(item.paramName=="template"){
					$("#template").val(item.paramValue);
				}
				//显示默认价格级别
				if(item.paramName=="showPriceLevel"){
					$("#showPriceLevel").val(item.paramValue);
				}
			});
		});

        $("select").each(function(i, object){
            var selectId = $(object).attr("id");
            BaseForeach(data.data.dicParamList,function(i,item){
                if(selectId == item.paramName){
                    var value = item.paramValue;
                    $(object).val(value);
                }
            });
        });
	}

	/*if(data.data.dicParamList.length>0){
		$("select").each(function(){
			var selectId = $(this).attr("id");
			BaseForeach(data.data.dicParamList,function(i,item){
				if(selectId == item.paramName){
					var value = item.paramValue;
					BaseForeach(data.data.dicParamItemList,function(i,item){
						if(value == item.value)
							$("#"+selectId).val(value);
					});
				}
			});
		});
	}*/
}

//设置系统参数
function uptDicParam(){
	var str1="";
	$("input:text").each(function(index, element) {
		str1+='{"paramName":"'+$(this).attr("id")+'","paramValue":"'+$(this).val()+'","paramType":"1"},';
    });
	$("select").each(function(index, element){
		str1+='{"paramName":"'+$(this).attr("id")+'","paramValue":"'+$(this).val()+'","paramType":"1"},';
	});
	$("textarea").each(function(index, element){
		str1+='{"paramName":"'+$(this).attr("id")+'","paramValue":"'+$(this).val()+'","paramType":"1"},';
	});
	if($("#SmallImgV").attr("src") != "../img/show.jpg"){
		str1+='{"paramName":"weblogo","paramValue":"'+$("#SmallImgV").attr("src")+'","paramType":"1"},';
	}
	if($("#SmallImglogo").attr("src") != "../img/show.jpg"){
		str1+='{"paramName":"wechatlogo","paramValue":"'+$("#SmallImglogo").attr("src")+'","paramType":"1"},';
	}
		var fn="uptDicParam";
		str1 = str1.substr(0,str1.length-1);//除去最后一个“，”
		var params = Commonjs.getParams(fn,"["+str1+"]");//获取参数
		Commonjs.ajaxTrue(sysurl,params,uptDicParamSuccess,false);
}

function uptDicParamSuccess(data){
	topSuccess(window, data.msg);
	window.location.reload();
}

function upload(id,image) {
	var filename = $("#"+id).val();
	var index = filename.lastIndexOf('.');
	var type = filename.substring(index+1,filename.length);
	if(type.toLowerCase() != 'jpg' && type.toLowerCase() != 'gif'
		&& type.toLowerCase() != 'png'&&type.toLowerCase() != 'jpeg'){
		topError(window, '注意喔：图片格式必须为.jpeg|.gif|.jpg|.png');
		return ;
	}
	var arrID = [ id ];
	$.yihuUpload.ajaxFileUpload( {
		url : realPath+'/upload.do', // 用于文件上传的服务器端请求地址
		secureuri : false,			 // 一般设置为false
		type:"POST",
		fileElementId : arrID,		 // 文件上传空间的id属性 <input type="file" id="file" name="file" />
		dataType : 'json',			 // 返回值类型 一般设置为json
		upname:'config',
		success : function(data, status) {
			var uri = data.url;
			uri=uri.replace('fullsize','small');
			var name = data.NewFileName;
			var fname = data.FileName;
			var size = data.Size;
			var old = $("#" + id + "_f");
			if (image=='SmallImgV') {
				$("#SmallImgV").attr("src", uri);
				$("#weblogo").val(uri);
			}else if(image=='SmallImglogo'){
				$("#SmallImglogo").attr("src", uri);
				$("#wechatlogo").val(uri);
			}
		},
		error : function(data, status, e) {
			topError(window, '图片上传失败：建议您选择不超过1M的图片且在良好的网络环境下继续上传');
		}
	});
}

function getDicVipgrade(){
	var service = {};
	var fn="queryVipgradeList";
	service = Commonjs.jsonToString(service);
	var params = Commonjs.getParams(fn,service);//获取参数
	var data=Commonjs.ajax(weburl,params,false);
	if(data.result == "success"){
		var html='';
		if (data.data.length>0){
			BaseForeach(data.data,function(i,item){
				html+='<option value="'+item.levelCode+'">'+item.levelName+'</option>';
			});
		}
		$('#showPriceLevel').html(html);
	}
}
