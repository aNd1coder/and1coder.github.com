---
layout: post
title: 在Dreamweaver中象css一样编辑scss文件
categories: 前端开发
tags: [Dreamweaver, CSS, SCSS, 语法高亮]
---
在DW中默认是不支持`.scss`后缀名的文件代码高亮以及代码提示,不过还好Dreamweaver提供了相关的扩展配置

需要调整几个文件(OS:WIN7,DW:5.0)：

找到 `D:\Program Files\Adobe\Adobe Dreamweaver CS5\configuration\Extensions.txt` 
以及 `C:\Users\aNd1coder\AppData\Roaming\Adobe\Dreamweaver CS5\zh_CN\Configuration\Extensions.txt` 

将 `CSS:Style Sheets` 修改为 `CSS,SCSS:Style Sheets`

找到 `D:\Program Files\Adobe\Adobe Dreamweaver CS5\configuration\DocumentTypes\MMDocumentTypes.xml`

搜索CSS并修改CSS部分配置为：

	<documenttype id="CSS" internaltype="Text" winfileextension="css,scss" macfileextension="css,scss" file="Default.css" writebyteordermark="false">
        <TITLE>
            <MMString:loadString id="mmdocumenttypes_30"/>
        </TITLE>
        <description>
            <MMString:loadString id="mmdocumenttypes_31"/>
        </description>
    </documenttype>

最后还有一步就是：

打开Dreamweaver 》编辑 》首选参数 》 文件类型/编辑器 》在代码试图中打开,添加`.scss`后缀名并重启，到这里就全部搞掂...

##参考
[http://tracehello.wordpress.com/2011/03/19/making-dreamweaver-cs5-read-scss-as-css/](http://tracehello.wordpress.com/2011/03/19/making-dreamweaver-cs5-read-scss-as-css/)

[http://www.visual28.com/articles/less-scss-syntax-highlighting-in-dreamweaver](http://www.visual28.com/articles/less-scss-syntax-highlighting-in-dreamweaver)

[http://stackoverflow.com/questions/4830437/working-with-sass-in-adobe-dreamweaver](http://stackoverflow.com/questions/4830437/working-with-sass-in-adobe-dreamweaver)