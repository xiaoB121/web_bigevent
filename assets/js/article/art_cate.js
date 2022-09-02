$(function () {
    let layer = layui.layer;
    let form = layui.form;

    let indexEdit = null;
    initArtCateList();

    $('#btnAddCate').on('click', function () {
        indexEdit = layer.open({
            title: '添加文章分类',
            type: 1,
            area: ['500px', '250px'],
            content: $('#dialog-add').html()
        });
    })

    //获取文章分类的列表
    function initArtCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                let htmlStr = template('tpl-table', res);
                $('tbody').html(htmlStr);
            }
        });
    }

    // 绑定不了模板引擎渲染的form
    // 通过代理的形式，为form-add绑定 submit 事件
    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('新增分类失败！');
                }
                layer.close(indexEdit);
                initArtCateList();
                layer.msg('新增分类成功！');
            }
        });
    });


    // 通过代理的形式，为btn-edit绑定 submit 事件
    $('body').on('click', '.btn-edit', function (e) {
        indexEdit = layer.open({
            title: '修改文章分类',
            type: 1,
            area: ['500px', '250px'],
            content: $('#dialog-edit').html()
        });

        //发起请求获取对应分类的数据
        let id = $(this).attr('data-id');
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取用户信息失败');
                }
                // layer.msg('获取用户信息成功');
                form.val('form-edit', res.data);
            }
        });
    });

    // 通过代理的形式，为修改分类的表单绑定submit事件
    $('body').on('submit', '#form-edit', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                layer.msg('更新分类信息成功！');
                layer.close(indexEdit);
                initArtCateList();
            }
        });
    });

    // 通过代理的形式，绑定删除事件
    $('body').on('click', '.btn-delete', function () {
        let id = $(this).attr('data-id');
        layer.confirm('确认要删除吗?', { icon: 2, title: '询问' }, function (index) {
            //do something
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除失败！');
                    }
                    layer.msg('删除成功！');
                    layer.close(index);
                    initArtCateList();
                }
            })

        });
    })
});
