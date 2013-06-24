/**
 * @author : 张旺
 * @function ： 选项卡切换
 * @fileOverview ：基于Jquery插件
 * @description ：选项卡-由两层，一层：点击、移动样式配置;一层是UI_tab的tab实例化应用;
 * @example ：实例化一个tab切换卡   UI_tab("#news");
 * @link ：关联样式文件  UI_tab.css
 * @version ：Mttang-1.1.0
 * @throws : 图片数量以及图片滚动单位异常
 * 
 */
var UI_table = (function () {
	return function (obj,url) {
		return function (pre) {
			var item = $(pre + " " + obj.itemHeader), ct = $(pre + " " + obj.contentHeader);
			$.each($(pre + " " + obj.itemSet), function (i, val) {
				$(this).click(function () {
					item.removeClass(pre + " " + obj.itemClass);
					ct.removeClass(pre + " " + obj.contentClass);
					item = $(this).addClass(pre + " " + obj.itemClass);
					ct = $(pre + " " + obj.contentSet + ':eq(' + i + ')').addClass(pre + " " + obj.contentClass);
				});
			});
		}
	}
})();
var UI_tab = UI_table({//点击、移动样式配置
	itemHeader :".tab-item-current",
	contentHeader :".ui-news-ct-current",
	itemSet : ".ui-news-hd h3 a",
	contentSet : ".ui-news-ct",
	itemClass : "tab-item-current",
	contentClass : "ui-news-ct-current"
});