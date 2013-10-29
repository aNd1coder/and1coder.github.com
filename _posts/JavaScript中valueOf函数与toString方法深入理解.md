---
layout: default
title: JavaScript中valueOf函数与toString方法深入理解
---

基本上，所有JS数据类型都拥有这两个方法，null和undefined除外。它们俩解决javascript值运算与显示的问题。

先看一例：
	var aaa = {
	
	    i:10,
	
	    valueOf:function () {
	        return this.i + 30;
	    },
	
	    toString:function () {
	        return this.valueOf() + 10;
	    }
	
	};
	alert(aaa > 20); // true
	alert(+aaa); // 40
	alert(aaa); // 50

之所以有这样的结果，因为它们偷偷地调用valueOf或toString方法。但如何区分什么情况下是调用了哪个方法呢，我们可以通过另一个方法测试一下。由于用到console.log，请在装有firebug的FF中实验！ 

	var bbb = { 
	    i:10, 
	    toString:function () { 
	        console.log('toString'); 
	        return this.i; 
	    }, 
	    valueOf:function () { 
	        console.log('valueOf'); 
	        return this.i; 
	    } 
	}; 
	alert(bbb);// 10 toString 
	alert(+bbb); // 10 valueOf 
	alert('' + bbb); // 10 valueOf 
	alert(String(bbb)); // 10 toString 
	alert(Number(bbb)); // 10 valueOf 
	alert(bbb == '10'); // true valueOf 
	alert(bbb === '10'); // false 


乍一看结果，大抵给人的感觉是，如果转换为字符串时调用toString方法，如果是转换为数值时则调用valueOf方法，但其中有两个很不和谐。一个是alert(''+bbb)，字符串合拼应该是调用toString方法，另一个我们暂时可以理解为===操作符不进行隐式转换，因此不调用它们。为了追究真相，我们需要更严谨的实验。

	var aa = {
	    i: 10,
	    toString: function() {
	        console.log('toString');
	        return this.i;
	    }
	};
	
	alert(aa);// 10 toString
	alert(+aa); // 10 toString
	alert(''+aa); // 10 toString
	alert(String(aa)); // 10 toString
	alert(Number(aa)); // 10 toString
	alert(aa == '10'); // true toString

再看valueOf：

	var bb = {
	    i: 10,
	    valueOf: function() {
	        console.log('valueOf');
	        return this.i;
	    }
	};
	
	alert(bb);// [object Object]
	alert(+bb); // 10 valueOf
	alert(''+bb); // 10 valueOf
	alert(String(bb)); // [object Object]
	alert(Number(bb)); // 10 valueOf
	alert(bb == '10'); // true valueOf

发现有点不同吧？！它没有像上面toString那样统一规整。对于那个[object Object]，我估计是从Object那里继承过来的，我们再去掉它看看。

	var cc = {
	    i: 10,
	    valueOf: function() {
	        console.log('valueOf');
	        return this.i;
	    }
	};
	
	alert(cc);// 10 valueOf
	alert(+cc); // 10 valueOf
	alert(''+cc); // 10 valueOf
	alert(String(cc)); // 10 valueOf
	alert(Number(cc)); // 10 valueOf
	alert(cc == '10'); // true valueOf

如果只重写了toString，对象转换时会无视valueOf的存在来进行转换。但是，如果只重写了valueOf方法，在要转换为字符串的时候会优先考虑valueOf方法。在不能调用toString的情况下，只能让valueOf上阵了。对于那个奇怪的字符串拼接问题，可能是出于操作符上，翻开ECMA262-5 发现都有一个getValue操作。嗯，那么谜底应该是揭开了。重写会加大它们调用的优化高，而在有操作符的情况 下，valueOf的优先级本来就比toString的高。

参考：
[http://adamlu.googlecode.com/svn/trunk/js_quiz.html](http://adamlu.googlecode.com/svn/trunk/js_quiz.html)

[http://www.jb51.net/article/32327.htm](http://www.jb51.net/article/32327.htm)

[http://www.cnblogs.com/rubylouvre/archive/2010/10/01/1839748.html](http://www.cnblogs.com/rubylouvre/archive/2010/10/01/1839748.html)

[http://www.cnblogs.com/rubylouvre/archive/2010/10/02/1841143.html](http://www.cnblogs.com/rubylouvre/archive/2010/10/02/1841143.html)