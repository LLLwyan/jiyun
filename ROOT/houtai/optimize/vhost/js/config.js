/**
 * Created by Administrator on 2018/9/30 0030.
 */
layui.use('element', function(){
    var element = layui.element();
    element.on('tab(config)', function(){
        loadIframe(this.getAttribute('lay-id'));
    });
});

function loadIframe(tabName) {
    var url = '';
    var number = '';
    switch (tabName) {
        case 'configTab1':
            url = '../../product/region.html?hostType=vhost';
            number = 1;
            break;
        case 'configTab2':
            url = '../../product/service.html?hostType=vhost';
            number = 2;
            break;
        case 'configTab3':
            url = '../../product/configure.html?proclass=vhost';
            number = 3;
            break;
    }

    var html = '<iframe src="' + url + '" width="100%" height="auto" style="border: 0px" name="step' + number+ '" ' +
        'id="step' + number + '" onload="this.height=step' + number + '.document.body.scrollHeight;"></iframe>';

    $('#tabContent' + number).html(html);
}

loadIframe('configTab1');
