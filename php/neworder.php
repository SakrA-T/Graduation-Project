<?php
$_userid = $_POST['userid'];
$_user = $_POST['user'];
$_name = $_POST['name'];
$_tel = $_POST['tel'];
$_company = $_POST['company'];
$_address = $_POST['address'];
$_code = $_POST['code'];
$_produce = $_POST['produce'];
$_count = $_POST['count'];
$_unit = $_POST['unit'];
$_amount = $_POST['amount'];
$_paypsd = $_POST['paypsd'];
$_status = $_POST['status'];
// $_count = intval($_count);

// $_userid = 927190;
// $_user = 'test2';
// $_name = '李小强';
// $_tel = '13112457555';
// $_company = '宁波阿诺丹机械有限公司';
// $_address = '浙江省宁波市宁海县深甽镇凤山北路55号';
// $_produce = 'LNG2';
// $_code = 'p2';
// $_count = 1;
// $_paypsd = '4297f44b13955235245b2497399d7a93';
// $_amount = 230;
// $_status = 0;

$_userid = sprintf("%06d", $_userid);

$link=mysqli_connect("localhost", "root", "937461995", "lng") or die("{\"code\":-1,\"msg\":\"连接数据库时出现错误！请联系系统管理员进行修复！\r\nerror code:".mysqli_connect_error()."\"}");

$query = "SELECT wallet FROM companyinfo WHERE id=$_userid AND paypsd='$_paypsd';";

$rows = mysqli_query($link, $query);
if (mysqli_num_rows($rows)<1) {
    mysqli_close($link);
    echo "{\"code\":\"0\",\"msg\":\"支付密码错误！\"}";
}else{
    $sq="SELECT stock FROM produce WHERE code='$_code';";
    $stockrst=mysqli_query($link, $sq);
    $db_produce=mysqli_fetch_object($stockrst);
    $stock = $db_produce->stock-$_count;
    if ($stock>=0) {
        $updatestock = "UPDATE produce SET stock=$stock WHERE code='$_code';";

        $db_user=mysqli_fetch_object($rows);
        $money = $db_user->wallet-$_amount;
        if ($money>=0) {
            
            $update = "UPDATE companyinfo SET wallet=$money,orderNo=orderNo+1 WHERE id=$_userid;";
            if (!mysqli_query($link, $update)||!mysqli_query($link, $updatestock)) {
                mysqli_close($link);
                echo "{\"code\":\"-2\",\"msg\":\"更新语句执行失败！请联系系统管理员修复！\r\nerror code:".mysqli_error($link)."\"}";
            }else{
                $flag = true;
                while ($flag) {
                    $rand = random_int(1, 9999);
                    $rand = sprintf("%04d", $rand);
                    $id = date("Ymd") . $rand;
                    // echo gettype($id); //string
                    $checkid = "SELECT id FROM orderinfo WHERE id='$id'";

                    $checkrst=mysqli_query($link, $checkid);
                    if (mysqli_num_rows($checkrst)<1) {
                        $flag = false;
                    }
                }
                // 2018.5.25修改
                $orderDate = date("Y-m-d");
                $date=date_create("2000-01-01");
                $finishDate = date_format($date,"Y-m-d");
                $license = substr(md5($id),8,16); //16位加密
                // intval ($_id)

                $insert="INSERT INTO orderinfo VALUES ('$id',$_userid,'$_name','$_tel','$_company','$_address',0,'$_code',$_count,$_amount,'$orderDate','$finishDate',$_status,'$license')";
                // echo $insert;
                if (mysqli_query($link, $insert)) {
                    mysqli_close($link);
                    echo "{\"code\":\"1\",\"msg\":\"下单成功！\"}";
                } else {
                    mysqli_close($link);
                    echo "{\"code\":\"-2\",\"msg\":\"语句执行失败！请联系系统管理员修复！\r\nerror code:".mysqli_error($link)."\"}";
                }
            }
        }else{
            mysqli_close($link);
            echo "{\"code\":\"0\",\"msg\":\"预存金额不足！\"}";
        }
    }else{
        mysqli_close($link);
        echo "{\"code\":\"0\",\"msg\":\"库存不足！\"}";
    }
}
