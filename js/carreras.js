
// Keys, for interaction
var pressed_keys = {};

var main = function(){
	var canvas = document.getElementById("gamecanvas");
  	var context = canvas.getContext("2d");
  	canvas.width = 640;
  	canvas.height = 400;
		context.fillStyle ="#000000";
  	context.fillRect(0, 0, canvas.width, canvas.height);

  	var radius = (canvas.height/2) - 50;
  	var circuits = [];
  	circuits.push( new Circuit(canvas, radius, radius+10, "red")); // "#ee0000"
  	circuits.push( new Circuit(canvas, radius-12, radius+10, "#00ee00")); // "#ee0000"
  	circuits.push( new Circuit(canvas, radius-24, radius+10, "#0000ee")); // "#ee0000"
  	circuits.push( new Circuit(canvas, radius-36, radius+10, "yellow")); // "#ee0000"

  	var cars = [];

  	var keys = ["Q", "W", "E", "R"];

	for(var i = 0;i<circuits.length;i++) {
		if (keys.length -1 >= i ) {
  			cars.push(new Car(canvas, circuits[i], 15,9, keys[i]));
  		} else {
  			cars.push(new Car(canvas, circuits[i], 15,9));
  		}
  	}

  	var animation = function() {
  		for(var i = 0;i<cars.length;i++) {
  			cars[i].run();
  			if (cars[i].interactive_key === undefined) {
  				randomAceleration(cars[i]);
  			}
  		} 

  		context.fillStyle ="#000000";
  		context.fillRect(0, 0, canvas.width, canvas.height);
  		for(var i = 0;i<circuits.length;i++) {
  			circuits[i].paint();
  		} 
  		for(var i = 0;i<cars.length;i++) {
  			cars[i].paint();
  		} 
  	};

  	document.body.onkeydown = function(event){
	    event = event || window.event;
	    var keycode = event.charCode || event.keyCode;
	    pressed_keys[keycode] = true;
	}

	document.body.onkeyup = function(event){
	    event = event || window.event;
	    var keycode = event.charCode || event.keyCode;
	    delete pressed_keys[keycode];
	}

  	setInterval(animation, 1000/25);
};

function randomAceleration(car) {
	// implement your own driver.. if you dont want to press keys
};

var Circuit = function(canvas, radius, xmargin, colour) {
	var x1 = xmargin;
	var y1 = canvas.height * 0.5;
	var context = canvas.getContext("2d");
	this.colour = colour;
	this.radius = radius;
	this.straight = canvas.width - (2 * xmargin);
	this.length = 2 * Math.PI * this.radius + 2 * this.straight;
	this.paint = function() {
		context.beginPath();
		context.strokeStyle = colour;
		context.arc(x1, y1, this.radius, Math.PI * 0.5, Math.PI * 1.5, false);
		context.arc(canvas.width - x1, y1, radius, Math.PI * 1.5, Math.PI * 0.5, false);
		context.lineWidth = 2;
		context.closePath();
		context.stroke();

		// Meta
		context.beginPath();
		context.fillStyle = "#fff";
		context.rect(x1-6, y1 - 6 - this.radius, 6, 6);
		context.rect(x1, y1 - this.radius, 6, 6);
		context.fill();
	}
	this.begining = [x1, y1-radius];

	this.sections = [
			this.straight, 
			this.straight + Math.PI * this.radius, 
			2 * this.straight + Math.PI * this.radius
	];

	this.position = function(l, car_w, car_h) {
		l = l % this.length;
		if (l <= this.sections[0]) {
			return [x1 + l - car_w/2, y1 - radius - car_h/2, 0];
		} else if (l <= this.sections[1]) {
			// angle is equal to the distance in the half circle divided by the radius
			l=l-car_w/2;
			var angle = (l - this.straight)/this.radius;

			return [
				x1 + this.straight + (this.radius * Math.sin(angle)) + (0.5 * car_h * Math.sin(angle)), 
				y1 - ( this.radius * Math.cos(angle) ) - (0.5 * car_h * Math.cos(angle))

				, angle
				
			];
		} else if (l <= this.sections[2]) {
			return [x1 + this.sections[2] - l - car_w/2, y1 + this.radius - car_h/2, 0];
		} else {
			l=l+car_w/2;
			// angle is equal to the distance in the half circle divided by the radius
			var angle = (l - this.sections[2])/this.radius;
			return [
				x1 - (this.radius * Math.sin(angle)) + (0.5 * car_h * Math.sin(angle)), 
				y1 + ( this.radius * Math.cos(angle))- (0.5 * car_h * Math.cos(angle)),
				angle
			];
		}
	};
};

