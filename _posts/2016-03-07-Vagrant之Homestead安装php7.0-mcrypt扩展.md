---
layout: post
title: Vagrant之Homestead安装php7.0-mcrypt扩展
categories: 随笔
tags: [Vagrant, Php, Homestead, Mcrypt]
---
在开发机用 Vagrant 搭建 Homestead 虚拟环境，虚拟机中的 Linux 系统安装的 PHP 版本是 7.0，而且默认是没有安装 php7.0-mcrypt 扩展。经过一番关键词搜索找到一些参考，不过安装过程挺不愉悦的。

```
sudo apt-get update
sudo apt-get install mcrypt php7.0-mcrypt
sudo apt-get upgrade
```

由于虚拟机系统默认的源地址有问题，导致一直卡在 apt-get 安装源配置上，找到这篇出自 [Laracasts](https://www.laracasts.com/) 上的讨论 [mcrypt-php-extension-required](https://www.laracasts.com/discuss/channels/general-discussion/mcrypt-php-extension-required)，刚好就是我遇到的场景，很开心的尝试了下，发现一直报下面的错误

> E: Failed to fetch http://ppa.launchpad.net/ondrej/php-7.0/ubuntu/pool/main/o/openssl/libssl-doc_1.0.2e-1+deb.sury.org~trusty+1_all.deb 404 Not Found [IP: 91.189.95.83 80]

```
    sudo vim /etc/apt/sources.list.d/ondrej-php-7_0-trusty.list
```
   
修改配置为：

```
    deb http://ppa.launchpad.net/ondrej/php/ubuntu trusty main
    # deb http://ppa.launchpad.net/ondrej/php-7.0/ubuntu trusty main
    # deb-src http://ppa.launchpad.net/ondrej/php-7.0/ubuntu trusty main
```

几经周折最终还是安装好了，对于搭建的虚拟环境还是很满意。

