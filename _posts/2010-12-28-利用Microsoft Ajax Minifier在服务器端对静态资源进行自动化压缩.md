---
layout: default
title: 利用Microsoft Ajax Minifier在服务器端对静态资源进行自动化压缩
---
<h2>{{ page.title }}</h2>
由于前端展示效果(用户体验)的需要,项目中编写了大量的javascript脚本,一支支庞大的文件对于页面加载性能造成了一定程度的损伤,于是我们会采取文件合并、压缩等方式来减少http请求次数以及压缩文件大小来达到更好的性能优化的效果，目前关于静态资源（主要针对js，css文件）压缩以及相应的第三方辅助工具也不少，象YUI Compressor以及淘宝团队改造后的TBCompressor，Dojo Compressor，JSMin ,圆友自己整合开发的在线压缩：JavaScript(JS) 压缩 / 混淆 / 格式化(美化) 工具算是完美了。等等等， 境界高点的就用Google Closure Compiler，可以达到语法级别的优化，不过对于前端开发的编码规范就更上了一个层次，关于资源压缩一直是前端开发者们对于性能无限追求的一种最佳实践。</p>
<p>由于项目构建在.net框架上，加之配有强大的IDE -- Visual Studio，粗略比较各工具之后最终还是回归到了微软的怀抱，选择了Microsoft-Ajax-Minifier,一是压缩效率跟市面上其他优秀的工具相当，二是可以直接集成在VS中，利用MSBuild在build时进行自动化压缩，只需要稍加配置就可以让项目附带上这个便利的功能。
下面讲下如何部署Microsoft-Ajax-Minifier到实际项目中去:
第一步，下载并安装Microsoft-Ajax-Minifier，前往http://aspnet.codeplex.com/releases/view/40584
第二步，配置Web项目的csproj文件，即在项目解决方案中选择Web项目并右键 > 选择卸载项目 于是当前项目为不可用状态,再次右键并选择编辑 ***.csproj文件,这时IDE窗口已经打开了***.csproj文件,直接拉至文件最底部,在</Project>标签前插入以下代码
<pre>
<Import Project="$(MSBuildExtensionsPath)\Microsoft\MicrosoftAjax\ajaxmin.tasks" />
  <Target Name="AfterBuild">
    <ItemGroup>
      <JS Include="**\WebResources\Default\Scripts\*.js" Exclude="**\*.min.js;" />
    </ItemGroup>
    <ItemGroup>
      <CSS Include="**\WebResources\Default\Styles\*.css" Exclude="**\*.min.css;" />
    </ItemGroup>
    <AjaxMin JsSourceFiles="@(JS)" JsSourceExtensionPattern="\.js$" JsTargetExtension=".min.js"       CssSourceFiles="@(CSS)" CssSourceExtensionPattern="\.css$" CssTargetExtension=".min.css" />
  </Target>
</pre>
需要注意的几点是

 Include属性是需要进行压缩的目录路径并带文件通配符,

Exclude则是不需要进行压缩的文件路径,

WebResources是我根目录下的文件夹，可以根据实际项目进行相应的调整.

AjaxMin节点是压缩的一些参数设置，具体可以参考下面的连接进行更多的设置:

http://www.asp.net/ajaxlibrary/ajaxminquickstart.ashx

当以上工作做好之后就可以进行激动人心的压缩工作了...

刹一脚，要记得把你的Web项目重新加载到解决方案中去，即右键选择已卸载的Web项目 > 重新加载项目即可

最后一部就是编译项目之后回到要进行资源压缩的目录下看是不是多出了很多以.min.**为后缀的文件?对比下压缩下的文件大小一定会让你兴奋不已.这样在项目开发过程中就不需要关心压缩这个步骤了,只需要写你的js和css,最后buid一下,把.min.**文件部署到服务器上就打完收工。

注意一点,如果项目用了源代码管理器则不要把压缩后的文件签入防止因文件被多个进程同时操作导致发生冲突.

 

注册博客挺长时间了,由于没有养成写博的习惯加之不善文字,所以平时自我总结甚少,更多的是以阅读大家的文章吸取知识,无太多心得分享,于是下定决心坚持多多少少记录点,不求文章惊人.只求记录工作学习中感悟,分享,交流.

写之前没有好好构思写得比较潦草,希望对有需要的看官有所帮助，有什么好的意见和想法请评论:)
<p>{{ page.date | date_to_string }}</p>