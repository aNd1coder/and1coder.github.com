---
layout: post
title: SASS实战之sass-globbing插件
categories: 前端开发
tags: [Sass, globbing, 插件]
---

> Sass globbing allows you to import many sass or scss files in a single import statement.

在该插件出现之前Sass官方是不支持@import整个目录的.scss文件的，实际开发过程中这样的场景还是很常见的，特别是现在大家对模块化开发思想已经深入骨髓，以前大的css文件已经被拆成很多小支的文件并分布在项目各处，
如果需要做合并，只能手工一个文件一个文件的@import，很是苦逼。于是sass-globbing就诞生了，而且是出自大名鼎鼎的[@Chris Eppstein](https://github.com/chriseppstein)，有了该插件，就可以空出一只手干愉快的事情了，使用方法如下：

导入整个目录的文件：

    @import "library/mixins/*"

导入文件树：

    @import "library/**/*"

Globbed文件在导入之前会被按字进行母排序。
Globs文件总是相对于当前文件，使用ruby的glob文件语法，可以阅读[文档](http://ruby-doc.org/core/classes/Dir.html#M000629)来使用它。

## 安装

    $ gem install sass-globbing

## 使用Sass命令行

    $ sass -r sass-globbing --watch sass_dir:css_dir

## 使用Compass

添加如下代码到你的compass配置(config.rb)中

    require 'sass-globbing'

## 引用
[https://github.com/chriseppstein/sass-globbing](https://github.com/chriseppstein/sass-globbing)
