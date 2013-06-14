var main = function(){
	var canvas = document.getElementById("gamecanvas");
  	var context = canvas.getContext("2d");
  	canvas.width = 600;
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

		for(var i = 0;i<circuits.length;i++) {
  		cars.push(new Car(canvas, circuits[i], 15,9));
  	}

  	var animation = function() {
  		for(var i = 0;i<cars.length;i++) {
  			cars[i].run();
  			randomAceleration(cars[i])
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
  	setInterval(animation, 1000/25);
};

function randomAceleration(car) {
	if (car.speed < 4.5 && Math.random() * 3 < 1) {
		car.acelerate();
	} else if (car.speed < 5.5 && Math.random() * 5 < 1) {
		car.acelerate();
	} else if (car.speed < 6 && Math.random() * 100 < 1) {
		// BOOOM
		car.speed = 10;
	}
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
			return [x1 + l, y1 - radius - car_h/2, 0];
		} else if (l <= this.sections[1]) {
			// angle is equal to the distance in the half circle divided by the radius
			var angle = (l - this.straight)/this.radius;

			return [
				x1 + this.straight + (this.radius * Math.sin(angle)) + (0.5 * car_h * Math.sin(angle)), 
				y1 - ( this.radius * Math.cos(angle) ) - (0.5 * car_h * Math.cos(angle))

				, angle
				
			];
		} else if (l <= this.sections[2]) {
			return [x1 + this.sections[2] - l, y1 + this.radius - car_h/2, 0];
		} else {
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

var Car = function(canvas, circuit, w, h) {
	this.l = 0;
	this.circuit = circuit;
	this.x = circuit.begining[0];
	this.y = circuit.begining[1];
	this.colour = circuit.colour;
	this.w = w;
	this.h = h;
	this.speed = 0.05;
	this.angle = 0;
	this.slide_angle = 0;
	var context = canvas.getContext("2d");

	this.paint = function() {
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
	};

	this.run = function() {
		this.l += this.speed; 
		var position = this.circuit.position(this.l, this.w, this.h);
		this.x = position[0];
		this.y = position[1];
		this.angle = position[2];
		this.decelerate();
		this.update_display();
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
	this.create_display = function() {
		var car_list = document.getElementById("car_list");
		var li=document.createElement('li');

		li.appendChild(document.createTextNode( Math.floor(this.speed * 30) + "KM/H  : "+ Math.floor(this.l%circuit.length)));
		li.style.color = this.colour;
		car_list.appendChild(li);
		this.display = li;
	};

	this.update_display = function() {
		this.display.innerHTML = Math.floor(this.speed * 30) + "KM/H  : "+ Math.floor(this.l%circuit.length);
	};

	this.create_display();
};

window.onload = main;