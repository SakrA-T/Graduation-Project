$(document).ready(function() {
    var lgbtn = $("#login_btn"),
        usnbox = $("#username"),
        psdbox = $("#userpsd"),
        checkbox = $("#useragree"),
        tipbox = $("#login_tip");
    var addrs=['company.html','staff.html'];
    var pathname = window.location.pathname;
    var tipstate = function(flag) {
        if (flag) {
            tipbox.modal('show');
        } else {
            tipbox.modal('hide');
        }
    }
    $('#tipbox').on('hide.bs.modal', function() {
            lgbtn.removeAttr('disabled');
        })
    console.log($.cookie());
    $("form").submit(function() {

        if($("#loginForm").valid()){
        var username = usnbox.val();
        var password = hex_md5(psdbox.val());
        // lgbtn.addClass('disabled');
        lgbtn.attr('disabled', 'disabled');
        console.log(username + ',' + password);
        $.post('php/login.php', {
                //提交用户名密码,md5加密密码
                user: username,
                psd: password
            },
            function(data, textStatus, xhr) {
                switch (JSON.parse(data).code) {
                    case "0":
                        //用户名或密码错误
                        tipbox.modal('show');
                        console.log(JSON.parse(data).msg);

                        lgbtn.removeAttr('disabled');
                        break;
                    case "1"://登录成功

                        //设置7天免登录
                        if (checkbox.is(':checked')) {
                            console.log(JSON.parse(data).id);
                            $.post('php/set_cookie.php', {
                                name: JSON.parse(data).id,
                                value: true
                            }, function(data, textStatus, xhr) {
                                if (data == "0")
                                    alert("设置免登录时出现错误！请联系系统管理员修复！");
                            });
                            console.log($.cookie());
                        }
                        setTimeout(function() {
                            location.href = addrs[JSON.parse(data).identity-1] + "?id=" + JSON.parse(data).id;
                        }, 500);
                        break;
                    case "-1":
                        //连接数据库出错
                        lgbtn.removeAttr('disabled');
                        alert(JSON.parse(data).msg);
                        break;
                    default:
                        lgbtn.removeAttr('disabled');
                        alert("出现未知错误！请联系系统管理员修复！");
                        break;
                }
            });
        }
    });
});