---
layout: post
title: SASS实战之RemoteSass插件介绍
---
由于SASS语言本身的强大和灵活，使用SASS可以构建出非常丰富的组件。平时的项目中会封装很多组件，通过mixin的方式来调用，然后组件多了思考着如何能共享这些样式模块了。

通过查阅SASS文档，可以看到其本身是支持很多扩展的，可以通过扩展importer来实现远程导入：

SASS中关于[CUSTOM-IMPORTERS](http://sass-lang.com/docs/yardoc/file.SASS_REFERENCE.html#custom_importers)的描述

>but importers could be added to load from a database, over HTTP, or use a different file naming scheme than what Sass expects.

已经有网友实现了一个简单的gem模块`remote-sass`，由于该插件依赖Compass环境，所以请先准备好，关于Compass部分可以参考[《SASS介绍》](http://goo.gl/VMyISe)，下面直接介绍下如何使用这个模块，

内网安装需要先设置代理

    set http_proxy=http://proxy.ooxx.com:8080/

接下来安装remote-sass模块

    gem install remote-sass

安装成功之后把下面2行配置添加到本机的config.rb

    # import远程scss文件.
    require 'remote-sass'
    RemoteSass.location = "http://static.paipaiimg.com/"

其中`RemoteSass.location`是你需要远程引入的http地址的前缀，同时也作为load-path加入到SASS中。如你在`/path/to/xx/_share.scss`文件中`@import "path/to/oo/a.scss";`在本地都找不到文件后，会去请求`http://path/to/oo/a.scss`.

参考：

[https://gist.github.com/neekey/5660762](https://gist.github.com/neekey/5660762)

[https://github.com/joeellis/remote-sass](https://github.com/joeellis/remote-sass)