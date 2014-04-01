/**
 * @Copyright (c) 2013,paipai Inc. All rights reserved.
 * @update $Id: app.js 15915 2014-01-15 02:40:52Z samgui $
 */

var App = App || {};

// jQuery自定义event对象不包含dataTransfer属性
$.event.props.push('dataTransfer');

/**
 * 辅助类
 * @type {{url: Function, post: Function, ajaxUploader: Function, rndColor: Function, toFixedHexString: Function, rgbToHsl: Function, hslToRgb: Function, autoResizeImage: Function, fixType: Function, saveFile: Function, download: Function}}
 */
App.Helper = {
    //构造URI
    url: function (url) {
        return 'http://d9.oa.com/samgui/' + url;
    },
    //构造post请求
    post: function (url, obj) {
        var input, form;

        form = $('<form action="' + url + '" method="post" />');

        for (var p in obj) {
            input = $("<input type='hidden' name='" + p + "' value='" + obj[p] + "' />");
            form.append(input);
        }

        $('body').append(form);
        form.submit();
    },
    getPos: function (el) {
        var rect = el.getBoundingClientRect(),
            top = rect.top,
            left = rect.left;

        return {top: top, left: left};
    },
    //ajax上传
    ajaxUploader: function (obj) {
        var xhr = new XMLHttpRequest();
        xhr.open('post', obj.url, true);
        xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
        xhr.upload.addEventListener("progress", function (e) {
            obj.progress && obj.progress(e);
        }, false);

        xhr.addEventListener("load", function (e) {
            obj.load && obj.load(e);
        }, false);

        var fd = new FormData();
        fd.append('xfile', obj.file);
        xhr.send(fd);
    },
    //随机颜色
    rndColor: function () {
        var random_hsb = this.rgbToHsl(parseInt(Math.random() * 255), parseInt(Math.random() * 255), parseInt(Math.random() * 255));
        var random_rgb = this.hslToRgb(random_hsb[0], random_hsb[1], 0.9);
        return '#'
            + this.toFixedHexString(random_rgb[0])
            + this.toFixedHexString(random_rgb[1])
            + this.toFixedHexString(random_rgb[2]);
    },
    toFixedHexString: function (num) {
        num = parseInt(num).toString(16);
        if (num.length === 1) {
            num = '0' + num;
        }
        return num;
    },
    rgbToHex: function (rgb) {
        var rgb = rgb.replace('rgb', '').replace('(', '').replace(')', '').split(','),
            r = parseInt(rgb[0]).toString(16),
            g = parseInt(rgb[1]).toString(16),
            b = parseInt(rgb[2]).toString(16);

        r = r.length == 1 ? "0" + r : r;
        g = g.length == 1 ? "0" + g : g;
        b = b.length == 1 ? "0" + b : b;

        return "#" + r + g + b;
    },
    rgbToHsl: function (r, g, b) {
        r /= 255, g /= 255, b /= 255;
        var max = Math.max(r, g, b), min = Math.min(r, g, b);
        var h, s, l = (max + min) / 2;

        if (max == min) {
            h = s = 0; // achromatic
        } else {
            var d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r:
                    h = (g - b) / d + (g < b ? 6 : 0);
                    break;
                case g:
                    h = (b - r) / d + 2;
                    break;
                case b:
                    h = (r - g) / d + 4;
                    break;
            }
            h /= 6;
        }

        return [h, s, l];
    },
    hslToRgb: function (h, s, l) {
        var r, g, b;

        if (s == 0) {
            r = g = b = l; // achromatic
        } else {
            function hue2rgb(p, q, t) {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1 / 6) return p + (q - p) * 6 * t;
                if (t < 1 / 2) return q;
                if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
                return p;
            }

            var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            var p = 2 * l - q;
            r = hue2rgb(p, q, h + 1 / 3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1 / 3);
        }

        return [r * 255, g * 255, b * 255];
    },
    //等比例缩放
    autoResizeImage: function (maxWidth, maxHeight, objImg) {
        var img = new Image();
        img.src = objImg.src;
        var hRatio;
        var wRatio;
        var Ratio = 1;
        var w = img.width;
        var h = img.height;
        wRatio = maxWidth / w;
        hRatio = maxHeight / h;
        if (maxWidth == 0 && maxHeight == 0) {
            Ratio = 1;
        } else if (maxWidth == 0) {//
            if (hRatio < 1) Ratio = hRatio;
        } else if (maxHeight == 0) {
            if (wRatio < 1) Ratio = wRatio;
        } else if (wRatio < 1 || hRatio < 1) {
            Ratio = (wRatio <= hRatio ? wRatio : hRatio);
        }
        if (Ratio < 1) {
            w = w * Ratio;
            h = h * Ratio;
        }
        objImg.height = h;
        objImg.width = w;
    },
    /**
     * 获取mimeType
     * @param  {String} type the old mime-type
     * @return the new mime-type
     * @reference        http://www.baidufe.com/item/65c055482d26ec59e27e.html
     */
    fixType: function (type) {
        type = type.toLowerCase().replace(/jpg/i, 'jpeg');
        var r = type.match(/png|jpeg|bmp|gif/)[0];
        return 'image/' + r;
    },
    /**
     * 保存文件
     * @param  {String} data     要保存到本地的图片数据
     * @param  {String} filename 文件名
     * @reference        http://www.baidufe.com/item/65c055482d26ec59e27e.html
     */
    saveFile: function (data, filename) {
        var save_link = document.createElementNS('http://www.w3.org/1999/xhtml', 'a');
        save_link.href = data;
        save_link.download = filename;

        var event = document.createEvent('MouseEvents');
        event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
        save_link.dispatchEvent(event);
    },
    /**
     * 下载页面dom截图
     * @param container  DOM容器
     * @param fileName   文件名
     * @param ext        文件扩展名
     * @param onBefore   生成图片前
     * @param onAfter    生成图片后
     * @reference        http://www.baidufe.com/item/65c055482d26ec59e27e.html
     */
    download: function (container, fileName, ext, onBefore, onAfter) {
        var fileName;

        onBefore && onBefore();

        html2canvas(container, {
            onrendered: function (canvas) {
                var type = ext || 'jpg', imgData = canvas.toDataURL(type);

                imgData = imgData.replace(App.Helper.fixType(type), 'image/octet-stream');
                fileName = fileName || 'pp_' + (new Date()).getTime() + '_' + container.width() + 'x' + container.height() + '.' + type;
                App.Helper.saveFile(imgData, fileName);
                onAfter && onAfter();
            }
        });

        return fileName;
    }
};

/**
 * 本地存储
 * @type {{dbName: string, attrs: null, init: Function, get: Function, set: Function}}
 */
App.Storage = {
    dbName: '',
    attrs: null,
    init: function (dbName) {
        this.dbName = dbName;
        this.attrs = JSON.parse(localStorage.getItem(this.dbName));
    },
    get: function (key, def) {
        if (!this.attrs) {
            this.attrs = {};
            this.attrs[key] = def || '';
        }

        return $.trim(this.attrs[key]);
    },
    set: function (key, value) {
        if (!this.attrs) {
            this.attrs = {};
        }

        this.attrs[key] = $.trim(value);

        localStorage.setItem(this.dbName, JSON.stringify(this.attrs));
    }
};