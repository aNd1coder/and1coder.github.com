---
layout: post
title: PhpStorm中找回Excluded后的目录
categories: [前端开发]
tags: [PhpStorm, CodeIgniter, 无背景图]
---
由于项目采用的CI框架,目录结构分离得也比较清晰,加之项目前后台也规划分离得挺合理,所以在开发过程中完全可以在windows资源管理器下隐藏不相关的目录以及在IDE下排除之( `PhpStorm - File - Make Dicrectory As - Excluded`  ),这样可以在一定程度上减少干扰提高开发效率。如果想将Excluded的目录再Include到项目中可以在 ( `File | Settings | Directories`  )选择对应目录取消掉Excluded即可...