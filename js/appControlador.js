
//===============================================================================================	
//===============================================================================================


//Cuando se envíe el formulario
$(function(){
	$("#formBuscar").submit(function(){
		enviarBusqueda()
		return false;				
	});
});			
		
		
// Buscamos el articulo, cuando finalice añadimos el artículo al DOM y llamamos los enlaces
function enviarBusqueda(){
	
	if(navegacion==0){
		process();
		$.ajax({
			type: "POST",
			url: "servicios/getSpeech.php",
			data: $("#formBuscar").serialize(),
			dataType: 'text',
			success: function(msg){
				resetEnlaces();
				texto=msg;
				append();
				getLinks();
			}
		});
		
		return false;
	}else if(navegacion==1){				
		$('input[name=campoBuscar]').val("");
		enlace=colaEnlaces[indiceEnlace];				
		$('input[name=campoBuscar]').val(enlace);			
		navegacion=0;
		resetEnlaces();
		setTimeout(function(){enviarBusqueda()},200);
	}
}



// Buscamos los enlaces, cuando finalice añadimos los enlaces al DOM
function getLinks(){
	$.ajax({
		type: "POST",
		url: "servicios/getLinks.php",
		data: $("#formBuscar").serialize(),
		dataType: 'text',
		success: function(msg){
			//alert("links_"+msg); // no me retorna correctamente los links
			linksJson=msg;					
			appendLinks();
		}
	});
	
	return false;
}


// Funcion que nos permitirá enviar comentarios
function enviarComentario(){
	$.ajax({
		type: "POST",
		url: "servicios/comentario.php",
		data: "comentario="+$("#player-inputHablar").val(),
		dataType: 'text',
		success: function(msg){
			$("#player-inputHablar").val("")
		}
	});
	
	return false;
}		

