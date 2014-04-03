---
layout: post
title: 当head遇上runat=server之后发生的纠结之事
categories: [前端开发]
tags: [asp.net, 代码格式化]
---
关于这个问题网上很少有说到,本早想写一篇文章来记录,搁浅了挺久,其实在第一天写asp.net程序时问题就诞生了,但是在上次项目之前做项目都没有在意,甚至是注意它,其实也算是可以忽略掉的,碰巧上次项目正与它纠结上了,为了不影响项目导致大面积的修改尝试了很多方法,请教了很多人,google了n遍,最后在项目上线之后一段时间才得以解决,心中大快,跟大家分享...

或许很多人也一样没有在意甚至注意这个问题吧,我们在Visual Studio中新建一个.aspx或者.master页面时,html中的title标签默认是加上runat="server"的,为什么会加?当然是aspx页面模版文件本身就有这个属性的,也正是因为加了才能享受到asp.net特性带来的便利(在服务器端进行处理,比如asp.net4.0下MetaDescription，MetaKeywords的特性等),但便利的同时也出现了一些小小的瑕疵。

下图为页面head标签不加runat="server"运行之后的效果,很整洁的按照我想要的格式输出了：

![](/public/img/r_1.jpg)

但是给它加上runat="server"运行之后,却变成了如下图的效果:

![](/public/img/r_2.jpg)

也许你会说这也没什么啊,完全没啥影响,我喜欢紧凑的感觉...

