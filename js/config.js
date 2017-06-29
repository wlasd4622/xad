$(function() {
	$('.submit').click(
			function() {
				//var data = {};
				//data['name'] = "userName";
				//data['value'] = encodeURIComponent($('[name=userName]').val());
				//data['url'] = "http://*/*";
				//data['expirationDate'] = new Date().getTime() + 1 * 60 * 60
				//		* 24 * 3600;
				//chrome.cookies.set(data);
				//window.close();
				localStorage['xadUser']=$('[name=userName]').val();
			});
});
