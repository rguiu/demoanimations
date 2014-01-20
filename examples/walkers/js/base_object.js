function BaseObject(name, image_path, x, y, width, height, image_count) {
	this.name   	= name;
	this.image_path = image_path;
	this.x 		  	= x;
	this.y        	= y;
	this.ready    	     = false;	

	if (width) {
		this.width       = width;		
	}
	if (height) {
		this.height      = height;		
	}
	if (image_count) {
        this.image_count = image_count;
	} else {
        this.image_count = 1;
	}
		
	this.images_loaded  = 0;

	this.onImageLoad = function(){
		this.images_loaded   += 1;
		//console.log("Loading image: ", this.name, this.images_loaded, this.image_count, this.ready);
		if (this.image_count == 1 || this.images_loaded >= this.image_count*0.85) {
			this.ready = true;
		}
	};
	
    this.current_image = null;

	__construct = function(th) {
		console.log("__BaseObject");
        if (th.image_count===1) {
        	console.log("Loading 1 image");
            th.current_image        = new Image();
            th.current_image.src    = th.image_path;
            th.current_image.onload = th.onImageLoad;
        } else {
        	console.log("Loading many images");
            th.frames = [];
            for (var i = 1; i <= image_count; i++){
                th.frames[i] = new Image();
                var h = i.toString();
                if (i<10) { // this is not very flexible, look at other strategies
                    h = "0"+h;
                }
                th.frames[i].src    = th.image_path.replace(/\$/g,h);
                th.frames[i].onload = function(){th.onImageLoad()};
            }
           	th.image_id = 1;
            th.current_image = th.frames[th.image_id];
        }
	}(this);

	this.heartbeat = function() {}; 

	this.paint  = function(context) {
		context.drawImage(this.current_image, this.x, this.y, this.width, this.height);
	};
}


	