起初我也是这样认为,但是每次查看页面源代码的时候越看越觉得它不顺眼,觉得它丑陋不堪,违背了我的意愿,为什么好好的代码,格式不受我控制,加之领导说"你这个title换行是会影响SEO的啊,这个你注意下啊",这里暂时先不讨论它是否真会影响SEO,既然领导也提出来了,可想而知,越来越纠结,必须得解决它,[cnblogs提问](http://space.cnblogs.com/q/17105/),未解,google了n遍,未解,但是在园子里[玉开](http://www.cnblogs.com/yukaizhao/)的[这篇文章](http://www.cnblogs.com/yukaizhao/archive/2010/05/18/asp_net_40_seo_enhancement_new_feature.html#1868299)中找到了些线索,在这里非常感谢他的指引,虽然当时给了[建议](http://www.cnblogs.com/yukaizhao/archive/2010/05/18/asp_net_40_seo_enhancement_new_feature.html#1870316)，但是出于本人对asp.net也只是浅尝辄止的程度所以当时没能解决问题,于是搁浅了段时间.有天在优化网站的时候,查看网页的源代码又发现了它,真是冤家路窄的感觉,于是又开始google,带着[玉开](http://www.cnblogs.com/yukaizhao/)给我的`ControlAdapter`终于还是发现一个跟我同样纠结的哥们,当然问题也得到了解决...下面给出解决方案以及demo下载:

示例解决方案图如下:

![](/public/img/2011021011274241.jpg)

`WithoutRunatServer.aspx`页面是正常页面只做对比用，详细代码请下载demo查看

`WithRunatServer.aspx`代码如下:

	<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="WithRunatServer.aspx.cs"
	  Inherits="Web.WithRunatServer" %>
	<!doctype html>
	<html>
	<head runat="server">
	    <meta http-equiv="Content-Type" content="text/html;charset=utf-8" />
	    <meta content="IE=8" http-equiv="X-UA-Compatible" />
	    <title>Head With Runat Server</title>
	    <meta name="keywords" content="Head With Runat Server" />
	    <meta name="description" content="Head With Runat Server" />
	    <link href="c1.css" type="text/css" />
	    <link href="c2.css" type="text/css" />
	    <link href="c3.css" type="text/css" />
	    <script src="j1.js"></script>
	    <script src="j2.js"></script>
	    <script src="j3.js"></script>
	</head>
	<body>
	    <h1>Head With Runat Server</h1>
	</body>
	</html>

注意`head`标签是`runat="server"`的,不加处理运行页面得到源代码如下图效果:

![](/public/img/2011021011214693.jpg)

格式非常混乱,看起来头皮非常发麻,有时调试页面的时候看到乱七八糟的代码会非常没心情,接下来讲关键部分,`BaseControlAdapter.cs`文件代码如下

	using System;
	using System.Globalization;
	using System.Web.UI;
	using System.Web.UI.HtmlControls;
	
	namespace Adapter
	{
	    public class HtmlHeadAdapter : System.Web.UI.Adapters.ControlAdapter
	    {
	        protected override void Render(HtmlTextWriter writer)
	        {
	            writer.WriteLine("<head>");
	            RenderChildren(writer);
	            writer.Write("</head>");
	        }
	
	        protected override void OnPreRender(EventArgs e)
	        {
	            bool hasTitle = false;
	            foreach (Control cntrl in this.Control.Controls)
	            {
	                if (cntrl is HtmlTitle)
	                {
	                    hasTitle = true;
	                    break;
	                }
	            }
	            if (!hasTitle)
	            {
	                HtmlTitle ht = new HtmlTitle();
	                ht.Text = Page.Title;
	                Control.Controls.Add(ht);
	            }
	            base.OnPreRender(e);
	        }
	    }
	
	    public class HtmlTitleAdapter : System.Web.UI.Adapters.ControlAdapter
	    {
	        protected override void Render(HtmlTextWriter writer)
	        {
	            HtmlTitle htmlTitle = (HtmlTitle)this.Control;
	            //writer.Indent = 1;//控制标签开始处缩进
	            writer.Write("<title>");
	            writer.Write(htmlTitle.Text);
	            writer.WriteLine("</title>");
	        }
	    }
	
	    public class HtmlLinkAdapter : System.Web.UI.Adapters.ControlAdapter
	    {
	        protected override void Render(HtmlTextWriter writer)
	        {
	            AttributeCollection attributes = ((HtmlLink)this.Control).Attributes;
	            if (null != attributes && attributes.Count > 0)
	            {
	                writer.Write("<link");
	                foreach (string key in attributes.Keys)
	                {
	                    writer.Write(" ");
	                    writer.Write(key);
	                    writer.Write("=\"");
	                    if (0 == String.Compare("href", key, true, CultureInfo.InvariantCulture))
	                        writer.Write(this.Control.ResolveUrl(attributes[key]));
	                    else
	                        writer.Write(attributes[key]);
	                    writer.Write("\"");
	                }
	                writer.WriteLine(" />");
	            }
	        }
	    }
	
	    public class HtmlMetaAdapter : System.Web.UI.Adapters.ControlAdapter
	    {
	        protected override void Render(HtmlTextWriter writer)
	        {
	            HtmlMeta metaTag = (HtmlMeta)this.Control;
	            writer.Write("<meta");
	            if (!String.IsNullOrEmpty(metaTag.HttpEquiv))
	            {
	                writer.Write(" http-equiv=\"");
	                writer.Write(metaTag.HttpEquiv);
	            }
	
	            if (!String.IsNullOrEmpty(metaTag.Name))
	            {
	                writer.Write(" name=\"");
	                writer.Write(metaTag.Name);
	            }
	            writer.Write("\" content=\"");
	            writer.Write(metaTag.Content);
	            writer.WriteLine("\" />");
	        }
	    }
	}

`BaseControlAdapter`文件包括了4个分别类是`HtmlHeadAdapter`,`HtmlTitleAdapter`,`HtmlLinkAdapter`,`HtmlMetaAdapter用来处理`<head>`,`<title>`,`<link>`,`<meta>`标签(如果有其他标签要进行处理可以添加相应的类)

可以看到基本上是处理了标签的换行的问题,代码中注释了缩进是因为得到的效果并没有想象中的好,之后再进行尝试

`Adapter`类库准备好了当然得引入到Web项目中去,然后是如何指定上面的类去处理相应的标签呢,这时就要用上`App_Browsers`这个文件夹,新建一个`Default.browser`代码如下:

	<browsers>
	  <browser refID="Default">
	    <controlAdapters>
	      <adapter
	      controlType="System.Web.UI.HtmlControls.HtmlHead"
	      adapterType="Adapter.HtmlHeadAdapter"/>
	      <adapter
	      controlType="System.Web.UI.HtmlControls.HtmlTitle"
	      adapterType="Adapter.HtmlTitleAdapter" />
	      <adapter
	      controlType="System.Web.UI.HtmlControls.HtmlLink"
	      adapterType="Adapter.HtmlLinkAdapter"/>
	      <adapter
	      controlType="System.Web.UI.HtmlControls.HtmlMeta"
	      adapterType="Adapter.HtmlMetaAdapter"/>
	    </controlAdapters>
	  </browser>
	</browsers>

关于`App_Browsers`特殊文件夹以及`.browser`文件的作用可以参考下面连接:

ASP.NET Web Project Folder Structure

[http://msdn.microsoft.com/en-us/library/ex526337.aspx](http://msdn.microsoft.com/en-us/library/ex526337.aspx)

Browser Definition File Schema (browsers Element)

[http://msdn.microsoft.com/en-us/library/ms228122.aspx](http://msdn.microsoft.com/en-us/library/ms228122.aspx)

这样编译整个解决方案并运行`WithRunatServer.aspx`页面发现代码已经整洁很多了

![](/public/img/2011021011481766.jpg)

问题是得到了解决,不过还是发现有一些瑕疵，比如缩进,script等文中没有提到过的标签的处理等,我在实际项目中用了些不优雅的方式进行了处理,由于项目特殊性就不详谈了,希望给同样纠结的童靴一个思路,觉得还行的话给个推荐,存在不对之处请指出,谢谢:)

附上一些参考连接:

[http://www.cnblogs.com/yukaizhao/archive/2010/05/18/asp_net_40_seo_enhancement_new_feature.html](http://www.cnblogs.com/yukaizhao/archive/2010/05/18/asp_net_40_seo_enhancement_new_feature.html)

[http://blogs.x2line.com/al/archive/2007/01/10/2773.aspx](http://blogs.x2line.com/al/archive/2007/01/10/2773.aspx)

[http://blogs.x2line.com/al/archive/2007/01/31/2814.aspx](http://blogs.x2line.com/al/archive/2007/01/31/2814.aspx)

[http://blogs.x2line.com/al/archive/2007/01/31/2816.aspx](http://blogs.x2line.com/al/archive/2007/01/31/2816.aspx)

[http://codebetter.com/blogs/jeff.lynch/archive/2008/05/02/asp-net-quot-head-quot-rendering-issues.aspx](http://codebetter.com/blogs/jeff.lynch/archive/2008/05/02/asp-net-quot-head-quot-rendering-issues.aspx)

附上本文的demo下载:

[http://files.cnblogs.com/aNd1coder/ControlAdapterExample.rar](http://files.cnblogs.com/aNd1coder/ControlAdapterExample.rar)