---
layout: post
title: 当inline-block和text-indent遇到IE6&IE7
---
在做一个按钮时,由于按钮的文字的艺术感太强直接跟背景一起切片,但是处于SEO考虑还是在a标签内添加了相应的文字,

	<p> <a href="file.pdf" class="icon icon-pdf">Download PDF</a> </p>

常规CSS如下:

	.icon { display:inline-block; width:16px; height:16px; text-indent:-9999px; }
	.icon-pdf { background-image:url(pdf.png); }

嗯,在FF,Chrome IE8,XXX主流浏览器下展现得很完美,处于恶心的原因忘记在IE6,7下看了...

嗯,几天后测试跑过来说漂漂的按钮怎么在IE6,7下消失了,当时就惯性的打开浏览器并开启调试工具一通折腾,最后找到解决方案,调整下样式如下:

	.icon { display:block; width:16px; height:16px;text-indent:-9999px; }

或

	.icon { display:inline-block; width:16px; height:16px; font-size:0; line-height:0; }

或者修改你的html如下:

	<p> &nbsp; <a href="file.pdf" class="icon icon-pdf">Download PDF</a> </p>

给a标签前加上&nbsp;等等等方法...

inline或inline-block元素设置text-indent在IE6/IE7中显示不正常的bug致使text-indent会传递到父及元素，也就出现了上文中的结果。

造成这种情况的原因应该是IE6/IE7并没有真正实现inline-block,而是通过设置display:inline-block触发了IE的layout,从而使内联元素拥有了inline-block属性的表症。

考察元素的默认样式，可知：input、select、button、textarea的默认display皆为inline-block,所以在布局时应加以注意...