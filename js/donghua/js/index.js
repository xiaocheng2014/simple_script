/**
 * Created by cheng on 2017/7/5.
 */
$(function(){
    var options = {
        "xuanzhuan":{
            "fangxiang":"ni",
            "sulv":0.1,
            "zong":1
        },
        "yansebianhua":{
            "yanse":['blue','red','yellow','pink'],
            "sulv": 1000,
            "zong": 20
        }
    };
    var e =$('.ele').donghua(options);
    e.start();
});
