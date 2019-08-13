var productCode;
var levelList;
var dbTypeList;

$(function(){
    productCode = request("productCode");
    getDbType();
    getServerList();
    getDbProduct();
});

function getDbType() {
    var service = {};
    service.paramEName = "dbType";
    var fn="getListParamItemByEName";
    service = Commonjs.jsonToString(service);
    var params = Commonjs.getParams(fn,service);//获取参数
    var data=Commonjs.ajax(sysurl,params,false);
    if(data.result == "success"){
        var html='';
        if (data.data.length>0){
            dbTypeList = data.data;
            BaseForeach(data.data,function(i,item){
                //html+='<option value="'+item.value+'">'+item.description+'</option>';
                html += (html=='' ? '' : '&nbsp;&nbsp;&nbsp;&nbsp;') + '<input type="checkbox" name="dbType" value="' +
                    item.value + '" title="' + item.description + '" onclick="configParam(this)"> ' + item.description;
            });
        }
        $('#dbtype').html(html);
    }
}

/**
 * 配置参数显示.
 * @param obj
 */
function configParam(obj) {
    $('#' + $(obj).val() + 'Config').css('display', obj.checked ? '' : 'none');
}

function getServerList() {
    var service = {};
    service.hostType='mydb'
    service.page = 1;
    service.pagesize = 1000;
    var fn="queryService";
    service = Commonjs.jsonToString(service)
    var params = Commonjs.getParams(fn,service);//获取参数
    var data = Commonjs.ajax(weburl,params,false);

    if(data.result == "success"){
        var html='';
        if (data.data.length>0){
            BaseForeach(data.data,function(i,item){
                //html+='<option value="'+item.value+'">'+item.description+'</option>';
                var name = item.hostName + ' (' + item.extranetIP + ')';
                html += (html=='' ? '' : '&nbsp;&nbsp;&nbsp;&nbsp;') + '<input type="checkbox" name="server[' +
                    item.hostId + ']" title="' + name + '"> ' + name;
            });
        }
        $('#serverList').html(html);
    }
}

