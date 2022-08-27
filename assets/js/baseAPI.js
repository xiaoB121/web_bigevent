// 注意，每次调用get post ajax 的时候
// 会先调用ajaxPrefilter()
// 这个函数中，可以拿到外面给Ajax提供的配置对象
$.ajaxPrefilter(function (options) {
    // console.log(options.url);
    //发起真正的ajax请求之前，同一凭借根路径
    options.url = 'http://www.liulongbin.top:3007' + options.url;
});
