---
layout: post
title: 归档
published: true
---
<ul class="posts">
    {% for post in site.posts %}
    <li><a href="{{site.baseurl }}{{ post.url }}">{{ post.title }}</a><time class="date" pubdate="{{ post.date | date: "%Y/%m/%d" }}">{{ post.date | date: "%Y/%m/%d" }}</time></li>
    {% endfor %}
</ul>