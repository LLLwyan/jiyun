var setrolefnid= request("setrolefnid");

//查询系统功能
queryfuns();

function queryfuns(){
	var service = {};
	var fn="queryfuns";
	service = Commonjs.jsonToString(service);
	var params = Commonjs.getParams(fn,service);//获取参数
	Commonjs.ajaxTrue(sysurl,params,queryfunsSuccess);
}

function queryfunsSuccess(data){
	if(data.data == null){
		return false;
	}
	$("#funcn").empty();
	var functitle="";
	if (data.data.length>0){
		BaseForeach(data.data,function(i,item){
			if(item.parentId=="1"){
				functitle+='<tr>';
				functitle+='<th colspan="2" class="center">'+item.caption+'&nbsp;&nbsp;<input type="checkbox" onClick="checkall(this);" value="'+item.funId+'" id="checkid" ></th>';
				functitle+='</tr>';
				BaseForeach(data.data,function(k,praitem){
					if(praitem.parentId=="2" && praitem.funId.substring(0,1)==item.funId){
						var list="";
						BaseForeach(praitem.funcs,function(j,func){
							 list+='<input type="checkbox" value="'+func.id+'" id="'+func.id+'" name="'+item.funId+'_chek" />'+func.title+'&nbsp;&nbsp;';
						});
						functitle+='<tr>';
						functitle+='<td class="center">'+praitem.caption+'</td>';
						functitle+='<td >'+list+'</td>';
						functitle+='</tr>';
					}
				});
			}
		});
		$("#funcn").append(functitle);	
		queryrolefunc(setrolefnid);
	}
}

function checkall(obj){
	if(obj.checked){ 
        $("input[name='"+$(obj).val()+"_chek']").prop('checked', true)
    }else{ 
        $("input[name='"+$(obj).val()+"_chek']").prop('checked', false)
    } 
}

//获取角色权限并设置选中
function queryrolefunc(id){
	var service = {};
	service.id = id;
	var fn="queryrole";
	service = Commonjs.jsonToString(service)
	var params = Commonjs.getParams(fn,service);//获取参数
	Commonjs.ajaxTrue(sysurl,params,queryfuncSuccess,false);
};

function queryfuncSuccess(data){
	var func=data.data[0].funcs
	if (func.length>0){
		BaseForeach(func,function(i,item){
			$('#'+item.id).prop('checked', true)
		});
	}
}

function  setrolefn(setrolefnid){
	var func="";
	$("input:checkbox").each(function(){
		if($(this).attr("id")!="checkid"){
			if(this.checked){ 
			func+=$(this).val()+",";
			}
		}
	});
	
	if(func.length<=0){
		$.tooltip("请至少选择一项！",2000,false);
		return false
	}			
	func = func.substr(0,func.length-1);//除去最后一个"，"	
	var service = {};
	var roleid = setrolefnid;
	service.id = parseInt(roleid);
	service.funs = func;
	var fn="setrolefn";
	service = Commonjs.jsonToString(service);
	var params = Commonjs.getParams(fn,service);//获取参数
	Commonjs.ajaxTrue(sysurl,params,setrolefnSuccess,false);
}

function setrolefnSuccess(data){
	$.tooltip(data.msg,2000,true);
}

function turnback(){
	window.location.href="role.html";
}