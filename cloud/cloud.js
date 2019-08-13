var diskListNum=0;
var diskContNum=0;
var emptyDisk=0;

$(function(){
    //地域
    $("#place_button button").each(function(){
        $(this).addClass("hl_hl_buy_main_baserow_place");
        $(".hl_buy_side_main .hl_buy_side_main_list #hly_regionName").html($(this).parent().find(".hly_regionName").html());
        $("#hly_set_regionId").val($(this).parent().find(".hly_regionName").attr("value"));
        $("#hly_set_regionName").val($(this).parent().find(".hly_regionName").html());
        return false;
    });
    //cpu
    $("#cpuButton button").each(function(){
    $(this).addClass("hl_hl_buy_main_baserow_place");
    $(".hl_buy_side_main .hl_buy_side_main_list #hly_cpu").html($(this).parent().find(".hly_cpu").html());
    $("#hly_set_cpu").val($(this).parent().find(".hly_cpu").attr("value"));
    return false;
    });
    //内存
    var mem = $(".hly_memory_list .hl_hl_buy_main_baserow_place span").html();
    $(".hl_buy_side_main .hl_buy_side_main_list #hly_memory").html(mem);
    //购买时长
    $("#applyTimeButton button").each(function(){
    $(this).addClass("hl_hl_buy_main_baserow_place");
    $(".hl_buy_side_main .hl_buy_side_main_list #hly_set_applyTime").html($(this).parent().find(".hly_applyTime").html());
    $("#hly_set_applyTime").val($(this).parent().find(".hly_applyTime").attr("value"));
    $("#hly_set_applyType").val($(this).parent().find(".hly_applyType").attr("value"));
    return false;
    });

    //地域、cpu、内存单击事件
    $(".hl_buy_main_baserow_button button").click(function(){
    $(this).parent().find("button").removeClass("hl_hl_buy_main_baserow_place");
    $(this).addClass("hl_hl_buy_main_baserow_place");
    if($(this).find(".hly_regionName").html()!=null){
    $(".hl_buy_side_main .hl_buy_side_main_list #hly_regionName").html($(this).find(".hly_regionName").html());
    $("#hly_set_regionId").val(($(this).find(".hly_regionName").attr("value")));
    $("#hly_set_regionName").val($(this).find(".hly_regionName").html());
    }
    if($(this).find(".hly_memory").html()!=null){
    var mem = parseFloat($(this).find(".hly_memory").attr("value"));
    $(".hl_buy_side_main .hl_buy_side_main_list #hly_memory").html($(this).find(".hly_memory").html());
    $("#hly_set_memory").val(mem);
    var cpu = parseInt($(".hly_cpu_list .hl_hl_buy_main_baserow_place span").attr("value"));
    if(cpu>mem)
    if(cpu==1&&mem==0.5){
    $("#hly_set_memory").val(mem);
    }else{
    $("#hly_memory"+cpu).click();
    return false;
    }
    else
    $("#hly_set_memory").val(mem);
    }
    if($(this).find(".hly_cpu").html()!=null){
    var cpu = parseInt($(this).find(".hly_cpu").attr("value"));
    $(".hl_buy_side_main .hl_buy_side_main_list #hly_cpu").html($(this).find(".hly_cpu").html());
    $("#hly_set_cpu").val(cpu);
    var mem = parseInt($(".hly_memory_list .hl_hl_buy_main_baserow_place span").attr("value"));
    var i=1;
    $(".hly_memory_list button").each(function(){
    if(cpu>1){
    if(parseInt($(this).find("span").attr("value"))>=cpu&&i<5){
    $(this).css("display","");
    i = i+1;
    }else{
    $(this).css("display","none");
    }
    }else{
    if(i<=5){
    $(this).css("display","");
    i = i+1;
    }else{
    $(this).css("display","none");
    }
    }
    });
    if(cpu>mem){
    $("#hly_memory"+cpu).click();
    return false;
    }
    if(mem>cpu*8){
    $("#hly_memory"+cpu).click();
    return false;
    }
    $("#hly_set_cpu").val(cpu);
    }
    if($(this).find(".hly_applyTime").html()!=null){
    $(".hl_buy_side_main .hl_buy_side_main_list #hly_set_applyTime").html($(this).find(".hly_applyTime").html());
    $("#hly_set_applyTime").val($(this).find(".hly_applyTime").attr("value"));
    $("#hly_set_applyType").val($(this).find(".hly_applyType").html());
    }
    });

    //点击展开可用区
    $(".hl_pz_select_usablePlace .hl_pz_select_span_usep").click(function(){
    if($(this).parent().find("ul").hasClass("hide")){
    $(this).parent().find("ul").removeClass("hide");
    $(this).find(".hl_pz_select_span_arrow").addClass("iup");
    $(this).find(".hl_pz_select_span_arrow").removeClass("idown");
    }else{
    $(this).parent().find("ul").addClass("hide");
    $(this).find(".hl_pz_select_span_arrow").addClass("idown");
    $(this).find(".hl_pz_select_span_arrow").removeClass("iup");
    }
    });

    //可用区选择
    $(".hl_pz_select_usablePlace .hl_pz_select_usepDetail").click(function(){
    $(this).parent().addClass("hide");
    $(this).parent().parent().find(".hl_pz_select_span_arrow").addClass("idown");
    $(this).parent().parent().find(".hl_pz_select_span_arrow").removeClass("iup");
    $(this).parent().parent().find(".hl_pz_select_choice").html($(this).html());
    $(this).parent().parent().find(".hl_pz_select_choice").css("color","#fff");
    $(this).parent().parent().find(".hl_pz_select_span_usep").css("background","#43bfe3");
    });

    //点击展开公共镜像操作系统
    $(".hl_pz_select_czxt .hl_pz_select_span").click(function(){
    if($(this).parent().find("ul").hasClass("hide")){
    $(this).parent().find("ul").removeClass("hide");
    $(this).find(".hl_pz_select_span_arrow").addClass("iup");
    $(this).find(".hl_pz_select_span_arrow").removeClass("idown");
    }else{
    $(this).parent().find("ul").addClass("hide");
    $(this).find(".hl_pz_select_span_arrow").addClass("idown");
    $(this).find(".hl_pz_select_span_arrow").removeClass("iup");
    }
    });

    //点击展开公共镜像操作系统版本
    $(".hl_pz_select_bb .hl_pz_select_span").click(function(){
    if($("#osType").val()!=""){
    if($(this).parent().find("ul").hasClass("hide")){
    $(this).parent().find("ul").removeClass("hide");
    $(this).find(".hl_pz_select_span_arrow").addClass("iup");
    $(this).find(".hl_pz_select_span_arrow").removeClass("idown");
    }else{
    $(this).parent().find("ul").addClass("hide");
    $(this).find(".hl_pz_select_span_arrow").addClass("idown");
    $(this).find(".hl_pz_select_span_arrow").removeClass("iup");
    }
    }
    });

    //公共镜像选择操作系统
    $(".hl_pz_select_czxt .hl_pz_select_osdetail").click(function(){
    $(this).parent().addClass("hide");
    $(this).parent().parent().find(".hl_pz_select_span_arrow").addClass("idown");
    $(this).parent().parent().find(".hl_pz_select_span_arrow").removeClass("iup");

    $(this).parent().parent().find(".hl_pz_select_span_xz").html($(this).html());
    $(this).parent().parent().find(".hl_pz_select_span_xz").css("color","#fff");
    $(this).parent().parent().find(".hl_pz_select_span_arrow").removeClass("btc9");

    $(this).parent().parent().find(".hl_pz_select_span").css("background","#43bfe3");
    $(this).parent().parent().parent().find(".hl_pz_select_bb").find(".hl_pz_select_span_arrow").removeClass("hide");
    $(this).parent().parent().parent().find(".hl_pz_select_bb").find(".hl_pz_select_span").css("cursor","pointer");

    var osType = $("#osType").val();
    $("#osType").val($(this).find("#hl_pz_select_os_Type").html());
    if(osType!=$("#osType").val()){
    $(this).parent().parent().parent().find(".hl_pz_select_bb").find(".hl_pz_select_span_xz").html("选择版本");
    $(this).parent().parent().parent().find(".hl_pz_select_bb").find(".hl_pz_select_span_xz").css("color","");
    $(this).parent().parent().parent().find(".hl_pz_select_bb").find(".hl_pz_select_span_arrow").addClass("btc9");
    $(this).parent().parent().parent().find(".hl_pz_select_bb").find(".hl_pz_select_span").css("background-color","#e8e8e8");
    $(".hl_buy_side_main .hl_buy_side_main_list #hly_os").html("-");
    $("#osVersion").val("");
    $("#hly_set_os").val("");
    }

    var regType=$("#regType").val();
    });

    //加算法
    $(".hl_number_up").click(function(event){
    var number = parseInt($(this).parent().parent().find(".hl_buy_main_base_input").val());
    $(this).parent().parent().find(".hl_buy_main_base_input").val(number+1);
    $(this).parent().find(".hl_number_down").removeClass("hide");
    $(this).parent().find(".hl_number_down1").addClass("hide");
    if($(this).parent().parent().find("#hly_band").val()!=undefined){
    $("#hly_band").focus();
    $("#hly_band").blur();
    }
    if($(this).parent().parent().find("#hly_number").val()!=undefined){
    $(".hl_buy_side_main .hl_buy_side_main_list #hly_set_number").html(number+1);
    }
    });

    //减算法
    $(".hl_number_down").click(function(event){
    var number = parseInt($(this).parent().parent().find(".hl_buy_main_base_input").val());
    if(number>1){
    $(this).parent().parent().find(".hl_buy_main_base_input").val(number-1);
    if($(this).parent().parent().find("#hly_number").val()=="1"||$(this).parent().parent().find("#hly_band").val()=="1"){
    $(this).parent().find(".hl_number_down").addClass("hide");
    $(this).parent().find(".hl_number_down1").removeClass("hide");
    }
    if($(this).parent().parent().find("#hly_band").val()!=undefined){
    $("#hly_band").focus();
    $("#hly_band").blur();
    }
    if($(this).parent().parent().find("#hly_number").val()!=undefined){
    $(".hl_buy_side_main .hl_buy_side_main_list #hly_set_number").html(number-1);
    }
    }
    });

    //台数
    $("#hly_number").blur(function(){
    if($(this).val()==""||$(this).val()<1){
    $(this).val(1);
    }
    });

    //数据盘
    $(".hl_cdisk_input").blur(function(){
    var maxSize=$("#dataDisk").val();
    var val=parseInt($(this).val())
    if(isNaN(val) || val<10){
    $(this).val(10);
    }else if(parseInt(val)>parseInt(maxSize)){
    $(this).val(maxSize);
    }
    $("#hly_set_cdisk").css("border","")
    $(".hl_buy_side_main .hl_buy_side_main_list #hly_cdisk").html($(this).val()+"GB");
    });

    //密码设置
    $(".hl_setpassword").click(function(event){
    $(".hl_loginpass").css("display","block");
    $(".hl_confirmpass").css("display","block");
    $(".hl_instances").css("display","block");
    });
    $(".hl_setpassword_disable").click(function(event){
    $(".hl_loginpass").css("display","none");
    $(".hl_confirmpass").css("display","none");
    $(".hl_instances").css("display","none");
    });

    //浮动框设置
    document.body.scrollTop=0;
    var side_top=parseInt($(".hl_buy_side").offset().top);
    $(document).scroll(function(event){
    var body_top=parseInt(document.body.scrollTop);
    if(side_top>=body_top){
    $(".hl_buy_side").css("top",side_top-body_top);
    $(".hl_buy_side").removeClass("add_buy_side");
    }else{
    $(".hl_buy_side").css("top","0");
    $(".hl_buy_side").addClass("add_buy_side");
    }
    });

    //TheNewJsp的隐藏
    $(".item_closeOne").click(function(){
    $(".orderBar").css("display","none");
    });
    //TheNewJsp的显示
    $(".hl_buy_detail").click(function(){
    $(".orderBar").css("display","");
    });
    $(".hl_buy_side_name1").click(function(){
    $(".orderBar").css("display","");
    });
    $(".hl_all_buy").click(function(){
    document.cart.submit();
    });
    $("#hly_loginPass").blur(function(){
    checkPass($(this).val());
    if($("#hly_confirmPass").val()!=""){
    checkConfirm($("#hly_confirmPass").val());
    }
    });
    $("#hly_confirmPass").blur(function(){
    checkConfirm($("#hly_confirmPass").val());
    });

    //立即购买
    $(".hl_buy_side_button_buynow").click(function(){
    var regionId = $("#hly_set_regionId").val();
    var cpu = $("#hly_set_cpu").val();
    var memory = $("#hly_set_memory").val();
    var band = $("#hly_band").val();
    var os = $("#hly_set_os").val();
    var dataDisk = $("#hly_set_dataDisk").val();
    var year = $("#hly_set_applyTime").val();
    var count = $("#hly_number").val();
    var loginPass = $("#hly_loginPass").val();
    var confirmPass = $("#hly_confirmPass").val();
    var loginName = $("#hly_loginName").val();
    if(checkForm(regionId,cpu,memory,band,os,dataDisk,year,count,loginPass,confirmPass,loginName)){
    document.F1.submit();
    }
    });



    //计算价格

    $(".mbClose").click(function(){
    $(".hl_buy_side_button_shopping").removeAttr("disabled")
    $(".hl_buy_side_button_shopping").css('cursor',"pointer");
    $(".hl_buy_side_shoppingbox").hide();
    });

    $(".hl_buy_side_button_goshopping").click(function(){
    $(".hl_buy_side_button_shopping").removeAttr("disabled")
    $(".hl_buy_side_button_shopping").css('cursor',"pointer");
    $(".hl_buy_side_shoppingbox").hide();
    });

    $(".hl_buy_side_button_gojiesuan").click(function(){
    window.location.href="user_cart_orderPre";
    });
    });

