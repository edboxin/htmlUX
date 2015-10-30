<?php

include('librerias/Readability.php');



$url = '';


	// Capturamos la url si es por GET
	if(isset($_GET['url'])){
		$url = $_GET['url'];
	}

	// Capturamos la url si es por POST
	if(isset($_POST["campoBuscar"]))
		$url = $_POST["campoBuscar"];

		
		
 // Añadir www a $target_url
$url = str_replace('www.','', $url);
if (strpos($url,'://') !== false){
	$url = str_replace('://','://www.', $url);
}else{
	$url = "www.".$url;
}
 
		
		

$userAgent = 'Googlebot/2.1 (http://www.googlebot.com/bot.html)';   
// Hacemos el CURL Request
$ch = curl_init();  
curl_setopt($ch, CURLOPT_USERAGENT, $userAgent);
curl_setopt($ch, CURLOPT_URL,$url);
curl_setopt($ch, CURLOPT_FAILONERROR, true);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
curl_setopt($ch, CURLOPT_AUTOREFERER, true);
curl_setopt($ch, CURLOPT_RETURNTRANSFER,true);
curl_setopt($ch, CURLOPT_TIMEOUT, 10);
$html= curl_exec($ch);


// Pasamos el html a Readability
$readability = new Readability\Readability($html, $url);
$result = $readability->init();

if ($result) {


    $titulo = $readability->getTitle()->textContent.". ";
	
	//Eliminamos caracteres especiales y dejamos solo utf8
	$titulo = preg_replace('/[^0-9\p{L}`_,;@#%&~\.\:\"\'\+\-\*\s\?\[\^\]\$\(\)\{\}\=\!\<\>\|\xBF\xA1\xAE\xA9\\\\]/u','',$titulo);
	$titulo = trim($titulo); // Eliminamos espacios del inicio y final del string
	$titulo = preg_replace('/\s+/', ' ', $titulo); // Reducimos multiples espacios en blanco a solo 1

	
	$articulo = $readability->getContent()->textContent;

	//Eliminamos caracteres especiales y dejamos solo utf8
	$articulo  = preg_replace('/[^0-9\p{L}`_,;@#%&~\.\:\"\'\+\-\*\s\?\[\^\]\$\(\)\{\}\=\!\<\>\|\xBF\xA1\xAE\xA9\\\\]/u','',$articulo );
	$articulo  = trim($articulo); // Eliminamos espacios del inicio y final del string
	$articulo  = preg_replace('/\s+/', ' ', $articulo); // Reducimos multiples espacios en blanco a solo 1
	
	
	echo $titulo;
    echo $articulo;
} else {
    echo 'No hay un articulo disponible';
}