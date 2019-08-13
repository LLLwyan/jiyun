var productCode;
var levelList;

$(function(){
    productCode = request("productCode");
    queryDicVipgrade();
    getDiyProduct();
});


/**
 * 配置参数显示.
 * @param obj
 */
function configParamDiy(obj) {
    if ('web' == obj.value) {
        if (obj.checked) {
            $('#ftpCheckbox').get(0).checked = true;
            $('#ftpConfig').css('display', '');
            $('#ftpPrice').css('display', 'none');
        } else {
            $('#ftpPrice').css('display', '');
        }
    }
    if ('ftp' == obj.value) {
        if (!obj.checked && $('#webCheckbox').get(0).checked) {
            $('#ftpCheckbox').get(0).checked = true;
            return true;
        } else {
            $('#ftpPrice').css('display', '');
        }
    }
    $('#' + obj.value + 'Config').css('display', obj.checked ? '' : 'none');
    $('#' + obj.value + 'Price').css('display', obj.checked ? '' : 'none');
    $('#ftpServerListArea').css('display', $('#webCheckbox').get(0).checked ? 'none' : '');

}

//获取会员等级
function queryDicVipgrade(){
    var service = {};
    var fn="queryVipgradeList";
    service = Commonjs.jsonToString(service);
    var params = Commonjs.getParams(fn,service);//获取参数
    var data=Commonjs.ajax(weburl,params,false);
    if(data.result == "success"){
        if(data.data==null)
            return;

        var htmlWeb = '',
            htmlFtp = '',
            htmlMysql = '',
            htmlMssql = '';
        if (data.data.length>0) {
            levelList = data.data;
        }
            /*    BaseForeach(data.data,function(i,item){*/
                htmlWeb+='<tr>';
                htmlWeb+='<td><input type="text" class="manager-input m-input width100" name="WebLinksBase_Price" id="WebLinksBase_Price" /></td>';
                htmlWeb+='<td><input type="text" class="manager-input m-input width100" name="WebLinksUnit_Price" id="WebLinksUnit_Price" /></td>';
                htmlWeb+='<td><input type="text" class="manager-input m-input width100" name="WebWidthBase_Price" id="WebWidthBase_Price" /></td>';
                htmlWeb+='<td><input type="text" class="manager-input m-input width100" name="WebWidthUnit_Price" id="WebWidthUnit_Price" /></td>';
                htmlWeb+='<td><input type="text" class="manager-input m-input width100" name="WebFlowBase_Price" id="WebFlowBase_Price" /></td>';
                htmlWeb+='<td><input type="text" class="manager-input m-input width100" name="WebFlowUnit_Price" id="WebFlowUnit_Price" /></td>';
                htmlWeb+='<td><input type="text" class="manager-input m-input width100" name="WebFtpDiskQuotaBase_Price" id="WebFtpDiskQuotaBase_Price" /></td>';
                htmlWeb+='<td><input type="text" class="manager-input m-input width100" name="WebFtpDiskQuotaUnit_Price" id="WebFtpDiskQuotaUnit_Price" /></td>';
                htmlWeb+='</tr>';

                htmlFtp+='<tr>';
                htmlFtp+='<td><input type="text" class="manager-input m-input width100" name="FtpDiskQuotaBase_Price" id="FtpDiskQuotaBase_Price" /></td>';
                htmlFtp+='<td><input type="text" class="manager-input m-input width100" name="FtpDiskQuotaUnit_Price" id="FtpDiskQuotaUnit_Price" /></td>';
                htmlFtp+='</tr>';

                htmlMysql+='<tr>';
                htmlMysql+='<td><input type="text" class="manager-input m-input width100" name="MySQLSizeBase_Price" id="MySQLSizeBase_Price" /></td>';
                htmlMysql+='<td><input type="text" class="manager-input m-input width100" name="MySQLSizeUnit_Price" id="MySQLSizeUnit_Price" /></td>';
                htmlMysql+='</tr>';

                htmlMssql+='<tr>';
                htmlMssql+='<td><input type="text" class="manager-input m-input width100" name="MSSQLSizeBase_Price" id="MSSQLSizeBase_Price" /></td>';
                htmlMssql+='<td><input type="text" class="manager-input m-input width100" name="MSSQLSizeUnit_Price" id="MSSQLSizeUnit_Price" /></td>';
                htmlMssql+='<td><input type="text" class="manager-input m-input width100" name="MSSQLLogSizeBase_Price" id="MSSQLLogSizeBase_Price" /></td>';
                htmlMssql+='<td><input type="text" class="manager-input m-input width100" name="MSSQLLogSizeUnit_Price" id="MSSQLLogSizeUnit_Price" /></td>';
                htmlMssql+='</tr>';
            //});

            $('#webPriceList').html(htmlWeb);
            $('#ftpPriceList').html(htmlFtp);
            $('#mysqlPriceList').html(htmlMysql);
            $('#mssqlPriceList').html(htmlMssql);
        //}
    }
}

