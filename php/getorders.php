<?php

$_id = $_GET['id'];
$_identity = $_GET['identity'];
// $_status = $_GET['status'];

// $_id = 81771;
// $_identity = '2';
// $_status = 0;

$_id = sprintf("%06d", $_id);
$link=mysqli_connect("localhost", "root", "937461995", "lng") or die("{\"code\":-1,\"msg\":\"连接数据库时出现错误！请联系系统管理员进行修复！\r\nerror code:".mysqli_connect_error()."\"}");
if ($_identity=='1') {
	
	$query = "SELECT * FROM orderinfo WHERE userid=$_id;";
}else{
	$query = "SELECT * FROM orderinfo WHERE staffID=$_id OR status=0;";
}

$result = mysqli_query($link, $query);
$rows = mysqli_num_rows($result);

if ($rows<1) {
	mysqli_close($link);
	echo "{\"code\":\"0\",\"msg\":\"无此类订单！\"}";
}else{
	$data = "[";
	for ($i = 1; $i <= $rows; $i++) {
	    $row = mysqli_fetch_object($result);

		if ($row->staffID!=0) {
			$querystaff = "SELECT * FROM staffinfo WHERE id=$row->staffID;";
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
	    $data .= "{\"id\":\"" . $row->id . "\",\"userid\":" . $row->userid . ",\"name\":\"" . $row->name . "\",\"tel\":\"" . $row->tel . "\",\"company\":\"" . $row->company . "\",\"address\":\"" . $row->address . "\",\"staffID\":" . $row->staffID . ",\"staffName\":\"" . $staffname . "\",\"staffTel\":\"" . $stafftel . "\",\"truck\":\"" . $truck . "\",\"produce\":\"" . $row->produce . "\",\"count\":" . $row->count . ",\"amount\":" . $row->amount . ",\"orderDate\":\"" . $row->orderDate . "\",\"finishDate\":\"" . $row->finishDate . "\",\"status\":" . $row->status . ",\"license\":\"" . $row->license . "\"}";
	    if ($i != $rows) {
	        $data .= ',';
	    }
	}

	$data .= "]";

	mysqli_close($link);
	echo $data;
	// echo "{\"code\":\"1\",\"msg\":\"订单查询成功！\"}";
}