function checkPass(pass){
    var cat = /(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])/;
    var cat2=/[^\w\s]+/;
    if(pass.length>5&&pass.length<17&&cat.test(pass)&&!cat2.test(pass)){
    $("#hly_loginPass").css("border","");
    $("#passSpan").css("color","#9c9c9c");
    return true;
    }else{
    passNo();
    return false;
    }
    return false;
    }
function passNo(){
    $("#hly_loginPass").css("border","1px solid #FF8884");
    $("#passSpan").css("color","#f00");
    $("html,body").animate({scrollTop:$("#hly_loginPass").offset().top}, 500);
    }
function checkConfirm(conPass){
    if(conPass!==$("#hly_loginPass").val()){
    confirmNo();
    return false;
    }else{
    $("#hly_confirmPass").css("border","");
    $("#confirmSpan").html("");
    $("#confirmSpan").css("color","#9c9c9c");
    return true;
    }
    return false;
    }
function confirmNo(){
    $("#hly_confirmPass").css("border","1px solid #FF8884");
    $("#confirmSpan").html("密码不一致");
    $("#confirmSpan").css("color","#f00");
    $("html,body").animate({scrollTop:$("#hly_confirmPass").offset().top}, 500);
    }





function chooseOsVersion(bb){
    $(bb).parent().addClass("hide");
    $(bb).parent().parent().find(".hl_pz_select_span_arrow").addClass("idown");
    $(bb).parent().parent().find(".hl_pz_select_span_arrow").removeClass("iup");

    $(bb).parent().parent().find(".hl_pz_select_span_xz").html($(bb).html());
    $(bb).parent().parent().find(".hl_pz_select_span_xz").css("color","#fff");
    $(bb).parent().parent().find(".hl_pz_select_span_arrow").removeClass("btc9");
    $(".hl_pz_select_czxt .hl_pz_select_osdetail").parent().parent().find(".hl_pz_select_span").css("background","#43bfe3");
    $(bb).parent().parent().find(".hl_pz_select_span").css("background","#43bfe3");
    $(bb).parent().parent().parent().find(".hl_pz_select_bb").find(".hl_pz_select_span_arrow").removeClass("hide");
    $(".hl_buy_side_main .hl_buy_side_main_list #hly_os").html($(bb).find("#OS_Version").html());
    $("#osVersion").val($(bb).find("#OS_Version").html());
    $("#hly_set_imageId").val(($(bb).find("font").html()));
    }

