/**
 * app主入口
 * Created by guominglong on 2017/12/13.
 */
class AppDelegate{
    static get app(){
        if(!window.app)
            window.app = new AppDelegate();
        return window.app;
    }

    constructor(){
        this.scene = BaseScene.main;
    }

    /**
     * 启动
     * */
    start(){
        //设置清晰度为2倍屏
        ScreenManager.main.quilaty = 2;

        //启动场景
        this.scene.start();

        //测试用
        let spr1 = new GMLSprite();
        spr1.name = "s1"
        spr1.makeShape(0,0,500,500,0x0f660080,0);

        spr1.x = 0;
        spr1.itiwX = spr1.itiwY = 0.5;

        let spr2 = new GMLSprite();
        spr2.name = "s2"
        spr2.makeShape(0,0,100,100,0xff660080,0);
        spr2.x = 120;
        spr2.itiwX = spr2.itiwY = 0.5;

        let spr3 = new GMLSprite();
        spr3.name = "s3"
        spr3.makeShape(0,0,100,100,0x006600ff,0x006600ff);
        spr3.x = 230;
        spr3.itiwX = spr3.itiwY = 0.5;

        this.scene.addChild(spr1)
        this.scene.addChild(spr2)
        this.scene.addChild(spr3)
        function b(evt){
            console.log(evt.gCurrentTarget.name,evt.type);
        }
        function onkd(evt){
            console.log(evt.data.keyCode);
        }



        for(let i=0;i<1;i++)
        {
            let img = new GMLImage("./resource/0.png");

            img.name = "img_" + i;
            img.itiwX = 0.5;
            img.itiwY = 0.5;

            img.x = img.y = 300;
            let sprtt = new GMLSprite()
            sprtt.makeShape(0,0,300,300,0xf500f5,0xf500f5);
            sprtt.x = 300;
            sprtt.y = 300;
            sprtt.itiwX = sprtt.itiwY = 0.5;

            this.scene.addChild(sprtt);
            this.scene.addChild(img);
            ////添加键盘控制的位移动画
            //BaseNotificationCenter.main.addObserver(sprtt,NotifyStruct.onKeyDown,function(evt){
            //    let kecode = evt.keyCode;
            //    switch(kecode){
            //        case 32:sprtt.scaleX = sprtt.scaleY = 1.3;break;
            //        case 37:sprtt.x -= 2;break;
            //        case 39:sprtt.x += 2;break;
            //        case 38:sprtt.y -= 2;break;
            //        case 40:sprtt.y += 2;break;
            //    }
            //});
            //
            //BaseNotificationCenter.main.addObserver(sprtt,NotifyStruct.onKeyUp,function(evt){
            //    let kecode = evt.keyCode;
            //    switch(kecode){
            //        case 32:
            //            sprtt.scaleX = sprtt.scaleY = 1;
            //            break;
            //    }
            //});
        }

        ////当ScreenManager  的 quilaty 不为1的时候, textF._的reCountResultText算法有问题
        //let textF = new GMLStaticTextField()
        ////textF.hasBackground = true;
        ////textF.hasBorder = true;
        ////textF.borderColor = 0xff6600ff;
        ////textF.backgroundColor = 0x0000ffff;
        //textF.fontSize = 20;
        //textF.fontColor = 0xff0000ff;
        //textF.width = 100;
        //textF.height = 25;
        //this._rootSprite.addChild(textF);
        //textF.text = "我是中国人我是中国人我是中国人我是中国人我是中国人";
        //textF.x = 100;
        //textF.y = 150;

        //let tempi = 0
        //let tArr = "我是中国人".split("");
        //setInterval(function(){
        //    textF.text = textF.text + tArr[tempi];
        //    tempi ++;
        //    if(tempi > 4){
        //        tempi = 0;
        //    }
        //},50);

    }


    /**
     * 尺寸变更
     * */
    resize(w,h){
        BaseScene.main.resize(w,h)
    }

    /**
     * 停止
     * */
    stop(){
        BaseScene.main.stop();
    }
}


/**
 * 通知的定义
 * */
class NotifyStruct{
    /**
     * 键盘按下
     * */
    static get onKeyDown(){
        return "NotifyStruct.onKeyDown";
    }

    /**
     * 键盘抬起
     * */
    static get onKeyUp(){
        return "NotifyStruct.onKeyUp";
    }

    /**
     * 鼠标按下
     * */
    static get onMouseDown(){
        return "NotifyStruct.onMouseDown";
    }

    constructor(){

    }
}