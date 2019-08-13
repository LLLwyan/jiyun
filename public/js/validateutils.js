var ValidateUtils = {
    isDomain : function (domain) {
        var arr = domain.split(".");
        if (arr.length < 2) {
            return false;
        }

        for(var i=0; i<arr.length; i++) {
            var str = arr[i];
            if (str.length < 2) {

            }
        }
    }
};
