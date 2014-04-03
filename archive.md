---
layout: post
title: 文章存档
published: true
---
<div class="posts">
  {% for post in site.posts %}

    {% unless post.next %}
      <h2 class="year">{{ post.date | date: '%Y' }}</h3>
    {% else %}
      {% capture year %}{{ post.date | date: '%Y' }}{% endcapture %}
      {% capture nyear %}{{ post.next.date | date: '%Y' }}{% endcapture %}
      {% if year != nyear %}
        <h2 class="year">{{ post.date | date: '%Y' }}</h3>
      {% endif %}
    {% endunless %}

    <div class="post">
        <a href="{{site.baseurl }}{{ post.url }}">{{ post.title }}</a><span class="category">[{{ post.categories }}]</span>
        <time class="date" pubdate="{{ post.date | date: "%Y年%m月%d日" }}">{{ post.date | date: "%m月%d日" }}</time>
    </div>
  {% endfor %}
</div>