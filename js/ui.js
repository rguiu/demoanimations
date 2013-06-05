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
	    } else {
	    	console.log("No entiendo: "+or);
	    	alert("No entiendo: "+or+", "+ors.length);
	    }
	});
});