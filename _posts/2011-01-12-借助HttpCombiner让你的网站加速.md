---
layout: post
title: 借助HttpCombiner让你的网站加速
---
上一篇 [利用Microsoft Ajax Minifier在服务器端对静态资源进行自动化压缩](http://and1coder.github.io/blog/利用Microsoft-Ajax-Minifier在服务器端对静态资源进行自动化压缩/) 得到不少有意义的交流和建议,最近也在不停的尝试做一些网站优化的工作,我会陆续的写一些或者翻译一些优化方面的文章跟大家交流,一方面提供给有需要的朋友一些参考,另一方面也希望得到高手们的指点。

经过上一篇文章介绍的压缩步骤,我们的资源文件(没指明则特指js，css静态资源文件)已经减肥成功,保持了苗条的身材,这样从服务器端传输到客户端也没那么费劲了,初步获得小成功,但是根据 [雅虎网站页面性能优化的34条黄金守则](http://developer.yahoo.com/performance/rules.html) 提供给我们的建议，让优化工作做得更进一步，比如一个页面引入了4个css文件，5个js文件(这个数目还算过得去，也许还会更多)，这样页面载入的时候就会产生9个请求,加之js加载又是阻塞加载的方式,这样也会造成一定程度上的性能损伤。寻思了一会在网上找到这么一个文件HttpCombiner.ashx，接下来介绍它能帮我们做的事情。

HttpCombiner.ashx是一个http处理程序,通过它能够合并多个CSS,Javascript或者url成为一个响应让页面载入加速.同时它可以合并,压缩并缓存响应，这样就使得我们的应用程序更快的加载和具备更好的扩展性。

## 介绍 ##
用一个大的Javascript或者CSS文件替代多个小体积的Javascript和CSS文件这是一个很好的实践，可以获得更好的可维护性，但是在网站性能方面会产生一定的影响(这里指的是随着文件体积的增大,随之消耗服务器的内存也会增加)。尽管你应该把Javascript代码单独写成小支的文件，CSS文件拆分成小块，但是当浏览器请求这些文件时，会产生同等数量的http请求。每个http请求都会产生一次从你的浏览器到服务器端网络往返过程，并且导致推迟到达服务器端和返回浏览器端的时间，我们称之为延迟。因此，如果你有4个Javascript和3个css文件在页面中被加载，你浪费掉了7次因网络往返过程产生的时间。在美国，延迟平均是70毫秒，这样你就浪费了7*70 = 490毫秒，大致延迟了半秒的时间。在美国之外的国家访问你的页面，平均延迟大约是200毫秒，这意味着你的页面有1400毫秒的时间是在等待中度过。浏览器在你的CSS和Javascript文件完全加载完成之前是不能很好的渲染你的页面的。因此越多的延迟让你的页面载入越慢。

## 延迟导致多大的影响 ##
下图显示每个请求的延迟造成页面加载时显著的延误
![](/public/img/2011011017253813.png)

你可以通过使用CDN加速来减少等待时间，[可阅读此文](http://www.msmvps.com/blogs/omar/archive/2007/10/01/make-your-website-faster-using-content-delivery-network.aspx)关于CDN的使用. 然而,一个更好的解决方案是使用一个HttpHandler来合并多个文件成一个文件一次性输出.因此,你只要将多个`<script>`或者`<link>`标签合并成为一个并将他们指向HttpHandler,指定哪些文件需要作为一次响应传输到浏览器段.这样就减少了请求次数以及消除因其造成的延迟This saves browser from making many requests and eliminates the latency.

![](/public/img/2011011017261523.png)

通过上图你可以看见通过合并多个JavaScripts和CSS文件为一所带来各方面的提升。

在一个电影的web页面中你会看到许多JavaScripts引用

	<script type="text/javascript" src="http://www.msmvps.com/Content/JScript/jquery.js"></script>
	<script type ="text/javascript" src="http://www.msmvps.com/Content/JScript/jDate.js"></script>
	<script type="text/javascript" src="http://www.msmvps.com/Content/JScript/jQuery.Core.js"></script>
	<script type="text/javascript" src="http://www.msmvps.com/Content/JScript/jQuery.Delegate.js"></script>
	<script type="text/javascript" src="http://www.msmvps.com/Content/JScript/jQuery.Validation.js"> </script>

你可以用Http Handler通过scripts的设置来实现将多个单独的`<script>`标签合并成一个:  

	<script type="text/javascript" src="HttpCombiner.ashx?s=jQueryScripts&t=text/javascript&v=1"></script>

HTTP Handler 通过配置文件中设置的名称读取所有文件合并成一次响应传输到客户端,通过gzip压缩响应节省了宽带使用.此外还会生成合适的缓存头来缓存响应的浏览器缓存,因此,浏览器不会再次向服务器发送请求.

在查询字符串中,'s'指明配置文件中的设置名,'t'为文件的内容类型,'v'为版本号.一旦响应被缓存，如果你更改了配置中任何文件，你将不得不增加参数'v'的值来让浏览器再次下载服务器端最新的响应:

	<link type="text/css" rel="stylesheet" href="HttpCombiner.ashx?s=CommonCss&t=text/css&v=1"></link>

在web.config中的设置如下: 

	<appSettings>
	   <add key="jQueryScripts" value="~/Content/JScript/jquery.js,
	            ~/Content/JScript/jDate.js,
	            ~/Content/JScript/jQuery.Core.js,
	            ~/Content/JScript/jQuery.Delegate.js,
	            ~/Content/JScript/jQuery.Validation.js"/>
	   <add key="CommonCss" value="~/App_Themes/Default/Theme.css,
	            ~/Css/Common.css,
	            ~/Controls/Grid/grid.css"/>
	</appSettings>

## 使用HttpCombiner实现一个网站示例 ##

我已经写好一个测试网站来演示如何使用HttpCombiner.网站包含2个CSS和2个JS文件. default.aspx文件中`<link>`和`<script>`标签2个请求都是指向了HttpCombiner.ashx文件.

![](/public/img/2011011017292583.png)

下面就是Default.aspx的内容:

![](/public/img/2011011017295056.png)

就如你所见,页面中`<link>`和`<script>`标签 都同时指向了 HttpCombiner.ashx,并且所带的参数's'就是web.config文件中定义的2组设置 :

![](/public/img/2011011017301531.png)

该处理程序如何工作:

- 首先通过传入的参数"s"获得设置名称
- 然后根据设置名称获得web.config中定义的文件名称(通过特定的分隔符分隔开)
- 读取每单个文件然后存储到缓冲区
- 通过gzip压缩缓冲区中的数据
- 发送压缩后缓冲区中的数据到浏览器端
- 已压缩后缓冲区的数据使用ASP.NET缓存模块缓存起来以便在频繁请求同一个设置的情况下直接访问缓存而不必从文件系统或者外部URL读取文件

该处理程序带来的好处:

- 可以节约因网络延迟造成的时间.如果一次性设置的文件越多,节省的网络延迟性时间越多,同时得到的性能提升就越可观.
- 因为缓存了所有压缩后的响应数据，这样节省了反复执行从文件系统中读取并压缩的步骤，提升了应用程序的伸缩性.

## 如何让HttpHandler工作 ##

首先处理程序会从QueryString中获取setName,contentType,version三个关键参数:

![](/public/img/2011011017304848.png)

如果设置的文件已经被缓存起来，它将直接被写入到缓存当中去，否则它们会从MemoryStream中分别被加载。如果浏览器支持压缩输出的话，MemoryStream会使用GZipStream进行压缩

![](/public/img/2011011017312082.png)

当合并所有文件之后并压缩，合并的二进制流被缓存起来便与频繁的访问可以直接从缓存中读取.

![](/public/img/2011011017314951.png)

GetFileBytes方法主要是根据文件路径或者http url读取文件并返回二进制。因此您可以使用你站点的虚拟路径或者使用外部站点Javascript/CSS的url

![](/public/img/2011011017322044.png)

WriteBytes 方法很巧妙，它会基于二进制流是否为压缩而生成一个合适的header，并设置浏览器缓存头让浏览器缓存服务器端的响应

![](/public/img/2011011017325270.png)

目前发现部署到运行环境中会出现异常(远程主机关闭了连接。错误代码是 0x80072746。),将上面图片中的代码最后2行替换成

	response.Flush();
	if (response.IsClientConnected)
	    response.OutputStream.Write(bytes, 0, bytes.Length);
	response.End();

另外就是注意HttpCombiner.ashx文件建议直接放在跟.js或者.css同一个目录下(排除你的项目有统一的路径处理方案),不然会出现路径引用问题

如何使用该文件:

- 包含HttpCombiner.ashx在你的项目中
- 在你的web.config的<appSettings>定义需要设置的文件节点
- 更改你网站的`<link>`和`<script>`标签指向HttpCombiner.ashx 如下面的格式:
- HttpCombiner.ashx?s=<appSettings里设置的节点名>&t=<文件类型>&v=<版本号>

## 结尾 ##
本文是在优化实际项目中的总结，解决方案源自网上并加以翻译和整理而成，有不当之处或者建议请大家一起讨论。

原文连接：[http://www.codeproject.com/KB/aspnet/HttpCombine.aspx  ](http://www.codeproject.com/KB/aspnet/HttpCombine.aspx  ) [下载示例](http://code.msdn.microsoft.com/HttpCombiner)

补充：

6楼 冰绿茶 提供的[combres组件](http://combres.codeplex.com/)很有价值,比本文提供的解决方案更有参考性,大家可以猛击连接前往围观,博客园也有相关的介绍文章,这里给出几个连接

[http://www.codeproject.com/KB/aspnet/combres2.aspx](http://www.codeproject.com/KB/aspnet/combres2.aspx(codeproject)(codeproject上的原文)

[http://www.cnblogs.com/shanyou/archive/2010/04/03/1703597.html](http://www.cnblogs.com/shanyou/archive/2010/04/03/1703597.html)(本文评论部分也有很多亮点)

[http://www.cnblogs.com/liping13599168/archive/2010/04/04/1704154.html](http://www.cnblogs.com/liping13599168/archive/2010/04/04/1704154.html)(本文对[combres](http://combres.codeplex.com/)部分源码也进行了分析)

7楼 ayumi 分享的另外一个关于image sprite的组件,早之前重典有写博文介绍过,[在ASP.NET中自动合并小图片并使用CSS Sprite显示出来](http://www.cnblogs.com/chsword/archive/2010/08/13/imagesprite_beta_aspnetmvc.html)