//获取域名上级注册商
function queryHostType(){
    var service = {};
    service.paramEName = "regType";
    var fn="getListParamItemByEName";
    service = Commonjs.jsonToString(service);
    var params = Commonjs.getParams(fn,service);//获取参数
    var data=Commonjs.ajax(sysurl,params,false);
    if(data.result == "success"){
        var html='';
        if (data.data.length>0){
            BaseForeach(data.data,function(i,item){
                html+='<option value="'+item.value+'">'+item.description+'</option>';
            });
        }
        $('#regtype').html(html);
        $('#queryInterface').html(html);
    }
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

        var html='';
        if (data.data.length>0){
            levelList=data.data;
            //注册
            html+='<tr><td>注册价格</td>';
            html+='<td colspan="10">根据第一年计算2至';
            html+='<select id="sel_reg" style="height:30px;">';
            html+='<option value="2">2</option>';
            html+='<option value="3">3</option>';
            html+='<option value="4">4</option>';
            html+='<option value="5">5</option>';
            html+='<option value="6">6</option>';
            html+='<option value="7">7</option>';
            html+='<option value="8">8</option>';
            html+='<option value="9">9</option>';
            html+='<option value="10">10</option>';
            html+='</select>年的价格';
            html+='<input type="button" class="btn btn-primary" onClick="calcPrice(\'reg\')" value="开始计算">';
            html+='<input type="button" class="btn btn-primary" onClick="clearPrice(\'reg\')" value="全部清空">';
            html+='</td></tr>';
            BaseForeach(data.data,function(i,item){
                html+='<tr>';
                html+='<td>'+item.levelName+'</td>';
                html+='<td><input type="text" class="input_txt" id="txt_reg_1_'+item.levelCode+'" /></td>';
                html+='<td><input type="text" class="input_txt" id="txt_reg_2_'+item.levelCode+'" /></td>';
                html+='<td><input type="text" class="input_txt" id="txt_reg_3_'+item.levelCode+'" /></td>';
                html+='<td><input type="text" class="input_txt" id="txt_reg_4_'+item.levelCode+'" /></td>';
                html+='<td><input type="text" class="input_txt" id="txt_reg_5_'+item.levelCode+'" /></td>';
                html+='<td><input type="text" class="input_txt" id="txt_reg_6_'+item.levelCode+'" /></td>';
                html+='<td><input type="text" class="input_txt" id="txt_reg_7_'+item.levelCode+'" /></td>';
                html+='<td><input type="text" class="input_txt" id="txt_reg_8_'+item.levelCode+'" /></td>';
                html+='<td><input type="text" class="input_txt" id="txt_reg_9_'+item.levelCode+'" /></td>';
                html+='<td><input type="text" class="input_txt" id="txt_reg_10_'+item.levelCode+'" /></td>';
                html+='</tr>';
            });

            //续费
            html+='<tr><td>续费价格</td>';
            html+='<td colspan="10">根据第一年计算2至';
            html+='<select id="sel_renew" style="height:30px;">';
            html+='<option value="2">2</option>';
            html+='<option value="3">3</option>';
            html+='<option value="4">4</option>';
            html+='<option value="5">5</option>';
            html+='<option value="6">6</option>';
            html+='<option value="7">7</option>';
            html+='<option value="8">8</option>';
            html+='<option value="9">9</option>';
            html+='<option value="10">10</option>';
            html+='</select>年的价格';
            html+='<input type="button" class="btn btn-primary" onClick="calcPrice(\'renew\')" value="开始计算">';
            html+='<input type="button" class="btn btn-primary" onClick="clearPrice(\'renew\')" value="全部清空">';
            html+='<input type="button" class="btn btn-primary" onClick="getRegPrice()" value="取购买价格">';
            html+='</td></tr>';
            BaseForeach(data.data,function(i,item){
                html+='<tr>';
                html+='<td>'+item.levelName+'</td>';
                html+='<td><input type="text" class="input_txt" id="txt_renew_1_'+item.levelCode+'" /></td>';
                html+='<td><input type="text" class="input_txt" id="txt_renew_2_'+item.levelCode+'" /></td>';
                html+='<td><input type="text" class="input_txt" id="txt_renew_3_'+item.levelCode+'" /></td>';
                html+='<td><input type="text" class="input_txt" id="txt_renew_4_'+item.levelCode+'" /></td>';
                html+='<td><input type="text" class="input_txt" id="txt_renew_5_'+item.levelCode+'" /></td>';
                html+='<td><input type="text" class="input_txt" id="txt_renew_6_'+item.levelCode+'" /></td>';
                html+='<td><input type="text" class="input_txt" id="txt_renew_7_'+item.levelCode+'" /></td>';
                html+='<td><input type="text" class="input_txt" id="txt_renew_8_'+item.levelCode+'" /></td>';
                html+='<td><input type="text" class="input_txt" id="txt_renew_9_'+item.levelCode+'" /></td>';
                html+='<td><input type="text" class="input_txt" id="txt_renew_10_'+item.levelCode+'" /></td>';
                html+='</tr>';
            });
        }
        $('#tbody').append(html);
    }
}

