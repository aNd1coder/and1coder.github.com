---
layout: post
title: javasript之toString怪异的情况
---
趁找工作这段时间，复习和归纳下一些知识点吧，工作忙的时候没有静下心来好好看书，导致很多问题不求甚解，自然职业道上会遇到各种瓶颈。

看书的过程中突然遇到一些怪异的问题（js里充满各种怪异的问题，进而产生了各种奇淫技巧），比如：

    100['toString']['length']

可以分解为：`100['toString'].length `，由于`toString`是个方法，所以它length属性返回的是`toString`的形参个数，而`toString`方法可以接收一个radix(基数)作为形参（比如：`toString(2)`，返回该数值的二进制，16则代表16进制），所以最终返回结果是1。

刚才上面的`100['toString']['length']`为什么不分解成`100.toString.length`？

这是是由于100后面的.是小数点之后是小数部分，从而导致语法错误。

	1.toString();   //SyntaxError: Unexpected token ILLEGAL
	(1).toString(); //1
	-1 .toString(); //-1

后面2个能得到正常结果是因为大括号和空格起到提升优先级的作用（这里表述有问题），将表达式分成了2部分，从而避免了错误。

参考：
[http://www.dengpeng.org/archives/615](http://www.dengpeng.org/archives/615)

[http://www.dewen.org/q/5356/JS%3A+1.toString++OR++(1).toString](http://www.dewen.org/q/5356/JS%3A+1.toString++OR++(1).toString)

[http://www.qefqei.com/javascript/Function-length](http://www.qefqei.com/javascript/Function-length)
