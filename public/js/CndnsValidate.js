var CndnsValidate = {
    //检查用户名格式
    //符合邮箱格式并且在4-16位
    checkUserName: function (usrName) {
        if (!this.checkLoginEmail(usrName) && !(/^[a-zA-Z_\d]{4,16}$/.test(usrName))) {
            return false;
        }
        else {
            return true;
        }
    },

    //检查用户身份证号
    checkIDCard: function (value) {
        if (/^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X|x)$/.test(value) || /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$/.test(value)) {
            return true;
        }
        else {
            return false;
        }
    },

    //检查密码格式
    //密码格式：大写字母+小写字母+数字或者字母+数字+符号（符号：！@#^&*等）示例：cndns456@#!
    checkPassWord: function (usrPass) {
        var acountreg = usrPass;
		//var reg=/(?=.*[\d]+)(?=.*[a-zA-Z]+)(?=.*[^a-zA-Z0-9]+).{6,16}/.test(acountreg);
        var reg=/(?=.*[\d]+)(?=.*[a-zA-Z]+)(?=.*[^\u4e00-\u9fa5]+)(?=.*[^a-zA-Z0-9]+).{6,16}/.test(acountreg);
        return reg

    },

    //检查登陆密码格式
    //密码格式：密码位数在6到16之间
    checkLoginPassWord: function (usrPass) {
         var acountreg = usrPass;
		var reg=/(?=.*[\d]+)(?=.*[a-zA-Z]+)(?=.*[^a-zA-Z0-9]+).{6,12}/.test(acountreg);
        return reg
    },

    //检查邮箱格式
    checkLoginEmail: function (email) {
        var val = email;
        return /^[A-Za-z0-9\u4e00-\u9fa5\@\.\-\_]*$/.test(val);
    },

    //检查邮箱格式
    checkEmail: function (email) {
        var val = email;
        return /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(val);
    },

    //检查手机格式
    checkMobile: function (mobile) {
        var val = mobile;
        //  return /^(0)?((13|14|15|16|17|18)[0-9]\d{8})$/.test(val);
        return /^(0|"+")?((13|14|15|16|17|18|19)[0-9]\d{8})$/.test(val);
    },

    //检查是否是数字和字母
    checkNumberAndLetter: function (value) {
        return /^[0-9a-zA-Z]*$/g.test(value);
    },

    //单独注册页面 手机号码 因为香港的手机号码 非1 开头
    cndnsMobile: function (mobile) {
        var val = mobile;
        return /^(0|\+|\+86)?(\d{9,14})$/.test(val);
    },

    //检查主机名称格式
    checkHostName: function (value) {
        if (value.length < 1) {
            return false;
        }
        var regExp = /^(\*)(\.([0-9a-zA-Z\-]+))*$/;
        var regExp2 = /^[\@|\*]{1}$/;
        var regExp3 = /^[0-9a-zA-Z\-]+(\.([0-9a-zA-Z\-]+))*$/;
        if (regExp.test(value) || regExp2.test(value) || regExp3.test(value)) {
            return true;
        }
        else {
            return false;
        }
    },

    //检查是否包中文
    checkChinese: function (value) {
        var boolTag = false;
        for (var i = 0; i < value.length; i++) {
            var tmpval = value.substr(i, 1)
            if (tmpval.charCodeAt() > 126) {
                boolTag = true;
                break;
            }
        }
        return boolTag;
    },

    //检查是否验证码
    checkPostcode: function (value) {
        return /^[A-Za-z0-9]{6}$/.test(value);
    },

    //检查是否是中文开头
    checkChineseInput: function (value) {
        return /^[\u4e00-\u9fa5]{2,8}$/.test(value);
    },

    //检查是否是英文开头
    checkEnglishInput: function (value) {
        return /^[A-Za-z0-9]+[^\u4e00-\u9fa5]*$/.test(value);
    },

    //检查是否是电话国别号
    checkCountyCode: function (value) {
        return /^\+\d{1,4}\.$/.test(value);
    },

    //检查是否是电话区号
    checkTelCode: function (value) {
        return /^\d{1,4}$/.test(value);
    },

    //检查是否是数字
    checkNumber: function (value) {
        return /^\d*$/.test(value);
    },

    //检查是否是电话号
    checkTel: function (value) {
        return /^\d{7,11}$/.test(value);
    },

    //检查是否是电话号
    checkTel1: function (value) {
        return /^(0)?[1-9][0-9]{8,10}$/.test(value);
    },

    //检查是否是英文所有者名称
    checkEnglishName: function (value) {
        //return /^[A-Za-z]+(\x20|\&)[A-Za-z\d\x20\,\&\.\(\)]+$/.test(value);
        return /^[a-zA-Z0-9\-\.&]+\s[a-zA-Z0-9\-\.\s,()&]{1,96}$/.test(value);
    },

    //检查是否是英文
    checkEnglish: function (value) {
        return /^[A-Za-z]+$/.test(value);
    },

    //检查DNS
    checkDns: function (value) {
        var s = value.split(".");
        var ret = true;
        if (value.indexOf(".") < 0 || value.substr(0, 1) == "." || value.substr(value.length - 1, 1) == ".") {
            return false;
        }

        for (var irow = 0; irow < s.length; irow++) {
            if (!/^[a-zA-Z\d\u4E00-\u9FA5\-]/.test(s[irow]) || s[irow].indexOf("--") > -1) {
                ret = false;
                break;
            }
        }
        return ret;
    },

    //检查域名后缀
    checkDomainSuffix: function (value) {
    	value = $.trim(value);
    	if (value.indexOf(".") < 0) {
            return false;
        }
        var info = value.split('.');
        if (info.length == 2) {
            if(info[0] != '') return false;
            if(info[1] == '') return false;
        	return true;
        }
        if (info.length == 3) {
            var dom = ",.cn.com,.gov.cn,.com.cn,.net.cn,.org.cn,.ac.cn,.bj.cn,.sh.cn,.hk.cn,.tj.cn,.cq.cn,.he.cn,.sx.cn,.nm.cn,.ln.cn,.jl.cn,.hl.cn,.js.cn,.zj.cn,.ah.cn,.fj.cn,.jx.cn,.sd.cn,.ha.cn,.hb.cn,.hn.cn,.gd.cn,.gx.cn,.hi.cn,.sc.cn,.gz.cn,.yn.cn,.xz.cn,.sn.cn,.gs.cn,.qh.cn,.nx.cn,.xj.cn,.tw.cn,.mo.cn,.com.ag,.net.ag,.org.ag,.com.br,.net.br,.com.bz,.net.bz,.com.co,.net.co,.nom.co,.com.es,.net.es,.org.es,.co.in,.firm.in,.gen.in,.ind.in,.net.in,.org.in,.com.mx,.co.nz,.net.nz,.org.nz,.com.tw,.idv.tw,.org.tw,.co.uk,.me.uk,.co.jp,.org.uk,.com.hk,.idv.hk,.gov.hk,.edu.hk,.net.hk,";
            if (dom.indexOf(",." + info[1].toLowerCase() + "." + info[2].toLowerCase() + ",") >= 0) {
                return true;
            }
            else {
                return false;
            }
        }
        return false;
    },

    checkDomain : function (value) {
        /*var valArr = value.split(".");
        if (valArr.length < 2) {
            return false;
        }*/
        if (this.checkEnDomain(value)) {
            return true;
        }
        if (this.checkSencondEnDomain(value)) {
            return true;
        }
        if (this.checkCnDomain(value)) {
            return true;
        }
        return false;
    },

    //检查英文域名
    checkEnDomain: function (value) {
        var pattern = /^[a-z0-9\-]+\.([a-z]{2,6}\.){0,1}[a-z]{2,6}$/i;
        return pattern.test(value);
    },

    //检查一级二级英文域名
    checkSencondEnDomain: function (value) {
        var pattern = /^(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/i;
        return pattern.test(value);
    },

    //检查中文域名
    checkCnDomain: function (value) {
        var pattern = /^[A-Za-z0-9_\u4E00-\u9FA5]+([\.\-][A-Za-z0-9_\u4E00-\u9FA5]+)*$/;
        return pattern.test(value);
    },

    //检查输入的年份
    checkYear: function (value) {
        var pattern = /^[0-9]{1,2}$/;
        return pattern.test(value);
    },

    //检查管理DNS输入的密码
    checkDNSPassword: function (value) {
        var pattern = /^[a-zA-Z0-9]{6,16}$/;
        return pattern.test(value);
    },

    //仅支持字母、数字、中文、空格
    checkInputValue: function (value) {
        var pattern = /^[a-zA-Z\d\u4e00-\u9fa5\ \:]+$/;
        return pattern.test(value);
    },

    //检查是否是英文开头
    checkCopnme_cn: function (value) {
        return /^[\u4e00-\u9fa5]+(.*[\u4e00-\u9fa5]*)*$/.test(value);
    },

    //检查是否是域名格式
    checkSuffix: function (value) {
        return /^[A-Za-z0-9\.\-\u4E00-\u9FA5]*$/.test(value);
    },

    //检查是否是IP
    checkIp: function (value) {
        return /^([0-9]{1,3}\.{1}){3}[0-9]{1,3}$/.test(value);
    },

	//检查是否是邮箱
	checkFormail: function (value) {
        return /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(value);
    },

	//检查用户名
	checkUserName: function (value) {
        return /^(?!\d+$)[\dA-Za-z]{5,16}$/.test(value);
    },

	//验证用户身份证号码
	checkUserNumber: function (value) {
        return /^(\d{15}$|^\d{18}$|^\d{17}(\d|X|x))$/.test(value);
    },
	checkIsqq:function(value){
		return /^[1-9]\d{4,11}$/.test(value);
	},

    //验证邮编
    checkPostCode: function (value) {
    	return /^[0-9][0-9]{5}$/.test(value);
    }
};

//验证公司营业执照（只验证营业执照）
function checkBusiness(val) {
    var bl = false;
    if (/^[a-zA-Z\d\u4e00-\u9fa5\(\)]{6,30}$/.test(val)) {
        bl = true;
    }
    return bl;

}

//验证公司名称
function checkCorporate(val) {

    var bl = false;
    if (/^[a-zA-Z\u4e00-\u9fa5\d][a-zA-Z\u4e00-\u9fa5\d\ \.\,\(\)]{2,150}$/.test(val)) {
        bl = true;
    }
    return bl;
}

function checkFormail(val) {
    var bl = false;
    if (/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(val)) {
        bl = true;
    }
    return bl;
}

