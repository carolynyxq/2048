//定义每个对象每次移动的属性和方法
function Task(obj,topStep,leftStep){
	this.obj=obj;
	this.topStep=topStep;
	this.leftStep=leftStep;
	this.moveStep=function(){
		//当前对象移动一步
		var objCss=null;
		if(this.obj.currentStyle){
			objCss=this.obj.currentStyle;
		}else{
			objCss=getComputedStyle(this.obj,null);
		}
		this.obj.style.top=parseInt(objCss.top)+this.topStep+"px";
		this.obj.style.left=parseInt(objCss.left)+this.leftStep+"px";
	};
	this.clear=function(){
		this.obj.style.zIndex="";
		this.obj.style.top="";
		this.obj.style.left="";
	};
}

var animation={
	steps:10,//移动步数
	interval:50,//移动时间间隔200毫秒
	timer:null,//定时器线程号
	tasks:[],//存储任务，即有几个元素需要移动
	addTask:function(source,target){
		//source,target分别表示原单元格和目标单元格
		var sCell=document.querySelector("#fc"+source);
		var tCell=document.querySelector("#fc"+target);
		var sCellCss=null;
		if(sCell.currentStyle){
			sCellCss=sCell.currentStyle;
		}else{
			sCellCss=getComputedStyle(sCell,null);
		}

		var tCellCss=null;
		if(tCell.currentStyle){
			tCellCss=tCell.currentStyle;
		}else{
			tCellCss=getComputedStyle(tCell,null);
		}
		sCell.style.zIndex="100";
		var topStep=(parseInt(tCellCss.top)-parseInt(sCellCss.top))/animation.steps;
		var leftStep=(parseInt(tCellCss.left)-parseInt(sCellCss.left))/animation.steps;
		var task=new Task(sCell,topStep,leftStep);
		this.tasks.push(task);
	},
	start:function(){
		this.timer=setInterval(function(){
			for(var i=0;i<animation.tasks.length;i++){
				var task=animation.tasks[i];
				task.moveStep();
			}
			animation.steps--;
			if(animation.steps==0){
				for(var i=0;i<animation.tasks.length;i++){
					var task=animation.tasks[i];
					task.clear();
				}
				clearInterval(animation.timer);
				animation.timer=null;
				animation.tasks=[];
				animation.steps=10;
			}
		},this.interval);
	}
};