$(function () {
    $('#link_reg').on('click', function () {
        $('.login-box').hide();
        $('.reg-box').show();
        $('#form_login')[0].reset();
    });
    $('#link_login').on('click', function () {
        $('.login-box').show();
        $('.reg-box').hide();
        $('#form_reg')[0].reset();
    });

    // 从layui中获取form对象
    let form = layui.form;
    let layer = layui.layer;
    form.verify({
        'pwd': [
            /^[\S]{6,12}$/
            , '密码必须6到12位，且不能出现空格'
        ],
        'repwd': function (value) {
            let pwd = $('.reg-box [name=password]').val();
            if (pwd !== value) {
                return '两次密码不一致!';
            }
        }
    });

    // 注册请求
    $('#form_reg').on('submit', function (e) {
        // 1.阻止默认提交行为
        e.preventDefault();
        // 2.发起Ajax的post请求
        let data = {
            username: $('#form_reg [name=username]').val(),
            password: $('#form_reg [name=password]').val()
        };
        $.post('/api/reguser',
            data,
            function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                    // console.log(res.message);
                }
                layer.msg('注册成功，请登录！');
                // console.log('注册成功！');
                $('#link_login').click();
            });

    });

    // 监听登录表单提交事件
    $('#form_login').submit(function (e) {
        //阻止默认提交行为
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/api/login',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('登录失败！');
                }
                layer.msg('登录成功！');
                // console.log(res.token);
                localStorage.setItem('token',res.token);
                // 直接跳转
                location.href='/index.html';
            }
        })
    });
})
