---
layout: post
title: 文章存档
published: true
---
<ul class="posts">
    {% for post in site.posts %}
    <li><span class="date">{{ post.date | date: "%Y/%m/%d" }}</span><a href="{{site.baseurl }}{{ post.url }}">{{ post.title }}</a></li>
    {% endfor %}
</ul>