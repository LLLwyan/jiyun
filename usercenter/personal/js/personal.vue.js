var vm = new Vue({
    el: '#MainContentDIV',
    data: function () {
        return {
            /**
             * 修改数机参数
             */
            mobile: {
                showModifyMobile: false,
                mobileActive: 0,
                bizCode: 'modifyMobile',
                safe: {
                    way: '手机验证',
                    code: '',
                    loading: false,
                    loadText: '获取验证码',
                    reloadTime: 60
                },
                replace: {
                    mobile: '',
                    code: '',
                    loading: false,
                    loadText: '获取验证码',
                    reloadTime: 60
                }
            },

            /**
             * 修改邮箱参数
             */
            mail: {
                showModifyMail: false,
                mailActive: 0,
                bizCode: 'modifyMail',
                safe: {
                    way: '邮箱验证',
                    code: '',
                    loading: false,
                    loadText: '获取验证码',
                    reloadTime: 60
                },
                replace: {
                    mail: '',
                    code: '',
                    loading: false,
                    loadText: '获取验证码',
                    reloadTime: 60
                }
            }
        }
    },
    methods: {
        /**
         * 显示手机修改弹框.
         */
        editMobile: function () {
            this.mobile.showModifyMobile = true;
        },

        /**
         * 获取验证码.
         */
        sendMobileEditCheckCode: function () {
            var self = this;
            var service = {};
            service.way = self.mobile.safe.way == '手机验证' ? 'mobile' : 'mail';
            service.bizCode = self.mobile.bizCode;
            self.mobile.safe.loading = true;
            var fn="userPersonalOldCheckCode";
            service = Commonjs.jsonToString(service);
            var params = Commonjs.getParams(fn,service);

            var timer = function () {
                if (self.mobile.safe.reloadTime > 0) {
                    self.mobile.safe.loadText = '（' + self.mobile.safe.reloadTime + '）秒后可重新获取';
                    self.mobile.safe.reloadTime--;
                    setTimeout(function () {
                        timer();
                    }, 1000)
                } else {
                    self.mobile.safe.loadText = '获取验证码';
                    self.mobile.safe.loading = false;
                }
            };

            Commonjs.ajaxSilence(weburl,params,false,function (data) {
                self.$message.success("验证码发送成功.");
                self.mobile.safe.reloadTime = 60;
                timer();
            }, function (data) {
                self.$message.error(data.msg ? data.msg : '获取验证码出错');
                self.mobile.safe.loadText = '获取验证码';
                self.mobile.safe.loading = false;
            }, true);
        },

        /**
         * 新手机号验证码获取.
         */
        sendMobileEditCheckCodeReplace: function() {
            var self = this;
            if (self.mobile.replace.mobile == '' || !CndnsValidate.checkMobile(self.mobile.replace.mobile)) {
                self.$message.error('请填写正确的手机号');
                return;
            }
            var service = {};
            service.mobile = self.mobile.replace.mobile;

            self.mobile.replace.loading = true;
            var fn="userPersonalMobileCheckCode";
            service = Commonjs.jsonToString(service);
            var params = Commonjs.getParams(fn,service);

            var timer = function () {
                if (self.mobile.replace.reloadTime > 0) {
                    self.mobile.replace.loadText = '（' + self.mobile.replace.reloadTime + '）秒后可重新获取';
                    self.mobile.replace.reloadTime--;
                    setTimeout(function () {
                        timer();
                    }, 1000)
                } else {
                    self.mobile.replace.loadText = '获取验证码';
                    self.mobile.replace.loading = false;
                }
            };

            Commonjs.ajaxSilence(weburl,params,false,function (data) {
                self.$message.success("验证码发送成功.");
                self.mobile.replace.reloadTime = 60;
                timer();
            }, function (data) {
                self.$message.error(data.msg ? data.msg : '获取验证码出错');
                self.mobile.replace.loadText = '获取验证码';
                self.mobile.replace.loading = false;
            }, true);
        },

        /**
         * 手机修改：验证码检查
         */
        checkMobileSafe: function () {
            if (this.mobile.safe.code == '' || this.mobile.safe.code.length !=6 || !CndnsValidate.checkNumber(this.mobile.safe.code)) {
                this.$message.error('请输入正确的验证码');
                return;
            }
            this.mobile.mobileActive = 1;
        },
        /**
         * 验证新手机号，并保存.
         */
        checkMobileSafeSave: function () {
            var self = this;

            if (self.mobile.replace.mobile == '' || !CndnsValidate.checkMobile(self.mobile.replace.mobile)) {
                self.$message.error('请填写正确的手机号');
                return;
            }

            if (self.mobile.replace.code == '' || self.mobile.replace.code.length != 6 || !CndnsValidate.checkNumber(self.mobile.replace.code)) {
                this.$message.error('请输入正确的验证码');
                return;
            }

            var service = {};
            service.oldCheckCode = self.mobile.safe.code;
            service.newCheckCode = self.mobile.replace.code;
            service.mobile = self.mobile.replace.mobile;
            var fn="userPersonalMobileEdit";
            service = Commonjs.jsonToString(service)
            var params = Commonjs.getParams(fn,service);//获取参数
            Commonjs.ajaxSilence(weburl,params,false,function (data) {
                self.mobile.mobileActive = 2;
            }, function (data) {
                self.$message.error(data.msg ? data.msg : '修改失败');
            }, true);
        },

        /**
         * 显示邮箱修改
         */
        editMail: function () {
            this.mail.showModifyMail = true;
        },
        /**
         * 获取安全校验码.
         */
        sendMailEditCheckCode: function () {
            var self = this;
            var service = {};
            service.way = self.mail.safe.way == '手机验证' ? 'mobile' : 'mail';
            service.bizCode = self.mail.bizCode;
            self.mobile.safe.loading = true;
            var fn="userPersonalOldCheckCode";
            service = Commonjs.jsonToString(service);
            var params = Commonjs.getParams(fn,service);

            var timer = function () {
                if (self.mail.safe.reloadTime > 0) {
                    self.mail.safe.loadText = '（' + self.mail.safe.reloadTime + '）秒后可重新获取';
                    self.mail.safe.reloadTime--;
                    setTimeout(function () {
                        timer();
                    }, 1000)
                } else {
                    self.mail.safe.loadText = '获取验证码';
                    self.mail.safe.loading = false;
                }
            };

            Commonjs.ajaxSilence(weburl,params,false,function (data) {
                self.$message.success("验证码发送成功.");
                self.mail.safe.reloadTime = 60;
                timer();
            }, function (data) {
                self.$message.error(data.msg ? data.msg : '获取验证码出错');
                self.mail.safe.loadText = '获取验证码';
                self.mail.safe.loading = false;
            }, true);
        },
        /**
         * 邮箱修改，安全码校验，并进入下步.
         */
        checkMailSafe: function () {
            if (this.mail.safe.code == '' || this.mail.safe.code.length !=6 || !CndnsValidate.checkNumber(this.mail.safe.code)) {
                this.$message.error('请输入正确的验证码');
                return;
            }
            this.mail.mailActive = 1;
        },
        /**
         * 邮箱修改，获取新邮箱校验码.
         */
        sendMailEditCheckCodeReplace: function () {
            var self = this;
            if (self.mail.replace.mail == '' || !CndnsValidate.checkEmail(self.mail.replace.mail)) {
                self.$message.error('请填写正确的邮箱');
                return;
            }
            var service = {};
            service.mail = self.mail.replace.mail;

            self.mail.replace.loading = true;
            var fn="userPersonalMailCheckCode";
            service = Commonjs.jsonToString(service);
            var params = Commonjs.getParams(fn,service);

            var timer = function () {
                if (self.mail.replace.reloadTime > 0) {
                    self.mail.replace.loadText = '（' + self.mail.replace.reloadTime + '）秒后可重新获取';
                    self.mail.replace.reloadTime--;
                    setTimeout(function () {
                        timer();
                    }, 1000)
                } else {
                    self.mail.replace.loadText = '获取验证码';
                    self.mail.replace.loading = false;
                }
            };

            Commonjs.ajaxSilence(weburl,params,false,function (data) {
                self.$message.success("验证码发送成功.");
                self.mail.replace.reloadTime = 60;
                timer();
            }, function (data) {
                self.$message.error(data.msg ? data.msg : '获取验证码出错');
                self.mail.replace.loadText = '获取验证码';
                self.mail.replace.loading = false;
            }, true);
        },
        /**
         * 保存邮箱修改.
         */
        checkMailSafeSave: function () {
            var self = this;

            if (self.mail.replace.mail == '' || !CndnsValidate.checkEmail(self.mail.replace.mail)) {
                self.$message.error('请填写正确的邮箱账号');
                return;
            }

            if (self.mail.replace.code == '' || self.mail.replace.code.length != 6 || !CndnsValidate.checkNumber(self.mail.replace.code)) {
                this.$message.error('请输入正确的验证码');
                return;
            }

            var service = {};
            service.oldCheckCode = self.mail.safe.code;
            service.newCheckCode = self.mail.replace.code;
            service.mail = self.mail.replace.mail;
            var fn="userPersonalMailEdit";
            service = Commonjs.jsonToString(service)
            var params = Commonjs.getParams(fn,service);//获取参数
            Commonjs.ajaxSilence(weburl,params,false,function (data) {
                self.mail.mailActive = 2;
            }, function (data) {
                self.$message.error(data.msg ? data.msg : '修改失败');
            }, true);
        }
    },
    mounted: function () {
    }
});
