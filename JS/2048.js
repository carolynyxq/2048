var game={
	//存储数据
	data:[[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]],
	//游戏状态
	PLAY:1,
	OVER:0,
	status:1,
	//得分
	score:0,
	//判断数组是否已满，满了则gameover
	isFull:function(){
		if(!Array.indexOf){
			Array.prototype.indexOf=function(n){
				for (var i=0;i<this.length;i++ )
				{
					if(this[i]==n){
						return i;
					}
				}
				return -1;
			};
		}
		for(var row=0;row<this.data.length;row++){
			if(this.data[row].indexOf(0)!=-1){
				//找到0，就是还没满了，返回false
				return false;
			}
			return true;
		}
	},
	//随机生成2或4并存储到上述data数组中
	randomNum:function(){
		if(!(this.isFull())){
			while(true){
				//九宫格中随机生成行号和列号
				var row=parseInt(Math.random()*4);
				var col=parseInt(Math.random()*4);
				//随机生成数字2或数字4
				var num=Math.random()<0.5?2:4;
				//当前行号和列号的单元格是否有数字，无则将随机生成的数字存储进去
				if(this.data[row][col]==0){
					this.data[row][col]=num;
					break;
				}
			}
		}
	},
	//启动游戏,在九宫格的随机两个位置处生成随机数2或4
	start:function(){
		game.randomNum();
		game.randomNum();
		game.showData();
	},
	//将data数组内容完整显示到div中
	showData:function(){
		for(var i=0;i<this.data.length;i++){
			for(var j=0;j<this.data[i].length;j++){
				var div=document.querySelector("#fc"+i+j);
				var num=this.data[i][j];
				div.innerHTML=num==0?"":num;
				div.className=num==0?"fcell":"fcell n"+num;
			}
		}
		document.getElementById("score").textContent=this.score;
	},
/****左移****/
	moveLeft:function(){
		if(this.canLeft()){
			for(var i=0;i<this.data.length;i++){
				this.moveLeftInRow(i);
			}
			animation.start();
			setTimeout(function(){
				game.randomNum();
				game.showData();
			},animation.interval*animation.steps);
		}
	},
	//任意一行内移动或合并元素
	moveLeftInRow:function(row){
		for(var i=0;i<this.data[row].length-1;i++){
			var nextCol=this.getLeftNext(row,i);
			if(nextCol!=-1){
				//在当前行中找到了不为0的单元格
				if(this.data[row][i]==0){
					this.data[row][i]=this.data[row][nextCol];
					this.data[row][nextCol]=0;
					animation.addTask(""+row+nextCol,""+row+i);
					i--;//重新检查当前位置
				}else if(this.data[row][i]==this.data[row][nextCol]){
					this.data[row][i]+=this.data[row][nextCol];
					this.data[row][nextCol]=0;
					animation.addTask(""+row+nextCol,""+row+i);
					this.score+=this.data[row][i];
				}
			}
		}
	},
	//从当前位置向右找第一个不等于0的数
	getLeftNext:function(row,col){
		for(var i=col+1;i<this.data[row].length;i++){
			if(this.data[row][i]!=0){
				return i;
				break;
			}
		}
		return -1;
	},
/****右移****/
	moveRight:function(){
		if(this.canRight()){
			for(var i=0;i<this.data.length;i++){
				this.moveRightInRow(i);
			}
			animation.start();
			setTimeout(function(){
				game.randomNum();
				game.showData();
			},animation.interval*animation.steps);
		}
	},
	moveRightInRow:function(row){
		//从最右侧元素开始向左遍历
		for(var col=this.data[row].length-1;col>0;col--){
			var next=this.getRightNext(row,col);
			if(next!=-1){
				if(this.data[row][col]==0){
					//置换
					this.data[row][col]=this.data[row][next];
					this.data[row][next]=0;
					animation.addTask(""+row+next,""+row+col);
					col++;
				}else if(this.data[row][col]==this.data[row][next]){
					this.data[row][col]+=this.data[row][next];
					this.data[row][next]=0;
					animation.addTask(""+row+next,""+row+col);
					this.score+=this.data[row][col];
				}
			}
		}
	},
	getRightNext:function(row,start){
		//从start的前一个位置开始，到0结束，查找第一个不为0的元素
		for(var i=start-1;i>=0;i--){
			if(this.data[row][i]!=0){
				return i;
			}
		}
		return -1;
	},
/****上移****/
	moveUp:function(){
		if(this.canUp()){
			for(var col=0;col<this.data[0].length;col++){
				this.moveUpInCol(col);
			}
			animation.start();
			setTimeout(function(){
				game.randomNum();
				game.showData();
			},animation.interval*animation.steps);
		}
	},
	moveUpInCol:function(col){
		for(var row=0;row<this.data.length-1;row++){
			var next=this.getUpNext(row,col);
			if(next!=-1){
				if(this.data[row][col]==0){
					this.data[row][col]=this.data[next][col];
					this.data[next][col]=0;
					animation.addTask(""+next+col,""+row+col);
					row--;
				}else if(this.data[row][col]==this.data[next][col]){
					this.data[row][col]+=this.data[next][col];
					this.data[next][col]=0;
					animation.addTask(""+next+col,""+row+col);
					this.score+=this.data[row][col];
				}
			}else{
				break;
			}
		}
	},
	getUpNext:function(start,col){
		//从start的下一行位置开始，到最后一行结束，查找第一个不为0的元素
		for(var i=start+1;i<this.data[start].length;i++){
			if(this.data[i][col]!=0){
				return i;
			}
		}
		return -1;
	},
/****下移****/
	moveDown:function(){
		if(this.canDown()){
			for(var i=0;i<this.data[0].length;i++){
				this.moveDownInCol(i);
			}
			animation.start();
			setTimeout(function(){
				game.randomNum();
				game.showData();
			},animation.interval*animation.steps);
		}
	},
	moveDownInCol:function(col){
		for(var row=this.data.length-1;row>0;row--){
			var next=this.getDownNext(row,col);
			if(next!=-1){
				if(this.data[row][col]==0){
					this.data[row][col]=this.data[next][col];
					this.data[next][col]=0;
					animation.addTask(""+next+col,""+row+col);
					row++;
				}else if(this.data[row][col]==this.data[next][col]){
					this.data[row][col]+=this.data[next][col];
					this.data[next][col]=0;
					animation.addTask(""+next+col,""+row+col);
					this.score+=this.data[row][col];
				}
			}
		}
	},
	getDownNext:function(start,col){
		for(var row=start-1;row>=0;row--){
			if(this.data[row][col]!=0){
				return row;
			}
		}
		return -1;
	},
/****判断是否可向某个方向移动****/
	canLeft:function(){
		for(var i=0;i<this.data.length;i++){
			for(var j=1;j<this.data[i].length;j++){
				if(this.data[i][j]!=0){
					if(this.data[i][j-1]==0||this.data[i][j]==this.data[i][j-1]){
						return true;
					}
				}
			}
		}
		return false;
	},
	canRight:function(){
		for(var i=0;i<this.data.length;i++){
			for(var j=0;j<this.data[i].length-1;j++){
				if(this.data[i][j]!=0){
					if(this.data[i][j+1]==0||this.data[i][j]==this.data[i][j+1]){
						return true;
					}
				}
			}
		}
		return false;
	},
	canUp:function(){
		for(var i=1;i<this.data.length;i++){
			for(var j=0;j<this.data[i].length;j++){
				if(this.data[i][j]!=0){
					if(this.data[i-1][j]==0||this.data[i][j]==this.data[i-1][j]){
						return true;
					}
				}
			}
		}
		return false;
	},
	canDown:function(){
		for(var i=0;i<this.data.length-1;i++){
			for(var j=0;j<this.data[i].length;j++){
				if(this.data[i][j]!=0){
					if(this.data[i+1][j]==0||this.data[i][j]==this.data[i+1][j]){
						return true;
					}
				}
			}
		}
		return false;
	},
/***GAME OVER***/
	gameover:function(){
		if(!(this.isFull())){
			return false;//只要找到一个0，游戏就不结束
		}
		//经过上述if检查，说明数组均不为0
		//则遍历数组检查
		//上下左右都不能合并的时候，gameover，return false
		//注意去除边界
		for(var i=0;i<this.data.length;i++){
			for(var j=0;j<this.data[i].length;j++){
				var curr=this.data[i][j];
				if(curr==8192){return true;}
				if(i!=0){
					if (this.data[i-1][j]==curr){return false;}
				}
				if(i!=this.data.length-1){
					if(this.data[i+1][j]==curr){return false;}
				}
				if(j!=0){
					if(this.data[i][j-1]==curr){return false;}
				}
				if(j!=this.data[0].length-1){
					if(this.data[i][j+1]==curr){return false;}
				}
			}
		}
		return true;
	},
//再试一次
	restart:function(){
		this.status=this.PLAY;
		this.score=0;
		this.data=[[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]];
		var gameover=document.getElementById("gameover");
		gameover.style.display="none";
		this.start();
	}
};
