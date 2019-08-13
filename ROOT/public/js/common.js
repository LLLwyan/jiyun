var sysurl ="/sys.do";
var weburl ="/web.do";
document.createElement("footer");

var Commonjs;
/*循环获取json数据*/
function BaseForeach(obj, fun) {
	if (obj == null || obj == undefined || obj.length < 1) {
		return;
	}
	if (obj instanceof Array) {
		for (var i = 0; i < obj.length; i++) {
			fun(i, obj[i]);
		}
	} else {
		fun(0, obj);
	}
}

/*获取url传值*/
function request(paras) {　　
	var url = location.href;　　
	var paraString = url.substring(url.indexOf("?") + 1, url.length).split("&");　　
	var paraObj = {}　　
	for (i = 0; j = paraString[i]; i++) {　　
		paraObj[j.substring(0, j.indexOf("=")).toLowerCase()] = j.substring(j.indexOf("=") + 1, j.length);
	}
	var returnValue = paraObj[paras.toLowerCase()];
	if (typeof(returnValue) == "undefined") {
		return "";
	} else {
		return returnValue;
	}
}

function alertload() {
	var htmldiv = '<div class="model"> <div class="main"><div class="loadEffect"><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span></div></div></div>';
	$("body").append(htmldiv);
}

function closeload() {
	$(".model").hide();
	$(".main").hide();
}

/*div加载弹窗 */
function divalertLoad(content) {
	var html_div = '<div class="black_overlay"></div> <div class="load_box" style="text-align:center;"><p><img src="'+realPath+'/public/img/uploading.gif" style="padding-bottom:25px;padding-top: 10px;"></p><p>' + content + '</p></div><div class="al_screen"></div>';
	$("body").append(html_div);
	var totH = $(document).height();
	var totW = document.documentElement.clientWidth;
	var aleL = (totW - $(".load_box").width() - 80) / 2;
	$(".load_box").css('left', aleL + "px");
	$(".load_box").css('height',"130px");
	$(".black_overlay").css('height', totW + "px");
	return false;
}

/*div关闭弹窗 */
function divcloseLoad() {
	$(".black_overlay").hide();
	$(".load_box").hide();
}

/*提醒 提醒弹窗*/
function alertNew(content) {
	art.dialog({
		lock : false,
        artIcon:'error',
		opacity : 0.4,
		width : 250,
		title:'错误提示',
		content:content,
		time:3
	});
	$(".aui_close").hide();//隐藏关闭
}

function alertSuccess(content) {
    art.dialog({
        lock : false,
        artIcon:'success',
        opacity : 0.4,
        width : 250,
        title:'提示',
		content:content,
        time:3
    });
    $(".aui_close").hide();//隐藏关闭
}

/* 加载弹窗 */
function alertLoad(content) {
	art.dialog({
		lock : true,
		opacity : 0.4,
		width : 250,
		title:content,
		id:"lockid"
	});
	 $(".aui_close").hide();//隐藏关闭
}

function alertClose() {
	art.dialog({id:'lockid'}).close();
}

