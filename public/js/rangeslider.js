/*	window.onload = function() {
	var oActionBlock = document.getElementById('action-block');
	var oActionBar = document.getElementById('action-bar');
	var oScrollBar = document.getElementById('scroll-bar');
	var oShowAmount = document.getElementById('showAmount').getElementsByTagName('input')[0];
	var length = 550;

	clickSlide(oActionBlock, oActionBar, oScrollBar, 300, length, oShowAmount);
	drag(oActionBlock, oActionBar, 300, length, oShowAmount);
	addScale(60, 300, length, oScrollBar);
	inputBlur(oActionBlock, oActionBar, length, oShowAmount);

}		*/

var sDom = document;

function SlideBar(data){
	var _this = this;
	var oActionBlock = sDom.getElementById(data.actionBlock);
	var oActionBar = sDom.getElementById(data.actionBar);
	var oSlideBar = sDom.getElementById(data.slideBar);
	var barLength = data.barLength;
	var minNumber = 0;
	var interval = data.interval;
	var maxNumber = data.maxNumber;
	var curBandwidth = data.curBandwidth;
    var clickfn = data.clickfn;
    var iSlideBar = data.slideBar;
    var unit = data.unit;
	var oShowArea = null;
	var block = data.block || 1;
	if(data.showArea){
		oShowArea = sDom.getElementById(data.showArea);
	}
	if(data.minNumber){
		minNumber = data.minNumber;
	}

	if(oShowArea){
		_this.addScale(oActionBlock, oActionBar, oSlideBar, interval, minNumber, maxNumber, barLength,curBandwidth, unit,clickfn,oShowArea, block);
		_this.inputBlur(oActionBlock, oActionBar, minNumber, maxNumber, barLength,curBandwidth, unit,clickfn, oShowArea, block);
		_this.clickSlide(oActionBlock, oActionBar, oSlideBar, minNumber, maxNumber, barLength,curBandwidth, unit,clickfn, iSlideBar, oShowArea, block);
		_this.drag(oActionBlock, oActionBar, minNumber, maxNumber, barLength, curBandwidth, unit, clickfn, oShowArea, block);
	}
	else{
		_this.addScale(oActionBlock, oActionBar, oSlideBar, interval, minNumber, maxNumber, barLength,curBandwidth, unit,clickfn, block);
		_this.clickSlide(oActionBlock, oActionBar, oSlideBar, minNumber, maxNumber, barLength,curBandwidth, unit,clickfn, iSlideBar, block);
		_this.drag(oActionBlock, oActionBar, minNumber, maxNumber, barLength,curBandwidth, unit,clickfn, block);
	}

}

