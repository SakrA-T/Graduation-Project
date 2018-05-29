$(document).ready(function() {
    var tipbox = $("#company_tip"),
        tiptext = $(".modal-body"),
        navusbox = $(".z-navuser"),
    	cphotobox = $(".img-circle"),
    	photobox = $(".img-info"),
        ctusbox = $(".z-ctuser"),
        namebox = $(".z-name"),
        telbox = $(".z-tel"),
        moneybox = $(".z-money"),
        ordercountbox = $(".z-ordercount"),
        companybox = $(".z-company"),
        addrbox = $(".z-address"),
        useredit = $(".z-edituser"),
        nameedit = $(".z-editname"),
        teledit = $(".z-edittel"),
        moneyedit = $(".z-editmoney"),
        companyedit = $(".z-editcompany"),
        addredit = $(".z-editaddr"),
        savebtn = $("#save_edit"),
        useridentity = "1";
    // 信息提示模态框 
    var tipstate = function(flag) {
        if (flag) {
            tipbox.modal('show');
        } else {
            tipbox.modal('hide');
        }
    }
    var addrs=["company.html","orderform.html","neworder.html","companyinfo.html","changepsd.html"];
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

    var pathname = window.location.pathname;
    // console.log(pathname);

    //获取url中的参数
    function getUrlParam(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
        var r = window.location.search.substr(1).match(reg); //匹配目标参数
        if (r != null) return unescape(r[2]);
        return null; //返回参数值
    }

    // start: 信息获取
    $(function() {
        if (urlid && logincookie!=null) {
                $.get('php/getinfo.php', {
                        //提交用户名密码,md5加密密码
                        userid: urlid,
                        identity: "1"
                    },
                    function(data, textStatus, xhr) {
                        ctusbox.text("欢迎，" + JSON.parse(data).user);
                        navusbox.text(JSON.parse(data).user);
                        cphotobox.attr("src","images/"+JSON.parse(data).photo);
                        photobox.attr("src","images/"+JSON.parse(data).photo);
                        namebox.text(JSON.parse(data).name);
                        telbox.text(JSON.parse(data).tel);
                        ordercountbox.text(JSON.parse(data).ordercount);
                        moneybox.text(JSON.parse(data).money+' 元');
                        companybox.text(JSON.parse(data).company);
                        addrbox.text(JSON.parse(data).address);
                        useredit.val(JSON.parse(data).user);
                        nameedit.val(JSON.parse(data).name);
                        teledit.val(JSON.parse(data).tel);
                        companyedit.val(JSON.parse(data).company);
                        addredit.val(JSON.parse(data).address);
                        useridentity = JSON.parse(data).identity;
                        console.log(JSON.parse(data));
                    });
            }
        else{
        	tiptext.text('请先登录！');
            tipstate(true);
            setTimeout(function() {
                location.href = "login.html";
            }, 1000);
        }
    }); //end: 信息获取
    // start:　提交信息修改表单
    $(".cinfo-form").submit(function(event) {
    	if (!!logincookie) {
          if ($(".cinfo-form").valid()) {
			// 保存按钮设为禁用
            savebtn.attr('disabled', 'disabled');
            var user = useredit.val(),
                name = nameedit.val(),
                tel = teledit.val(),
                money = parseInt(moneyedit.val()),
                company = companyedit.val(),
                address = addredit.val();
            //请求注册
            console.log(user+','+name+','+tel+','+money+','+company+','+address+','+useridentity);
            $.post('php/setinfo.php', {
            		id: urlid,
                    user: user,
                    name: name,
                    tel: tel,
                    money: money,
                    company: company,
                    address: address,
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
                                location.href = "companyinfo.html"+"?id="+urlid;
                            }, 1000);
                            break;
                        case "-1": //连接数据库失败
                        case "-2": //执行语句失败
                            tiptext.text(msg);
                            tipstate(true);
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
	      }//valid()
    	}
		else{
        	tiptext.text('请先登录！');
            tipstate(true);
            setTimeout(function() {
                location.href = "login.html";
            }, 1000);
        }
    }); //end: 提交信息修改表单
});