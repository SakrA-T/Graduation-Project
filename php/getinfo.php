<?php
$_id=$_GET['userid'];
$_identity = $_GET['identity'];
// $_id=927190;
// $_psd="4297f44b13955235245b2497399d7a93";
// $_identity = "1";
// intval ($_id)
$_id = sprintf("%06d", $_id);
$link=mysqli_connect("localhost", "root", "937461995", "lng") or die("{\"code\":-1,\"msg\":\"连接数据库时出现错误！请联系系统管理员进行修复！\r\nerror code:".mysqli_connect_error()."\"}");
if ($_identity == '1') {
	$query="SELECT * from companyinfo where id = $_id";
}else if($_identity == '2'){
	$query="SELECT * from staffinfo where id = $_id";
}

$result = mysqli_query($link, $query);

if (mysqli_num_rows($result)<1) {
	mysqli_close($link);
    echo "{\"code\":\"0\",\"msg\":\"用户不存在,请重新登录！\"}";
}else{
	$db_user= mysqli_fetch_object($result);

	if ($_identity == '1') {
		$data = "{\"identity\":\"" . $db_user->identity . "\",\"user\":\"" . $db_user->user . "\",\"name\":\"" . $db_user->name . "\",\"loginpsd\":\"" . $db_user->loginpsd . "\",\"paypsd\":\"" . $db_user->paypsd . "\",\"tel\":\"" . $db_user->tel . "\",\"company\":\"" . $db_user->company . "\",\"address\":\"" . $db_user->address . "\",\"ordercount\":" . $db_user->orderNo . ",\"money\":" . $db_user->wallet . ",\"photo\":\"" . $db_user->photo . "\"}";
	}else if($_identity == '2'){
		$data = "{\"identity\":\"" . $db_user->identity . "\",\"user\":\"" . $db_user->user . "\",\"name\":\"" . $db_user->name . "\",\"loginpsd\":\"" . $db_user->loginpsd . "\",\"tel\":\"" . $db_user->tel . "\",\"truck\":\"" . $db_user->truck . "\",\"ordercount\":" . $db_user->orderNo . ",\"photo\":\"" . $db_user->photo . "\"}";
	}

	mysqli_close($link);
	// echo "{\"code\":\"0\",\"msg\":\"用户信息查询成功！\"}";
	echo $data;
}
// echo $id;