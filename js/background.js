// 初始化 userName
cj.chromeGetCookie('userName');
// 接收 content_script 发送过来的消息
var articleData = {};
cj.backgroundReceive(function(request, sender, sendRequest) {
    request.userName = localStorage.xadUser;
    cj.ajaxUtil("http://1.youhua001.sinaapp.com/cjconn.php", request, function(
        data) {})
});
// AD用
cj.backgroundService(function(request, sender, sendResponse) {
    console.log(`cj.backgroundService:${request}`)
    if (request.type == "getUrls") {
        if (localStorage.adUrls) {
            sendResponse(JSON.parse(localStorage.adUrls)[request.key])
        } else {
            sendResponse("");
        }
    } else if (request.type == "setUrls") {
        var data = localStorage.adUrls ? JSON
            .parse(localStorage.adUrls) : {};
        data[request.host] = request.data[request.host];
        localStorage.adUrls = JSON.stringify(data);
        sendResponse("");
        localStorage.xadDate = new Date();
    } else if (request.type == "removeUrlByHost") {
        // 删除最后一个
        var data = localStorage.adUrls ? JSON
            .parse(localStorage.adUrls) : {};
        var tempArray = data[request.key].split(',');
        tempArray.pop();
        data[request.key] = tempArray.join(',');
        localStorage.adUrls = JSON.stringify(data);
        localStorage.xadDate = new Date();
    } else if (request.type == "removeUrlByHostAll") {
        // 删除全部
        var data = localStorage.adUrls ? JSON
            .parse(localStorage.adUrls) : {};
        data[request.key] = "";
        localStorage.adUrls = JSON.stringify(data);
        localStorage.xadDate = new Date();
    } else if (request.type == "setStatistics") {
        var data = localStorage.statistics ? JSON
            .parse(localStorage.statistics) : {};
        data[request.data.date] = (data[request.data.date] || 0) + request.data.count;
        localStorage.statistics = JSON.stringify(data);
        sendResponse("");
    } else if (request.type == "getStatistics") {
        if (localStorage.statistics) {
            sendResponse(JSON.parse(localStorage.statistics))
        } else {
            sendResponse("");
        }
    }
});

//set cookie
chrome.cookies.set({
    name:'ab',
    value:'abab',
    domain:'baidu.com'
})