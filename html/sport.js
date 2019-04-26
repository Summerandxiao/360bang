//缓冲运动 + 多物体运动 + 透明度的操作
//封装一个函数 功能是让div匀速运动
//obj就是运动的对象  target 表示 目标值   attr 表示参数  
function startMove( obj , target , attr ){
	clearInterval( obj.timer )
	obj.timer = setInterval(function(){
		var current = 0 
		if( attr == "opacity"){
			current = getStyle(obj,attr)*100
		}else{
			//获取元素样式值
			current = parseInt(getStyle(obj,attr))
		}
		var speed = (target - current)/10
		speed = speed > 0 ? Math.ceil(speed) :  Math.floor(speed)
		if( target == current ){
			clearInterval(obj.timer)
		}else{
		
		if( attr == "opacity" ){
			  obj.style[attr] = (current+speed)/100
		}else{
			obj.style[attr] = current + speed + "px"
		}
	  }
	},30)
}
   //获取运动元素的样式值
   function getStyle(obj,attr){
   if( window.getComputedStyle ){
   	return window.getComputedStyle(obj,false)[attr]
   }else{
   	return obj.currentStyle[attr]
   }
   }
/*function startMove(obj,target,attr){ 
	clearInterval( obj.timer );
	obj.timer = setInterval( function(){
		var current = 0;
		if( attr == "opacity" ){
			current =  getStyle(obj,attr) * 100 ;
		}else{
			//获取元 素的样式值
			current = parseInt( getStyle(obj,attr) ) ;
		}
		
		//缓冲运动速度确定
		var speed = (target - current)/10;
		speed = speed > 0  ? Math.ceil( speed ) : Math.floor( speed );
		if( current == target ){
			clearInterval( obj.timer );
		}else{
			if( attr == "opacity" ){
				obj.style[attr] = (current + speed)/100;
			}else{
				obj.style[attr] = current + speed + "px";
			}
		}
	} , 30 )
}

//获取运动元素实际样式值 
function getStyle(obj,attr){
	if( window.getComputedStyle ){
		return window.getComputedStyle(obj,false)[attr];
	}else{
		return obj.currentStyle[attr];
	}
}*/