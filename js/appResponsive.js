
var dim = {w:0,h:0,dw:0,dh:0,landScape:null}
	
function setDim(){
		
	var lastH =	dim.h;
	var lastW =	dim.w;
	dim.w = window.innerWidth;
	dim.h = window.innerHeight;

	
	// Para los que no soportan window.innerWidth , IE8
	if (typeof (dim.w) !== 'number'){
		dim.w = document.documentElement.clientWidth || document.body.clientWidth;
		dim.h = document.documentElement.clientHeight || document.body.clientHeight;			
	}

	dim.dw = Math.abs(dim.w-lastW);
	dim.dh = Math.abs(dim.h-lastH);
	
	dim.w >= dim.h ? dim.landScape = true : dim.landScape = false;
		
}

function resize(){ 
	setDim();

}

resize();
window.addEventListener( 'resize', resize, false );
