---
layout: post
title: 通过json让sass与javascript共享数据
categories: 前端开发
tags: [Json, Sass, Javascript, 共享数据]
---
传统样式表能为网站描述大多数表示层。
然而在呈现信息风格一致的方式上Javascript在变得不可缺少，这让媒介保持同步变得麻烦。
数据可视化和基于交互的断点就是最佳的例子，在我最近的项目就无意中有碰到。

我应该注意到这不是一个尚未解决的问题, 实际上已经有[许多](http://css-tricks.com/making-sass-talk-to-javascript-with-json/)[有趣](https://github.com/HugoGiraudel/SassyJSON)的例子应用了该技术。
但是我想要一个简单的解决方案,并一直想写一个Sass插件。

好奇心的结果就催生出了[`sass-json-vars`](https://github.com/vigetlabs/sass-json-vars)。
引入项目中后，该gem允许 `@import` 有效路径的 `JSON` 文件，并将顶层的值转换成Sass数据类型（strings, maps, lists）。

##使用

考虑下面的JSON代码片段 (为简便起见有删减):

    {
        "colors": {
            "red"  : "#c33",
            "blue" : "#33c"
        },

        "breakpoints": {
            "landscape" : "only screen and (orientation : landscape)",
            "portrait"  : "only screen and (orientation : portrait)"
        }
    }


任何时候当一个 `JSON` 文件被 `@import` 引入 [`sass-json-vars`](https://github.com/vigetlabs/sass-json-vars) 会把顶层键作为值公开出来。

    @import "variables.json";

    .element {
        color: map-get($colors, red);
        width: 75%;

        @media (map-get($breakpoints, portrait) {
            width: 100%;
        }
    }

同样的，这些值也可以被Javascript访问，使用类似[CommonJS](http://wiki.commonjs.org/wiki/CommonJS)的模块系统及[browserify](http://browserify.org/)。
例如，如果我们需要确定当前浏览器的定位是横屏：

    var breakpoints = require("./variables.json").breakpoints;

    // https://developer.mozilla.org/en-US/docs/Web/API/Window.matchMedia
    var isLandscape  = matchMedia(breakpoints.landscape).matches;

    if (isLandscape) {
        // do something in landscape mode
    }

##集成

跟[sass-globbing](https://github.com/chriseppstein/sass-globbing)或者其他插件一样 [`sass-json-vars`](https://github.com/vigetlabs/sass-json-vars) 引入并给 `@import` 添加功能。可作为Gemfile的一个依赖引入：

    gem sass-json-vars

或用在Rails里:

    group :assets do
        gem sass-json-vars
    end

当 [`sass-json-vars`](https://github.com/vigetlabs/sass-json-vars) 与Ruby on Rails的asset pipeline一起使用时，将被自动处理。

##最终畅想

[`sass-json-vars`](https://github.com/vigetlabs/sass-json-vars) 支持Sass提供的所有数据类型。可以用于为断点Sass插件描述媒体查询，或存储[IcoMoon](http://icomoon.io/)生成的图标特殊字符。
从Github上[签出该库](https://github.com/vigetlabs/sass-json-vars),随意评论你是如何使用它的！

## 原文 ##
[http://viget.com/extend/sharing-data-between-sass-and-javascript-with-json](http://viget.com/extend/sharing-data-between-sass-and-javascript-with-json)