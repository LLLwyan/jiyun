var idCardA = {};
var idCardB = {};
var enterpriseImg = {};

$(function (){
	getAccountDetail();

    //上传
    $('.SmallImg').on('change', function () {
    	var id = $(this).attr('id');
		uploadCommon(id, function (data) {
			if ('cardA' == id) {
				$('#idCardASlow').attr('src', data.url);
				idCardA = data;
            } else if ('cardB' == id) {
				$('#idCardBSlow').attr('src', data.url);
				idCardB = data;
			} else if ('SmallImg' == id) {
				$('#idEnterpriseSlow').attr('src', data.url);
				enterpriseImg = data;
			}
        });
    });

    $('#saveBtn').on('click', function () {
        var certType=$('#u_certType');
        var certCode=$('#u_certCode');
        var fullName= $('#u_fullName');
        var companyName = $('#u_companyName');

        if(Commonjs.isEmpty(certType.val())){
            Commonjs.alert("证件类型不能为空");
            certType.focus();
            return false;
        }
        if(certType.val()==1){
            if(!CndnsValidate.checkChineseInput(fullName.val())){
                Commonjs.alert("真实姓名必须使用中文2-8位");
                fullName.focus();
                return false;
            }
            if(!CndnsValidate.checkIDCard(certCode.val())){
                Commonjs.alert("身份证格式不对");
                certCode.focus();
                return false;
            }
            if (!idCardA.url || !idCardB.url) {
                Commonjs.alert("请完整上传身份证照片");
                return false;
			}
        } else {
            if(''==companyName.val()){
                Commonjs.alert("公司名称不能为空");
                companyName.focus();
                return false;
            }
        	if (!enterpriseImg.url) {
                Commonjs.alert("请上传营业执照");
                return false;
			}
		}
        var service = {};
        service.certCode=cloudEncrypt.encodeSession(certCode.val());
        service.certType=certType.val();
        service.fullName=fullName.val();
        service.companyName=companyName.val();
        service.idCardA = idCardA;
        service.idCardB = idCardB;
        service.enterprise = enterpriseImg;
        service = Commonjs.jsonToString(service)
        var fn='updateUserCert';
        var params = Commonjs.getParams(fn,service);//获取参数
        Commonjs.ajaxTrue(weburl,params,function (data) {
			topSuccess(window, "提交成功");
			location.reload();
        },false);
    });
});

function getAccountDetail(){
	var service = {};
	var fn="getAccountDetail";
	service = Commonjs.jsonToString(service);
	var params = Commonjs.getParams(fn,service);//获取参数
	Commonjs.ajaxTrue(weburl,params,getAccountDetailSuccess);
}

function getAccountDetailSuccess(data){
	if(data.data==null)
		return false;

	$('#uid').html(data.data.userName);
	$('#u_fullName').val(data.data.fullName);
	$('#u_companyName').val(data.data.companyName)
	if (data.data.isCertified < 1) {
        $('#u_certCode').css('display', '');
	} else {
        $('#u_certCode').val(cloudEncrypt.decodeSession(data.data.certCode));
        $('#showCertCode').find('span').html(ProtectionStartUtils.idCard(cloudEncrypt.decodeSession(data.data.certCode)));

        if (data.data.isCertified < 2) {
            $('#showCertCode').find('a').html('修改');
        } else {
            $('#showCertCode').find('a').html('查看');
		}

        $('#showCertCode').find('a').on('click', function () {
            $('#showCertCode').css('display', 'none');
            $('#u_certCode').css('display', '');
        });
    }
	$('#showCertCode').find('span').html(data.data.certCodeStar);
	$('#u_certType').val(data.data.certType);

	if (data.data.isCertified == 3) {
        $('#certified').css('display', '');
	} else {
        $('#certify').css('display', '');
	}

	var statusNameString = "";
	if (data.data.isCertified == 0) {
		statusNameString = "未提交";
	} else if (data.data.isCertified == 1) {
		statusNameString = "已拒绝（" + data.data.certifyDesc + "）";
	} else if (data.data.isCertified == 2) {
		statusNameString = "审核中";
	} else {
		statusNameString = "已通过";
	}
	$('#statusName').html(statusNameString);

	if (data.data.isCertified < 2) {
        $('#u_certType').attr('disabled', false);
        $('#u_certCode').attr('disabled', false);
        $('#saveBtn').attr('disabled', false);
        $('#u_fullName').attr('disabled', false);
        $('#cardA').attr('disabled',false);
        $('#cardB').attr('disabled',false);
        $('#SmallImg').attr('disabled',false);
	} else {
        $('#u_certType').attr('disabled', true);
        $('#u_certCode').attr('disabled', true);
        $('#saveBtn').attr('disabled', true);
        $('#u_fullName').attr('disabled', true);
        $('#cardA').attr('disabled',true);
        $('#cardB').attr('disabled',true);
        $('#SmallImg').attr('disabled',true);
	}
	$('#u_certType').on('change', function () {
		var val = $(this).val();
		if (1===parseInt(val)) {
			$('#personal').css('display', '');
            $('#enterprise').css('display', 'none');
            $('.personalCol').css('display', '');
            $('.enterpriseCol').css('display', 'none');
		} else {
            $('#enterprise').css('display', '');
            $('#personal').css('display', 'none');
            $('.personalCol').css('display', 'none');
            $('.enterpriseCol').css('display', '');
		}
    });
    $('#u_certType').trigger('change');

    if (data.data.certFile && data.data.certFile.length > 0) {
    	if (data.data.certType == 1) {
    		$('#idCardASlow').attr('src', data.data.certFile[0].url);
    		idCardA.url = data.data.certFile[0].url;
            $('#idCardBSlow').attr('src', data.data.certFile[1].url);
            idCardB.url = data.data.certFile[1].url;
		} else {
            $('#idEnterpriseSlow').attr('src', data.data.certFile[0].url);
            enterpriseImg.url = data.data.certFile[0].url;
		}
	}
}
