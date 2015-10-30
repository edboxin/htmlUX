// EVENTOS DE TECLADO
		
var shiftPressed = false;
var teclaShift = 16, k_enter = 13, k_a = 65, k_s =83, k_n =78, k_h =72, k_d=68, k_space=32, k_up=38, k_down=40, k_c=67,k_1=49,k_2=50;


// AL PRESIONAR UNA TECLA
$(document).keydown(function(e){

  if (e.keyCode == teclaShift){
	shiftPressed = true;
	$('input[name=campoBuscar]').blur();
	$("#tecla_sh").addClass( "pressed" );
  }

  if (e.keyCode == k_1) $("#tecla_1").addClass( "pressed" );
  if (e.keyCode == k_2) $("#tecla_2").addClass( "pressed" );
  if (e.keyCode == k_a) $("#tecla_a").addClass( "pressed" );
  if (e.keyCode == k_c) $("#tecla_c").addClass( "pressed" );
  if (e.keyCode == k_s) $("#tecla_s").addClass( "pressed" );
  if (e.keyCode == k_d) $("#tecla_d").addClass( "pressed" );
  if (e.keyCode == k_n) $("#tecla_n").addClass( "pressed" );
  if (e.keyCode == k_h) $("#tecla_h").addClass( "pressed" );
  if (e.keyCode == k_space) $("#tecla_space").addClass( "pressed" );
  if (e.keyCode == k_up) $("#tecla_up").addClass( "pressed" );
  if (e.keyCode == k_down) $("#tecla_down").addClass( "pressed" );		  


  // FUNCIONES AL COMBINAR TECLAS
  if (shiftPressed){
	  if (modoComentar==1 && (e.keyCode == k_enter)) {
		pararHablar();
		modoComentar=0;
		hablar("Su mensaje ha sido enviado. Gracias por comentar.");
		setTimeout(function(){$('input[name=campoBuscar]').focus();},200)		
		enviarComentario();
	  }			
  }
  
  if (shiftPressed && (e.keyCode == k_a)) {leerArticulo(); leyendoArticulo=1}
  else if (shiftPressed && (e.keyCode == k_s)) {leerEnlaces();}
  else if (shiftPressed && (e.keyCode == k_d)) {pararHablar();leyendoArticulo=0}
  else if (shiftPressed && (e.keyCode == k_n)) nuevaURL();
  else if (shiftPressed && (e.keyCode == k_c)) comentar();
  else if (shiftPressed && (e.keyCode == k_h)) ayuda();
  else if (shiftPressed && (e.keyCode == k_space)) pausar();	
  else if (navegacion==1 && (e.keyCode == k_up)) seleccionEnlace("up");	
  else if (navegacion==1 && (e.keyCode == k_down)) seleccionEnlace("down");		  
					  
  
});



// AL SOLATR UNA TECLA

$(document).keyup(function(e){

if (e.keyCode == teclaShift){

	if (leyendoArticulo){}// Si estamos leyendo el articulo, no hacer caso
	else{
	
		if(modoComentar==1){
			$('#player-inputHablar').val("");
			$('#player-inputHablar').focus();
		}else{
			$('input[name=campoBuscar]').focus();
		}
   }

	
	$(".tecla").removeClass("pressed");
	shiftPressed = false;
  }
  if (e.keyCode == k_1) $("#tecla_1").removeClass( "pressed" );
  if (e.keyCode == k_2) $("#tecla_2").removeClass( "pressed" );		  		  
  if (e.keyCode == k_a) $("#tecla_a").removeClass( "pressed" );
  if (e.keyCode == k_c) $("#tecla_c").removeClass( "pressed" );		  
  if (e.keyCode == k_s) $("#tecla_s").removeClass( "pressed" );
  if (e.keyCode == k_d) $("#tecla_d").removeClass( "pressed" );
  if (e.keyCode == k_n) $("#tecla_n").removeClass( "pressed" );
  if (e.keyCode == k_h) $("#tecla_h").removeClass( "pressed" );
  if (e.keyCode == k_space) $("#tecla_space").removeClass( "pressed" );
  if (e.keyCode == k_up) $("#tecla_up").removeClass( "pressed" );
  if (e.keyCode == k_down) $("#tecla_down").removeClass( "pressed" );	  		  
  
  
  if (shiftPressed && (e.keyCode == k_n)) {$('input[name=campoBuscar]').val("");}
  if (shiftPressed && (e.keyCode == k_c)) {$('#player-inputHablar').val("");$('#player-inputHablar').focus();}
  
});
