var cj = {};
cj.cookies = {};
cj.history = {};
cj.localStorage = {};
cj.ajaxUtil = function(url, inParm, fn) {
    jQuery.ajax({
        type: "POST",
        url: url,
        data: inParm,
        success: function(outParm) {
            fn(outParm);
        },
        error: function() {
            // alert("网络异常，请重试！", "");
        }
    });
}
cj.chromeSetCookie = function(data) {
    for (var key in data) {
        var cookie = {};
        cookie['url'] = "http://*/*,https://*/*";
        cookie['name'] = key;
        cookie['value'] = data[key];
        cookie['expirationDate'] = new Date().getTime() + 1 * 60 * 60 * 24 * 3600;
        chrome.cookies.set(cookie);
    }

}

cj.chromeGetCookie = function(key) {
    cj.cookies[key] = "";
    var data = {};
    var value = "";
    data['name'] = key;
    data['url'] = "http://*/*,https://*/*";
    chrome.cookies.get(data, function(cookie) {
        if (cookie != null) {
            cj.cookies[key] = cookie.value;
        }
    })
}
cj.chromeRemoveCookie = function(key) {
    chrome.cookies.remove({
        name: key,
        url: 'http://*/*,https://*/*'
    })
}

cj.getHistoryList = function() {
    // 搜索历史记录
    chrome.history.search({
        text: "",
        maxResults: 1000000
    }, function(list) {
        cj.history = list;
    });
}

// 接收消息(background)
cj.backgroundReceive = function(fn) {
    chrome.runtime.onMessage.addListener(fn);
}

// content端发送消息content
cj.contentSendMessage = function(str) {
        chrome.runtime.sendMessage(str);
    }
    // content端接收消息
cj.contentReceive = function(fn) {
        chrome.extension.onMessage.addListener(function(request, sender,
            sendResponse) {
            fn(request, sender, sendResponse);
        });
    }
    // background 端服务
cj.backgroundService = function(fn) {
        chrome.extension.onRequest.addListener(function(request, sender,
            sendResponse) {
            fn(request, sender, sendResponse);
        });
    }
    // content 请求
cj.contentRequest = function(data, fn) {
        chrome.extension.sendRequest(data, function(response) {
            if (fn) {
                fn(response);
            }
        });
    }
    // 编码
cj.encodeURIComponent = function(str) {
        return encodeURIComponent(str).replace(/'/g, '1234567890987654321');
    }
    // 解码
cj.decodeURIComponent = function(str) {
        return decodeURIComponent(str).replace(/1234567890987654321/g, '\'');
    }
    // 加载iframe
cj.loadIframe = function(optins) {
    $("." + optins.classStr).remove();
    var iframe = document.createElement("iframe");
    iframe.src = optins.src;
    iframe.setAttribute('class', optins.classStr);
    // iframe.setAttribute('style','display:none;')
    iframe
        .setAttribute(
            'style',
            "    position: fixed;    top: 0;    left: 0;    width: 100%;    height: 100%;    z-index: 99999999;")
    if (iframe.attachEvent) {
        iframe.attachEvent("onload", function() {
            optins.fn($('.cjiframe').contents().find('body'));
        });
    } else {
        iframe.onload = function() {
            optins.fn($('.cjiframe').contents().find('body'));
        };
    }
    document.body.appendChild(iframe);
}
cj.createTab = function() {
    // 创建新的标签
    chrome.tabs.create({
        url: "http://hao123.com",
        selected: false,
        index: 0
    }, function(tab) {
        alert(tab)
    });
}

cj.getTabsByWindowId = function(index) {
    // 获取指定窗口所有标签的细节信息。
    chrome.tabs.getAllInWindow(index, function(tabs) {
        alert(tabs)
    });
}
cj.createWindows = function() {
    // 使用任何可选大小、位置或者默认提供的URL来创建（打开）一个新的浏览器。
    chrome.windows.create({
        url: 'http://hao123.com',
        incognito: true
    }, function(window) {
        alert(window);
    });
}
cj.getWindowsInfo = function() {
    // 获取有关窗口的详细信息。
    chrome.windows.get(function(ws) {
        alert(ws)
    });
}
cj.getAllWindows = function() {
    // 获得所有的视窗。
    chrome.windows.getAll(function(ws) {
        alert(ws)
    });
}
cj.createmenu = function() {
    // 创建一个新的右键菜单项。注意：如果在创建的过程中出现错误，会在回调函数触发后才能捕获到，错误详细信息保存在
    chrome.contextMenus.create({
        title: "屏蔽",
        onclick: function(info, tab) {
            alert(1)
        }
    }, function() {
        alert(2)
    });
}

cj.log = function(msg) {
    console.log(new Date().format("yyyy-MM-dd hh:mm:ss") + '   ' + msg);
}

cj.toStr = function(data) {
    return JSON.stringify(data);
}
cj.toData = function(str) {
    return JSON.parse(str);
}
