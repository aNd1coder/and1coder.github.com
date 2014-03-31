---
layout: post
title: 文章存档
published: true
---
<ul class="posts">
    {% for post in site.posts %}
    <li><a href="{{site.baseurl }}{{ post.url }}">{{ post.title }}</a><span class="date">{{ post.date | date: "%-Y-%m-%d" }}</span></li>
    {% endfor %}
</ul>