// rye-touch.js
// 'swipe', 'swipeLeft', 'swipeRight', 'swipeUp', 'swipeDown', 'doubleTap', 'tap', 'singleTap', 'longTap'
(function($){var touch={};function parentIfText(node){return $("tagName" in node?node:node.parentNode)}function Gesture(props){$.extend(this,props);Gesture.all.push(this)}Gesture.all=[];Gesture.cancelAll=function(){Gesture.all.forEach(function(instance){instance.cancel()});touch={}};Gesture.prototype.schedule=function(){this.timeout=setTimeout(this._trigger.bind(this),this.delay)};Gesture.prototype._trigger=function(){this.timeout=null;this.trigger()};Gesture.prototype.cancel=function(){if(this.timeout){clearTimeout(this.timeout)}this.timeout=null};if("ontouchstart" in window){var tap=new Gesture({delay:0,trigger:function(){var event=$.Event("tap");event.cancelTouch=Gesture.cancelAll;touch.element.trigger(event);if(touch.isDoubleTap){touch.element.trigger("doubletap");touch.element.trigger("doubleTap");touch={}}else{singleTap.schedule()}}}),singleTap=new Gesture({delay:250,trigger:function(){touch.element.trigger("singletap");touch.element.trigger("singleTap");touch={}}}),longTap=new Gesture({delay:750,trigger:function(){if(touch.last){touch.element.trigger("longtap");touch.element.trigger("longTap");touch={}}}}),swipe=new Gesture({delay:0,trigger:function(){touch.element.trigger("swipe");touch.element.trigger("swipe"+this.direction().toLowerCase());touch.element.trigger("swipe"+this.direction());touch={}},direction:function(){if(Math.abs(touch.x1-touch.x2)>=Math.abs(touch.y1-touch.y2)){return touch.x1-touch.x2>0?"Left":"Right"}return touch.y1-touch.y2>0?"Up":"Down"}});var doc=$(document);doc.on("touchstart",function(event){var now=Date.now();event=event.originalEvent;singleTap.cancel();touch.element=parentIfText(event.touches[0].target);touch.x1=event.touches[0].pageX;touch.y1=event.touches[0].pageY;if(touch.last&&(now-touch.last)<=250){touch.isDoubleTap=true}touch.last=now;longTap.schedule()});doc.on("touchmove",function(event){longTap.cancel();event=event.originalEvent;touch.x2=event.touches[0].pageX;touch.y2=event.touches[0].pageY});doc.on("touchend",function(){longTap.cancel();if(Math.abs(touch.x1-touch.x2)>30||Math.abs(touch.y1-touch.y2)>30){swipe.schedule()}else{if("last" in touch){tap.schedule()}}});doc.on("touchcancel",Gesture.cancelAll);doc.on("scroll",Gesture.cancelAll);["swipe","swipeLeft","swipeRight","swipeUp","swipeDown","doubleTap","tap","singleTap","longTap"].forEach(function(event){$.fn[event]=function(fn){return this.on(event,fn)}})}})(jQuery);