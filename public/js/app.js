// 阻止Safari连接新开tab问题
// https://gist.github.com/kylebarrow/1042026
if (("standalone" in window.navigator) && window.navigator.standalone) {

    // If you want to prevent remote links in standalone web apps opening Mobile Safari, change 'remotes' to true
    var noddy, remotes = false;

    document.addEventListener('click', function (event) {

        noddy = event.target;

        // Bubble up until we hit link or top HTML element. Warning: BODY element is not compulsory so better to stop on HTML
        while (noddy.nodeName !== "A" && noddy.nodeName !== "HTML") {
            noddy = noddy.parentNode;
        }

        if ('href' in noddy && noddy.href.indexOf('http') !== -1 && (noddy.href.indexOf(document.location.host) !== -1 || remotes)) {
            event.preventDefault();
            document.location.href = noddy.href;
        }

    }, false);
}

$(document).ready(function () {
    $(this).find("pre").not('.prettyprint.linenums').each(function () {
        $(this).addClass("prettyprint linenums");
        prettyPrint();
    });
});

(function (i, s, o, g, r, a, m) {
    i['GoogleAnalyticsObject'] = r;
    i[r] = i[r] || function () {
        (i[r].q = i[r].q || []).push(arguments)
    }, i[r].l = 1 * new Date();
    a = s.createElement(o),
        m = s.getElementsByTagName(o)[0];
    a.async = 1;
    a.src = g;
    m.parentNode.insertBefore(a, m)
})(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');

ga('create', 'UA-49508938-1', 'samgui.com');
ga('send', 'pageview');