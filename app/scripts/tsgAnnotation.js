var OpenDANnotate = function(){
  var TSG = {
    Utils   : {},
    Canvas  : {},
    Buttons : {},
    Events  : {},
    Config  : {},
    Images  : {},
    Debug   : {}
  };

  TSG.Images.CurrentImage = {};

  TSG.Images.Regular = {
    origScale : {
      width: .78,
      height: .78
    },
    leftId: "annotated-image-left",
    rightId: "annotated-image-right",
    rightImageOffset: 25,
    canvasWidth : 855,
    canvasHeight: 580,
    movementScale: .99
  };

  TSG.Images.Large = {
    origScale : {
      width: .487,
      height: .487
    },
    leftId: "annotated-image-left-lg",
    rightId: "annotated-image-right-lg",
    rightImageOffset: 25,
    canvasWidth : 855,
    canvasHeight: 600,
    movementScale: .99
  };

  TSG.Images.XLarge = {
    origScale : {
      width: .245,
      height: .245
    },
    leftId: "annotated-image-left-xl",
    rightId: "annotated-image-right-xl",
    rightImageOffset: 60,
    canvasWidth : 865,
    canvasHeight: 580
  };

  TSG.Utils.trackTransforms = function trackTransforms(ctx){
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
  };

  TSG.Utils.getMousePos = function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
  };

  TSG.Utils.mobileCheck = function() {
    var check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true})(navigator.userAgent||navigator.vendor||window.opera);
    return check;
  }

  TSG.Utils.drawImage = function(ctx){
    if(TSG.Utils.mobileCheck() === true){
      ctx.drawImage(TSG.Canvas.annotatedImageRight,0,0);
    }
    else {
      ctx.drawImage(TSG.Canvas.annotatedImageLeft,0,0);
      ctx.drawImage(TSG.Canvas.annotatedImageRight,(TSG.Images.CurrentImage.canvasWidth/TSG.Images.CurrentImage.origScale.width)/2-TSG.Images.CurrentImage.rightImageOffset,0);
    }
  }

  TSG.Utils.drawCircle = function(ctx){
    var centerX = TSG.Canvas.canvas.width*4;
    var centerY = TSG.Canvas.canvas.height;
    var radius = 40;

    TSG.Canvas.ctx.beginPath();
    TSG.Canvas.ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
    TSG.Canvas.ctx.lineWidth = 10;
    TSG.Canvas.ctx.strokeStyle = 'white';
    TSG.Canvas.ctx.stroke();
  };

  TSG.Utils.zoom = function(scaleFactor){
    TSG.Images.CurrentImage = TSG.Images.Regular;
    // if(TSG.Canvas.annotations.scale >= 2.25){
    //   TSG.Canvas.annotatedImageLeft = document.getElementById('annotated-image-left-xl');
    //   TSG.Canvas.annotatedImageRight = document.getElementById('annotated-image-right-xl');
    //   TSG.Images.CurrentImage = TSG.Images.XLarge;
    // }
    // else
    // if(TSG.Canvas.annotations.scale){
    //   TSG.Canvas.annotatedImageLeft = document.getElementById('annotated-image-left-lg');
    //   TSG.Canvas.annotatedImageRight = document.getElementById('annotated-image-right-lg');
    //   TSG.Images.CurrentImage = TSG.Images.Large;
    // }

    //use recursion to ease the zoom;
    var pt = TSG.Canvas.ctx.transformedPoint(TSG.Images.CurrentImage.canvasWidth/2,TSG.Images.CurrentImage.canvasHeight/2);
    TSG.Canvas.ctx.translate(pt.x,pt.y);
    var factor = Math.pow(scaleFactor,1);
    TSG.Canvas.ctx.scale(factor,factor);
    TSG.Canvas.ctx.translate(-pt.x,-pt.y);
    TSG.Canvas.annotations.changeScale(scaleFactor);
    TSG.Utils.redraw();
  }

  TSG.Utils.redraw = function redraw(){
    // Clear the entire canvas
    var p1 = TSG.Canvas.ctx.transformedPoint(0,0);
    var p2 = TSG.Canvas.ctx.transformedPoint(TSG.Canvas.canvas.width,TSG.Canvas.canvas.height);
    TSG.Canvas.ctx.clearRect(p1.x,p1.y,p2.x-p1.x,p2.y-p1.y);
    TSG.Utils.drawImage(TSG.Canvas.ctx);
  }

  TSG.Utils.reset = function reset() {

    if(TSG.Utils.mobileCheck() === true){
      TSG.Images.CurrentImage = TSG.Images.Regular;
      TSG.Canvas.canvas.width = TSG.Images.Regular.canvasWidth/2;
      TSG.Canvas.canvas.height = TSG.Images.Regular.canvasHeight;

      TSG.Canvas.ctx = TSG.Canvas.canvas.getContext('2d');
      TSG.Utils.trackTransforms(TSG.Canvas.ctx);
      TSG.Canvas.ctx.scale(TSG.Images.Regular.origScale.width,TSG.Images.Regular.origScale.height); //set the starting scale
      TSG.Canvas.ctx.clearRect (0,0,TSG.Canvas.canvas.width,TSG.Canvas.canvas.height);

      TSG.Utils.drawImage(TSG.Canvas.ctx);

      TSG.Canvas.annotations.offsetX = 0;
      TSG.Canvas.annotations.offsetY = 0;
      TSG.Canvas.annotations.scale = 1;
    }
    else {
      TSG.Images.CurrentImage = TSG.Images.Regular;
      TSG.Canvas.canvas.width = TSG.Images.Regular.canvasWidth;
      TSG.Canvas.canvas.height = TSG.Images.Regular.canvasHeight;

      TSG.Canvas.ctx = TSG.Canvas.canvas.getContext('2d');
      TSG.Utils.trackTransforms(TSG.Canvas.ctx);
      TSG.Canvas.ctx.scale(TSG.Images.Regular.origScale.width,TSG.Images.Regular.origScale.height); //set the starting scale
      TSG.Canvas.ctx.clearRect (0,0,TSG.Canvas.canvas.width,TSG.Canvas.canvas.height);

      TSG.Utils.drawImage(TSG.Canvas.ctx);

      TSG.Canvas.annotations.offsetX = 0;
      TSG.Canvas.annotations.offsetY = 0;
      TSG.Canvas.annotations.scale = 1;
    }
  }

  TSG.Utils.showMousePosition = function(){
    $('canvas').click(function(evt){
      var pos = TSG.Utils.getMousePos(TSG.Canvas.canvas,evt);
      console.log("mouse position x:"+pos.x+" y:"+pos.y);
    });
  }

  TSG.init = function(){
    var lastX=TSG.Canvas.canvas.width/2, lastY=TSG.Canvas.canvas.height/2;
    var dragStart, dragEnd, dragged;
    var mouseX, mouseY = 0;
    TSG.Canvas.ctx = TSG.Canvas.canvas.getContext('2d');
    TSG.Utils.trackTransforms(TSG.Canvas.ctx);

    TSG.Utils.reset();

    //setup buttons
    TSG.Buttons.Reset = $('#reset').on('click', function(){
      TSG.Utils.reset();
    });
    TSG.Buttons.ZoomIn  = $('#zoomIn').on('click', function(){
      TSG.Utils.zoom(1.5);
      TSG.Canvas.annotations.offsetX *= 1.5;
    });
    TSG.Buttons.ZoomOut = $('#zoomOut').on('click', function(){
      if(TSG.Canvas.annotations.scale === 1){
        return;
      }
      TSG.Utils.zoom(1/1.5);
      TSG.Canvas.annotations.offsetX *= 1/1.5
    });
    TSG.Buttons.FullScreen = $('#fullscreen-btn').on('click', function(){
      $('#image-title').toggle();
      $('#annotation-facts').toggle();
      $('#annotation-container').toggleClass('fullscreen-toggle', 'tsg-container');
      $('#fullscreen-btn > span').toggleClass('glyphicon-resize-small','glyphicon-resize-full');
      var lastX=TSG.Canvas.canvas.width/2, lastY=TSG.Canvas.canvas.height/2;
      var dragStart, dragEnd, dragged;
      var mouseX, mouseY = 0;
      TSG.Canvas.ctx = TSG.Canvas.canvas.getContext('2d');
      TSG.Utils.trackTransforms(TSG.Canvas.ctx);
      TSG.Utils.reset();
    });

    var mouseUpAndDown = false;
    //set up events
    TSG.Events.mousedown = $('#c').mousedown(function(evt){
      evt.preventDefault();
  	  //document.body.style.mozUserSelect = document.body.style.webkitUserSelect = document.body.style.userSelect = 'none';
  		if(mouseUpAndDown === false){
        mouseX = evt.offsetX || (evt.pageX - TSG.Canvas.canvas.offsetLeft);
        lastX = evt.offsetX || (evt.pageX - TSG.Canvas.canvas.offsetLeft);
    		mouseY = evt.offsetY || (evt.pageY - TSG.Canvas.canvas.offsetTop);
        lastY = evt.offsetY || (evt.pageY - TSG.Canvas.canvas.offsetTop);

      	dragStart = TSG.Canvas.ctx.transformedPoint(lastX,lastY);
    		dragged = false;
      }
      mouseUpAndDown = true;
  	});
    TSG.Events.mousemove = $('#c').mousemove(function(evt){
  		lastX = evt.offsetX || (evt.pageX - TSG.Canvas.canvas.offsetLeft);
  		lastY = evt.offsetY || (evt.pageY - TSG.Canvas.canvas.offsetTop);
  		dragged = true;
  		// if (dragStart){
  		// 	var pt = TSG.Canvas.ctx.transformedPoint(lastX,lastY);
      //   TSG.Canvas.ctx.translate(pt.x-dragStart.x,pt.y-dragStart.y);
      //   TSG.Utils.redraw();
  		// }
  	});
    TSG.Events.mouseup = $('#c').mouseup(function(evt){
      somelastX = evt.offsetX || (evt.pageX - TSG.Canvas.canvas.offsetLeft);
      somelastY = evt.offsetY || (evt.pageY - TSG.Canvas.canvas.offsetTop);

      TSG.Canvas.annotations.offsetX += (somelastX - mouseX);
      TSG.Canvas.annotations.offsetY += (somelastY - mouseY);
      if(dragged === false){
        var index = TSG.Canvas.annotations.isInBounds(somelastX,somelastY);
        if(index !== false){
          TSG.Canvas.annotations.toggleAnnotation(index);
        }
      }
      mouseUpAndDown = false;
      dragStart = false;;
  	});


    $('.bs-example-modal-lg').on('hidden.bs.modal', function () {
        var sound = document.getElementsByTagName('audio');
        $.each(sound, function(index, audio){
          audio.pause();
          audio.currentTime = 0;
        });
        if(TSG.Canvas.canvas === document.getElementById('c')){
          TSG.Canvas.canvas = document.getElementById('c');
        }
    });
    //TSG.Utils.showMousePosition();
  };

  TSG.Canvas.canvas = document.getElementById('c');
  TSG.Canvas.annotatedImageRight = document.getElementById('annotated-image-right');
  TSG.Canvas.annotatedImageLeft  = document.getElementById('annotated-image-left');
  TSG.Canvas.OGCanvasSize = {
    //you need to set the orignal height of the canvas when annotations where done
    "height" : 650,
    "width"  : 985,
  };
  TSG.Canvas.annotations = {
    "offsetX" : 0,
    "offsetY" : 0,
    'scale'   : 1,
    'annotationSet': [
      {
        "x1": 584,
        "x2": 727,
        "y1": 133,
        "y2": 233
      },
      {
        "x1": 748,
        "x2": 953,
        "y1": 100,
        "y2": 217
      },
      {
        "x1": 581,
        "x2": 685,
        "y1": 316,
        "y2": 381
      },
      {
        "x1": 618,
        "x2": 765,
        "y1": 370,
        "y2": 414
      },
      {
        "x1": 609,
        "x2": 812,
        "y1": 440,
        "y2": 501
      },
      {
        "x1": 591,
        "x2": 683,
        "y1": 533,
        "y2": 625
      },
      {
        "x1": 701,
        "x2": 763,
        "y1": 517,
        "y2": 554
      },
      {
        "x1": 710,
        "x2": 775,
        "y1": 562,
        "y2": 615
      },
      {
        "x1": 780,
        "x2": 833,
        "y1": 561,
        "y2": 610
      },
      {
        "x1": 820,
        "x2": 896,
        "y1": 516,
        "y2": 569
      },
      {
        "x1": 871,
        "x2": 965,
        "y1": 581,
        "y2": 629
      },
      {
        "x1": 855,
        "x2": 970,
        "y1": 440,
        "y2": 505
      },
      {
        "x1": 838,
        "x2": 940,
        "y1": 370,
        "y2": 432
      },
      {
        "x1": 873,
        "x2": 969,
        "y1": 231,
        "y2": 358
      },
      {
        "x1": 649,
        "x2": 809,
        "y1": 66,
        "y2": 87
      }
    ],
    changeScale : function(scaleFactor){
      this.scale *= scaleFactor;
    },
    isInBounds: function(mouseX,mouseY){

      //need to adjust the offset when you zoom from another point
      var centerOfCanvas = {
        x: $('#c').width()/2,
        y: $('#c').height()/2,
      };
      var self = this;
      var flag = false;
      $.each(this.annotationSet, function(index, annotation){
        $('#annotation-'+index).hide();
        var scaledX1 = (annotation.x1-centerOfCanvas.x)*self.scale + centerOfCanvas.x;
        var scaledX2 = (annotation.x2-centerOfCanvas.x)*self.scale + centerOfCanvas.x;
        var scaledY1 = centerOfCanvas.y - (centerOfCanvas.y-annotation.y1)*self.scale;
        var scaledY2 = centerOfCanvas.y - (centerOfCanvas.y-annotation.y2)*self.scale;

        if(TSG.Utils.mobileCheck() === true){
          var normalizedX1 = scaledX1*(2*$('#c').width()/TSG.Canvas.OGCanvasSize.width);
          var normalizedX2 = scaledX2*(2*$('#c').width()/TSG.Canvas.OGCanvasSize.width);
          normalizedX1 -= $('#c').width();
          normalizedX2 -= $('#c').width();
          var normalizedY1 = scaledY1*($('#c').height()/TSG.Canvas.OGCanvasSize.height);
          var normalizedY2 = scaledY2*($('#c').height()/TSG.Canvas.OGCanvasSize.height);
        }
        else {
          var normalizedX1 = scaledX1*($('#c').width()/TSG.Canvas.OGCanvasSize.width);
          var normalizedX2 = scaledX2*($('#c').width()/TSG.Canvas.OGCanvasSize.width);
          var normalizedY1 = scaledY1*($('#c').height()/TSG.Canvas.OGCanvasSize.height);
          var normalizedY2 = scaledY2*($('#c').height()/TSG.Canvas.OGCanvasSize.height);
        }

        var x1AxisWithOffset = (normalizedX1)+self.offsetX*TSG.Images.Regular.movementScale;
        var x2AxisWithOffset = (normalizedX2)+self.offsetX*TSG.Images.Regular.movementScale;
        var y1AxisWithOffset = (normalizedY1)+self.offsetY*TSG.Images.Regular.movementScale;
        var y2AxisWithOffset = (normalizedY2)+self.offsetY*TSG.Images.Regular.movementScale;

        // if(index === 0){
        //   console.log("DEBUG annotations "+index);
        //   console.log("x1:"+x1AxisWithOffset+" x2:"+x2AxisWithOffset);
        //   console.log("y1:"+y1AxisWithOffset+" y2:"+y2AxisWithOffset);
        //   console.log("mouseX:"+mouseX+" mouseY:"+mouseY);
        // }

        if(mouseX <= x2AxisWithOffset && mouseX >= x1AxisWithOffset){
          if(mouseY <= y2AxisWithOffset && mouseY >= y1AxisWithOffset){
            if(flag === false){
              flag = index;
            }
          }
        }
      });

      return flag;
    },
    toggleAnnotation: function(annotationNumber){
      //show the right annotation
      $('#annotation-'+annotationNumber).show();
      $('.tsg-modal-btn').click();
    }
  }

  window.onload = TSG.init;
  return TSG;
}();
