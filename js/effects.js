// Effects

var Effects = {
	Lights: function(color) {
    this.name = "lights";

    this.ray = function(context, width) {
      rayoluzini = Math.floor((Math.random()*window.innerWidth - 250)+1);
      rayoluzfin = rayoluzini+200;
      context.beginPath();
      context.moveTo(width,-100);
      context.lineTo(rayoluzini,canvas.height);
      context.lineTo(rayoluzfin,canvas.height);
	  if (color == null)
	  {
		context.fillStyle = Util.random_color();
	  }
	  else
	  {
		context.fillStyle=color;
	  }
      context.fill();
    };

    this.execute = function(context) {
      context.globalAlpha = 0.3;
      this.ray(context, 0);
      this.ray(context, canvas.width);
      context.globalAlpha = 1;
    };

	},

  Rain: function(density) {
    this.execute = function(context) {
      context.beginPath();
      context.lineWidth = 1;
      for(var i=0; i < density;i++) {
        context.globalAlpha = Math.random() * 0.1;
        var len = Math.floor((Math.random()*12)+15);
        var xx = Math.floor((Math.random()*context.canvas.width));
        var yy = Math.floor((Math.random()*context.canvas.height));
        context.moveTo(xx,yy);
        context.lineTo(xx,yy+len);
        context.stroke();
      }
      var d2 = density/4;
      for(var i=0; i < d2;i++) {
        context.globalAlpha = Math.random() * 0.4;
        var len = Math.floor((Math.random()*12)+15);
        var xx = Math.floor((Math.random()*context.canvas.width));
        var yy = Math.floor((Math.random()*context.canvas.height));
        Util.draw_elipse(context, xx, yy, len, len/2);
        context.stroke();
      }
      context.globalAlpha = 1;
    };
  }
}
