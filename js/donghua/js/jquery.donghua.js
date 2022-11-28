 /*
    {
        'xuanzhuan' : {
            'fangxiang'  :  '',             //ni:逆时针  shun:顺时针
            'sulv' : n,                 //速率    1s转多少圈
            'zong' :  3,                //总共转多少圈
        },
        'yansebianhua' : {
            'fangxiang' : '',       //zheng:向右    fan:向左
            'yanse' : [],           //颜色数组
            'sulv' : n              //速率   nms后切换
            'zong' :  3,               //总共切换多少次
        },
        'yidong' : {
            'fangxiang' : '',       //zheng:向右    fan:向左
            'leixing' : [[2,2],[3,3],[4,4]] | y=5*x+3,      //如果是数组则按数组位置移动 否则按函数移动
            'xunhuan' : 3,          //当leixing为数组时，循环次数生效 若为函数 上下左右边界为循环边界
            'sulv' : 1000           //1s多少个像素
         }
    }
*/
;(function($, window, document,undefined) {
    //定义Beautifier的构造函数
    var Dongxi = function(ele, opt) {
        this.$element = ele;
        this.transtion_deg = 0;
        this.defaults = {
            'xuanzhuan' : {},
            'yansebianhua' : {},
            'yidong' : {}
        };
        this.options = $.extend({}, this.defaults, opt);
    };
    //定义Beautifier的方法
    Dongxi.prototype = {
        start : function(){
            if(!$.isEmptyObject(this.options.xuanzhuan)){
                this.xuanzhuan(this.options.xuanzhuan);
            }
            if(!$.isEmptyObject(this.options.yansebianhua)){
                this.yansebianhua(this.options.yansebianhua);
            }
            if(!$.isEmptyObject(this.options.yidong)){
                this.yidong(this.options.yidong);
            }
        },
        xuanzhuan : function(xuanzhuan){
            var fangxiang = xuanzhuan.fangxiang;
            var sulv = xuanzhuan.sulv;
            var zong = xuanzhuan.zong;
            zong_deg = Math.floor(zong * 360);
            var t = Math.floor(zong/sulv*1000);
            var ele = this.$element;
            this.transition(t+"ms");
            if(fangxiang !== undefined && fangxiang == 'ni'){
                this.transtion_deg -= zong_deg;
            }else{
                this.transtion_deg += zong_deg;
            }
            ele.css("transform","rotate("+this.transtion_deg+"deg)");
        },
        yansebianhua : function(yansebianhua){
            var yanse_arr = yansebianhua.yanse;
            if(yanse_arr === undefined || ($.isArray(yanse_arr) && yanse_arr.length ==0) ){
                return false;
            }
            var ele = this.$element;
            var sulv = yansebianhua.sulv ? yansebianhua.sulv : 1000;
            var zong = yansebianhua.zong;
            var fangxiang = yansebianhua.fangxiang ? yansebianhua.fangxiang : 'zheng';
            var yanse_arr_length = yanse_arr.length;
            var index = 0;
            this.$element.css('backgroundColor',yanse_arr[index]);
            var inter = setInterval(function(){
                if(fangxiang === 'fan'){
                    index--;
                    if(index == -1){
                        index = yanse_arr_length -1;
                    }
                }else{
                    index++;
                    if(index == yanse_arr_length){
                        index = 0;
                    }
                }
                ele.css('backgroundColor',yanse_arr[index]);
                if(zong !== undefined){
                    zong --;
                    if(zong === 0){
                        clearInterval(inter);
                    }
                }
            },sulv);
        },
        yidong : function(){
            var fangxiang = this.options.fangxiang;
            var leixing = this.options.leixing;
            var xuanhuan = this.options.xunhuan;
            var sulv = this.options.sulv;
        },
        transition : function(n){
            var attr_str = "all "+n+" linear";
            if(this.options.yansebianhua !== undefined){
                var sulv_str = this.options.yansebianhua.sulv ? this.options.yansebianhua.sulv : 1000;
                attr_str += ",background-color "+sulv_str+'ms';
            }
            this.$element.css({"transition":attr_str,"-moz-transition":attr_str,"-webkit-transition":attr_str,"-o-transition":attr_str});
        }
    };
    //在插件中使用Beautifier对象
    $.fn.donghua = function(options) {
        //创建Beautifier的实体
        var dongxiEle = new Dongxi(this, options);
        //调用其方法
        return dongxiEle;
    };
})(jQuery, window, document);