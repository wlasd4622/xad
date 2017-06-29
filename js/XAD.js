// ---------------------------------屏蔽广告
cj.contentRequest({
    type: 'update'
});
var ad = {};
// 域名集
ad.urls = {};
ad.selectObj, ad.tempPath = "", ad.selectFlag = true, ad.startTime = new Date().getTime(), ad.speed = 1;
// 临时存放选中对象的数字
ad.tempSelectObj = [];
$(document).keydown(function(event) {
    if (event.shiftKey == true && event.keyCode == 68) {
        // d
        ad.deleteElement();
        ad.tempSelectObj = [];
    } else if (event.shiftKey == true && event.keyCode == 70) {
        // f
        ad.cancelFlag = false;
        ad.selectedElement();

        //获取统计信息
        ad.getStatistics();

        setTimeout(function() {
            ad.showHelp();
        })
    } else if (event.shiftKey == true && event.keyCode == 90) {
        // z
        // 撤销 删除url
        cj.contentRequest({
            type: 'removeUrlByHost',
            key: location.host
        });
    } else if (event.shiftKey == true && event.keyCode == 65) {
        // a 删除当前域名全部
        // 撤销 删除url
        cj.contentRequest({
            type: 'removeUrlByHostAll',
            key: location.host
        });
    } else if (event.shiftKey == true && event.keyCode == 87) {
        // w
        // 选中父级元素
        ad.parentElement();
    } else if (event.shiftKey == true && event.keyCode == 88) {
        // x
        // 选中子级元素
        ad.childElement();
    } else if (event.shiftKey == true && event.keyCode == 83) {
        // s
        ad.deleteElement("s");
    } else if (event.shiftKey == true && event.keyCode == 67) {
        // 结束删除状态 c
        ad.cancelFlag = true;
        $('.adselect').removeClass('adselect');
        ad.hideHelp();
    } else if (event.shiftKey == true && event.keyCode == 85) {
        // u 更新 服务器
        cj.contentRequest({
            type: 'update',
            time: new Date()
        });
    }
});
// 选中父级元素
ad.parentElement = function() {
        // 如果到body就停止向上
        if (ad.selectObj[0].tagName.toLowerCase() == "body") {
            return false;
        }
        ad.selectObj.removeClass('adselect');
        ad.selectObj = ad.selectObj.parent();
        ad.selectObj.addClass('adselect');
        ad.tempSelectObj.push(ad.selectObj);
    }
    // 选中子级元素//选中上次选中的元素
ad.childElement = function() {
    ad.selectObj.removeClass('adselect');
    ad.tempSelectObj.pop();
    ad.selectObj = ad.tempSelectObj[ad.tempSelectObj.length - 1];
    ad.selectObj.addClass('adselect');
}
ad.deleteElement = function(type) {
    ad.parentObj(ad.selectObj, type);
    $(ad.tempPath).remove();
    ad.selectFlag = true;
    // 删除.adselect 去空格
    ad.tempPath = ad.tempPath.replace(/.adselect/g, '').trim();
    if (ad.urls[location.host]) {
        ad.urls[location.host] = ad.urls[location.host] + "," + ad.tempPath;
    } else {
        ad.urls[location.host] = ad.tempPath;
    }
    ad.tempPath = "";
    // --------------send
    var g = {};
    g.data = {};
    g.data['type'] = "setUrls";
    g.data['data'] = ad.urls;
    g.data['host'] = location.host;
    //cj.contentSendMessage(g.data);
    // 请求
    cj.contentRequest(g.data);
}
ad.selectedElement = function() {
    $('*').mousemove(function() {
        if (ad.selectFlag && !ad.cancelFlag) {
            ad.selectFlag = false;
            ad.selectObj = $(this);
            ad.selectObj.addClass('adselect');
            ad.tempSelectObj.push(ad.selectObj);
        }
    }).mouseout(function() {

        try {
            if (ad.selectObj) {
                ad.selectObj.removeClass('adselect');
            }

        } catch (e) {
            console.error(`-------------------->异常捕获$(e)`)
            ad.selectFlag = true;
        }
        ad.selectFlag = true;
    });

    $('iframe').mouseenter(function() {
        if (ad.selectFlag) {
            ad.selectObj = $(this);
            ad.selectFlag = false;
            ad.selectObj.addClass('adselect');
            ad.tempSelectObj.push(ad.selectObj);
        }
    }).mouseleave(function() {
        ad.selectFlag = true;
        ad.selectObj.removeClass('adselect');
    });
}

ad.parentObj = function(obj, type) {
    var tClass = ad.getInfo(obj);
    if (tClass) {
        if (type) {
            ad.tempPath = "body " + tClass;
        } else {
            ad.tempPath = tClass + ' ' + ad.tempPath;
            if (obj[0].tagName == "BODY") {
                return false;
            }
            ad.parentObj(obj.parent(), type);
        }
    }
}
ad.getInfo = function(obj) {
    if (obj.attr('id')) {
        return ad.filterStr('#' + obj.attr('id'));
    } else if (obj.attr('class')) {
        return ad.filterStr('.' + obj.attr('class').trim().replace(/\s/g, '.'));
    } else {
        console.log(obj[0])
        if (obj[0]) {
            return ad.filterStr(obj[0].tagName.toLowerCase());
        } else {
            return "";
        }
    }
}
ad.filterStr = function(str) {
        if (str.indexOf('/') == -1) {
            return str;
        } else {
            return '';
        }
    }
    // 请求
