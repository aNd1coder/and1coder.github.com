---
layout: post
title: 文章存档
published: true
---
<ul class="posts">
    {% for post in site.posts %}
    <li><a href="{{site.baseurl }}{{ post.url }}">{{ post.title }}</a><span class="date">/{{ post.date | date_to_string }}/</span></li>
    {% endfor %}
</ul>