//上传模板证件
var id=null;
templateId=request("id");
var qryIdType = "I";
var userType = "";

$(function(){
	getIdType("I");
	getIdType("O");
    queryTemplate();
})

//查看模板
function queryTemplate(){
    var service = {};
    service.id=templateId;
    service = Commonjs.jsonToString(service)
    var fn="getTemplateInfo";
    var params = Commonjs.getParams(fn,service);//获取参数
    Commonjs.ajaxTrue(weburl,params,queryTemplateSuccess);
}

function queryTemplateSuccess(data){
    if(!isNotNull(data.data))
        return false;
    var template = data.data;
    $("#templateName").val(template.templateName);
    $("#userNameCn").val(template.userNameCn);

    $("#radio1").removeAttr("checked");
    $("#radio2").removeAttr("checked");
    userType = template.userType;
    if(template.userType =="1"){
        $("#radio1").prop("checked",'checked');
        $("#user").css("display", "none");
    }else{
        $("#radio2").prop("checked",'checked');
		qryIdType = "O";
    }

    //数据填充
    if (!Commonjs.isEmpty(template.linkManCertType)){ //联系人证件类型
        //$("#linkManCertType").val(template.linkManCertType);
		$("#linkManCertType option[value='"+template.linkManCertType+"']").attr("selected", true);
    }
    if (!Commonjs.isEmpty(template.linkManCertNum)){//联系人证件号码
        $("#linkManCertNum").val(template.linkManCertNum);
    }
    if (!Commonjs.isEmpty(template.linkManCertPath)){//联系人证件
        $("#linkManCertImgV").attr("src", template.linkManCertPath);
        $("#linkManCertPath").val(template.linkManCertPath);
    }

    //if (userType != "1") {
        if (!Commonjs.isEmpty(template.certType)) { //所有者证件类型
            //$("#userCertType").val(template.certType);
			$("#userCertType option[value='"+template.certType+"']").attr("selected", true);
        }
        if (!Commonjs.isEmpty(template.certNum)) {//所有者证件号码
            $("#userCertNum").val(template.certNum);
        }
        if (!Commonjs.isEmpty(template.certPath)) {//所有者证件
            $("#userCertImgV").attr("src", template.certPath);
            $("#userCertPath").val(template.certPath);
        }
    //}

}

function getIdType(qryIdType) {
    var service = {};
    service.paramId = "idType:" + qryIdType;
    var fn="getListDicParamItem";
    service = Commonjs.jsonToString(service);
    var params = Commonjs.getParams(fn,service);//获取参数
    if(qryIdType == "I"){
        Commonjs.ajaxTrue(sysurl,params,getItemSuccessI);
    }else {
        Commonjs.ajaxTrue(sysurl,params,getItemSuccessO);
    }
}


function getItemSuccessI(data){
    if(data.data == null)
        return false;

    var userlis="";
    BaseForeach(data.data,function(i,item){
        userlis+='<option value="'+item.value+'">' +item.description+ '</option>';
    });
    $("#linkManCertType").html(userlis);
    //if (userType == "1"){
    //    $("#userCertType").append(userlis);
    //}
}

function getItemSuccessO(data){
    if(data.data == null)
        return false;

    var userlis="";
    BaseForeach(data.data,function(i,item){
        userlis+='<option value="'+item.value+'">' +item.description+ '</option>';
    });
    $("#userCertType").append(userlis);
}

//修改数据模板
function uptTemplate(){
    var service = {};
    service.id=templateId;

    service.linkManCertType = $("#linkManCertType").val();
    service.linkManCertNum   = $("#linkManCertNum").val();
    service.linkManCertPath  = $("#linkManCertPath").val();

    if(userType == "1"){
		service.certType = service.linkManCertType;
        service.certNum = service.linkManCertNum;
        service.certPath = service.linkManCertPath;
    } else {		
		service.certType = $("#userCertType").val();
		service.certNum   = $("#userCertNum").val();
		service.certPath  = $("#userCertPath").val();
		
		//表单验证开始
		if(Commonjs.isEmpty(service.linkManCertNum)){
			$.tooltip('联系人证件号码不能为空',2000,false);
			$("#userCertType").focus();
			return false;
		}
		if(Commonjs.isEmpty(service.linkManCertPath)){
			$.tooltip('联系人证件附件不能为空',2000,false);
			//$("#userNameCn").focus();
			return false;
		}
	}
	
    //表单验证开始
    if(Commonjs.isEmpty(service.certNum)){
        $.tooltip('所有者证件号码不能为空',2000,false);
        $("#userCertType").focus();
        return false;
    }
    if(Commonjs.isEmpty(service.certPath)){
        $.tooltip('所有者证件附件不能为空',2000,false);
        //$("#userNameCn").focus();
        return false;
    }

    //表单验证结束
    var fn="uploadcert";
    service = Commonjs.jsonToString(service);
    var params = Commonjs.getParams(fn,service);//获取参数
    Commonjs.ajaxTrue(weburl,params,uptTemplateSuccess,false);
}

function uptTemplateSuccess(data){
    $.tooltip(data.msg,2000,true);
}


function upload(id,image) {
    var filename = $("#"+id).val();
    var index = filename.lastIndexOf('.');
    var type = filename.substring(index+1,filename.length);
    if(type.toLowerCase() != 'jpg'){
        $.tooltip('注意喔：图片格式必须为.jpg',2000,false);
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
            var url = data.url;
            url=url.replace('fullsize','small');
            var name = data.NewFileName;
            var fname = data.FileName;
            var size = data.Size;
            var old = $("#" + id + "_f");
            if (image=='userCertImgV') {
                $("#userCertImgV").attr("src", url);
                $("#userCertPath").val(url);
            }else if(image=='linkManCertImgV'){
                $("#linkManCertImgV").attr("src", url);
                $("#linkManCertPath").val(url);
            }
        },
        error : function(data, status, e) {
            $.tooltip('图片上传失败：建议您选择不超过1M的图片且在良好的网络环境下继续上传',2000,false);
        }
    });
}