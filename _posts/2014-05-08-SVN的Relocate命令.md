---
layout: post
title: SVN的Relocate命令
categories: 前端开发
tags: [SVN]
---
遇到SVN服务器IP发生变更后，可以运行`svn switch --relocate https://path/to/old_svn/ https://path/to/new_svn/`命令，
或者通过Tortoisesvn客户端的`Relocate`命令轻松切换SVN版本库地址，而不需要重新签出一份全新的文件，版本库文件大的话可以节约不少时间。