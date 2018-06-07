<?php 
	$_name=$_POST['name'];
	$_value=$_POST['value'];
	// setcookie(name,value,expire,path,domain,secure),path="/表示整个域名内有效"
	if ($_value=='true') {
		
		if(setcookie($_name, $_value, time()+3600*24*7,'/LNG/'))
		// if(setcookie($name, $value, time()+30))
			echo 1;
		else
			echo 0;
	}else{
		if(setcookie($_name, $_value, time()-3600*24,'/LNG/'))
		// if(setcookie($name, $value, time()+30))
			echo 1;
		else
			echo 0;
	}
?>