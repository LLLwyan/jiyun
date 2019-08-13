$(function(){
	queryUserSnapshot();
});

function queryUserSnapshot(){
	var index = $("#pagenumber").val();
	var service = {};
	service.page = index;
	service.pageSize = 10;
	var fn="queryAdminSnapshotList";
	service = Commonjs.jsonToString(service)
	var params = Commonjs.getParams(fn,service);//获取参数
	Commonjs.ajaxTrue(weburl,params,querySuccess);
}

function querySuccess(data){
	if(data.data==null)
		return false;
	
	var html='';	
	if (data.data.length>0){
		BaseForeach(data.data,function(i,item){
			html+='<tr>';
			html+='<td><input value="'+item.snapshotId+'" type="checkbox" style="margin-top:5px;" name="chkBox" ></td>';
			html+='<td>'+item.userName+'</td>';
			html+='<td>'+item.snapshotName+'</td>'; 
			html+='<td>'+item.systemName+'</td>'; 
			html+='<td>'+item.diskSize+'G</td>';
			if(item.snapshotType==1)
				html+='<td>系统盘</td>';
			else if(item.snapshotType==2)
				html+='<td>数据盘</td>';	
			else
				html+='<td>未知</td>';	 
			html+='<td>'+item.diskName+'</td>';
			html+='<td>'+item.statusName+'</td>';
			html+='<td>'+jsonDateTimeFormat(item.snapshotTime)+'</td>';
			html+='<td><a onclick="singleDelSnapshot(\''+item.snapshotId+'\')" href="javascript:void(0)" class="btn btn-primary">删除</a></td>';
			html+='</tr>';
		});
		$("#page").show();
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
	}else{
		$("#page").hide();
		html+='<tr><td colspan="11" style="height:50px;text-align:center;line-height:50px;">找不到相关信息</td></tr>';	
	}
	$("#snapshotList").html(html);
}

//单个删除快照
function singleDelSnapshot(snapshotId){
	delSnapshot(snapshotId);
}

//批量删除快照
function batchDelSnapshot(){
	var snapshotIds = "";
	$("input[name='chkBox']:checked").each(function(){
		snapshotIds += $(this).attr("value")+',';;
	});
	if(!snapshotIds){
		$.tooltip("请先勾选要操作的快照",1000,true);
		return;
	}
	snapshotIds = snapshotIds.substring(0,snapshotIds.length-1);
	delSnapshot(snapshotIds);
}

//删除快照
function delSnapshot(snapshotIds){
	art.dialog({
 		id: 'testID',
 	    width: '245px',
 	    height: '109px',
 	    content: '您要删除吗？注意：删除后数据将不能恢复',
 	    lock: true,
 	    button: [{
 	      	name: '确定',
 	       	callback: function () {
 	       	 	var service = {};
				service.snapshotIds = snapshotIds;
				var fn="delSnapshot";
				service = Commonjs.jsonToString(service);
				var params = Commonjs.getParams(fn,service);//获取参数
				Commonjs.ajaxTrue(weburl,params,delSnapshotSuccess,true,"正在执行中");
 	       	}
 	 	},{
 	 		name: '取消'
 	 	}]
 	});
}

function delSnapshotSuccess(data){ 
	$.tooltip(data.msg,2000,true);
	queryUserSnapshot();
}

function checkAllSnapshot(checkall){
	if(checkall.checked){    
		$("input[name='chkBox']").prop("checked",true); 
		$("input[name='checkBoxAll']").prop("checked",true); 
		
	}else{    
		$("input[name='chkBox']").prop("checked",false);	
		$("input[name='checkBoxAll']").prop("checked",false);			
	}
}

//分页	
function Page(totalcounts,pagecount,pager) {
  	$("#"+pager).pager( {
  		totalcounts : totalcounts,
  		pagesize : 10,
  		pagenumber : $("#pagenumber").val(),
  		pagecount : parseInt(totalcounts/pagecount)+(totalcounts%pagecount >0?1:0),
  		buttonClickCallback : function(al) {
  			$("#pagenumber").val(al);
  			queryUserSnapshot("");
  		}
  	});  	
}