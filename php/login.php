<?php
$_user=$_POST['user'];
$_psd=$_POST['psd'];

// $_user="ttt";
// $_psd="4297f44b13955235245b2497399d7a93";
$link=mysqli_connect("localhost", "root", "937461995", "lng") or die("{\"code\":\"-1\",\"msg\":\"连接数据库时出错！请联系系统管理员修复！\r\nerror code:".mysqli_connect_error()."\"}");
$query = "SELECT id,user,name,password,identity FROM staffinfo WHERE user='$_user' union all SELECT id,user,name,loginpsd,identity FROM companyinfo WHERE user='$_user'";

$result = mysqli_query($link, $query);
$db_user = mysqli_fetch_object($result);
$id = $db_user->id;
$psd = $db_user->password;
$user = $db_user->user;
$name = $db_user->name;
$identity = $db_user->identity;

$id = sprintf("%06d", $id);//不足6位则以0填充

mysqli_close($link);
if ($db_user && $psd==$_psd) {
    echo "{\"code\":\"1\",\"user\":\"" . $user . "\",\"name\":\"" . $name . "\",\"id\":\"$id\",\"identity\":" . $identity . "}";
} else {
    echo "{\"code\":\"0\",\"msg\":\"用户名或密码不正确！\"}";
}
