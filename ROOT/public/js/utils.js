/**
 * Created by Administrator on 2018/10/11 0011.
 */
/**
 * 正数工具类.
 * @type {{isUnsigned: IntegerUtils.isUnsigned, isPositive: IntegerUtils.isPositive, isInteger: IntegerUtils.isInteger}}
 */
var IntegerUtils = {
    /**
     * 是否为非负整数.
     * @param val
     * @returns {boolean}
     */
    isUnsigned : function (val) {
        var re = /^\d+$/;
        return re.test(val);
    },
    /**
     * 是否为正数.
     * @param val
     * @returns {boolean}
     */
    isPositive : function (val) {
        var re = /^[0-9]*[1-9][0-9]*$/;
        return re.test(val);
    },
    /**
     * 是否为整数.
     * @returns {boolean}
     */
    isInteger : function (val) {
        var re = /^-?\d+$/;
        return re.test(val);
    }
};

/**
 * 字符串工具类
 */
var StringUtils = {
    /**
     * 是否为空.
     * @param val
     * @returns {boolean}
     */
    isBlank : function (val) {
        if (null == val || undefined == val) {
            return true;
        }
        if (val) {
            return val.length < 1;
        }
        return true;
    }
};