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
            url = '../../product/disk.html?noHostType=vhost&hostType=hyperv';
            number = 1;
            break;
        case 'configTab2':
            url = '../../product/region.html?noHostType=vhost';
            number = 2;
            break;
        case 'configTab3':
            url = '../../product/service.html?noHostType=vhost&hostType=hyperv';
            number = 3;
            break;
        case 'configTab4':
            url = '../../product/zone.html?noHostType=vhost';
            number = 4;
            break;
        case 'configTab5':
            url = '../../product/series.html?noHostType=vhost';
            number = 5;
            break;
        case 'configTab6':
            url = '../../product/model.html?noHostType=vhost';
            number = 6;
            break;
        case 'configTab7':
            url = '../../product/instancespec.html?noHostType=vhost';
            number = 7;
            break;
        case 'configTab8':
            url = '../../product/image.html?noHostType=vhost';
            number = 8;
            break;
        case 'configTab9':
            //url = '../../product/configure.html?proclass=cloud&noHostType=vhost';
            url = '../../product/cloudproduct.html?productCode=10008';
            number = 9;
            break;
        case 'configTab10':
            url = '../../product/price.html?noHostType=vhost';
            number = 10;
            break;
    }

    var html = '<iframe src="' + url + '" width="100%" height="auto" style="border: 0px" name="step' + number+ '" ' +
        'id="step' + number + '" onload="this.height=step' + number + '.document.body.scrollHeight;"></iframe>';

    $('#tabContent' + number).html(html);
}

loadIframe('configTab1');
