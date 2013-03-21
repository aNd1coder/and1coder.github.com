/**
 * @author    : aNd1coder
 * @overview  : 积分抽奖
 * @update    : $Id: lottery.js 1763 2013-01-23 11:19:44Z and1coder $
 */
var Lottery = {
    lotteryWrapper: null,//抽奖容器
    lotteryBox: null,//获取lotteryBox对象
    btnLottery: null,//抽奖按钮
    index: 2,//当前亮区位置
    prevIndex: 0,//前一位置
    lastIndex: 13,//末尾索引
    endIndex: 0,//决定在哪一格变慢
    time: null,//定时器
    speed: 220,//初始速度
    cycle: 0,//转动圈数
    endCycle: 0,//计算圈数
    flag: false,//结束转动标志
    quick: 0,//加速
    quickIndex: 5,//加速
    arr: null,//初始化数组
    prizes: ['1888元投资礼金', 'iPhone5（港行）', '1000分积分值', 'iPad mini',
        '188元投资礼金', 'Surface RT', '10元投资礼金', '888元投资礼金',
        '5000分积分值', '飞利浦剃须刀PT720', '5元投资礼金', '20元投资礼金',
        'iPad4', '2000分积分值'
    ],
    prize: null,//奖品
    score: 0,//积分
    isValid: false,
    /**
     * 初始化
     */
    init: function () {
        var that = this,
            draw = document.getElementById('draw');

        this.lotteryWrapper = document.getElementById("lottery");
        this.lotteryBox = document.getElementById("lottery-box");
        this.btnLottery = document.getElementById('btn-lottery');
        this.arr = this.initMap(4, 5);

        this.btnLottery.onclick = function () {
            var id = that.getRandom(0, 12), name = that.prizes[id];
            //随机奖品
            that.prize = {
                id: id,
                name: name
            };

            that.lotteryWrapper.className = 'lottery disabled';

            that.startLottery();

            this.disabled = true;
            this.className = 'btn-lottery disabled';
        };
    },
    /**
     * 初始化奖品数组
     * @param m         竖
     * @param n         横
     * @return {Array}  奖品数组
     */
    initMap: function (m, n) {
        var arr = [],
            result = [], //礼品格子数组
            x = 0, //纵
            y = 0, //横
            direction = 0,//0:顺时针,1:逆时针
            count = 0;

        //初始化数组
        for (var i = 0; i < m; i++) {
            arr.push([]);
            for (var j = 0; j < n; j++) {
                arr[i][j] = i * n + j;
            }
        }

        //获取礼品格子数组
        while (x >= 0 && x < n && y >= 0 && y < m && count < m * n) {
            count++;
            result.push([y, x]);
            if (direction == 0) {  //顺时针
                if (x == n - 1) {
                    y++;
                } else {
                    x++;
                }

                if (x == n - 1 && y == m - 1) {
                    direction = 1;//逆时针
                }
            }
            else {
                if (x == 0) {
                    y--;
                } else {
                    x--;
                }

                if (x == 0 && y == 0) {
                    break;
                }
            }
        }

        return result;
    },
    /**
     * 获取范围内的随机数
     * @param from
     * @param to
     * @returns {number}
     */
    getRandom: function (from, to) {
        return Math.round(Math.random() * (to - from) + from);
    },
    /**
     * 开始抽奖
     */
    startLottery: function () {
        var _prizeId = this.prize.id,
            _endIndex = _prizeId - 7;//停止前7格开始减速

        clearInterval(this.time);
        _endIndex = _endIndex < 0 ? _prizeId + 7 : (_endIndex == 0 ? 1 : _endIndex);

        this.cycle = 0;
        this.flag = false;
        this.endIndex = _endIndex;
        this.endCycle = this.getRandom(3, 6);//4-7圈
        this.time = setInterval(this.start, this.speed);
    },
    /**
     * 开始启动
     */
    start: function () {
        var that = Lottery,
            currentBox,
            prevBox,
            prize = that.prize;

        //跑马灯变速
        if (that.flag == false) {
            //走N格开始加速
            if (that.quick == that.quickIndex) {
                clearInterval(that.time);
                that.speed = 30;
                that.time = setInterval(that.start, that.speed);
            }
            //跑N圈减速
            if (that.cycle == that.endCycle + 1 && that.index == parseInt(that.endIndex)) {
                clearInterval(that.time);
                that.speed = 180;
                that.flag = true;       //触发结束
                that.time = setInterval(that.start, that.speed);
            }
        }

        if (that.index >= that.arr.length) {
            that.index = 0;
            that.cycle++;
        }

        //结束转动并选中号码
        if (that.flag == true && that.index == prize.id) {

            that.quick = 0;

            clearInterval(that.time);

            setTimeout((function () {
                if (confirm('恭喜您抽中' + prize.name + '，重试？')) {
                    location.reload(true);
                }

                that.btnLottery.disabled = false;
                that.btnLottery.className = 'btn-lottery';

            }), 500);
        }

        currentBox = that.lotteryBox.rows[that.arr[that.index][0]].cells[that.arr[that.index][1]];
        currentBox.className += " hover";

        if (that.index > 0) {
            that.prevIndex = that.index - 1;
        } else {
            that.prevIndex = that.arr.length - 1;
        }

        prevBox = that.lotteryBox.rows[that.arr[that.prevIndex][0]].cells[that.arr[that.prevIndex][1]];
        prevBox.className = prevBox.className.replace(' hover', '');
        that.index++;
        that.quick++;
    }
};
Lottery.init();