Commonjs = {
	ajax :function (url,params,flag,loadMessage){
        loadMessage = loadMessage || '正在加载数据,请稍等';
		var self = this;
		var obj = null;
		$.ajax({
			datatype:"json",
			type:"POST",
			url: url,
			data:params,
			async: flag,
			timeout : 3000,
			cache : false,
			beforeSend: function () {
				divalertLoad(loadMessage);
			},

        	success: function(data){
        		divcloseLoad();
        		obj =jQuery.parseJSON(data);
        		if(obj.result=="failure" ){
    				var pathName=window.document.location.pathname;
        			if(obj.code=="S302"){
        				if(pathName.indexOf("houtai")>-1){
        					$.cookie("hlhtName", null,{expires:-1,path:"/"});
        					top.location.href=realPath+'/houtai/login.html';
        				}else{
        					$.cookie("hluserName", null,{expires:-1,path:"/"});
        					top.location.href=realPath+'/login.html';
        				}
        				return false;
        			}else if(obj.code=="S308"){
        				if(pathName.indexOf("houtai")>-1){
        					$.cookie("hlhtName", null,{expires:-1,path:"/"});
        					top.location.href=realPath+'/houtai/login.html?code=expiry';
	    				}else{
	    					$.cookie("hluserName", null,{expires:-1,path:"/"});
	    					top.location.href=realPath+'/login.html?code=expiry';
	    				}
	    				return false;
	    			}else{
        				self.alert(obj.msg);
        				return false;
        			}
        		}
        	},
        	error: function () {
        		closeload();
        		alertNew('服务器忙，请稍候再试！');
        	}
	   });
	   if(!flag) return obj;
	},

    /**
	 * 无强制处理请求
     * @param url 地址.
     * @param params 参数.
     * @param flag 是否异步.
     * @param success 成功回调.
     * @param fail 失败回调.
     */
	ajaxSilence: function(url, params, flag, success, fail, noLoading, loadMessage) {
        loadMessage = loadMessage || '正在加载数据,请稍等';
        var self = this;
        var obj = null;
        $.ajax({
            datatype:"json",
            type:"POST",
            url: url,
            data:params,
            async: flag,
            timeout : 30000,
            cache : false,
            beforeSend: function () {
                if (undefined==noLoading || !noLoading) {
                    divalertLoad(loadMessage);
                }
            },

            success: function(data){
                if (undefined==noLoading || !noLoading) {
                    divcloseLoad();
                }
                obj =jQuery.parseJSON(data);
                if(obj.result=="failure" ){
                	if (fail) {
                		fail(obj);
                    }
                } else {
                	if (success) {
                		success(obj);
                    }
				}
            },
            error: function (jqXHR, textStatus, errorThrown) {
                if (undefined==noLoading || !noLoading) {
                    divcloseLoad();
                }
				if (fail) {
					fail(jqXHR);
                }
            }
        });
	},


    //异步ajax请求，成功后方法从调用的地方传过来
    /*
    flag: true/false;
    showLoad:true/false;
    */
    ajaxTrue:function(url,params,successfn,showLoad,loadContent){
    	var self = this;
        if(showLoad==null) showLoad=true;
        if(loadContent==null) loadContent='正在加载数据...';

        var obj = null;
        var data = null;
        $.ajax({
            datatype:"json",
            type:"post",
            url:url,
            data:params,
            timeout:60000,
            cache:false,
            beforeSend: function () {
				if(showLoad == true) divalertLoad(loadContent);
			},
	         success:function(obj){
				divcloseLoad();
	            data = jQuery.parseJSON(obj);
	            if(data.result=="failure" ){
	            	var pathName=window.document.location.pathname;
	                if(data.code=="S302"){
	                	if(pathName.indexOf("houtai")>-1){
        					$.cookie("hlhtName", null,{expires:-1,path:"/"});
        					top.location.href=realPath+'/houtai/login.html';
        				}else{
        					$.cookie("hluserName", null,{expires:-1,path:"/"});
        					top.location.href=realPath+'/login.html';
        				}
	    				return false;
	    			}else if(data.code=="S308"){
	    				if(pathName.indexOf("houtai")>-1){
        					$.cookie("hlhtName", null,{expires:-1,path:"/"});
        					top.location.href=realPath+'/houtai/login.html?code=expiry';
	    				}else{
	    					$.cookie("hluserName", null,{expires:-1,path:"/"});
	    					top.location.href=realPath+'/login.html?code=expiry';
	    				}
	    				return false;
	    			}else{
                        self.alert(data.msg);
	    				return false;
	    			}
	    		}else{
	    		    successfn(data);
	    		}
	         },
	         error: function(XMLHttpRequest, textStatus, errorThrown) {
	        	 divcloseLoad();
                 self.alert("操作超时");
             }
        });
    },

	jsonp :function (url,data,flag,successfn){
		var obj = null;
		$.ajax({
			type: 'Post',
			async: false,
			url: url,
			data:data,
			dataType: 'jsonp',
			jsonp: 'callback',
			jsonpCallback:'flightHandler',
			timeout : 8000,
			success: function(data){
				successfn(data);
			},
			error: function () {
				successfn(null);
				alertNew('服务器忙，请稍候再试！');
			}
		});
	},

	trim : function(str) {
		return str.replace(/(^\s*)|(\s*$)/g, "");
	},

	getUrlParam : function (val) {
		var uri = window.location.search;
		var re = new RegExp("" +val+ "\=([^\&\?]*)", "ig");
		return ((uri.match(re))?(uri.match(re)[0].substr(val.length+1)):null);
	},

	isEmpty : function(s){
		if(s == undefined){
			return true;
		}else{
			if(s == null || s == '' || s == 'undefined'
				|| s == 'null' || s.length < 1){
				return true;
			}
		}
		return false;
	},

	getParams : function(api,Service){
		var times=new Date().getTime();
		var sign=$.md5(Service+times);
		var params='fn='+api+'&p='+Service+'&t='+times+'&sign='+sign;
		return params;
	},

	jsonToString : function(obj){
	var THIS = this;
	switch(typeof(obj)){
		case 'string':
			return '"' + obj.replace(/(["\\])/g, '\\$1') + '"';
		case 'array':
			return '[' + obj.map(THIS.jsonToString).join(',') + ']';
		case 'object':
			if(obj instanceof Array){
				var strArr = [];
				var len = obj.length;
				for(var i=0; i<len; i++){
					strArr.push(THIS.jsonToString(obj[i]));
				}
				return '[' + strArr.join(',') + ']';
			}else if(obj==null){
				return 'null';
			}else{
				var string = [];
				for (var property in obj) string.push(THIS.jsonToString(property) + ':' + THIS.jsonToString(obj[property]));
				return '{' + string.join(',') + '}';
			}
			case 'number': return obj;
			case false: return obj;
		}
	},

	getDate : function(day) {
		var today = new Date();
		var targetday_milliseconds = today.getTime() + 1000 * 60 * 60 * 24 * day;
		today.setTime(targetday_milliseconds); // 注意，这行是关键代码
		var tYear = today.getFullYear();
		var tMonth = today.getMonth();
		var tDate = today.getDate();
		tMonth = Commonjs.doHandleMonth(tMonth + 1);
		tDate = Commonjs.doHandleMonth(tDate);
		return tYear + "-" + tMonth + "-" + tDate;
	},

	doHandleMonth : function(month){
		var m = month;
		if (month.toString().length == 1) {
			m = "0" + month;
		}
		return m;
	},

	/**
	 * icon不传则为提示错误信息, 成功icon传add
	 *
	 * @param {Object} msg
	 * @param {Object} icon
	 */
	alert: function(msg,icon) {
		var ic = icon;
		if(icon==undefined||Commonjs.isEmpty(icon)) {
			ic = 'error';
		}
		art.dialog({
			lock : true,
			artIcon : ic,
			opacity : 0.4,
			width : 250,
			title : '提示',
			content : msg,
			ok : function() {
			}

		});
		 $(".aui_close").hide();//隐藏关闭
	},

	//弹窗点击确认的时候跳转页面
	alerturl: function(msg,URL) {
		art.dialog({
			lock : true,
			opacity : 0.4,
			width : 250,
			title : '提示',
			content : msg,
			ok : function() {
				window.location.href= URL;
			}
		});
		 $(".aui_close").hide();//隐藏关闭
	},

	//弹窗点击确认的时候跳出框架跳转
	alertTopUrl: function(msg,URL) {
		art.dialog({
			lock : true,
			opacity : 0.4,
			width : 250,
			title : '提示',
			content : msg,
			ok : function() {
				top.location.href= URL;
			}
		});
		 $(".aui_close").hide();//隐藏关闭
	},

	 cityajax :function (flag){
		var obj = null;
		$.ajax({
			datatype:"json",
			type:"POST",
			url: realPath+"/xml/Provinces.xml",
			async: flag,
			timeout : 8000,
			cache : false,
			success: function(data){
				obj =data;
			}

		});
		if(!flag) return obj;
	},

	/**
	 * 滚动条对象
	 *
	 * @param {Object} formId
	 */
	getJscrollpane : null,

    /**
	 * 是否为数字类型.
     */
    isNumeric: function (obj) {
        return typeof obj === 'number' && !isNaN(obj)
    },

    /**
	 * 是否为数字.
     * @param val
     * @returns {*|boolean}
     */
	isNumber: function(val) {
        return /^[0-9]+.?[0-9]*$/.test(val);
	},

    /**
	 * 是否是整数.
     * @param val
     * @returns {boolean}
     */
    isIntNum: function(val){
        var regPos = /^\d+$/; // 非负整数
        var regNeg = /^\-[1-9][0-9]*$/; // 负整数
        if(regPos.test(val) || regNeg.test(val)){
            return true;
        }else{
            return false;
        }
    },

    /**
	 * 是否为非负整数.
     * @param val
     * @returns {boolean}
     */
	isNonnInt : function (val) {
        var regPos = /^\d+$/; // 非负整数
        if(regPos.test(val)){
            return true;
        }else{
            return false;
        }
    },

    /**
	 * 获取访问地址头.
     * @returns {string}
     */
	getHostUrl: function () {
		return document.location.protocol + "//" + document.location.hostname +
			(document.location.port == 80 ? "" : (":" + document.location.port));
    },

    /**
	 * 获取指定地址地址头.
     * @param url
     * @returns {string}
     */
	getHostUrlFromString: function(url) {
		var startPos = url.indexOf('//') + 2;
		return url.substr(0, url.indexOf('/', startPos));
	},

    /**
	 * 获取cfg.
     * @param name
     * @returns {*}
     */
	getCfg: function (name) {
		var cfgList = JSON.parse(window.localStorage.getItem(configParam.common.configStorageKey));
		for (var i=0; i<cfgList.length; i++) {
			var cfg = cfgList[i];
			if (cfg.paramName == name) {
				return cfg;
			}
		}
		return null;
    },

    /**
	 * 获取配置值.
     * @param name
     * @returns {null}
     */
    getCfgVal: function (name) {
		var cfg = this.getCfg(name);
		return null == cfg ? null : cfg.paramValue;
    },

	S4: function() {
    	return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    },
    /**
	 * 生成guid.
     * @returns {string}
     */
	guid: function() {
		return (this.S4()+this.S4()+"-"+this.S4()+"-"+this.S4()+"-"+this.S4()+"-"+this.S4()+this.S4()+this.S4());
	}
};

//获取验证码
function refreshVcode() {
	var src = realPath+'/sys.do?fn=getcode&d=' + Math.random();
	$.ajax({
		type:"POST",
		url:src,
		async:true,
		beforeSend:function(){
			$("#imgcode").attr({"src":"images/loading.gif","class":"bf-img-code"});
		},
		success:function(){
			$("#imgcode").attr({"src":src,"class":"img-code"});
		},
		complete:function(){
			$("#imgcode").attr({"alt":"点击可更换","title":"点击可更换"});
		}
	});
}

var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
var base64DecodeChars = new Array(-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1, -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1);
/**
* base64编码
* @param {Object} str
*/
function base64encode(str){
	var out, i, len;
	var c1, c2, c3;
	len = str.length;
	i = 0;
	out = "";
	while (i < len) {
		c1 = str.charCodeAt(i++) & 0xff;
		if (i == len) {
			out += base64EncodeChars.charAt(c1 >> 2);
			out += base64EncodeChars.charAt((c1 & 0x3) << 4);
			out += "==";
			break;
		}
		c2 = str.charCodeAt(i++);
		if (i == len) {
			out += base64EncodeChars.charAt(c1 >> 2);
			out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
			out += base64EncodeChars.charAt((c2 & 0xF) << 2);
			out += "=";
			break;
		}
		c3 = str.charCodeAt(i++);
		out += base64EncodeChars.charAt(c1 >> 2);
		out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
		out += base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
		out += base64EncodeChars.charAt(c3 & 0x3F);
	}
	return out;
}

/**
* base64解码
* @param {Object} str
*/
function base64decode(str){
	var c1, c2, c3, c4;
	var i, len, out;
	len = str.length;
	i = 0;
	out = "";
	while (i < len) {
		/* c1 */
		do {
			c1 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
		}
		while (i < len && c1 == -1);
		if (c1 == -1)
			break;
		/* c2 */
		do {
			c2 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
		}
		while (i < len && c2 == -1);
		if (c2 == -1)
			break;
		out += String.fromCharCode((c1 << 2) | ((c2 & 0x30) >> 4));
		/* c3 */
		do {
			c3 = str.charCodeAt(i++) & 0xff;
			if (c3 == 61)
				return out;
			c3 = base64DecodeChars[c3];
		}
		while (i < len && c3 == -1);
		if (c3 == -1)
			break;
		out += String.fromCharCode(((c2 & 0XF) << 4) | ((c3 & 0x3C) >> 2));
		/* c4 */
		do {
			c4 = str.charCodeAt(i++) & 0xff;
			if (c4 == 61)
				return out;
			c4 = base64DecodeChars[c4];
		}
		while (i < len && c4 == -1);
		if (c4 == -1)
			break;
		out += String.fromCharCode(((c3 & 0x03) << 6) | c4);
	}
	return out;
}

/**
* utf16转utf8
* @param {Object} str
*/
function utf16to8(str){
	var out, i, len, c;
	out = "";
	len = str.length;
	for (i = 0; i < len; i++) {
		c = str.charCodeAt(i);
		if ((c >= 0x0001) && (c <= 0x007F)) {
			out += str.charAt(i);
		}
		else
			if (c > 0x07FF) {
				out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
				out += String.fromCharCode(0x80 | ((c >> 6) & 0x3F));
				out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
			}
			else {
				out += String.fromCharCode(0xC0 | ((c >> 6) & 0x1F));
				out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
			}
	}
	return out;
}

/**
* utf8转utf16
* @param {Object} str
*/
function utf8to16(str){
	var out, i, len, c;
	var char2, char3;
	out = "";
	len = str.length;
	i = 0;
	while (i < len) {
		c = str.charCodeAt(i++);
		switch (c >> 4) {
			case 0:
			case 1:
			case 2:
			case 3:
			case 4:
			case 5:
			case 6:
			case 7:
				// 0xxxxxxx
				out += str.charAt(i - 1);
				break;
			case 12:
			case 13:
				// 110x xxxx 10xx xxxx
				char2 = str.charCodeAt(i++);
				out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
				break;
			case 14:
				// 1110 xxxx10xx xxxx10xx xxxx
				char2 = str.charCodeAt(i++);
				char3 = str.charCodeAt(i++);
				out += String.fromCharCode(((c & 0x0F) << 12) | ((char2 & 0x3F) << 6) | ((char3 & 0x3F) << 0));
				break;
		}
	}
	return out;
}

function jsonDateFormat(d) {
	try {
		var date= new Date(parseInt(d.time,10));
		var month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
		var day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
		return date.getFullYear() + "-" + month + "-" + day;
	} catch (ex) {
		return "";
	}
}

function jsonDateTimeFormat(d) {
	try {
		var date= new Date(parseInt(d.time,10));
		var month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
		var day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
		var hours = date.getHours()<10?"0"+date.getHours():date.getHours();
		var minutes = date.getMinutes()<10?"0"+date.getMinutes():date.getMinutes();
		var seconds = date.getSeconds()<10?"0"+date.getSeconds():date.getSeconds();
		var milliseconds = date.getMilliseconds();
		return date.getFullYear() + "-" + month + "-" + day+" "+hours+":"+minutes+":"+seconds
	} catch (ex) {
		return "";
	}
}

function getCookie(name){
	var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
	if(arr=document.cookie.match(reg))
		return unescape(arr[2]);
	else
		return null;
}

function setCookie(cname, cvalue, exdays) {
	var d = new Date();
	d.setTime(d.getTime() + (exdays*24*60*60*1000));
	var expires = "expires="+d.toUTCString();
	document.cookie = cname + "=" + cvalue + "; " + expires;
}

function clearCookie(name) {
	setCookie(name, "", -1);
}

function isNotNull(str){
	if(str==null || str==undefined || str=="")
		return false;
	return true;
}

function imgtobase64(input_file, get_data)
{
	/*input_file：文件按钮对象*/
	/*get_data: 转换成功后执行的方法*/
	var file = input_file.value;
	if(file!="" || file== 'undefined'){
		if (typeof (FileReader) === 'undefined') {
			Commonjs.alert("抱歉，你的浏览器不支持 FileReader，不能将图片转换为Base64，请使用现代浏览器操作！");
		}
		if(!/.(gif|jpg|jpeg|png|GIF|JPG|png)$/.test(file)){
		  Commonjs.alert("图片类型必须是.gif,jpeg,jpg,png中的一种");
		  return false;
		}
		 var image = new Image();
		 image.src = file;
		 var height = image.height;
		 var width = image.width;
		 var filesize = image.filesize;
		 if(width>80 && height>80 && filesize>1024000){
		  Commonjs.alert('请上传大于80*80像素 或者大小小于1M的图片');
		  return false;
		 }
		try {
			/*图片转Base64 核心代码*/
			var file = input_file.files[0];
			//这里我们判断下类型如果不是图片就返回 去掉就可以上传任意文件
			if (!/image\/\w+/.test(file.type)) {
				Commonjs.alert("请确保文件为图像类型");
				return false;
			}
			var reader = new FileReader();
			reader.onload = function () {
				get_data(this.result);
			}
			reader.readAsDataURL(file);
		} catch (e) {
			Commonjs.alert('图片转Base64出错啦！' + e.toString())
		}
	}
}

//获取随机密码
function _getRandomString(len) {
	len = len || 32;
	var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'; // 默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1
	var maxPos = $chars.length;
	var pwd = '';
	for (i = 0; i < len; i++) {
		pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
	}
	return pwd;
}

window.onload=function(){
	for(var i=0; i<document.links.length; i++)
		document.links[i].onfocus=function(){this.blur()}
};

/*前台注销*/
function Cancellation(){
	var dialog=	art.dialog({
			lock : true,
			opacity : 0.4,
			width : 250,
			title : '提示',
			content : '确定退出？',
			ok : function() {
				var fn="logout";
				var params = Commonjs.getParams(fn,"");//获取参数
				$.ajax({
				datatype: "json",
				type: "POST",
				url: sysurl,
				data: params,
				timeout: 8000,
				cache: false,
				success: function(obj) {
					var data = jQuery.parseJSON(obj);
					if(data.result=="success"){
						$.cookie(config.cookie.userName, null,{expires:-1,path:"/"});
						window.location.href=realPath+'/login.html';
					}
					else
					{
						$.cookie(config.cookie.userName, null,{expires:-1,path:"/"});
					}
				},
			error: function() {
				closeload();
				alertNew('服务器忙，请稍候再试！');
			}
				})
			},
		cancel: function(){
			$('#dialog').hide();
		}
	})
	$(".aui_close").hide();//隐藏关闭
}

/**
 * 参数Key定义.
 * @type {{cloudType: {openStack: string, hyperV: string}}}
 */
var configParam = {
	productClass : {
		domain: 'domain',
		cloud: 'cloud',
		vHost: 'vhost',
		diy: 'diy'
	},
	cloudType : {
		openStack : "osc",
		hyperV : "hyperv",
		aliyun : 'aliyun',
		huawei : 'huawei',
		vncInstance : '_vnc_instance'
	},
	session : {
        funCode : '_funCodeList'
	},
	page : {
		size: 10
	},
	dic : {
		wxPayOpen: {
			name : 'ifOpenWxPay',
			type : 2
		}
	},
	common: {
        configStorageKey: 'cfg_sto',
		cfgKey: {
        	template: 'template'
		},
		vHost: {
        	register: {
        		winiis: 'winiis'
			}
		}
	},
	controlPanel: {
		name: 'controlPanel.html'
	},
	htmlPage: {
		diyDetail: 'diy/info.html'
	}
};

//提示框
var topError = function (dom, message) {
	if (dom._topError) {
		dom._topError(message);
	} else {
		if (dom.parent) {
			topError(dom.parent, message)
		}
	}
};

var topSuccess = function (dom, message) {
    if (dom._topSuccess) {
        dom._topSuccess(message);
    } else {
        if (dom.parent) {
            topSuccess(dom.parent, message)
        }
    }
};

Commonjs.tips = function (message, resultFlag) {
    $.toast({
        text : '<span style="font-size:16px;">' + message + '</span>',
        showHideTransition : 'slide',
        bgColor : resultFlag ? '#beeebc' : '#ee3109',
        textColor : resultFlag ? '#000' : '#fff',
        allowToastClose : false,
        hideAfter : 2000,
        stack : 0,
        textAlign : 'left',
        position : 'top-center'
    });
};


var ServletUtils = {
    get : function (name) {
        var uri = window.location.href;
        if (name && name != null) {
            var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
            var r = uri.substring(uri.indexOf('?') + 1).match(reg);
            return (r != null) ? r[2] : null;
        }

        var args = {};
        var query = uri.substring(uri.indexOf('?') + 1); // 获取查询串
        var pairs = query.split('&'); // 在逗号处断开
        for (var i = 0; i < pairs.length; i++) {
            var pos = pairs[i].indexOf('='); // 查找name=value
            if (pos > -1) {
                var argname = pairs[i].substring(0, pos); // 提取name
                var val = pairs[i].substring(pos + 1); // 提取value
                args[argname] = val; // 存为属性
            }
        }
        return args;
    }
};


//提示框
var wModal = function (dom) {
    if (dom.ParentModel) {
        return dom.ParentModel;
    } else {
        if (dom.parent) {
            return wModal(dom.parent)
        } else {
        	console.log("ParentModel not found")
        	return {};
		}
    }
};

/**
 * 加密处理.
 * @type {{encodePublic: (function(*=): (*|PromiseLike<ArrayBuffer>)), decodePublic: (function(*=): (PromiseLike<ArrayBuffer> | *)), encodeSession: (function(*=): (*|PromiseLike<ArrayBuffer>)), decodeSession: (function(*=): (PromiseLike<ArrayBuffer> | *))}}
 */
var cloudEncrypt = {
	_mode : function() {
		return {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.NoPadding
        };
	},

	_baseDecode : function(encodeStr) {
		try {
            encodeStr = decodeURIComponent(encodeStr);
            var pdk = CryptoJS.enc.Utf8.parse('0F9EB4944BB85CED');
            var decrypt = CryptoJS.AES.decrypt(encodeStr, pdk, this._mode());
            var key = CryptoJS.enc.Utf8.stringify(decrypt).toString();
            key = key.replace(/\0/g, "");
            return key;
        } catch (e) {
			console.log(e);
        }
	},

    /**
	 * 自补码.
     * @param str
     * @returns {*}
     * @private
     */
	_addPadding : function(str) {
        var paddingCount = 16 - (str.length % 16);
        for(var i = 0; i < paddingCount; i++) {
            str += "\0";
        }
        return CryptoJS.enc.Utf8.parse(str);
	},

    /**
	 * 去补码
     * @param str
     * @private
     */
	_removePadding : function(str) {
		str = str.replace(/\0/, '');
		if (str.indexOf('\0') > -1){
			return this._removePadding(str);
		}
		return str;
	},

    _publicKey : function () {
        var key = $.cookie('ak');
        key = this._baseDecode(key);
        return CryptoJS.enc.Utf8.parse(key);
    },

    /**
	 * 公共隐私数据加密.
     * @param str
     * @returns {*|PromiseLike<ArrayBuffer>}
     */
	encodePublic: function (str) {
        str = this._addPadding(str);
		var encryptText = CryptoJS.AES.encrypt(str, this._publicKey(), this._mode());
		return encodeURIComponent(encryptText.toString());
    },

    /**
	 * 公共隐私数据解密.
     * @param str
     * @returns {PromiseLike<ArrayBuffer> | *}
     */
    decodePublic: function (str) {
    	try {
            var decrypt = CryptoJS.AES.decrypt(str, this._publicKey(), this._mode());
            return this._removePadding(CryptoJS.enc.Utf8.stringify(decrypt).toString());
        } catch (e) {
			console.log(e);
        }
    },

	_sessionKey: function() {
        var key = $.cookie('sk');
        key = this._baseDecode(key);
        return CryptoJS.enc.Utf8.parse(key);
	},

    /**
	 * 会话隐私数据加密.
     * @param str
     * @returns {*|PromiseLike<ArrayBuffer>}
     */
	encodeSession: function (str) {
        str = this._addPadding(str);
        var encryptText = CryptoJS.AES.encrypt(str, this._sessionKey(), this._mode());
        return encodeURIComponent(encryptText.toString());
    },

    /**
	 * 会话隐私数据解密.
     * @param str
     * @returns {PromiseLike<ArrayBuffer> | *}
     */
    decodeSession: function (str) {
    	try {
            var decrypt = CryptoJS.AES.decrypt(str, this._sessionKey(), this._mode());
            return this._removePadding(CryptoJS.enc.Utf8.stringify(decrypt).toString());
        } catch (e) {
			console.log(e);
        }
    }
};

var ProtectionStartUtils = {
    /**
	 * 手机号星号替换
     * @param mobile 手机号.
     * @returns {*}
     */
	mobile : function (mobile) {
		return mobile.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2");
    },

    /**
     * 身份证号星号替换.
     * @param idcard
     * @returns {*}
     */
    idCard : function (idCard) {
        return idCard.replace(/(\d{8})\d{8}(\d{2})/, "$1********$2")
    }
};

/**
 * 上传.
 * @param id
 * @param fun
 */
var uploadCommon = function(id,fun) {
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
            fun(data);
        },
        error : function(data, status, e) {
            topError(window, '图片上传失败：建议您选择不超过1M的图片且在良好的网络环境下继续上传');
        }
    });
};

