/**
 *Copyright (c) 2012, Mttang Inc. All rights reserved.
 *@author: aNd1coder
 *@update: $Id: ui-clipboard.js 16552 2012-03-01 03:57:52Z guiyonghong $
 *@overview: ,完美兼容网页复制到剪贴板
 **/

function getClipboard(source) {
    if (window.clipboardData) {
        window.clipboardData.setData("Text", source)
    }
    else {
        var flashcopier = 'flashcopier';
        if (!document.getElementById(flashcopier)) {
            var divholder = document.createElement('div');
            divholder.id = flashcopier;
            document.body.appendChild(divholder);
        }
        document.getElementById(flashcopier).innerHTML = '';
        var render = '<embed src="http//static.mttang.com/flash/assets/clipboard.swf" FlashVars="clipboard=' + encodeURIComponent(source) + '" width="0" height="0" type="application/x-shockwave-flash"></embed>';
        document.getElementById(flashcopier).innerHTML = render;
    }
    alert('copy成功！');
}