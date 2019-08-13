//充值记录
$(function(){
	var start = {
		elem: '#start',
		istime: true,
		istoday: false,
	};
	var end = {
			elem: '#end',
			istime: true,
			istoday: false,
	};
	laydate(start);
	laydate(end);
	getAllUserCharge();
})

//查询充值记录
function getAllUserCharge(){
	var service = {};
	service.userName = $("#userName").val();
	service.orderId = $("#d_domkey").val();
	service.startTime = $("#start").val();
	if(service.startTime != '') service.startTime += " 00:00:00";
	service.endDate = $("#end").val();
	if(service.endDate != '') service.endDate += " 23:59:59";
	service.page = 	$("#pagenumber").val();
	service.pageSize = 10;
	var fn="getAllUserCharge";
	service = Commonjs.jsonToString(service)
	var params = Commonjs.getParams(fn,service);//获取参数
	Commonjs.ajaxTrue(weburl,params,getAllChargeSuccess);
}

function getAllChargeSuccess(data){
	if(data.data == null){
		return false;
	}
	if(data.data.getUserCharge.length >0){
	$("#rechargelist").html("");
	var rechglist="";
	if (data.rows!=0){
		BaseForeach(data.data.getUserCharge,function(i,item){
			rechglist+='<tr class="gradeX">';
			rechglist+='<td>'+(i+1)+'</td>';
			rechglist+='<td>'+item.userName+'</td>';
			rechglist+='<td>'+item.orderId+'</td>';
			if(data.data.getListParamItemByEName.length >0){
				var td = '<td></td>';
				BaseForeach(data.data.getListParamItemByEName,function(i,item2){
					if(item2.value==item.bankCode){
                        td = '<td>'+item2.description+'</td>';
					}
				});
				rechglist += td;
			} else {
                rechglist+='<td></td>';
			}
			rechglist+='<td>'+item.amount+'</td>';
			rechglist+='<td>'+jsonDateTimeFormat(item.regTime)+'</td>';
			if(data.data.getListParamItemByStatus.length >0){
                var td = '<td></td>';
				BaseForeach(data.data.getListParamItemByStatus,function(i,item1){
					if(item1.value==item.status){
                        td = '<td>'+item1.description+'</td>';
					}
				});
                rechglist += td;
			}
			rechglist+='<td>'+item.remark+'</td>';
			if(item.status == 'N') rechglist+='<td><a href="rechargeManual.html?orderId='+item.orderId+'" class="btn btn-primary">手工处理</a></td>';
			else rechglist+='<td><input type="button" href="javascript:void(0);" class="btn btn-primary" style="disable:true;background-color: grey;cursor:default;outline:none;border:none" value="手工处理"></td>';
			rechglist+='</td>'
			rechglist+='</tr>'
		});
		$("#rechargelist").append(rechglist);
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
		$("#pager").show();
		Page($("#totalcount").val(),data.pagesize,'pager');
	}else{
		$("#pager").hide();
		$("#rechargelist").html("");
		var userlis=' <tr><td colspan="10" style="height:50px;text-align:center;line-height:50px;">找不到相关信息</td></tr>';
		$("#rechargelist").append(userlis);
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
  			getAllUserCharge();
  		}
  	});
}
