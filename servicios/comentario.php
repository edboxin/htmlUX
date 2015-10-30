<?php 


	$target_url = "comentario de prueba";

	// Capturamos la url si es por GET
	if(isset($_GET['comentario'])){
		$target_url = $_GET['comentario'];
	}

	// Capturamos la url si es por POST
	if(isset($_POST["comentario"]))
		$target_url = $_POST["comentario"];

	
	$hoy = getdate();
	$time = $hoy["mday"]."-".$hoy["month"]."-".$hoy["year"]."      ".$hoy["hours"].".".$hoy["minutes"].".".$hoy["seconds"];

	
	$file = fopen("../log/$time  .txt", "w");
	fwrite($file, $target_url . PHP_EOL);
	fclose($file);
	
	echo "ok";
	
?>