//获取域名产品信息
function getDbProduct(){
    var service = {};
    service.productCode = productCode;
    var fn="getDomainProduct";
    service = Commonjs.jsonToString(service);
    var params = Commonjs.getParams(fn,service);//获取参数
    var result=Commonjs.ajax(weburl,params,false);
    if(result.result == "success"){
        var obj=result.data.productView;
        $("#hidProductClass").val(obj.productClass);
        $("#productClassName").html(obj.productClassName);
        $("#hidProductCode").val(obj.productCode);
        $("#productCode").html(obj.productCode);
        $("#productName").val(obj.productName);
        $("#productDetail").val(obj.productDetail);
        //设置选中
        $("#regtype").val(obj.regType);
        $("#status").find("option[value='"+obj.status+"']").attr("selected",true);
        $("#queryInterface").val(obj.productParam.queryType);
        $("#dnsservice").val(obj.productParam.dnsType);
        $("#domaintype").val(obj.productParam.domainType);
        //允许购买时长
        var allowTimes=obj.productParam.allowTime;
        if(allowTimes!=""){
            var arrStr=allowTimes.split(",");
            for(i=0;i<arrStr.length ;i++ ){
                $("#chk_y_"+arrStr[i]).attr("checked","checked");
            }
        }
        //获取域名后缀
        var domainExt=obj.productParam.domainExt;
        if(domainExt!=""){
            var ExtStr=domainExt.split(",");
            for(i=0;i<ExtStr.length ;i++ ){
                var idstr=ExtStr[i].replace('.', '');
                idstr=idstr.replace('.', '');
                $("#suffix_"+idstr).attr("checked","checked");
            }
        }
        chargeItemPrice(result.data);
    }
}

//计费项价格
function chargeItemPrice(data){
    if(data.priceList!="" || data.priceList.length>0){
        BaseForeach(data.priceList,function(i,item){
            var type="";
            if(item.chargeId==1)
                type="reg";
            else if(item.chargeId==2)
                type="renew";

            $("#txt_"+type+"_1_"+item.levelCode).val(item.price1);
            $("#txt_"+type+"_2_"+item.levelCode).val(item.price2);
            $("#txt_"+type+"_3_"+item.levelCode).val(item.price3);
            $("#txt_"+type+"_4_"+item.levelCode).val(item.price4);
            $("#txt_"+type+"_5_"+item.levelCode).val(item.price5);
            $("#txt_"+type+"_6_"+item.levelCode).val(item.price6);
            $("#txt_"+type+"_7_"+item.levelCode).val(item.price7);
            $("#txt_"+type+"_8_"+item.levelCode).val(item.price8);
            $("#txt_"+type+"_9_"+item.levelCode).val(item.price9);
            $("#txt_"+type+"_10_"+item.levelCode).val(item.price10);

            /*var list=item.parameters;
             for(var j=1;j<=10;j++){
             var id="txt_"+type+"_"+j+"_"+item.levelCode;
             $("#"+id).val(list[j]);
             }*/
        });
    }
}

