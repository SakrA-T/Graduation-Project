<?php
$_id = $_POST['id'];
$_user = $_POST['user'];
$_name = $_POST['name'];
$_tel = $_POST['tel'];
$_identity = $_POST['identity'];

// $_id = 81771;
// $_user = "ttt";
// $_name = "张小明";
// $_tel = "15857325443";
// $_identity = "2";

$_id = sprintf("%06d", $_id);
$link=mysqli_connect("localhost", "root", "937461995", "lng") or die("{\"code\":-1,\"msg\":\"连接数据库时出现错误！请联系系统管理员进行修复！\r\nerror code:".mysqli_connect_error()."\"}");

// intval ($_id)
if ($_identity=="1") {
	$_money = $_POST['money'];
	$_company = $_POST['company'];
	$_address = $_POST['address'];
	$query = "SELECT wallet FROM companyinfo WHERE id=$_id;";
	// echo $query;
	$result = mysqli_query($link, $query);
	$db_user = mysqli_fetch_object($result);
	$wallet = $db_user->wallet+$_money;
	$setinfo = "UPDATE companyinfo SET user='$_user',name='$_name',tel='$_tel',wallet=$wallet,company='$_company',address='$_address' WHERE id=$_id";
}else if ($_identity=="2") {
	$_truck = $_POST['truck'];
	// $_truck = "浙E76543";
	$setinfo = "UPDATE staffinfo SET user='$_user',name='$_name',tel='$_tel',truck='$_truck' WHERE id=$_id";
}

if (mysqli_query($link, $setinfo)) {
    mysqli_close($link);
    echo "{\"code\":\"1\",\"msg\":\"用户信息修改成功！\"}";
} else {
    mysqli_close($link);
    echo "{\"code\":\"-2\",\"msg\":\"语句执行失败！请联系系统管理员修复！\r\nerror code:".mysqli_error($link)."\"}";
}