SlideBar.prototype = {
	//初始化(添加刻度线)
	addScale : function(ActionBlock, ActionBar, slideBar, interval, minNumber, total, barLength,curBandwidth, unit,clickfn,ShowArea, block){
		// interval代表刻度之间间隔多少, total代表最大刻度
		// slideBar表示在哪个容器添加刻度

		var num = (total - minNumber) / interval; //num为应该有多少个刻度
		if(ActionBlock && ActionBlock.getAttribute("style")!=null) ActionBlock.style.left = "0px";
		if(ActionBar && ActionBar.getAttribute("style")!=null) ActionBar.style.width = "0px";
		var Bandwidth = sDom.getElementById(curBandwidth);
		 if(Bandwidth){
		 	$("#"+curBandwidth).html(minNumber + unit);
		 }
		 if(ShowArea) ShowArea.value = minNumber;
		 var childs = slideBar.childNodes;
		 var len = 5;
		 var userAgent = navigator.userAgent,
         rMsie = /(msie\s|trident.*rv:)([\w.]+)/;
		 var ua = userAgent.toLowerCase();
		 var match = rMsie.exec(ua);
		if(match && (match == 'msie 7.0,msie ,7.0' || match == 'msie 8.0,msie ,8.0')) len = 3;
		for(var j = childs.length - 1; j > len; j--) {
		  slideBar.removeChild(childs[j]);
		}
		for (var i = 0; i < num + 1; i++) {
			var oScale = sDom.createElement('div');
			oScale.style.width = '2px';
			oScale.style.height = '14px';
			oScale.style.position = 'absolute';
			oScale.style.background = '#AFAFAF';
			oScale.style.zIndex = '-10';
			oScale.style.left = (i * interval * barLength) / total + 'px';
			slideBar.appendChild(oScale);
			var oText = sDom.createElement('div');
			oText.style.position = 'absolute';
			oText.style.top = '22px';
			oText.style.height = '16px';
			if(i == 0) oText.innerHTML = minNumber;
			else oText.innerHTML = (i * interval) + minNumber;
			slideBar.appendChild(oText);
			//alert(minNumber);
			if(i == num){
				oText.style.left = (((i * interval * barLength) / (total - minNumber)) - (oText.offsetWidth / 2)-12) + 'px';
			}else{
				oText.style.left = (((i * interval * barLength) / (total - minNumber)) - (oText.offsetWidth / 2)+4) + 'px';
			}
		}
		if(clickfn) clickfn();
	},

	// 监听输入框
	inputBlur : function(actionBlock, actionBar, minNumber, maxNumber, barLength, curBandwidth, unit, clickfn, input, block){
		//actionBlock指滑块,actionBar指显示条,input指显示的输入框
		var _this = this;
		input.onblur = function(){
			var inputVal = this.value;
			if(parseInt(inputVal)>maxNumber){
				inputVal = maxNumber;
				this.value = maxNumber;
			}
			_this.bandwidth(curBandwidth, unit, input);
            if(clickfn) clickfn();
			_this.autoSlide(actionBlock, actionBar, minNumber, maxNumber, barLength, inputVal, block);
		}
	},

	/* 在输入框输入值后自动滑动	*/
	autoSlide : function(actionBlock, actionBar, minNumber, total, barLength, inputVal,curBandwidth, unit, block){
		//inputVal表示输入框中输入的值
		var _this = this;
		var target = ((inputVal- minNumber) / (total- minNumber) * barLength);
		_this.checkAndMove(actionBlock, actionBar, target);
	},

	/*	检查target(确认移动方向)并滑动	*/
	checkAndMove : function(actionBlock, actionBar, target){
		if(target > actionBar.offsetWidth){
			actionBarSpeed = 8;		//actionBar的移动度和方向
		}
		else if(target == actionBar.offsetWidth){
			return;
		}
		else if(target < actionBar.offsetWidth){
			actionBarSpeed = -8;
		}

		var timer = setInterval(function(){
			var actionBarPace = actionBar.offsetWidth + actionBarSpeed;

			if(Math.abs(actionBarPace - target) < 10){
				actionBarPace = target;
				clearInterval(timer);
			}
			actionBar.style.width = parseInt(actionBarPace) + 'px';
			actionBlock.style.left = parseInt(actionBar.offsetWidth - (actionBlock.offsetWidth / 2)) + 'px';
		},30);
	},

	/*	鼠标点击刻度滑动块自动滑动	*/
	clickSlide : function(actionBlock, actionBar, slideBar, minNumber, total, barLength, curBandwidth, unit, clickfn, iSlideBar, showArea, block){
		//console.log(block);
		var _this = this;
		var n=0;//用来设置无限延长的
		slideBar.onclick = function(ev){
			var ev = ev || event;
			//var target = ev.clientX - slideBar.offsetLeft;
			//var target = ev.clientX - $("#scroll-bar").offset().left;iSlideBar
            var target = ev.clientX - $("#"+iSlideBar).offset().left;
			if(target < 0){
				//表示鼠标已经超出那个范围
				target = 0;
			}
			if(target > barLength){
				target = barLength;
			}
			if(n>0){
				return false;
			}
			_this.checkAndMove(actionBlock, actionBar, target);

			n=n+1;
  			setTimeout(function(){n=0},1000);
			if(showArea){
				showArea.value = Math.round(target / barLength * (total-minNumber)+minNumber);
				_this.bandwidth(curBandwidth, unit, showArea);
                if(clickfn) clickfn();
			}
		}

	},

	/*	鼠标按着拖动滑动条	*/
	drag : function(actionBlock, actionBar, minNumber, total, barLength, curBandwidth, unit, clickfn, showArea, block){
		//console.log(block);
		/*	参数分别是点击滑动的那个块,滑动的距离,滑动条的最大数值,显示数值的地方(输入框)	*/
		actionBlock.onmousedown = function(ev) {
			var ev = ev || event;
			var thisBlock = this;
			var disX = ev.clientX;
			var currentLeft = thisBlock.offsetLeft;

			sDom.onmousemove = function(ev) {
				var ev = ev || event;
				var left = ev.clientX - disX;

				if (currentLeft + left <= (barLength - thisBlock.offsetWidth / 2 ) && currentLeft + left >= 0 - thisBlock.offsetWidth / 2) {
					thisBlock.style.left = currentLeft + left + 'px';
					actionBar.style.width = currentLeft + left + (actionBlock.offsetWidth / 2) + 'px';
					if(showArea){
						showArea.value = Math.round(actionBar.offsetWidth / barLength * (total-minNumber)+minNumber);
						SlideBar.prototype.bandwidth(curBandwidth, unit, showArea);
                        if(clickfn) clickfn();
					}
				}
				return false;
			}

			sDom.onmouseup = function() {
				sDom.onmousemove = sDom.onmouseup = null;
			}

			return false;
		}
	},

	bandwidth : function(curBandwidth, unit, showArea){
		 var Bandwidth = sDom.getElementById(curBandwidth);
		 if(Bandwidth){
		 	$("#"+curBandwidth).html(showArea.value + unit);
		 }
	},

	getStyle : function(obj, attr){
		return obj.currentStyle?obj.currentStyle[attr]:getComputedStyle(obj)[attr];
	}
}
