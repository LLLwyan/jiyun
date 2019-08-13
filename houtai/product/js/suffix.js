$(function(){
	querDicSuffix();
})

function querDicSuffix(){
	var service = {};
	service.page = $("#pagenumber").val();
	service.pageSize = 30;
	var fn="querDicSuffix";
	service = Commonjs.jsonToString(service)
	var params = Commonjs.getParams(fn,service);//获取参数
	Commonjs.ajaxTrue(weburl,params,querDicSuffixSuccess);
};

function querDicSuffixSuccess(data){
	if(data.data == null){
		return false;
	}
	var suffix="";
	var typetype = "";
	$("#suffix").empty();
	$("#typetype").empty();
	var userId = [];
	var userValue= [];
	if(data.data.getListParamItemByEName.length>0){
		typetype +=' <td class="t"><label for="name" class="control-label"> 域名类型：</label></td>'
		typetype +=' <td align="left"><select  style="width:200px;" class="form-control" id="typetype2">';
		BaseForeach(data.data.getListParamItemByEName,function(i,item3){
			typetype+='<option value='+item3.value+'>'+item3.description+'</option>';
		});
		typetype+='</select></td>';
	}
	if (data.data.getUserDomainByUserName.length>0){
		BaseForeach(data.data.getUserDomainByUserName,function(i,item){
			suffix+=' <tr class="gradeX" ><td>'+(i+1)+'</td>';
			suffix+=' <td cellspacing="1" >'+item.name+'</td>';
			suffix+='<td><input id="remark'+item.id+item.listId+'"  class="manager-input m-input width200" style="width:200px;" value='+item.remark+'></td>'
			if (data.data.getListParamItemByEName.length>0)
			{
				suffix+=' <td align="left"><select  style="width:150px;" class="form-control width200" id="type'+item.id+'">';
				BaseForeach(data.data.getListParamItemByEName,function(i,item2){
					suffix+='<option value='+item2.value+'>'+item2.description+'</option>';
				});
				suffix+='</select></td>';
				BaseForeach(data.data.getListParamItemByEName,function(i,item3){
					//判断value值是否相等  相等赋值给数组
					if(item.type == item3.value){
						userValue.push(item3.value);
					}
					});
			}
			suffix+='<td><input id="heat'+item.id+item.listId+'" class="manager-input m-input width200" style="width:70px;" value='+item.heat+'></td>'
			if(item.common == 1){
				suffix+='<td><input type="radio" name="common'+item.id+item.listId+'" value="1"  checked>是&nbsp;&nbsp;&nbsp;&nbsp;'
				suffix+='<input type="radio" name="common'+item.id+item.listId+'"  value="0">否'
				suffix+='</td>'
			}else{
				suffix+='<td><input type="radio" name="common'+item.id+item.listId+'"  value="1">是&nbsp;&nbsp;&nbsp;&nbsp;'
				suffix+='<input type="radio" name="common'+item.id+item.listId+'" value="0" checked>否'
				suffix+='</td>'
			}	
			suffix+='<td><input id="listId'+item.id+item.listId+'" class="manager-input m-input width200" style="width:70px;" value='+item.listId+'></td>'
			suffix+=' <td>'
			suffix+='<a  href="javascript:void(0);" class="btn btn-primary" onclick="uptDicSuffix(\''+item.name+'\',\''+item.remark+'\',\''+item.heat+'\',\''+item.type+'\',\''+item.common+'\',\''+item.listId+'\',\''+item.id+'\');">修改</a> '
			suffix+='<a  onclick="delDicSuffix(\''+item.id+'\',\''+item.name+'\');" href="javascript:void(0);" class="btn btn-primary ">删除</a> '
			suffix+='</td></tr>';
			//将ID赋值给数组
			userId.push(item.id);
		});
		//域名类型下拉框
		if(data.data.getListParamItemByEName.length>0){
			typetype = "";
			typetype  =' <td class="t"><label for="name" class="control-label"> 域名类型：</label></td>'
			typetype +=' <td align="left"><select  style="width:200px;" class="form-control" id="typetype2">';
			BaseForeach(data.data.getListParamItemByEName,function(i,item3){
				typetype+='<option value='+item3.value+'>'+item3.description+'</option>';
			});
			typetype+='</select></td>';
		}
		if(data.rows!=undefined){
			if(data.rows!=0){
				$("#totalcount").val(data.rows);
			}else{
				if(data.page==0)$("#totalcount").val(0);
			}
		}else{
			$("#totalcount").val(0);
		}
		Page($("#totalcount").val(),data.pagesize,'pager');	
		$("#pages").show();
	}else{
		suffix+=' <tr><td colspan="10" style="height:50px;text-align:center;line-height:50px;">找不到相关信息</td></tr>';	
		$("#pages").hide();
	}
	$('#suffix').append(suffix);
	$('#typetype').append(typetype);
	//for循环数组  将值赋值给下拉框
	for(var i = 0;i<userId.length; i++){
		$("#type"+userId[i]).val(userValue[i]);
	}
}

