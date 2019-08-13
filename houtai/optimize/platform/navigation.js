var vmNavigation = new Vue({
    el: '#main-block',
    data: function(){
        return {
            data: [],
            currentNode: {
                id: 1,
                label: '',
                deep: 2,
                type: 1,
                link: '#',
                icon: '',
                img: '',
                imgWidth: 30,
                imgHeight: 30,
                isUsable: 1,
                children: []
            },
            tmp: {
                id: '',
                label: '新增导航',
                deep: 2,
                type: 1,
                link: '#',
                icon: '',
                img: '',
                imgWidth: 30,
                imgHeight: 30,
                isUsable: 1,
                children: []
            },
            typeOptions: [
                {
                    value: 1,
                    label: '文字链接'
                },
                {
                    value: 2,
                    label: '上图下文'
                },
                {
                    value: 3,
                    label: '左图右文'
                }
            ],
            uploadUrl: ''
        };
    },
    methods: {
        /**
         * 获取配置.
         */
        loadConfig: function() {
            var self = this;
            var request = {};

            var fn="navigationGet";
            var service = Commonjs.jsonToString(request);
            var params = Commonjs.getParams(fn, service);
            Commonjs.ajaxSilence(weburl, params, true, function (response) {
                self.data = response.data;
            }, function () {
                self.$message.error("获取导航配置错误");
            });
        },

        /**
         * 添加.
         * @param data
         */
        append(data) {
            var newChild = $.extend(true, {}, this.tmp);
            newChild.id = Commonjs.guid();
            newChild.deep = data.deep + 1;
            if (newChild.deep > 4) {
                return;
            }
            if (!data.children) {
                this.$set(data, 'children', []);
            }
            data.children.push(newChild);
            //todo:
            //vmNvigation.$refs['navTree'].setCurrentKey(newChild.id);
        },

        /**
         * 是否允许添加子集.
         * @param data
         * @returns {boolean}
         */
        allowAdd(data) {
            return parseInt(data.deep) < 4;
        },

        /**
         * 删除.
         * @param node
         * @param data
         */
        remove(node, data) {
            var parent = node.parent;
            var children = parent.data.children || parent.data;
            var index = children.findIndex(function (d) { return d.id === data.id;});
            children.splice(index, 1);
        },

        /**
         * 选中节点.
         * @param node
         * @param object
         */
        selectNode(node, object) {
            this.currentNode = node;

        },

        /**
         * 上传图片.
         * @param data
         */
        uploadSuccess: function (data) {
            this.currentNode.img = data.url;
            this.$refs.upload.clearFiles();
        },
        /**
         * 跳转.
         */
        jumpLink: function () {
            var url = Commonjs.getCfgVal(configParam.common.cfgKey.template) + this.currentNode.link;
            window.open(url);
        },
        /**
         * 保存.
         */
        saveNavigation: function () {
            var self = this;
            var request = {
                navigation: self.data
            };

            var fn="navigationSave";
            var service = Commonjs.jsonToString(request);
            var params = Commonjs.getParams(fn, service);
            Commonjs.ajaxSilence(weburl, params, true, function (response) {
                self.$message.success("保存成功");
            }, function (data) {
                self.$message.error(data.msg);
            });
        },
        /**
         * 取消.
         */
        cancelNavigation: function () {
            this.loadConfig();
        },
        /**
         * 生成.
         */
        build: function () {
            var self = this;
            this.$confirm('确定需要按当前配置生成导航吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(function (){
                var service = {};
                service.navigation = self.data;
                var fn="navigationBuild";
                service = Commonjs.jsonToString(service)
                var params = Commonjs.getParams(fn,service);
                Commonjs.ajaxSilence(weburl,params,true,function (data) {
                    self.$message.success("生成成功");
                }, function (data) {
                    self.$message.error(data.msg);
                });
            }).catch(function(){
            });
        }
    },
    mounted:function () {
        this.loadConfig();
        this.uploadUrl = realPath + '/upload.do';
    }
});
