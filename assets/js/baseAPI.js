// 注意，每次调用get post ajax 的时候
// 会先调用ajaxPrefilter()
// 这个函数中，可以拿到外面给Ajax提供的配置对象
$.ajaxPrefilter(function (options) {
    // console.log(options.url);
    //发起真正的ajax请求之前，同一凭借根路径
    // options.url = 'http://www.liulongbin.top:3007' + options.url;
    options.url = 'http://127.0.0.1:3007' + options.url;

    // 统一为有权限的接口，设置headers请求头
    if (options.url.indexOf('/my/') !== -1) {
        options.headers = {
            Authorization: localStorage.getItem('token') || '',
        }
    }

    // 统一挂载 complete 回调函数
    options.complete = function (res) {
        // 在complete回调函数，可以使用res.responseJSON拿到服务器响应回来的数据
        if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
            // 1.强制清空token
            localStorage.removeItem('token');
            // 2.强制回到登录页面
            location.href = '/login.html';
        }
        // console.log(res);
    }
});