var Accident = function(car) {
	this.car = car;
	this.duration = 0;
	this.direction = -1;

	if (this.car.l > this.car.circuit.sections[2]) {
		this.direction = -1;
	} else {
		this.direction = 1;
	}

	this.x 		= this.car.x;
	this.y 		= this.car.y;
	this.angle 	= this.car.angle; 
	this.speed  = this.car.speed; 
	console.log("accident", this.x, this.y, this.direction);

	this.run = function() {
		if (!isNaN(this.x) && !isNaN(this.y)) {
			this.x = this.x + (this.direction * this.speed * Math.cos(this.car.angle));
			this.y = this.y + (this.direction * this.speed * Math.sin(this.car.angle));
			if (this.duration>5) {
				this.angle += 0.04 * this.speed;
			}
			this.speed -= 0.2;
			if (this.speed < 0) {
				this.speed = 0;
			}
		}
		this.duration += 1;

		if (this.duration >= 40) {
			this.car.speed = 0;
			this.car.accident = null;
		}
	}

	this.paint = function(context) {
		context.beginPath();
		context.save();
		if (this.duration>5) {
			var xtrans = this.x; // + (this.car.w * Math.cos(this.car.angle));
			var ytrans = this.y; // + (this.car.w * Math.sin(this.car.angle));
			context.translate(xtrans, ytrans);
			context.rotate(this.angle);
			context.rect(0, 0, this.car.w, this.car.h);
		} else {
			context.rect(this.x, this.y, this.car.w, this.car.h);
		}
		context.fillStyle = this.car.colour;
		context.fill();
		context.restore();
	};
};

var Car = function(canvas, circuit, w, h, key) {
	this.l = 0;
	this.circuit = circuit;
	this.x = circuit.begining[0];
	this.y = circuit.begining[1];
	this.colour = circuit.colour;
	this.w = w;
	this.h = h;
	this.speed = 0.0;

	this.angle = 0;
	this.slide_angle = 0; 

	this.accident = null;

	if (key !== undefined) {
		this.interactive_key = key.charCodeAt(0); // get the id for the events
		console.log(key+": "+this.interactive_key);
	}
	var context = canvas.getContext("2d");

	this.paint = function() {
		if (this.accident === null) {
			context.beginPath();
			context.save();
			context.translate(this.x, this.y);
			// if (this.angle == 0 && this.slide_angle > 0) {
			// 	this.slide_angle -= 0.12;
			// 	if (this.slide_angle<0) this.slide_angle=0;
			// } else if (this.angle > 0){
			// 	this.slide_angle = this.angle * 0.2;
			// }
			context.rotate(this.angle + this.slide_angle); // second parameter is the slide factor, will depend on speed
			context.rect(0, 0, this.w, this.h);
			context.fillStyle = this.colour;
			context.fill();
			context.restore();
		} else {
			this.accident.paint(context);
		}
	};

	this.run = function() {
		if (this.accident === null) {
			if (this.interactive_key in pressed_keys) {
				if (this.angle > 0 && this.centripete_aceleration() > 60) {
					this.accident = new Accident(this);
				} else {
					this.acelerate();
				}
			} else {
				this.decelerate();
			}
		}	
		if (this.accident === null) {
			this.l += this.speed; 
			var position = this.circuit.position(this.l, this.w, this.h);
			this.x = position[0];
			this.y = position[1];
			this.angle = position[2];
			this.decelerate();
			this.update_display();
		} else {
			this.accident.run();
		}
	};

	this.acelerate = function() {
		this.speed += 0.2;
		if (this.speed>10) {
			this.speed=10;
		} 
	};

	this.decelerate = function() {
		this.speed -= 0.08;
		if (this.speed<0) {
			this.speed=0;
		} 
	};

	this.display = null;

	this.centripete_aceleration = function() {
		if (this.angle !== 0) {
			return centripete_aceleration = (this.speed * this.speed) * 100 / this.circuit.radius;
		} else {
			return 0;
		}
	};

	this.display_message = function() {
		return 	Math.floor(this.speed * 30) + "KM/H  : "+ 
				Math.floor(this.l%circuit.length) + ":" + Math.floor(this.centripete_aceleration())+
				":" + this.angle;
	};

	this.create_display = function() {
		var car_list = document.getElementById("car_list");
		var li=document.createElement('li');
		li.appendChild(document.createTextNode(""));
		li.style.color = this.colour;
		car_list.appendChild(li);
		this.display = li;
	};

	this.update_display = function() {
		this.display.innerHTML = this.display_message();
	};

	this.create_display();
};


window.onload = main;