//===============================================================================================	
//===============================================================================================

var element;
var eventoFin=0;	
var hablando=0;	
var pausa=0;
var inicial=1;	
var intervaloAudio;
var texto;

var linksJson;
var colaEnlaces=[];
var indiceEnlace=-1;
var enlacesCantidad=0;
var enlacesCantidadSave=0;
var navegacion=0;
var modoComentar=0;

var leyendoArticulo=0;
var cola=[];

//==============================================================================
//		Inicializamos objeto TTS
//==============================================================================


window.addEventListener('polymer-ready', function(e) {			

	element = new SpeechSynthesisUtterance();
	element.onend = function(event) {stopIntervalo();} //Al finalizar de hablar llamamos funcion que detiene intervalo.			
	element.onstart = function(event) {iniciarIntervalo();} // intervalo que resumira el tts cada 5 segundos
	element.lang = 'es-ES';
	element.rate = 1.2;
	
	speechSynthesis.cancel(element);	

});


//==============================================================================
//		Núcleo para llamar servicios TTS
//==============================================================================

// Intervalo  que nos permitirá mantener el TTS funcionando
function iniciarIntervalo() {		
	window.intervaloAudio = setInterval(function(){
			speechSynthesis.resume(window.element);
			hablando=1;
			console.log("play")
	}, 5000);			  
}


// Detiene intervalo pero si hay informacion en la cola sigue hablando
function stopIntervalo() {
	hablando=0;
	window.clearInterval(window.intervaloAudio);
	if(cola.length!=0){
		toSpeech();
	}else{
		if(eventoFin){
			eventoFin=0;
			setTimeout(function(){procesar("finarticulo")},500);
		}
	}
}			


// CORE TTS
function toSpeech(){
	hablando=1;
	element.text=cola[0];
	speechSynthesis.speak(element);						
	cola.shift();
}


// Función que nos permitirá locutar cualquier string enviado como parámetro
function hablar(data){					

	if(data!=undefined){			
		
		data=data.replace(/^\s+/,'').replace(/\s+$/,'');			
		cola = cola.concat(data);
		
		if(hablando==0){
			toSpeech();									
		}
	}else{
		texto=texto.replace(/^\s+/,'').replace(/\s+$/,'');			
		if(texto.substr(texto.length - 1)=="."){texto=texto.substring(0, texto.length-1);}
		var tmpArray = texto.split(".");
		cola = cola.concat(tmpArray);
		
		eventoFin=1;
		if(inicial){eventoFin=0;inicial=0;}
		
		if(hablando==0){
			toSpeech();
		}
	}

}


function pausar(){
	
	if(pausa){
		window.clearInterval(window.intervaloPause);								
		speechSynthesis.resume(element);
		hablando=1;
		pausa=0;
		console.log("playDirect")
		iniciarIntervalo();	
	}else{
		speechSynthesis.pause(element);								
		hablando=0;				
		pausa=1;
		window.clearInterval(window.intervaloAudio);	
		console.log("pause")
		
		
	window.intervaloPause = setInterval(function(){

			speechSynthesis.pause(window.element);
			hablando=0;
			console.log("pausado")
		//}
	}, 1000);								
						
	}
}



//==============================================================================
//		Funciones para la navegacion
//==============================================================================

function leerArticulo(){
	modoComentar=0;
	pararHablar();
	hablar();
	setTimeout(function(){$("html, body").scrollTop($("#contTexto").offset().top);},400)			
}

function pararHablar(){	
	eventoFin=0;
	cola=[];
	pausa=0;
	speechSynthesis.cancel(element);
}


function nuevaURL(){
	modoComentar=0;
	navegacion=0;
	pararHablar();
	resetEnlaces();
	procesar("nueva");
	$('input[name=campoBuscar]').val("");					
	$('input[name=campoBuscar]').focus();
	$('input[name=campoBuscar]').val("");
}		


function ayuda(){
	pararHablar();
	procesar("ayuda");
}	

function comentar(){
	pararHablar();
	modoComentar=1;	
	navegacion=0;			
	procesar("comentar");
	$('#player-inputHablar').val("");
	$('#player-inputHablar').focus();		
}			

function leerEnlaces(){
	pararHablar();
	modoComentar=0;
	navegacion=1;
	procesar("enlaces");
	setTimeout(function(){
		$('input[name=campoBuscar]').focus();
		$("html, body").scrollTop($("#contEnlaces").offset().top);
	},200);
}		