//表单验证
function checkForm(regionId,cpu,memory,band,imageId,cdisk,applyTime,count,pass,confirmPass,loginName){
    if(regionId==""){
    return false;
    }
    if(cpu==""||isNaN(cpu)){
    return false;
    }
    if(memory==""||isNaN(memory)){
    return false;
    }
    if(band==""||isNaN(band)){
    return false;
    }
    if(imageId==""){
    $(".hl_pz_select_span").css("background","#FF8884");
    $(".hl_pz_select_span_xz").css("color","#fff");
    $(".hl_pz_select_span_arrow").removeClass("btc9");
    $("html,body").animate({scrollTop:$(".hl_pz_select_span").offset().top-100}, 500);
    return false;
    }
    if(cdisk==""){
    $("#hly_set_dataDisk").css("border","1px solid #FF8884");
    $("html,body").animate({scrollTop:$(".hl_cdisk_storage").offset().top-100}, 500);
    return false;
    }
    if(applyTime==""||isNaN(applyTime)){
    return false;
    }
    if(count==""||isNaN(count)){
    return false;
    }
    if($(".hl_loginpass").css("display")=="block"){
    if(checkPass(pass)==false){
    return false;
    }
    if(checkConfirm(confirmPass)==false){
    return false;
    }
    if(loginName==""){
    $("#hly_loginName").css("border","1px solid #FF8884");
    $("html,body").animate({scrollTop:$("#hly_loginName").offset().top}, 500);
    return false;
    }
    }
    return true;
    }



