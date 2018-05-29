<?php
        header('Content-type:text/html;charset=utf-8');
$_id = $_POST['id'];
// $_photo = $_POST['photo'];

$base64_image_content = $_POST['photo'];
// $_id = 81771;

$_id = sprintf("%06d", $_id);
// echo $_id;
$link=mysqli_connect("localhost", "root", "937461995", "lng") or die("{\"code\":-1,\"msg\":\"连接数据库时出现错误！请联系系统管理员进行修复！\r\nerror code:".mysqli_connect_error()."\"}");

//将base64编码转换为图片保存
if (preg_match('/^(data:\s*image\/(\w+);base64,)/', $base64_image_content, $result)) {
    $type = $result[2];
    $new_photo = "../images/";
    if (!file_exists($new_photo)) {
        //检查是否有该文件夹，如果没有就创建，并给予最高权限
        mkdir($new_photo, 0700);
    }
    $img=time().mt_rand() . ".{$type}";
    $new_photo = $new_photo . $img;
    //将图片保存到指定的位置
    if (file_put_contents($new_photo, base64_decode(str_replace($result[1], '', $base64_image_content)))) {
		$query="SELECT identity FROM companyinfo WHERE id=$_id UNION ALL SELECT identity FROM staffinfo WHERE id=$_id;";
		$result=mysqli_query($link, $query);
		$p=mysqli_fetch_object($result);

		if ($p->identity=='1') {
			$target = "companyinfo";
		}else if($p->identity=='2'){
			$target = "staffinfo";
		}
		$setphoto = "UPDATE $target SET photo='$img'";

        if (mysqli_query($link, $setphoto)) {
		    mysqli_close($link);
		    echo "{\"code\":\"1\",\"msg\":\"头像修改成功！\"}";
		} else {
		    mysqli_close($link);
		    echo "{\"code\":\"-2\",\"msg\":\"语句执行失败！请联系系统管理员修复！\r\nerror code:".mysqli_error($link)."\"}";
		}
    }else{
        echo "{\"code\":\"-2\",\"msg\":\"图片上传失败！请联系系统管理员修复！\r\nerror code:".mysqli_error($link)."\"}";
    }
}else{
    echo "{\"code\":\"-3\",\"msg\":\"base64编码转换失败！请联系系统管理员修复！\r\nerror code:".mysqli_error($link)."\"}";
}
