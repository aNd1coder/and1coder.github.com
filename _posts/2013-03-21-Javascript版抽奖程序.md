---
layout: post
title: JavaScript版抽奖程序
categories: 前端开发
tags: [Javascript, 抽奖]
---
<link rel="stylesheet" href="/public/css/docs.s.css"/>
<div id="lottery" class="lottery">
    <table class="lottery-box" id="lottery-box">
        <tbody>
        <tr>
            <td id="prize1"></td>
            <td id="prize2"></td>
            <td id="prize3"></td>
            <td id="prize4"></td>
            <td id="prize5"></td>
        </tr>
        <tr>
            <td id="prize6"></td>
            <td></td>
            <td></td>
            <td></td>
            <td id="prize7"></td>
        </tr>
        <tr>
            <td id="prize8"></td>
            <td></td>
            <td></td>
            <td></td>
            <td id="prize9"></td>
        </tr>
        <tr>
            <td id="prize10"></td>
            <td id="prize11"></td>
            <td id="prize12"></td>
            <td id="prize13"></td>
            <td id="prize14"></td>
        </tr>
        </tbody>
    </table>
    <input type="button" id="btn-lottery" class="btn-lottery"/>
</div>
<script src="/public/js/lottery.js"></script>