//获取产品信息
function getDiyProduct(){
    var service = {};
    service.productCode = productCode;
    service.productClass = "diy";
    var fn="getCloudProduct";
    service = Commonjs.jsonToString(service);
    var params = Commonjs.getParams(fn,service);//获取参数
    var result=Commonjs.ajax(weburl,params,false);
    if(result.result == "success"){
        console.log(result);
        var obj=result.data.productView;
        $("#hidProductClass").val(obj.productClass);
        $("#productClassName").html(obj.productClassName);
        $('#subClassName').html(obj.subClassName);
        $("#hidProductCode").val(obj.productCode);
        $("#productCode").html(obj.productCode);
        $("#productName").val(obj.productName);
        $("#productDetail").val(obj.productDetail);
        //设置选中
        $("#status").find("option[value='"+obj.status+"']").attr("selected",true);

        //产品参数
        var productParam = obj.productParam;

        //数量
        $('#buyMaxNum').val(productParam.buyMaxNum);

        //价格配置
        $('#price').val(productParam.price);

        //产品促销
        var priceItem=result.data.promotionList;
        if(priceItem!="" || priceItem.length>0){
            BaseForeach(priceItem,function(i,item){
                var type='';
                if(item.chargeId==1)
                    type="buy";
                else if(item.chargeId==2)
                    type="renew";

                $("#chk_"+type+'_'+item.applyType+"_"+item.applyTime).attr("checked","checked");
                $("#st_"+type+'_'+item.applyType+"_"+item.applyTime).val(item.saleType);
                $("#txt_"+type+'_'+item.applyType+"_"+item.applyTime).val(item.saleValue);
            })
        }

        //element-ui param set
        vmDiyProduct.form.productName = obj.productName;

        vmDiyProduct.form.iconShow = productParam.iconShow ? productParam.iconShow : vmDiyProduct.form.iconShow;
        vmDiyProduct.form.iconUrl = productParam.iconUrl ? productParam.iconUrl : vmDiyProduct.form.iconUrl;
        vmDiyProduct.form.iconWidth = productParam.iconWidth ? productParam.iconWidth : vmDiyProduct.form.iconWidth ;
        vmDiyProduct.form.iconHeight = productParam.iconHeight ? productParam.iconHeight : vmDiyProduct.form.iconHeight;
        vmDiyProduct.form.iconLocal = productParam.iconLocal ? productParam.iconLocal : vmDiyProduct.form.iconLocal;
        vmDiyProduct.form.description = productParam.description ? productParam.description : vmDiyProduct.form.description;

        vmDiyProduct.form.miniServer = productParam.miniServer ? productParam.miniServer : vmDiyProduct.form.miniServer;
        vmDiyProduct.form.paramShow = productParam.paramShow ? productParam.paramShow : vmDiyProduct.form.paramShow;
        vmDiyProduct.form.paramUrl = productParam.paramUrl ? productParam.paramUrl : vmDiyProduct.form.paramUrl;
        vmDiyProduct.form.paramWidth = productParam.paramWidth ? productParam.paramWidth : vmDiyProduct.form.paramWidth;
        vmDiyProduct.form.paramHeight = productParam.paramHeight ? productParam.paramHeight : vmDiyProduct.form.paramHeight;
        vmDiyProduct.form.syncOpen = productParam.syncOpen ? productParam.syncOpen : vmDiyProduct.form.syncOpen;
        vmDiyProduct.form.syncRenew = productParam.syncRenew ? productParam.syncRenew : vmDiyProduct.form.syncRenew;
        vmDiyProduct.form.syncDelete = productParam.syncDelete ? productParam.syncDelete : vmDiyProduct.form.syncDelete;
    }
}

