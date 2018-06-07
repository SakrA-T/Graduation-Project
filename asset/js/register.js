$(document).ready(function() {
    var regbtn = $("#reg-btn"),
        tipbox = $("#reg_tip"),
        tiptext = $(".modal-body"),
        userbox = $("#username"),
        psdbox = $("#userpsd"),
        paypsdbox = $("#userpaypsd"),
        ckbox = $("#useragree"),
        identitybox = $("#r_select"),
        telbox = $("#usertel");

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
        // start: regFrom 表单验证
    identitybox.change(function(event) {
        var option = identitybox.find("option:selected");
        var identity = option.val();
        if (identity=='1') {
            paypsdbox.parent().removeClass('hide');
        }else{
            paypsdbox.parent().addClass('hide');
            paypsdbox.val('');
        }
    });
    $.validator.addMethod("usertest", function(value, element) {
        if (/\W/.test(value)) {
            return false;
        } else {
            return true;
        }
    }, "用户名由字母数字或下划线组成,不可出现奇怪字符");

    $("#regForm").validate({
        errorElement: "em",
        errorPlacement: function(error, element) {
            // $(element.parent("div").addClass("form-animate-error"));
            error.appendTo(element.parent("div"));
        },
        success: function(label) {
            // $(label.parent("div").removeClass("form-animate-error"));
        },
        focusCleanup: true,
        //如果是 true 那么当未通过验证的元素获得焦点时，移除错误提示
        onkeyup: false, //在 keyup 时验证
        rules: {
            username: {
                required: true,
                usertest: true
            },
            usertel: {
                required: true,
                digits: true,
                minlength: 11
            },
            r_select: {
                required: true
            },
            userpaypsd: {
                required: true
            },
            userpsd: {
                required: true,
                rangelength: [6, 16]
            },
            useragree: "required"
        },
        messages: {
            username: {
                required: "请输入用户名,由字母数字或下划线组成"
            },
            r_select: {
                required: "请选择注册身份"
            },
            userpsd: {
                required: "请设置6-16位登录密码",
                rangelength: "密码不少于6位,不多于16位"
            },
            userpaypsd:{
                required: "请设置6-16位支付密码"
            },
            usertel: {
                required: "请输入11位手机号",
                digits: "请输入正确的手机号码",
                minlength: "请输入11位手机号"
            },
            useragree: "请同意条款及政策"
        }
    });
    $('#r_select').selectpicker({
        noneSelectedText: '请选择'
    });
    $("form").submit(function() {
        // regbtn.click(function()){
        // tipbox.css('color', '#F63B3B');
        tipstate(false);
        // console.log("yes");
        if ($("#regForm").valid()) {
            var user = userbox.val(),
                psd = hex_md5(psdbox.val()),
                paypsd = '',
                tel = telbox.val(),
                identity = identitybox.find('option:selected').val();
            if (!!paypsdbox.val()) {
                paypsd = hex_md5(paypsdbox.val());
            }
            console.log(user+','+psd+','+paypsdbox.val()+','+paypsd+','+identity+','+tel);
            // console.log(typeof identity +'and'+typeof tel);


            //注册按钮设为禁用
            regbtn.addClass('disabled');
            regbtn.attr('disabled', 'disabled');
            //请求注册
            $.post('php/register.php', {
                    user: user,
                    tel: tel,
                    psd: psd,
                    paypsd: paypsd,
                    identity: identity
                },
                function(data, textStatus, xhr) {
                    var msg = JSON.parse(data).msg;
                    switch (JSON.parse(data).code) {
                        case "1": //注册成功
                            // tipbox.css('color', '#257FD8');
                            tiptext.text(msg);
                            tipstate(true);
                            // regbtn.removeClass('disabled');
                            regbtn.removeAttr('disabled');
                            // setTimeout(function() {
                            //     location.href = "login.html";
                            // }, 1000);
                            tipbox.on('hidden.bs.modal', function () {
							  location.href = "login.html";
							})
                            break;
                        case "0": //用户名or手机号已被注册
                            tiptext.text(msg);
                            tipstate(true);
                            // regbtn.removeClass('disabled');
                            regbtn.removeAttr('disabled');
                            break;
                        case "-1": //连接数据库失败
                            alert(msg);
                            // regbtn.removeClass('disabled');
                            regbtn.removeAttr('disabled');
                            break;
                        case "-2": //执行查询语句失败
                            alert(msg);
                            // regbtn.removeClass('disabled');
                            regbtn.removeAttr('disabled');
                            break;
                        default:
                            alert("出现未知错误！请联系系统管理员修复！");
                            // regbtn.removeClass('disabled');
                            regbtn.removeAttr('disabled');
                            break;
                    }
                });
            //IE浏览器会多弹出一个页面，需要return false，否则表单会自己再提交一次
            return false;
        }
    });
});