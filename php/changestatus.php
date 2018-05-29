<?php

$_id = $_POST['id'];
$_orderid = $_POST['orderid'];
$_status = $_POST['status'];
$_type = $_POST['type'];
$_identity = $_POST['identity'];

// $_id = 6634;
// $_orderid = '201805264583';
// $_status = 0;
// $_type = 3;
// $_identity = 2;

$_id = sprintf("%06d", $_id);
$link=mysqli_connect("localhost", "root", "937461995", "lng") or die("{\"code\":-1,\"msg\":\"连接数据库时出现错误！请联系系统管理员进行修复！\r\nerror code:".mysqli_connect_error()."\"}");

$query = "SELECT * FROM orderinfo WHERE id='$_orderid' AND status=$_status;";
$result = mysqli_query($link, $query);
if (mysqli_num_rows($result)<1) {
	mysqli_close($link);
	echo "{\"code\":\"0\",\"msg\":\"订单信息错误，请刷新！\"}";
}else{
	$db_order= mysqli_fetch_object($result);
	switch ($_type) {
		case 1: //cancel
			$update = "UPDATE orderinfo SET status=5 WHERE userid=$_id AND id='$_orderid';";
			$restock = "UPDATE produce SET stock=stock+$db_order->count WHERE code='$db_order->produce';";
			$rewallet = "UPDATE companyinfo SET wallet=wallet+$db_order->amount WHERE id=$db_order->userid;";
			break;
		case 2: //finish
			$finishDate = date("Y-m-d");
			$update = "UPDATE orderinfo SET status=4,finishDate='$finishDate' WHERE userid=$_id AND id='$_orderid';";
			break;
		case 3: //ordertake
			// $_staffname = $_POST['staffname'];
			// $_stafftel = $_POST['stafftel'];
			// $_truck = $_POST['truck'];
			$update = "UPDATE orderinfo SET status=1,staffID=$_id WHERE status=0 AND id='$_orderid';";
			$setinfo = "UPDATE staffinfo SET orderNo=orderNo+1 WHERE id=$_id;";
			break; 
		case 4: //delivery
			$update = "UPDATE orderinfo SET status=2 WHERE staffID=$_id AND id='$_orderid';";
			break;
		case 5: //delivered
			$update = "UPDATE orderinfo SET status=3 WHERE staffID=$_id AND id='$_orderid';";
			break;
		default:
			mysqli_close($link);
			echo "{\"code\":\"-1\",\"msg\":\"数据提交错误！\"}";
			break;
	}

	if (mysqli_query($link, $update)) {
		if ($_type==1) {
			mysqli_query($link, $restock);
			mysqli_query($link, $rewallet);
		}
		if ($_type==3) {
			mysqli_query($link, $setinfo);
		}
	    mysqli_close($link);
	    echo "{\"code\":\"1\",\"msg\":\"操作成功！\"}";
	} else {
	    mysqli_close($link);
	    echo "{\"code\":\"-2\",\"msg\":\"语句执行失败！请联系系统管理员修复！\r\nerror code:".mysqli_error($link)."\"}";
	}
}
