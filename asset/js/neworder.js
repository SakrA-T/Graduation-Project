$(document).ready(function() {
    var tipbox = $("#neworder_tip"),
        tiptext = $(".modal-body"),
        navusbox = $(".z-navuser"),
        cphotobox = $(".img-circle"),
        pdedit = $("#nproduce"),
        countedit = $("#ncount"),
        stockbox = $("#nstock"),
        pricebox = $("#nprice"),
        unitbox = $("#nunit"),
        amountbox = $("#namount"),
        nameedit = $(".z-editname"),
        teledit = $(".z-edittel"),
        paypsdedit = $(".z-editpaypsd"),
        addredit = $(".z-editaddr"),
        savebtn = $("#order_save"),
        useridentity = "1",
        user = "",company = "";
    // 模态框 
    var tipstate = function(flag) {
        if (flag) {
            tipbox.modal('show');
        } else {
            tipbox.modal('hide');
        }
    }
    var addrs = ["company.html", "orderform.html", "neworder.html", "companyinfo.html", "changepsd.html"];
    //获取url中的参数
    function getUrlParam(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
        var r = window.location.search.substr(1).match(reg); //匹配目标参数
        if (r != null) return unescape(r[2]);
        return null; //返回参数值
    }

    var urlid = getUrlParam("id") || ""; //此处取得的id和cookie中的同为string
    // console.log(urlid + ":"+typeof urlid);
    var logincookie = $.cookie(urlid);
    console.log($.cookie());
    // urlid = parseInt(urlid);

    var changeAddr = function(index) {
        if (urlid != "") {
            window.location.href = addrs[index] + "?id=" + urlid;
        } else {
            tiptext.text('请先登录！');
            tipstate(true);
            tipbox.on('hidden.bs.modal', function () {
              location.href = "login.html";
            })
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
    var getproduce = function(){
        $.get('php/getproduce.php',
        function(data, textStatus, xhr) {
            var itemdata = JSON.parse(data);

            jQuery.each(itemdata, function(i, val) {
                // console.log(val.unit);
                pdedit.append("<option value='" + val.code + "' data-price=" + val.price + " data-unit='" + val.unit + "' data-stock='" + val.stock + "'>" + val.name + "</option>");

            });
        });
    }
    // start: 信息获取
    $(function() {
        // var getinfo = function(){
        if (urlid && logincookie != null) {
            // console.log(urlid + "," + logincookie);
            $.get('php/getinfo.php', {
                    userid: urlid,
                    identity: "1"
                },
                function(data, textStatus, xhr) {
                    if (JSON.parse(data).name == '' || JSON.parse(data).name == '-') {
                        tiptext.text('请先完善个人信息！');
                        tipstate(true);
                        tipbox.on('hidden.bs.modal', function () {
                            location.href = "companyinfo.html" + "?id=" + urlid;
                        })
                        return false;
                    }
                    navusbox.text(JSON.parse(data).user);
                    cphotobox.attr("src", "images/" + JSON.parse(data).photo);

                    nameedit.val(JSON.parse(data).name);

                    teledit.val(JSON.parse(data).tel);

                    addredit.val(JSON.parse(data).address);
                    company = JSON.parse(data).company;
                    user = JSON.parse(data).user;

                    useridentity = JSON.parse(data).identity;
                });
                getproduce();
        } else {
            tiptext.text('请先登录！');
            tipstate(true);
            setTimeout(function() {
                location.href = "login.html";
            }, 1000);
        }
        // } //end: getinfo
    }); //end: 信息获取

    // start: validate
    pdedit.change(function(event) {
        var option = pdedit.find("option:selected");
        stockbox.text(option.data("stock")+' '+option.data("unit"));
        pricebox.text(option.data("price"));
        unitbox.text(option.data("unit"));
        amountbox.text(pricebox.text() * countedit.val());
    });
    countedit.change(function(event) {
        amountbox.text(pricebox.text() * countedit.val());
    });

    $("#neworderForm").validate({
        errorElement: "em",
        errorPlacement: function(error, element) {
            $(element.parent("div").addClass("neworder-error"));
            error.appendTo(element.parent("div"));
        },
        success: function(label) {
            $(label.parent("div").removeClass("neworder-error"));
        },
        focusCleanup: true,
        //如果是 true 那么当未通过验证的元素获得焦点时，移除错误提示
        onkeyup: false, //在 keyup 时验证
        rules: {
            nproduce: {
                required: function(element) {
                    if ($("#nproduce").val() == '0') {
                        return false;
                    } else {
                        return true;
                    }
                }
            },
            ncount: "required",
            nclient: "required",
            ntel: {
                required: true,
                digits: true,
                minlength: 11
            },
            naddr: {
                required: true
            },
            npaypsd: {
                required: true,
                rangelength: [6, 16]
            }
        },
        messages: {
            nproduce: {
                required: "请选择所需订购的产品"
            },
            ncount: "请输入所订购产品数量",
            nclient: "请输入收货人姓名方便配送员联系",
            ntel: {
                required: "请输入11位手机号方便配送员联系",
                digits: "请输入正确的手机号码",
                minlength: "请输入11位手机号"
            },
            naddr: {
                required: "请输入收货地址方便配送"
            },
            npaypsd: {
                required: "请输入支付密码",
                rangelength: "请输入正确的支付密码"
            }
        },
        submitHandler: function(form) {
            // 确认下单按钮设为禁用
            savebtn.attr('disabled', 'disabled');
            var produce = pdedit.find("option:selected").text(),
                code = pdedit.val(),
                count = parseInt(countedit.val()),
                unit = unitbox.text(),
                amount = parseInt(amountbox.text()),
                name = nameedit.val(),
                tel = teledit.val(),
                address = addredit.val(),
                paypsd = hex_md5(paypsdedit.val());
            //请求注册
            console.log(user + ',' + urlid + ',' + name + ',' + produce + ',' + count + ',' + tel + ',' + company + ',' + address + ',' + amount);
            $.post('php/neworder.php', {
                    userid: urlid,
                    user: user,
                    name: name,
                    code: code,
                    produce: produce,
                    count: count,
                    unit: unit,
                    amount: amount,
                    tel: tel,
                    company: company,
                    address: address,
                    paypsd: paypsd,
                    status: 0
                },
                function(data, textStatus, xhr) {
                    var msg = JSON.parse(data).msg;
                    switch (JSON.parse(data).code) {
                        case "1": //下单成功
                        case "0": //支付密码错误or余额不足or库存不足
                            savebtn.removeAttr('disabled');
                            tiptext.text(msg);
                            tipstate(true);
                            pdedit.children().remove();
                            getproduce();
                            stockbox.text('-');
                            pricebox.text('0');
                            amountbox.text('0');
                            countedit.val('0');
                            paypsdedit.val('');
                            paypsdedit.focus();
                            break;
                        case "-1": //连接数据库失败
                        case "-2": //执行语句失败
                            tiptext.text(msg);
                            tipstate(true);
                            savebtn.removeAttr('disabled');
                            setTimeout(function() {
                                location.href = "500.html";
                            }, 1000);
                            break;
                        default:
                            alert("出现未知错误！请联系系统管理员修复！");
                            savebtn.removeAttr('disabled');
                            location.href = "500.html";
                            break;
                    }
                });
            //IE浏览器会多弹出一个页面，需要return false，否则表单会自己再提交一次
            return false;
        }
    });
    // end: validate
});