function Mundo() {
	this.context = null;
	this.canvas = null;
	this.inhabitants = [];

	this.resize_canvas = function(){
		this.canvas.width = window.innerWidth - 250;
		this.canvas.height = window.innerHeight - 140;
	}		

	__construct = function(t) {
		console.log("Mundo construct");
		t.canvas = document.getElementById("canvas");
		t.context = t.canvas.getContext('2d');
	
		t.resize_canvas();	
		$(window).resize(function(){
		 	t.resize_canvas();
		});

		var heartbeat = function() {
			for(var i in t.inhabitants) {
				t.inhabitants[i].heartbeat();
			}
			t.context.clearRect(0,0,t.canvas.width, t.canvas.height);

			// @todo
			// no deberia hcer esto todo el tiempo
			t.inhabitants.sort(function(a,b) { return (a.y+a.height - b.y-b.height) || (a.x - b.x)});
			for(var i in t.inhabitants) {
				t.inhabitants[i].paint(t.context);
			} 
			for(var i in t.inhabitants) {
				if (t.inhabitants[i].alive === true) {
					t.inhabitants[i].paint_extra(t.context);
				}
			}
		};

		setInterval(heartbeat, 1000/20);
		console.log("Mundo constructed");

    }(this);

}

var paco = null;
var pepe = null;
var juan = null;

var mundo = null;

$(function() { 
	pepe = new LiveObject('pepe', 'imagenes/person01/images/person01_$.png', 10,10, 32,80, 128);
	paco = new LiveObject('paco', 'imagenes/person02/images/person02_$.png', 50,20, 32,80, 128);
	juan = new LiveObject('juan', 'imagenes/person03/images/person03_$.png', 90,5, 32,80, 128);

	//var house = new BaseObject('house', 'imagenes/houses/house1.png', 300, 200, 278, 229);
	mundo = new Mundo();

	mundo.inhabitants.push(pepe);
	mundo.inhabitants.push(paco);
	mundo.inhabitants.push(juan);
	//mundo.inhabitants.push(house);

});