cj.contentRequest({
    type: 'getUrls',
    key: location.host
}, function(response) {
    ad.deletePath = response || "";
    if (ad.deletePath.match(/,$/) && ad.deletePath.match(/,$/).length > 0) {
        ad.deletePath = ad.deletePath.substring(0, ad.deletePath.length - 1);
    }
    ad.urls[location.host] = ad.deletePath;

    $('body').append('<style class="xad-style-1">' + ad.deletePath + '{display: none !IMPORTANT;}</style>');
});
// 删除广告
ad.speed = 1;
ad.del = function() {
    ad.interval = setInterval(function() {
        ad.endTime = new Date().getTime();
        if (ad.endTime - ad.startTime < 3000) {
            ad.speed = 300;
            clearInterval(ad.interval);
            ad.del();
        } else if (ad.endTime - ad.startTime < 10000) {
            ad.speed = 1000;
            clearInterval(ad.interval);
            ad.del();
        } else {
            ad.speed = 2000;
            clearInterval(ad.interval);
            ad.del();
        }
        //添加统计信息
        if (ad.deletePath) {
            let count = 0;
            ad.deletePath.split(',').forEach(function(classStr) {
                if ($(classStr).length > 0 && !$(classStr).hasClass('xad-hide')) {
                    count++;
                }
            })
            if (count > 0) {
                ad.setStatistics(count);
            }
        }
        //
        $(ad.deletePath).addClass('xad-hide').attr('style', '');
    }, ad.speed);
}
ad.setStatistics = function(count) {
        var g = {};
        g.data = {};
        g.data['type'] = "setStatistics";
        g.data['data'] = {
            date: new Date().format("yyyy-MM-dd"),
            count: count || 1
        };
        cj.contentRequest(g.data);
    }
    //ad.setStatistics(1);
ad.getStatistics = function() {
        cj.contentRequest({
            type: 'getStatistics'
        }, function(response) {
            ad.cumulative = 0;
            for (let key in response) {
                ad.cumulative += response[key];
                if (key === new Date().format("yyyy-MM-dd")) {
                    ad.today = response[key]
                }
            }

            if (ad.today && ad.today.length > 4) {
                ad.today = '99999+'
            }
            if (ad.cumulative && ad.cumulative.length > 5) {
                ad.cumulative = '999999+'
            }
            $('.xad-help-container .xad-statistics .xad-today').html(ad.today || 0);
            $('.xad-help-container .xad-statistics .xad-cumulative').html(ad.cumulative || 0);
        });
    }
    //页面初始化 执行

ad.init = function() {
    ad.del();
}
ad.init();
/*--------------------*/
ad.hideHelp = function() {
    $('.xad-help-container').remove();
}
ad.showHelp = function() {
    var statistics = ad.getStatistics();
    var html = `<div class="xad-help-container">
    <p class="xad-title">XAD广告拦截助手</p>
    <p class="xad-statistics"><span>今日已拦截:<span class="xad-today"></span>条</span><span class="xad-right">累计:<span class="xad-cumulative"></span></span></p>
    <div class="xad-content"><p><label>shift+f</label>：激活选择状态</p>
    <p><label>shift+d</label>：屏蔽选中内容</p>
    <p><label>shift+w</label>：放大要屏蔽内容的范围</p>
    <p><label>shift+x</label>：缩小要屏蔽内容的范围</p>
    <p><label>shift+z</label>：撤销上次的屏蔽操作</p>
    <p><label>shift+a</label>：撤销此网站的所有屏蔽信息</p>
    <p><label>shift+c</label>：结束选择状态</p></div></div>`;
    $('.xad-help-container').remove();
    var $showHelp = $(html)
    $('body').append($showHelp);
    $showHelp.mouseenter(function(event) {
        if (parseInt($(this).css('right')) === 0) {
            $showHelp.css({
                right: 'auto',
                left: 0
            })
        } else {
            $showHelp.css({
                left: 'auto',
                right: 0
            })
        }
    });
    var style = `<style>.xad-help-container {
            position: fixed;
    z-index: 99999999999999999999999;
    background: rgba(255, 254, 238, 0.95);
    top: 0;
    right: 0;
    border: 1px solid #ecebd5;
    border-radius: 3px;
    padding-bottom: 0;
    box-shadow: 0 0px 10px 1px rgba(86, 86, 86, 0.72);
    font-size: 12px;
    margin: 2px;
}
.xad-help-container label {
    display: inline-block;
    width: 44px;
}
.xad-help-container span.xad-right {
    float: right;
}
.xad-help-container .xad-title {
font-size: 14px;
    border-bottom: 1px solid #e2dfa7;
    line-height: 2;
    text-align: center;
    margin-bottom: 0;
}
.xad-help-container p.xad-statistics {
    margin-top: 7px;
    padding: 0 10px;
}
.xad-help-container .xad-content {
    padding: 0px 10px;
    padding-bottom: 0;
    text-align:left;
}
.xad-help-container p {
    line-height: 1.2;
    margin-bottom: 10px;
}

</style>`;
    $('body').append(style);
}

/*----------------------------------------------------屏蔽百度搜索广告*/
if ($('.xad-style').length == 0) {
    let style = `<style class="xad-style">.xad-hide{display: none !important;}</style>`;
    $('body').append(style)
}
setInterval(function() {
    if ($('.xad-style').length == 0) {
        let style = `<style class="xad-style">.xad-hide{display: none !important;}</style>`;
        $('body').append(style)
    }
    if (location.href.indexOf('https://www.baidu.com/s') == 0) {
        //添加统计
        if ($('span:contains("广告"):visible').length > 0) {
            ad.setStatistics($('span:contains("广告"):visible').length);
        }
        //
        var delObj;
        $('span:contains("广告"),a:contains("广告")').each(function() {
            if ($(this).text() === "广告" && $(this).is(':visible')) {
                var self = $(this);
                while (self.attr('id') != 'content_left') {
                    delObj = self;
                    self = self.parent();
                }
                delObj.addClass('xad-hide').attr('style', '');
            }
        })
    }
}, 300)