var vmControlPanelLogin = new Vue({
    el: '#controlPanelLoginDiv',
    data: function () {
        return {
            proList: [
                {
                    productClass: 'vhost',
                    productName: '虚拟主机',
                    url: './controlPanel/vhost.html?union={union}'
                }
            ],
            submitVisible: true,
            form: {
                productClass: '',
                instance: '',
                pwd: ''
            },
            rules: {
                productClass : [
                    { required: true, message: '请选择产品', trigger: 'blur' }
                ],
                instance : [
                    { required: true, message: '请输入实例ID', trigger: 'blur' }
                ],
                pwd : [
                    { required: true, message: '请输入管理密码', trigger: 'blur' }
                ]
            }
        }
    },
    methods: {
        /**
         * 加载配置.
         */
        loadConfig: function() {
            var self = this;
            var autoDo = false;
            var auto = request("auto");
            if (1 == auto) {
                var token = request("token");
                token = decodeURIComponent(token);
                var data = JSON.parse(token);
                if (undefined == data || null == data || undefined == data.productClass || null == data.productClass) {
                    this.$message('error', '无效的Token');
                } else {
                    autoDo = true;
                    this.form.productClass = data.productClass;
                    this.form.instance = data.instance;
                    this.form.pwd = cloudEncrypt.decodePublic(data.pwd);
                    self.loginReal();
                }
            }


            if (!autoDo) {
                this.form.productClass = this.proList[0].productClass;
            }
        },
        /**
         * 登录触发.
         */
        login: function () {
            var self = this;
            this.$refs['formLogin'].validate( function (valid) {
                if (valid) {
                    self.loginReal();
                } else {
                    return false;
                }
            });
        },
        /**
         * 登录.
         */
        loginReal: function() {
            var self = this;
            var service = Object.assign({}, self.form);
            service.pwd = cloudEncrypt.encodePublic(service.pwd);
            var fn="controlPanelLogin";
            service = JSON.stringify(service);
            var params = Commonjs.getParams(fn,service);
            parent.Commonjs.ajaxTrue(weburl,params,function (data) {
                window.localStorage.setItem(data.data.unionCode, JSON.stringify(data.data));
                location.href = self.getUrl(data.data.unionCode);
            });
        },
        /**
         * 获取控制面板管理地址.
         * @param union
         * @returns {string}
         */
        getUrl: function (union) {
            var url = "";
            for(var i=0; i<this.proList.length; i++) {
                var pro = this.proList[i];
                if (pro.productClass == this.form.productClass) {
                    url = pro.url;
                }
            }
            return url.replace("{union}", union);
        }
    },
    mounted: function () {
        this.loadConfig();
    }
});


//滑块拖动标识
function DragValidate (dargEle,msgEle){
    var dragging = false;//滑块拖动标识
    var iX;
    dargEle.mousedown(function(e) {
        msgEle.text("");
        dragging = true;
        iX = e.clientX; //获取初始坐标
    });
    $(document).mousemove(function(e) {
        if (dragging) {
            var e = e || window.event;
            var oX = e.clientX - iX;
            if(oX < 30){
                return false;
            };
            if(oX >= 260){//容器宽度+10
                oX = 250;
                return false;
            };
            dargEle.width(oX + "px");
            //console.log(oX);
            return false;
        };
    });
    $(document).mouseup(function(e) {
        var width = dargEle.width();
        if(width < 230){
            dargEle.width("30px");
            msgEle.text("拖动滑块到最右边");
            vmControlPanelLogin.submitVisible = true;
            $('#box').css('background-color', '#686B69');
            $('#dragEle').css('background-color', '#0e81cc');
            $('#dragEle').css('z-index', 100);
        }else{
            vmControlPanelLogin.submitVisible = false;
            $('#tMsg').html("验证成功 &radic;");
            $('#box').css('background-color', '#eeeeee');
            $('#dragEle').css('background-color', '#0aaf52');
            $('#dragEle').css('z-index', 98);
        }
        dragging = false;
    });
}

DragValidate($("#dragEle"),$(".tips"));
$("#submit").click(function(){
    if(!$("#dragEle").attr("validate")){
        alert("请先拖动滑块验证！");
    }else{
        alert("验证成功！");
    }
});
