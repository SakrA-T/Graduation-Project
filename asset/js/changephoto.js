$(document).ready(function() {
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
var pathname = window.location.pathname,
    href = window.location.href;

var initCropperInModal = function(img, input, modal) {
    var $image = img;
    var $inputImage = input;
    var $modal = modal;
    var options = {
        aspectRatio: 1, // 纵横比
        viewMode: 2,
        preview: '.img-preview' // 预览图的class名
    };
    // 模态框隐藏后需要保存的数据对象
    var saveData = {};
    var URL = window.URL || window.webkitURL;
    var blobURL;
    $modal.on('show.bs.modal', function() {
        // 如果打开模态框时没有选择文件就点击“打开图片”按钮
        if (!$inputImage.val()) {
            $inputImage.click();
        }
    }).on('shown.bs.modal', function() {
        // 重新创建
        $image.cropper($.extend(options, {
            ready: function() {
                // 当剪切界面就绪后，恢复数据
                if (saveData.canvasData) {
                    $image.cropper('setCanvasData', saveData.canvasData);
                    $image.cropper('setCropBoxData', saveData.cropBoxData);
                }
            }
        }));
    }).on('hidden.bs.modal', function() {
        // 保存相关数据
        saveData.cropBoxData = $image.cropper('getCropBoxData');
        saveData.canvasData = $image.cropper('getCanvasData');
        // 销毁并将图片保存在img标签
        $image.cropper('destroy').attr('src', blobURL);
    });
    if (URL) {
        $inputImage.change(function() {
            var files = this.files;
            var file;
            if (!$image.data('cropper')) {
                return;
            }
            if (files && files.length) {
                file = files[0];
                if (/^image\/\w+$/.test(file.type)) {

                    if (blobURL) {
                        URL.revokeObjectURL(blobURL);
                    }
                    blobURL = URL.createObjectURL(file);

                    // 重置cropper，将图像替换
                    $image.cropper('reset').cropper('replace', blobURL);

                    // 选择文件后，显示和隐藏相关内容
                    $('.img-container').removeClass('hidden');
                    $('.img-preview-box').removeClass('hidden');
                    $('#changeModal .disabled').removeAttr('disabled').removeClass('disabled');
                    $('#changeModal .tip-info').addClass('hidden');

                } else {
                    window.alert('请选择一个图像文件！');
                }
            }
        });
    } else {
        $inputImage.prop('disabled', true).addClass('disabled');
    }
}

var sendPhoto = function() {

    if (!!logincookie) {
        //将头像传至服务器
        var result = $('#photo').cropper('getCroppedCanvas', {
            width: 300,
            height: 300
        });
        if (result) {
            var imgBase = result.toDataURL('image/jpeg');

            $.post('php/setphoto.php', {
                    photo: imgBase,
                    id: urlid
                },
                function(data, textStatus, xhr) {
                    var msg = JSON.parse(data).msg;
                    switch (JSON.parse(data).code) {
                        case "1": //修改成功
                            setTimeout(function() {
                                location.href = href;
                            }, 1000);
                            console.log(msg);
                            break;
                            // case "0": //用户名or手机号已被注册
                            //     // tiptext.text(msg);
                            //     // tipstate(true);
                            //     // savebtn.removeClass('disabled');
                            //     savebtn.removeAttr('disabled');
                            //     break;
                        case "-1": //连接数据库失败
                            alert(msg);
                            location.href = "500.html";
                            // savebtn.removeClass('disabled');
                            // savebtn.removeAttr('disabled');
                            break;
                        case "-2": //执行语句失败
                            alert(msg);
                            location.href = "500.html";
                            // savebtn.removeClass('disabled');
                            // savebtn.removeAttr('disabled');
                            break;
                        default:
                            alert("出现未知错误！请联系系统管理员修复！");
                            location.href = "500.html";
                            // savebtn.removeClass('disabled');
                            // savebtn.removeAttr('disabled');
                            break;
                    }
                });
            $('#changeModal').modal('hide');
            //IE浏览器会多弹出一个页面，需要return false，否则表单会自己再提交一次
            return false;
        }
    } else {
        $('#changeModal').modal('hide');
        alert("请先登录");
        window.location.href = "login.html";
    }
}

$(function() {
    initCropperInModal($('#photo'), $('#photoInput'), $('#changeModal'));
});
$('#send_photo').click(function(event) {
    sendPhoto();
});
});