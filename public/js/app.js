$(function () {
    $("pre").not('.prettyprint.linenums').each(function () {
        $(this).addClass("prettyprint linenums");
        prettyPrint();
    });
});

var cnzz_protocol = (("https:" == document.location.protocol) ? " https://" : " http://");
document.write(unescape("%3Cspan style='display:none;' id='cnzz_stat_icon_1253455174'%3E%3C/span%3E%3Cscript src='" + cnzz_protocol + "v1.cnzz.com/stat.php%3Fid%3D1253455174' type='text/javascript'%3E%3C/script%3E"));