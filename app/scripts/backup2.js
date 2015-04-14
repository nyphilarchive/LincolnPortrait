canvas = document.getElementById('c');
annotatedImage = document.getElementById('annotated-image');
annotatedImage2  = document.getElementById('annotated-image2');

//you need to set the orignal height of the canvas when annotations where done
var OGCanvasSize = {
  "height" : 650,
  "width"  : 985,
};

function getMousePos(canvas, evt) {
  var rect = canvas.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
  };
};


var annotatedImageDetails = {
  "x"       : 591,
  "y"       : 103,
  "offsetX" : 0,
  "offsetY" : 0,
  "buffer"  : 0,
  'radius'  : 40,
  'scale'   : 1,
  scaleUp   : function(scaleFactor){
    this.scale *= scaleFactor;
  },
  isInBounds: function(lX,lY){
    var centerOfCanvas = {
      x: $('#c').width()/2,
      y: $('#c').height()/2,
    };

    var scaleX = (this.x-centerOfCanvas.x)*this.scale + centerOfCanvas.x;
    var scaleY = centerOfCanvas.y - (centerOfCanvas.y-this.y)*this.scale;

    var xAxis = (scaleX)+this.offsetX*1.1211;
    var yAxis = (scaleY)+this.offsetY*1.1211;

    // console.log("x offset: "+this.offsetX+" y:"+this.offsetY);
    console.log("range at x: " + xAxis + " y: " + yAxis);
    if(lX <= xAxis+20+this.buffer && lX >= xAxis-(20+this.buffer)){
      if(lY <= yAxis+20+this.buffer && lY >= yAxis-(20+this.buffer)){
        return true;
      }
    }
    return false;
  },
  toggleAnnotation: function(){
    $('#annotation-1').css('top',canvas.offsetTop+(this.y)*($('#c').height()/OGCanvasSize.height)+this.offsetY*1.1211);
    $('#annotation-1').css('left',canvas.offsetLeft+(this.x)*($('#c').width()/OGCanvasSize.width)+this.offsetX*1.1211);
    $('#annotation-1').toggle(600);
  }
}

var canvasDetails = {};

