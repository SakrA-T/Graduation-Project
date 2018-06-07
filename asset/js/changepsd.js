$(document).ready(function() {
    var tipbox = $("#changepsd_tip"),
        tiptext = $(".modal-body"),
        navusbox = $(".z-navuser"),
    	cphotobox = $(".img-circle"),
        olpsdbox = $("#original_psd"),
        nlpsdbox = $("#new_psd"),
        oppsdbox = $("#original_paypsd"),
        nppsdbox = $("#new_paypsd"),
        ospsdbox = $("#original_s_psd"),
        nspsdbox = $("#new_s_psd"),
        savelpbtn = $("#save_loginpsd"),
        saveppbtn = $("#save_paypsd"),
        savespbtn = $("#save_s_psd"),
        useridentity = $(".g-changepsd").data('identity')||$(".m-changepsd").data('identity');
    console.log(useridentity);
    // 模态框 
    var tipstate = function(flag) {
        if (flag) {
            tipbox.modal('show');
        } else {
            tipbox.modal('hide');
        }
    }
    var addrs = [];
    if (useridentity==1) {
        addrs=["company.html","orderform.html","neworder.html","companyinfo.html","changepsd.html"];
    }else if (useridentity==2) {
        addrs=["staff.html","orderform2.html","staffinfo.html","changepsd2.html"];
    }
    // logincookie = $.cookie('the_cookie');

    var pathname = window.location.pathname;
    // console.log(pathname);

    //获取url中的参数
    function getUrlParam(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
        var r = window.location.search.substr(1).match(reg); //匹配目标参数
        if (r != null) return unescape(r[2]);
        return null; //返回参数值
    }
    var urlid = getUrlParam("id") || "";//此处取得的id和cookie中的同为string
    // console.log(urlid + ":"+typeof urlid);
    var logincookie = $.cookie(urlid);
    // urlid = parseInt(urlid);
    console.log(urlid +","+logincookie);
    console.log($.cookie());
    
    var changeAddr = function(index) {
        if (urlid != "") {
            window.location.href = addrs[index] + "?id=" + urlid;
        } else {
            window.location.href = addrs[index];
        }
    }
    $('.z-page0').click(function(event) {
        changeAddr(0);
    });
    $('.z-page1').click(function(event) {
        changeAddr(1);
    });
    $('.z-page2').click(function(event) {
        changeAddr(2);
    });
    $('.z-page3').click(function(event) {
        changeAddr(3);
    });
    $('.z-page4').click(function(event) {
        changeAddr(4);
    });
    // start: 信息获取
    $(function() {
        if (urlid && logincookie!=null) {
            $.get('php/getinfo.php', {
                    //提交用户名密码,md5加密密码
                    userid: urlid,
                    identity: useridentity
                },
                function(data, textStatus, xhr) {
                    navusbox.text(JSON.parse(data).user);
                    cphotobox.attr("src", "images/" + JSON.parse(data).photo);
                });
            }
        else{
        	tiptext.text('请先登录！');
            tipstate(true);
            setTimeout(function() {
                location.href = "login.html";
            }, 1000);
        }
    });

    // 3个密码修改表单
    $("#loginpsdForm").validate({
        errorElement: "em",
        errorPlacement: function(error, element) {
          $(element.parent("div").addClass("form-animate-error"));
          error.appendTo(element.parent("div"));
        },
        success: function(label) {
          $(label.parent("div").removeClass("form-animate-error"));
        },
        focusCleanup: true,
            //如果是 true 那么当未通过验证的元素获得焦点时，移除错误提示
        onkeyup: false,//在 keyup 时验证
        rules: {
          original_psd: {
              required: true,
              minlength: 6
          },
          new_psd: {
              required: true,
              minlength: 6
          },
          confirm_psd: {
              required: true,
              minlength: 6,
              equalTo: "#new_psd"
          },
          login_vcode: {
            required: true,
          }
        },
        messages: {
          original_psd: {
            required: "请输入正确的原登录密码",
            minlength: "密码不少于6位,不多于16位"
          },
          new_psd: {
            required: "请输入新登录密码",
            minlength: "密码不少于6位,不多于16位"
          },
          confirm_psd: {
            required: "请输入新登录密码",
            minlength: "密码不少于6位,不多于16位",
            equalTo: "请输入相同的密码"
          },
          login_vcode: {
            required: "请输入正确的验证码"
          }
        },
        submitHandler: function(form) {

            // 确认按钮设为禁用
            savelpbtn.attr('disabled', 'disabled');
            var opsd = hex_md5(olpsdbox.val()),
                npsd = hex_md5(nlpsdbox.val());
            // 请求修改登录密码
            console.log(urlid+','+useridentity+','+opsd+','+npsd);
            $.post('php/changepsd.php', {
                    id: urlid,
                    identity: useridentity,
                    opsd: opsd,
                    npsd: npsd,
                    type: 1
                },
                function(data, textStatus, xhr) {
                    var msg = JSON.parse(data).msg;
                    switch (JSON.parse(data).code) {
                        case "1": //修改成功
                            tiptext.text(msg+'请重新登录！');
                            tipstate(true);
                            $.post('php/set_cookie.php', {
                                name: urlid,
                                value: false
                            }, function(data, textStatus, xhr) {
                                if (data == "0")
                                    alert("设置免登录时出现错误！请联系系统管理员修复！");
                            });
                            setTimeout(function() {
                                location.href = "login.html";
                            }, 1000);
                            $("#loginpsdForm")[0].reset();
                            savelpbtn.removeAttr('disabled');
                            break;
                        case "0": //密码错误
                            tiptext.text(msg);
                            tipstate(true);
                            savelpbtn.removeAttr('disabled');
                            olpsdbox.val('');
                            olpsdbox.focus();
                            break;
                        case "-1": //连接数据库失败
                        case "-2": //执行语句失败
                            tiptext.text(msg);
                            tipstate(true);
                            $("#loginpsdForm")[0].reset();
                            setTimeout(function() {
                                location.href = "500.html";
                            }, 1000);
                            savelpbtn.removeClass('disabled');
                            break;
                        default:
                            alert("出现未知错误！请联系系统管理员修复！");
                            $("#loginpsdForm")[0].reset();
                            location.href = "500.html";
                            savelpbtn.removeClass('disabled');
                            break;
                    }
                });
            //IE浏览器会多弹出一个页面，需要return false，否则表单会自己再提交一次
            return false;
        }
    });
    $("#paypsdForm").validate({
        errorElement: "em",
        errorPlacement: function(error, element) {
            $(element.parent("div").addClass("form-animate-error"));
            // console.log(element.parent("div"));
            error.appendTo(element.parent("div"));
        },
        success: function(label) {
            $(label.parent("div").removeClass("form-animate-error"));
        },
        focusCleanup: true,
            //如果是 true 那么当未通过验证的元素获得焦点时，移除错误提示
        onkeyup: false,//在 keyup 时验证
        rules: {
            original_paypsd: {
                required: true,
                rangelength: [6,16]
            },
            new_paypsd: {
                required: true,
                rangelength: [6,16]
            },
            confirm_paypsd: {
                required: true,
                rangelength: [6,16],
                equalTo: "#new_paypsd"
            },
            pay_vcode: {
                required: true
            }
        },
        messages: {
            original_paypsd: {
            required: "请输入正确的原支付密码",
            rangelength: "密码不少于6位,不多于16位"
            },
            new_paypsd: {
            required: "请输入新支付密码",
            rangelength: "密码不少于6位,不多于16位"
            },
            confirm_paypsd: {
            required: "请输入新支付密码",
            rangelength: "密码不少于6位,不多于16位",
            equalTo: "请输入相同的密码"
            },
            pay_vcode: {
            required: "请输入正确的验证码"
            }
        },
        submitHandler: function(form) {

            // 确认按钮设为禁用
            saveppbtn.attr('disabled', 'disabled');
            var opsd = hex_md5(oppsdbox.val()),
                npsd = hex_md5(nppsdbox.val());
            // 请求修改登录密码
            $.post('php/changepsd.php', {
                    id: urlid,
                    identity: useridentity,
                    opsd: opsd,
                    npsd: npsd,
                    type: 2
                },
                function(data, textStatus, xhr) {
                    var msg = JSON.parse(data).msg;
                    switch (JSON.parse(data).code) {
                        case "1": //修改成功
                            tiptext.text(msg);
                            tipstate(true);
                            $("#paypsdForm")[0].reset();
                            saveppbtn.removeAttr('disabled');
                            break;
                        case "0": //密码错误
                            tiptext.text(msg);
                            tipstate(true);
                            saveppbtn.removeAttr('disabled');
                            oppsdbox.val('');
                            oppsdbox.focus();
                            break;
                        case "-1": //连接数据库失败
                        case "-2": //执行语句失败
                            tiptext.text(msg);
                            tipstate(true);
                            $("#paypsdForm")[0].reset();
                            saveppbtn.removeAttr('disabled');
                            setTimeout(function() {
                                location.href = "500.html";
                            }, 1000);
                            // saveppbtn.removeClass('disabled');
                            break;
                        default:
                            alert("出现未知错误！请联系系统管理员修复！");
                            $("#paypsdForm")[0].reset();
                            saveppbtn.removeAttr('disabled');
                            location.href = "500.html";
                            break;
                    }
                });
            //IE浏览器会多弹出一个页面，需要return false，否则表单会自己再提交一次
            return false;
        }
    });
    $("#staffpsdForm").validate({
        errorElement: "em",
        errorPlacement: function(error, element) {
        $(element.parent("div").addClass("form-animate-error"));
        error.appendTo(element.parent("div"));
        },
        success: function(label) {
        $(label.parent("div").removeClass("form-animate-error"));
        },
        focusCleanup: true,
        //如果是 true 那么当未通过验证的元素获得焦点时，移除错误提示
        onkeyup: false, //在 keyup 时验证
        rules: {
            original_psd: {
                required: true,
                minlength: 6
            },
            new_psd: {
                required: true,
                minlength: 6
            },
            confirm_psd: {
                required: true,
                minlength: 6,
                equalTo: "#new_psd"
            },
            login_vcode: {
                required: true,
            }
        },
        messages: {
            original_psd: {
                required: "请输入正确的原登录密码",
                minlength: "密码必须大于6个字符"
            },
            new_psd: {
                required: "请输入新登录密码",
                minlength: "密码必须大于6个字符"
            },
            confirm_psd: {
                required: "请输入新登录密码",
                minlength: "密码必须大于6个字符",
                equalTo: "请输入相同的密码"
            },
            login_vcode: {
                required: "请输入正确的验证码"
            }
        },
        submitHandler: function(form) {

            // 确认按钮设为禁用
            savespbtn.attr('disabled', 'disabled');
            var opsd = hex_md5(ospsdbox.val()),
                npsd = hex_md5(nspsdbox.val());
            // 请求修改登录密码
            $.post('php/changepsd.php', {
                    id: urlid,
                    identity: useridentity,
                    opsd: opsd,
                    npsd: npsd,
                    type: 1
                },
                function(data, textStatus, xhr) {
                    var msg = JSON.parse(data).msg;
                    switch (JSON.parse(data).code) {
                        case "1": //修改成功
                            tiptext.text(msg+'请重新登录！');
                            tipstate(true);
                            $.post('php/set_cookie.php', {
                                name: urlid,
                                value: false
                            }, function(data, textStatus, xhr) {
                                if (data == "0")
                                    alert("设置免登录时出现错误！请联系系统管理员修复！");
                            });
                            $("#staffpsdForm")[0].reset();
                            savespbtn.removeAttr('disabled');
                            break;
                        case "0": //密码错误
                            tiptext.text(msg);
                            tipstate(true);
                            savespbtn.removeAttr('disabled');
                            ospsdbox.val('');
                            ospsdbox.focus();
                            break;
                        case "-1": //连接数据库失败
                        case "-2": //执行语句失败
                            tiptext.text(msg);
                            tipstate(true);
                            $("#staffpsdForm")[0].reset();
                            setTimeout(function() {
                                location.href = "500.html";
                            }, 1000);
                            savespbtn.removeClass('disabled');
                            break;
                        default:
                            alert("出现未知错误！请联系系统管理员修复！");
                            $("#staffpsdForm")[0].reset();
                            location.href = "500.html";
                            savespbtn.removeClass('disabled');
                            break;
                    }
                });
            //IE浏览器会多弹出一个页面，需要return false，否则表单会自己再提交一次
            return false;
        }
    });
    // tab 切换
    $(".nav-tabs a").click(function (e) {
        e.preventDefault();
        $(this).tab('show');
    });
});