function seleccionEnlace(tecla){	
	
	if(navegacion==1){
		
		if(tecla=="up"){
			if(indiceEnlace ==-1 || indiceEnlace ==0){ indiceEnlace = enlacesCantidad-1; }
			else{indiceEnlace=indiceEnlace-1;}					
		}
		if(tecla=="down"){
			if( indiceEnlace == (enlacesCantidad-1) ){indiceEnlace=0}
			else{indiceEnlace=indiceEnlace+1;}
		}
		
		$(".flecha").removeClass("linkSelected nolink").addClass( "nolink" );
		divFlecha=".link_"+indiceEnlace;
		$( divFlecha ).removeClass("nolink").addClass( "linkSelected" );	
		
		pararHablar();
		hablar($(divFlecha).next().text());

	}	

}

function resetEnlaces(){
	$("#contEnlaces").empty();
	$("#textoRespuesta").empty();
	colaEnlaces=[]
	indiceEnlace=-1;
}



//==============================================================================
//		Dialogos predefinidos
//==============================================================================

	
function procesar(tipo){
	
	if(tipo=="saludo"){
		texto="Bienvenido, digite la URL y presione enter. Para detener audio, presione chift, más, dé";
		hablar();
	}else if(tipo=="procesando"){
		pararHablar();
		hablar("Procesando");
	}else if(tipo=="finarticulo"){
		hablar("Artículo finalizado, presione chift, más, ene para digitar una url nueva o presione chift, más, ese, para leer los enlaces");				
	}else if(tipo=="nueva"){
		hablar("digite una url nueva.");
	}else if(tipo=="ayuda"){
		hablar("Chift, más, déé, detener audio completamente.");
		hablar("Chift, más, espacio, pausar y continuar audio.");
		hablar("Chift, más, ene, ingresar nueva url.");
		hablar("Chift, más, ese, leer enlaces.");
		hablar("Para navegar entre enlaces, flecha arriba y flecha abajo");
		hablar("Chift, más, áá, leer artículo.");
		hablar("Chift, más, cé, escribir comentario.");

	}else if(tipo=="procesado"){
		hablar("Presione, chift, más, áá, para leer el artículo, chift, más, ese, para leer los enlaces");
	}else if(tipo=="comentar"){
		hablar("Digite el comentario y presione, chift, más, énter para enviarlo.");
	}else if(tipo=="enlaces"){
		hablar("Presione flechas abajo o arriba para navegar entre los enlaces disponibles");
	}else if(tipo=="noenlaces"){
		hablar("No hay enlaces disponibles, presione chift, más, áá, para leer el artículo");				
	}else if(tipo=="noarticulo"){
		hablar("No hay artículos disponibles, digite una url nueva");
		$('input[name=campoBuscar]').val("");
		$('input[name=campoBuscar]').focus();
	}													
}


//=================================================================
// 		Funciones GUI
//=================================================================	

function process(){
	procesar("procesando");
	$( "#procesando" ).show();				
}
function noProcess(){				
	$("#procesando" ).hide();
}

function append(){
	noProcess();
	// Texto to Speech
	var append = '<div id="textoRespuesta">'+texto+"</br></div>";
	$("#textoRespuesta").replaceWith(append);
	

}

function appendLinks(){

		$("#contEnlaces").empty();//Vaciamos lista de enlaces
		
		var objJsonLinks = linksJson.split(",,");
		
		enlacesCantidad=objJsonLinks.length;
		enlacesCantidadSave=enlacesCantidad;
		
		var key;
		var val;
		for (i=0;i<enlacesCantidad;i++){
			key=objJsonLinks[i].split("$$")[0];
			val=objJsonLinks[i].split("$$")[1];
		
			colaEnlaces.push(val); 
			var tmpLink= '<div class="contLink"><div id="flecha" class="flecha link_'+i+' nolink"></div><a href="'+val+'">'+key+'</a></div>'					
			$("#contEnlaces").append(tmpLink);

		}


	if(enlacesCantidadSave){
		hablar("Hay "+enlacesCantidadSave+" enlaces disponibles");
	}
	procesar("procesado");
	
}	


function resizeTextarea (id) {
  var a = document.getElementById(id);
  a.style.height = 'auto';
  a.style.height = a.scrollHeight+'px';
}

function initTextArea() {
  var a = document.getElementsByTagName('textarea');
  for(var i=0,inb=a.length;i<inb;i++) {
     if(a[i].getAttribute('data-resizable')=='true')
      resizeTextarea(a[i].id);
  }
}



//=================================================================		
//	Cuando se cargue el DOM y el TTS esté completo
//=================================================================

// Cuando se cargue el DOM, posicionamos el cursor en la caja de texto
$( document ).ready(function() {
	
	initTextArea();
	noProcess();		
	
	$('input[name=campoBuscar]').focus();
	
});

// Cuando el TTS esté listo, iniciamos el saludo
window.addEventListener('polymer-ready', function(e) {			
	procesar("saludo");
});
