---
published: false
---

[Autoprefixer](https://github.com/ai/autoprefixer "Autoprefixer")解析CSS文件并且添加浏览器前缀到CSS规则里，使用[Can I Use](http://www.caniuse.com/ "Can I Use")的数据来决定哪些前缀是需要的。

所有你需要做的就是把它添加到你的资源构建工具（例如 [Grunt](http://www.gruntjs.com/)）并且可以完全忘记有CSS前缀这东西。尽管按照最新的W3C规范来正常书写你的CSS而不需要浏览器前缀。像这样：

    a{
     	transition :transform 1s
	}

Autoprefixer使用一个数据库根据当前浏览器的普及度以及属性支持提供给你前缀：

	a{
	     -webkit-transition :-webkit-transform 1s;
	     transition :-ms-transform 1s;
	     transition :transform 1s
	}


## 问题 ##
当然我们可以手写浏览器前缀，但是这显得乏味以及易错。

我们也可以使用类似[Prefixr](http://prefixr.com/)这样的服务以及编辑器插件，但这仍然乏于跟一堆重复的代码打交道。

我们可以使用象[Compass](http://www.compass-tyle.org/)之于Sass以及[nib](http://visionmedia.github.io/nib/)之于Stylus之类的预处理器提供的mixin库。它们可以解决绝大部分问题，但同时又引入了其他问题。

它们强制我们使用新的语法。它们迭代慢于现代浏览器，所以当稳定版发布时会产生很多不必要的前缀，有时我们需要创建自己的mixins。

Compass实际上并没有为你屏蔽前缀，因为你依然需要决定许多问题，例如：我需要为 border-radius 写一个mixin吗？我需要用逗号分割 +transition 的参数吗？

Lea Verou的[-prefix-free](http://leaverou.github.io/prefixfree/)几乎解决了这个问题，但是使用客户端库并不是个好注意，当你把最终用户性能考虑进去的话。为了防止反复做同样的事情，最好是在资源构建或者项目发布时再构建一次CSS。

## 揭秘 ##
Autoprefixer是一个后处理程序，不象Sass以及Stylus之类的预处理器。它适用于普通的CSS而不使用特定的语法。可以轻松跟Sass以及Stylus集成，由于它在CSS编译后运行。

Autoprefixer基于[Rework](https://github.com/visionmedia/rework)，一个可以用来编写你自己的CSS后处理程序的框架。Rework解析CSS成有用Javascript结构经过你的处理后导回给CSS。

Autoprefixer的每个版本都包含一份最新的 Can I Use 数据：

- 当前浏览器列表以及它们的普及度。
- 新CSS属性，值和选择器前缀列表。

Autoprefixer默认将支持主流浏览器最近2个版本，这点[类似Google](http://support.google.com/a/bin/answer.py?answer=33864)。不过你可以在自己的项目中通过名称或者模式进行选择：

- 主流浏览器最近2个版本用“last 2 versions”；
- 全球统计有超过1%的使用率使用“>1%”;
- 仅新版本用“ff>20”或"ff>=20".

然后Autoprefixer计算哪些前缀是需要的，哪些是已经过期的。

当Autoprefixer添加前缀到你的CSS，还不会忘记修复语法差异。这种方式，CSS是基于最新W3C规范产生：
	
	a {
	     background : linear-gradient(to top, black, white);
	     display : flex
	}
	::placeholder {
	     color : #ccc
	}

编译成：

	a {
	    background : -webkit-linear-gradient(bottom, black, white);
	    background : linear-gradient(to top, black, white);
	    display : -webkit-box;
	    display : -webkit-flex;
	    display : -moz-box;
	    display : -ms-flexbox;
	    display : flex
	}
	:-ms-input-placeholder {
	    color : #ccc
	}
	::-moz-placeholder {
	    color : #ccc
	}
	::-webkit-input-placeholder {
	    color : #ccc
	}
	::placeholder {
	    color : #ccc
	}

Autoprefixer 同样会清理过期的前缀（来自遗留的代码或类似 Bootstrap CSS库），因此下面的代码：

	a {
	    -webkit-border-radius : 5px;
	    border-radius : 5px
	}

编译成：

	a {
	    border-radius : 5px
	}

因为经过Autoprefixer处理，CSS将仅包含实际的浏览器前缀。[Fotorama](http://fotorama.io/)从Compass切换到Autoprefixer之后，CSS大小[减少了](https://twitter.com/fotoramajs/status/362686759944982528)将近20%。

## 演示 ##
如果你还没用过任何工具来自动化构建你的静态资源，一定要尝试下Grunt，我强烈推荐你开始使用构建工具。这将开启你整个语法糖世界，高效的mixin库以及实用的图片处理工具。所有开发者的高效方法用来节约大量精力以及时间（自由选择语言，代码服用，使用第三方库的能力）现将都适用于前端开发人员。

让我们创建一个项目目录以及在style.css中写些简单的CSS：

**style.css**

	a { }

在这个例子中，我们将使用Grunt。首先需要使用npm安装 grunt-autoprefixer ：

	npm install grunt-cli grunt-contrib-watch grunt-autoprefixer

然后我们需要创建 Gruntfile.js 文件以及启用Autoprefixer：

**Gruntfile.js**

	module.exports = function (grunt) {
	     grunt .initConfig ({
	          autoprefixer : {
	               dist : {
	                    files : { 'build/style.css' : 'style.css' } } },
	                    watch : {
	                         styles : {
	                              files : ['style.css' ],
	                              tasks : ['autoprefixer' ]
	                         }
	                    }
	               });
	 
	grunt.loadNpmTasks('grunt-autoprefixer' );
	grunt.loadNpmTasks('grunt-contrib-watch' );};

此配置文件可以让Autoprefixer编译 `style.css` 到 `build/style.css`. 同样我们将用 `grunt-contrib-watch`来监听`style.css`文件变化重新编译`build/style.css`。

启用Grunt的Watch功能：

	./node_modules/.bin/grunt watch

现在我们添加一个CSS3表达式到style.css并保存：

**style.css**

	a {
	     width : calc(50% - 2em)
	}

接下来是见证奇迹的时刻，现在我有了build/style.css文件，Grunt监测到style.css文件发生变化并启用Autoprefixer任务。

Autoprefixer发现了 `calc()` 值单元需要Safari 6的浏览器前缀。

**build/style.css**

	a {
	     width : -webkit-calc(50% - 2em);
	     width : calc(50% - 2em)
	}

我们再添加多一点点复杂的CSS3到style.css并保存：

**style.css**

	a {
	     width : calc(50% - 2em);
	     transition : transform 1s
	}

Autoprefixer已知Chrome，Safari 6以及Opera 15[需要](http://caniuse.com/css-transitions)为 `transition` 及 `transform` 添加前缀。但IE9也需要为 `transform` 添加前缀，作为 `transition` 的值。

**build/style.css**

	a {
	     width : -webkit-calc(1% + 1em);
	     width : calc(1% + 1em);
	     -webkit-transition : -webkit-transform 1s;
	     transition : -ms-transform 1s;
	     transition : transform 1s
	}

Autoprefixer为完成你所有脏活而设计。它会根据Can I Use数据库，写入所有需要的前缀并且同样理解规范之间的区别，欢迎来到未来的CSS3 - 不再有浏览器前缀！


## 下一步？ ##

1. Autoprefixer支持Ruby on Rails，[Middleman](http://middlemanapp.com/)，[Mincer](https://github.com/nodeca/mincer)，Grunt，Sublime Text。了解更多关于如何在你的环境中使用的文档。
2. 如果你的环境还不支持Autoprefixer，[请报告给我](https://github.com/ai/autoprefixer/issues/new)。
3. 关注[@autoprefixer](https://twitter.com/autoprefixer)获得更新以及新特性信息。