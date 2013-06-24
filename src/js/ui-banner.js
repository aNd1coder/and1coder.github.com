var FlexiBanner = {}; (function(a) {
    var slice = Array.slice || (function() {
        var _slice = Array.prototype.slice;
        return function(arr) {
            return _slice.apply(arr, _slice.call(arguments, 1))
        }
    })(),
    getType = function(v) {
        var s = typeof v;
        if (s === 'object') {
            if (v) {
                if (typeof v.length === 'number') {
                    s = 'array'
                }
            } else {
                s = 'null'
            }
        }
        return s
    },
    contains = function(superset, subset) {
        return ! find(subset, 
        function(v, k, _break) {
            if (superset[k] !== v) {
                return _break
            }
        })
    },
    equals = function(a, b) {
        return contains(a, b) && contains(b, a)
    },
    isEmpty = function(o) {
        var empty = true;
        each(o, 
        function(v, k, _break) {
            empty = false;
            return _break
        });
        return empty
    },
    each = (function() {
        var _break = {},
        arr_fn = function(numerable, fn, bind) {
            for (var i = 0, len = numerable.length; i < len; i++) {
                if (fn.call(bind, numerable[i], i, _break) == _break) {
                    return i
                }
            }
            return - 1
        },
        iterator_type = {
            'string': function(numerable, fn, bind) {
                return arr_fn(numerable.split(''), fn, bind)
            },
            'array': arr_fn,
            'number': function(numerable, fn, bind) {
                for (var i = 0; i < numerable; i++) {
                    fn.call(bind, i, i)
                }
            },
            'object': function(numerable, fn, bind) {
                for (var i in numerable) {
                    if (numerable.hasOwnProperty(i)) {
                        if (fn.call(bind, numerable[i], i, _break) == _break) {
                            return i
                        }
                    }
                }
                return - 1
            }
        },
        getIterator = function(o) {
            return iterator_type[getType(o)]
        };
        return function(numerable, fn, bind) {
            return getIterator(numerable)(numerable, fn, bind || numerable)
        }
    })(),
    find = function(numerable, fn, bind) {
        var index = each(numerable, 
        function(v, k, _break) {
            if (fn.apply(bind, arguments) === true) {
                return _break
            }
        });
        return index == -1 ? null: numerable[index]
    },
    filter = function(numerable, fn, bind) {
        var valids = [];
        each(numerable, 
        function(v) {
            if (fn.apply(bind, arguments) === true) {
                valids.push(v)
            }
        });
        return valids
    },
    map = function(numerable, fn, bind, is_dictionary) {
        var results;
        if (is_dictionary) {
            results = {};
            each(numerable, 
            function(v, k) {
                results[k] = fn.apply(bind, arguments)
            })
        } else {
            results = [];
            each(numerable, 
            function() {
                results.push(fn.apply(bind, arguments))
            })
        }
        return results
    },
    invoke = function(numerable, method_name, arg1, arg2, argN) {
        var args = slice(arguments, 2);
        each(numerable, 
        function(v, k) {
            v[method_name].apply(v, args)
        })
    },
    unlink = function(object) {
        if (object == null) {
            return object
        }
        if (typeof object.length == 'number' && typeof object != 'string') {
            return map(object, unlink)
        } else if (typeof object == 'object') {
            return map(object, unlink, null, true)
        }
        return object
    },
    mixdeep = function(r) {
        if (!r) {
            r = {}
        }
        for (var i = 1; i < arguments.length; i++) {
            var s = arguments[i];
            if (s) {
                for (var j in s) {
                    if (r[j] && typeof r[j] == 'object' && typeof s[j] == 'object') {
                        mix(r[j], s[j])
                    } else {
                        r[j] = unlink(s[j])
                    }
                }
            }
        }
        return r
    },
    mix = function(r) {
        if (!r) {
            r = {}
        }
        for (var i = 1; i < arguments.length; i++) {
            var s = arguments[i];
            if (s) {
                for (var j in s) {
                    r[j] = s[j]
                }
            }
        }
        return r
    },
    mixif = function(r) {
        if (!r) {
            r = {}
        }
        for (var i = 1; i < arguments.length; i++) {
            var s = arguments[i];
            if (s) {
                for (var j in s) {
                    if (r[j] === undefined) {
                        r[j] = s[j]
                    }
                }
            }
        }
        return r
    },
    generateId = (function() {
        var id = 1;
        return function() {
            return 'auto_gen_' + id++
        }
    })(),
    Class = {
        proto: (function() {
            var fn = function(instance, method) {
                return this.prototype[method].apply(instance, slice(arguments, 2))
            };
            return function(ctor) {
                ctor.proto = fn
            }
        })(),
        create: function(proto, sp) {
            var ctor = function() {
                if (this.init) {
                    this.init.apply(this, arguments)
                }
            };
            if (sp) {
                var F = function() {};
                F.prototype = sp.prototype;
                ctor.prototype = new F()
            }
            var protos = slice(arguments, 2);
            protos.unshift(ctor.prototype, proto);
            mix.apply(window, protos);
            return ctor
        }
    },
    getObjectToStringFn = function(assign_token, pair_separator, need_last, need_encode) {
        var encode = need_encode ? encodeURIComponent: function(k) {
            return k
        };
        return function(o) {
            return map(o, 
            function(v, k) {
                if (k != null) {
                    return k + assign_token + encode(v)
                }
            }).join(pair_separator) + (need_last ? pair_separator: '')
        }
    };
    mix(a, {
        generateId: generateId,
        slice: slice,
        getType: getType,
        equals: equals,
        isEmpty: isEmpty,
        each: each,
        map: map,
        find: find,
        filter: filter,
        mix: mix,
        mixdeep: mixdeep,
        mixif: mixif,
        buffer: function(runner, delay) {
            var timer;
            return function() {
                if (timer) {
                    clearTimeout(timer)
                }
                var args = arguments;
                timer = setTimeout(function() {
                    runner.apply(window, args)
                },
                delay || 100)
            }
        },
        Class: Class,
        format: function(s, config, reserve) {
            return s.replace(/\{([^}]*)\}/g, (typeof config == 'object') ? 
            function(m, i) {
                var ret = config[i];
                return ret == null && reserve ? m: ret
            }: config)
        },
        getObjectToStringFn: getObjectToStringFn,
        serializeStyles: getObjectToStringFn(':', ';', true, false),
        serializeAttrs: getObjectToStringFn('=', ' ', true, false),
        serializeQuery: getObjectToStringFn('=', '&', false, true)
    })
})(FlexiBanner); (function(a) {
    var el_template = '<{tag} {attrs}style="{styles}">{inner}</{tag}>',
    each = a.each,
    propertyCache = {},
    patterns = {
        HYPHEN: /(-[a-z])/i,
        ROOT_TAG: /^body|html$/i
    },
    ua = (function() {
        var o = {
            ie: 0,
            opera: 0,
            gecko: 0,
            webkit: 0,
            mobile: null
        };
        var ua = navigator.userAgent,
        m;
        if ((/KHTML/).test(ua)) {
            o.webkit = 1
        }
        m = ua.match(/AppleWebKit\/([^\s]*)/);
        if (m && m[1]) {
            o.webkit = parseFloat(m[1]);
            if (/ Mobile\//.test(ua)) {
                o.mobile = "Apple"
            } else {
                m = ua.match(/NokiaN[^\/]*/);
                if (m) {
                    o.mobile = m[0]
                }
            }
        }
        if (!o.webkit) {
            m = ua.match(/Opera[\s\/]([^\s]*)/);
            if (m && m[1]) {
                o.opera = parseFloat(m[1]);
                m = ua.match(/Opera Mini[^;]*/);
                if (m) {
                    o.mobile = m[0]
                }
            } else {
                m = ua.match(/MSIE\s([^;]*)/);
                if (m && m[1]) {
                    o.ie = parseFloat(m[1])
                } else {
                    m = ua.match(/Gecko\/([^\s]*)/);
                    if (m) {
                        o.gecko = 1;
                        m = ua.match(/rv:([^\s\)]*)/);
                        if (m && m[1]) {
                            o.gecko = parseFloat(m[1])
                        }
                    }
                }
            }
        }
        return o
    })();
    var walk = function(el, side) {
        for (var nel = el; nel; nel = nel[side]) {
            if (nel.nodeType == 1) {
                return nel
            }
        }
    },
    buildHTML = function(styles, attrs, tag, inner) {
        return a.format(el_template, {
            tag: tag || 'div',
            attrs: a.serializeAttrs(attrs || {}),
            styles: a.serializeStyles(styles),
            inner: inner || ''
        })
    },
    toCamel = function(property) {
        if (!patterns.HYPHEN.test(property)) {
            return property
        }
        if (propertyCache[property]) {
            return propertyCache[property]
        }
        var converted = property;
        while (patterns.HYPHEN.exec(converted)) {
            converted = converted.replace(RegExp.$1, RegExp.$1.substr(1).toUpperCase())
        }
        propertyCache[property] = converted;
        return converted
    },
    getStyle = (function() {
        if (document.defaultView && document.defaultView.getComputedStyle) {
            return function(el, property) {
                var value = null;
                if (property == 'float') {
                    property = 'cssFloat'
                }
                var computed = document.defaultView.getComputedStyle(el, '');
                if (computed) {
                    value = computed[toCamel(property)]
                }
                return el.style[property] || value
            }
        } else if (document.documentElement.currentStyle && ua.ie) {
            return function(el, property) {
                switch (toCamel(property)) {
                case 'opacity':
                    var val = 100;
                    try {
                        val = el.filters['DXImageTransform.Microsoft.Alpha'].opacity
                    } catch(e) {
                        try {
                            val = el.filters('alpha').opacity
                        } catch(e) {}
                    }
                    return val / 100;
                case 'float':
                    property = 'styleFloat';
                default:
                    var value = el.currentStyle ? el.currentStyle[property] : null;
                    return (el.style[property] || value)
                }
            }
        } else {
            return function(el, property) {
                return el.style[property]
            }
        }
    })(),
    setStyle = (function() {
        var px = /left|top|right|bottom|width|height/;
        var transVal = function(k, v) {
            if (px.test(k) && typeof v == 'number') {
                v = v + 'px'
            }
            return v
        };
        if (ua.ie) {
            return function(el, property, val) {
                property = toCamel(property);
                switch (property) {
                case 'opacity':
                    el.style.filter = 'alpha(opacity=' + val * 100 + ')';
                    if (!el.currentStyle || !el.currentStyle.hasLayout) {
                        el.style.zoom = 1
                    }
                    break;
                case 'float':
                    property = 'styleFloat';
                default:
                    el.style[property] = transVal(property, val)
                }
            }
        } else {
            return function(el, property, val) {
                property = toCamel(property);
                if (property == 'float') {
                    property = 'cssFloat'
                }
                el.style[property] = transVal(property, val)
            }
        }
    })(),
    getDocumentScrollLeft = function(doc) {
        doc = doc || document;
        return Math.max(doc.documentElement.scrollLeft, doc.body.scrollLeft)
    },
    getDocumentScrollTop = function(doc) {
        doc = doc || document;
        return Math.max(doc.documentElement.scrollTop, doc.body.scrollTop)
    },
    getDocumentHeight = function() {
        var scrollHeight = (document.compatMode != 'CSS1Compat') ? document.body.scrollHeight: document.documentElement.scrollHeight;
        var h = Math.max(scrollHeight, getViewportHeight());
        return h
    },
    getDocumentWidth = function() {
        var scrollWidth = (document.compatMode != 'CSS1Compat') ? document.body.scrollWidth: document.documentElement.scrollWidth;
        var w = Math.max(scrollWidth, getViewportWidth());
        return w
    },
    getViewportHeight = function() {
        var height = self.innerHeight;
        var mode = document.compatMode;
        if ((mode || ua.ie) && !ua.opera) {
            height = (mode == 'CSS1Compat') ? document.documentElement.clientHeight: document.body.clientHeight
        }
        return height
    },
    getViewportWidth = function() {
        var width = self.innerWidth;
        var mode = document.compatMode;
        if (mode || ua.ie) {
            width = (mode == 'CSS1Compat') ? document.documentElement.clientWidth: document.body.clientWidth
        }
        return width
    },
    getXY = function(el) {
        var pos = [el.offsetLeft, el.offsetTop];
        var parentNode = el.offsetParent;
        var accountForBody = (ua.webkit && getStyle(el, 'position') == 'absolute' && el.offsetParent == el.ownerDocument.body);
        if (parentNode != el) {
            while (parentNode) {
                pos[0] += parentNode.offsetLeft;
                pos[1] += parentNode.offsetTop;
                if (!accountForBody && ua.webkit && getStyle(parentNode, 'position') == 'absolute') {
                    accountForBody = true
                }
                parentNode = parentNode.offsetParent
            }
        }
        if (accountForBody) {
            pos[0] -= el.ownerDocument.body.offsetLeft;
            pos[1] -= el.ownerDocument.body.offsetTop
        }
        parentNode = el.parentNode;
        while (parentNode.tagName && !patterns.ROOT_TAG.test(parentNode.tagName)) {
            if (getStyle(parentNode, 'display').search(/^inline|table-row.*$/i)) {
                pos[0] -= parentNode.scrollLeft;
                pos[1] -= parentNode.scrollTop
            }
            parentNode = parentNode.parentNode
        }
        return pos
    },
    $ = function(id) {
        if (typeof id == 'string') {
            return document.getElementById(id)
        }
        return id
    };
    a.DomUtil = {
        ua: ua,
        get: $,
        buildHTML: buildHTML,
        createElement: function(html) {
            if (typeof html != 'string') {
                html = buildHTML.apply(window, arguments)
            }
            var el = document.createElement('div');
            el.innerHTML = html;
            return el.firstChild
        },
        next: function(el) {
            return walk(el, 'nextSibling')
        },
        pre: function(el) {
            return walk(el, 'previousSibling')
        },
        children: function(el) {
            var results = [];
            for (var cel = el.firstChild; cel; cel = cel.nextSibling) {
                if (cel.nodeType == 1) {
                    results.push(cel)
                }
            }
            return results
        },
        setStyle: function(el, k, v) {
            el = $(el);
            if (typeof k == 'object') {
                each(k, 
                function(_v, _k) {
                    setStyle(el, _k, _v)
                })
            } else {
                setStyle(el, k, v)
            }
        },
        getStyle: function(el, k) {
            return getStyle($(el), k)
        },
        getXY: function(el) {
            return getXY($(el))
        },
        hide: function(el) {
            setStyle(el, 'display', 'none')
        },
        show: function(el) {
            setStyle(el, 'display', '')
        },
        getDocumentHeight: getDocumentHeight,
        getDocumentWidth: getDocumentWidth,
        getViewportHeight: getViewportHeight,
        getViewportWidth: getViewportWidth,
        getDocumentScrollTop: getDocumentScrollTop,
        getDocumentScrollLeft: getDocumentScrollLeft,
        absolutize: function(el, zIndex, insert_to_body) {
            el.className = 'absolute';
            a.DomUtil.setStyle(el, {
                position: 'absolute',
                left: '-999px',
                top: '-9999px',
                zIndex: zIndex
            });
            if (insert_to_body) {
                document.body.insertBefore(el, document.body.firstChild)
            }
        },
        align: function(anchor, brick, type) {
            anchor = $(anchor);
            brick = $(brick);
            var sizes = {},
            types = type.split('-'),
            anchorXY = getXY(anchor),
            x = anchorXY[0],
            y = anchorXY[1];
            each({
                anchor: anchor,
                brick: brick
            },
            function(el, name) {
                var o = sizes[name] = {};
                each(['Width', 'Height'], 
                function(side) {
                    o[side.toLowerCase()] = el['offset' + side]
                })
            });
            each(types[0].split(''), 
            function(al) {
                switch (al) {
                case 'r':
                    x += sizes.anchor.width;
                    break;
                case 'b':
                    y += sizes.anchor.height;
                    break;
                default:
                    break
                }
            });
            each(types[1].split(''), 
            function(al) {
                switch (al) {
                case 'r':
                    x -= sizes.brick.width;
                    break;
                case 'b':
                    y -= sizes.brick.height;
                    break;
                default:
                    break
                }
            });
            brick.style.left = x + 'px';
            brick.style.top = y + 'px'
        }
    }
})(FlexiBanner); (function(a) {
    var $ = a.DomUtil.get,
    evt = a.DomEventUtil = {};
    if (document.addEventListener) {
        evt.on = function(el, type, handler) {
            $(el).addEventListener(type, handler, false);
            return handler
        };
        evt.un = function(el, type, handler) {
            $(el).removeEventListener(type, handler, false)
        };
        evt.stopPropagation = function(e) {
            e.stopPropagation()
        };
        evt.preventDefault = function(e) {
            e.preventDefault()
        };
        evt.getTarget = function(e) {
            return e.target
        }
    } else {
        evt.on = function(el, type, handler) {
            el = $(el);
            var actualHandler = function() {
                handler.call(el, window.event)
            };
            el.attachEvent('on' + type, actualHandler);
            return actualHandler
        };
        evt.un = function(el, type, actualHandler) {
            $(el).detachEvent('on' + type, actualHandler)
        };
        evt.stopPropagation = function(e) {
            e.cancelBubble = true
        };
        evt.preventDefault = function(e) {
            e.returnValue = false
        };
        evt.getTarget = function(e) {
            return e.srcElement
        }
    }
    evt.stop = function(e) {
        evt.stopPropagation(e);
        evt.preventDefault(e)
    }
})(FlexiBanner); (function(a) {
    a.Cookie = {
        set: function(key, value, options) {
            var text = key + '=' + value;
            if (options) {
                if (options.expires) {
                    text += "; expires=" + (new Date((new Date()).getTime() + 86400000 * options.expires)).toGMTString()
                }
                if (options.path) {
                    text += "; path=" + options.path
                }
                if (options.domain) {
                    text += "; domain=" + options.domain
                }
                if (options.secure === true) {
                    text += "; secure"
                }
            }
            document.cookie = text
        },
        get: function() {
            var text = document.cookie;
            var cookies = {};
            if (/[^=]+=[^=;]?(?:; [^=]+=[^=]?)?/.test(text)) {
                var cookieParts = text.split(/;\s/g),
                cookieName = null,
                cookieValue = null,
                cookieNameValue = null;
                for (var i = 0, len = cookieParts.length; i < len; i++) {
                    cookieNameValue = cookieParts[i].match(/([^=]+)=/i);
                    if (cookieNameValue instanceof Array) {
                        cookieName = cookieNameValue[1];
                        cookieValue = cookieParts[i].substring(cookieNameValue[1].length + 1)
                    } else {
                        cookieName = cookieParts[i];
                        cookieValue = cookieName
                    }
                    cookies[cookieName] = cookieValue
                }
            }
            return cookies
        },
        remove: function(k, options) {
            options = options || {};
            options.expires = -1;
            this.set(k, "", options)
        }
    }
})(FlexiBanner); (function(a) {
    var dom = a.DomUtil,
    $time = Date.now || 
    function() {
        return new Date().getTime()
    },
    default_config = {
        duration: 1,
        transition: function(p) {
            return p
        },
        callback: function() {}
    };
    var compute = function(from, to, delta) {
        return (to - from) * delta + from
    },
    buildFrom = function(el, from, to) {
        a.each(to, 
        function(v, k) {
            if (from[k] == null) {
                from[k] = parseInt(dom.getStyle(el, k), 10)
            } else {
                dom.setStyle(el, k, from[k])
            }
        })
    };
    a.Anim = a.Class.create({
        init: function(el, config) {
            this.el = dom.get(el);
            this.config = a.mixif(config, default_config);
            this.chains = []
        },
        morph: function(o) {
            if (this.playing) {
                this.chains.push(o)
            } else {
                this._morph(o);
                this.playing = true
            }
            return this
        },
        _morph: function(o) {
            var from = o.from || {},
            to = o.to,
            config = o.config || {};
            a.mixif(config, this.config);
            var el = this.el,
            duration = config.duration * 1000,
            transition = config.transition,
            startTime = $time(),
            me = this;
            buildFrom(el, from, to);
            var trans = function(delta) {
                a.each(to, 
                function(value, property) {
                    dom.setStyle(el, property, compute(from[property], value, delta))
                })
            };
            var timer = setInterval(function() {
                var time = $time();
                if (time < startTime + duration) {
                    trans(transition((time - startTime) / duration))
                } else {
                    trans(1);
                    clearInterval(timer);
                    me._chain()
                }
            },
            20)
        },
        _chain: function() {
            if (this.chains.length) {
                this._morph(this.chains.shift())
            } else {
                this.playing = false;
                this.config.callback()
            }
        }
    })
})(FlexiBanner);
var mutex_lock,
mutex_unlock; (function() {
    var locked = false;
    mutex_lock = function() {
        if (locked) {
            return - 1
        } else {
            locked = true;
            return 0
        }
    };
    mutex_unlock = function() {
        locked = false;
        return 0
    }
})(); (function(a) {
    var each = a.each,
    Class = a.Class,
    dom = a.DomUtil,
    ua = dom.ua,
    buildHTML = dom.buildHTML,
    dic_area_display = {},
    cookie = a.Cookie.get(),
    display_index = parseInt(cookie['ad_play_index']) || Math.floor(Math.random() * 100),
    FLASH_VAR_LINK = 'adlink';
    a.Cookie.set('ad_play_index', display_index + 1, {
        expires: 1
    });
    var ping = function(url) { (new Image()).src = url
    },
    displayInOrder = function(area_config) {
        return function() {
            if (arguments.length == 0) {
                return
            }
            var creativity_config = arguments[display_index % arguments.length];
            dic_area_display[area_config.id] = dm.create(creativity_config['display'], {
                area_config: area_config,
                creativity_config: creativity_config
            })
        }
    };
    var renderImage = function(config, el) {
        var styles = {
            display: 'block',
            cursor: 'pointer',
            width: config.width + 'px',
            height: config.height + 'px'
        };
        var url = config.resource_url;
        if (getExtension(url) == 'png' && ua.ie != 0 && ua.ie < 7) {
            styles['filter'] = a.format('progid:DXImageTransform.Microsoft.AlphaImageLoader(src=\'{uri}\')', url)
        } else {
            styles['background-image'] = a.format('url({uri})', url)
        }
        el.innerHTML = buildHTML(styles);
        el.firstChild.onclick = function() {
            window.open(config.link_to)
        }
    };
    var renderFlash = function(config, el) {
        var params = {
            quality: 'high',
            allowscriptaccess: 'always',
            wmode: 'opaque',
            swliveconnect: true
        };
        if (config.params) {
            a.mix(params, config.params)
        }
        var flashvars = config.flashvars || {};
        if (config.link_to) {
            flashvars[FLASH_VAR_LINK] = config.link_to
        }
        params.flashvars = a.serializeQuery(flashvars);
        var attrs = {};
        if (ua.ie) {
            attrs.classid = 'clsid:D27CDB6E-AE6D-11cf-96B8-444553540000';
            params.movie = config.resource_url
        } else {
            params.type = 'application/x-shockwave-flash';
            attrs.data = config.resource_url
        }
        el.innerHTML = buildHTML({
            width: config.width + 'px',
            height: config.height + 'px'
        },
        attrs, 'object', buildParams(params))
    };
    var param_template = '<param name="{name}" value="{value}"></param>';
    var buildParams = function(o) {
        return a.map(o, 
        function(v, k) {
            return a.format(param_template, {
                name: k,
                value: v
            })
        }).join('')
    };
    var getExtension = function(uri) {
        var query_string_index = uri.indexOf('?');
        return uri.substring(uri.lastIndexOf('.') + 1, query_string_index == -1 ? uri.length: query_string_index)
    };
    a.DisplayBase = Class.create({
        init: function(config) {
            a.mix(this, config)
        },
        getFodder: function(origin) {
            var fodder = this['creativity_config']['fodder'];
            if (!origin && fodder.length == 1) {
                return fodder[0]
            }
            return fodder
        },
        getDisplayConfig: function() {
            return this['creativity_config']['display_config']
        },
        appendToPing: function() {
            var creativity_config = this.creativity_config;
            a.ping.append({
                loc: this.area_config.id,
                cid: creativity_config.cid,
                oid: creativity_config.oid
            });
            if (creativity_config['monitor_url']) {
                ping(creativity_config['monitor_url'])
            }
        },
        render: function() {
            this.preRender();
            this.doRender()
        },
        preRender: function() {},
        doRender: function() {}
    });
    a.PingDisplayBase = Class.create({
        preRender: function() {
            this.appendToPing()
        }
    },
    a.DisplayBase);
    a.DisplayHelper = {
        render: function(config, el, set_size) {
            if (set_size) {
                dom.setStyle(el, {
                    width: config.width,
                    height: config.height
                })
            }
            if (config.type == 'image') {
                renderImage(config, el)
            } else {
                renderFlash(config, el);
                if (config.cover) {
                    if (dom.getStyle(el, 'position') == 'static') {
                        el.style.position = 'relative'
                    }
                    var cover = document.createElement('div');
                    cover.className = 'absolute';
                    dom.setStyle(cover, {
                        position: 'absolute',
                        width: config.width + 'px',
                        height: config.height + 'px',
                        left: '0px',
                        top: '0px',
                        cursor: 'pointer',
                        'background-color': '#fff',
                        filter: 'alpha(opacity=0)',
                        opacity: 0
                    });
                    cover.onclick = function() {
                        window.open(config.link_to)
                    };
                    el.appendChild(cover)
                }
            }
        }
    }; (function() {
        var dic_display_type_klass = {};
        a.DisplayManager = {
            create: function(ctor, config) {
                if (typeof ctor == 'string') {
                    ctor = dic_display_type_klass[ctor]
                }
                if (ctor) {
                    return new ctor(config)
                }
            },
            reg: function(type, klass) {
                dic_display_type_klass[type] = klass
            }
        }
    })();
    var dm = a.DisplayManager;
    a.area = displayInOrder;
    a.render = (function() {
        var index = 0,
        MAX = 5,
        rendered = {};
        var renderDefault = function(area_id) {
            var el = dom.get(area_id);
            if (!el || dom.getStyle(el, 'display') == 'none') {
                return
            }
            setTimeout(function() { (dm.create('default', {
                    area_config: {
                        id: area_id
                    },
                    creativity_config: {
                        fodder: [{
                            type: 'flash',
                            resource_url: a.format('http://static.mttang.com/p/mttang/img/default{i}.swf', (index++%MAX) + 1),
                            cover: false,
                            width: el.clientWidth,
                            height: el.clientHeight
                        }]
                    }
                })).render()
            })
        };
        return function(area_id) {
            if (rendered[area_id]) {
                return
            }
            rendered[area_id] = true;
            var display = dic_area_display[area_id];
            if (display) {
                display.render()
            } else {
                renderDefault(area_id)
            }
        }
    })();
    a.ping = (function() {
        var url = 'http://adping.qq.com/p.jpg?oid={oid}&cid={cid}&loc={loc}',
        query_strings = ['oid', 'cid', 'loc'],
        buffer = {},
        clearBuffer = function() {
            each(query_strings, 
            function(k) {
                buffer[k] = []
            })
        };
        clearBuffer();
        return {
            touch: ping,
            append: function(data) {
                each(buffer, 
                function(v, k) {
                    v.push(data[k])
                });
                return this
            },
            flush: function() {
                ping(a.format(url, buffer));
                clearBuffer();
                return this
            }
        }
    })()
})(FlexiBanner); (function(a) {
    var each = a.each,
    map = a.map,
    dom = a.DomUtil,
    $ = dom.get,
    evt = a.DomEventUtil,
    close_button_height = 13,
    close_button_url = 'http://static.mttang.com/p/mttang/img/db_close.gif',
    close_button_html = '<div style="width:{width}px;height:{height}px;background-color:#eee;"><img src="{close_button_url}" style="border:none;float:right;cursor:pointer;width:13px;"></img></div>',
    render = a.DisplayHelper.render,
    doNothing = function() {},
    getFlashInvoker = function(container) {
        var o = container.getElementsByTagName('object');
        if (o.length) {
            var flash = o[0];
            return function(method) {
                try {
                    flash[method]()
                } catch(e) {}
            }
        } else {
            return doNothing
        }
    },
    getReg = function(superclass) {
        var _reg = function(o, type) {
            if (typeof o == 'function') {
                o = o()
            }
            a.DisplayManager.reg(type, a.Class.create(o, superclass))
        };
        return function(type, o) {
            if (arguments.length == 1) {
                each(type, _reg)
            } else {
                _reg(o, type)
            }
        }
    },
    regPing = getReg(a.PingDisplayBase),
    regNoPing = getReg(a.DisplayBase),
    observeWindow = function(observer, buffer, run_it) {
        if (buffer) {
            observer = a.buffer(observer, buffer)
        }
        evt.on(window, 'scroll', observer);
        evt.on(window, 'resize', observer);
        if (run_it) {
            observer()
        }
    },
    createAbsoluteElement = function(zIndex) {
        var el = document.createElement('div');
        el.style.position = 'absolute';
        el.className = 'absolute';
        if (zIndex) {
            el.style.zIndex = zIndex
        }
        document.body.insertBefore(el, document.body.firstChild);
        return el
    },
    enter_mutex = function(fn, delay) {
        setTimeout(function() {
            if (mutex_lock() == 0) {
                fn()
            } else {
                setTimeout(arguments.callee, 500)
            }
        },
        (delay || 0) * 1000)
    };
    regNoPing({
        'default': {
            doRender: function() {
                render(this.getFodder(), $(this.area_config.id))
            }
        },
        'popup': {
            doRender: function() {
                var c = this['creativity_config'],
                display_config = c.display_config,
                area_id = this.area_config.id,
                fodder = this.getFodder();
                if (display_config.focus_back && /tencenttraveler|myie|maxthon|opera/i.test(navigator.userAgent)) {
                    return
                }
                setTimeout(function() {
                    var popup_window = window.open('http://static.mttang.com/p/mttang/img/a.html?' + a.serializeQuery(a.mix({
                        loc: area_id,
                        oid: c.oid,
                        cid: c.cid
                    },
                    fodder)), '_blank', a.getObjectToStringFn('=', ',', false, false)({
                        menubar: 'no',
                        left: 0,
                        top: 0,
                        width: fodder.width,
                        height: fodder.height
                    }));
                    if (popup_window && display_config.focus_back) {
                        popup_window.blur();
                        window.focus()
                    }
                },
                display_config.delay * 1000)
            }
        }
    });
    regPing({
        'banner': {
            doRender: function() {
                render(this.getFodder(), $(this.area_config.id))
            }
        },
        'float_fullscreen': {
            doRender: function() {
                var el = dom.get(this.area_config.id),
                fodder = this.getFodder(),
                display_config = this.getDisplayConfig(),
                closed = false;
                var close = function() {
                    if (!closed) {
                        dom.hide(el);
                        mutex_unlock();
                        closed = true
                    }
                };
                enter_mutex(function() {
                    var _el = document.createElement('div');
                    render(fodder, _el, true);
                    var close_button_panel = dom.createElement(a.format(close_button_html, {
                        width: fodder.width,
                        height: close_button_height,
                        close_button_url: close_button_url
                    }));
                    evt.on(close_button_panel.firstChild, 'click', close);
                    el.appendChild(close_button_panel);
                    el.appendChild(_el);
                    dom.show(el);
                    setTimeout(close, display_config.duration * 1000)
                },
                display_config.delay)
            }
        },
        'raw_fullscreen': {
            doRender: function() {
                var container = dom.get(this.area_config.id),
                fodder = this.getFodder(),
                display_config = this.getDisplayConfig();
                enter_mutex(function() {
                    render(fodder, container);
                    dom.show(container);
                    setTimeout(function() {
                        dom.hide(container);
                        mutex_unlock()
                    },
                    display_config.duration * 1000)
                },
                display_config.delay)
            }
        },
        'float': function() {
            var delegate = function(fn, arg2) {
                return function(arg1) {
                    return fn(arg1, arg2)
                }
            },
            leftCalculator = {
                left: function(el_width, margin) {
                    return dom.getDocumentScrollLeft() + margin
                },
                right: function(el_width, margin) {
                    return dom.getViewportWidth() + dom.getDocumentScrollLeft() - el_width - margin
                }
            },
            topCalculator = {
                top: function(el_height, margin) {
                    return dom.getDocumentScrollTop() + margin
                },
                middle: function(el_height, margin) {
                    return (dom.getViewportHeight() - el_height) / 2 + dom.getDocumentScrollTop()
                },
                bottom: function(el_height, margin) {
                    return dom.getViewportHeight() + dom.getDocumentScrollTop() - el_height - margin
                }
            },
            renderFloat = function(edges, display_config, fodder, close) {
                var fodder_height = fodder.height,
                fodder_width = fodder.width,
                direction = edges[0],
                position = edges[1],
                cl = delegate(leftCalculator[direction], display_config.margin_h),
                ct = delegate(topCalculator[position], display_config.margin_v),
                el = createAbsoluteElement(100),
                page_content_width = display_config.page_content_width,
                getPosition = function() {
                    return {
                        left: cl(fodder_width),
                        top: ct(fodder_height)
                    }
                },
                anim = new a.Anim(el, {
                    duration: 1,
                    transition: function(p) {
                        return Math.pow(p, .4)
                    }
                });
                if (display_config.close_button != 'none') {
                    fodder_height += close_button_height;
                    var _el = document.createElement('div');
                    render(fodder, _el, true);
                    var close_button_panel = dom.createElement(a.format(close_button_html, {
                        width: fodder_width,
                        height: close_button_height,
                        close_button_url: close_button_url
                    }));
                    evt.on(close_button_panel.firstChild, 'click', close);
                    if (display_config.close_button == 'bottom') {
                        el.appendChild(_el);
                        el.appendChild(close_button_panel)
                    } else if (display_config.close_button == 'top') {
                        el.appendChild(close_button_panel);
                        el.appendChild(_el)
                    }
                } else {
                    render(fodder, el)
                }
                var widthIsValid = function() {
                    if ((dom.getViewportWidth() - page_content_width) / 2 < fodder_width + display_config.margin_h) {
                        dom.hide(el);
                        return false
                    }
                    dom.show(el);
                    return true
                };
                observeWindow(function() {
                    if (!display_config.follow_viewport) {
                        return
                    }
                    if (!widthIsValid()) {
                        return
                    }
                    var dp = getPosition();
                    sxy = dom.getXY(el),
                    sx = sxy[0],
                    sy = sxy[1],
                    dy = dp.top,
                    from = {},
                    config = {};
                    if (position == 'bottom') {
                        if (sy > dy + fodder_height) {
                            from.top = dom.getDocumentScrollTop() + dom.getViewportHeight();
                            config.duration = .3
                        }
                    } else if (position == 'top') {
                        if (sy < dy - fodder_height) {
                            from.top = dom.getDocumentScrollTop() - fodder_height;
                            config.duration = .3
                        }
                    }
                    anim.morph({
                        from: from,
                        to: dp,
                        config: config
                    })
                },
                300, false);
                dom.setStyle(el, getPosition());
                widthIsValid();
                return el
            };
            return {
                doRender: function() {
                    var display_config = this.getDisplayConfig(),
                    edges = display_config.edges.split(','),
                    fodder = this.getFodder(true);
                    delete display_config.edges;
                    var close = function() {
                        each(els, dom.hide);
                        display_config.follow_viewport = false
                    };
                    var els = map(edges, 
                    function(edge, i) {
                        return renderFloat(edge.split('-'), display_config, fodder[i], close)
                    })
                }
            }
        },
        'couplet': function() {
            var top_edge = 17,
            left_edge = 12,
            right_edge = 12,
            page_content_width = 766,
            close_button_size = 13,
            close_button_src = 'http://static.mttang.com/p/mttang/img/db_close.gif';
            return {
                doRender: function() {
                    var fodders = this.getFodder(),
                    closed = false;
                    var close = function() {
                        display(false);
                        closed = true
                    };
                    var els = map(fodders, 
                    function(fodder) {
                        var el = createAbsoluteElement(100);
                        dom.setStyle(el, {
                            top: top_edge,
                            width: fodder.width,
                            height: fodder.height + close_button_size
                        });
                        render(fodder, el, false);
                        var close_button_panel = dom.createElement(a.format(close_button_html, {
                            width: fodder.width,
                            height: close_button_height,
                            close_button_url: close_button_url
                        }));
                        evt.on(close_button_panel.firstChild, 'click', close);
                        el.appendChild(close_button_panel);
                        return el
                    });
                    dom.setStyle(els[0], {
                        left: left_edge
                    });
                    dom.setStyle(els[1], {
                        right: right_edge
                    });
                    var display = function(visible) {
                        each(els, 
                        function(el) {
                            dom.setStyle(el, {
                                display: visible ? 'block': 'none'
                            })
                        })
                    };
                    observeWindow(function() {
                        if (!closed) {
                            display(dom.getViewportWidth() - left_edge - fodders[0].width - fodders[1].width - right_edge - page_content_width > 0)
                        }
                    },
                    100, true)
                }
            }
        },
        'fullscreen': function() {
            var replay_button_width = 48,
            replay_button_height = 19,
            replay_button_offsetY = -8,
            replay_button_config = {
                position: 'absolute',
                width: replay_button_width + 'px',
                height: replay_button_height + 'px',
                display: 'none',
                'background-image': 'url(http://static.mttang.com/p/mttang/img/f_replay.gif)',
                cursor: 'pointer'
            },
            close_button_config = {
                position: 'absolute',
                width: '19px',
                height: '19px',
                right: '7px',
                top: '7px',
                'background-image': 'url(http://static.mttang.com/p/mttang/img/f_close.gif)',
                cursor: 'pointer'
            },
            back_proxy_config = {
                'z-index': 999,
                left: '-9999px',
                position: 'absolute',
                border: '2px solid #ccc',
                opacity: .5,
                filter: 'alpha(opacity=50)'
            };
            return {
                doRender: function() {
                    var container = dom.get(this.area_config.id),
                    fodder = this.getFodder(),
                    display_config = this.getDisplayConfig(),
                    show_duration = display_config.show_duration,
                    hide_duration = display_config.hide_duration,
                    close_button = dom.createElement(close_button_config, {
                        'class': 'absolute'
                    }),
                    replay_button = dom.createElement(replay_button_config, {
                        'class': 'absolute'
                    }),
                    close_timer;
                    dom.setStyle(container, {
                        overflow: 'hidden',
                        height: 0,
                        position: 'relative',
                        display: 'block'
                    });
                    var fodder_width = fodder.width,
                    fodder_height = fodder.height,
                    back_proxy = dom.createElement(back_proxy_config);
                    render(fodder, container);
                    var invokeFlash = getFlashInvoker(container);
                    var morphProxy = (function() {
                        var anim_proxy = new a.Anim(back_proxy, {
                            callback: function() {
                                dom.setStyle(back_proxy, {
                                    left: -9999
                                })
                            }
                        });
                        return function(show) {
                            dom.setStyle(replay_button, {
                                display: ''
                            });
                            var f_xy = dom.getXY(container),
                            t_xy = dom.getXY(replay_button);
                            dom.setStyle(replay_button, {
                                display: 'none'
                            });
                            var arr = [{
                                left: f_xy[0],
                                top: f_xy[1],
                                width: fodder_width - 4,
                                height: fodder_height - 4
                            },
                            {
                                left: t_xy[0],
                                top: t_xy[1],
                                width: replay_button_width - 4,
                                height: replay_button_height - 4
                            }];
                            if (!show) {
                                anim_proxy.morph({
                                    from: arr[0],
                                    to: arr[1],
                                    config: {
                                        duration: hide_duration
                                    }
                                })
                            } else {
                                anim_proxy.morph({
                                    from: arr[1],
                                    to: arr[0],
                                    config: {
                                        duration: show_duration
                                    }
                                })
                            }
                        }
                    })();
                    var hide = (function() {
                        var anim_hide = new a.Anim(container, {
                            duration: hide_duration,
                            callback: function() {
                                dom.setStyle(replay_button, {
                                    display: 'block'
                                });
                                mutex_unlock()
                            }
                        });
                        return function() {
                            clearTimeout(close_timer);
                            morphProxy(false);
                            invokeFlash('StopPlay');
                            anim_hide.morph({
                                to: {
                                    height: 0
                                }
                            })
                        }
                    })();
                    var show = (function() {
                        var anim_show = new a.Anim(container, {
                            duration: show_duration,
                            callback: function() {
                                invokeFlash('Play');
                                close_timer = setTimeout(hide, display_config.duration * 1000)
                            }
                        });
                        return function() {
                            clearTimeout(close_timer);
                            dom.setStyle(replay_button, {
                                display: 'none'
                            });
                            morphProxy(true);
                            invokeFlash('Rewind');
                            anim_show.morph({
                                to: {
                                    height: fodder_height
                                }
                            })
                        }
                    })();
                    evt.on(close_button, 'click', hide);
                    evt.on(replay_button, 'click', 
                    function() {
                        _show(false)
                    });
                    container.appendChild(close_button);
                    document.body.insertBefore(replay_button, document.body.firstChild);
                    document.body.insertBefore(back_proxy, document.body.firstChild);
                    observeWindow(function() {
                        var xy = dom.getXY(container);
                        dom.setStyle(replay_button, {
                            left: xy[0] + fodder_width - 3,
                            top: xy[1] + replay_button_offsetY
                        })
                    },
                    0, true);
                    var _show = function(retry) {
                        if (retry) {
                            enter_mutex(show, 0)
                        } else {
                            if (mutex_lock() == 0) {
                                show()
                            }
                        }
                    };
                    setTimeout(function() {
                        _show(true)
                    },
                    display_config.delay * 1000)
                }
            }
        }
    })
})(FlexiBanner); (function(a) {
    var convertor = {
        'string': function(value) {
            return value
        },
        'bool': function(value) {
            if (value.toLowerCase() == 'false') {
                return false
            }
            return true
        },
        'number': function(value) {
            return value - 0
        }
    };
    a.getQueryData = function(mapping) {
        var c = {},
        idx = location.href.indexOf('?');
        if (idx != -1) {
            a.each(location.href.substring(idx + 1).split('&'), 
            function(pair) {
                pair = pair.split('=');
                if (pair[1] != null) {
                    c[pair[0]] = decodeURIComponent(pair[1])
                }
            })
        }
        if (mapping) {
            a.each(mapping, 
            function(type, key) {
                if (c[key] != null) {
                    c[key] = convertor[type](c[key])
                }
            })
        }
        return c
    }
})(FlexiBanner);