$(function(){
    $(".hl_cartlist_buy").click(function(){
        document.cart.submit();
    });
    });




function getPoint(obj){
    var l = obj.offsetLeft;
    while (obj = obj.offsetParent) {
    l += obj.offsetLeft;
    }
    return l;
    }
function MoveableControBar(id,initOffset,mousedownHandel,clickHandel)
{
    this._parent = document.getElementById(id);
    this._self   = document.getElementById(id+'_item');
    this._left   = document.getElementById(id+'_left');
    this._for    = this._parent.getAttribute('for');
    this.moveAble =  this._parent.clientWidth - this._self.clientWidth;
    this.initOffset = initOffset;
    this.mousedownHandel = mousedownHandel||null;
    this.clickHandel = clickHandel||null;
    this.running = false;
    this.obj = this;
    this.init();
    }
ControBar('hl_buy_main_box_band',100,1);
function ControBar(id,initOffset,num)
{
    MoveableControBar.prototype =
    {
        init:function(){
            var moveAble =  this.moveAble;
            var moveInit =  this.moveInit;
            var _parent  =  this._parent;
            var _self    =  this._self;
            var _left    =  this._left;
            var _for     =  this._for;
            var obj      =  this.obj;
            this._parent.onclick = function(e){
                //clientX 事件属性|返回|当事件被触发时|鼠标指针相对于浏览器页面（或当前窗口）的水平坐标。
                var eX = (e||event).clientX;
                var shouldPosition =  eX - getPoint(_parent);
                if(shouldPosition>moveAble){
                    shouldPosition = moveAble;
                }else if(shouldPosition>moveAble||shouldPosition<0){
                    shouldPosition = 0;
                }

                _self.style.left = shouldPosition +'px';
                _left.style.width = shouldPosition +'px';
                if(obj.clickHandel)obj.clickHandel.call(obj,{
                    parent:_parent,
                    self:_self,
                    left:_left,
                    _for:_for,
                    nowPosition:shouldPosition,
                    moveAble:moveAble
                });
            }
            this._self.onmousedown = function(eOut){
                this.running = true;
                moveInit = _self.offsetLeft;
                var initX = (eOut||event).clientX;
                document.onmousemove = function(eIn){
                    var nowX = (eIn||event).clientX;
                    var shouldPosition =  moveInit +nowX - initX;
                    if(shouldPosition>moveAble){
                        shouldPosition = moveAble;
                    }else if(shouldPosition>moveAble||shouldPosition<0){
                        shouldPosition = 0;
                    }
                    _self.style.left = shouldPosition +'px';
                    _left.style.width = shouldPosition +'px';
                    if(obj.mousedownHandel)obj.mousedownHandel.call(obj,{
                        parent:_parent,
                        self:_self,
                        _for:_for,
                        left:_left,
                        nowPosition:shouldPosition,
                        moveAble:moveAble
                    });
                    if(id=="hl_buy_main_box_band"){
                        $("#hly_band").focus();
                    }
                }
                document.onmouseup = function(){
                    this.running = true;
                    document.onmousemove = null;
                    document.onmouseup = null;
                    $("#hly_band").blur();
                }
            }
            document.getElementById(_for).onblur = function(){
                //输入框失焦的时候，活动条的变化
                if(id=="hl_buy_main_box_band"){
                    if(this.value<=1){
                        this.value = 1;
                        if(this.parentNode.getElementsByClassName("hl_number_down")[0].className=="hl_number_down"){
                            this.parentNode.getElementsByClassName("hl_number_down")[0].className += " hide";
                        }
                        //this.parentNode.getElementsByClassName("hl_number_down1")[0].className = this.parentNode.getElementsByClassName("hl_number_down1")[0].className.replace(/ hide/,"");
                    }else{
                        this.parentNode.getElementsByClassName("hl_number_down")[0].className = this.parentNode.getElementsByClassName("hl_number_down")[0].className.replace(/ hide/,"");
                        //if(this.parentNode.getElementsByClassName("hl_number_down1")[0].className=="hl_number_down hl_number_down1"){
                        //	this.parentNode.getElementsByClassName("hl_number_down1")[0].className += " hide";
                        //}
                    }
                    if(this.value<50){
                        initOffset = 100;
                        _self.style.left=parseInt(this.value)/initOffset/num*moveAble+"px";
                        _left.style.width = parseInt(this.value)/initOffset/num*moveAble+"px";
                    }else if(this.value>=50&&this.value<=100){
                        initOffset = 200;
                        _self.style.left=parseInt(this.value)/initOffset/num*moveAble+103+"px";
                        _left.style.width = parseInt(this.value)/initOffset/num*moveAble+103+"px";
                    }else if(this.value>100&&this.value<=200){
                        initOffset = 400;
                        _self.style.left=parseInt(this.value)/initOffset/num*moveAble+206+"px";
                        _left.style.width = parseInt(this.value)/initOffset/num*moveAble+206+"px";
                    }else{
                        this.value = 200;
                        _self.style.left="412px";
                        _left.style.width ="412px";
                    }
                    document.getElementById("hly_set_band").innerHTML = this.value;
                }
            }
        }
    }
    new MoveableControBar(id,initOffset,function(option){
    //滑动活动条的时候
    if(id=="hl_buy_main_box_band"){
    var inputHandel = document.getElementById(option['_for']);
    if(parseInt(option['nowPosition']/option['moveAble']*initOffset)*num/initOffset<0.5){
    initOffset = 100;
    inputHandel.value = parseInt(option['nowPosition']/option['moveAble']*initOffset)*num;
    }
    else if(parseInt(option['nowPosition']/option['moveAble']*initOffset)*num/initOffset>=0.5&&parseInt(option['nowPosition']/option['moveAble']*initOffset)*num/initOffset<=0.75){
    initOffset = 200;
    inputHandel.value = parseInt(option['nowPosition']/option['moveAble']*initOffset)*num-50;
    }
    else if(parseInt(option['nowPosition']/option['moveAble']*initOffset)*num/initOffset>.075){
    initOffset = 400;
    inputHandel.value = parseInt(option['nowPosition']/option['moveAble']*initOffset)*num-200;
    }
    if(inputHandel.value>1){
    inputHandel.parentNode.getElementsByClassName("hl_number_down")[0].className = inputHandel.parentNode.getElementsByClassName("hl_number_down")[0].className.replace(/ hide/,"");
    //if(inputHandel.parentNode.getElementsByClassName("hl_number_down1")[0].className=="hl_number_down hl_number_down1"){
    //	inputHandel.parentNode.getElementsByClassName("hl_number_down1")[0].className += " hide";
    //}
    }else{
    inputHandel.value=1;
    if(inputHandel.parentNode.getElementsByClassName("hl_number_down")[0].className=="hl_number_down"){
    inputHandel.parentNode.getElementsByClassName("hl_number_down")[0].className += " hide";
    }
    //inputHandel.parentNode.getElementsByClassName("hl_number_down1")[0].className = inputHandel.parentNode.getElementsByClassName("hl_number_down1")[0].className.replace(/ hide/,"");
    }
    document.getElementById("hly_set_band").innerHTML = inputHandel.value;
    }
    },function(option){
    //点击活动条的时候
    if(id=="hl_buy_main_box_band"){
    var inputHandel = document.getElementById(option['_for']);
    if(parseInt(option['nowPosition']/option['moveAble']*initOffset)*num/initOffset<0.5){
    initOffset = 100;
    inputHandel.value = parseInt(option['nowPosition']/option['moveAble']*initOffset)*num;
    }
    else if(parseInt(option['nowPosition']/option['moveAble']*initOffset)*num/initOffset>=0.5&&parseInt(option['nowPosition']/option['moveAble']*initOffset)*num/initOffset<=0.75){
    initOffset = 200;
    inputHandel.value = parseInt(option['nowPosition']/option['moveAble']*initOffset)*num-50;
    }
    else if(parseInt(option['nowPosition']/option['moveAble']*initOffset)*num/initOffset>.075){
    initOffset = 400;
    inputHandel.value = parseInt(option['nowPosition']/option['moveAble']*initOffset)*num-200;
    }
    if(inputHandel.value>1){
    inputHandel.parentNode.getElementsByClassName("hl_number_down")[0].className = inputHandel.parentNode.getElementsByClassName("hl_number_down")[0].className.replace(/ hide/,"");
    //if(inputHandel.parentNode.getElementsByClassName("hl_number_down1")[0].className=="hl_number_down hl_number_down1"){
    //	inputHandel.parentNode.getElementsByClassName("hl_number_down1")[0].className += " hide";
    //}
    }else{
    inputHandel.value=1;
    if(inputHandel.parentNode.getElementsByClassName("hl_number_down")[0].className=="hl_number_down"){
    inputHandel.parentNode.getElementsByClassName("hl_number_down")[0].className += " hide";
    }
    inputHandel.parentNode.getElementsByClassName("hl_number_down1")[0].className = inputHandel.parentNode.getElementsByClassName("hl_number_down1")[0].className.replace(/ hide/,"");
    }
    document.getElementById("hly_set_band").innerHTML = inputHandel.value;
    }
    });
    }

