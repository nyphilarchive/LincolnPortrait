//
// var canvas = document.getElementsByTagName('canvas')[0];
// canvas.width = 700; canvas.height = 800;
// var gkhead = document.getElementById('annotated-image');
//
// // var ctx = canvas.getContext('2d');
// // ctx.scale(.1,.1);
// // var p1 = ctx.transformedPoint(0,0);
// // var p2 = ctx.transformedPoint(canvas.width,canvas.height);
// // ctx.clearRect(p1.x,p1.y,p2.x-p1.x,p2.y-p1.y);
// // ctx.drawImage(gkhead,0,0);
// window.onload = function(){
// 	var ctx = canvas.getContext('2d');
// 	trackTransforms(ctx);
//
//   function redraw(){
// 		// Clear the entire canvas
// 		var p1 = ctx.transformedPoint(0,0);
// 		var p2 = ctx.transformedPoint(canvas.width,canvas.height);
// 		ctx.clearRect(p1.x,p1.y,p2.x-p1.x,p2.y-p1.y);
//
//     //notes
//     //the divison of the transformed point and the width gives the ratio for the radius
//
// 		ctx.drawImage(gkhead,0,0);
//
//     console.log('transformededPoint p1 - x: '+ p1.x + ' y: ' + p1.y);
//     console.log('transformededPoint p2 - x: '+ p2.x + ' y: ' + p2.y);
//     console.log('transformededPoint scale change p2 - x: '+ ((p2.x-p1.x)/p2.x) + ' y: ' + ((p2.y-p1.y)/p2.y));
//   //  console.log('transformededPoint scale change p2 - x: '+ ((p2.x-p1.x)/p2.x) + ' y: ' + ((p2.y-p1.y)/p2.y));
//   //  console.log('center of cirle - x: '+ canvas.width +' y: ' + canvas.height);
//     var centerX = canvas.width;
//     var centerY = canvas.height;
//     var radius = 40;
//
//     ctx.beginPath();
//     ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
//     ctx.lineWidth = 10;
//     ctx.strokeStyle = 'white';
//     ctx.stroke();
//
//
// 	}
//
//
//   function reset() {
//     canvas.width = 700;
//     canvas.height = 800;
//     ctx = canvas.getContext('2d');
//     trackTransforms(ctx);
//     ctx.scale(.2,.2); //set the starting scale
//     ctx.clearRect (0,0,canvas.width,canvas.height);
//     ctx.drawImage(gkhead,0,0);
//     var centerX = canvas.width;
//     var centerY = canvas.height;
//     var radius = 40;
//
//     ctx.beginPath();
//     ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
//     ctx.lineWidth = 10;
//     ctx.strokeStyle = 'white';
//     ctx.stroke();
//   }
//
//   reset();
//
//   redraw();
//
//
//   $('#reset').on('click', function(){
//     reset();
//   });
//
//
//
// 	var lastX=canvas.width/2, lastY=canvas.height/2;
// 	var dragStart,dragged;
// 	// canvas.addEventListener('mousedown',function(evt){
// 	// document.body.style.mozUserSelect = document.body.style.webkitUserSelect = document.body.style.userSelect = 'none';
// 	// 	lastX = evt.offsetX || (evt.pageX - canvas.offsetLeft);
// 	// 	lastY = evt.offsetY || (evt.pageY - canvas.offsetTop);
//   //   console.log("lastx: " + (lastX) + " lastY: " + (lastY));
// 	// 	dragStart = ctx.transformedPoint(lastX,lastY);
// 	// 	dragged = false;
// 	// },false);
//   //
//
//   $('#c').dblclick(function(evt){
//     //document.body.style.mozUserSelect = document.body.style.webkitUserSelect = document.body.style.userSelect = 'none';
//     lastX = evt.offsetX || (evt.pageX - canvas.offsetLeft);
//     lastY = evt.offsetY || (evt.pageY - canvas.offsetTop);
//     console.log("lastx: " + (lastX) + " lastY: " + (lastY));
//     dragStart = ctx.transformedPoint(lastX,lastY);
//     zoom(evt.shiftKey ? -1 : 1 );
//   });
//
// 	canvas.addEventListener('mousemove',function(evt){
// 		lastX = evt.offsetX || (evt.pageX - canvas.offsetLeft);
// 		lastY = evt.offsetY || (evt.pageY - canvas.offsetTop);
//   //  console.log("lastx: " + (lastX) + " lastY: " + (lastY));
// 		// dragged = true;
// 		// if (dragStart){
// 		// 	var pt = ctx.transformedPoint(lastX,lastY);
// 		// 	ctx.translate(pt.x-dragStart.x,pt.y-dragStart.y);
// 		// 	redraw();
// 		// }
// 	},false);
// 	// canvas.addEventListener('mouseup',function(evt){
// 	// 	dragStart = null;
// 	// 	if (!dragged) zoom(evt.shiftKey ? -1 : 1 );
// 	// },false);
//   // //
//   // canvas.addEvemtListener('mousemove' function(evt){
//   //   console.log("log some maddness");
//   // },false);
//
// 	var scaleFactor = 1.5;
// 	var zoom = function(clicks){
// 		var pt = ctx.transformedPoint(lastX,lastY);
// 		ctx.translate(pt.x,pt.y);
// 		var factor = Math.pow(scaleFactor,clicks);
// 		ctx.scale(factor,factor);
// 		ctx.translate(-pt.x,-pt.y);
// 		redraw();
// 	}
//
// 	var handleScroll = function(evt){
// 		var delta = evt.wheelDelta ? evt.wheelDelta/40 : evt.detail ? -evt.detail : 0;
// 		if (delta) zoom(delta);
// 		return evt.preventDefault() && false;
// 	};
// 	canvas.addEventListener('DOMMouseScroll',handleScroll,false);
// 	canvas.addEventListener('mousewheel',handleScroll,false);
// };
//
// // gkhead.src = 'images/lincolnimage1.jpeg';
// // gkhead.height = "500"
// // gkhead.width = "400"
// // ball.src   = 'images/lincolnimage.jpeg';
//
// // Adds ctx.getTransform() - returns an SVGMatrix
// // Adds ctx.transformedPoint(x,y) - returns an SVGPoint
// function trackTransforms(ctx){
// 	var svg = document.createElementNS("http://www.w3.org/2000/svg",'svg');
// 	var xform = svg.createSVGMatrix();
// 	ctx.getTransform = function(){ return xform; };
//
// 	var savedTransforms = [];
// 	var save = ctx.save;
// 	ctx.save = function(){
// 		savedTransforms.push(xform.translate(0,0));
// 		return save.call(ctx);
// 	};
// 	var restore = ctx.restore;
// 	ctx.restore = function(){
// 		xform = savedTransforms.pop();
// 		return restore.call(ctx);
// 	};
//
// 	var scale = ctx.scale;
// 	ctx.scale = function(sx,sy){
// 		xform = xform.scaleNonUniform(sx,sy);
// 		return scale.call(ctx,sx,sy);
// 	};
// 	var rotate = ctx.rotate;
// 	ctx.rotate = function(radians){
// 		xform = xform.rotate(radians*180/Math.PI);
// 		return rotate.call(ctx,radians);
// 	};
// 	var translate = ctx.translate;
// 	ctx.translate = function(dx,dy){
// 		xform = xform.translate(dx,dy);
// 		return translate.call(ctx,dx,dy);
// 	};
// 	var transform = ctx.transform;
// 	ctx.transform = function(a,b,c,d,e,f){
// 		var m2 = svg.createSVGMatrix();
// 		m2.a=a; m2.b=b; m2.c=c; m2.d=d; m2.e=e; m2.f=f;
// 		xform = xform.multiply(m2);
// 		return transform.call(ctx,a,b,c,d,e,f);
// 	};
// 	var setTransform = ctx.setTransform;
// 	ctx.setTransform = function(a,b,c,d,e,f){
// 		xform.a = a;
// 		xform.b = b;
// 		xform.c = c;
// 		xform.d = d;
// 		xform.e = e;
// 		xform.f = f;
// 		return setTransform.call(ctx,a,b,c,d,e,f);
// 	};
// 	var pt  = svg.createSVGPoint();
// 	ctx.transformedPoint = function(x,y){
// 		pt.x=x; pt.y=y;
// 		return pt.matrixTransform(xform.inverse());
// 	}
// }