var random = {
    randomString: function (charCollection, length) {
        length = length || charCollection.length / 2;
        //var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'; // 默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1
        var maxPos = charCollection.length;
        var str = '';
        for (var i = 0; i < length; i++) {
            str += charCollection.charAt(Math.floor(Math.random() * maxPos));
        }
        return str;
    },

    getEnChar: function (length) {
    	var charCollection = 'abcedefghijklmnopqrstuvwxyz';
    	return this.randomString(charCollection, length);
	},

	getNumeric: function (length) {
		var charCollection = '0123456789';
		return this.randomString(charCollection, length);
    },

	getSpeical: function (length) {
		var charCollection = '+-)(*~!@#$%^&.,<>;:"';
		return this.randomString(charCollection, length);
    },

	getCloudPass: function () {
		return this.getEnChar(2) + this.getSpeical(2) + this.getEnChar(3).toUpperCase() + this.getNumeric(1) +
			this.getEnChar(3);
    }
};

/**
 * IE9以下不兼容提示.
 */
var ieTester = function () {
    var ua = navigator.userAgent.toLowerCase();
	var ie9Tester = function () {
        var DEFAULT_VERSION = 9.0;
        var isIE = ua.indexOf("msie")>-1;
        var safariVersion;
        var isNineUper = false;
        if(isIE){
            safariVersion =  ua.match(/msie ([\d.]+)/)[1];
            isNineUper = (safariVersion < DEFAULT_VERSION);
        }
        /**
		 * 只支持360 Trident.
         */
        if (!isNineUper && ua.indexOf("trident") > -1) {
        	var tridentVersion = ua.match(/trident\/([\d.]+)/)[1];
            isNineUper = (tridentVersion >= 5);
		}
        return isNineUper;
    };
	var chromeTester = function () {
        return ua.indexOf("chrome") > -1;
    };
	var firefoxTester = function () {
        return ua.indexOf("firefox") > -1;
    };
	/*if (!ie9Tester() && !chromeTester() && !firefoxTester()) {
        alert('系统检测到您正在使用非谷歌（chrome）、火狐（firefox）、IE 9+浏览器浏览，不能实现完美体验，请更换或升级浏览器访问！');
        window.close();
    }*/
};
ieTester();