window.onload = function(){
	var ctx = canvas.getContext('2d');
	trackTransforms(ctx);

  function redraw(){
		// Clear the entire canvas
		var p1 = ctx.transformedPoint(0,0);
		var p2 = ctx.transformedPoint(canvas.width,canvas.height);
		ctx.clearRect(p1.x,p1.y,p2.x-p1.x,p2.y-p1.y);

    //notes
    //the divison of the transformed point and the width gives the ratio for the radius
    ctx.drawImage(annotatedImage2,0,0);
    ctx.drawImage(annotatedImage,(canvas.width/.15)/2,0);

    var centerX = canvas.width*4;
    var centerY = canvas.height;
    var radius = 40;

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
    ctx.lineWidth = 10;
    ctx.strokeStyle = 'white';
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(centerX+1000, centerY, radius, 0, 2 * Math.PI, false);
    ctx.lineWidth = 10;
    ctx.strokeStyle = 'white';
    ctx.stroke();

	}

  function reset() {
    canvas.width = 880;
    canvas.height = 580;
    ctx = canvas.getContext('2d');
    trackTransforms(ctx);
    ctx.scale(.15,.15); //set the starting scale
    ctx.clearRect (0,0,canvas.width,canvas.height);
    ctx.drawImage(annotatedImage2,0,0);
    ctx.drawImage(annotatedImage,(canvas.width/.15)/2,0);
    var centerX = canvas.width*4;
    var centerY = canvas.height;
    var radius = 40;

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
    ctx.lineWidth = 10;
    ctx.strokeStyle = 'white';
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(centerX+1000, centerY, radius, 0, 2 * Math.PI, false);
    ctx.lineWidth = 10;
    ctx.strokeStyle = 'white';
    ctx.stroke();

    annotatedImageDetails.offsetX = 0;
    annotatedImageDetails.offsetY = 0;
  }

  reset();
  //redraw();

  //buttons
  var scaleFactor = 1.5;
  $('#reset').on('click', function(){
    reset();
  });
  $('#zoomIn').on('click', function(){
    var pt = ctx.transformedPoint(canvas.width/2,canvas.height/2);
    ctx.translate(pt.x,pt.y);
    var factor = Math.pow(scaleFactor,1);
    ctx.scale(factor,factor);
    ctx.translate(-pt.x,-pt.y);
    annotatedImageDetails.scaleUp(scaleFactor);
    redraw();
  });
  $('#zoomOut').on('click', function(){
    var pt = ctx.transformedPoint(canvas.width/2,canvas.height/2);
    ctx.translate(pt.x,pt.y);
    var factor = Math.pow(1/scaleFactor,1);
    ctx.scale(factor,factor);
    ctx.translate(-pt.x,-pt.y);
    annotatedImageDetails.scaleUp(1/scaleFactor);
    redraw();
  });


	var lastX=canvas.width/2, lastY=canvas.height/2;
	var dragStart, dragEnd, dragged;

  var mouseX, mouseY = 0;
  //moving the image around
  canvas.addEventListener('mousedown',function(evt){
	  document.body.style.mozUserSelect = document.body.style.webkitUserSelect = document.body.style.userSelect = 'none';
		mouseX = evt.offsetX || (evt.pageX - canvas.offsetLeft);
    lastX = evt.offsetX || (evt.pageX - canvas.offsetLeft);
		mouseY = evt.offsetY || (evt.pageY - canvas.offsetTop);
    lastY = evt.offsetY || (evt.pageY - canvas.offsetTop);
    //console.log("lastx: " + (lastX) + " lastY: " + (lastY));

		dragStart = ctx.transformedPoint(lastX,lastY);
		dragged = false;

	},false);
	canvas.addEventListener('mousemove',function(evt){
		lastX = evt.offsetX || (evt.pageX - canvas.offsetLeft);
		lastY = evt.offsetY || (evt.pageY - canvas.offsetTop);
		dragged = true;
		if (dragStart){
			var pt = ctx.transformedPoint(lastX,lastY);
			ctx.translate(pt.x-dragStart.x,pt.y-dragStart.y);
			redraw();
		}
	},false);
	canvas.addEventListener('mouseup',function(evt){
    somelastX = evt.offsetX || (evt.pageX - canvas.offsetLeft);
    somelastY = evt.offsetY || (evt.pageY - canvas.offsetTop);

    annotatedImageDetails.offsetX += (somelastX - mouseX);
    annotatedImageDetails.offsetY += (somelastY - mouseY);
    console.log("current coord x:"+somelastX+" y:"+somelastY);
    if(annotatedImageDetails.isInBounds(evt.offsetX,evt.offsetY)){
      annotatedImageDetails.toggleAnnotation();
    }
    dragStart = null;
	},false);

	var zoom = function(clicks){
		var pt = ctx.transformedPoint(lastX,lastY);
		ctx.translate(pt.x,pt.y);
		var factor = Math.pow(scaleFactor,clicks);
		ctx.scale(factor,factor);
		ctx.translate(-pt.x,-pt.y);
		redraw();
	}


//use this for smooth zooming


  	// var handleScroll = function(evt){
  	// 	var delta = evt.wheelDelta ? evt.wheelDelta/40 : evt.detail ? -evt.detail : 0;
  	// 	if (delta) zoom(delta);
  	// 	return evt.preventDefault() && false;
  	// };
  	// canvas.addEventListener('DOMMouseScroll',handleScroll,false);
  	// canvas.addEventListener('mousewheel',handleScroll,false);

};

// Adds ctx.getTransform() - returns an SVGMatrix
// Adds ctx.transformedPoint(x,y) - returns an SVGPoint
function trackTransforms(ctx){
	var svg = document.createElementNS("http://www.w3.org/2000/svg",'svg');
	var xform = svg.createSVGMatrix();
	ctx.getTransform = function(){ return xform; };

	var savedTransforms = [];
	var save = ctx.save;
	ctx.save = function(){
		savedTransforms.push(xform.translate(0,0));
		return save.call(ctx);
	};
	var restore = ctx.restore;
	ctx.restore = function(){
		xform = savedTransforms.pop();
		return restore.call(ctx);
	};

	var scale = ctx.scale;
	ctx.scale = function(sx,sy){
		xform = xform.scaleNonUniform(sx,sy);
		return scale.call(ctx,sx,sy);
	};
	var rotate = ctx.rotate;
	ctx.rotate = function(radians){
		xform = xform.rotate(radians*180/Math.PI);
		return rotate.call(ctx,radians);
	};
	var translate = ctx.translate;
	ctx.translate = function(dx,dy){
		xform = xform.translate(dx,dy);
		return translate.call(ctx,dx,dy);
	};
	var transform = ctx.transform;
	ctx.transform = function(a,b,c,d,e,f){
		var m2 = svg.createSVGMatrix();
		m2.a=a; m2.b=b; m2.c=c; m2.d=d; m2.e=e; m2.f=f;
		xform = xform.multiply(m2);
		return transform.call(ctx,a,b,c,d,e,f);
	};
	var setTransform = ctx.setTransform;
	ctx.setTransform = function(a,b,c,d,e,f){
		xform.a = a;
		xform.b = b;
		xform.c = c;
		xform.d = d;
		xform.e = e;
		xform.f = f;
		return setTransform.call(ctx,a,b,c,d,e,f);
	};
	var pt  = svg.createSVGPoint();
	ctx.transformedPoint = function(x,y){
		pt.x=x; pt.y=y;
		return pt.matrixTransform(xform.inverse());
	}
}
