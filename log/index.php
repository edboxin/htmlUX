<?php
$directorio = opendir("."); //ruta actual
while ($archivo = readdir($directorio)) //obtenemos un archivo y luego otro sucesivamente
{
    if (is_dir($archivo))//verificamos si es o no un directorio
    {
        //echo "[".$archivo . "]<br />"; //de ser un directorio lo envolvemos entre corchetes
    }
    else
    {	
		if($archivo=="index.php"){}
		else{
			echo "<a target='_blank' href='".$archivo ."'>".$archivo."</a><br />";
		}
        
    }
}
?>