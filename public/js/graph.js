/*
 *��Ʒ������Դͼ��
 */

~function (window) {
    var rad = Math.PI / 180;

    function forEach(obj, iterator, context) {
        if (obj == null) return
        if (obj.length === +obj.length) {
            for (var i = 0; i < obj.length; i++) {
                if (iterator.call(context || obj[i], obj[i], i, obj) === true) return
            }
        } else {
            for (var k in obj) {
                if (iterator.call(context || obj[k], obj[k], k, obj) === true) return
            }
        }
    }

    function FlowGraph(option) {
        // ��ͼ����
        this.paperWidth = option.paperWidth || 650;
        this.paperHeight = option.paperHeight || 600;

        // ��ͼ����
        this.bottomMapRadius = option.bottomMapRadius || 160;
        this.bottomMapFill = option.bottomMapFill || '#fafafa';
        this.bottomMapCenter = option.bottomMapCenter || {x: this.paperWidth / 2, y: this.paperHeight / 2};

        // ��̨����
        this.data = option.data || {};
        //��ǰ��Դ����
        this.index = this.data.index || 0;

        // ͼ����
        this.elem = option.elem || document.body;

        // ��ɫ
        this.colors = option.colors || [ "#7687ce", "#8975d3", "#f74d7a", "#fa6a01", "#8bc63f", "#29af61"];

        // ��������
        this.paper = Raphael(this.elem, this.paperWidth, this.paperHeight);

        // ��ʼ������
        this.init();
    }

    FlowGraph.prototype = {
        init: function () {
            //��Դȥ��
            this.renderFlow(this.index);
        },

        //��ͼ
        renderBottomMap: function () {
            var x = this.bottomMapCenter.x,
                y = this.bottomMapCenter.y ,
                r = this.bottomMapRadius,
                c1, c2;

            c1 = this.circle(x, y, r, {fill: '#fafafa', stroke: 'none'});
            c2 = this.circle(x, y, r + 15, {fill: 'none', stroke: '#fff', 'stroke-width': 10, 'stroke-opacity': .1});

            c1.mouseover(function () {
                c2.show();
            });

            c2.mouseover(function () {
                c2.hide();
            });

            // ������Ʒ�Ĺ⻷
            this.paper.image('http://static.paipaiimg.com/v5/img/pms/map.png', x - 100, y - 100, 201, 201);

            // ��Դȥ��ָ���
            this.paper.path("M" + x + " 0L" + x + " " + this.paperHeight)
                .attr({'stroke': '#666', 'stroke-dasharray': '.', 'stroke-opacity': .2});

            // ��Դȥ���ı�
            this.paper.text(x - 30, 80, '��Դ').attr({'font': '12px ΢���ź�', fill: '#666'});
            this.paper.text(x + 30, 80, 'ȥ��').attr({'font': '12px ΢���ź�', fill: '#666'});
        },

        /**
         * ����
         * @param index ��ǰ��Դ����
         */
        renderFlow: function (index) {
            var me = this,
                x = this.bottomMapCenter.x,
                y = this.bottomMapCenter.y,
                r = this.bottomMapRadius + 20,
                sources = this.data.sources, dests,
                len = sources.length, total = 0,
                gap = 4, delta = 10, angle = 95, maxangle = 170, color, w, tx = 15,
                ie = $.browser.msie && parseFloat($.browser.version) < 9,
                percent, name, pv,
                sectors = this.paper.set(), names = this.paper.set(),
                pvs = this.paper.set(), percents = this.paper.set(),
                _sectors = this.paper.set(), _names = this.paper.set(),
                _pvs = this.paper.set(), _percents = this.paper.set(),
                cx, cy, cx1, cy1, angleplus, popangle, sector;

            this.paper.clear();

            //������Դ��ռ��
            forEach(sources, function (source, i) {
                total += parseInt(source.percent, 10);
            });

            forEach(sources, function (source, i) {
                var per = parseInt(source.percent, 10);
                //�Ƕ�
                angleplus = (maxangle - (len - 1) * gap) * per / total;
                popangle = angle + (angleplus / 2);

                // ����
                cx = x + (r + delta) * Math.cos(-popangle * rad);
                cy = y + (r + delta) * Math.sin(-popangle * rad);

                // ��Դ����
                color = i == index ? '#0c8de5' : '#ccc';
                sector = this.sector(x, y, r, angle, angle + angleplus, { fill: color, stroke: 'none' }).attr('cursor', 'pointer');
                sectors.push(sector);

                //������ԴTOP�б�
                (function (r, i) {
                    sector.click(function () {
                        //���»���ԲȦͼ
                        me.data.index = i;
                        var data = me.data,
                            holder = $("#holder"),
                            option = {
                                elem: holder[0],
                                data: data
                            }

                        //��ջ�ͼ���򣬱����ۼӻ�������ͼ
                        holder.html('');
                        new FlowGraph(option);
                    });
                })(this, i);

                // ��Դ�ı�
                name = this.paper.text(cx, cy, source.name)
                    .attr({ font: '12px ΢���ź�', fill: i == index ? '#464646' : '#999', 'text-anchor': 'end' })
                    .transform('t-10,0');
                names.push(name);

                if (i == index) {
                    cx1 = x + (r - 20) * Math.cos(-popangle * rad);
                    cy1 = y + (r - 20) * Math.sin(-popangle * rad);

                    name.show();

                    // ��Դռ��
                    percent = this.paper.text(cx, cy, source.percent)
                        .attr({ font: ie ? '35px s' : '45px webfont', fill: '#464646', 'text-anchor': 'end'})
                        .transform('t-10,28');
                    percents.push(percent);

                    w = percent.getBBox().width;

                    // ��Դpv
                    pv = this.paper.text(cx, cy, source.pv)
                        .attr({ font: '12px ΢���ź�', fill: '#999', 'text-anchor': 'end'})
                        .transform('t-' + (w + tx + (ie ? -15 : 0)) + ',32');
                    pvs.push(pv);
                }

                dests = source.dests;

                // ȥ��
                var _len = dests.length, _total = 0,
                    _w , _cx, _cy, _tx = 18, _ty,
                    _attr = {font: '12px ΢���ź�', 'text-anchor': 'start'},
                    _angle = -85, _delta = 0, _angleplus, _popangle,
                    _sector, _percent, _name, _pv;

                if (i == index) {
                    //����ȥ����ռ��
                    forEach(dests, function (dest, d) {
                        _total += parseInt(dest.percent, 10);
                    });

                    forEach(dests, function (dest, j) {

                        // �Ƕ�
                        _angleplus = (maxangle - (_len - 1) * gap) * parseInt(dest.percent, 10) / _total;
                        _popangle = _angle + (_angleplus / 2);

                        // ����
                        _cx = x + (r + _delta ) * Math.cos(-_popangle * rad);
                        _cy = y + (r + _delta ) * Math.sin(-_popangle * rad);

                        // ȥ������
                        _sector = this.sector(x, y, r, _angle, _angle + _angleplus, { fill: this.colors[j], stroke: 'none' });
                        _sectors.push(_sector);

                        //������λȥ���λ�÷�ֹ��סɫ������
                        if (j == 0) {
                            _ty = 5;
                        } else if (j == _len - 1) {
                            _ty = -25;
                        } else {
                            _ty = -10;
                        }

                        // ȥ���ı�
                        _name = this.paper.text(_cx, _cy, dest.name)
                            .attr(_attr).attr({ fill: '#464646'})
                            .transform('t' + _tx + ',' + (_ty));
                        _names.push(_name);

                        // ռ��
                        _percent = this.paper.text(_cx, _cy, dest.percent)
                            .attr({font: ie ? '25px s' : '30px webfont', fill: '#464646', 'text-anchor': 'start'})
                            .transform('t' + _tx + ',' + ((ie ? 20 : 22) + _ty));
                        _w = _percent.getBBox().width;
                        _percents.push(_percent);

                        // pv
                        _pv = this.paper.text(_cx, _cy, dest.pv)
                            .attr(_attr).attr({ fill: '#999'})
                            .transform('t' + (_w + (ie ? -5 : 5) + _tx) + ',' + ((ie ? 23 : 25) + _ty));
                        _pvs.push(_pv);

                        //��������5%������
                        if (parseInt(dest.percent) < 5) {
                            _name.hide();
                            _percent.hide();
                            _pv.hide();

                            //hoverʱ��ʾ����5%������
                            (function (n) {
                                _sectors[n].hover(function () {
                                    _names[n].show().toFront();
                                    _percents[n].show().toFront();
                                    _pvs[n].show().toFront();
                                }, function () {
                                    _names[n].hide();
                                    _percents[n].hide();
                                    _pvs[n].hide();
                                });
                            })(j);
                        }

                        _angle += _angleplus + gap;
                    }, this);
                }

                //�ǵ�ǰ��Դ��ռ������5%���hover��ʾ������
                if (per < 5 && i != index) {
                    name.hide();

                    (function (n) {
                        sectors[n].hover(function () {
                            names[n].show().toFront();
                        }, function () {
                            names[n].hide();
                        });
                    })(i);
                }

                angle += angleplus + gap;
            }, this);

            // ����
            this.renderBottomMap();

            // ��Դ������
            var dot = this.circle(cx1, cy1, 4, { fill: '#0c8de5', stroke: '#ffffff', 'stroke-width': 2 });
            var line = this.paper.path("M" + cx1 + " " + cy1 + "L" + x + " " + y).attr('stroke', '#0c8de5');
            var anim = Raphael.animation({cx: x, cy: y }, 1500, '<>');
            dot.animate(anim.repeat(Infinity));

            // ȥ��������
            var __dests = sources[index].dests,
                __len = __dests.length, __cx, __cy, __angle = -85,
                __angleplus, __popangle, __dot, __line, __anim, __anim1;

            forEach(__dests, function (dest, k) {
                __angleplus = (maxangle - (__len - 1) * gap) * parseInt(dest.percent, 10) / 100;
                __popangle = __angle + (__angleplus / 2);
                __cx = x + (r - 20) * Math.cos(-__popangle * rad);
                __cy = y + (r - 20) * Math.sin(-__popangle * rad);

                __dot = this.circle(x, y, 4, { fill: this.colors[k], stroke: '#ffffff', 'stroke-width': 2 });
                __line = this.paper.path("M" + x + " " + y + "L" + __cx + " " + __cy).attr('stroke', this.colors[k]);
                __anim = Raphael.animation({cx: __cx, cy: __cy}, 1200, '<>');
                __dot.animateWith(__line, {}, __anim.delay(350).repeat(Infinity));
                __angle += __angleplus + gap;
            }, this);

            // �ı�������,��ֹ������
            percent.toFront();
            pv.toFront();
            _names.toFront();
            _pvs.toFront();
            _percents.toFront();
        },

        /**
         * ��Բ
         * @param {Number} cx ���� x
         * @param {Number} cy ���� y
         * @param {Number} r ���ΰ뾶
         * @param {Object} ���ò��� {fill: '#d8d8d8', stroke: 'none'}
         *
         */
        circle: function (x, y, r, option) {
            if (!option.stroke) {
                option.stroke = 'none';
            }
            var c = this.paper.circle(x, y, r);
            c.attr(option);
            return c;
        },

        /**
         * ������
         * @param {Number} cx ���� x
         * @param {Number} cy ���� y
         * @param {Number} r ���ΰ뾶
         * @param {Number} startAngle ��ʼ����
         * @param {Number} endAngle ��������
         * @param {Object} params ���ò���  {fill: '#d8d8d8', stroke: 'none'}
         */
        sector: function (cx, cy, r, startAngle, endAngle, params) {
            var x1 = cx + r * Math.cos(-startAngle * rad)
            var x2 = cx + r * Math.cos(-endAngle * rad)
            var y1 = cy + r * Math.sin(-startAngle * rad)
            var y2 = cy + r * Math.sin(-endAngle * rad)
            var obj = ["M", cx, cy, "L", x1, y1, "A", r, r, 0, +(endAngle - startAngle > 180), 0, x2, y2, "z"]
            return this.paper.path(obj).attr(params)
        },

        /**
         * ����ͼƬ
         * @param {Number} src ͼƬsrc
         * @param {Number} x ���� y
         * @param {Number} y ���ΰ뾶
         * @param {Number} w ��ʼ����
         * @param {Number} h ��������
         * @param {Object} params ���ò���  {fill: '#d8d8d8', stroke: 'none'}
         * @param {Number} trans �任  ��?'r40,t0,10'
         */
        image: function (src, x, y, w, h, option, trans) {
            var img = this.paper.image(src, x, y, w, h)
            img.attr(option)
            img.transform(trans)
            return img
        }
    }

    window.FlowGraph = FlowGraph;
}(this);