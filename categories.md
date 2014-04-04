---
layout: post
title: 分类存档
published: true
---
<div class="posts">
    {% for category in site.categories %}
      <h2 class="archive" id="{{ category[0] }}-ref">{{ category[0] | join: "/" }}</h2>
      {% for post in category[1] %}
      <div class="post">
          <a href="{{site.baseurl }}{{ post.url }}">{{ post.title }}</a><span class="category">[{{ post.categories }}]</span>
          <time class="date" pubdate="{{ post.date | date: "%Y年%m月%d日" }}">{{ post.date | date: "%m月%d日" }}</time>
      </div>
      {% endfor %}
    {% endfor %}
</div>