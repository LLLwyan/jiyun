// JavaScript Document
//查询系统接口参数
$(function(){
	getDicParamApi();
});

function getDicParamApi(){
	var service = {};
	var fn="getDicParamApi";
	service = Commonjs.jsonToString(service);
	var params = Commonjs.getParams(fn,service);//获取参数
	Commonjs.ajaxTrue(sysurl,params,getApiSuccess);
};

function getApiSuccess(data){
	if(data.data == null){
		return false;
	}
    if (data.data.length>0){
		$.each(data.data, function (index, item) {
            if (""!=item.paramValue) {
                data.data[index].paramValue = cloudEncrypt.decodeSession(item.paramValue);
            }
        })
    }
	$("#userlist:text").empty();
	var userlist="";
	if (data.data.length>0){
		//获取所有input
		$("input:text").each(function(){
			//将input中获取的id赋值
			var paramName = $(this).attr("id");
			//循环json
			BaseForeach(data.data,function(i,item){
				if(item.paramName == "alipayac_way"){
					if(item.paramValue == 2){
					$("#alipayac_way").val(2);
					$("#alipayachide").hide();
					}
				}
				if(item.paramName == "ifOpenSms"){
					if(item.paramValue == 2){
						$("#ifOpenSms").val(2);
					}
				}
				if(item.paramName == "IRCSIsStart"){
					if(item.paramValue == 2){
						$("#IRCSIsStart").val(2);
					}
				}

                if(item.paramName == "ifOpenWinMyDns"){
                    if(item.paramValue == "2"){
                        $("#ifOpenWinMyDns").val(2);
                        $("#WinMyDnsUrlID").hide();
                    }
                }
				//如果input的id跟json中的name活相等
				if(paramName == item.paramName){
					//赋值
					$("#"+paramName).val(item.paramValue);
			}
		});
	});

        //获取所有select
        $("select").each(function(){
            //将input中获取的id赋值
            var paramName = $(this).attr("id");
            //循环json
            BaseForeach(data.data,function(i,item){
                //如果input的id跟json中的name活相等
                if(paramName == item.paramName){
                    //赋值
                    $("#"+paramName).val(item.paramValue);
                }
            });
        });

		$("input:password").each(function(){
			//将input中获取的id赋值
			var paramName = $(this).attr("id");
			//循环json
			BaseForeach(data.data,function(i,item){
				if(item.paramName == "alipayac_way"){
					if(item.paramValue == 2){
					$("#alipayac_way").val(2);
					$("#alipayachide").hide();
					}
				}
				if(item.paramName == "ifOpenSms"){
					if(item.paramValue == 2){
						$("#ifOpenSms").val(2);
					}
				}
				if(item.paramName == "IRCSIsStart"){
					if(item.paramValue == 2){
						$("#IRCSIsStart").val(2);
					}
				}

				//如果input的id跟json中的name活相等
				if(paramName == item.paramName){
					//赋值
					$("#"+paramName).val(item.paramValue);
			}
		});
	});
	}else{
	userlist+=' <tr><td colspan="10" style="height:50px;text-align:center;line-height:50px;">找不到相关信息</td></tr>';
	}
	$('#userlist').append(userlist);
}

//保存参数参数
function uptDicParamApi(){
	var str1="";
	var request = [];
	$("input:text").each(function(index, element) {
		var val = $(this).val();
		if (val && ''!=val) {
			val = cloudEncrypt.encodeSession(val);
        }
		str1+='{"paramName":"'+$(this).attr("id")+'","paramValue":"'+val+'"},';
        var item = {
            paramName: $(this).attr("id"),
            paramValue: val
        };
		request.push(item);
    });
	$("select").each(function(index, element) {
        var val = $(this).val();
        if (val && ''!=val) {
            val = cloudEncrypt.encodeSession(val);
        }
		str1+='{"paramName":"'+$(this).attr("id")+'","paramValue":"'+val+'"},';
        var item = {
            paramName: $(this).attr("id"),
            paramValue: val
        };
        request.push(item);
	});
	$("input:password").each(function(index, element) {
        var val = $(this).val();
        if (val && ''!=val) {
            val = cloudEncrypt.encodeSession(val);
        }
		str1+='{"paramName":"'+$(this).attr("id")+'","paramValue":"'+val+'"},';
        var item = {
            paramName: $(this).attr("id"),
            paramValue: val
        };
        request.push(item);
	});
	var fn="uptDicParamApi";
	str1 = str1.substr(0,str1.length-1);//除去最后一个“，”
	var service = Commonjs.jsonToString(request);
	//var params = Commonjs.getParams(fn,"["+str1+"]");//获取参数
    var params = Commonjs.getParams(fn, service);
	Commonjs.ajaxTrue(sysurl,params,uptApiSuccess);
};

function uptApiSuccess(data){
	topSuccess(window, data.msg);
	getDicParamApi();
}

function onclickselect(){
    if($("#alipayac_way").val() == 2){
        $("#alipayachide").hide();
    }else{
        $("#alipayachide").show();
    }
}

function WinMyDnsShow(){
	if($("#ifOpenWinMyDns").val() == 1){
		$("#WinMyDnsUrlID").show();
	}else{
		$("#WinMyDnsUrlID").hide();
	}
}