//保存产品数据
function saveProductData(){
    var dbType = "";
    $("input[name=dbType]:checked").each(function(){
        dbType+= ("" == dbType ? "" : ",") + $(this).val();
    });
    if ("" == dbType) {
        $.tooltip('请选择至少一种开通服务',2000,false);
        return false;
    }

    var allowTime='';
    $("input[name=applyTime]:checked").each(function(){
        allowTime+=$(this).val()+',';
    });
    allowTime=allowTime.substring(0, allowTime.length-1);
    var domainExt='';
    $("input[name=suffix]:checked").each(function(){
        domainExt+=$(this).val()+',';
    });
    domainExt=domainExt.substring(0, domainExt.length-1);
    //产品信息
    var product = {};
    product.productClass=$("#hidProductClass").val();
    product.productCode = $("#hidProductCode").val();
    product.productName = $("#productName").val();
    product.regType=$("#regtype").val();
    product.productDetail=$("#productDetail").val();
    product.status=$("#status").val();
    product.domainExt=domainExt	;
    product.queryType=$("#queryInterface").val();
    product.dnsType=$("#dnsservice").val();
    product.domainType=$("#domaintype").val();
    product.allowTime=allowTime;
    var productStr = Commonjs.jsonToString(product);



    //计费项(注册和续费)
    var priceItemStr='';
    BaseForeach(levelList,function(i,item){
        //注册
        var priceItem={};
        priceItem.chargeId=1;
        priceItem.levelCode=item.levelCode;
        priceItem.price1=$("#txt_reg_1_"+item.levelCode).val();
        priceItem.price2=$("#txt_reg_2_"+item.levelCode).val();
        priceItem.price3=$("#txt_reg_3_"+item.levelCode).val();
        priceItem.price4=$("#txt_reg_4_"+item.levelCode).val();
        priceItem.price5=$("#txt_reg_5_"+item.levelCode).val();
        priceItem.price6=$("#txt_reg_6_"+item.levelCode).val();
        priceItem.price7=$("#txt_reg_7_"+item.levelCode).val();
        priceItem.price8=$("#txt_reg_8_"+item.levelCode).val();
        priceItem.price9=$("#txt_reg_9_"+item.levelCode).val();
        priceItem.price10=$("#txt_reg_10_"+item.levelCode).val();
        priceItemStr+=Commonjs.jsonToString(priceItem)+',';

        //续费
        priceItem={};
        priceItem.chargeId=2;
        priceItem.levelCode=item.levelCode;
        priceItem.price1=$("#txt_renew_1_"+item.levelCode).val();
        priceItem.price2=$("#txt_renew_2_"+item.levelCode).val();
        priceItem.price3=$("#txt_renew_3_"+item.levelCode).val();
        priceItem.price4=$("#txt_renew_4_"+item.levelCode).val();
        priceItem.price5=$("#txt_renew_5_"+item.levelCode).val();
        priceItem.price6=$("#txt_renew_6_"+item.levelCode).val();
        priceItem.price7=$("#txt_renew_7_"+item.levelCode).val();
        priceItem.price8=$("#txt_renew_8_"+item.levelCode).val();
        priceItem.price9=$("#txt_renew_9_"+item.levelCode).val();
        priceItem.price10=$("#txt_renew_10_"+item.levelCode).val();
        priceItemStr+=Commonjs.jsonToString(priceItem)+',';
    });
    priceItemStr=priceItemStr.substring(0, priceItemStr.length-1);

    var fn="saveDbProductSet";
    var jsonStr='{"product":['+productStr+'],"priceItem":['+priceItemStr+']}';
    var params = Commonjs.getParams(fn,jsonStr);
    Commonjs.ajaxTrue(weburl,params,saveDataSuccess,false);
}

function saveDataSuccess(data){
    $.tooltip(data.msg,2000,true);
    $('html,body').scrollTop(0);
    window.location.reload();
    getDomainProduct();
}

function calcPrice(type){
    var year=parseInt($("#sel_"+type).val());
    for(var i=1;i<=year;i++){
        BaseForeach(levelList,function(j,item){
            var firstYear=$("#txt_"+type+"_1_"+item.levelCode).val();
            if(firstYear!=""){
                firstYear=parseFloat(firstYear);
                $("#txt_"+type+"_"+i+"_"+item.levelCode).val(firstYear*i);
            }
        });
    }
}

function clearPrice(type){
    var dialog=	art.dialog({
        lock : true,
        opacity : 0.4,
        width : 250,
        title : '提示',
        content : '您确定清空吗？',
        ok : function() {
            for(var i=1;i<=10;i++){
                BaseForeach(levelList,function(j,item){
                    $("#txt_"+type+"_"+i+"_"+item.levelCode).val("");
                });
            }
        },cancel: function(){
            $('#dialog').hide();
        }
    });
}

function getRegPrice(){
    for(var i=1;i<=10;i++){
        BaseForeach(levelList,function(j,item){
            var regPrice=$("#txt_reg_"+i+"_"+item.levelCode).val()
            $("#txt_renew_"+i+"_"+item.levelCode).val(regPrice);
        });
    }
}


var vmDiyProduct = new Vue({
    el: '#main-block',
    data: function() {
        return {}
    },
    methods: {
    },
    mounted: function () {

    }
});