/**
 * 云管iframe消息通信.
 * @type {{send: CloudMessage.send, _listenMap: {}, addListen: CloudMessage.addListen, startListen: CloudMessage.startListen}}.
 */
var CloudMessage = function () {
}
CloudMessage.prototype = {
	constructor: CloudMessage,
	/**
	 * 发送消息.
	 * @param object iframe 对象
	 * @param msgType 消息类型.
	 * @param data 内容.
	 */
	send: function (object, msgType, data) {
        var iframeWindow = object.contentWindow;
        var target = object.src;
        var messageSource = {
            type: msgType,
            data: data
        };
        var message = JSON.stringify(messageSource);
        iframeWindow.postMessage(message, target);
    },

	/**
	 * 监听对象方法映射图
	 */
	_listenMap: {},

	/**
	 * 添加监听.
	 * @param msgType 消息类型.
	 * @param fun 解析方法.
	 */
	addListen: function (msgType, fun) {
		this._listenMap[msgType] = fun;
		return this;
	},

	/**
	 * 开启监听.
	 * @param origin 监听消息来源.
	 */
	startListen: function (origin) {
		var self = this;
		/**
		 * 消息处理.
		 * @param event
		 */
		var handleMessage = function (event) {
			event = event || window.event;

			if(event.origin === origin) {
				var messageSource = event.data;
				var message = JSON.parse(messageSource);
				if (self._listenMap[message.type]) {
					var fun = self._listenMap[message.type];
					fun(message.data);
				}
			}
		};

		//处理
		if (window.addEventListener) {
			window.addEventListener("message", handleMessage, false);
		} else {
			window.attachEvent("onmessage", handleMessage);
		}
	}
};
