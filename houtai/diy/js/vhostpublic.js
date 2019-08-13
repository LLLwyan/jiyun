function getStatusColor(status,name){
    var html='';
    if(status=="1")
        html='<span style="color:#090">'+name+'</span>';
    else
        html='<span style="color:#F90">'+name+'</span>';
    return html;
}
