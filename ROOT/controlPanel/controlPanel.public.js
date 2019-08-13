var ControlPanelPublic = {
    /**
     * 检查登录.
     */
    checkLogin: function () {
        var url = this.loginUrl();
        var union = request("union");
        var data = window.localStorage.getItem(union);
        if (Commonjs.isEmpty(data)) {
            location.href = url;
            return;
        }
        var session = JSON.parse(data);
        if (null == session || undefined == session) {
            location.href = url;
            return;
        }
        if (session.unionCode != union) {
            location.href = url;
            return;
        }
    },

    /**
     * 退出登录.
     */
    logout: function() {
        var union = request("union");
        console.log(union, '+++++++++++++');
        window.localStorage.removeItem(union);
        location.href = this.loginUrl();
    },

    /**
     * 控制面板登录地址.
     * @returns {string}
     */
    loginUrl: function() {
        return Commonjs.getHostUrl() + Commonjs.getCfgVal(configParam.common.cfgKey.template) + configParam.controlPanel.name;
    },

    /**
     * 获取session.
     * @returns {any}
     */
    getSession: function() {
        var union = request("union");
        var data = window.localStorage.getItem(union);
        var session = JSON.parse(data);
        return session;
    },

    /**
     * 获取实例ID.
     */
    getInstance: function () {
        var session = this.getSession();
        return session.instance;
    },

    /**
     * 获取业务ID.
     * @returns {*}
     */
    getBizId: function () {
        var session = this.getSession();
        return session.bizId;
    }
};
//默认执行.
ControlPanelPublic.checkLogin();
