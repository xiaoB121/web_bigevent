$(function () {
    let layer = layui.layer;
    let form = layui.form;

    initCate();

    // 初始化富文本编辑器
    initEditor();

    // 定义加载文章分类的方法
    function initCate() {
        // 发送ajax请求，获取文本类别
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('初始化文章分类失败！');
                }
                // 调用模板引擎，渲染分类的下拉菜单
                let htmlStr = template('tpl-cate', res);
                $('[name=cate_id]').html(htmlStr);
                // 一定要记得调用 form.render()方法，刷新表单
                form.render();
            }
        });
    }

    // 1. 初始化图片裁剪器
    let $image = $('#image');
    // 2. 裁剪选项
    let options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }
    // 3. 初始化裁剪区域
    $image.cropper(options);

    $('#btnChooseImage').on('click', function () {
        $('#coverFile').click();
    });

    $('#coverFile').on('change', function (e) {
        //获取文件列表数组
        let files = e.target.files;
        if (files.length === 0) {
            return;
        }
        console.log(files);
        //根据文件创建对应的URL地址
        var newImgURL = URL.createObjectURL(files[0]);

        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    });

    // 默认发布状态
    let art_state = '已发布';

    // 为存为草稿按钮，绑定点击事件处理函数
    $('#btnSave2').on('click', function () {
        art_state = '草稿';
    })

    // 给表单绑定 submit 提交事件
    $('#form-pub').on('submit', function (e) {
        e.preventDefault();
        let fd = new FormData($(this)[0]);
        // 将文章的发布状态存入文章中
        fd.append('state', art_state);


        // 将封面裁剪过后的图片，输出为一个对象
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {       // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作

                // 将文件对象存储到fd中
                fd.append('cover_img', blob);

                // 发起ajax数据请求
                publshArticle(fd);
            });
    });
    function publshArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            // 注意：如果向服务器提交的是FormData 格式的数据，
            // 必须添加以下两个配置顶
            contentType: false,
            processData: false,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('发布文章失败！');
                }
                layer.msg('发布文章成功！');
                // 发布文章后，跳转到文章列表页面
                location.href = '/article/art_list.html';
            }
        });
    }
});