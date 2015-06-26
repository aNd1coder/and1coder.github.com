---
layout: post
title: Python之PIL库安装
categories: 随笔
tags: [Python, PIL]
---
python在处理jpg时提示“decoder jpeg not available”，搜之原来是PIL安装没有提供对jpeg的支持。

##移除已安装的PIL库
找到```/Library/Frameworks/Python.framework/Versions/2.7/lib/python2.7/site-packages```或者```/Library/Python/2.7/site-packages```目录，删除掉```PIL```目录及```PIL.pth```文件

##依赖库安装：

###jpeg
下载：[http://www.ijg.org/files/jpegsrc.v7.tar.gz](http://www.ijg.org/files/jpegsrc.v7.tar.gz)

    $ cd jpeg-7
    $ ./configure --enable-shared --enable-static
    $ make
    $ sudo make install

###zlib

下载：[http://zlib.net/zlib-1.2.8.tar.gz](http://zlib.net/zlib-1.2.8.tar.gz)

    $ cd zlib-1.2.8    
    $ ./configure  
    $ make  
    $ sudo make install
    
###freetype2

下载：[http://sourceforge.net/projects/freetype/files/freetype2/2.6/freetype-2.6.tar.bz2/download](http://sourceforge.net/projects/freetype/files/freetype2/2.6/freetype-2.6.tar.bz2/download)

###安装PIL

下载：[http://effbot.org/downloads/Imaging-1.1.7.tar.gz](http://effbot.org/downloads/Imaging-1.1.7.tar.gz)

构建 ```python setup.py build_ext -i```

编译安装过程中如遇到如下错误：
```_imagingft.c:73:10: fatal error: 'freetype/fterrors.h' file not found```
只需要执行：

```ln -s /usr/local/include/freetype2 /usr/local/include/freetype```

测试 ```python selftest.py```

安装 ```python setup.py install```

至此就完成了PIL库的安装。

