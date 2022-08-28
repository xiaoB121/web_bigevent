$(function () {
    let form = layui.form;
    let layer = layui.layer;

    form.verify({
        nickname: function (value) {
            if (value.length > 6) {
                return '昵称长度必须在1~6个字符之间！';
            }
        }
    });

    // 初始化用户信息
    initUserInfo(form);

    // 表单重置
    $('#btnReset').on('click', function (e) {
        // 阻止默认行为
        e.preventDefault();
        initUserInfo(form);
    });

    // 表单提交
    $('.layui-form').submit(function (e) {
        e.preventDefault();
        // 发起ajax数据请求
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('更新用户失败!');
                }
                layer.msg('更新用户成功!');
                // 调用父页面的方法，重新渲染用户头像和用户信息
                window.parent.getUserInfo();
            }
        });
    });
});

// 初始化用户信息
function initUserInfo(form) {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        success: function (res) {
            if (res.status !== 0) {
                return layer.msg('获取用户信息失败');
            }
            //调用form.val()快速赋值
            form.val('formUserInfo', res.data);
            // console.log(res);
        }
    });
}