//保存产品数据
function saveProductData(){
    var allParam = {
        productCode : productCode
    };

    var productName = $('#productName').val().trim();
    if ('' == productName) {
        topError(window, '请填写产品名称');
        return false;
    }
    allParam.productName = productName;

    //主参数值获取.
    allParam.productDetail = $('#productDetail').val();
    allParam.status = $('#status').val();
    allParam.price = $('#price').val();
    if (!IntegerUtils.isPositive(allParam.price)) {
        topError(window, '价格必须为大于0的整数');
        return false;
    }
    allParam.buyMaxNum = $('#buyMaxNum').val();
    if (!IntegerUtils.isPositive(allParam.buyMaxNum)) {
        topError(window, '购买数量不正确，必须为大于0的整数');
        return false;
    }

    //element ui param.
    allParam = $.extend(allParam, vmDiyProduct.form);

    var productStr = JSON.stringify(allParam);

    //价格优惠
    var priceItemStr='';
    $("input[name=buyTime]:checked").each(function(){
        var priceItem={};
        priceItem.productCode=$("#hidProductCode").val();
        priceItem.chargeId=1;
        priceItem.applyTime=$(this).val();
        priceItem.applyType=$(this).attr("time");
        priceItem.saleType=$("#st_buy_"+$(this).attr("time")+"_"+$(this).val()).val();
        priceItem.saleValue=$("#txt_buy_"+$(this).attr("time")+"_"+$(this).val()).val();
        priceItemStr+=Commonjs.jsonToString(priceItem)+',';
    });

    $("input[name=renewTime]:checked").each(function(){
        var priceItem={};
        priceItem.productCode=$("#hidProductCode").val();
        priceItem.chargeId=2;
        priceItem.applyTime=$(this).val();
        priceItem.applyType=$(this).attr("time");
        priceItem.saleType=$("#st_renew_"+$(this).attr("time")+"_"+$(this).val()).val();
        priceItem.saleValue=$("#txt_renew_"+$(this).attr("time")+"_"+$(this).val()).val();
        priceItemStr+=Commonjs.jsonToString(priceItem)+',';
    });
    priceItemStr=priceItemStr.substring(0, priceItemStr.length-1);

    var fn="saveDiyProductSet";
    var jsonStr='{"product":['+productStr+'],"priceItem":['+priceItemStr+']}';
    var params = Commonjs.getParams(fn,jsonStr);
    Commonjs.ajaxTrue(weburl,params,saveDataSuccess,false);
}

function saveDataSuccess(data){
    topSuccess(window, data.msg);
    $('html,body').scrollTop(0);
    window.location.reload();
    getDiyProduct();
}

var vmDiyProduct = new Vue({
    el: '#main-block',
    data: function() {
        return {
            iconOptions: [
                {label: '不显示', value: 'N'},
                {label: '显示', value: 'Y'}
            ],
            iconLocalOptions: [
                {label: '对齐到左边', value: 'left'},
                {label: '对齐到右边', value: 'right'},
                {label: '与中央对齐', value: 'middle'},
                {label: '与顶部对齐', value: 'top'},
                {label: '与底部对齐', value: 'bottom'}
            ],

            paramOptions: [
                {label: '默认（产品详细说明）', value: 'default'},
                {label: '自定义', value: 'diy'}
            ],

            miniServices: [],

            form: {
                productName: '',

                iconShow: 'N',
                iconUrl: '',
                iconWidth: 38,
                iconHeight: 38,
                iconLocal: 'middle',

                description: '',

                miniServer: '',
                paramShow: 'default',
                paramUrl: '',
                paramWidth: 600,
                paramHeight: 400,
                syncOpen: 'Y',
                syncRenew: 'Y',
                syncDelete: 'Y'
            },
            uploadUrl: ''
        }
    },
    methods: {
        /**
         * 上传成功.
         * @param rsp
         * @param file
         * @param fileList
         */
        uploadSuccess: function (rsp, file, fileList) {
            this.form.iconUrl = rsp.url;
            this.$refs['uploader'].clearFiles();
        },
        /**
         * 上传失败.
         * @param err
         * @param file
         * @param fileList
         */
        uploadError: function(err, file, fileList) {
            this.$message.error(err);
            this.$refs['uploader'].clearFiles();
        },
        loadData: function () {
            var self = this;
            var service = {};
            var fn="mimiServiceSelect";
            service = Commonjs.jsonToString(service)
            var params = Commonjs.getParams(fn,service);
            Commonjs.ajaxSilence(weburl,params,true,function (data) {
                self.miniServices = data.data;
            }, function (data) {
                self.$message.error(data.msg);
            });
        }
    },
    mounted: function () {
        this.uploadUrl = realPath + '/upload.do';
        setTimeout(function () {
            $('input[type="file"]').css('display', 'none');
        }, 500);
        this.loadData();
    }
});
