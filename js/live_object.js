function LiveObject(name, image_path, x, y, width, height, image_count) {
	BaseObject.call(this,name, image_path, x, y, width, height, image_count);

	var dirs = ["NW", "N", "NE", "W", this.name, "E", "SW", "S", "SE"];
	
	this.MOVE_INDICES = {
		DANCE:    -2,
		STAND:   -1, //"QUIETO",
		W:    5, //"OESTE", 
		S:      6, //"SUR", 
		E:     4, //"ESTE", 
		N:    7, //"NORTE", 
		SE:  1, //"SURESTE", 
		NW: 2, //"NOROESTE", 
		SW: 0, //"SUROESTE", 
		NE:  3, //"NORESTE" 			
	};

	var create_clickable = function(th, i) {
		return function(){ th.move(i)};
	};

	this.create_controls = function() {
		var cons = document.getElementById("controls");
		var tbl=document.createElement('table');
		var tbdy=document.createElement('tbody');
		for(var i=0;i<3;i++){
		    var tr=document.createElement('tr');
		    for(var j=0;j<3;j++){
		        var td=document.createElement('td');
		        td.appendChild(document.createTextNode( dirs[i*3 + j] ));

		        if (i!=1 || j!=1) {
		        	var th = this;
		        	var udi=eval("this.MOVE_INDICES."+dirs[i*3 + j]);
		        	console.log(udi, dirs[i*3 + j]);
			        td.onclick = create_clickable(this, udi);
			    } else {
			    	td.className = "name";
			    	td.onclick = create_clickable(this, this.MOVE_INDICES.STAND);
			    }
			    tr.appendChild(td);
		    }
		    tbdy.appendChild(tr);
		}
		tbl.appendChild(tbdy);
		cons.appendChild(tbl)
	};

	__construct = function(th) {
		console.log("__LiveObject");
		th.create_controls();
	}(this);

	this.alive = true;
	// Movimiento
	// 1. declaramos enumeraciones para los 8 tipos. Tenemos en cuenta que dibujaremos en 
	// un entorno isometrico asi lo que parecen diagonales no lo son...usare Norte, Sur...
	// (Esto lo podria sacar fuera de Persona??)


	this.PATH = [
//		[0,0], //"QUIETO",
		[-1,1], //"OESTE", 
		[1,1],       //"SUR", 
		[-1,-1],      //"ESTE", 
		[1,-1], //"NORTE", 
		[1,0], //"SURESTE", 
		[-1,0], //"NOROESTE", 
		[0,1], //"SUROESTE", 
		[0,-1], //"NORESTE" 			
	];

	this.direction = this.MOVE_INDICES.STAND;
	
	this.move = function(d) {
		this.direction = d;
		if (this.direction < 0) {
			this.image_id = 1;
		} else {
			this.image_id = (this.direction * 16) + 1; // I am assuming is 1 to 128 indices
		}
		//console.log("Changed dir");
	};

	this.heartbeat = function() {
		if (this.direction >= 0) {
			this.image_id += 1;
			if (this.image_id > ((this.direction + 1) * 16) ) {
				// reset id 
				this.move(this.direction)
			}
			this.x += this.PATH[this.direction][0];
			this.y += this.PATH[this.direction][1];
			if (this.x + this.width + 20 > mundo.canvas.width || this.x < 0 || this.y < 0 || this.y + this.height + 20 > mundo.canvas.height) {
				this.x -= this.PATH[this.direction][0];
				this.y -= this.PATH[this.direction][1];
				this.move(this.MOVE_INDICES.STAND);
			}
		} else if (this.direction === this.MOVE_INDICES.DANCE) {
			this.image_id += Math.floor((Math.random()*8)+1) - 4;
			this.image_id = Math.abs((this.image_id%128) + 1);
		}
		this.current_image = this.frames[this.image_id];  
	}; 

	this.paint_extra  = function(context) {
		//context.drawImage(this.frames[this.image_id], this.x, this.y);
		context.font = "bold 10px sans-serif";
		context.fillStyle = '#bbb';
		context.fillText(this.name, this.x + 5, this.y + 88);
		if (this.direccion < -1) {
			context.fillText("ehhh macarena", this.x - 5, this.y - 10);
		}
	};

	this.dance  = function() {
		console.log(this.name + " dice: lets dance");
		this.direction = this.MOVE_INDICES.DANCE;		
	};
}


	