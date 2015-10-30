<?php


//header('Content-Type: text/plain; charset=utf-8');

$target_url = "eltiempo.com";
$target_url = "uelbosque.edu.co";



// Capturamos la url si es por GET
if(isset($_GET['url'])){
	$target_url = $_GET['url'];
}

// Capturamos la url si es por POST
if(isset($_POST["campoBuscar"]))
	$target_url = $_POST["campoBuscar"];

 
 
 // Añadir www a $target_url
$target_url = str_replace('www.','', $target_url);
if (strpos($target_url,'://') !== false){
	$target_url = str_replace('://','://www.', $target_url);
}else{
	$target_url = "www.".$target_url;
}
 


 
 
//---------------------------------------------------------------------------------------
// FUNCIONES
//---------------------------------------------------------------------------------------

// Me entrega el subdominio ejmplo -> correo.abc.com.co   ==   abc.com.co
function get_domain($url)
{
  $pieces = parse_url($url);
  $domain = isset($pieces['host']) ? $pieces['host'] : '';
  if (preg_match('/(?P<domain>[a-z0-9][a-z0-9\-]{1,63}\.[a-z\.]{2,6})$/i', $domain, $regs)) {
    return $regs['domain'];
  }
  return false;
}
   





$userAgent = 'Googlebot/2.1 (http://www.googlebot.com/bot.html)';   
   

// CURL
$ch = curl_init();  
curl_setopt($ch, CURLOPT_USERAGENT, $userAgent);
curl_setopt($ch, CURLOPT_URL,$target_url);
curl_setopt($ch, CURLOPT_FAILONERROR, true);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
curl_setopt($ch, CURLOPT_AUTOREFERER, true);
curl_setopt($ch, CURLOPT_RETURNTRANSFER,true);
curl_setopt($ch, CURLOPT_TIMEOUT, 10);
$html= utf8_decode(curl_exec($ch));


if (!$html) {
	echo "<br />cURL error number:" .curl_errno($ch);
	echo "<br />cURL error:" . curl_error($ch);
	exit;
}


//------------------------------------------------------------------------------------;

 
$full=curl_getinfo($ch);
$full=$full["url"];
$scheme = parse_url($full);
$scheme = $scheme["scheme"];
$host = parse_url($full);
$host = $host["host"];
$path = parse_url($full);
$path = $path["path"];


$split = explode("/", $path);
$last = $split[count($split)-1];
$base = $scheme."://".$host."".$path;

if (strlen($last) > 0 ){
	$base = str_replace($last,'', $base);
}

// URL Base
$base = strtolower($base);
// Domimio
$dominio = get_domain($scheme."://".$host);

curl_close($ch); 

//------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------



// Convertimos HTML
$dom = new DOMDocument();
@$dom->loadHTML($html);

// cAPTURAMOS TODAS LAS ETIQUETA <a>
$xpath = new DOMXPath($dom);
$hrefs = $xpath->evaluate("/html/body//a");

$salto="";
if(isset($_GET['url'])){
	$salto="<br>";
}
$return="";

for ($i = 0; $i < $hrefs->length; $i++) {
	
	$href = $hrefs->item($i);			
	$url = $href->getAttribute('href');
	$txt = $href->nodeValue;
	
	// Mapa de carácteres especiales que permitiremos
	
	// 	\xBF  ->  ¿
	// 	\xA1  ->  ¡
	// 	\xAE  ->  ®
	// 	\xA9  ->  ©	

	//Eliminamos caracteres especiales y dejamos solo utf8
	$txt = preg_replace('/[^0-9\p{L}`_,;@#%&~\.\:\"\'\+\-\*\s\?\[\^\]\$\(\)\{\}\=\!\<\>\|\xBF\xA1\xAE\xA9\\\\]/u','',$txt);
	
	
	$txt = trim($txt); // Eliminamos espacios del inicio y final del string
	$txt = preg_replace('/\s+/', ' ', $txt); // Reducimos multiples espacios en blanco a solo 1
	
	
	// Si es un enlace javascript, no lo imprimimos
	if (strpos($url,'javascript') === false){// false es que si existe
		
		// Si es mayor a 1
		if(strlen($txt)>1 and strlen($url)>1){
			if (strpos($url,'http') !== false or strpos($url,'www') !== false ){// false es que si existe				
				if (strpos($url,$dominio) !== false){// si esta en el mismo dominio imprimimos
					if (strpos($return,$url) !== false){}// si el link ya existe
					else{
						$return=$return.$txt.'$$'.$url.',,'.$salto;
					}
				}
			}else{
				if($url[0]=="/"){$url = ltrim ($url, '/');}// si la url tiene / al comienzo
				if (strpos($return,$url) !== false){}// si el link ya existe
				else{				
					$return=$return.$txt.'$$'.$base."/".$url.',,'.$salto;
				}
			}
			
		}
	}
	
}

if(isset($_GET['url'])){
	$return = str_replace("$$",'  < --- >  ', $return);
	$return = str_replace(",,",'', $return);
}else{
	$return = substr($return, 0, -2);
}


$return=$return.'';

// Retornamos enlaces
echo $return;


?>
