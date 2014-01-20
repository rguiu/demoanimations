var main = function(){

  	function Pacman(context, colour, bgcolour) {
  		this.context = context;
  		this.RADIUS = 25;
  		this.mouthState = 50; // how is the mouth (open or close) in degrees, 0 is closed
  		this.mouthSpeed = -5; // negative is opening positive is closing
		this.x = 100;
  		this.y = 100;
  		this.colour   = colour;
  		this.bgcolour = bgcolour; 
  		var speedX = 5; //  for now only on x
  		this.move = function() {
  			this.x += speedX;
  		};
  		this.draw = function(){
  			this.context.beginPath();
  			// circle
  			this.context.fillStyle = this.colour;
  			this.context.arc(this.x, this.y,this.RADIUS, 0, 2 * Math.PI);
			this.context.fill();
  			// mouth
  			this.context.beginPath();
  			this.context.fillStyle = this.bgcolour;
  			this.context.moveTo(this.x, this.y);
  			this.context.arc(this.x, this.y,this.RADIUS+1, (2 * Math.PI) - this.mouthState/100, this.mouthState/100, 0);  			this.context.lineTo(this.x, this.y);
			this.context.fill();
			// eye
			this.context.fillStyle = this.bgcolour;
  			this.context.arc(this.x + (this.RADIUS/6), this.y - (this.RADIUS/2),this.RADIUS/5, 0, 2 * Math.PI);
			this.context.fill();
  		}
  		this.heartbeat = function() {
  			this.mouthSpeed = (this.mouthState>=50)?-5:this.mouthSpeed;
  			this.mouthSpeed = (this.mouthState<=0)?5:this.mouthSpeed;
  			this.mouthState += this.mouthSpeed;	

  			if (this.x + this.RADIUS > this.context.canvas.width) {
				this.x = -this.RADIUS;
			}
			this.x += speedX;
  		};
  	}

  	function Maze(context, bgcolour, components) {
  		this.bgcolour = bgcolour; 
  		this.context  = context;
  		this.components = components;
  		this.clear = function() {
  			context.canvas.width  = window.innerWidth;
		    context.canvas.height = 200;
		    context.beginPath();
			context.fillStyle = this.bgcolour;
			context.rect ( 0 , 0 , context.canvas.width , context.canvas.height );
			context.fill();
  		};
  		this.draw = function(){
  			this.clear();
  			for(var i = 0; i<this.components.length;i++) {
  				this.components[i].draw();
  			}
  		};
  		this.heartbeat = function() {
  			for(var i = 0; i<this.components.length;i++) {
  				this.components[i].heartbeat();
  			}
  		}
  	}
	var canvas = document.getElementById("pacmancanvas");
  	var context = canvas.getContext("2d");

	var pacman = new Pacman(context, "#ff0", "#000");
	var maze = new Maze(context, "#000", [pacman])
	//maze.draw();  
	function update(){maze.heartbeat()};	
	function draw() {requestAnimationFrame(draw);maze.draw();};
	setInterval(update, 40);
	draw();
};


window.onload = main;