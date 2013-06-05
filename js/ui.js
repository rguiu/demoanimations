$(function() {
	$("#orders_form").on("submit", function(event){
	    event.preventDefault();
	    var or = $("#orders").val().toLowerCase();
	    $("#orders").val("");
	    var ors = or.split(" ");
	    person = window[ors[0]];
	    if (ors[1] === "camina" && (ors[2] === "al" || ors[2] === "hacia")) {
		    var dir = ors[3].toUpperCase();
 			if (person.MOVE_INDICES[dir] !== undefined) {
		    	person.move(person.MOVE_INDICES[dir]);	    
		    }	else {
		    	console.log("invalid move");
		    	alert("No entiendo: "+dir);
		    }    	
	    } else if (ors[1] === "para") {
	    	person.move(-1);
	    } else if (ors[1] === "baila") {
	    	person.dance();
	    } else if (ors[0] === "musica") {
	    	for(var i in mundo.inhabitants) {
				mundo.inhabitants[i].dance();
			} 
	    } else if (ors[0] === "nace" && ors.length === 5) {
	    	// chapucilla
    		window[ors[1]] = new LiveObject(ors[1], 'imagenes/person0'+ors[2]+'/images/person0'+ors[2]+'_$.png', parseInt(ors[3]),parseInt(ors[4]), 32, 80, 128);
    		mundo.inhabitants.push(window[ors[1]]);
     	} else if (ors[0] === "mani") {
     		// i dont validate... so be careful for now .. the whole ui file is a bit of hack for trying things
     		var n = parseInt(ors[1]);
     		for (var i = 0; i<n; i++) {
     			var name = "Gen"+i;
     			var xx = Math.floor(Math.random()*(mundo.canvas.width-42)) + 5 ;
     			var yy = Math.floor(Math.random()*(mundo.canvas.height-90)) + 5 ;
     			var char_id = Math.floor(Math.random()*3)+1;
	     		window[name] = new LiveObject(name, 'imagenes/person0'+char_id+'/images/person0'+char_id+'_$.png', xx,yy, 32, 80, 128);
	     		mundo.inhabitants.push(window[name]);
     			person = window[""];
     		}

	    } else {
	    	console.log("No entiendo: "+or);
	    	alert("No entiendo: "+or+", "+ors.length);
	    }
	});
});