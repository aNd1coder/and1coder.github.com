---
layout: post
title: JavaScript版抽奖程序
---
<style>
    html { background-color: #860f1c; }
    table { border-collapse: collapse; border-spacing: 0 }
    .lottery { position: absolute; top: 50%; left: 50%; width: 666px; height: 364px; margin: -182px 0 0 -333px; background: url(/public/img/lottery.png) no-repeat center }
    .lottery.disabled { background: url(/public/img/lottery-disabled.png) no-repeat center }
    .lottery-box { width: 100%; height: 100% }
    .lottery-box td.hover { position: relative; width: 132px; background: url(/public/img/lottery-hover.png) no-repeat }
    .btn-lottery { position: absolute; left: 246px; top: 150px; display: block; width: 190px; height: 50px; border: none; vertical-align: middle; background: url(/public/img/btn-lottery.png) no-repeat 0 -50px; cursor: pointer }
    .btn-lottery:hover { background-position: 0 -100px }
    .btn-lottery.disabled, .btn-lottery.wait, .btn-lottery.end { cursor: default }
    .btn-lottery.disabled { background-position: 0 -150px }
    .btn-lottery.wait { background-position: 0 0 }
    .btn-lottery.end { background-position: 0 -200px }
    #prize1.hover { background-position: 0 0 }
    #prize2.hover { background-position: -133px 0 }
    #prize3.hover { background-position: -266px 0 }
    #prize4.hover { background-position: -399px 0 }
    #prize5.hover { background-position: -532px 0 }
    #prize6.hover { background-position: 0 -91px }
    #prize7.hover { background-position: -532px -91px }
    #prize8.hover { background-position: 0 -182px }
    #prize9.hover { background-position: -532px -182px }
    #prize10.hover { background-position: 0 -273px }
    #prize11.hover { background-position: -133px -273px }
    #prize12.hover { background-position: -266px -273px }
    #prize13.hover { background-position: -399px -273px }
    #prize14.hover { background-position: -532px -273px }
</style>
<div id="lottery" class="lottery">
    <table class="lottery-box" id="lottery-box">
        <tbody>
        <tr>
            <td id="prize1">&nbsp;</td>
            <td id="prize2">&nbsp;</td>
            <td id="prize3">&nbsp;</td>
            <td id="prize4">&nbsp;</td>
            <td id="prize5">&nbsp;</td>
        </tr>
        <tr>
            <td id="prize6">&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td id="prize7">&nbsp;</td>
        </tr>
        <tr>
            <td id="prize8">&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td id="prize9">&nbsp;</td>
        </tr>
        <tr>
            <td id="prize10">&nbsp;</td>
            <td id="prize11">&nbsp;</td>
            <td id="prize12">&nbsp;</td>
            <td id="prize13">&nbsp;</td>
            <td id="prize14">&nbsp;</td>
        </tr>
        </tbody>
    </table>
    <input type="button" id="btn-lottery" class="btn-lottery"/>
</div>
<script src="/public/js/lottery.js"></script>
