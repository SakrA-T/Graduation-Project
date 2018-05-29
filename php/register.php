<?php
$_user = $_POST['user'];
$_tel = $_POST['tel'];
$_psd = $_POST['psd'];
$_paypsd = $_POST['paypsd'];
$_identity = $_POST['identity'];
// $_user="test1";
// $_tel='13125558382';
// $_psd="4297f44b13955235245b2497399d7a93";
// $_identity = "1";

$link=mysqli_connect("localhost", "root", "937461995", "lng") or die("{\"code\":-1,\"msg\":\"连接数据库时出现错误！请联系系统管理员进行修复！\r\nerror code:".mysqli_connect_error()."\"}");

$query="SELECT user,tel FROM companyinfo WHERE tel='" . $_tel . "'" . " or user='" . $_user . "'" . " union all SELECT user,tel FROM staffinfo WHERE tel='" . $_tel . "'" . " or user='" . $_user . "'";

$result=mysqli_query($link, $query);
$p=mysqli_fetch_object($result);
if (isset($p->tel)||isset($p->user)) {//如果存在此用户名或手机号
    mysqli_close($link);
    echo "{\"code\":\"0\",\"msg\":\"此用户名或手机号已注册！\"}";
} else {
    $flag = true;
    while ($flag) {
        $id = random_int(1, 9999);
        // if ($_identity=="1") {
        $id = sprintf("%06d", $id);
        $checkid = "SELECT id FROM companyinfo WHERE id=$id union all SELECT id FROM staffinfo WHERE id=$id";
        // }else if($_identity=="2"){
            // $checkid = "SELECT id FROM staffinfo WHERE id=". $id;
        // }
        $checkrst=mysqli_query($link, $checkid);
        if (mysqli_num_rows($checkrst)<1) {
            $flag = false;
        }
    }
    if ($_identity=="1") {
        $insert="INSERT INTO companyinfo VALUES ($id,'$_identity','$_user','','$_tel','$_psd','$_paypsd','','',0,0,'default.jpg')";
    }else if($_identity=="2"){
        $insert="INSERT INTO staffinfo VALUES ($id,'$_identity','$_user','','$_tel','$_psd','',0,'default.jpg')";
    }
    if (mysqli_query($link, $insert)) {
        mysqli_close($link);
        echo "{\"code\":\"1\",\"msg\":\"注册成功！\"}";
    } else {
        mysqli_close($link);
        echo "{\"code\":\"-2\",\"msg\":\"出现未知错误！请联系系统管理员修复！\r\nerror code:".mysqli_error($link)."\"}";
    }
}