//更新域名信息
function uptDicSuffix(name,remark,heat,type,common,listId,id){
	if(Commonjs.isEmpty($("#remark"+id+listId).val())){
		$.tooltip('描述不能为空',2000,false); 
		$("#remark"+id+listId).focus();
		return false;
	}
	if(Commonjs.isEmpty($("#heat"+id+listId).val())){
		$.tooltip('活动热度不能为空',2000,false); 
		$("#heat"+id+listId).focus();
		return false;
	}
	if(Commonjs.isEmpty($("#listId"+id+listId).val())){
		$.tooltip('排序不能为空',2000,false); 
		$("#listId"+id+listId).focus();
		return false;
	}
	if(!CndnsValidate.checkNumber($("#listId"+id+listId).val())){
		$.tooltip('排序只能为数字',2000,false); 
		$("#listId"+id+listId).focus();
		return false;
	}
	
	var service = {} 
	service.name = name;
	service.remark = $("#remark"+id+listId).val();
	service.heat = $("#heat"+id+listId).val();
	service.type = $("#type"+id).val();
	service.common=$("input[name='common"+id+listId+"']:checked").val();
	service.listId = $("#listId"+id+listId).val();
	service = Commonjs.jsonToString(service);
	var fn="uptDicSuffix";
	var params = Commonjs.getParams(fn,service);//获取参数
	Commonjs.ajaxTrue(weburl,params,uptSuffixSuccess,false);
}

function uptSuffixSuccess(data){
	$.tooltip(data.msg,2000,true);
	querDicSuffix();
}

//删除域名
function delDicSuffix(id,name){
	var dialog=	art.dialog({
		lock : true,
		opacity : 0.4,
		width : 250,
		title : '提示',
		content : '您确定删除吗？',
		ok : function() {
			var service = {}
			service.name = name;
			service.id = id;
			service = Commonjs.jsonToString(service);
			var fn  = "delDicSuffix";
			var params = Commonjs.getParams(fn,service);//获取参数
			Commonjs.ajaxTrue(weburl,params,delSuffixSuccess,false);
		},
		cancel: function(){
			$('#dialog').hide();
		}
	});
}

function delSuffixSuccess(data){
	$.tooltip(data.msg,2000,true);
	querDicSuffix();
}

//添加域名
function addSuffix(){
	$("#namename").val("");
	$("#remarkremark").val("");
	$("#typetype2").val(1);
	$("#heatheat").val("");
	$("#listIdlistId").val("");
	var contents=$('#addSuffix').get(0);
	var artBox=art.dialog({
		lock: true,
		artIcon:'add',
		opacity:0.4,
		width: 400,
		padding:'0px 0px',
		title:'添加域名后缀',
		header:false,
		content: contents,
		ok: function () {
		var namename = $('#namename');
		if(Commonjs.isEmpty(namename.val())){
			$.tooltip('域名名称不能为空',2000,false); 
			namename.focus();
			return false;
		}
		if(!CndnsValidate.checkDomainSuffix(namename.val())){
			$.tooltip('域名后缀格式不对',2000,false);
			namename.focus();
			return false;
		}
		var heatheat = $('#heatheat');
		if(Commonjs.isEmpty(heatheat.val())){
			$.tooltip('活动热度不能为空',2000,false); 
			heatheat.focus();
			return false;
		}
		var listIdlistId = $('#listIdlistId');
		if(Commonjs.isEmpty(listIdlistId.val())){
			$.tooltip('排序不能为空',2000,false); 
			listIdlistId.focus();
			return false;
		}
		if(!CndnsValidate.checkNumber(listIdlistId.val())){
			$.tooltip('排序只能为数字',2000,false); 
			listIdlistId.focus();
			return false;
		}
		var service = {};
		service.name = $("#namename").val();
		service.remark = $("#remarkremark").val();
		service.type = $("#typetype2").val();
		service.heat = $("#heatheat").val();
		service.common=$("input[name='commonradio']:checked").val();
		service.listId = $("#listIdlistId").val();
		var fn="addDicSuffix";
		service = Commonjs.jsonToString(service);
		var params = Commonjs.getParams(fn,service);//获取参数
		Commonjs.ajaxTrue(weburl,params,addSuffixSuccess,false);
		},cancel: function(){
		$('#addSuffix').hide();
	}
});
}

function addSuffixSuccess(data){
	$.tooltip(data.msg,2000,true);
	querDicSuffix();
}

//分页	
function Page(totalcounts,pagecount,pager) {
  	$("#"+pager).pager( {
  		totalcounts : totalcounts,
  		pagesize : 30,
  		pagenumber : $("#pagenumber").val(),
  		pagecount : parseInt(totalcounts/pagecount)+(totalcounts%pagecount >0?1:0),
  		buttonClickCallback : function(al) {
  			$("#pagenumber").val(al);
  			querDicSuffix();
  		}
  	});  	
}