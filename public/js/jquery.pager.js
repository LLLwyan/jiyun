/*
* jQuery pager plugin
* Version 1.0 (12/22/2008)
* @requires jQuery v1.2.6 or later
*
* Example at: http://jonpauldavies.github.com/JQuery/Pager/PagerDemo.html
*
* Copyright (c) 2008-2009 Jon Paul Davies
* Dual licensed under the MIT and GPL licenses:
* http://www.opensource.org/licenses/mit-license.php
* http://www.gnu.org/licenses/gpl.html
* 
* Read the related blog post and contact the author at http://www.j-dee.com/2008/12/22/jquery-pager-plugin/
*
* This version is far from perfect and doesn't manage it's own state, therefore contributions are more than welcome!
*
* Usage: .pager({ pagenumber: 1, pagecount: 15, buttonClickCallback: PagerClickTest });
*
* Where pagenumber is the visible page number
*       pagecount is the total number of pages to display
*       buttonClickCallback is the method to fire when a pager button is clicked.
*
* buttonClickCallback signiture is PagerClickTest = function(pageclickednumber) 
* Where pageclickednumber is the number of the page clicked in the control.
*
* The included Pager.CSS file is a dependancy but can obviously tweaked to your wishes
* Tested in IE6 IE7 Firefox & Safari. Any browser strangeness, please report.
*/
(function($) {
    $.fn.pager = function(options) {
        var opts = $.extend({}, $.fn.pager.defaults, options);
		
        return this.each(function() {
        // empty out the destination element and then render out the pager with the supplied options
            $(this).empty().append(renderpager(parseInt(options.totalcounts),parseInt(options.pagesize),parseInt(options.pagenumber), parseInt(options.pagecount), options.buttonClickCallback));
            
            // specify correct cursor activity
            $('.pages li').mouseover(function() { document.body.style.cursor = "pointer"; }).mouseout(function() { document.body.style.cursor = "auto"; });
        });
    };    
   
    // render and return the pager with the supplied options
    function renderpager(totalcounts,pagesize,pagenumber, pagecount, buttonClickCallback) {       	
        if (totalcounts==0){
			return false; 	
		}
    	var ispgEmpty = ""; //如果只有一页，就不展示分页菜单,只居中展示共多少条记录	
    	if(pagecount <= 1 || totalcounts == 0){    		
    		ispgEmpty = "style='margin:0 auto;'";
    	} else if(pagecount ==2 ){    		
    		ispgEmpty = "style='margin:0 auto;'";
    	}else{
    		ispgEmpty = "";
    	}
    	// setup $pager to hold render 
        //var $pager = $("<ul class='pages "+ispgEmpty+"'></ul>");
        //var $pgHeader = $("<p class='pgHeader'><span class="+ispgEmpty+">转到</span></p>");  
    	var $pager = $("<ul class='pages' "+ispgEmpty+"></ul>");
        var $pgHeader = $("<p class='pgHeader'><span>转到</span></p>");
        // add in the previous and next buttons
        $pager.append(renderButton('《', totalcounts,pagesize,pagenumber, pagecount, buttonClickCallback)).append(renderButton('上一页', totalcounts,pagesize,pagenumber, pagecount, buttonClickCallback));
        // pager currently only handles 10 viewable pages ( could be easily parameterized, maybe in next version ) so handle edge cases
        var startPoint = 1;
        var endPoint = 5;
        if (pagenumber > 2) {
            startPoint = pagenumber - 2;
            endPoint = pagenumber + 2;
        }
        if (endPoint > pagecount) {
            startPoint = pagecount - 4;
            endPoint = pagecount;
        }
        if (startPoint < 1) {
            startPoint = 1;
        }
        // loop thru visible pages and render buttons
        for (var page = startPoint; page <= endPoint; page++) {
            var currentButton = $('<li class="page-number">' + (page) + '</li>');
            page == pagenumber ? currentButton.addClass('pgCurrent') : currentButton.click(function() { buttonClickCallback(this.firstChild.data); });
            currentButton.appendTo($pager);
        }
        // render in the next and last buttons before returning the whole rendered control back.
        $pager.append(renderButton('下一页', totalcounts,pagesize,pagenumber, pagecount, buttonClickCallback)).append(renderButton('》', totalcounts,pagesize,pagenumber, pagecount, buttonClickCallback));
        if($("#pagesize").val()==null){    	  
    	    $pgHeader.append( renderGotoPagenum(pagenumber,ispgEmpty,totalcounts,pagesize,pagenumber, pagecount, buttonClickCallback))  	            
                     .append("<span class="+ispgEmpty+">页</span><span class="+ispgEmpty+">&nbsp;/&nbsp;共&nbsp;"+pagecount +"&nbsp;页&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;每页显示&nbsp;</span>")            
                     .append("<font class="+ispgEmpty+">"+pagesize+"</font><span class="+ispgEmpty+">条</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;共&nbsp;<font class=\"pagerdis\">"+totalcounts+"</font>&nbsp;条");
        }else{    	 
  	        $pgHeader.append( renderGotoPagenum(pagenumber,ispgEmpty,totalcounts,pagesize,pagenumber, pagecount, buttonClickCallback))  	            
  	                 .append("<span class="+ispgEmpty+">页</span><span class="+ispgEmpty+">&nbsp;/&nbsp;共&nbsp;"+pagecount +"&nbsp;页&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;每页显示&nbsp;</span>")
  	                 .append(renderSelectCount( totalcounts,ispgEmpty ))
  	                 .append("</font><span class="+ispgEmpty+">条</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;共&nbsp;<font class=\"dis\">"+totalcounts+"</font>&nbsp;条");
        }        
        return $pager.append($pgHeader);    
		    
    }

    // renders and returns a 'specialized' button, ie 'next', 'previous' etc. rather than a page number button
    function renderButton(buttonLabel, totalcounts,pagesize,pagenumber, pagecount, buttonClickCallback) {
        var $Button = $('<li class="pgNext">' + buttonLabel + '</li>');
        var destPage = 1;
        // work out destination page for required button type
        switch (buttonLabel) {
            case "《":
                destPage = 1;
                break;
            case "上一页":
                destPage = pagenumber - 1;
                break;
            case "下一页":
                destPage = pagenumber + 1;
                break;
            case "》":
                destPage = pagecount;
                break;
        }
        // disable and 'grey' out buttons if not needed.
        if (buttonLabel == "《" || buttonLabel == "上一页") {
            pagenumber <= 1 ? $Button.addClass('pgEmpty') : $Button.click(function() { buttonClickCallback(destPage); });
        }
        else {
            pagenumber >= pagecount ? $Button.addClass('pgEmpty') : $Button.click(function() { buttonClickCallback(destPage); });
        }

        return $Button;
    }
    
    //根据输入的input的值，转到某个页面
    function renderGotoPagenum(gopagenumber, ispgEmpty, totalcounts, pagesize, pagenumber, pagecount, buttonClickCallback) {    	
    	var $Input = $("<input id='gopagenum' type='text' value='"+gopagenumber+"' class='"+ispgEmpty+"'>");     	
    	$Input.change(function() { 
        	 var gonum=$('#gopagenum').val();
        	 var num_reg = /^[0-9]*$/; //必须为数字        	 
        	 
        	 if(gonum!="" & num_reg.test(gonum)){ 
        		 gopagenumber = gonum; 
        	 }else{
        		 $('#gopagenum').css({"color":"#555","font-size":"11px"});
        		 $('#gopagenum').val("输入数字");
        		 return false;
        	 }   	 
             if(gonum <= 1){ 
            	 gopagenumber = 1; 
             }else if(gonum >= pagecount){ 
            	 gopagenumber = pagecount; 
             }else{
            	 gopagenumber = gonum; 
             } 
        	buttonClickCallback(gopagenumber);         	
        }); 
    	$Input.focus(function() { $('#gopagenum').val(""); $('#gopagenum').css("color","#f03800"); });  
        return $Input;
    }
    
    //初始化select的值:每页显示该值的数目列表内容
    function renderSelectCount(totalcounts, ispgEmpty) {  
    	var $Select = $('<select id=\"selectcount\" class="'+ispgEmpty+'"></select>');     	
    	$Select.empty();
    	//添加下拉框的option    	
    	var options = "";
    	var size = $("#defaultsize").val();
    	var pagesize=size;
    	var selectval = $("#pagesize").val();    	
    	for(var i=2; i<=8; i++) {  
    		if(selectval==pagesize){ 
    			options += "<option value="+pagesize+" selected>"+pagesize+"</option>";
    		}else{
    		    options += "<option value="+pagesize+">"+pagesize+"</option>";
    		}  
    		if( totalcounts < pagesize ){ //如果列表总数小于下拉列表值，其他的option则不显示
    			pagesize=totalcounts; 
    			break; 
    		}else{
    			pagesize=size*(i+1); //这里控制下拉列表的值的大小
    		}
    	}    	
    	$Select.append(options); 
    	
    	//改变下拉列表的值
    	$Select.change(function() {     		
		   selectval = $Select.find("option:selected").val();
		   $("#pagesize").val(selectval);
		   
		   //控制跳转的页是否存在
		   var pagenum = $('#gopagenum').val();
		   if( totalcounts%selectval == 0 ){
			   pagenum = totalcounts/selectval;
		   }else{
			   pagenum = parseInt(totalcounts/selectval)+1;
		   }		   
		   if( $('#pagenumber').val() > pagenum ){
			   $('#pagenumber').val(pagenum);	
		   }		  	   
		   
		   init();
	    });
        return $Select;
    } 

    // pager defaults. hardly worth bothering with in this case but used as placeholder for expansion in the next version
    $.fn.pager.defaults = {
    	totalcounts:1,
    	pagesize:1,
        pagenumber: 1,
        pagecount: 1
    };

})(jQuery);




