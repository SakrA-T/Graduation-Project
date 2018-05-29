$(document).ready(function() {
    var tipbox = $("#orderform_tip"),
        tiptext = $(".modal-body"),
        navusbox = $(".z-navuser"),
        cphotobox = $(".img-circle"),
        tablenav = $(".nav-tabs").children('li'),
        ocountbox = $('.t-ocount'),
        loading = $(".o-loading"),
        nolist = $(".o-nolist"),
        list = $(".o-list"),
        orderlist = $(".t-orderlist");
        useridentity = $(".g-orderform").data('identity') || $(".m-orderform").data('identity'),
        user = "",company = "",status=0,itemdata={};
    console.log(tablenav);
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
                    // ctusbox.text("欢迎，" + JSON.parse(data).user);
                    if (JSON.parse(data).code == 0) {
                        alert(JSON.parse(data).msg);
                        location.href = "login.html";
                    }
                    if (JSON.parse(data).name == ' ' || JSON.parse(data).name == '-') {
                        tiptext.text('请先完善个人信息！');
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
                });
            $.get('php/getorders.php', {
                    id: urlid,
                    identity: useridentity
                },
                function(data, textStatus, xhr) {
                    if (JSON.parse(data).code == 0) {//无此类订单
                        // alert(JSON.parse(data).msg);
                        nolist.removeClass('hide');
                        loading.addClass('hide');
                        list.addClass('hide');
                    } else {
                        nolist.addClass('hide');
                        loading.addClass('hide');
                        list.removeClass('hide');

                        orderlist.children().remove();
                        itemdata = JSON.parse(data);
                        console.log(itemdata);

                        var ocountArr = [0,0,0,0,0,0];
                        jQuery.each(itemdata, function(i, val) {
                            ocountArr[val.status]++;  
                            var item = new Modal();
                            item.show(val);
                        });
                        for(var i=0;i<ocountbox.length;i++){
                            ocountbox[i].innerHTML=ocountArr[i];
                        }
                        console.log(ocountArr);
                        $('.order-datatables').DataTable();
                        if (ocountArr[0]==0) {
                            nolist.removeClass('hide');
                            loading.addClass('hide');
                            list.addClass('hide');
                        }
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

    function htmlToNode(str){
        var container = document.createElement('tr');
        container.innerHTML = str;
        return container;
    }

    //复制属性函数
    function extend(o1,o2){
        for(var i in o2){
            if (typeof(o1[i])==='undefined') {
                o1[i] = o2[i];
            }
        }
        return o1;
    }
    //设置tbody内容
    var listitem = '';
    if (useridentity=='1') {
        listitem = 
        '<tr>\
            <td id="t_id">2018051200001</td>\
            <td id="t_address">浙江省杭州市拱墅区</td>\
            <td id="t_staffname">-</td>\
            <td id="t_stafftel">-</td>\
            <td id="t_truck">-</td>\
            <td id="t_orderdate">2018/05/12</td>\
            <td id="t_finishdate">-</td>\
            <td id="t_amount">1700</td>\
        </tr>';
    }else if(useridentity=='2'){
        listitem = 
        '<tr>\
            <td id="t_id">2018051200001</td>\
            <td id="t_company">浙江省杭州市拱墅区</td>\
            <td id="t_address">-</td>\
            <td id="t_username">-</td>\
            <td id="t_usertel">-</td>\
            <td id="t_orderdate">2018/05/12</td>\
            <td id="t_finishdate">-</td>\
            <td id="t_license">22222222222222</td>\
        </tr>';
    }

    function Modal(options){
        options = options||{};
        //保证每次创建都具有独一无二的节点
        this.container = this._layout.cloneNode(true);
        // console.log(this.container);
        //取内容节点，用于插入自定义内容

        this.id = this.container.querySelector('#t_id');
        this.company = this.container.querySelector('#t_company');
        this.address = this.container.querySelector('#t_address');
        this.username = this.container.querySelector('#t_username');
        this.usertel = this.container.querySelector('#t_usertel');
        this.orderdate = this.container.querySelector('#t_orderdate');
        this.finishdate = this.container.querySelector('#t_finishdate');
        this.license = this.container.querySelector('#t_license');
        // 用户企业
        this.staffname = this.container.querySelector('#t_staffname');
        this.stafftel = this.container.querySelector('#t_stafftel');
        this.truck = this.container.querySelector('#t_truck');
        this.amount = this.container.querySelector("#t_amount");
        // this.remark = this.container.querySelector('#t_remark');
        //把一些自定义的属性方法复制到组件实例上
        extend(this,options);

    }

    extend(Modal.prototype,{
        _layout:htmlToNode(listitem),
        setContent:function(content){
            if (!content) {return;}
            //this.body就是上面取的类名为modal_body的元素节点
            this.id.innerHTML = content.id;
            // console.log(typeof iteminfo);
            this.address.innerHTML = content.address;
            this.orderdate.innerHTML = content.orderDate;
            console.log(content.orderDate>content.finishDate);
            if (content.orderDate>content.finishDate) {
                content.finishDate = "(未完成)";
            }
            this.finishdate.innerHTML = content.finishDate;
            if (useridentity=='1') {
                this.staffname.innerHTML = content.staffName||'-';
                this.stafftel.innerHTML = content.staffTel||'-';
                this.truck.innerHTML = content.truck||'-';
                this.amount.innerHTML = '￥'+content.amount;
            }else{
                this.username.innerHTML = content.name;
                this.usertel.innerHTML = content.tel;
                this.company.innerHTML = content.company;
                this.license.innerHTML = content.license;
            }

        },

        //显示
        show:function(content){
            //将自定义内容加到要显示内容的节点中
            if (content) {
                this.setContent(content);
            }
            //将弹窗的div加到body里
            // console.log(this.container);
            orderlist[content.status].append(this.container);
        },
    })
    console.log($('.t-orderlist tr'));
    $('.t-orderlist').click(function(event) {
        var targetOrder = event.target.parentNode;
        var orderId = targetOrder.querySelector('#t_id').innerHTML;

        console.log(orderId);
        if (useridentity=='1') {
        window.location.href = "orderdetail.html"+"?id="+urlid+"&order="+orderId;
        }else{
        window.location.href = "orderdetail2.html"+"?id="+urlid+"&order="+orderId;
        }
    });
    $('.nav-tabs a').click(function(event) {
        var count = $(this).children('.t-ocount').text();
        // count = parseInt(count);
        if (count<1) {
            nolist.removeClass('hide');
            loading.addClass('hide');
            list.addClass('hide');
        }else{
            nolist.addClass('hide');
            loading.addClass('hide');
            list.removeClass('hide');
        }
    });
});