$(function () {
    // 获取用户基本信息
    getUserInfo();


    let layer = layui.layer;
    // 退出登录
    $('#btnLogout').on('click', function () {
        layer.confirm('确定退出登录？', { icon: 3, title: '提示' }, function (index) {
            //do something
            // 1.清空本地存储的token
            localStorage.removeItem('token');
            // 2.重新跳转到登录页面
            location.href = '/login.html';

            //关闭confirm询问框，index是索引
            layer.close(index);
        });
    });

    // 点击 个人中心 的三个按钮
    $('.layui-nav-child').on('click', function (e) {
        if (e.target.innerHTML === '基本资料') {
            let JQ = $('#user_info');
            clearLaythis(JQ);
            JQ.click();
        }
        if (e.target.innerHTML === '更换头像') {
            let JQ = $('#user_avatar');
            clearLaythis(JQ);
            JQ.click();
        }
        if (e.target.innerHTML === '重置密码') {
            let JQ = $('#user_pwd');
            clearLaythis(JQ);
            JQ.click();
        }



    })
});

// 获取用户的基本信息
function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        // // headers 就是请求头配置对象
        // // || ''防止报错
        // 在baseAPI里设置了，而且base要比这个ajax后加载 headers: { Authorization: localStorage.getItem('token') || '' },
        success: function (res) {
            if (res.status !== 0) {
                return layui.layer.msg('获取用户信息失败！');
            }
            // 调用 renderAvatar 渲染用户头像
            renderAvatar(res.data);
            // console.log(res);
        },
        // 放到baseAPI里设置了
        // //不论成功还是失败，最终都会调用complete回调函数
        // complete: function (res) {
        //     // 在complete回调函数，可以使用res.responseJSON拿到服务器响应回来的数据
        //     if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
        //         // 1.强制清空token
        //         localStorage.removeItem('token');
        //         // 2.强制回到登录页面
        //         location.href = '/login.html';
        //     }
        //     console.log(res);
        // }
    });
}

// 渲染用户头像
function renderAvatar(user) {
    // 1.获取用户的名称
    let name = user.nickname || user.username;
    // 2.设置欢迎的文本
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name);
    // 3.按需渲染用户的头像
    if (user.user_pic !== null) {
        // 3.1渲染图片头像
        $('.layui-nav-img')
            .attr('src', user.user_pic)
            .show();
        $('.text-avatar')
            .hide();
    } else {
        // 3.2渲染文本头像
        $('.layui-nav-img')
            .hide();
        // 获取用户第一个字符
        let first = name[0].toUpperCase();
        $('.text-avatar')
            .html(first)
            .show();
    }
}

// // 清空this类,并添加新的类
// function clearLaythis(newJQ) {
//     if(newJQ.parent.Class layui-nav-itemed)
//     $('.layui-this').removeClass('layui-this');
//     newJQ.addClass('layui-this');
// } 

// 清空this类,并添加新的类
function clearLaythis(newJQ) {
    if (!newJQ.parent().parent().parent().hasClass('layui-nav-itemed')) {
        newJQ.parent().parent().parent().addClass('layui-nav-itemed');
    }
    $('.layui-this').removeClass('layui-this');
    newJQ.addClass('layui-this');
}