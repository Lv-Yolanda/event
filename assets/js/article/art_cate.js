$(function() {
    var layer = layui.layer
    var form = layui.form
    initArtCateList()
        // 获取文章分类的列表
    function initArtCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
            }
        })
    }
    // 给添加类别绑定弹出层 
    var indexAdd = null
    $('#btnAddCate').on('click', function() {
            indexAdd = layer.open({
                type: 1,
                area: ['500px', '250px'],
                title: '添加文章分类',
                content: $('#dialog-add').html(),
            });
        })
        // 通过代理的形式，为form-add表单绑定submit事件
    $('body').on('submit', '#form-add', function(e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('新增文章分类失败！')
                }
                initArtCateList()
                layer.msg('新增文章分类成功！')
                    // 根据索引，关闭对应的弹出层
                layer.close(indexAdd)
            }
        })
    })

    var indexEdit = null
        // 通过代理的形式，为btn-edit按钮绑定点击事件
    $('tbody').on('click', '#btn-edit', function() {
        // 弹出一个修改文章分类信息的层
        indexEdit = layer.open({
                type: 1,
                area: ['500px', '250px'],
                title: '编辑文章分类',
                content: $('#dialog-edit').html(),
            })
            // 通过id获取对应的那条数据
        var id = $(this).attr('data-id')
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function(res) {
                form.val('from-edit', res.data)
            }
        })
    })

    // 通过代理的形式，为form-edit表单绑定submit事件
    $('body').on('submit', '#form-edit', function(e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('更新文章分类失败！')
                }
                layer.msg('更新文章分类成功！')
                    // 根据索引，关闭对应的弹出层
                layer.close(indexEdit)
                initArtCateList()
            }
        })
    })

    // 通过代理的形式，为删除按钮绑定点击事件
    $('tbody').on('click', '#btn-delete', function() {
        var id = $(this).attr('data-id')
            // 提示用户是否要删除
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
            //do something
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章分类失败！')
                    }
                    layer.msg('删除文章分类成功！')
                    layer.close(index);
                    initArtCateList()
                }
            })
        })

    })

})