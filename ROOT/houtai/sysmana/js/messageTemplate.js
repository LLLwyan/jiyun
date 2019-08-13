var type ="";
$(function(){
	$(".managertitle ul li").click(function(){
		 $(this).addClass("liactive").siblings().removeClass("liactive"); //切换选中的按钮高亮状态
		 $("#type").val($(this).attr("data"));
		 $("#pagenumber").val("1");
		 querEmailConfig();
	});
	querEmailConfig();
})

//查询邮件配置
function querEmailConfig(){
	var index = $("#pagenumber").val();
	var service = {};
	type = $("#type").val();
	service.type = $("#type").val();
	service.page = index;
	service.pagesize = 10;
	var fn="querEmailConfig";
	service = Commonjs.jsonToString(service)
	var params = Commonjs.getParams(fn,service);//获取参数
	Commonjs.ajaxTrue(weburl,params,querConfigSuccess);
}

function querConfigSuccess(data){
	if(data.data == null){
		return false;
	}
	var html="";
	if(data.data.length>0){
		BaseForeach(data.data,function(i,item){
			html += '<tr class="gradeX">';
			html += '<td>'+(i+1)+'</td>';
			html += '<td>'+item.title+'</td>';
			html += '<td style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">'+delHtmlTag(item.content)+'</td>' ;
			html += '<td>'
			html += '<a href="./messageItem.html?id='+item.id+'&type='+item.type+'" class="btn btn-primary">查看</a> '
			html += '</td>';
			html += '</tr>'
		});

		$("#page").show();
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
		$("#page").hide();
		html+='<tr><td colspan="4" style="height:50px;text-align:center;line-height:50px;">找不到相关信息</td></tr>';
	}
	$("#list").html(html);
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
			querEmailConfig();
		}
	});
}

function delHtmlTag(str){
	return str.replace(/<[^>]+>/g,"");//去掉所有的html标记
}



var vm = new Vue({
    el: '#main-block',
    data: function(){
        return {
            apiFormEmail: {
                mailService: '',
                mailName: '',
                mailPassword: '',
                mailPort: ''
            },
            dialogFormVisibleEmail: false,
            apiFormSms: {
                ifOpenSms: '',
                hlSmsUrl: '',
                hlUsername: '',
                hlToken: ''
            },
            dialogFormVisibleSms: false
        }
    },
    methods: {
        /**
         * 邮局接口设置窗口显示.
         */
        showApiEditEmail: function () {
            var self = this;
            var service = {
                startFrom: 'mail'
            };
            var fn="getDicParamApi";
            service = Commonjs.jsonToString(service);
            var params = Commonjs.getParams(fn,service);//获取参数
            Commonjs.ajaxTrue(sysurl,params,function (data) {

                $.each(data.data, function (index, item) {
                    self.apiFormEmail[item.paramName] = Commonjs.isEmpty(item.paramValue) ? "" : cloudEncrypt.decodeSession(item.paramValue);
                });

                self.dialogFormVisibleEmail = true;
            });
        },

        /**
         * 保存邮局接口设置.
         */
        saveApiSetEmail: function () {
            var self = this;
            var request = [
                {paramName: 'mailService', paramValue: cloudEncrypt.encodeSession(this.apiFormEmail.mailService)},
                {paramName: 'mailPort', paramValue: cloudEncrypt.encodeSession(this.apiFormEmail.mailPort)},
                {paramName: 'mailName', paramValue: cloudEncrypt.encodeSession(this.apiFormEmail.mailName)},
                {paramName: 'mailPassword', paramValue: cloudEncrypt.encodeSession(this.apiFormEmail.mailPassword)}
            ];

            var fn="uptDicParamApi";
            var service = Commonjs.jsonToString(request);
            var params = Commonjs.getParams(fn, service);
            Commonjs.ajaxTrue(sysurl,params,function () {
                self.$message.success('保存接口设置成功');
                self.dialogFormVisibleEmail = false;
            });
        },


        /**
         * 短信接口设置窗口显示.
         */
        showApiEditSms: function () {
            var self = this;
            var service = {
                startFrom: 'hl'
            };
            var fn="getDicParamApi";
            service = Commonjs.jsonToString(service);
            var params = Commonjs.getParams(fn,service);//获取参数
            Commonjs.ajaxTrue(sysurl,params,function (data) {

                $.each(data.data, function (index, item) {
                    self.apiFormSms[item.paramName] = Commonjs.isEmpty(item.paramValue) ? "" : cloudEncrypt.decodeSession(item.paramValue);
                });

                service = {
                    startFrom: 'ifOpenSms'
                };
				service = Commonjs.jsonToString(service);
				params = Commonjs.getParams(fn,service);//获取参数
				Commonjs.ajaxTrue(sysurl,params,function (subData) {
                    $.each(subData.data, function (subIndex, subItem) {
                        self.apiFormSms[subItem.paramName] = Commonjs.isEmpty(subItem.paramValue) ? "" : cloudEncrypt.decodeSession(subItem.paramValue);
                    });
                    self.dialogFormVisibleSms = true;
                });
            });
        },

        /**
         * 保存接口设置.
         */
        saveApiSetSms: function () {
            var self = this;
            var request = [
                {paramName: 'ifOpenSms', paramValue: cloudEncrypt.encodeSession(this.apiFormSms.ifOpenSms.toString())},
                {paramName: 'hlSmsUrl', paramValue: cloudEncrypt.encodeSession(this.apiFormSms.hlSmsUrl)},
                {paramName: 'hlUsername', paramValue: cloudEncrypt.encodeSession(this.apiFormSms.hlUsername)},
                {paramName: 'hlToken', paramValue: cloudEncrypt.encodeSession(this.apiFormSms.hlToken)}
            ];

            var fn="uptDicParamApi";
            var service = Commonjs.jsonToString(request);
            var params = Commonjs.getParams(fn, service);
            Commonjs.ajaxTrue(sysurl,params,function () {
                self.$message.success('保存接口设置成功');
                self.dialogFormVisibleSms = false;
            });
        }
    },
    mounted:function () {
    }
});
