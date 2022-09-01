        let layer = layui.layer;
        let form = layui.form;
        let laypage = layui.laypage;

        // 定义一个参数对象，提交到服务器
        let q = {
            pagenum: 1, // 页码值
            pagesize: 1, // 每页显示几条数据
            cate_id: '', // 文章分类的id
            state: '' // 文章的发布状态
        }

        // 获取文章列表数据
        initTable();
        // 加载文章分类
        initCate();

        // 绑定筛选事件
        $('#form-search').on('submit', function (e) {
            e.preventDefault();
            q.cate_id = $('[name=cate_id]').val();
            q.state = $('[name=state]').val();
            initTable();
        });

        $('tbody').on('click', '.btn-delete', function () {
            let id = $(this).attr('data-id');
            //弹出框
            layer.confirm('确定要删除吗?', { icon: 2, title: '提示' }, function (index) {
                //do something
                $.ajax({
                    method: 'GET',
                    url: '/my/article/delete/' + id,
                    success: function (res) {
                        console.log(res);
                        if (res.status !== 0) {
                            return layer.msg('删除失败！');
                        }
                        layer.msg('删除成功！');
                        layer.close(index);
                        initTable();
                    }
                });

            });
        });

        // 获取文章列表数据的方法
        function initTable() {
            $.ajax({
                method: 'GET',
                url: '/my/article/list',
                data: q,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('获取文章列表失败！');
                    }
                    // console.log(res);
                    // 引擎渲染页面数据
                    let htmlStr = template('tpl-table', res);
                    $('tbody').html(htmlStr);
                    // 分页方法
                    renderPage(res.total);
                }
            })
        };

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

        function renderPage(total) {
            laypage.render({
                elem: 'pageBox', //分页容器的id
                count: total, // 总数据条数
                limit: q.pagesize,//每页显示几条数据
                curr: q.pagenum, //设置默认被选中的分页
                layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
                limits: [1, 2, 3, 5, 10],
                // 分页发生切换的时候，触发 jump 回调
                jump: function (obj, first) {
                    // 把最新的页码值，赋值到q这个查询参数对象中
                    q.pagenum = obj.curr;
                    q.pagesize = obj.limit;
                    // first表示通过哪种方式触发jump，
                    // true 通过laypage.render()方法触发的jump回调的
                    // false 通过点击页码触发jump回调
                    if (!first) {
                        initTable();
                    }
                }
            });
        }



        // 定义美化时间的过滤器
        template.defaults.imports.dataFormat = function (date) {
            const dt = new Date(date);

            let year = dt.getFullYear();
            let month = padZero(dt.getMonth() + 1);
            let date1 = padZero(dt.getDate());

            let hour = padZero(dt.getHours());
            let min = padZero(dt.getMinutes());
            let sec = padZero(dt.getSeconds());
            return `${year}-${month}-${date1} ${hour}:${min}:${sec}`;
        }
        // 定义补零的函数
        function padZero(n) {
            return n > 9 ? n : '0' + n;
        }