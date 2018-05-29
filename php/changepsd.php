<?php
$_id = $_POST['id'];
$_type = $_POST['type'];
$_identity = $_POST['identity'];
$_opsd = $_POST['opsd'];
$_npsd = $_POST['npsd'];

// $_opsd = '4297f44b13955235245b2497399d7a93';//123123
// $_npsd = '4297f44b13955235245b2497399d7a93';	
// $_id = 81771;
// $_type = 1;
// $_identity = '2';

$_id = sprintf("%06d", $_id);
// echo $_id;
$link=mysqli_connect("localhost", "root", "937461995", "lng") or die("{\"code\":-1,\"msg\":\"连接数据库时出现错误！请联系系统管理员进行修复！\r\nerror code:".mysqli_connect_error()."\"}");

// change login password
if ($_type==1) {

	if ($_identity=="1") {
		$psdtype = 'loginpsd';
    	$target = 'companyinfo';
    }else if($_identity=="2"){
    	$psdtype = 'password';
    	$target = 'staffinfo';
    }	
}else if($_type==2){
	$psdtype = 'paypsd';
	$target = 'companyinfo';
}

$query="SELECT * FROM $target WHERE id = $_id AND $psdtype = '$_opsd'";
$checkpsd = mysqli_query($link, $query);

if(mysqli_num_rows($checkpsd)>0){
	$rst = mysqli_fetch_object($checkpsd);
	
	$updatepsd="UPDATE $target SET $psdtype = '$_npsd' WHERE id=$_id";	
	// echo $updatepsd;
	if (mysqli_query($link,$updatepsd)) {
	    mysqli_close($link);
	    echo "{\"code\":\"1\",\"msg\":\"密码修改成功！\"}";
	} else {
	    mysqli_close($link);
	    echo "{\"code\":\"-2\",\"msg\":\"语句执行失败！请联系系统管理员修复！\r\nerror code:".mysqli_error($link)."\"}";
	}
}else{
    mysqli_close($link);
    echo "{\"code\":\"0\",\"msg\":\"原密码输入错误！\"}";
}
