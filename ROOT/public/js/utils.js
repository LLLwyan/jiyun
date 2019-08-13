/**
 * Created by Administrator on 2018/10/11 0011.
 */
/**
 * ����������.
 * @type {{isUnsigned: IntegerUtils.isUnsigned, isPositive: IntegerUtils.isPositive, isInteger: IntegerUtils.isInteger}}
 */
var IntegerUtils = {
    /**
     * �Ƿ�Ϊ�Ǹ�����.
     * @param val
     * @returns {boolean}
     */
    isUnsigned : function (val) {
        var re = /^\d+$/;
        return re.test(val);
    },
    /**
     * �Ƿ�Ϊ����.
     * @param val
     * @returns {boolean}
     */
    isPositive : function (val) {
        var re = /^[0-9]*[1-9][0-9]*$/;
        return re.test(val);
    },
    /**
     * �Ƿ�Ϊ����.
     * @returns {boolean}
     */
    isInteger : function (val) {
        var re = /^-?\d+$/;
        return re.test(val);
    }
};

/**
 * �ַ���������
 */
var StringUtils = {
    /**
     * �Ƿ�Ϊ��.
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