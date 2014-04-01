注意事项:
=========
如目录/文件名有调整需要更新的地方有:
http://d9.oa.com/tools/


在线拼图工具模版数据格式
=======================
/**
 * 模版数据格式
 * @type {{n: string, w: number, h: number, c: string, it: Array}}
 */

var tpl = {
    id:'t',               //模版id
    n: '拍拍首页推广位',   //模版名称
    w: 950,               //画布 width
    h: 500,               //画布 height
    c: 'ffffff',          //画布 bgcolor
    it: [
        {
            w: 120,       //热区 width
            h: 120,       //热区 height
            t: 0,         //热区 top
            l: 0,         //热区 left
            z: 0          //热区 z-index
        }
    ]
};