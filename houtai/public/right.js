$(function () {
    loadFun();
    $(document.body).bind('DOMNodeInserted', function () {
        loadFun();
    });
});

/**
 * 是否有指定权限.
 * @param funCode 权限标识.
 * @returns {boolean}
 */
var hasFun = function(funCode) {
    var funcCodeListJsonString = window.localStorage.getItem(configParam.session.funCode);
    var funcCodeList = JSON.parse(funcCodeListJsonString);
    return funcCodeList.hasOwnProperty(funCode);
};

/**
 * 权限元素控制.
 */
var loadFun = function () {
    $('*[_funCode]').css('display', 'none');
    $('*[_funCode]').each(function (index, item) {
        var jQueryObject = $(item);
        var funCode = jQueryObject.attr('_funCode');
        var funCodeListJsonString = window.localStorage.getItem(configParam.session.funCode);
        var funCodeList = JSON.parse(funCodeListJsonString);
        if (funCodeList.hasOwnProperty(funCode)) {
            jQueryObject.css('display', '');
        }
    });
};
