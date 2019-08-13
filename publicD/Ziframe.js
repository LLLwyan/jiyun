$(function() {
	var url=request("url");
	if(url.length>0){
		$(".Z_iframe").eq(0).attr("src",url);
	}
	function n() {
        var t = $(this).attr("href");
        $(".Z_iframe").eq(0).attr("src",t);
        return false;
	};
	$(".Z_menuItem").each(function(t) {
        $(this).on("click", n);
    });
});