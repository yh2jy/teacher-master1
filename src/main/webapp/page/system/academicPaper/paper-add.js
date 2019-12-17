layui.use(['form','layer','upload','laydate'],function(){
    var $ = layui.$,
        layer = layui.layer,
        form = layui.form,
        upload = layui.upload,
        laydate = layui.laydate;

    //新增,更新
    var updateFlag = $(".updateFlag").val().valueOf();//0:添加 1:更新

    //渲染数据
    var deptId = window.sessionStorage.getItem("deptId");
    $.post("/teacher/biz/teacher_findAllByDept.action?deptId="+deptId, function (data) {
        $.each(data.data, function (index, item) {
            $('#sysBunk').append(new Option(item.teacherName+"_"+item.deptName, item.teacherCode));
            //下拉框--搜索教师
            $('#searchTeacher').append(new Option(item.teacherName+"_"+item.deptName, item.teacherCode));
            //复选框--已选成员
            $('#memberCode').append('<input type="checkbox" name="memberCodes" value="'+item.teacherCode+'" lay-skin="primary" title="'+item.teacherName+'"/>');
        });
        //更新的时候使用中间变量让其默认选中
        if (updateFlag==='1') {
            $('#sysBunk').val($('.personHide').val()).prop("disabled",true);//使用中间变量让其默认选中 【论文作者】
            //多选框默认选中--js传递过来的数组会变成字符串，所有要转换--记得数组非空判断   【论文成员】
            var arr = $('.memberHide').val().split(',');
            if (arr != "" && arr.length != 0) {
                for ( var i = 0; i <arr.length; i++){
                    $(".memberCode input[value="+arr[i]+"]").prop("checked","checked").prop("disabled",true);
                }
            }
        } else {
            //否则根据当前用户选中
            var thisTeacher = window.sessionStorage.getItem('teacherCode');
            $('#sysBunk').val(thisTeacher);
            $(".memberCode input[value="+thisTeacher+"]").prop("checked","checked").prop("disabled",true);//当前用户就是成员--因为其被作为论文作者选中
        }
        $('#searchTeacher').val('');
        //重新渲染select
        form.render('select');
        //重新渲染checkbox
        form.render('checkbox');
    });
    $.post("/teacher/biz/paperGrade_findAll.action", function (data) {
        $.each(data.data, function (index, item) {
            $('#paperGrade').append(new Option(item.title, item.id));
        });
        if (updateFlag === '1') {
            $('#paperGrade').val($('.paperGradeHide').val());
        }
        //重新渲染select
        form.render('select');
    });
    //执行一个laydate实例
    laydate.render({elem: '#publishTime',trigger: 'click' , type: 'date', done: function(value, date, endDate){}});

    form.on("submit(addUser)", function (data) {
        var ids = [];
        var names = [];
        $('input[name="memberCodes"]:checked').each(function(){
            ids.push($(this).val());//将选中的值添加到数组chk_value中
            names.push(this.title);//将选中的值添加到数组chk_value中
        });
        //弹出loading
        var index = top.layer.msg('数据提交中，请稍候', {icon: 16, time: false, shade: 0.8});
        // 实际使用时的提交信息
        $.post(updateFlag === '0' ? "/teacher/biz/paper_save.action" : "/teacher/biz/paper_update.action", {

            paperId: updateFlag === '0' ? null : $(".Id").val(),//id
            paperName: $(".paperName").val(),
            paperTitle: $(".paperTitle").val(),
            teacherType : data.field.teacherType,
            paperType : data.field.paperType,
            signUnit : data.field.signUnit,
            periodicalName: $(".periodicalName").val(),
            periodicalNumber: $(".periodicalNumber").val(),
            paperPublishTime: $(".publishTime").val(),

            manyFilePath: $(".manyFilePath").val(),//文件路径
            manyFileName: $(".manyFileName").val(),//文件原名称
            manyFileType: $(".manyFileType").val(),//文件类型

            memberCode : ids.join(','),//成员+作者--》id
            memberName : names.join(','),//成员+作者--》姓名
            teacherCode : $(".teacherCode").val(),//主持人工号
            paperGradeId : data.field.paperGrade
        }, function (res) {
            if (res.code === 0) {
                top.layer.close(index);
                top.layer.msg(updateFlag === '0' ? "添加论文成功！" : "修改论文成功!");
                layer.closeAll("iframe");
                //刷新父页面
                parent.location.reload();
            } else {
                top.layer.close(index);
                top.layer.msg("操作失败！");
            }
        });
        return false;
    });

    //当用户选中作者时，成员多选框中自动选中作者  -- sysBunk:lay-filter绑定的名称
    form.on("select(sysBunk)", function (data) {
        $(".memberCode input[value="+data.value+"]").prop("checked","checked");
        //重新渲染checkbox
        form.render('checkbox');
    });

    //当用户选中成员时，成员多选框中自动该成员  -- searchTeacher:lay-filter绑定的名称
    form.on("select(searchTeacher)", function (data) {
        $(".memberCode input[value="+data.value+"]").prop("checked","checked");
        //重新渲染checkbox
        form.render('checkbox');
    });

    /**
     * 附件上传接口
     */
    var fileUrls = "";  //用于保存所有文件返回的地址
    var fileNames = "";  //用于保存所有文件返回的原文件名
    var fileTypes = "";  //用于保存所有文件返回的文件类型(后缀)
    var fileLoad = "";  //弹出loading
    var demoListView = $('#demoList'),
        uploadListIns = upload.render({
        elem: '#testList',
        // url: '/teacher/upload_uploadPaperFile.action',
        url: '/teacher/upload_uploadAnnex.action',
        accept: 'file', //指定允许上传时校验的文件类型，可选值有：images（图片）、file（所有文件）、video（视频）、audio（音频）
        size: 10240,    //设置单个文件最大可允许上传的大小，单位 KB
        number:10,    //设置单最大上传的数量
        multiple: true, //是否允许多文件上传
        auto: false,    //是否选完文件后自动上传。如果设定 false，那么需要设置 bindAction 参数来指向一个其它按钮提交上传
        bindAction: '#testListAction',
        choose: function(obj){  //选择文件后回调
            var files = this.files = obj.pushFile(); //将每次选择的文件追加到文件队列
            //读取本地文件
            obj.preview(function(index, file, result){
                var tr = $(['<tr id="upload-'+ index +'">',
                    '<td>'+ file.name +'</td>',
                    '<td>'+ (file.size/1014).toFixed(1) +'kb</td>',
                    '<td>等待上传</td>',
                    '<td>',
                    '<button class="layui-btn layui-btn-xs demo-reload layui-hide">重传</button>',
                    '<button class="layui-btn layui-btn-xs layui-btn-danger demo-delete">删除</button>',
                    '</td>',
                    '</tr>'].join(''));

                //单个重传
                tr.find('.demo-reload').on('click', function(){
                    obj.upload(index, file);
                });

                //删除
                tr.find('.demo-delete').on('click', function(){
                    delete files[index]; //删除对应的文件
                    tr.remove();
                    uploadListIns.config.elem.next()[0].value = ''; //清空 input file 值，以免删除后出现同名文件不可选
                });

                demoListView.append(tr);
            });
        }
        ,before: function(obj){
            fileLoad = top.layer.msg('数据提交中，请稍候', {icon: 16, time: false, shade: 0.8});
         }
        ,done: function(res, index, upload){    //执行上传请求后回调
            top.layer.close(fileLoad);
            if(res.code == 0){ //上传成功
                //保存这些文件的路径、原文件名、文件类型（后缀）
                fileUrls = fileUrls+""+res.src+",";
                fileNames = fileNames+""+res.fileName+",";
                fileTypes = fileTypes+""+res.fileType+",";
                $('#manyFilePath').val(fileUrls);
                $('#manyFileName').val(fileNames);
                $('#manyFileType').val(fileTypes);

                var tr = demoListView.find('tr#upload-'+ index)
                    ,tds = tr.children();
                tds.eq(2).html('<span style="color: #5FB878;">上传成功</span>');
                tds.eq(3).html(''); //清空操作
                return delete this.files[index]; //删除文件队列已经上传成功的文件
            }
            this.error(index, upload);
        }
        ,error: function(index, upload){    //执行上传请求出现异常回调
            top.layer.close(fileLoad);
            var tr = demoListView.find('tr#upload-'+ index)
                ,tds = tr.children();
            tds.eq(2).html('<span style="color: #FF5722;">上传失败</span>');
            tds.eq(3).find('.demo-reload').removeClass('layui-hide'); //显示重传
        }
    });
    // 附件上传要求--添加验证规则
    form.verify({
        userFile: function (value) {if (value == null || value=="") return "请上传论文附件！";}
    })
});