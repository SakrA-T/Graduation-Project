<?php

$_id = $_GET['id'];
$_orderid = $_GET['orderid'];
$_identity = $_GET['identity'];

// $_id = 3278;
// $_identity = '1';
// $_orderid = 201805264064;

$_id = sprintf("%06d", $_id);
$link=mysqli_connect("localhost", "root", "937461995", "lng") or die("{\"code\":-1,\"msg\":\"连接数据库时出现错误！请联系系统管理员进行修复！\r\nerror code:".mysqli_connect_error()."\"}");
if ($_identity=='1') {
	
	$query = "SELECT * FROM orderinfo WHERE userid=$_id AND id=$_orderid;";
}else{
	$query = "SELECT * FROM orderinfo WHERE (staffID=$_id AND id=$_orderid) OR (id=$_orderid AND status=0);";
}

$result = mysqli_query($link, $query);

if (mysqli_num_rows($result)<1) {
	mysqli_close($link);
	echo "{\"code\":\"0\",\"msg\":\"无此类订单！\"}";
}else{
	$db_order= mysqli_fetch_object($result);
	$querypd = "SELECT * FROM produce WHERE code='$db_order->produce';";
	$producerst = mysqli_query($link, $querypd);
	$db_produce = mysqli_fetch_object($producerst);
	// $querycp = "SELECT * FROM companyinfo WHERE id=$db_order->userid;";
	// $companyrst = mysqli_query($link, $querycp);
	// $db_company = mysqli_fetch_object($companyrst);
	if ($db_order->staffID!=0) {
		$querystaff = "SELECT * FROM staffinfo WHERE id=$db_order->staffID;";
		$staffrst = mysqli_query($link, $querystaff);
		$db_staff= mysqli_fetch_object($staffrst);
		$staffname=$db_staff->name;
		$stafftel=$db_staff->tel;
		$truck=$db_staff->truck;
	}else{
		$staffname='-';
		$stafftel='-';
		$truck='-';
	}
	$data = "{\"id\":\"" . $db_order->id . "\",\"userid\":" . $db_order->userid . ",\"name\":\"" . $db_order->name . "\",\"tel\":\"" . $db_order->tel . "\",\"company\":\"" . $db_order->company . "\",\"address\":\"" . $db_order->address . "\",\"staffID\":" . $db_order->staffID . ",\"staffName\":\"" . $staffname . "\",\"staffTel\":\"" . $stafftel . "\",\"truck\":\"" . $truck . "\",\"produce\":\"" . $db_produce->name . "\",\"count\":" . $db_order->count . ",\"unit\":\"" . $db_produce->unit . "\",\"amount\":" . $db_order->amount . ",\"orderDate\":\"" . $db_order->orderDate . "\",\"finishDate\":\"" . $db_order->finishDate . "\",\"status\":" . $db_order->status . ",\"license\":\"" . $db_order->license . "\"}";

	mysqli_close($link);
	echo $data;
	// echo "{\"code\":\"1\",\"msg\":\"订单查询成功！\"}";
}
