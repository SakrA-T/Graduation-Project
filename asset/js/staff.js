$(document).ready(function() {
// (function (jQuery) {
    var tipbox = $("#staff_tip"),
        tiptext = $(".modal-body"),
        navusbox = $(".z-navuser"),
        cphotobox = $(".img-circle"),
        photobox = $(".img-info"),
        ctusbox = $(".z-ctuser"),
        namebox = $(".z-name"),
        telbox = $(".z-tel"),
        ordercountbox = $(".z-ordercount"),
        truckbox = $(".z-truck"),
        useredit = $(".z-edituser"),
        nameedit = $(".z-editname"),
        teledit = $(".z-edittel"),
        truckedit = $(".z-edittruck"),
        savebtn = $("#save_staffedit"),
        useridentity = "2";
    // 模态框 
    var tipstate = function(flag) {
        if (flag) {
            tipbox.modal('show');
        } else {
            tipbox.modal('hide');
        }
    }
    // 配送员真实姓名仅可修改一次
    console.log(namebox.text());
    if (namebox.text() != "-") {
        nameedit.addClass('uneditable');
        nameedit.attr('disabled', 'disabled');
    }

    var addrs=["staff.html","orderform2.html","staffinfo.html","changepsd2.html"];

    var pathname = window.location.pathname;
    // console.log(pathname);

    var urlid = getUrlParam("id") || ""; //此处取得的id和cookie中的同为string
    // console.log(urlid + ":"+typeof urlid);
    var logincookie = $.cookie(urlid);
    console.log(urlid + "," + logincookie);
    console.log($.cookie());
    
    //获取url中的参数
    function getUrlParam(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
        var r = window.location.search.substr(1).match(reg); //匹配目标参数
        if (r != null) return unescape(r[2]);
        return null; //返回参数值
    }

    var changeAddr = function(index) {
        if (urlid != "") {
            window.location.href = addrs[index] + "?id=" + urlid;
        } else {
            tiptext.text('请先登录！');
            tipstate(true);
            setTimeout(function() {
                location.href = "login.html";
            }, 1000);
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

    $(function() {
        if (urlid && logincookie != null) {
            // urlid = parseInt(urlid);
            $.get('php/getinfo.php', {
                    //提交用户名密码,md5加密密码
                    userid: urlid,
                    identity: useridentity
                },
                function(data, textStatus, xhr) {
                    ctusbox.text("欢迎，" + JSON.parse(data).user);
                    navusbox.text(JSON.parse(data).user);
                    cphotobox.attr("src", "images/" + JSON.parse(data).photo);
                    photobox.attr("src", "images/" + JSON.parse(data).photo);
                    namebox.text(JSON.parse(data).name);
                    telbox.text(JSON.parse(data).tel);
                    ordercountbox.text(JSON.parse(data).ordercount);
                    truckbox.text(JSON.parse(data).truck);

                    useredit.val(JSON.parse(data).user);
                    if (JSON.parse(data).name != "-")
                        nameedit.val(JSON.parse(data).name);
                    
                    teledit.val(JSON.parse(data).tel);
                    if (JSON.parse(data).truck != "-")
                        truckedit.val(JSON.parse(data).truck);

                    // useridentity = JSON.parse(data).identity;
                    console.log(JSON.parse(data));
                });
        } else {
            tiptext.text('请先登录！');
            tipstate(true);
            setTimeout(function() {
                location.href = "login.html";
            }, 1000);
        }
    });
    $(".sinfo-form").submit(function(event) {
        console.log(useridentity);
        if (!!logincookie) {
            if ($(".sinfo-form").valid()) {
                // 保存按钮设为禁用
                savebtn.attr('disabled', 'disabled');
                var user = useredit.val(),
                    name = nameedit.val(),
                    tel = teledit.val(),
                    truck = truckedit.val();
                //请求注册
                $.post('php/setinfo.php', {
                        id: urlid,
                        user: user,
                        tel: tel,
                        name: name,
                        truck: truck,
                        identity: useridentity
                    },
                    function(data, textStatus, xhr) {
                        var msg = JSON.parse(data).msg;
                        switch (JSON.parse(data).code) {
                            case "1": //修改成功
                                savebtn.removeAttr('disabled');
                                tiptext.text(msg);
                                tipstate(true);
                                setTimeout(function() {
                                    location.href = "staffinfo.html" + "?id=" + urlid;
                                }, 1000);
                                break;
                            case "0": //用户名或手机号已被使用
                                savebtn.removeAttr('disabled');
                                tiptext.text(msg);
                                tipstate(true);
                                break;
                            case "-1": //连接数据库失败
                                location.href = "500.html";
                                savebtn.removeAttr('disabled');
                                break;
                            case "-2": //执行语句失败
                                tiptext.text(msg);
                                tipstate(true);
                                location.href = "500.html";
                                setTimeout(function() {
                                    location.href = "500.html";
                                }, 1000);
                                savebtn.removeAttr('disabled');
                                break;
                            default:
                                alert("出现未知错误！请联系系统管理员修复！");
                                location.href = "500.html";
                                savebtn.removeAttr('disabled');
                                break;
                        }
                    });
                //IE浏览器会多弹出一个页面，需要return false，否则表单会自己再提交一次
                return false;
            } //valid()
        } else {
            tiptext.text('请先登录！');
            tipstate(true);
            setTimeout(function() {
                location.href = "login.html";
            }, 1000);
        }
    });
    // start: 修改信息表单验证
    $.validator.addMethod("usertest", function(value, element) {
        if (/\W/.test(value)) {
            return false;
        } else {
            return true;
        }
    }, "用户名由字母数字或下划线组成,不可出现奇怪字符");

    $(".sinfo-form").validate({
        errorElement: "em",
        errorPlacement: function(error, element) {
            $(element.parent("div").addClass("sinfo-error"));
            error.appendTo(element.parent("div"));
        },
        success: function(label) {
            $(label.parent("div").removeClass("sinfo-error"));
        },
        focusCleanup: true,
        //如果是 true 那么当未通过验证的元素获得焦点时，移除错误提示
        onkeyup: false, //在 keyup 时验证
        rules: {
            user: {
                required: true,
                usertest: true
            },
            name: "required",
            tel: {
                required: true,
                digits: true,
                minlength: 11
            },
            truck: {
                required: true
            }
        },
        messages: {
            user: "请输入用户名,由字母数字组成",
            name: "请输入您的真实姓名",
            tel: {
                required: "请输入11位手机号",
                digits: "请输入正确的手机号码",
                minlength: "请输入11位手机号"
            },
            truck: {
                required: "请输入正确的车牌号，如浙A00001"
            }
        }
    });
    // end: 修改信息表单验证
});