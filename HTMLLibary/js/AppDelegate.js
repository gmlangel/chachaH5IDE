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
        this.fangxiangPanel = new GMLSprite();
        for(let i = 0 ;i < 4;i++){
            let spr = new GMLSprite();
            spr.name = "fang_" + i;
            spr.makeShape(-20,-20,40,40,0x0f660080,0);
            this.fangxiangPanel.addChild(spr);
            if(i == 0){
                spr.x = -110;
                spr.y = -20;
            }else if(i == 1){
                spr.x = -65;
                spr.y = -65;
            }else if(i == 2){
                spr.x = -20;
                spr.y = -20;
            }else{
                spr.x = -65;
                spr.y = -20;
            }
            spr.addEventListener(GMLMouseEvent.Down,this.fangxiangMouseDown,this)
        }
    }

    /**
     * 启动
     * */
    start(){
        //设置清晰度为2倍屏
        ScreenManager.main.quilaty = 2;

        //启动场景
        this.scene.start();

        //添加动画元件
        this.mc_dog = new GMLImage('./resource/0.png')
        this.scene.addChild(this.mc_dog)

        //添加方向键盘
        this.scene.addChild(this.fangxiangPanel);

        this.fangxiangPanel.x = this.scene.width;
        this.fangxiangPanel.y = this.scene.height;

        this.fangxiangPanel.addEventListener(GMLEvent.EnterFrame,this.bb,this);
    }

    bb(evt){
        console.log(TimeLine.main._currentTimeStep);
    }


    fangxiangMouseDown(evt){
        console.log(evt.gCurrentTarget.name);

        if(evt.gCurrentTarget.name == "fang_0"){
            //向左移动
            this.mc_dog.x -= 5;
        }else if(evt.gCurrentTarget.name == "fang_1"){
            //向上移动
            this.mc_dog.y -= 5;
        }else if(evt.gCurrentTarget.name == "fang_2"){
            //向右移动
            this.mc_dog.x += 5;
        }else if(evt.gCurrentTarget.name == "fang_3"){
            //向下移动
            this.mc_dog.y += 5;
        }
    }



    /**
     * 尺寸变更
     * */
    resize(w,h){
        BaseScene.main.resize(w,h)
        this.fangxiangPanel.x = w;
        this.fangxiangPanel.y = h;
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