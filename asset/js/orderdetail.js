$(document).ready(function() {
    var tipbox = $("#orderdetail_tip"),
        tiptext = $(".modal-body"),
        navusbox = $(".z-navuser"),
        cphotobox = $(".img-circle"),
        statusbox = $("#wizard"),
        statusnav = $("#s_statusnav"),

        idbox = $(".h-orderid"),
        producebox = $(".d-produce"),
        countbox = $(".d-count"),
        diffbox = $(".d-diffbox"),
        odatebox = $(".d-orderDate"),
        fdatebox = $(".d-finishDate"),
        namebox = $(".d-name"),
        telbox = $(".d-tel"),
        addressbox = $(".d-address"),
        staffNamebox = $(".d-staffName"),
        staffTelbox = $(".d-staffTel"),
        truckbox = $(".d-truck"),
        difflabel = $(".d-difflabel"),

        btnbox = $(".d-btnbox"),
        cancelbtn = $("#s_cancel"),
        finishbtn = $("#s_finish"),
        ordertakebtn = $("#s_ordertake"),
        deliverybtn = $("#s_delivery"),
        deliveredbtn = $("#s_delivered"),
        backbtn = $("#s_back"),

        useridentity = $(".g-orderdetail").data('identity') || $(".m-orderdetail").data('identity'),
        staffname = "",stafftel = "",truck="",status;
    // 模态框 
    var tipstate = function(flag) {
        if (flag) {
            tipbox.modal('show');
        } else {
            tipbox.modal('hide');
        }
    }
    var addrs = [];
    if (useridentity == "1") {
        addrs = ["company.html", "orderform.html", "neworder.html", "companyinfo.html", "changepsd.html"];
    } else if (useridentity == "2") {
        addrs = ["staff.html", "orderform2.html", "staffinfo.html", "changepsd2.html"];
    }
    //获取url中的参数
    function getUrlParam(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
        var r = window.location.search.substr(1).match(reg); //匹配目标参数
        if (r != null) return unescape(r[2]);
        return null; //返回参数值
    }
    var orderid = getUrlParam("order") || "";
    var urlid = getUrlParam("id") || ""; //此处取得的id和cookie中的同为string
    console.log(orderid);
    var logincookie = $.cookie(urlid);
    console.log($.cookie());
    // urlid = parseInt(urlid);

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
    $('.z-page4').click(function(event) {
        changeAddr(4);
    });
    // console.log(btnbox.children().length);
    var resetStatus = function(flag){
        if (flag) {
            for (var i = 0; i < btnbox.children().length-1; i++) {
                btnbox.children()[i].classList.add('hide');
            }
        }
    }

    // start: 信息获取
    $(function() {
        // var getinfo = function(){
        if (urlid && logincookie != null) {
            // console.log(urlid + "," + logincookie);
            $.get('php/getinfo.php', {
                    //提交用户名密码,md5加密密码
                    userid: urlid,
                    identity: useridentity
                },
                function(data, textStatus, xhr) {
                    if (JSON.parse(data).code == 0) {
                        tiptext.text(JSON.parse(data).msg);
                        tipstate(true);
                        setTimeout(function() {
                            location.href = "login.html";
                        }, 1000);
                    }
                    if (JSON.parse(data).name == ' ' || JSON.parse(data).name == '-') {
                        tiptext.text("请先完善个人信息!");
                        tipstate(true);
                        if (useridentity=="1") {
                            setTimeout(function() {
                                changeAddr(3);
                            }, 1000);
                        }else{
                            setTimeout(function() {
                                changeAddr(2);
                            }, 1000);
                        }
                        return false;
                    }
                    navusbox.text(JSON.parse(data).user);
                    cphotobox.attr("src", "images/" + JSON.parse(data).photo);
                    // if (useridentity=="2") {
                    //     staffname = JSON.parse(data).name;
                    //     stafftel = JSON.parse(data).tel;
                    //     truck = JSON.parse(data).truck;
                    // }
                });
            console.log(urlid+','+useridentity+','+orderid);
            $.get('php/getdetail.php', {
                    id: urlid,
                    orderid: orderid,
                    identity: useridentity
                },
                function(data, textStatus, xhr) {
                    if (JSON.parse(data).code == 0) {//无此类订单
                        tiptext.text(JSON.parse(data).msg);
                        tipstate(true);
                        setTimeout(function() {
                            changeAddr(1);
                        }, 1000);
                    }else{
                        var order = JSON.parse(data);
                        status = order.status;
                        if (status!=5) {
                            idbox.text("订单号："+order.id);
                            statusbox.data('bootstrapWizard').show(status);
                            for (var i = 0; i<=status; i++) {
                                $(".icon-circle")[i].classList.add('checked');
                            }
                        }
                        switch(status) {
                            case 0:
                                if (useridentity=='1') {
                                    cancelbtn.removeClass('hide');
                                }else{
                                    ordertakebtn.removeClass('hide');
                                }
                                break;
                            case 1:
                                if (useridentity=='2') {
                                    deliverybtn.removeClass('hide');
                                }
                                break;
                            case 2:
                                if (useridentity=='2') {
                                    deliveredbtn.removeClass('hide');
                                }
                                break;
                            case 3:
                                if (useridentity=='1') {
                                    finishbtn.removeClass('hide');
                                }
                                break;
                            case 4:
                                break;
                            case 5:
                                statusbox.addClass('hide');
                                idbox.text("订单号："+order.id+"（订单已取消）");
                                break;
                        }
                        producebox.text(order.produce);
                        countbox.text(order.count+' '+order.unit);
                        if (useridentity=='1') {
                            difflabel.text("订单总金额：");
                            diffbox.text("￥"+order.amount);
                        }else{
                            difflabel.text("订单授权码：");
                            diffbox.text(order.license);
                        }
                        odatebox.text(order.orderDate);
                        if (order.orderDate>order.finishDate)
                        {
                            order.finishDate = "(未完成)";
                        }
                        fdatebox.text(order.finishDate);
                        namebox.text(order.name);
                        telbox.text(order.tel);
                        addressbox.text(order.address);
                        staffNamebox.text(order.staffName||'-');
                        staffTelbox.text(order.staffTel||'-');
                        truckbox.text(order.truck||'-');
                    }
                });
        } else {
            tiptext.text('请先登录！');
            tipstate(true);
            setTimeout(function() {
                location.href = "login.html";
            }, 1000);
        }
        // } //end: getinfo
    }); //end: 信息获取
    backbtn.click(function(event) {
        changeAddr(1);
    });
    cancelbtn.click(function(event) {
        //取消按钮设为禁用
        cancelbtn.attr('disabled', 'disabled');
        // self.location.reload();
        $.post('php/changestatus.php', {
                id: urlid,
                orderid: orderid,
                status: status,
                type: 1,
                identity: useridentity

            }, 
            function(data, textStatus, xhr) {
                var msg = JSON.parse(data).msg;
                switch (JSON.parse(data).code) {
                    case "1": //操作成功
                    case "0": //订单信息错误
                        tiptext.text(msg);
                        tipstate(true);
                        cancelbtn.removeAttr('disabled');
                        setTimeout(function() {
                            parent.location.reload();
                        }, 1000);
                        break;
                    case "-1": //连接数据库失败or数据提交错误
                    case "-2": //执行查询语句失败
                        tiptext.text(msg);
                        tipstate(true);
                        cancelbtn.removeAttr('disabled');
                        break;
                    default:
                        alert("出现未知错误！请联系系统管理员修复！");
                        cancelbtn.removeAttr('disabled');
                        break;
                }
        });
        //IE浏览器会多弹出一个页面，需要return false，否则表单会自己再提交一次
        return false;
    });
    finishbtn.click(function(event) {
        //取消按钮设为禁用
        finishbtn.attr('disabled', 'disabled');
        // self.location.reload();
        $.post('php/changestatus.php', {
                id: urlid,
                orderid: orderid,
                status: status,
                type: 2,
                identity: useridentity

            }, 
            function(data, textStatus, xhr) {
                var msg = JSON.parse(data).msg;
                switch (JSON.parse(data).code) {
                    case "1": //操作成功
                    case "0": //订单信息错误
                        tiptext.text(msg);
                        tipstate(true);
                        finishbtn.removeAttr('disabled');
                        setTimeout(function() {
                            parent.location.reload();
                        }, 1000);
                        break;
                    case "-1": //连接数据库失败or数据提交错误
                    case "-2": //执行查询语句失败
                        tiptext.text(msg);
                        tipstate(true);
                        finishbtn.removeAttr('disabled');
                        break;
                    default:
                        alert("出现未知错误！请联系系统管理员修复！");
                        finishbtn.removeAttr('disabled');
                        break;
                }
        });
        //IE浏览器会多弹出一个页面，需要return false，否则表单会自己再提交一次
        return false;
    });
    ordertakebtn.click(function(event) {
        //取消按钮设为禁用
        ordertakebtn.attr('disabled', 'disabled');
        // self.location.reload();
        $.post('php/changestatus.php', {
                id: urlid,
                orderid: orderid,
                status: status,
                type: 3,
                identity: useridentity
            }, 
            function(data, textStatus, xhr) {
                var msg = JSON.parse(data).msg;
                switch (JSON.parse(data).code) {
                    case "1": //操作成功
                    case "0": //订单信息错误
                        tiptext.text(msg);
                        tipstate(true);
                        ordertakebtn.removeAttr('disabled');
                        setTimeout(function() {
                            window.location.reload();
                        }, 1000);
                        break;
                    case "-1": //连接数据库失败or数据提交错误
                    case "-2": //执行查询语句失败
                        tiptext.text(msg);
                        tipstate(true);
                        ordertakebtn.removeAttr('disabled');
                        break;
                    default:
                        alert("出现未知错误！请联系系统管理员修复！");
                        ordertakebtn.removeAttr('disabled');
                        break;
                }
        });
        //IE浏览器会多弹出一个页面，需要return false，否则表单会自己再提交一次
        return false;
    });
    deliverybtn.click(function(event) {
        //取消按钮设为禁用
        deliverybtn.attr('disabled', 'disabled');
        // self.location.reload();
        $.post('php/changestatus.php', {
                id: urlid,
                orderid: orderid,
                status: status,
                type: 4,
                identity: useridentity

            }, 
            function(data, textStatus, xhr) {
                var msg = JSON.parse(data).msg;
                switch (JSON.parse(data).code) {
                    case "1": //操作成功
                    case "0": //订单信息错误
                        tiptext.text(msg);
                        tipstate(true);
                        deliverybtn.removeAttr('disabled');
                        setTimeout(function() {
                            parent.location.reload();
                        }, 1000);
                        break;
                    case "-1": //连接数据库失败or数据提交错误
                    case "-2": //执行查询语句失败
                        tiptext.text(msg);
                        tipstate(true);
                        deliverybtn.removeAttr('disabled');
                        break;
                    default:
                        alert("出现未知错误！请联系系统管理员修复！");
                        deliverybtn.removeAttr('disabled');
                        break;
                }
        });
        //IE浏览器会多弹出一个页面，需要return false，否则表单会自己再提交一次
        return false;
    });
    deliveredbtn.click(function(event) {
        //取消按钮设为禁用
        deliveredbtn.attr('disabled', 'disabled');
        // self.location.reload();
        $.post('php/changestatus.php', {
                id: urlid,
                orderid: orderid,
                status: status,
                type: 5,
                identity: useridentity

            }, 
            function(data, textStatus, xhr) {
                var msg = JSON.parse(data).msg;
                switch (JSON.parse(data).code) {
                    case "1": //操作成功
                    case "0": //订单信息错误
                        tiptext.text(msg);
                        tipstate(true);
                        deliveredbtn.removeAttr('disabled');
                        setTimeout(function() {
                            parent.location.reload();
                        }, 1000);
                        break;
                    case "-1": //连接数据库失败or数据提交错误
                    case "-2": //执行查询语句失败
                        tiptext.text(msg);
                        tipstate(true);
                        deliveredbtn.removeAttr('disabled');
                        break;
                    default:
                        alert("出现未知错误！请联系系统管理员修复！");
                        deliveredbtn.removeAttr('disabled');
                        break;
                }
        });
        //IE浏览器会多弹出一个页面，需要return false，否则表单会自己再提交一次
        return false;
    });
    
});